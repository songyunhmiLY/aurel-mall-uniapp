<script setup lang="ts">
import { watch } from 'vue'
import { onLaunch, onShow } from '@dcloudio/uni-app'
import { getToken } from '@/auth/session'
import { captureLaunchInviteCode } from '@/invite/code'
import { needsInviteRegistration, registrationUrl } from '@/invite/registration'
import { resetTo } from '@/navigation/routes'
import { useUserStore } from '@/stores/user'

const user = useUserStore()

function redirectUnregistered() {
  if (!needsInviteRegistration()) return
  const pages = getCurrentPages()
  const current = pages[pages.length - 1] as { route?: string } | undefined
  const route = current?.route ?? ''
  if (!route || route.includes('pages/auth/')) return
  resetTo(registrationUrl())
}

onLaunch(() => {
  captureLaunchInviteCode()
  // #ifdef H5
  void import('@/auth/mount-preview-gate').then((mod) => {
    mod.mountPreviewGate(() => {
      void import('@/auth/preview-entry').then((entry) => entry.ensurePreviewSession())
    })
  })
  // #endif
  // #ifdef MP-WEIXIN
  if (!getToken()) return
  void import('@/auth/preview-entry').then((entry) => entry.refreshSignedInUser())
  // #endif
})

onShow(() => {
  redirectUnregistered()
})

watch(
  () => [user.userId, user.member] as const,
  () => {
    redirectUnregistered()
  },
)
</script>

<style lang="scss">
@use './styles/global.scss';
/* #ifdef H5 */
@use './styles/phone-frame.scss';
/* #endif */
</style>
