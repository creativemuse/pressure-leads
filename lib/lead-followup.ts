import Anthropic from "@anthropic-ai/sdk"
import { Resend } from "resend"

import type { PressureWashingLeadExtracted } from "@/lib/tally-webhook/pressure-washing-lead-fields"

const DEFAULT_ANTHROPIC_MODEL = "claude-3-5-haiku-20241022"

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

/**
 * Uses Claude to generate a personalized, conversational follow-up email
 * for a consumer who just submitted a lead form.
 */
export async function generateFollowUpMessage(
  anthropic: Anthropic,
  lead: PressureWashingLeadExtracted,
): Promise<string> {
  const model = process.env.ANTHROPIC_MODEL ?? DEFAULT_ANTHROPIC_MODEL

  const leadContext = [
    lead.first_name ? `Customer first name: ${lead.first_name}` : null,
    lead.services_needed ? `Services requested: ${lead.services_needed}` : null,
    lead.property_type ? `Property type: ${lead.property_type}` : null,
    lead.service_timing ? `Timing: ${lead.service_timing}` : null,
    lead.city ? `Location: ${lead.city}${lead.state ? `, ${lead.state}` : ""}` : null,
    lead.job_size ? `Job size: ${lead.job_size}` : null,
    lead.dirt_level ? `Surface condition: ${lead.dirt_level}` : null,
    lead.special_notes ? `Customer notes: ${lead.special_notes}` : null,
  ]
    .filter(Boolean)
    .join("\n")

  const message = await anthropic.messages.create({
    model,
    max_tokens: 1024,
    system:
      "You write friendly, professional follow-up emails for a pressure washing lead service. " +
      "The email confirms we received the customer's request, references their specific details to show we're paying attention, " +
      "sets expectations (a local contractor will reach out shortly), and keeps a warm, helpful tone. " +
      "Output ONLY the email body text (no subject line, no greeting prefix like 'Subject:'). " +
      "Start with a greeting using their first name if available. Keep it under 200 words. " +
      "Do not use markdown formatting. Do not include any signatures or company names — those are added separately.",
    messages: [
      {
        role: "user",
        content: `Write a follow-up email for this pressure washing lead:\n\n${leadContext}`,
      },
    ],
  })

  const block = message.content.find((b) => b.type === "text")
  if (!block || block.type !== "text") throw new Error("Claude returned no text for follow-up")
  return block.text.trim()
}

/**
 * Sends a personalized follow-up email to the consumer acknowledging their request.
 */
export async function sendConsumerFollowUp(opts: {
  resend: Resend
  from: string
  consumerEmail: string
  consumerName?: string
  followUpBody: string
}): Promise<void> {
  const { resend, from, consumerEmail, followUpBody } = opts

  const subject = "We received your pressure washing request!"
  const signoff = "\n\nBest regards,\nThe Pressure Leads Team"
  const fullBody = followUpBody + signoff

  const html = `<p style="white-space:pre-wrap">${escapeHtml(fullBody)}</p>`
  const { error } = await resend.emails.send({
    from,
    to: consumerEmail,
    subject,
    html,
  })
  if (error) throw new Error(error.message)
}
