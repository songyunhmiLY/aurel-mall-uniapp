<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { fetchBankAccount, saveBankAccount } from '@/api/bank-account'
import { sessionErrorMessage } from '@/auth/account-session'
import AppFrame from '@/components/chrome/AppFrame.vue'
import { formatInstant } from '@/demo/format'

const accountName = ref('')
const bankName = ref('')
const accountNo = ref('')
const branchName = ref('')
const updatedAt = ref('')
const loaded = ref(false)
const pending = ref(false)
const knownEmpty = ref(false)
const errorText = ref('')

onShow(() => {
  void load()
})

async function load() {
  errorText.value = ''
  try {
    const account = await fetchBankAccount()
    knownEmpty.value = account === null
    accountName.value = account?.accountName ?? ''
    bankName.value = account?.bankName ?? ''
    accountNo.value = account?.accountNo ?? ''
    branchName.value = account?.branchName ?? ''
    updatedAt.value = account?.updatedAt ?? ''
  } catch (error) {
    errorText.value = sessionErrorMessage(error, '收款账户加载失败')
    knownEmpty.value = false
  } finally {
    loaded.value = true
  }
}

async function save() {
  if (pending.value) return
  const body = {
    accountName: accountName.value.trim(),
    bankName: bankName.value.trim(),
    accountNo: accountNo.value.trim(),
    branchName: branchName.value.trim(),
  }
  if (!body.accountName) {
    errorText.value = '开户名不正确'
    return
  }
  if (!body.bankName) {
    errorText.value = '开户银行不正确'
    return
  }
  if (!/^\d{8,30}$/.test(body.accountNo)) {
    errorText.value = '银行卡号不正确'
    return
  }
  if (!body.branchName) {
    errorText.value = '开户支行不正确'
    return
  }
  pending.value = true
  errorText.value = ''
  try {
    const saved = await saveBankAccount(body)
    accountName.value = saved.accountName
    bankName.value = saved.bankName
    accountNo.value = saved.accountNo
    branchName.value = saved.branchName
    updatedAt.value = saved.updatedAt
    knownEmpty.value = false
    uni.showToast({ title: '已保存', icon: 'none' })
  } catch (error) {
    errorText.value = sessionErrorMessage(error, '收款账户未保存')
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <AppFrame title="收款账户">
    <view class="pad">
      <text class="hint mb-12"
        >填写开户名、开户银行、银行卡号和开户支行。银行卡号为 8 到 30 位数字。</text
      >
      <view v-if="!loaded" class="empty">
        <view class="empty__title">正在读取收款账户</view>
      </view>
      <template v-else>
        <view v-if="errorText" class="notice mb-12">{{ errorText }}</view>
        <text v-if="knownEmpty" class="hint mb-12">尚未设置收款账户。</text>
        <text v-else-if="updatedAt" class="hint mb-12"
          >最近保存 {{ formatInstant(updatedAt) }}</text
        >
        <view class="field">
          <text class="field__label">开户名</text>
          <input v-model="accountName" class="field__input" maxlength="64" placeholder="开户名" />
        </view>
        <view class="field">
          <text class="field__label">开户银行</text>
          <input v-model="bankName" class="field__input" maxlength="64" placeholder="开户银行" />
        </view>
        <view class="field">
          <text class="field__label">银行卡号</text>
          <input
            v-model="accountNo"
            class="field__input"
            maxlength="30"
            placeholder="8 到 30 位数字"
          />
        </view>
        <view class="field">
          <text class="field__label">开户支行</text>
          <input v-model="branchName" class="field__input" maxlength="128" placeholder="开户支行" />
        </view>
        <view class="btn btn-primary btn-block hit" @click="save">{{
          pending ? '保存中' : '保存'
        }}</view>
      </template>
    </view>
  </AppFrame>
</template>
