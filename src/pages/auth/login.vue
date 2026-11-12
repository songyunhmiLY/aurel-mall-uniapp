<script setup lang="ts">
import { ref } from 'vue'
import AppFrame from '@/components/chrome/AppFrame.vue'
import { openPage, resetTo, routes } from '@/navigation/routes'
import {
  handlePhoneNumberEvent,
  isMpWeixin,
  requestWechatLoginCode,
  type PhoneAuthEvent,
} from '@/platform/mp-weixin'
import { usePreviewStore } from '@/stores/preview'

const preview = usePreviewStore()
const phone = ref('17600008841')
const password = ref('••••••')

function login() {
  if (!phone.value.trim() || !password.value) {
    uni.showToast({ title: '请填写手机号和密码', icon: 'none' })
    return
  }
  preview.setRole('member')
  uni.showToast({ title: '登录成功', icon: 'none' })
  resetTo(routes.home)
}

function onWechatLogin() {
  requestWechatLoginCode()
    .then(() => uni.showToast({ title: '已取得 code，规则未定', icon: 'none' }))
    .catch(() => uni.showToast({ title: '微信登录未完成', icon: 'none' }))
}

function onGetPhoneNumber(event: PhoneAuthEvent) {
  handlePhoneNumberEvent(event)
  uni.showToast({ title: '手机号规则尚未确定', icon: 'none' })
}
</script>

<template>
  <AppFrame title="登录" ink guest-ok :back="false">
    <view class="auth-page">
      <text class="auth-brand">AUREL</text>
      <text class="auth-title">欢迎回来</text>
      <text class="auth-sub">登录后继续使用奥瑞尔。我们以科技与健康为方向。</text>
      <view class="field">
        <text class="field__label">手机号</text>
        <input v-model="phone" class="auth-input" type="number" placeholder="请输入手机号" />
      </view>
      <view class="field">
        <text class="field__label">密码</text>
        <input v-model="password" class="auth-input" password placeholder="请输入密码" />
      </view>
      <view class="btn btn-gold btn-block hit" @click="login">登 录</view>
      <button v-if="isMpWeixin" class="btn btn-ghost btn-block mt-12" @click="onWechatLogin">微信登录（占位）</button>
      <button
        v-if="isMpWeixin"
        class="btn btn-ghost btn-block mt-12"
        open-type="getPhoneNumber"
        @getphonenumber="onGetPhoneNumber"
      >
        微信手机号（占位）
      </button>
      <view class="auth-switch">
        还没有账号？
        <text class="auth-link hit" @click="openPage(routes.register)">立即注册</text>
      </view>
    </view>
  </AppFrame>
</template>
