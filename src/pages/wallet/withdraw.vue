<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import { fetchBankAccount } from '@/api/bank-account'
import { fetchKyc } from '@/api/kyc'
import { walletAccount } from '@/api/wallet'
import { applyWithdrawal } from '@/api/withdrawal'
import { sessionErrorMessage } from '@/auth/account-session'
import AppFrame from '@/components/chrome/AppFrame.vue'
import { compareDecimal, yuanFen, yuanInputToFen } from '@/demo/format'
import { openPage, routes, withId } from '@/navigation/routes'
import { usePreviewStore } from '@/stores/preview'
import { useWalletStore } from '@/stores/wallet'

const MIN_WITHDRAWAL_FEN = '10000'

type Gate = 'loading' | 'kyc' | 'bank' | 'ready' | 'error'

const preview = usePreviewStore()
const wallets = useWalletStore()
const amountYuan = ref('')
const pending = ref(false)
const gate = ref<Gate>('loading')
const memberBlocked = ref(false)
const errorText = ref('')

const availableFen = computed(() =>
  wallets.balances ? walletAccount(wallets.balances, 'withdrawable').availableFen : '',
)
const blocked = computed(() => !preview.isMember || memberBlocked.value)

onShow(() => {
  void wallets.load()
  void load()
})

async function load() {
  memberBlocked.value = false
  if (!preview.isMember) {
    gate.value = 'ready'
    return
  }
  gate.value = 'loading'
  errorText.value = ''
  try {
    const [kyc, bank] = await Promise.all([fetchKyc(), fetchBankAccount()])
    if (!kyc.verified) gate.value = 'kyc'
    else if (!bank) gate.value = 'bank'
    else gate.value = 'ready'
  } catch (error) {
    gate.value = 'error'
    errorText.value = sessionErrorMessage(error, '提现资料加载失败')
  }
}

async function submit() {
  if (pending.value || blocked.value || gate.value !== 'ready') return
  const fen = yuanInputToFen(amountYuan.value)
  if (!fen) {
    errorText.value = '金额不正确'
    return
  }
  if (compareDecimal(fen, MIN_WITHDRAWAL_FEN) < 0) {
    errorText.value = '提现金额不能低于 100 元'
    return
  }
  if (availableFen.value && compareDecimal(fen, availableFen.value) > 0) {
    errorText.value = '余额不足'
    return
  }
  pending.value = true
  errorText.value = ''
  try {
    const created = await applyWithdrawal(fen)
    amountYuan.value = ''
    void wallets.load()
    uni.showToast({ title: '已提交申请', icon: 'none' })
    openPage(withId(routes.withdrawalDetail, created.id))
  } catch (error) {
    const message = sessionErrorMessage(error, '提现未申请')
    if (message.includes('非会员不能提现')) {
      memberBlocked.value = true
      errorText.value = ''
      return
    }
    if (message.includes('请先完成实名认证')) {
      gate.value = 'kyc'
      errorText.value = ''
      return
    }
    if (message.includes('请先设置收款账户')) {
      gate.value = 'bank'
      errorText.value = ''
      return
    }
    errorText.value = message
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <AppFrame title="申请提现">
    <view class="pad">
      <view v-if="blocked" class="notice">非会员不能提现</view>
      <template v-else>
        <view v-if="gate === 'loading'" class="empty">
          <view class="empty__title">正在读取提现资料</view>
        </view>
        <template v-else-if="gate === 'error'">
          <view class="notice">{{ errorText }}</view>
          <view class="btn btn-ghost btn-block mt-12 hit" @click="openPage(routes.realName)">
            查看实名认证
          </view>
          <view class="btn btn-ghost btn-block mt-12 hit" @click="openPage(routes.paymentAccount)">
            查看收款账户
          </view>
        </template>
        <template v-else-if="gate === 'kyc'">
          <view class="notice">请先完成实名认证</view>
          <view class="btn btn-primary btn-block mt-12 hit" @click="openPage(routes.realName)">
            去实名认证
          </view>
        </template>
        <template v-else-if="gate === 'bank'">
          <view class="notice">请先设置收款账户</view>
          <view
            class="btn btn-primary btn-block mt-12 hit"
            @click="openPage(routes.paymentAccount)"
          >
            去设置收款账户
          </view>
        </template>
        <template v-else>
          <view v-if="errorText" class="notice mb-12">{{ errorText }}</view>
          <text class="hint mb-12">
            提交后由工作人员审核，系统不会自动打款。手续费在打款时确定，申请时不会锁定。最低 100
            元。
          </text>
          <view class="field">
            <text class="field__label">提现金额（元）</text>
            <input v-model="amountYuan" class="field__input" placeholder="最低 100 元" />
          </view>
          <text class="hint mb-12">
            可提现可用余额 {{ availableFen ? yuanFen(availableFen) : '—' }}
          </text>
          <view class="btn btn-primary btn-block hit" @click="submit">
            {{ pending ? '提交中' : '提交申请' }}
          </view>
        </template>
        <view class="btn btn-ghost btn-block mt-12 hit" @click="openPage(routes.withdrawals)">
          提现记录
        </view>
      </template>
    </view>
  </AppFrame>
</template>
