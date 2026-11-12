<script setup lang="ts">
import { computed } from 'vue'
import AppFrame from '@/components/chrome/AppFrame.vue'
import { openPage, resetTo, routes } from '@/navigation/routes'
import { usePreviewStore } from '@/stores/preview'

const preview = usePreviewStore()
const passLab = computed(() => (preview.payPassword ? '已设置' : '未设置'))

function logout() {
  preview.setRole('guest')
  resetTo(routes.login)
}
</script>

<template>
  <AppFrame title="设置">
    <view class="pad">
      <view class="list-group">
        <view class="list-cell">
          <text class="cell-body">当前账号</text>
          <text class="muted t-13">{{ preview.profile.phone || preview.profile.name || '未登录' }}</text>
        </view>
        <view class="list-cell hit" @click="openPage(routes.addresses)">
          <text class="cell-body">收货地址</text>
          <view class="chevron" />
        </view>
        <view class="list-cell hit" @click="openPage(routes.paymentAccount)">
          <text class="cell-body">收款账户</text>
          <view class="chevron" />
        </view>
        <view class="list-cell hit" @click="openPage(routes.payPassword)">
          <text class="cell-body">支付密码设置</text>
          <text class="muted t-13">{{ passLab }}</text>
          <view class="chevron" />
        </view>
      </view>
      <view class="list-group mt-16">
        <view class="list-cell hit" @click="openPage(routes.agreements)">
          <text class="cell-body">用户协议</text>
          <view class="chevron" />
        </view>
        <view class="list-cell hit" @click="openPage(routes.privacy)">
          <text class="cell-body">隐私政策</text>
          <view class="chevron" />
        </view>
      </view>
      <view class="btn btn-ghost btn-block mt-20 hit" @click="logout">退出登录</view>
      <text class="hint center mt-16">奥瑞尔 AUREL · 预览版本</text>
    </view>
  </AppFrame>
</template>
