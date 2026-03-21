import { createHmac, timingSafeEqual } from "crypto"

const SIGNATURE_HEADERS = ["tally-signature", "Tally-Signature"] as const

export { SIGNATURE_HEADERS }

function safeEqualStrings(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  return timingSafeEqual(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"))
}

/**
 * Verifies Tally webhook signing secret.
 * Supports:
 * - HMAC-SHA256(raw request body) as lowercase hex (common for raw-body webhooks)
 * - HMAC-SHA256(raw body) as base64
 * - HMAC-SHA256(JSON.stringify(JSON.parse(body))) as base64 (Tally Help Center Express example)
 */
export function verifyTallySignature(rawBody: string, headerValue: string | null, secret: string): boolean {
  if (!headerValue) return false
  const received = headerValue.trim()

  const hex = createHmac("sha256", secret).update(rawBody, "utf8").digest("hex")
  if (safeEqualStrings(hex, received)) return true

  const b64Raw = createHmac("sha256", secret).update(rawBody, "utf8").digest("base64")
  if (safeEqualStrings(b64Raw, received)) return true

  try {
    const canonical = JSON.stringify(JSON.parse(rawBody))
    const b64Canonical = createHmac("sha256", secret).update(canonical, "utf8").digest("base64")
    if (safeEqualStrings(b64Canonical, received)) return true
  } catch {
    // invalid JSON — skip canonical variant
  }

  return false
}
