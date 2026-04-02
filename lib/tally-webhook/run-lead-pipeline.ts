import Anthropic from "@anthropic-ai/sdk"
import { Resend } from "resend"
import type { ContractorProfile } from "@/lib/contractor-redis"
import { resolveContractorForLead } from "@/lib/contractor-redis"
import { isEvmAddress } from "@/lib/evm-address"
import { generateFollowUpMessage, sendConsumerFollowUp } from "@/lib/lead-followup"
import { scoreLead, scoreLabel } from "@/lib/lead-scoring"
import { createLeadRecord, updateLeadStatus } from "@/lib/lead-state"

import { recordLeadProcessed } from "@/lib/lead-stats"

import { tryGetFallbackContractorFromEnv } from "./fallback-contractor"
import {
  extractPressureWashingLeadFromPayload,
  leadEmailBodyWithStructuredFacts,
} from "./pressure-washing-lead-fields"

const DEFAULT_ANTHROPIC_MODEL = "claude-3-5-haiku-20241022"
const DEFAULT_CROSSMINT_API_BASE = "https://www.crossmint.com/api"
const DEFAULT_CROSSMINT_CHAIN = "base"
const USDC_DECIMALS = 6

function parseUsdcToUnits(s: string): bigint {
  const trimmed = s.trim()
  if (!trimmed || trimmed === ".") return BigInt(0)
  const neg = trimmed.startsWith("-")
  const abs = neg ? trimmed.slice(1) : trimmed
  const [wholeRaw, fracRaw = ""] = abs.split(".")
  const whole = wholeRaw.replace(/\D/g, "") || "0"
  const frac = (fracRaw.replace(/\D/g, "") + "0".repeat(USDC_DECIMALS)).slice(0, USDC_DECIMALS)
  const w = BigInt(whole)
  const f = BigInt(frac)
  const scale = BigInt(10 ** USDC_DECIMALS)
  const v = w * scale + f
  return neg ? -v : v
}

function usdcDecimalStringGte(balance: string, fee: string): boolean {
  return parseUsdcToUnits(balance) >= parseUsdcToUnits(fee)
}

function extractUsdcBalance(data: unknown): string | null {
  if (data == null || typeof data !== "object") return null
  const o = data as Record<string, unknown>

  if (typeof o.usdc === "string") return o.usdc
  if (typeof o.usdc === "number" && Number.isFinite(o.usdc)) return String(o.usdc)

  if (Array.isArray(o.balances)) {
    for (const row of o.balances) {
      const inner = extractUsdcBalance(row)
      if (inner != null) return inner
    }
  }

  if (o.tokens && typeof o.tokens === "object") {
    const t = o.tokens as Record<string, unknown>
    if (typeof t.usdc === "string") return t.usdc
  }

  if (o.data != null) return extractUsdcBalance(o.data)

  for (const k of Object.keys(o)) {
    if (k.toLowerCase() === "usdc" && typeof o[k] === "string") return o[k] as string
  }

  return null
}

function tallyResponseId(payload: unknown): string | undefined {
  if (payload == null || typeof payload !== "object") return undefined
  const p = payload as Record<string, unknown>
  const data = p.data
  if (data && typeof data === "object") {
    const id = (data as Record<string, unknown>).responseId
    if (typeof id === "string") return id
  }
  return undefined
}

function crossmintHeaders(): Record<string, string> | null {
  const key = process.env.CROSSMINT_API_KEY
  if (!key) return null
  const h: Record<string, string> = {
    "X-API-KEY": key,
    "Content-Type": "application/json",
  }
  const projectId = process.env.CROSSMINT_PROJECT_ID
  if (projectId) h["x-project-id"] = projectId
  return h
}

function walletLocatorFromEmail(email: string): string {
  return `email:${email}:evm`
}

/** Crossmint `/wallets/...` segment: explicit Creative Bank 0x address when onboarded, else email smart-wallet locator. */
function crossmintWalletPathSegment(contractor: ContractorProfile): string {
  const w = contractor.evmWalletAddress?.trim()
  if (w && isEvmAddress(w)) return w.toLowerCase()
  return walletLocatorFromEmail(contractor.email)
}

async function pinJsonToIpfs(payload: unknown, jwt: string): Promise<string> {
  const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      pinataContent: payload,
      pinataMetadata: { name: "tally-lead" },
    }),
  })
  if (!res.ok) {
    const t = await res.text().catch(() => "")
    throw new Error(`Pinata ${res.status}: ${t.slice(0, 200)}`)
  }
  const data = (await res.json()) as { IpfsHash?: string }
  const cid = data.IpfsHash
  if (!cid) throw new Error("Pinata response missing IpfsHash")
  return cid
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function formatLeadNotificationLineFromTemplate(payload: unknown): string {
  const fields = extractPressureWashingLeadFromPayload(payload)
  const name = [fields.first_name, fields.last_name].filter(Boolean).join(" ").trim()
  const parts = [
    name ? `New Lead: ${name}` : "New Lead",
    fields.services_needed ? `needs ${fields.services_needed}` : null,
    fields.city ? `in ${fields.city}${fields.state ? `, ${fields.state}` : ""}` : null,
    fields.phone ? `— ${fields.phone}` : null,
  ].filter(Boolean)
  return parts.join(" ")
}

async function formatLeadNotificationLine(anthropic: Anthropic | null, payload: unknown): Promise<string> {
  if (!anthropic) return formatLeadNotificationLineFromTemplate(payload)

  const model = process.env.ANTHROPIC_MODEL ?? DEFAULT_ANTHROPIC_MODEL
  const text = JSON.stringify(payload)
  const message = await anthropic.messages.create({
    model,
    max_tokens: 512,
    system:
      "You format CRM leads for a short email notification. Output a single short line only: professional, no markdown, no quotes. " +
      "Include name, service need, city/area if present, and phone if present. Start with 'New Lead: ' when it fits.",
    messages: [
      {
        role: "user",
        content: `Turn this Tally webhook JSON into one notification line under 400 characters:\n\n${text}`,
      },
    ],
  })
  const block = message.content.find((b) => b.type === "text")
  if (!block || block.type !== "text") throw new Error("Claude returned no text")
  let line = block.text.trim().split(/\r?\n/)[0] ?? block.text.trim()
  if (line.length > 480) line = line.slice(0, 477) + "..."
  return line
}

/** Uses `RESEND_API_KEY` / `RESEND_FROM`. In production, `RESEND_FROM` must be on a domain verified in Resend (not `onboarding@resend.dev`). */
function getResendConfig() {
  const key = process.env.RESEND_API_KEY?.trim()
  const from = process.env.RESEND_FROM?.trim()
  if (!key) throw new Error("Missing RESEND_API_KEY")
  if (!from) throw new Error("Missing RESEND_FROM (verified sender; production: your domain in Resend)")
  return { resend: new Resend(key), from }
}

async function sendLeadEmail(
  resend: Resend,
  from: string,
  to: string,
  subject: string,
  bodyText: string,
): Promise<void> {
  const html = `<p style="white-space:pre-wrap">${escapeHtml(bodyText)}</p>`
  const { error } = await resend.emails.send({ from, to, subject, html })
  if (error) throw new Error(error.message)
}

/** Attempts to send a pipeline failure alert to ADMIN_EMAIL. Best-effort; logs on failure. */
async function sendPipelineFailureAlert(
  step: string,
  error: unknown,
  responseId: string | undefined,
  zip: string | null,
  contractorEmail: string | null,
): Promise<void> {
  try {
    const { resend, from: resendFrom } = getResendConfig()
    const adminEmail = process.env.ADMIN_EMAIL?.trim()
    if (!adminEmail) {
      console.error("[tally-webhook] cannot send failure alert: ADMIN_EMAIL not set")
      return
    }
    const errMsg = error instanceof Error ? error.message : String(error)
    const details = [
      `Step: ${step}`,
      `Error: ${errMsg}`,
      responseId ? `Tally Response ID: ${responseId}` : null,
      zip ? `ZIP: ${zip}` : null,
      contractorEmail ? `Contractor: ${contractorEmail}` : null,
      `Time: ${new Date().toISOString()}`,
    ]
      .filter(Boolean)
      .join("\n")
    await sendLeadEmail(
      resend,
      resendFrom,
      adminEmail,
      `Pressure Leads: pipeline failure at "${step}"`,
      `PIPELINE FAILURE — A lead could not be processed. Manual intervention required.\n\n${details}`,
    )
  } catch (alertErr) {
    console.error("[tally-webhook] failed to send failure alert email", alertErr)
  }
}

/**
 * Full lead processing after Tally returns 200.
 * On failure, sends an alert email to ADMIN_EMAIL with the failure step and lead details.
 * See `docs/LEAD_PIPELINE.md` for Pinata IPFS vs Agents, Crossmint, and optional Redis lead stats.
 */
export async function runLeadPipeline(payload: unknown): Promise<void> {
  const responseId = tallyResponseId(payload)
  const fallback = tryGetFallbackContractorFromEnv()
  if (!fallback) console.info("[tally-webhook] fallback contractor not configured; leads without ZIP match route to admin")
  let currentStep = "contractor-resolution"
  let zip: string | null = null
  let contractorEmail: string | null = null

  try {
    const { resend, from: resendFrom } = getResendConfig()
    const adminEmail = process.env.ADMIN_EMAIL!.trim()

    // Resolve contractor — if no fallback configured, ZIP-matched contractors still work;
    // unmatched leads route to admin below.
    const resolved = fallback
      ? await resolveContractorForLead(payload, { email: fallback.email, phoneE164: fallback.phoneE164 })
      : await resolveContractorForLead(payload, { email: adminEmail, phoneE164: "" })
    const contractor = resolved.contractor
    zip = resolved.zip
    contractorEmail = contractor.email
    const isAdminFallback = !fallback && contractor.source === "default"
    console.info("[tally-webhook] contractor", { source: contractor.source, isAdminFallback, zip, responseId })

    const pinataJwt = process.env.PINATA_JWT!

    const anthropicKey = process.env.ANTHROPIC_API_KEY?.trim()
    const anthropic = anthropicKey ? new Anthropic({ apiKey: anthropicKey }) : null
    if (!anthropic) console.info("[tally-webhook] ANTHROPIC_API_KEY not set; using template fallbacks")

    currentStep = "ipfs-pinning"
    const ipfsCid = await pinJsonToIpfs(payload, pinataJwt)
    console.info("[tally-webhook] pinned", { ipfsCid, responseId })

    currentStep = "claude-summarization"
    const leadSummary = await formatLeadNotificationLine(anthropic, payload)

    // --- Lead scoring & state ---
    currentStep = "lead-scoring"
    const leadFields = extractPressureWashingLeadFromPayload(payload)
    const leadScore = scoreLead(leadFields)
    const leadScoreTag = scoreLabel(leadScore)
    console.info("[tally-webhook] scored", { score: leadScore, label: leadScoreTag, responseId })

    currentStep = "lead-state-create"
    const leadId = await createLeadRecord({
      score: leadScore,
      consumerEmail: leadFields.email,
      zip: zip ?? undefined,
      contractorEmail: contractor.email,
      responseId,
      leadData: leadFields,
    })

    // --- Consumer follow-up email (best-effort) ---
    if (leadFields.email) {
      currentStep = "consumer-followup"
      try {
        const followUpBody = await generateFollowUpMessage(anthropic, leadFields)
        await sendConsumerFollowUp({
          resend,
          from: resendFrom,
          consumerEmail: leadFields.email,
          consumerName: leadFields.first_name,
          followUpBody,
        })
        await updateLeadStatus(leadId, "contacted")
        console.info("[tally-webhook] consumer follow-up sent", { leadId, consumerEmail: leadFields.email })
      } catch (followUpErr) {
        // Best-effort: log but don't fail the pipeline
        console.error("[tally-webhook] consumer follow-up failed (non-fatal)", followUpErr)
      }
    }

    // Include lead score in contractor email body
    const scoreHeader = `Lead Score: ${leadScore}/10 (${leadScoreTag})\n`
    const leadEmailBody = scoreHeader + leadEmailBodyWithStructuredFacts(leadSummary, payload)

    // --- Payment via Crossmint (optional — degrades to admin routing when unconfigured) ---
    const crossmintHdrs = crossmintHeaders()
    const leadFee = process.env.LEAD_FEE_USDC?.trim()
    const treasury = process.env.TREASURY_WALLET_ADDRESS?.trim()
    const crossmintConfigured = !!(crossmintHdrs && leadFee && treasury)

    if (!crossmintConfigured || isAdminFallback) {
      // Route to admin when payment infra or contractor is not configured
      currentStep = "admin-email-manual-routing"
      const reasons: string[] = []
      if (!crossmintHdrs) reasons.push("CROSSMINT_API_KEY not set")
      if (!leadFee) reasons.push("LEAD_FEE_USDC not set")
      if (!treasury) reasons.push("TREASURY_WALLET_ADDRESS not set")
      if (isAdminFallback) reasons.push("no contractor match and no fallback configured")
      const reasonStr = reasons.join("; ")
      console.info("[tally-webhook] skipping payment, routing to admin", { reasons: reasonStr, responseId })
      const manualText = `MANUAL ROUTING REQUIRED (${reasonStr}).\n${leadEmailBody}`
      await sendLeadEmail(resend, resendFrom, adminEmail, "Pressure Leads: manual routing required", manualText)
      await recordLeadProcessed(zip)
      console.info("[tally-webhook] done", { responseId, routing: "admin", payment: "skipped", zip })
      return
    }

    const crossmintBase = (process.env.CROSSMINT_API_BASE ?? DEFAULT_CROSSMINT_API_BASE).replace(/\/$/, "")
    const chain = (process.env.CROSSMINT_CHAIN ?? DEFAULT_CROSSMINT_CHAIN).trim()
    const tokenLocator = `${chain}:usdc`
    const walletSeg = crossmintWalletPathSegment(contractor)
    const encodedWallet = encodeURIComponent(walletSeg)

    currentStep = "crossmint-balance-check"
    const balanceUrl = `${crossmintBase}/2025-06-09/wallets/${encodedWallet}/balances?tokens=usdc&chains=${encodeURIComponent(chain)}`
    const balanceRes = await fetch(balanceUrl, { headers: crossmintHdrs })
    const balanceJson: unknown = await balanceRes.json().catch(() => ({}))
    if (!balanceRes.ok) {
      console.error("[tally-webhook] crossmint balance", balanceRes.status, JSON.stringify(balanceJson).slice(0, 300))
      throw new Error(`Crossmint balance request failed (HTTP ${balanceRes.status})`)
    }

    const balanceStr = extractUsdcBalance(balanceJson)
    if (balanceStr == null) {
      console.error("[tally-webhook] could not parse USDC balance", JSON.stringify(balanceJson).slice(0, 400))
      throw new Error("Could not read USDC balance from Crossmint response")
    }

    const funded = usdcDecimalStringGte(balanceStr, leadFee)

    if (!funded) {
      currentStep = "admin-email-insufficient-funds"
      const manualText = `MANUAL ROUTING REQUIRED: Contractor had insufficient USDC.\n${leadEmailBody}`
      await sendLeadEmail(resend, resendFrom, adminEmail, "Pressure Leads: manual routing (insufficient USDC)", manualText)
      await recordLeadProcessed(zip)
      console.info("[tally-webhook] done", { responseId, routing: "admin", payment: "skipped", zip })
      return
    }

    currentStep = "crossmint-transfer"
    const signer = process.env.CROSSMINT_TRANSFER_SIGNER?.trim() || `email:${contractorEmail}`

    const transferUrl = `${crossmintBase}/2025-06-09/wallets/${encodedWallet}/tokens/${encodeURIComponent(tokenLocator)}/transfers`
    const idempotencyKey = responseId ? `tally-${responseId}` : `tally-${ipfsCid.slice(0, 16)}`

    const transferHeaders: Record<string, string> = {
      ...crossmintHdrs,
      "x-idempotency-key": idempotencyKey,
    }

    const transferRes = await fetch(transferUrl, {
      method: "POST",
      headers: transferHeaders,
      body: JSON.stringify({
        recipient: treasury,
        amount: leadFee,
        signer,
      }),
    })

    const transferJson = (await transferRes.json().catch(() => ({}))) as { status?: string }
    const transferStatus = transferJson?.status

    if (!transferRes.ok) {
      console.error("[tally-webhook] crossmint transfer failed", transferRes.status, JSON.stringify(transferJson).slice(0, 400))
      throw new Error(`Crossmint transfer failed (HTTP ${transferRes.status})`)
    }

    const needsManualApproval =
      transferStatus === "awaiting-approval" ||
      transferStatus === "pending-approval" ||
      transferStatus === "awaiting_signature"

    if (needsManualApproval) {
      currentStep = "admin-email-manual-approval"
      const manualText = `MANUAL ROUTING REQUIRED: Lead fee transfer awaiting signer approval (${transferStatus}).\n${leadEmailBody}`
      await sendLeadEmail(
        resend,
        resendFrom,
        adminEmail,
        `Pressure Leads: manual routing (${transferStatus})`,
        manualText,
      )
      await recordLeadProcessed(zip)
      console.info("[tally-webhook] done", { responseId, routing: "admin", transferStatus, zip })
      return
    }

    currentStep = "contractor-email"
    await sendLeadEmail(resend, resendFrom, contractor.email, "New lead", leadEmailBody)
    await recordLeadProcessed(zip)
    console.info("[tally-webhook] done", { responseId, routing: "contractor", transferStatus, zip })
  } catch (err) {
    console.error("[tally-webhook] pipeline failed", { step: currentStep, responseId, zip }, err)
    await sendPipelineFailureAlert(currentStep, err, responseId, zip, contractorEmail)
    throw err
  }
}
