import Anthropic from "@anthropic-ai/sdk"
import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

import { verifyAdminBearer } from "@/lib/admin-auth"
import { generateFollowUpMessage, sendConsumerFollowUp } from "@/lib/lead-followup"
import { scoreLead, scoreLabel } from "@/lib/lead-scoring"
import { getLeadRecord, updateLeadStatus } from "@/lib/lead-state"
import type { PressureWashingLeadExtracted } from "@/lib/tally-webhook/pressure-washing-lead-fields"

export const runtime = "nodejs"
export const maxDuration = 60

/**
 * POST /api/lead-followup
 *
 * Triggers a follow-up sequence for a lead. Accepts either:
 * - `{ leadId }` to follow up on an existing lead stored in Redis
 * - `{ lead }` with inline lead fields to score and follow up immediately
 *
 * Requires `ADMIN_API_SECRET` Bearer token.
 */
export async function POST(request: NextRequest) {
  if (!verifyAdminBearer(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const anthropicKey = process.env.ANTHROPIC_API_KEY?.trim()
  const resendKey = process.env.RESEND_API_KEY?.trim()
  const resendFrom = process.env.RESEND_FROM?.trim()
  if (!anthropicKey || !resendKey || !resendFrom) {
    return NextResponse.json(
      { error: "Missing required env: ANTHROPIC_API_KEY, RESEND_API_KEY, or RESEND_FROM" },
      { status: 500 },
    )
  }

  const anthropic = new Anthropic({ apiKey: anthropicKey })
  const resend = new Resend(resendKey)

  // Mode 1: Follow up on existing lead by ID
  const leadId = typeof body.leadId === "string" ? body.leadId.trim() : null
  if (leadId) {
    const record = await getLeadRecord(leadId)
    if (!record) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 })
    }

    if (!record.consumerEmail) {
      return NextResponse.json({ error: "Lead has no consumer email for follow-up" }, { status: 422 })
    }

    // Use full stored lead data when available, fall back to minimal fields
    const lead: PressureWashingLeadExtracted = record.leadData ?? {}
    if (!lead.email && record.consumerEmail) lead.email = record.consumerEmail
    if (!lead.zip && record.zip) lead.zip = record.zip

    try {
      const followUpBody = await generateFollowUpMessage(anthropic, lead)
      await sendConsumerFollowUp({
        resend,
        from: resendFrom,
        consumerEmail: record.consumerEmail,
        followUpBody,
      })
      await updateLeadStatus(leadId, "contacted")

      return NextResponse.json({
        ok: true,
        leadId,
        status: "contacted",
        score: record.score,
        scoreLabel: scoreLabel(record.score),
      })
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      console.error("[lead-followup] failed for lead", leadId, msg)
      return NextResponse.json({ error: `Follow-up failed: ${msg}` }, { status: 500 })
    }
  }

  // Mode 2: Inline lead fields
  const lead = body.lead as PressureWashingLeadExtracted | undefined
  if (!lead || typeof lead !== "object") {
    return NextResponse.json(
      { error: "Request must include `leadId` (string) or `lead` (object with lead fields)" },
      { status: 400 },
    )
  }

  const consumerEmail = lead.email?.trim()
  if (!consumerEmail) {
    return NextResponse.json({ error: "Lead must include an email address" }, { status: 422 })
  }

  const score = scoreLead(lead)

  try {
    const followUpBody = await generateFollowUpMessage(anthropic, lead)
    await sendConsumerFollowUp({
      resend,
      from: resendFrom,
      consumerEmail,
      consumerName: lead.first_name,
      followUpBody,
    })

    return NextResponse.json({
      ok: true,
      score,
      scoreLabel: scoreLabel(score),
      status: "contacted",
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error("[lead-followup] inline follow-up failed", msg)
    return NextResponse.json({ error: `Follow-up failed: ${msg}` }, { status: 500 })
  }
}
