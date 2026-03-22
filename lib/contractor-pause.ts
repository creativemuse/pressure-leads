import { getRedis } from "@/lib/redis"

export function normalizedContractorEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function pausedContractorRedisKey(email: string): string {
  return `contractor:paused:${normalizedContractorEmail(email)}`
}

export async function isContractorPaused(email: string): Promise<boolean> {
  if (!process.env.REDIS_URL?.trim()) return false
  try {
    const r = await getRedis()
    const v = await r.get(pausedContractorRedisKey(email))
    return v === "1" || v === "true"
  } catch (e) {
    console.error("[contractor-pause] isPaused failed", e)
    return false
  }
}

export async function setContractorPaused(email: string, paused: boolean): Promise<void> {
  const r = await getRedis()
  const key = pausedContractorRedisKey(email)
  if (paused) {
    await r.set(key, "1")
  } else {
    await r.del(key)
  }
}
