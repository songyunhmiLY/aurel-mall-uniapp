<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import { fetchPaymentPassword } from '@/api/payment-password'
import { createTransfer, lookupTransfer } from '@/api/transfer'
import { walletAccount } from '@/api/wallet'
import { sessionErrorMessage } from '@/auth/account-session'
import AppFrame from '@/components/chrome/AppFrame.vue'
import { compareDecimal, copyText, yuanFen, yuanInputToFen } from '@/demo/format'
import { openPage, routes } from '@/navigation/routes'
import { usePreviewStore } from '@/stores/preview'
import { useUserStore } from '@/stores/user'
import { useWalletStore } from '@/stores/wallet'
import type { TransferLookup } from '@/types/wallet'

const preview = usePreviewStore()
const user = useUserStore()
const wallets = useWalletStore()

const step = ref<'edit' | 'confirm'>('edit')
const payeeId = ref('')
const amountYuan = ref('')
const amountFen = ref('')
const password = ref('')
const lookedUp = ref<TransferLookup | null>(null)
const passwordSet = ref<boolean | null>(null)
const pending = ref(false)
const errorText = ref('')

const availableFen = computed(() =>
  wallets.balances ? walletAccount(wallets.balances, 'consumption').availableFen : '',
)

onShow(() => {
  void wallets.load()
  void loadPassword()
})

async function loadPassword() {
  try {
    passwordSet.value = (await fetchPaymentPassword()).set
  } catch (error) {
    passwordSet.value = null
    if (!errorText.value) errorText.value = sessionErrorMessage(error, '支付密码状态加载失败')
  }
}

async function lookup() {
  if (pending.value || !preview.isMember) return
  errorText.value = ''
  const nextPayeeId = payeeId.value.trim()
  if (!/^[1-9]\d{0,18}$/.test(nextPayeeId)) {
    errorText.value = '编号不正确'
    return
  }
  if (user.userId && nextPayeeId === user.userId) {
    errorText.value = '不能转给自己'
    return
  }
  const fen = yuanInputToFen(amountYuan.value)
  if (!fen) {
    errorText.value = '金额不正确'
    return
  }
  if (availableFen.value && compareDecimal(fen, availableFen.value) > 0) {
    errorText.value = '余额不足'
    return
  }
  pending.value = true
  try {
    const found = await lookupTransfer(nextPayeeId)
    lookedUp.value = found
    amountFen.value = fen
    password.value = ''
    step.value = 'confirm'
  } catch (error) {
    lookedUp.value = null
    errorText.value = sessionErrorMessage(error, '对方不是会员')
  } finally {
    pending.value = false
  }
}

async function submit() {
  if (pending.value || !lookedUp.value || !preview.isMember) return
  if (passwordSet.value === false) {
    errorText.value = '请先设置支付密码'
    return
  }
  if (!/^\S{6,64}$/.test(password.value)) {
    errorText.value = '支付密码格式不正确'
    return
  }
  pending.value = true
  errorText.value = ''
  try {
    await createTransfer({
      payeeId: lookedUp.value.payeeId,
      amountFen: amountFen.value,
      paymentPassword: password.value,
    })
    password.value = ''
    void wallets.load()
    uni.showToast({ title: '已划转', icon: 'none' })
    setTimeout(() => uni.navigateBack(), 400)
  } catch (error) {
    password.value = ''
    errorText.value = sessionErrorMessage(error, '划转未完成')
  } finally {
    pending.value = false
  }
}

function backToEdit() {
  step.value = 'edit'
  password.value = ''
  errorText.value = ''
}
</script>

<template>
  <AppFrame title="消费划转">
    <view class="pad">
      <view v-if="!preview.isMember" class="notice">非会员不能划转</view>
      <template v-else>
        <view v-if="user.userId" class="card card-pad mb-12">
          <view class="row-between">
            <text>我的会员编号</text>
            <text class="mono fw-6">{{ user.userId }}</text>
          </view>
          <text class="fw-6 hit mt-8" @click="copyText(user.userId)">复制</text>
          <text class="hint mt-8">把这个编号发给对方，才能接收消费账户划转。</text>
        </view>
        <view v-if="errorText" class="notice mb-12">{{ errorText }}</view>
        <template v-if="step === 'edit'">
          <text class="hint mb-12">
            只划转消费账户的可用余额。不收手续费。积分、可提现、消费账户之间不能互转。
          </text>
          <view class="field">
            <text class="field__label">对方会员编号</text>
            <input
              v-model="payeeId"
              class="field__input"
              maxlength="19"
              placeholder="对方的会员编号"
            />
          </view>
          <view class="field">
            <text class="field__label">金额（元）</text>
            <input v-model="amountYuan" class="field__input" placeholder="例如 10.00" />
          </view>
          <text class="hint mb-12">
            可用消费余额 {{ availableFen ? yuanFen(availableFen) : '—' }}
          </text>
          <view class="btn btn-primary btn-block hit" @click="lookup">
            {{ pending ? '查询中' : '下一步' }}
          </view>
        </template>
        <template v-else-if="lookedUp">
          <view class="card card-pad">
            <view class="kv">
              <text class="k">收款人</text>
              <text class="v fw-6">{{ lookedUp.nickname || '未填写昵称' }}</text>
            </view>
            <view class="kv">
              <text class="k">会员编号</text>
              <text class="v">{{ lookedUp.payeeId }}</text>
            </view>
            <view class="kv">
              <text class="k">金额</text>
              <text class="v fw-6">{{ yuanFen(amountFen) }}</text>
            </view>
          </view>
          <view v-if="passwordSet === false" class="mt-12">
            <view class="notice">请先设置支付密码</view>
            <view class="btn btn-primary btn-block mt-12 hit" @click="openPage(routes.payPassword)">
              去设置支付密码
            </view>
          </view>
          <template v-else>
            <view class="field mt-12">
              <text class="field__label">支付密码</text>
              <input
                v-model="password"
                class="field__input"
                password
                maxlength="64"
                placeholder="支付密码"
              />
            </view>
            <view class="btn btn-primary btn-block hit" @click="submit">
              {{ pending ? '提交中' : '确认划转' }}
            </view>
          </template>
          <view class="btn btn-ghost btn-block mt-12 hit" @click="backToEdit">返回修改</view>
        </template>
      </template>
    </view>
  </AppFrame>
</template>
