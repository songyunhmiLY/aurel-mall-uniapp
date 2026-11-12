import { createApp, type App } from 'vue'
import PreviewGate from '@/components/auth/PreviewGate.vue'
import { isPreviewUnlocked, previewGateConfigured } from './preview-gate'

export function mountPreviewGate(): void {
  if (typeof document === 'undefined') return
  if (!previewGateConfigured() || isPreviewUnlocked()) return
  const host = document.createElement('div')
  host.id = 'preview-gate-root'
  document.body.appendChild(host)
  const app: App<Element> = createApp(PreviewGate, {
    onPassed() {
      app.unmount()
      host.remove()
    },
  })
  app.mount(host)
}
