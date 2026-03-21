import { waitUntil } from "@vercel/functions"
import { type NextRequest, NextResponse } from "next/server"

import { getFallbackContractorFromEnv } from "@/lib/tally-webhook/fallback-contractor"
import { runLeadPipeline } from "@/lib/tally-webhook/run-lead-pipeline"
import { SIGNATURE_HEADERS, verifyTallySignature } from "@/lib/tally-webhook/tally-signature"

export const runtime = "nodejs"

/** Vercel / long-running webhook (Pinata, Claude, Crossmint). `waitUntil` runs after the 200 response. */
export const maxDuration = 60

/**
 * Required: `TALLY_WEBHOOK_SECRET`, `PINATA_JWT`, `ANTHROPIC_API_KEY`, `CROSSMINT_API_KEY`,
 * `TWILIO_*`, `ADMIN_PHONE_NUMBER`, `LEAD_FEE_USDC`, `TREASURY_WALLET_ADDRESS`,
 * `CONTRACTOR_FALLBACK_EMAIL`, `CONTRACTOR_FALLBACK_PHONE_E164` (E.164).
 * Optional: `CROSSMINT_PROJECT_ID`, `CROSSMINT_API_BASE`, `CROSSMINT_CHAIN`, `ANTHROPIC_MODEL`,
 * `CROSSMINT_TRANSFER_SIGNER`, Redis zip routing envs (`REDIS_URL`, `TALLY_ZIP_FIELD_*`).
 */

function isEvmAddress(s: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(s.trim())
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

function assertPipelineEnv(): void {
  const required = [
    "PINATA_JWT",
    "ANTHROPIC_API_KEY",
    "CROSSMINT_API_KEY",
    "TWILIO_ACCOUNT_SID",
    "TWILIO_AUTH_TOKEN",
    "TWILIO_PHONE_NUMBER",
    "ADMIN_PHONE_NUMBER",
    "LEAD_FEE_USDC",
    "TREASURY_WALLET_ADDRESS",
  ] as const
  for (const k of required) {
    if (!process.env[k]?.trim()) throw new Error(`Missing required env: ${k}`)
  }
  const treasury = process.env.TREASURY_WALLET_ADDRESS!.trim()
  if (!isEvmAddress(treasury)) throw new Error("TREASURY_WALLET_ADDRESS must be a 0x-prefixed 40-hex address")
  getFallbackContractorFromEnv()
}

export async function POST(request: NextRequest) {
  let rawBody: string
  try {
    rawBody = await request.text()
  } catch (e) {
    console.error("[tally-webhook] read body", e)
    return NextResponse.json({ error: "Bad request" }, { status: 400 })
  }

  const secret = process.env.TALLY_WEBHOOK_SECRET?.trim()
  if (!secret) {
    return NextResponse.json({ error: "Webhook signing not configured" }, { status: 401 })
  }

  const sig = SIGNATURE_HEADERS.map((h) => request.headers.get(h)).find(Boolean) ?? null
  if (!verifyTallySignature(rawBody, sig, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  let payload: unknown
  try {
    payload = rawBody ? JSON.parse(rawBody) : {}
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const responseId = tallyResponseId(payload)
  console.info("[tally-webhook] verified", { responseId })

  try {
    assertPipelineEnv()
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error("[tally-webhook] config", msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }

  const pipeline = runLeadPipeline(payload).catch((err) => {
    console.error("[tally-webhook] pipeline failed", err)
  })
  waitUntil(pipeline)

  return NextResponse.json(
    {
      ok: true,
      accepted: true,
      responseId: responseId ?? null,
      note: "Lead processing runs asynchronously; check logs for Pinata/Crossmint/Twilio results.",
    },
    { status: 200 },
  )
}

export function GET() {
  return new NextResponse(null, { status: 404 })
}
