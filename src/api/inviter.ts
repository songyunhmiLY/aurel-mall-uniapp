import { ApiError, request } from './http'
import { asRecord, readString } from './record'

export interface InviterBind {
  inviteCode: string
  inviterId: string
}

/** 显式填写邀请人。登录接口不接收邀请码。 */
export function bindInviter(inviteCode: string) {
  return request<unknown>({
    path: '/me/inviter',
    method: 'POST',
    data: { inviteCode },
    withAuth: true,
  }).then(readInviterBind)
}

export function readInviterBind(data: unknown): InviterBind {
  const record = asRecord(data)
  const inviteCode = readString(record?.inviteCode)
  const inviterId = readString(record?.inviterId)
  if (!/^\d{6}$/.test(inviteCode) || !inviterId) {
    throw new ApiError('邀请码响应无效')
  }
  return { inviteCode, inviterId }
}
