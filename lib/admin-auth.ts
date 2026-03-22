import { timingSafeEqual } from "node:crypto"

/** Bearer token must match `ADMIN_API_SECRET` (constant-time compare). */
export function verifyAdminBearer(request: Request): boolean {
  const secret = process.env.ADMIN_API_SECRET?.trim()
  if (!secret) return false
  const h = request.headers.get("authorization")
  if (!h?.startsWith("Bearer ")) return false
  const token = h.slice(7).trim()
  const a = Buffer.from(secret, "utf8")
  const b = Buffer.from(token, "utf8")
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}
