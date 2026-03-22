import Anthropic from "@anthropic-ai/sdk"
import { Resend } from "resend"
import { resolveContractorForLead } from "@/lib/contractor-redis"

import { getFallbackContractorFromEnv } from "./fallback-contractor"

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

function crossmintHeaders(): Record<string, string> {
  const key = process.env.CROSSMINT_API_KEY
  if (!key) throw new Error("Missing CROSSMINT_API_KEY")
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

async function formatLeadNotificationLine(anthropic: Anthropic, payload: unknown): Promise<string> {
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

/**
 * Full lead processing after Tally returns 200. Errors are logged; use Vercel logs / alerts.
 */
export async function runLeadPipeline(payload: unknown): Promise<void> {
  const responseId = tallyResponseId(payload)
  const fallback = getFallbackContractorFromEnv()

  const { contractor, zip } = await resolveContractorForLead(payload, {
    email: fallback.email,
    phoneE164: fallback.phoneE164,
  })
  console.info("[tally-webhook] contractor", { source: contractor.source, zip, responseId })

  const pinataJwt = process.env.PINATA_JWT!
  const leadFee = process.env.LEAD_FEE_USDC!.trim()
  const treasury = process.env.TREASURY_WALLET_ADDRESS!.trim()
  const crossmintBase = (process.env.CROSSMINT_API_BASE ?? DEFAULT_CROSSMINT_API_BASE).replace(/\/$/, "")
  const chain = (process.env.CROSSMINT_CHAIN ?? DEFAULT_CROSSMINT_CHAIN).trim()
  const tokenLocator = `${chain}:usdc`
  const contractorEmail = contractor.email
  const walletLoc = walletLocatorFromEmail(contractorEmail)
  const encodedWallet = encodeURIComponent(walletLoc)

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

  const ipfsCid = await pinJsonToIpfs(payload, pinataJwt)
  console.info("[tally-webhook] pinned", { ipfsCid, responseId })

  const leadSummary = await formatLeadNotificationLine(anthropic, payload)

  const balanceUrl = `${crossmintBase}/2025-06-09/wallets/${encodedWallet}/balances?tokens=usdc&chains=${encodeURIComponent(chain)}`
  const balanceRes = await fetch(balanceUrl, { headers: crossmintHeaders() })
  const balanceJson: unknown = await balanceRes.json().catch(() => ({}))
  if (!balanceRes.ok) {
    console.error("[tally-webhook] crossmint balance", balanceRes.status, JSON.stringify(balanceJson).slice(0, 300))
    throw new Error("Crossmint balance request failed")
  }

  const balanceStr = extractUsdcBalance(balanceJson)
  if (balanceStr == null) {
    console.error("[tally-webhook] could not parse USDC balance", JSON.stringify(balanceJson).slice(0, 400))
    throw new Error("Could not read USDC balance")
  }

  const funded = usdcDecimalStringGte(balanceStr, leadFee)

  const { resend, from: resendFrom } = getResendConfig()
  const adminEmail = process.env.ADMIN_EMAIL!.trim()

  if (!funded) {
    const manualText = `MANUAL ROUTING REQUIRED: Contractor had insufficient USDC.\n${leadSummary}`
    await sendLeadEmail(resend, resendFrom, adminEmail, "Pressure Leads: manual routing (insufficient USDC)", manualText)
    console.info("[tally-webhook] done", { responseId, routing: "admin", payment: "skipped", zip })
    return
  }

  const signer = process.env.CROSSMINT_TRANSFER_SIGNER?.trim() || `email:${contractorEmail}`

  const transferUrl = `${crossmintBase}/2025-06-09/wallets/${encodedWallet}/tokens/${encodeURIComponent(tokenLocator)}/transfers`
  const idempotencyKey = responseId ? `tally-${responseId}` : `tally-${ipfsCid.slice(0, 16)}`

  const transferHeaders: Record<string, string> = {
    ...crossmintHeaders(),
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
    throw new Error("Crossmint transfer failed")
  }

  const needsManualApproval =
    transferStatus === "awaiting-approval" ||
    transferStatus === "pending-approval" ||
    transferStatus === "awaiting_signature"

  if (needsManualApproval) {
    const manualText = `MANUAL ROUTING REQUIRED: Lead fee transfer awaiting signer approval (${transferStatus}).\n${leadSummary}`
    await sendLeadEmail(
      resend,
      resendFrom,
      adminEmail,
      `Pressure Leads: manual routing (${transferStatus})`,
      manualText,
    )
    console.info("[tally-webhook] done", { responseId, routing: "admin", transferStatus, zip })
    return
  }

  await sendLeadEmail(resend, resendFrom, contractor.email, "New lead", leadSummary)
  console.info("[tally-webhook] done", { responseId, routing: "contractor", transferStatus, zip })
}
