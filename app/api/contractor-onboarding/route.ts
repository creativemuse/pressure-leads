import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { kv } from "@vercel/kv"

import {
  extractContractorOnboardingFromPayload,
  parseContractorZipCodes,
} from "@/lib/tally-webhook/contractor-onboarding-fields"
import { SIGNATURE_HEADERS, verifyTallySignature } from "@/lib/tally-webhook/tally-signature"

export const runtime = "nodejs"
export const maxDuration = 60

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function getResendConfig() {
  const key = process.env.RESEND_API_KEY?.trim()
  const from = process.env.RESEND_FROM?.trim()
  if (!key) throw new Error("Missing RESEND_API_KEY")
  if (!from) throw new Error("Missing RESEND_FROM (verified sender; production: your domain in Resend)")
  return { resend: new Resend(key), from }
}

const WELCOME_SUBJECT = "Welcome to the Network - Action Required to Get Leads"
const BANK_URL = "https://bank.creativeplatform.xyz"

export async function POST(request: NextRequest) {
  let rawBody: string
  try {
    rawBody = await request.text()
  } catch (e) {
    console.error("[contractor-onboarding] read body", e)
    return NextResponse.json({ error: "Bad request" }, { status: 400 })
  }

  const secret = process.env.CONTRACTOR_ONBOARDING_TALLY_WEBHOOK_SECRET?.trim()
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

  const extracted = extractContractorOnboardingFromPayload(payload)
  if (!extracted.ok) {
    return NextResponse.json({ error: extracted.error }, { status: 400 })
  }

  const {
    company_name,
    email,
    phone,
    zip_codes_raw,
    creative_bank_address,
    first_name,
    last_name,
    job_title,
    country,
  } = extracted.data
  const zips = parseContractorZipCodes(zip_codes_raw)
  if (zips.length === 0) {
    console.warn("[contractor-onboarding] no valid 5-digit US ZIPs in submission", { email })
    return NextResponse.json({ error: "No valid US ZIP codes (need at least 5 digits per area)" }, { status: 400 })
  }

  const profile = {
    company_name,
    crossmint_email: email,
    phone_e164: phone,
    creative_bank_address,
    ...(first_name ? { first_name } : {}),
    ...(last_name ? { last_name } : {}),
    ...(job_title ? { job_title } : {}),
    ...(country ? { country } : {}),
    is_active: true,
    joined_at: Date.now(),
  }
  const profileJson = JSON.stringify(profile)

  try {
    for (const zip of zips) {
      await kv.lpush(`zip:${zip}:contractors`, profileJson)
    }
  } catch (e) {
    console.error("[contractor-onboarding] KV lpush failed", e)
    return NextResponse.json({ error: "Storage error" }, { status: 500 })
  }

  try {
    const { resend, from } = getResendConfig()
    const greet = first_name?.trim() || company_name
    const safeGreet = escapeHtml(greet)
    const html = `<p>Hi ${safeGreet},</p>
<p>Welcome to the network. To activate your account and start receiving automated pressure washing leads, fund your account with USDC.</p>
<p>Log in and top up here: <a href="${BANK_URL}">${escapeHtml(BANK_URL)}</a></p>`
    const { error } = await resend.emails.send({
      from,
      to: email,
      subject: WELCOME_SUBJECT,
      html,
    })
    if (error) throw new Error(error.message)
  } catch (e) {
    console.error("[contractor-onboarding] Resend failed", e)
    return NextResponse.json({ error: "Email delivery failed" }, { status: 500 })
  }

  return NextResponse.json({ ok: true, zipsRegistered: zips.length }, { status: 200 })
}

export function GET() {
  return new NextResponse(null, { status: 404 })
}
