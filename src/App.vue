<script setup lang="ts">
import { onLaunch } from '@dcloudio/uni-app'

onLaunch(() => {
  // #ifdef H5
  void import('@/auth/mount-preview-gate').then((mod) => mod.mountPreviewGate())
  // #endif
})
</script>

<style lang="scss">
@use './styles/global.scss';
/* #ifdef H5 */
@use './styles/phone-frame.scss';
/* #endif */
</style>
