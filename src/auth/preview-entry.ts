import { postPreviewLogin, PREVIEW_SUBJECT_MEMBER, type PreviewSubject } from '@/api/auth'
import { isAccountBlockedError } from '@/api/http'
import { getToken } from '@/auth/session'
import { isMpWeixin } from '@/platform/mp-weixin'
import { usePreviewStore } from '@/stores/preview'
import { acceptSession, noteAuthFailure } from './account-session'

const SUBJECT_KEY = 'aurel_preview_subject'
let inflight: Promise<void> | null = null

export function readPreviewSubject(): PreviewSubject {
  const value = uni.getStorageSync(SUBJECT_KEY)
  return value === 'preview-nonmember' ? 'preview-nonmember' : PREVIEW_SUBJECT_MEMBER
}

export function writePreviewSubject(subject: PreviewSubject): void {
  uni.setStorageSync(SUBJECT_KEY, subject)
}

/**
 * 预览闸通过之后，用已保存的 subject 申请测试会话。
 * 小程序不走这里。ALLOW_PREVIEW_AUTH 关闭时展示接口里的「已忽略」。
 */
export function ensurePreviewSession(): Promise<void> {
  if (isMpWeixin) return Promise.resolve()
  if (getToken()) return Promise.resolve()
  const preview = usePreviewStore()
  if (preview.role === 'guest') return Promise.resolve()
  if (inflight) return inflight
  const subject = readPreviewSubject()
  preview.setEntering(true)
  inflight = run(subject).finally(() => {
    inflight = null
    usePreviewStore().setEntering(false)
  })
  return inflight
}

async function run(subject: PreviewSubject): Promise<void> {
  try {
    const session = await postPreviewLogin({ subject })
    acceptSession(session)
  } catch (error) {
    const message = noteAuthFailure(error, '预览会话未建立')
    uni.showToast({ title: message, icon: 'none' })
  }
}

/** 设置页和预览登录页按稳定 subject 切换。会员身份以接口返回的 member 为准。 */
export async function switchPreviewSubject(subject: PreviewSubject): Promise<void> {
  if (isMpWeixin) return
  const preview = usePreviewStore()
  preview.setEntering(true)
  try {
    const session = await postPreviewLogin({ subject })
    writePreviewSubject(subject)
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
