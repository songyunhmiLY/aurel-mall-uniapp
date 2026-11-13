<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { fetchPaymentPassword, setPaymentPassword } from '@/api/payment-password'
import { sessionErrorMessage } from '@/auth/account-session'
import AppFrame from '@/components/chrome/AppFrame.vue'

const statusKnown = ref(false)
const alreadySet = ref(false)
const password = ref('')
const confirmPassword = ref('')
const pending = ref(false)
const errorText = ref('')

onShow(() => {
  void load()
})

async function load() {
  errorText.value = ''
  try {
    const status = await fetchPaymentPassword()
    alreadySet.value = status.set
    statusKnown.value = true
  } catch (error) {
    statusKnown.value = false
    errorText.value = sessionErrorMessage(error, '支付密码状态加载失败')
  }
}

async function save() {
  if (pending.value || alreadySet.value) return
  if (password.value !== confirmPassword.value) {
    errorText.value = '两次输入不一致'
    return
  }
  if (!/^\S{6,64}$/.test(password.value)) {
    errorText.value = '支付密码格式不正确'
    return
  }
  pending.value = true
  errorText.value = ''
  try {
    alreadySet.value = (await setPaymentPassword(password.value)).set
    statusKnown.value = true
    password.value = ''
    confirmPassword.value = ''
    uni.showToast({ title: '已设置支付密码', icon: 'none' })
  } catch (error) {
    errorText.value = sessionErrorMessage(error, '支付密码未设置')
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <AppFrame title="支付密码设置">
    <view class="pad">
      <text class="hint mb-12">
        支付密码只在确认消费划转时使用。长度为 6 到 64 位，不能包含空格。设置后不能在这里修改。
      </text>
      <view v-if="errorText" class="notice mb-12">{{ errorText }}</view>
      <view v-if="statusKnown && alreadySet" class="notice notice-ok">支付密码已设置</view>
      <template v-else-if="statusKnown">
        <view class="field">
          <text class="field__label">支付密码</text>
          <input
            v-model="password"
            class="field__input"
            password
            maxlength="64"
            placeholder="6 到 64 位，不能包含空格"
          />
        </view>
        <view class="field">
          <text class="field__label">确认密码</text>
          <input
            v-model="confirmPassword"
            class="field__input"
            password
            maxlength="64"
            placeholder="请再次输入"
          />
        </view>
        <view class="btn btn-primary btn-block hit" @click="save">
          {{ pending ? '提交中' : '完成设置' }}
        </view>
      </template>
    </view>
  </AppFrame>
</template>
