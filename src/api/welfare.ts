import { ApiError, request } from './http'
import { asRecord } from './record'
import type { WelfareEntry, WelfareStatus } from '@/types/welfare'

const ENTRY_INVALID = '福利专场入口响应无效'
const STATUS_INVALID = '福利专场响应无效'

/** GET /me/welfare/entry。首页入口文案和图片。 */
export function fetchWelfareEntry() {
  return request<unknown>({ path: '/me/welfare/entry', withAuth: true }).then(readWelfareEntry)
}

/** GET /me/welfare。data 只读取 eligible 与 signedUpToday。 */
export function fetchWelfareStatus() {
  return request<unknown>({ path: '/me/welfare', withAuth: true }).then(readWelfareStatus)
}

/** POST /me/welfare/signups。成功 data 与状态接口相同。不具备资格时接口返回 403。 */
export function signupWelfare() {
  return request<unknown>({
    path: '/me/welfare/signups',
    method: 'POST',
    withAuth: true,
  }).then(readWelfareStatus)
}

export function readWelfareEntry(data: unknown): WelfareEntry {
  const record = asRecord(data)
  if (!record || typeof record.copy !== 'string') throw new ApiError(ENTRY_INVALID)
  return {
    copy: record.copy.trim(),
    imageUrl: readImageUrl(record.imageUrl),
  }
}

/**
 * 只留下会员可见的两项。其余字段即使出现在响应里也不进入页面。
 */
export function readWelfareStatus(data: unknown): WelfareStatus {
  const record = asRecord(data)
  if (
    !record ||
    typeof record.eligible !== 'boolean' ||
    typeof record.signedUpToday !== 'boolean'
  ) {
    throw new ApiError(STATUS_INVALID)
  }
  return {
    eligible: record.eligible,
    signedUpToday: record.signedUpToday,
  }
}

function readImageUrl(value: unknown): string | null {
  if (value === null) return null
  if (typeof value !== 'string') throw new ApiError(ENTRY_INVALID)
  const text = value.trim()
  return text.length ? text : null
}
