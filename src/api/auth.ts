import { request } from './http'

/**
 * 登录产品规则未定，页面不要自行决定字段含义。
 * 确定契约后只改这里的路径和类型。
 */
export function postLoginPlaceholder(body: Record<string, string>) {
  return request<unknown>({
    path: '/auth/login',
    method: 'POST',
    data: body,
  })
}
