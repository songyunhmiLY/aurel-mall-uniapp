import { ApiError, request } from './http'
import { asRecord, readString } from './record'

export interface AuthUser {
  id: string
  nickname: string
  avatarUrl: string
  phone: string
  /** 登录 data.user.inviteCode。未入座时为 null，入座后是 6 位数字，不会是根账户的 000000。 */
  inviteCode: string | null
  status: string
  /** 来自登录 data.user.member。 */
  member: boolean
}

export interface AuthSession {
  token: string
  user: AuthUser
}

export const PREVIEW_SUBJECT_MEMBER = 'preview-member'
export const PREVIEW_SUBJECT_NONMEMBER = 'preview-nonmember'

/** 与 aurel-mall-api PreviewLoginDto.subject 相同。 */
export const PREVIEW_SUBJECT_PATTERN = /^[A-Za-z0-9._-]{1,64}$/

/**
 * H5 预览身份。快捷按钮只用上面两个常量。
 * 登录框可以是任意符合 PREVIEW_SUBJECT_PATTERN 的 subject，例如 wx.LuckyPanda000。
 */
export type PreviewSubject = string

/** 小程序 wx.login 的 code。手机号不参与这次登录。 */
export function postMiniLogin(body: { code: string }) {
  return request<unknown>({
    path: '/auth/mini/login',
    method: 'POST',
    data: body,
  }).then(readAuthSession)
}

/**
 * 已有会话后提交手机号快速验证的 code。
 * body 与小程序登录一样只有 code，号码不是登录键。
 */
export function postMiniPhone(body: { code: string }) {
  return request<unknown>({
    path: '/auth/mini/phone',
    method: 'POST',
    data: body,
    withAuth: true,
  })
}

/**
 * H5 预览会话。body 只有 subject，不接收密码。
 * subject 是 1–64 位字母、数字、点、下划线或中划线。
 */
export function postPreviewLogin(body: { subject: string }) {
  return request<unknown>({
    path: '/auth/preview/login',
    method: 'POST',
    data: { subject: body.subject },
  }).then(readAuthSession)
}

export function readAuthSession(data: unknown): AuthSession {
  const record = asRecord(data)
  const token = readString(record?.token)
  const userRecord = asRecord(record?.user)
  if (!token || !userRecord || typeof userRecord.member !== 'boolean') {
    throw new ApiError('登录响应无效，未返回 token 或会员标识')
  }
  const status = readString(userRecord.status)
  if (status === 'disabled') throw new ApiError('账号已停用', 401)
  return {
    token,
    user: {
      id: readString(userRecord.id),
      nickname: readString(userRecord.nickname),
      avatarUrl: readString(userRecord.avatarUrl),
      phone: readString(userRecord.phone),
      inviteCode: readInviteCode(userRecord.inviteCode),
      status,
      member: userRecord.member,
    },
  }
}

function readInviteCode(value: unknown): string | null {
  if (value === null || value === undefined) return null
  if (typeof value !== 'string') return null
  const text = value.trim()
  return text.length ? text : null
}
