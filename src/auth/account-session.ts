import type { AuthSession } from '@/api/auth'
import { apiErrorMessage, isAccountBlockedError } from '@/api/http'
import { usePreviewStore } from '@/stores/preview'
import { useUserStore } from '@/stores/user'

/** 会员标识只采用登录响应里的 user.member，不按预览 subject 推断。 */
export function acceptSession(session: AuthSession): void {
  const user = useUserStore()
  const preview = usePreviewStore()
  user.applySession(session)
  if (session.user.nickname) preview.applyNickname(session.user.nickname)
  preview.setRole(session.user.member ? 'member' : 'nonmember')
}

export function clearAuthSession(): void {
  useUserStore().clearSession()
  usePreviewStore().setRole('guest')
}

/** 登录失败、停用或预览登录被忽略：清掉令牌，保留接口文案。 */
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
