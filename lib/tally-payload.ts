/**
 * Helpers for Tally `FORM_RESPONSE` webhooks.
 * @see https://tally.so/help/webhooks — payload shape: `data.fields[]` with `key`, `label`, `type`, `value`.
 */

export type TallyField = {
  key?: string
  label?: string
  type?: string
  value?: unknown
}

export function getTallyFields(payload: unknown): TallyField[] {
  if (payload == null || typeof payload !== "object") return []
  const data = (payload as Record<string, unknown>).data
  if (data == null || typeof data !== "object") return []
  const fields = (data as Record<string, unknown>).fields
  if (!Array.isArray(fields)) return []
  return fields as TallyField[]
}

/** Match by exact label (after trim); optional case-insensitive. */
export function findFieldValueByLabel(
  fields: TallyField[],
  label: string,
  options?: { ignoreCase?: boolean },
): string | null {
  const want = label.trim()
  if (!want) return null
  const cmp = (a: string, b: string) =>
    options?.ignoreCase ? a.toLowerCase() === b.toLowerCase() : a === b

  for (const f of fields) {
    const l = typeof f.label === "string" ? f.label.trim() : ""
    if (!l || !cmp(l, want)) continue
    return fieldValueToString(f.value)
  }
  return null
}

/**
 * When Tally repeats the same label (e.g. section title + question), returns the last non-empty value.
 */
export function findFieldValueByLabelPreferNonEmpty(
  fields: TallyField[],
  label: string,
  options?: { ignoreCase?: boolean },
): string | null {
  const want = label.trim()
  if (!want) return null
  const cmp = (a: string, b: string) =>
    options?.ignoreCase ? a.toLowerCase() === b.toLowerCase() : a === b

  let lastNonEmpty: string | null = null
  for (const f of fields) {
    const l = typeof f.label === "string" ? f.label.trim() : ""
    if (!l || !cmp(l, want)) continue
    const s = fieldValueToString(f.value)
    const t = s?.trim()
    if (t) lastNonEmpty = t
  }
  return lastNonEmpty
}

/** Prefer stable `key` from one captured webhook (e.g. `question_xYz123`). */
export function findFieldValueByKey(fields: TallyField[], key: string): string | null {
  const want = key.trim()
  if (!want) return null
  for (const f of fields) {
    const k = typeof f.key === "string" ? f.key.trim() : ""
    if (k !== want) continue
    return fieldValueToString(f.value)
  }
  return null
}

function fieldValueToString(value: unknown): string | null {
  if (value == null) return null
  if (typeof value === "string") return value
  if (typeof value === "number" && Number.isFinite(value)) return String(value)
  if (typeof value === "boolean") return value ? "true" : "false"
  if (Array.isArray(value)) {
    const parts: string[] = []
    for (const item of value) {
      const s = fieldValueToString(item)
      if (s != null && s !== "") parts.push(s)
    }
    if (parts.length === 0) return null
    return parts.join(", ")
  }
  if (typeof value === "object") {
    const o = value as Record<string, unknown>
    if (typeof o.text === "string" && o.text.trim()) return o.text.trim()
    if (typeof o.label === "string" && o.label.trim()) return o.label.trim()
    if (typeof o.value === "string" && o.value.trim()) return o.value.trim()
    if (typeof o.title === "string" && o.title.trim()) return o.title.trim()
  }
  return null
}

/**
 * US-centric: first 5 digits from the field value. Returns null if fewer than 5 digits.
 * For international postcodes, set `TALLY_ZIP_RAW_KEY=1` and use a different normalizer later.
 */
export function normalizeZipForRedisKey(raw: string): string | null {
  const digits = raw.replace(/\D/g, "")
  if (digits.length >= 5) return digits.slice(0, 5)
  return null
}

/**
 * Resolves zip string from payload using `TALLY_ZIP_FIELD_LABEL` (default `Zip/Postal Code`)
 * or `TALLY_ZIP_FIELD_KEY` if set (stable Tally `key`).
 */
export function extractZipFromTallyPayload(payload: unknown): string | null {
  const fields = getTallyFields(payload)
  const key = process.env.TALLY_ZIP_FIELD_KEY?.trim()
  const raw = key
    ? findFieldValueByKey(fields, key)
    : findFieldValueByLabel(fields, process.env.TALLY_ZIP_FIELD_LABEL?.trim() || "Zip/Postal Code", {
        ignoreCase: true,
      })
  if (!raw?.trim()) return null
  return normalizeZipForRedisKey(raw)
}
