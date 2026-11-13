<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import { refreshSignedInUser } from '@/auth/preview-entry'
import AppFrame from '@/components/chrome/AppFrame.vue'
import LockPanel from '@/components/common/LockPanel.vue'
import InviteQr from '@/components/visual/InviteQr.vue'
import { copyText } from '@/demo/format'
import { isInviteCode } from '@/invite/code'
import { saveInvitePoster } from '@/invite/save-poster'
import { openPage, routes } from '@/navigation/routes'
import { useUserStore } from '@/stores/user'

const user = useUserStore()
const refreshing = ref(false)
const shareCode = computed(() =>
  user.inviteCode && isInviteCode(user.inviteCode) ? user.inviteCode : '',
)

onShow(() => {
  if (!user.token) return
  refreshing.value = true
  void refreshSignedInUser({ quiet: true }).finally(() => {
    refreshing.value = false
  })
})

function save() {
  if (!shareCode.value) return
  saveInvitePoster(user.nickname || '会员', shareCode.value)
}
</script>

<template>
  <AppFrame title="邀请好友">
    <view v-if="refreshing && !shareCode" class="empty">
      <view class="empty__title">正在读取邀请码</view>
    </view>
    <LockPanel
      v-else-if="!shareCode"
      title="还没有邀请码"
      text="邀请码在创业专区订单支付成功后发放。填写他人的邀请码不会把自己变成会员，登录也不会自动绑定邀请人。"
      action="前往创业专区"
      @action="openPage(routes.shop)"
    />
    <view v-else class="pad">
      <view class="poster">
        <text class="poster-kicker">AUREL · 科技健康</text>
        <text class="poster-title">奥瑞尔</text>
        <text class="poster-sub">邀请好友 · 关注健康科技</text>
        <svg class="poster-mark" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
          <polygon
            points="60,14 98,36 98,80 60,102 22,80 22,36"
            fill="none"
            stroke="#5E8F8A"
            stroke-width="1.2"
          />
          <polygon points="60,30 86,45 86,75 60,90 34,75 34,45" fill="#5E8F8A" opacity="0.9" />
        </svg>
        <view class="poster-foot">
          <view class="poster-qr">
            <InviteQr :code="shareCode" />
          </view>
          <view class="poster-meta">
            <text>我是 {{ user.nickname || '会员' }}</text>
            <text class="pm-hint">长按识别或扫描二维码进入</text>
          </view>
        </view>
        <view class="poster-code">
          <text class="ic-lab">我的邀请码</text>
          <text class="ic-code">{{ shareCode }}</text>
          <view class="poster-copy hit" @click="copyText(shareCode)">复制邀请码</view>
        </view>
      </view>
      <view class="btn btn-primary btn-block mt-16 hit" @click="save">保存图片</view>
    </view>
  </AppFrame>
</template>
