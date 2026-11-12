<script setup lang="ts">
import { computed } from 'vue'
import AppFrame from '@/components/chrome/AppFrame.vue'
import LockPanel from '@/components/common/LockPanel.vue'
import CodeMark from '@/components/visual/CodeMark.vue'
import { copyText } from '@/demo/format'
import { saveInvitePoster } from '@/invite/save-poster'
import { openPage, routes } from '@/navigation/routes'
import { usePreviewStore } from '@/stores/preview'

const preview = usePreviewStore()
const profile = computed(() => preview.profile)

function save() {
  saveInvitePoster(profile.value.name, profile.value.inviteCode)
}
</script>

<template>
  <AppFrame title="邀请好友">
    <LockPanel
      v-if="!preview.isMember"
      title="还没有邀请码"
      text="邀请码仅向会员发放。成为会员后即可邀请他人注册。"
      action="前往创业专区"
      @action="openPage(routes.shop)"
    />
    <view v-else class="pad">
      <view class="poster">
        <text class="poster-kicker">AUREL · 科技健康</text>
        <text class="poster-title">奥瑞尔</text>
        <text class="poster-sub">邀请好友 · 关注健康科技</text>
        <svg class="poster-mark" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
          <polygon points="60,14 98,36 98,80 60,102 22,80 22,36" fill="none" stroke="#5E8F8A" stroke-width="1.2" />
          <polygon points="60,30 86,45 86,75 60,90 34,75 34,45" fill="#5E8F8A" opacity="0.9" />
        </svg>
        <view class="poster-foot">
          <view class="poster-qr">
            <CodeMark :value="profile.inviteCode" />
          </view>
          <view class="poster-meta">
            <text>我是 {{ profile.name }}</text>
            <text class="pm-hint">长按识别或扫描二维码进入</text>
          </view>
        </view>
        <view class="poster-code">
          <text class="ic-lab">我的邀请码</text>
          <text class="ic-code">{{ profile.inviteCode }}</text>
          <view class="poster-copy hit" @click="copyText(profile.inviteCode)">复制邀请码</view>
        </view>
      </view>
      <view class="btn btn-primary btn-block mt-16 hit" @click="save">保存图片</view>
    </view>
  </AppFrame>
</template>
