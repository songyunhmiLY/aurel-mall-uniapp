import { ApiError, apiErrorMessage } from '@/api/http'
import { bindInviter, type InviterBind } from '@/api/inviter'
import {
  hasInviterBound,
  isInviteCode,
  markInviterBound,
  readPendingInviteCode,
} from '@/invite/code'
import { resetTo, routes, withQuery } from '@/navigation/routes'
import { useUserStore } from '@/stores/user'

export function needsInviteRegistration(): boolean {
  const user = useUserStore()
  if (!user.token || !user.userId) return false
  if (user.member) return false
  return !hasInviterBound(user.userId)
}

export function registrationUrl(): string {
  const code = readPendingInviteCode()
  return code ? withQuery(routes.register, { inviteCode: code }) : routes.register
}

export function openAfterLogin(): void {
  if (needsInviteRegistration()) {
    resetTo(registrationUrl())
    return
  }
  resetTo(routes.home)
}

export type InviteBindOutcome =
  { ok: true; result: InviterBind } | { ok: false; alreadyBound: boolean; message: string }

/** 登录完成后再提交邀请码。失败时留在注册页，不把注册算作完成。 */
export async function submitInviteRegistration(code: string): Promise<InviteBindOutcome> {
  const trimmed = code.trim()
  if (!isInviteCode(trimmed)) {
    return { ok: false, alreadyBound: false, message: '邀请码不正确' }
  }
  const user = useUserStore()
  try {
    const result = await bindInviter(trimmed)
    markInviterBound(user.userId)
    return { ok: true, result }
  } catch (error) {
    if (isExistingInviter(error)) {
      markInviterBound(user.userId)
      return { ok: false, alreadyBound: true, message: apiErrorMessage(error, '邀请关系已存在') }
    }
    return { ok: false, alreadyBound: false, message: apiErrorMessage(error, '邀请码未提交') }
  }
}

function isExistingInviter(error: unknown): boolean {
  return error instanceof ApiError && error.message.includes('邀请关系已存在')
}
