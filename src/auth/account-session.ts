import type { AuthSession, PreviewPersona } from '@/api/auth'
import { apiErrorMessage, isAccountBlockedError } from '@/api/http'
import { usePreviewStore } from '@/stores/preview'
import { useUserStore } from '@/stores/user'

export function acceptSession(session: AuthSession, persona?: PreviewPersona): void {
  const user = useUserStore()
  const preview = usePreviewStore()
  user.applySession(session)
  if (session.user.nickname) preview.applyNickname(session.user.nickname)
  if (session.user.member === true) preview.setRole('member')
  else if (session.user.member === false) preview.setRole('nonmember')
  else if (persona) preview.setRole(persona)
}

export function clearAuthSession(): void {
  useUserStore().clearSession()
  usePreviewStore().setRole('guest')
}

/** 登录失败或账号停用：清掉令牌，保留接口文案，页面保持未登录。 */
export function noteAuthFailure(error: unknown, fallback: string): string {
  const message = apiErrorMessage(error, fallback)
  useUserStore().setAuthError(message)
  clearAuthSession()
  return message
}

export function sessionErrorMessage(error: unknown, fallback: string): string {
  if (isAccountBlockedError(error)) return noteAuthFailure(error, fallback)
  return apiErrorMessage(error, fallback)
}
