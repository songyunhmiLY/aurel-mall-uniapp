import {
  postMiniLogin,
  postPreviewLogin,
  PREVIEW_SUBJECT_MEMBER,
  PREVIEW_SUBJECT_PATTERN,
  type PreviewSubject,
} from '@/api/auth'
import { ApiError, apiErrorMessage, isAccountBlockedError } from '@/api/http'
import { getToken } from '@/auth/session'
import { isMpWeixin, requestWechatLoginCode } from '@/platform/mp-weixin'
import { usePreviewStore } from '@/stores/preview'
import { acceptSession, noteAuthFailure } from './account-session'

const SUBJECT_KEY = 'aurel_preview_subject'
let inflight: Promise<void> | null = null

/** 上次成功使用的预览 subject。格式不对时回到 preview-member。 */
export function readPreviewSubject(): PreviewSubject {
  const value = uni.getStorageSync(SUBJECT_KEY)
  if (typeof value === 'string' && PREVIEW_SUBJECT_PATTERN.test(value)) return value
  return PREVIEW_SUBJECT_MEMBER
}

export function writePreviewSubject(subject: PreviewSubject): void {
  uni.setStorageSync(SUBJECT_KEY, subject)
}

/**
 * 预览闸通过之后，用已保存的 subject 申请或刷新测试会话。
 * 小程序不走这里。ALLOW_PREVIEW_AUTH 关闭时展示接口里的「已忽略」。
 * 已有令牌时也会再登录一次，用来拿到最新的 member 和 inviteCode。
 */
export function ensurePreviewSession(): Promise<void> {
  if (isMpWeixin) return Promise.resolve()
  if (!getToken() && usePreviewStore().role === 'guest') return Promise.resolve()
  if (inflight) return inflight
  usePreviewStore().setEntering(true)
  inflight = refreshSignedInUser().finally(() => {
    inflight = null
    usePreviewStore().setEntering(false)
  })
  return inflight
}

/**
 * 再用现有登录接口读取 user.inviteCode 和 user.member。
 * 没有单独的个人资料接口。失败且仍持有令牌时保留会话。
 */
export async function refreshSignedInUser(options?: { quiet?: boolean }): Promise<void> {
  if (isMpWeixin) {
    if (!getToken()) return
    try {
      const code = await requestWechatLoginCode()
      acceptSession(await postMiniLogin({ code }))
    } catch (error) {
      if (isAccountBlockedError(error)) noteAuthFailure(error, '账号已停用')
    }
    return
  }
  if (!getToken() && usePreviewStore().role === 'guest') return
  const hadToken = Boolean(getToken())
  try {
    acceptSession(await postPreviewLogin({ subject: readPreviewSubject() }))
  } catch (error) {
    if (!hadToken || isAccountBlockedError(error) || isPreviewIgnored(error)) {
      const message = noteAuthFailure(error, '预览会话未建立')
      if (!options?.quiet) uni.showToast({ title: message, icon: 'none' })
      return
    }
    if (!options?.quiet) {
      uni.showToast({ title: apiErrorMessage(error, '预览会话未刷新'), icon: 'none' })
    }
  }
}

function isPreviewIgnored(error: unknown): boolean {
  return error instanceof ApiError && error.message.includes('已忽略')
}

/** 设置页和预览登录页按 subject 切换。会员身份以接口返回的 member 为准。 */
export async function switchPreviewSubject(subject: PreviewSubject): Promise<void> {
  if (isMpWeixin) return
  const identifier = subject.trim()
  const preview = usePreviewStore()
  preview.setEntering(true)
  try {
    const session = await postPreviewLogin({ subject: identifier })
    writePreviewSubject(identifier)
    acceptSession(session)
  } catch (error) {
    if (isAccountBlockedError(error) || !getToken()) {
      noteAuthFailure(error, '预览会话未建立')
    }
    throw error
  } finally {
    preview.setEntering(false)
  }
}
