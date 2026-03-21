import { extractZipFromTallyPayload } from "@/lib/tally-payload"
import { getRedis } from "@/lib/redis"

/**
 * Value stored at `contractor:zip:<5-digit>` (JSON string).
 * Example:
 *   SET contractor:zip:32084 '{"email":"pro@example.com","phoneE164":"+19045550199","name":"St. Augustine Pros"}'
 */
export type ContractorProfile = {
  email: string
  /** E.164 */
  phoneE164: string
  /** Optional display name for logs / future SMS templates */
  name?: string
}

const KEY_PREFIX = "contractor:zip:"

export function redisKeyForZip(zip5: string): string {
  return `${KEY_PREFIX}${zip5}`
}

/**
 * Looks up a contractor profile by normalized 5-digit US ZIP.
 * Returns null if Redis is unavailable, key missing, or JSON invalid.
 */
export async function getContractorByZip(zip5: string): Promise<ContractorProfile | null> {
  if (!process.env.REDIS_URL?.trim()) return null

  const key = redisKeyForZip(zip5)
  try {
    const redis = await getRedis()
    const raw = await redis.get(key)
    if (raw == null || raw === "") return null
    const parsed = JSON.parse(raw) as unknown
    if (parsed == null || typeof parsed !== "object") return null
    const o = parsed as Record<string, unknown>
    const email = o.email
    const phoneE164 = o.phoneE164
    if (typeof email !== "string" || typeof phoneE164 !== "string") return null
    const name = o.name
    return {
      email: email.trim(),
      phoneE164: phoneE164.trim(),
      ...(typeof name === "string" && name.trim() ? { name: name.trim() } : {}),
    }
  } catch (e) {
    console.error("[contractor-redis] get failed", key, e)
    return null
  }
}

export type ResolvedContractor = ContractorProfile & { source: "redis" | "default" }

/**
 * Uses Redis `contractor:zip:<5-digit>` when `REDIS_URL` is set and the zip maps to a profile;
 * otherwise falls back to `fallback` (e.g. hardcoded default contractor).
 */
export async function resolveContractorForLead(
  payload: unknown,
  fallback: ContractorProfile,
): Promise<{ contractor: ResolvedContractor; zip: string | null }> {
  const zip = extractZipFromTallyPayload(payload)
  if (zip) {
    const found = await getContractorByZip(zip)
    if (found) {
      return { contractor: { ...found, source: "redis" }, zip }
    }
  }
  return { contractor: { ...fallback, source: "default" }, zip }
}
