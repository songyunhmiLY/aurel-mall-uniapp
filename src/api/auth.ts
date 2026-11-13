import { ApiError, request } from './http'
import { asRecord, readString } from './record'

export interface AuthUser {
  id: string
  nickname: string
  status: string
  /** 只有接口明确给出布尔值时才有意义。缺省不推断会员身份。 */
  member: boolean | null
}

export interface AuthSession {
  token: string
  user: AuthUser
}

export type PreviewPersona = 'member' | 'nonmember'

/** 小程序 wx.login 的 code。手机号不参与这次登录。 */
export function postMiniLogin(body: { code: string }) {
  return request<unknown>({
    path: '/auth/mini/login',
    method: 'POST',
    data: body,
  }).then(readAuthSession)
}

/** 已有会话后，微信手机号按钮可以补交 code。不能用来代替登录。 */
export function postMiniPhone(body: { code: string }) {
  return request<unknown>({
    path: '/auth/mini/phone',
    method: 'POST',
    data: body,
    withAuth: true,
  })
}

/**
 * H5 开发预览的测试会话。persona 用来切换会员 / 非会员测试用户。
 * 不是正式登录，也不走微信网页授权。
 */
export function postPreviewLogin(body: { persona: PreviewPersona }) {
  return request<unknown>({
    path: '/auth/preview/login',
    method: 'POST',
    data: body,
  }).then(readAuthSession)
}

export function readAuthSession(data: unknown): AuthSession {
  const record = asRecord(data)
  const token = readString(record?.token) || readString(record?.accessToken)
  if (!token) throw new ApiError('登录响应无效，未返回 token')

  const userRecord = asRecord(record?.user)
  const status = readString(userRecord?.status) || readString(record?.status)
  if (status === 'disabled') throw new ApiError('账号已停用', 403)

  const memberValue =
    userRecord?.member ?? userRecord?.isMember ?? record?.member ?? record?.isMember
  return {
    token,
    user: {
      id: readString(userRecord?.id) || readString(record?.id),
      nickname:
        readString(userRecord?.nickname) ||
        readString(userRecord?.name) ||
        readString(record?.nickname),
      status,
      member: typeof memberValue === 'boolean' ? memberValue : null,
    },
  }
}
