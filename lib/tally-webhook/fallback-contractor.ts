/**
 * Used when Redis has no contractor for the lead ZIP (or REDIS_URL unset).
 * Must be set in production — no placeholder defaults.
 */
export function getFallbackContractorFromEnv(): { email: string; phoneE164: string } {
  const email = process.env.CONTRACTOR_FALLBACK_EMAIL?.trim()
  const phoneE164 = process.env.CONTRACTOR_FALLBACK_PHONE_E164?.trim()
  if (!email || !phoneE164) {
    throw new Error("Missing CONTRACTOR_FALLBACK_EMAIL or CONTRACTOR_FALLBACK_PHONE_E164")
  }
  if (!/^\+[1-9]\d{1,14}$/.test(phoneE164)) {
    throw new Error("CONTRACTOR_FALLBACK_PHONE_E164 must be E.164 (e.g. +19045550199)")
  }
  return { email, phoneE164 }
}
