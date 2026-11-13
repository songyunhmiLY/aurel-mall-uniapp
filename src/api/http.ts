import { getToken } from '@/auth/session'
import { getApiBaseUrl } from '@/config/api'

export class ApiError extends Error {
  statusCode?: number

  constructor(message: string, statusCode?: number) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
  }
}

export interface HttpRequest {
  path: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: UniApp.RequestOptions['data']
  withAuth?: boolean
}

interface ApiEnvelope {
  code: number
  message: string
  data: unknown
}

export function request<T>(options: HttpRequest): Promise<T> {
  const header: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (options.withAuth) {
    const token = getToken()
    if (token) header.Authorization = `Bearer ${token}`
  }

  return new Promise((resolve, reject) => {
    uni.request({
      url: `${getApiBaseUrl()}${options.path}`,
      method: options.method ?? 'GET',
      data: options.data,
      header,
      success(res) {
        const body = parseBody(res.data)
        const envelope = readEnvelope(body)
        const httpOk = res.statusCode >= 200 && res.statusCode < 300
        if (httpOk && envelope && envelope.code === 0) {
          resolve(envelope.data as T)
          return
        }
        if (envelope) {
          reject(new ApiError(envelope.message || '请求失败', envelope.code || res.statusCode))
          return
        }
        if (!httpOk) {
          reject(new ApiError(`请求失败 (${res.statusCode})`, res.statusCode))
          return
        }
        reject(new ApiError('响应格式不正确', res.statusCode))
      },
      fail(err) {
        reject(new ApiError(err.errMsg || '网络异常'))
      },
    })
  })
}

export function apiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError && error.message.trim()) return error.message
  if (error instanceof Error && error.message.trim()) return error.message
  return fallback
}

/** 停用账号应停留在未登录状态，并展示接口返回的原因。 */
export function isAccountBlockedError(error: unknown): boolean {
  return error instanceof ApiError && /停用|禁用/.test(error.message)
}

/** 会员商城对非会员的 403。预览登录关闭时的「已忽略」不是这个错误。 */
export function isMembershipError(error: unknown): boolean {
  return error instanceof ApiError && error.message.includes('非会员不能浏览会员商城')
}

function parseBody(data: unknown): unknown {
  if (typeof data !== 'string') return data
  const text = data.trim()
  if (!text) return null
  try {
    return JSON.parse(text) as unknown
  } catch {
    return data
  }
}

function readEnvelope(value: unknown): ApiEnvelope | null {
  if (typeof value !== 'object' || value === null) return null
  const record = value as Record<string, unknown>
  if (
    typeof record.code !== 'number' ||
    typeof record.message !== 'string' ||
    !('data' in record)
  ) {
    return null
  }
  return { code: record.code, message: record.message, data: record.data }
}
