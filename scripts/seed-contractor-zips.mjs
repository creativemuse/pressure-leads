/**
 * Seeds Redis `contractor:zip:<5-digit>` keys from data/ne-florida-service-zips.txt
 *
 * Loads `.env` then `.env.local` (same as Next.js; local overrides). You can also pass env inline:
 *   REDIS_URL="..." CONTRACTOR_SEED_EMAIL="..." CONTRACTOR_SEED_PHONE_E164="+1..." yarn seed:zips
 *
 * Required: REDIS_URL, CONTRACTOR_SEED_EMAIL, CONTRACTOR_SEED_PHONE_E164
 * Optional: CONTRACTOR_SEED_NAME, ZIPS_FILE
 */

import { existsSync, readFileSync } from "fs"
import { dirname, join, resolve } from "path"
import { fileURLToPath } from "url"
import dotenv from "dotenv"
import { createClient } from "redis"

const repoRoot = process.cwd()
for (const name of [".env", ".env.local"]) {
  const p = resolve(repoRoot, name)
  if (existsSync(p)) dotenv.config({ path: p, override: name === ".env.local" })
}

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, "..")
const zipsPath = process.env.ZIPS_FILE
  ? join(root, process.env.ZIPS_FILE)
  : join(root, "data/ne-florida-service-zips.txt")

const raw = readFileSync(zipsPath, "utf8")
const zips = raw
  .split(/\r?\n/)
  .map((l) => l.replace(/#.*/, "").trim())
  .filter(Boolean)

const url = process.env.REDIS_URL?.trim()
const email = process.env.CONTRACTOR_SEED_EMAIL?.trim()
const phoneE164 = process.env.CONTRACTOR_SEED_PHONE_E164?.trim()
const name = process.env.CONTRACTOR_SEED_NAME?.trim() || undefined

if (!url || !email || !phoneE164) {
  console.error(
    "Missing env: REDIS_URL, CONTRACTOR_SEED_EMAIL, CONTRACTOR_SEED_PHONE_E164",
  )
  process.exit(1)
}

const profile = JSON.stringify({
  email,
  phoneE164,
  ...(name ? { name } : {}),
})

const client = createClient({ url })
client.on("error", (err) => console.error("[redis]", err))

await client.connect()

let ok = 0
let skipped = 0
for (const z of zips) {
  if (!/^\d{5}$/.test(z)) {
    console.warn("skip invalid zip:", z)
    skipped++
    continue
  }
  const key = `contractor:zip:${z}`
  await client.set(key, profile)
  ok++
}

await client.quit()

console.log(`Seeded ${ok} keys (${skipped} skipped). File: ${zipsPath}`)
