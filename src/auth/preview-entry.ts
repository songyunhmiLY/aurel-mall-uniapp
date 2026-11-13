import { postPreviewLogin, type PreviewPersona } from '@/api/auth'
import { isAccountBlockedError } from '@/api/http'
import { getToken } from '@/auth/session'
import { isMpWeixin } from '@/platform/mp-weixin'
import { usePreviewStore } from '@/stores/preview'
import { acceptSession, noteAuthFailure } from './account-session'

let inflight: Promise<void> | null = null

/**
 * 预览闸通过之后，给还没有令牌、也没有主动退出的 H5 会话申请一个测试用户。
 * 小程序不走这里。
 */
export function ensurePreviewSession(): Promise<void> {
  if (isMpWeixin) return Promise.resolve()
  if (getToken()) return Promise.resolve()
  const preview = usePreviewStore()
  if (preview.role === 'guest') return Promise.resolve()
  if (inflight) return inflight
  const persona: PreviewPersona = preview.role === 'nonmember' ? 'nonmember' : 'member'
  preview.setEntering(true)
  inflight = run(persona).finally(() => {
    inflight = null
    usePreviewStore().setEntering(false)
  })
  return inflight
}

async function run(persona: PreviewPersona): Promise<void> {
  try {
    const session = await postPreviewLogin({ persona })
    acceptSession(session, persona)
  } catch (error) {
    const message = noteAuthFailure(error, '预览会话未建立')
    uni.showToast({ title: message, icon: 'none' })
  }
}

/** 设置页和预览登录页切换测试身份。失败时停用账号会退出，其它错误保留原会话。 */
export async function switchPreviewPersona(persona: PreviewPersona): Promise<void> {
  if (isMpWeixin) return
  const preview = usePreviewStore()
  preview.setEntering(true)
  try {
    const session = await postPreviewLogin({ persona })
    acceptSession(session, persona)
  } catch (error) {
    if (isAccountBlockedError(error) || !getToken()) {
      noteAuthFailure(error, '预览会话未建立')
    }
    throw error
  } finally {
    preview.setEntering(false)
  }
}
