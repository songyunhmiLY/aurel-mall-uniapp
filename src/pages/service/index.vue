<script setup lang="ts">
import AppFrame from '@/components/chrome/AppFrame.vue'

function ask() {
  uni.showToast({ title: '演示环境已记录', icon: 'none' })
}
</script>

<template>
  <AppFrame title="联系客服">
    <view class="pad">
      <view class="card card-pad">
        <text class="fw-6 t-16">在线客服</text>
        <text class="hint mt-12">以下为演示占位。工作日可在此联系客服咨询订单、账户等问题。</text>
        <view class="btn btn-primary btn-block mt-20 hit" @click="ask">发起咨询（示意）</view>
      </view>
    </view>
  </AppFrame>
</template>
