import { kv } from "@vercel/kv"

import { isContractorPaused } from "@/lib/contractor-pause"
import { isEvmAddress } from "@/lib/evm-address"
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
  /** Creative Bank / onboarding 0x address — used for Crossmint balance & transfers when set */
  evmWalletAddress?: string
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
    const walletRaw =
      typeof o.creative_bank_address === "string"
        ? o.creative_bank_address.trim()
        : typeof o.evm_wallet_address === "string"
          ? o.evm_wallet_address.trim()
          : typeof o.evmWalletAddress === "string"
            ? o.evmWalletAddress.trim()
            : ""
    const evmWalletAddress =
      walletRaw && isEvmAddress(walletRaw) ? walletRaw.toLowerCase() : undefined
    return {
      email: email.trim(),
      phoneE164: phoneE164.trim(),
      ...(typeof name === "string" && name.trim() ? { name: name.trim() } : {}),
      ...(evmWalletAddress ? { evmWalletAddress } : {}),
    }
  } catch (e) {
    console.error("[contractor-redis] get failed", key, e)
    return null
  }
}

function contractorProfileFromOnboardingJson(raw: string): ContractorProfile | null {
  try {
    const o = JSON.parse(raw) as Record<string, unknown>
    const email =
      typeof o.crossmint_email === "string"
        ? o.crossmint_email.trim()
        : typeof o.email === "string"
          ? o.email.trim()
          : ""
    const phoneE164 =
      typeof o.phone_e164 === "string"
        ? o.phone_e164.trim()
        : typeof o.phoneE164 === "string"
          ? o.phoneE164.trim()
          : ""
    if (!email || !phoneE164) return null
    const name =
      typeof o.company_name === "string"
        ? o.company_name.trim()
        : typeof o.name === "string"
          ? o.name.trim()
          : ""
    const walletRaw =
      typeof o.creative_bank_address === "string"
        ? o.creative_bank_address.trim()
        : typeof o.evm_wallet_address === "string"
          ? o.evm_wallet_address.trim()
          : ""
    const evmWalletAddress =
      walletRaw && isEvmAddress(walletRaw) ? walletRaw.toLowerCase() : undefined
    return {
      email,
      phoneE164,
      ...(name ? { name } : {}),
      ...(evmWalletAddress ? { evmWalletAddress } : {}),
    }
  } catch {
    return null
  }
}

/**
 * Contractors onboarded via `/api/contractor-onboarding` are stored as JSON strings in
 * Vercel KV list `zip:<5-digit>:contractors`. Picks one entry at random when multiple exist.
 */
export async function pickContractorFromKvZipList(zip5: string): Promise<ContractorProfile | null> {
  const key = `zip:${zip5}:contractors`
  try {
    const members = await kv.lrange(key, 0, -1)
    if (!Array.isArray(members) || members.length === 0) return null
    const profiles: ContractorProfile[] = []
    for (const m of members) {
      if (typeof m !== "string") continue
      const p = contractorProfileFromOnboardingJson(m)
      if (p) profiles.push(p)
    }
    if (profiles.length === 0) return null
    return profiles[Math.floor(Math.random() * profiles.length)]!
  } catch (e) {
    console.error("[contractor-redis] KV list read failed", key, e)
    return null
  }
}

export type ResolvedContractor = ContractorProfile & { source: "kv" | "redis" | "default" }

/**
 * Resolves contractor: KV onboarding list `zip:<zip>:contractors` first, then legacy Redis
 * `contractor:zip:<zip>`, then `fallback`.
 */
export async function resolveContractorForLead(
  payload: unknown,
  fallback: ContractorProfile,
): Promise<{ contractor: ResolvedContractor; zip: string | null }> {
  const zip = extractZipFromTallyPayload(payload)
  let resolved: { contractor: ResolvedContractor; zip: string | null }
  if (zip) {
    const fromKv = await pickContractorFromKvZipList(zip)
    if (fromKv) {
      resolved = { contractor: { ...fromKv, source: "kv" }, zip }
    } else {
      const found = await getContractorByZip(zip)
      if (found) {
        resolved = { contractor: { ...found, source: "redis" }, zip }
      } else {
        resolved = { contractor: { ...fallback, source: "default" }, zip }
      }
    }
  } else {
    resolved = { contractor: { ...fallback, source: "default" }, zip }
  }

  if (resolved.contractor.source !== "default" && (await isContractorPaused(resolved.contractor.email))) {
    console.info("[contractor-redis] contractor paused, using fallback", {
      email: resolved.contractor.email,
      zip: resolved.zip,
    })
    return { contractor: { ...fallback, source: "default" }, zip: resolved.zip }
  }
  return resolved
}
