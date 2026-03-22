import { getRedis } from "@/lib/redis"

/** UTC calendar date `YYYY-MM-DD`. */
export function leadStatsUtcDate(d = new Date()): string {
  return d.toISOString().slice(0, 10)
}

function zipKeySegment(zip5: string | null): string {
  return zip5 && /^\d{5}$/.test(zip5) ? zip5 : "unknown"
}

/**
 * Increments daily lead counters after a lead notification email is sent.
 * No-op when `REDIS_URL` is unset. Failures are logged only.
 */
export async function recordLeadProcessed(zip5: string | null): Promise<void> {
  if (!process.env.REDIS_URL?.trim()) return
  const date = leadStatsUtcDate()
  const z = zipKeySegment(zip5)
  const zipKey = `lead:count:zip:${z}:day:${date}`
  const dayKey = `lead:count:day:${date}`
  const ttl = 60 * 60 * 24 * 400
  try {
    const r = await getRedis()
    const multi = r.multi()
    multi.incr(zipKey)
    multi.incr(dayKey)
    multi.expire(zipKey, ttl)
    multi.expire(dayKey, ttl)
    await multi.exec()
  } catch (e) {
    console.error("[lead-stats] record failed", e)
  }
}

export async function getLeadStats(
  zip5: string | undefined,
  date: string,
): Promise<{ countGlobal: number; countForZip: number | null }> {
  const r = await getRedis()
  const dayKey = `lead:count:day:${date}`
  const globalRaw = await r.get(dayKey)
  const countGlobal = globalRaw != null ? Number.parseInt(String(globalRaw), 10) : 0
  const safeGlobal = Number.isFinite(countGlobal) ? countGlobal : 0

  if (!zip5 || !/^\d{5}$/.test(zip5)) {
    return { countGlobal: safeGlobal, countForZip: null }
  }
  const zipKey = `lead:count:zip:${zip5}:day:${date}`
  const zipRaw = await r.get(zipKey)
  const zc = zipRaw != null ? Number.parseInt(String(zipRaw), 10) : 0
  return { countGlobal: safeGlobal, countForZip: Number.isFinite(zc) ? zc : 0 }
}
