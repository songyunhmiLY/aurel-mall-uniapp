<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { postMiniLogin, postMiniPhone, type PreviewPersona } from '@/api/auth'
import { apiErrorMessage } from '@/api/http'
import { acceptSession, noteAuthFailure } from '@/auth/account-session'
import { switchPreviewPersona } from '@/auth/preview-entry'
import AppFrame from '@/components/chrome/AppFrame.vue'
import { openPage, resetTo, routes } from '@/navigation/routes'
import {
  isMpWeixin,
  readPhoneAuthCode,
  requestWechatLoginCode,
  type PhoneAuthEvent,
} from '@/platform/mp-weixin'
import { useUserStore } from '@/stores/user'

const user = useUserStore()
const pending = ref(false)
const errorText = ref('')

onShow(() => {
  errorText.value = user.authError
})

async function onWechatLogin() {
  if (pending.value) return
  pending.value = true
  errorText.value = ''
  try {
    const code = await requestWechatLoginCode()
    const session = await postMiniLogin({ code })
    acceptSession(session)
    uni.showToast({ title: '登录成功', icon: 'none' })
    resetTo(routes.home)
  } catch (error) {
    errorText.value = noteAuthFailure(error, '微信登录未完成')
  } finally {
    pending.value = false
  }
}

async function onGetPhoneNumber(event: PhoneAuthEvent) {
  const code = readPhoneAuthCode(event)
  if (!code) {
    uni.showToast({ title: '未取得手机号', icon: 'none' })
    return
  }
  if (!user.token) {
    uni.showToast({ title: '请先完成微信登录', icon: 'none' })
    return
  }
  try {
    await postMiniPhone({ code })
    uni.showToast({ title: '手机号已提交', icon: 'none' })
  } catch (error) {
    uni.showToast({ title: apiErrorMessage(error, '手机号未提交'), icon: 'none' })
  }
}

async function enterPreview(persona: PreviewPersona) {
  if (pending.value) return
  pending.value = true
  errorText.value = ''
  try {
    await switchPreviewPersona(persona)
    resetTo(routes.home)
  } catch (error) {
    errorText.value = apiErrorMessage(error, '预览会话未建立')
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <AppFrame title="登录" ink guest-ok :back="false">
    <view v-if="isMpWeixin" class="auth-page">
      <text class="auth-brand">AUREL</text>
      <text class="auth-title">欢迎回来</text>
      <text class="auth-sub">使用微信登录后继续。手机号不是登录账号，可以稍后再绑定。</text>
      <view v-if="errorText" class="notice">{{ errorText }}</view>
      <button class="btn btn-gold btn-block" :disabled="pending" @click="onWechatLogin">
        微信登录
      </button>
      <button
        class="btn btn-ghost btn-block mt-12"
        open-type="getPhoneNumber"
        @getphonenumber="onGetPhoneNumber"
      >
        绑定手机号
      </button>
      <view class="auth-switch">
        还没有账号？
        <text class="auth-link hit" @click="openPage(routes.register)">立即注册</text>
      </view>
    </view>
    <view v-else class="auth-page">
      <text class="auth-brand">AUREL</text>
      <text class="auth-title">预览会话</text>
      <text class="auth-sub">这是 H5 开发预览，用来申请测试用户。不是微信登录。</text>
      <view v-if="errorText" class="notice">{{ errorText }}</view>
      <view class="btn btn-gold btn-block hit" @click="enterPreview('member')">会员测试用户</view>
      <view class="btn btn-ghost btn-block mt-12 hit" @click="enterPreview('nonmember')"
        >非会员测试用户</view
      >
    </view>
  </AppFrame>
</template>
