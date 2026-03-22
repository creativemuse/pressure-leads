import { normalizeEvmAddress } from "@/lib/evm-address"
import {
  findFieldValueByKey,
  findFieldValueByLabel,
  getTallyFields,
  normalizeZipForRedisKey,
} from "@/lib/tally-payload"

export type ContractorOnboardingExtracted = {
  company_name: string
  email: string
  phone: string
  zip_codes_raw: string
  /** Normalized lowercase 0x address */
  creative_bank_address: string
  first_name?: string
  last_name?: string
  job_title?: string
  country?: string
}

function fieldFromPayload(
  fields: ReturnType<typeof getTallyFields>,
  keyEnv: string | undefined,
  defaultLabels: string[],
): string | null {
  const key = keyEnv?.trim()
  if (key) {
    const byKey = findFieldValueByKey(fields, key)
    if (byKey?.trim()) return byKey.trim()
  }
  for (const label of defaultLabels) {
    const v = findFieldValueByLabel(fields, label, { ignoreCase: true })
    if (v?.trim()) return v.trim()
  }
  return null
}

/**
 * Reads Tally `FORM_RESPONSE` payload fields using env keys or label fallbacks.
 * Tuned for the "Pressure Washing Partner" form (company, service ZIP, Creative Bank wallet, etc.).
 */
export function extractContractorOnboardingFromPayload(payload: unknown):
  | { ok: true; data: ContractorOnboardingExtracted }
  | { ok: false; error: string } {
  const fields = getTallyFields(payload)

  const company_name = fieldFromPayload(fields, process.env.TALLY_CONTRACTOR_COMPANY_KEY, [
    "Company",
    "Company name",
    "Company Name",
  ])
  const email = fieldFromPayload(fields, process.env.TALLY_CONTRACTOR_EMAIL_KEY, [
    "Email address",
    "Email",
  ])
  const phone = fieldFromPayload(fields, process.env.TALLY_CONTRACTOR_PHONE_KEY, [
    "Phone number",
    "Phone",
    "Mobile",
  ])
  const zip_codes_raw = fieldFromPayload(fields, process.env.TALLY_CONTRACTOR_ZIPS_KEY, [
    "Zip/Postal Code",
    "ZIP/Postal Code",
    "ZIP codes",
    "Zip codes",
    "Service ZIP codes",
    "Service zip codes",
    "Service area ZIP codes",
  ])

  const walletRaw = fieldFromPayload(fields, process.env.TALLY_CONTRACTOR_WALLET_KEY, [
    "Creative Bank Address (Required for Automated Leads)",
    "Creative Bank Address",
    "Creative bank address",
  ])
  const creative_bank_address = walletRaw ? normalizeEvmAddress(walletRaw) : null

  const first_name = fieldFromPayload(fields, process.env.TALLY_CONTRACTOR_FIRST_NAME_KEY, [
    "First Name",
    "First name",
  ]) ?? undefined
  const last_name = fieldFromPayload(fields, process.env.TALLY_CONTRACTOR_LAST_NAME_KEY, [
    "Last Name",
    "Last name",
  ]) ?? undefined
  const job_title = fieldFromPayload(fields, process.env.TALLY_CONTRACTOR_JOB_TITLE_KEY, [
    "Job Title",
    "Job title",
  ]) ?? undefined
  const country = fieldFromPayload(fields, process.env.TALLY_CONTRACTOR_COUNTRY_KEY, [
    "Country",
    "What country do you live in?",
  ]) ?? undefined

  if (!company_name) return { ok: false, error: "Missing company field" }
  if (!email) return { ok: false, error: "Missing email field" }
  if (!email.includes("@")) return { ok: false, error: "Invalid email" }
  if (!phone) return { ok: false, error: "Missing phone field" }
  if (!zip_codes_raw) return { ok: false, error: "Missing Zip/Postal Code field" }
  if (!walletRaw?.trim()) return { ok: false, error: "Missing Creative Bank address field" }
  if (!creative_bank_address) {
    return { ok: false, error: "Creative Bank address must be a valid 0x-prefixed EVM address (42 characters)" }
  }

  return {
    ok: true,
    data: {
      company_name,
      email,
      phone,
      zip_codes_raw,
      creative_bank_address,
      ...(first_name ? { first_name } : {}),
      ...(last_name ? { last_name } : {}),
      ...(job_title ? { job_title } : {}),
      ...(country ? { country } : {}),
    },
  }
}

/** Splits comma/semicolon/newline-separated ZIP tokens; normalizes to unique 5-digit US ZIPs. */
export function parseContractorZipCodes(raw: string): string[] {
  const parts = raw.split(/[,;\n]+/)
  const out: string[] = []
  const seen = new Set<string>()
  for (const part of parts) {
    const z = normalizeZipForRedisKey(part.trim())
    if (z && !seen.has(z)) {
      seen.add(z)
      out.push(z)
    }
  }
  return out
}
