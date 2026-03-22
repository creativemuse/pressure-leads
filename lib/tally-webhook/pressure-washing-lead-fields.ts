import {
  findFieldValueByKey,
  findFieldValueByLabel,
  findFieldValueByLabelPreferNonEmpty,
  getTallyFields,
} from "@/lib/tally-payload"

export type PressureWashingLeadExtracted = {
  first_name?: string
  last_name?: string
  phone?: string
  email?: string
  property_type?: string
  street_address?: string
  apartment?: string
  city?: string
  state?: string
  zip?: string
  country?: string
  sms_opt_in?: string
  services_needed?: string
  job_size?: string
  service_timing?: string
  dirt_level?: string
  water_access?: string
  special_notes?: string
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
 * Reads consumer “Pressure Washing Interest Form” fields via optional `TALLY_LEAD_*_KEY` or label fallbacks.
 * Duplicate question labels (e.g. two “What do you need cleaned?”) use the last non-empty value when no key is set.
 */
export function extractPressureWashingLeadFromPayload(payload: unknown): PressureWashingLeadExtracted {
  const fields = getTallyFields(payload)

  const servicesKey = process.env.TALLY_LEAD_SERVICES_KEY?.trim()
  let services_needed: string | undefined
  if (servicesKey) {
    services_needed = findFieldValueByKey(fields, servicesKey)?.trim() || undefined
  }
  if (!services_needed) {
    services_needed =
      findFieldValueByLabelPreferNonEmpty(fields, "What do you need cleaned?", { ignoreCase: true }) ??
      undefined
  }

  const smsKey = process.env.TALLY_LEAD_SMS_OPT_IN_KEY?.trim()
  let sms_opt_in: string | undefined
  if (smsKey) {
    sms_opt_in = findFieldValueByKey(fields, smsKey)?.trim() || undefined
  }
  if (!sms_opt_in) {
    sms_opt_in =
      fieldFromPayload(fields, undefined, [
        "Opt-In to receive SMS notifications.",
        "Opt-In to receive SMS notifications",
        "Opt-in to receive SMS notifications",
        "Untitled checkboxes field",
      ]) ?? undefined
  }

  const first_name =
    fieldFromPayload(fields, process.env.TALLY_LEAD_FIRST_NAME_KEY, ["First name", "First Name"]) ?? undefined
  const last_name =
    fieldFromPayload(fields, process.env.TALLY_LEAD_LAST_NAME_KEY, ["Last name", "Last Name"]) ?? undefined
  const phone =
    fieldFromPayload(fields, process.env.TALLY_LEAD_PHONE_KEY, ["Phone", "Phone number"]) ?? undefined
  const email = fieldFromPayload(fields, process.env.TALLY_LEAD_EMAIL_KEY, ["Email"]) ?? undefined
  const property_type =
    fieldFromPayload(fields, process.env.TALLY_LEAD_PROPERTY_TYPE_KEY, ["Property Type"]) ?? undefined
  const street_address =
    fieldFromPayload(fields, process.env.TALLY_LEAD_STREET_ADDRESS_KEY, [
      "Street Address",
      "Address",
    ]) ?? undefined
  const apartment =
    fieldFromPayload(fields, process.env.TALLY_LEAD_APARTMENT_KEY, [
      "Apartment/Suite",
      "Apartment",
      "Suite",
    ]) ?? undefined
  const city = fieldFromPayload(fields, process.env.TALLY_LEAD_CITY_KEY, ["City"]) ?? undefined
  const state = fieldFromPayload(fields, process.env.TALLY_LEAD_STATE_KEY, ["State"]) ?? undefined
  const zip =
    fieldFromPayload(fields, process.env.TALLY_LEAD_ZIP_KEY, ["Zip/Postal Code", "ZIP/Postal Code"]) ??
    undefined
  const country = fieldFromPayload(fields, process.env.TALLY_LEAD_COUNTRY_KEY, ["Country"]) ?? undefined
  const job_size = fieldFromPayload(fields, process.env.TALLY_LEAD_JOB_SIZE_KEY, ["Job Size"]) ?? undefined
  const timingKey = process.env.TALLY_LEAD_SERVICE_TIMING_KEY?.trim()
  let service_timing: string | undefined
  if (timingKey) {
    service_timing = findFieldValueByKey(fields, timingKey)?.trim() || undefined
  }
  if (!service_timing) {
    service_timing =
      findFieldValueByLabelPreferNonEmpty(fields, "When do you need service?", { ignoreCase: true }) ??
      undefined
  }

  const dirtKey = process.env.TALLY_LEAD_DIRT_LEVEL_KEY?.trim()
  let dirt_level: string | undefined
  if (dirtKey) {
    dirt_level = findFieldValueByKey(fields, dirtKey)?.trim() || undefined
  }
  if (!dirt_level) {
    dirt_level =
      findFieldValueByLabelPreferNonEmpty(fields, "How dirty is the surface?", { ignoreCase: true }) ??
      undefined
  }
  const water_access =
    fieldFromPayload(fields, process.env.TALLY_LEAD_WATER_ACCESS_KEY, [
      "Is water access available?",
    ]) ?? undefined
  const special_notes =
    fieldFromPayload(fields, process.env.TALLY_LEAD_SPECIAL_NOTES_KEY, [
      "Any special notes?",
      "Special notes",
    ]) ?? undefined

  const out: PressureWashingLeadExtracted = {}
  if (first_name) out.first_name = first_name
  if (last_name) out.last_name = last_name
  if (phone) out.phone = phone
  if (email) out.email = email
  if (property_type) out.property_type = property_type
  if (street_address) out.street_address = street_address
  if (apartment) out.apartment = apartment
  if (city) out.city = city
  if (state) out.state = state
  if (zip) out.zip = zip
  if (country) out.country = country
  if (sms_opt_in) out.sms_opt_in = sms_opt_in
  if (services_needed) out.services_needed = services_needed
  if (job_size) out.job_size = job_size
  if (service_timing) out.service_timing = service_timing
  if (dirt_level) out.dirt_level = dirt_level
  if (water_access) out.water_access = water_access
  if (special_notes) out.special_notes = special_notes
  return out
}

export function formatPressureWashingLeadPlainText(data: PressureWashingLeadExtracted): string {
  const lines: string[] = []
  const add = (label: string, v?: string) => {
    const t = v?.trim()
    if (t) lines.push(`${label}: ${t}`)
  }

  const name = [data.first_name, data.last_name].filter(Boolean).join(" ").trim()
  add("Name", name || undefined)
  add("Phone", data.phone)
  add("Email", data.email)
  add("Property type", data.property_type)
  add("Street", data.street_address)
  add("Apt/Suite", data.apartment)
  add("City", data.city)
  add("State", data.state)
  add("ZIP", data.zip)
  add("Country", data.country)
  add("SMS opt-in", data.sms_opt_in)
  add("Services needed", data.services_needed)
  add("Job size", data.job_size)
  add("When needed", data.service_timing)
  add("How dirty", data.dirt_level)
  add("Water access", data.water_access)
  add("Notes", data.special_notes)

  return lines.join("\n")
}

export function leadEmailBodyWithStructuredFacts(leadSummary: string, payload: unknown): string {
  const facts = extractPressureWashingLeadFromPayload(payload)
  const block = formatPressureWashingLeadPlainText(facts)
  if (!block.trim()) return leadSummary
  return `${leadSummary}\n\n${block}`
}
