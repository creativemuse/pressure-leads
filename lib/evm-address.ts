/** Checks for a 0x-prefixed 40-hex-character EVM address (case-insensitive hex digits). */
export function isEvmAddress(s: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(s.trim())
}

export function normalizeEvmAddress(s: string): string | null {
  const t = s.trim()
  return isEvmAddress(t) ? t.toLowerCase() : null
}
