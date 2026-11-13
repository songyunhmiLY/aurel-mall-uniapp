<script setup lang="ts">
import { onLoad, onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { fetchRefund } from '@/api/refund'
import { sessionErrorMessage } from '@/auth/account-session'
import AppFrame from '@/components/chrome/AppFrame.vue'
import { formatInstant, yuanFen } from '@/demo/format'
import { openPage, routes, withId } from '@/navigation/routes'
import { refundStatusLabel, wechatRefundStatusLabel } from '@/orders/labels'
import type { RefundView } from '@/types/refund'

const refundId = ref('')
const item = ref<RefundView | null>(null)
const loaded = ref(false)
const errorText = ref('')
let requestSerial = 0

onLoad((query) => {
  refundId.value = typeof query?.id === 'string' ? query.id : ''
})

onShow(() => {
  void load()
})

async function load() {
  const serial = ++requestSerial
  if (!refundId.value) {
    loaded.value = true
    errorText.value = '退款申请不存在'
    return
  }
  errorText.value = ''
  try {
    const next = await fetchRefund(refundId.value)
    if (serial !== requestSerial) return
    item.value = next
  } catch (error) {
    if (serial !== requestSerial) return
    item.value = null
    errorText.value = sessionErrorMessage(error, '退款申请加载失败')
  } finally {
    if (serial === requestSerial) loaded.value = true
  }
}
</script>

<template>
  <AppFrame title="退款详情">
    <view v-if="!loaded" class="empty">
      <view class="empty__title">正在读取退款申请</view>
    </view>
    <view v-else-if="!item" class="empty">
      <view class="empty__title">{{ errorText || '退款申请不存在' }}</view>
    </view>
    <view v-else class="pad">
      <view class="card card-pad">
        <view class="kv">
          <text class="k">状态</text>
          <text class="v">{{ refundStatusLabel(item.status) }}</text>
        </view>
        <view class="kv">
          <text class="k">订单</text>
          <text class="v hit" @click="openPage(withId(routes.orderDetail, item.orderId))">{{
            item.orderId
          }}</text>
        </view>
        <view class="kv">
          <text class="k">应付</text>
          <text class="v">{{ yuanFen(item.payAmountFen) }}</text>
        </view>
        <view class="kv">
          <text class="k">运费</text>
          <text class="v">{{ yuanFen(item.freightFen) }}</text>
        </view>
        <view class="kv">
          <text class="k">申请时间</text>
          <text class="v">{{ formatInstant(item.appliedAt) }}</text>
        </view>
        <view v-if="item.decidedAt" class="kv">
          <text class="k">处理时间</text>
          <text class="v">{{ formatInstant(item.decidedAt) }}</text>
        </view>
      </view>
      <view class="notice mt-12">{{ item.deductionHint }}</view>
      <view v-if="item.status === 'approved'" class="card card-pad mt-12">
        <view class="kv">
          <text class="k">退款金额</text>
          <text class="v">{{ item.refundFen === null ? '—' : yuanFen(item.refundFen) }}</text>
        </view>
        <view class="kv">
          <text class="k">减扣</text>
          <text class="v">{{ item.deductionFen === null ? '—' : yuanFen(item.deductionFen) }}</text>
        </view>
        <view class="kv">
          <text class="k">微信退款</text>
          <text class="v">{{
            item.wechatRefundFen === null ? '—' : yuanFen(item.wechatRefundFen)
          }}</text>
        </view>
        <view class="kv">
          <text class="k">可提现减扣</text>
          <text class="v">{{
            item.withdrawableDeductionFen === null ? '—' : yuanFen(item.withdrawableDeductionFen)
          }}</text>
        </view>
        <view class="kv">
          <text class="k">退回消费账户</text>
          <text class="v">{{
            item.consumptionCreditFen === null ? '—' : yuanFen(item.consumptionCreditFen)
          }}</text>
        </view>
        <view class="kv">
          <text class="k">微信退款状态</text>
          <text class="v">{{
            item.wechatRefundStatus ? wechatRefundStatusLabel(item.wechatRefundStatus) : '—'
          }}</text>
        </view>
      </view>
      <text v-else-if="item.status === 'pending'" class="hint mt-12">
        工作人员审核后才会确定退款金额和减扣。申请时不会自动计入运费。
      </text>
    </view>
  </AppFrame>
</template>
