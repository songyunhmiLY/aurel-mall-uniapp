import { ApiError } from './http'

export function asRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return null
  return value as Record<string, unknown>
}

export function readString(value: unknown): string {
  if (typeof value === 'string') return value.trim()
  if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  return ''
}

export function readNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

export function readRequiredText(value: unknown, invalid: string): string {
  const text = readString(value)
  if (!text) throw new ApiError(invalid)
  return text
}

export function readNullableText(value: unknown, invalid: string): string | null {
  if (value === null) return null
  if (typeof value !== 'string') throw new ApiError(invalid)
  const text = value.trim()
  return text.length ? text : null
}

/** 路由和流水里的 bigint，在 JSON 里是十进制字符串。 */
export function readPositiveId(value: unknown, invalid: string): string {
  if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value.trim())) throw new ApiError(invalid)
  return value.trim()
}

/** 钱包金额。允许负号，因为分类合计可能为负。 */
export function readDecimalFen(value: unknown, invalid: string): string {
  if (typeof value !== 'string' || !/^-?\d+$/.test(value.trim())) throw new ApiError(invalid)
  return value.trim()
}

export function readNullableDecimalFen(value: unknown, invalid: string): string | null {
  if (value === null) return null
  return readDecimalFen(value, invalid)
}

export function readIntFen(value: unknown, invalid: string): number {
  if (typeof value !== 'number' || !Number.isInteger(value)) throw new ApiError(invalid)
  return value
}

export function readNullableIntFen(value: unknown, invalid: string): number | null {
  if (value === null) return null
  return readIntFen(value, invalid)
}

export function readPageCount(value: unknown, invalid: string): number {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
    throw new ApiError(invalid)
  }
  return value
}
