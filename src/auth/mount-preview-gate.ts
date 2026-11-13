import { isPreviewUnlocked, previewGateConfigured, tryUnlockPreview } from './preview-gate'
import './preview-gate.css'

/**
 * 预览闸必须用原生 DOM，不能走 uni-app 的 SFC 模板。
 * 模板里的 form / input / button 会被编译成 uni 组件，
 * 单独 createApp 挂载后，「进入」点击不会提交，看起来像没反应。
 */
export function mountPreviewGate(onUnlocked?: () => void): void {
  if (typeof document === 'undefined') return
  if (!previewGateConfigured() || isPreviewUnlocked()) {
    onUnlocked?.()
    return
  }
  if (document.getElementById('preview-gate-root')) return

  const host = document.createElement('div')
  host.id = 'preview-gate-root'
  host.innerHTML = `
    <div class="gate">
      <form class="gate__card">
        <div class="gate__brand">AUREL</div>
        <div class="gate__title">预览登录</div>
        <p class="gate__sub">进入奥瑞尔 H5 预览。用户名为 root。</p>
        <label class="gate__field">
          <span class="gate__label">用户名</span>
          <input class="gate__input" name="username" autocomplete="username" placeholder="root" />
        </label>
        <label class="gate__field">
          <span class="gate__label">密码</span>
          <input class="gate__input" name="password" type="password" autocomplete="current-password" placeholder="请输入密码" />
        </label>
        <p class="gate__error" hidden></p>
        <button class="gate__btn" type="submit">进入</button>
      </form>
    </div>
  `
  document.body.appendChild(host)

  const form = host.querySelector('form') as HTMLFormElement
  const username = host.querySelector('input[name="username"]') as HTMLInputElement
  const password = host.querySelector('input[name="password"]') as HTMLInputElement
  const error = host.querySelector('.gate__error') as HTMLParagraphElement
  const button = host.querySelector('.gate__btn') as HTMLButtonElement
  let pending = false

  form.addEventListener('submit', (event) => {
    event.preventDefault()
    void submit()
  })

  async function submit() {
    if (pending) return
    error.hidden = true
    error.textContent = ''
    pending = true
    button.disabled = true
    button.textContent = '校验中'
    try {
      const ok = await tryUnlockPreview(username.value, password.value)
      if (!ok) {
        error.textContent = '账号或密码不正确'
        error.hidden = false
        return
      }
      host.remove()
      onUnlocked?.()
    } catch {
      error.textContent = '当前环境无法校验口令'
      error.hidden = false
    } finally {
      pending = false
      button.disabled = false
      button.textContent = '进入'
    }
  }
}
