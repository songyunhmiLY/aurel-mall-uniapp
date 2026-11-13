<script setup lang="ts">
import { ref, watch } from 'vue'
import { PREVIEW_SUBJECT_MEMBER, PREVIEW_SUBJECT_NONMEMBER } from '@/api/auth'

/**
 * 全部模拟用户共用的预览口令。
 * 只在这个 H5 页面上核对，不放进登录请求，也不入库。
 */
const PREVIEW_ACCOUNT_PASSWORD = '123456'

const props = defineProps<{
  pending: boolean
  remembered: string
}>()

const emit = defineEmits<{
  enter: [subject: string]
  error: [message: string]
}>()

const account = ref(props.remembered)
const password = ref('')

watch(
  () => props.remembered,
  (value) => {
    account.value = value
  },
)

function submitAccount() {
  if (props.pending) return
  if (password.value !== PREVIEW_ACCOUNT_PASSWORD) {
    emit('error', '账号或密码不正确')
    return
  }
  emit('enter', account.value.trim())
}

function useQuick(subject: string) {
  if (props.pending) return
  account.value = subject
  emit('enter', subject)
}
</script>

<template>
  <view>
    <view class="field">
      <text class="field__label">账号</text>
      <input
        v-model="account"
        class="auth-input"
        maxlength="64"
        type="text"
        placeholder="例如 wx.LuckyPanda000"
      />
    </view>
    <view class="field">
      <text class="field__label">密码</text>
      <input
        v-model="password"
        class="auth-input"
        password
        maxlength="64"
        placeholder="密码"
        @confirm="submitAccount"
      />
    </view>
    <view class="btn btn-gold btn-block hit" @click="submitAccount">登录</view>
    <view class="btn btn-gold btn-block hit" @click="useQuick(PREVIEW_SUBJECT_MEMBER)"
      >preview-member</view
    >
    <view class="btn btn-ghost btn-block mt-12 hit" @click="useQuick(PREVIEW_SUBJECT_NONMEMBER)"
      >preview-nonmember</view
    >
  </view>
</template>
