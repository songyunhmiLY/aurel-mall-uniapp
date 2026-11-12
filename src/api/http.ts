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
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data as T)
          return
        }
        reject(new ApiError(`请求失败 (${res.statusCode})`, res.statusCode))
      },
      fail(err) {
        reject(new ApiError(err.errMsg || '网络异常'))
      },
    })
  })
}
