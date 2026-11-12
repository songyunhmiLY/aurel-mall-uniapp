<script setup lang="ts">
import { ref } from 'vue'
import AppFrame from '@/components/chrome/AppFrame.vue'
import { openPage, resetTo, routes } from '@/navigation/routes'
import { usePreviewStore } from '@/stores/preview'

const preview = usePreviewStore()
const phone = ref('')
const password = ref('')
const confirm = ref('')
const invite = ref('AR8K2Q')

function register() {
  if (!phone.value.trim()) {
    uni.showToast({ title: '请填写手机号', icon: 'none' })
    return
  }
  if (!password.value || password.value !== confirm.value) {
    uni.showToast({ title: '请确认两次密码一致', icon: 'none' })
    return
  }
  if (!invite.value.trim()) {
    uni.showToast({ title: '请填写已有会员的邀请码', icon: 'none' })
    return
  }
  preview.setRole('nonmember')
  uni.showToast({ title: '注册成功', icon: 'none' })
  resetTo(routes.home)
}
</script>

<template>
  <AppFrame title="注册" ink guest-ok>
    <view class="auth-page">
      <text class="auth-brand">AUREL</text>
      <text class="auth-title">创建账号</text>
      <text class="auth-sub">注册为免费用户。邀请码须来自已有会员，注册后即可在创业专区下单成为会员。</text>
      <view class="field">
        <text class="field__label">手机号</text>
        <input v-model="phone" class="auth-input" type="number" placeholder="请输入手机号" />
      </view>
      <view class="field">
        <text class="field__label">密码</text>
        <input v-model="password" class="auth-input" password placeholder="设置登录密码" />
      </view>
      <view class="field">
        <text class="field__label">确认密码</text>
        <input v-model="confirm" class="auth-input" password placeholder="再次输入密码" />
      </view>
      <view class="field">
        <text class="field__label">邀请码</text>
        <input v-model="invite" class="auth-input" placeholder="请填写已有会员的邀请码" />
      </view>
      <text class="hint">没有邀请码将无法完成注册。邀请码仅由会员持有。</text>
      <view class="btn btn-gold btn-block hit" @click="register">注 册</view>
      <view class="auth-switch">
        已有账号？
        <text class="auth-link hit" @click="openPage(routes.login)">去登录</text>
      </view>
    </view>
  </AppFrame>
</template>
