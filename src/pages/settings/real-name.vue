<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { fetchKyc, submitKyc } from '@/api/kyc'
import { ApiError } from '@/api/http'
import { sessionErrorMessage } from '@/auth/account-session'
import AppFrame from '@/components/chrome/AppFrame.vue'

const name = ref('')
const idNumber = ref('')
const mobile = ref('')
const verified = ref(false)
const loaded = ref(false)
const pending = ref(false)
const errorText = ref('')

onShow(() => {
  void load()
})

async function load() {
  errorText.value = ''
  try {
    const profile = await fetchKyc()
    verified.value = profile.verified
    name.value = profile.name
    idNumber.value = profile.idNumber
    mobile.value = profile.mobile
  } catch (error) {
    verified.value = false
    if (!(error instanceof ApiError && error.statusCode === 404)) {
      errorText.value = sessionErrorMessage(error, '实名信息加载失败')
    }
  } finally {
    loaded.value = true
  }
}

async function save() {
  if (pending.value || verified.value) return
  const body = {
    name: name.value.trim(),
    idNumber: idNumber.value.trim(),
    mobile: mobile.value.trim(),
  }
  if (!body.name || !body.idNumber || !body.mobile) {
    uni.showToast({ title: '请填写姓名、身份证号和手机号', icon: 'none' })
    return
  }
  pending.value = true
  errorText.value = ''
  try {
    const profile = await submitKyc(body)
    verified.value = profile.verified
    name.value = profile.name || body.name
    idNumber.value = profile.idNumber || body.idNumber
    mobile.value = profile.mobile || body.mobile
    uni.showToast({ title: profile.verified ? '已完成实名认证' : '已提交', icon: 'none' })
  } catch (error) {
    errorText.value = sessionErrorMessage(error, '实名认证未提交')
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <AppFrame title="实名认证">
    <view class="pad">
      <view v-if="verified" class="notice notice-ok">已完成实名认证</view>
      <text v-else class="hint">填写姓名、身份证号和手机号。不需要上传证件照。</text>
      <view v-if="errorText" class="notice mt-12">{{ errorText }}</view>
      <view v-if="loaded" class="mt-16">
        <view class="field">
          <text class="field__label">姓名</text>
          <input
            v-model="name"
            class="field__input"
            :disabled="verified"
            maxlength="64"
            placeholder="请输入姓名"
          />
        </view>
        <view class="field">
          <text class="field__label">身份证号</text>
          <input
            v-model="idNumber"
            class="field__input"
            :disabled="verified"
            maxlength="32"
            placeholder="请输入身份证号"
          />
        </view>
        <view class="field">
          <text class="field__label">手机号</text>
          <input
            v-model="mobile"
            class="field__input"
            :disabled="verified"
            maxlength="20"
            type="number"
            placeholder="请输入手机号"
          />
        </view>
        <view v-if="!verified" class="btn btn-primary btn-block hit" @click="save">提交认证</view>
      </view>
    </view>
  </AppFrame>
</template>
