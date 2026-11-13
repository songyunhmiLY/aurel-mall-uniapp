<script setup lang="ts">
import { onLoad, onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { fetchWithdrawal } from '@/api/withdrawal'
import { sessionErrorMessage } from '@/auth/account-session'
import AppFrame from '@/components/chrome/AppFrame.vue'
import { formatInstant, yuanFen } from '@/demo/format'
import { withdrawalStatusLabel } from '@/wallet/labels'
import type { WithdrawalView } from '@/types/wallet'

const withdrawalId = ref('')
const item = ref<WithdrawalView | null>(null)
const loaded = ref(false)
const errorText = ref('')
let requestSerial = 0

onLoad((query) => {
  withdrawalId.value = typeof query?.id === 'string' ? query.id : ''
})

onShow(() => {
  void load()
})

async function load() {
  const serial = ++requestSerial
  if (!withdrawalId.value) {
    loaded.value = true
    errorText.value = '提现申请不存在'
    return
  }
  errorText.value = ''
  try {
    const next = await fetchWithdrawal(withdrawalId.value)
    if (serial !== requestSerial) return
    item.value = next
  } catch (error) {
    if (serial !== requestSerial) return
    item.value = null
    errorText.value = sessionErrorMessage(error, '提现申请加载失败')
  } finally {
    if (serial === requestSerial) loaded.value = true
  }
}
</script>

<template>
  <AppFrame title="提现详情">
    <view v-if="!loaded" class="empty">
      <view class="empty__title">正在读取提现申请</view>
    </view>
    <view v-else-if="!item" class="empty">
      <view class="empty__title">{{ errorText || '提现申请不存在' }}</view>
    </view>
    <view v-else class="pad">
      <view v-if="errorText" class="notice mb-12">{{ errorText }}</view>
      <view class="card card-pad">
        <view class="kv">
          <text class="k">金额</text>
          <text class="v fw-6">{{ yuanFen(item.amountFen) }}</text>
        </view>
        <view class="kv">
          <text class="k">状态</text>
          <text class="v">{{ withdrawalStatusLabel(item.status) }}</text>
        </view>
        <view class="kv">
          <text class="k">申请时间</text>
          <text class="v">{{ formatInstant(item.appliedAt) }}</text>
        </view>
      </view>
      <view class="card card-pad mt-12">
        <text class="fw-6">收款账户快照</text>
        <view class="kv">
          <text class="k">开户名</text>
          <text class="v">{{ item.accountName }}</text>
        </view>
        <view class="kv">
          <text class="k">开户银行</text>
          <text class="v">{{ item.bankName }}</text>
        </view>
        <view class="kv">
          <text class="k">开户支行</text>
          <text class="v">{{ item.branchName }}</text>
        </view>
        <view class="kv">
          <text class="k">银行卡号</text>
          <text class="v">{{ item.accountNo }}</text>
        </view>
      </view>
      <view class="card card-pad mt-12">
        <text class="fw-6">审核结果</text>
        <text v-if="!item.settlement" class="hint mt-8">工作人员尚未处理。系统不会自动打款。</text>
        <template v-else>
          <view class="kv">
            <text class="k">结果</text>
            <text class="v">{{ withdrawalStatusLabel(item.settlement.outcome) }}</text>
          </view>
          <view class="kv">
            <text class="k">申请金额</text>
            <text class="v">{{ yuanFen(item.settlement.amountFen) }}</text>
          </view>
          <view class="kv">
            <text class="k">手续费</text>
            <text class="v">{{
              item.settlement.feeFen === null ? '—' : yuanFen(item.settlement.feeFen)
            }}</text>
          </view>
          <view class="kv">
            <text class="k">打款金额</text>
            <text class="v">{{
              item.settlement.payoutFen === null ? '—' : yuanFen(item.settlement.payoutFen)
            }}</text>
          </view>
          <view class="kv">
            <text class="k">处理编号</text>
            <text class="v">{{ item.settlement.adminId }}</text>
          </view>
          <view class="kv">
            <text class="k">处理时间</text>
            <text class="v">{{ formatInstant(item.settlement.settledAt) }}</text>
          </view>
        </template>
      </view>
    </view>
  </AppFrame>
</template>
