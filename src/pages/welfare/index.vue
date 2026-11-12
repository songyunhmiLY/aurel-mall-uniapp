<script setup lang="ts">
import { ref } from 'vue'
import AppFrame from '@/components/chrome/AppFrame.vue'

const signed = ref(false)

function sign() {
  signed.value = true
  uni.showToast({ title: '已报名当日红包', icon: 'none' })
}
</script>

<template>
  <AppFrame title="福利专场">
    <view class="welfare-hero">
      <text class="home-kicker">WELFARE</text>
      <text class="hero-title">福利专场</text>
      <text class="t-13 mt-8" style="color: #b7afa4; line-height: 1.7">文案与图片由管理端配置，此处为演示占位。</text>
    </view>
    <view class="welfare-status">
      <view class="ws-row">
        <text><text class="dot-mark dot-ok" />参与资格</text>
        <text class="fw-6">已具备</text>
      </view>
      <view class="ws-row">
        <text><text class="dot-mark" :class="signed ? 'dot-gold' : 'dot-off'" />当天报名</text>
        <text class="fw-6">{{ signed ? '已报名' : '未报名' }}</text>
      </view>
    </view>
    <view class="pad">
      <view v-if="signed" class="btn btn-ghost btn-block">已报名</view>
      <view v-else class="btn btn-gold btn-block hit" @click="sign">抢红包</view>
      <text class="hint center mt-12">
        {{ signed ? '今日已报名，当日重复点击只计一次。' : '点击即参加当天红包。须在当天结束前完成报名。' }}
      </text>
    </view>
  </AppFrame>
</template>
