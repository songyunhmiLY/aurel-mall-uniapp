import { ApiError, request } from './http'
import { asRecord, readString } from './record'

export interface AuthUser {
  id: string
  nickname: string
  status: string
  /** 来自登录 data.user.member。有市场树席位才是 true。 */
  member: boolean
}

export interface AuthSession {
  token: string
  user: AuthUser
}

export const PREVIEW_SUBJECT_MEMBER = 'preview-member'
export const PREVIEW_SUBJECT_NONMEMBER = 'preview-nonmember'

export type PreviewSubject = typeof PREVIEW_SUBJECT_MEMBER | typeof PREVIEW_SUBJECT_NONMEMBER

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

/** H5 预览会话。subject 是 1–64 位字母、数字、点、下划线或中划线。 */
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
      status,
      member: userRecord.member,
    },
  }
}
