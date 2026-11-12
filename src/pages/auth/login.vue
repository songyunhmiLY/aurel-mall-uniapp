<script setup lang="ts">
import {
  handlePhoneNumberEvent,
  isMpWeixin,
  requestWechatLoginCode,
  type PhoneAuthEvent,
} from '@/platform/mp-weixin'

function onH5Hint() {
  uni.showToast({ title: '登录方式尚未确定', icon: 'none' })
}

function onWechatLogin() {
  requestWechatLoginCode()
    .then(() => {
      uni.showToast({ title: '已取得 code，规则未定', icon: 'none' })
    })
    .catch(() => {
      uni.showToast({ title: '微信登录未完成', icon: 'none' })
    })
}

function onGetPhoneNumber(event: PhoneAuthEvent) {
  handlePhoneNumberEvent(event)
  uni.showToast({ title: '手机号规则尚未确定', icon: 'none' })
}
</script>

<template>
  <view class="page">
    <text class="h1">登录</text>
    <text class="muted">登录方式尚未确定。此页不创建会话。</text>
    <button v-if="isMpWeixin" class="btn" @click="onWechatLogin">微信登录（占位）</button>
    <button
      v-if="isMpWeixin"
      class="btn btn--ghost"
      open-type="getPhoneNumber"
      @getphonenumber="onGetPhoneNumber"
    >
      微信手机号（占位）
    </button>
    <button v-if="!isMpWeixin" class="btn" @click="onH5Hint">登录（占位）</button>
  </view>
</template>
