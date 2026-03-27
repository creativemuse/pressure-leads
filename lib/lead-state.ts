import { getRedis } from "@/lib/redis"
import { randomUUID } from "crypto"

export type LeadStatus = "new" | "contacted" | "qualified" | "converted"

export type LeadRecord = {
  id: string
  status: LeadStatus
  score: number
  consumerEmail?: string
  zip?: string
  contractorEmail?: string
  responseId?: string
  createdAt: string
  updatedAt: string
}

function leadKey(id: string): string {
  return `lead:${id}:status`
}

function leadDataKey(id: string): string {
  return `lead:${id}:data`
}

const LEAD_TTL = 60 * 60 * 24 * 400 // 400 days

/**
 * Creates a new lead record in Redis. Returns the lead ID.
 * No-op (returns generated ID) when REDIS_URL is unset.
 */
export async function createLeadRecord(opts: {
  score: number
  consumerEmail?: string
  zip?: string
  contractorEmail?: string
  responseId?: string
}): Promise<string> {
  const id = opts.responseId ?? randomUUID()
  if (!process.env.REDIS_URL?.trim()) return id

  const now = new Date().toISOString()
  const record: LeadRecord = {
    id,
    status: "new",
    score: opts.score,
    consumerEmail: opts.consumerEmail,
    zip: opts.zip,
    contractorEmail: opts.contractorEmail,
    responseId: opts.responseId,
    createdAt: now,
    updatedAt: now,
  }

  try {
    const r = await getRedis()
    const multi = r.multi()
    multi.set(leadKey(id), record.status, { EX: LEAD_TTL })
    multi.set(leadDataKey(id), JSON.stringify(record), { EX: LEAD_TTL })
    await multi.exec()
  } catch (e) {
    console.error("[lead-state] create failed", e)
  }

  return id
}

/**
 * Transitions lead status. Returns true if updated, false on error or missing Redis.
 */
export async function updateLeadStatus(id: string, status: LeadStatus): Promise<boolean> {
  if (!process.env.REDIS_URL?.trim()) return false

  try {
    const r = await getRedis()
    const raw = await r.get(leadDataKey(id))
    if (!raw) {
      // No data record, just set status key
      await r.set(leadKey(id), status, { EX: LEAD_TTL })
      return true
    }

    const record = JSON.parse(raw) as LeadRecord
    record.status = status
    record.updatedAt = new Date().toISOString()

    const multi = r.multi()
    multi.set(leadKey(id), status, { EX: LEAD_TTL })
    multi.set(leadDataKey(id), JSON.stringify(record), { EX: LEAD_TTL })
    await multi.exec()
    return true
  } catch (e) {
    console.error("[lead-state] update failed", e)
    return false
  }
}

/**
 * Gets the current lead record. Returns null if not found or Redis unavailable.
 */
export async function getLeadRecord(id: string): Promise<LeadRecord | null> {
  if (!process.env.REDIS_URL?.trim()) return null

  try {
    const r = await getRedis()
    const raw = await r.get(leadDataKey(id))
    if (!raw) return null
    return JSON.parse(raw) as LeadRecord
  } catch (e) {
    console.error("[lead-state] get failed", e)
    return null
  }
}
