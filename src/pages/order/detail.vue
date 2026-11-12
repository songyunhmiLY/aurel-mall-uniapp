<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { fetchOrder } from '@/api/order'
import { isMpWeixin, requestWechatPayPlaceholder } from '@/platform/mp-weixin'
import type { OrderDetail } from '@/types/order'

const order = ref<OrderDetail>({
  id: '',
  title: '占位订单',
  statusText: '待接入',
  amountText: '¥ --',
  summary: '订单详情稍后接入。',
})

onLoad((query) => {
  const id = typeof query?.id === 'string' ? query.id : ''
  order.value = { ...order.value, id }
  if (!id) return
  fetchOrder(id)
    .then((detail) => {
      order.value = { ...order.value, ...detail, id }
    })
    .catch(() => undefined)
})

function onPay() {
  requestWechatPayPlaceholder().catch(() => {
    uni.showToast({ title: '支付参数尚未确定', icon: 'none' })
  })
}
</script>

<template>
  <view class="page">
    <text class="h1">{{ order.title }}</text>
    <text class="muted">单号 {{ order.id || '未指定' }}</text>
    <view class="card">
      <text class="line">{{ order.statusText }}</text>
      <text class="line">{{ order.amountText }}</text>
      <text class="line">{{ order.summary }}</text>
    </view>
    <button v-if="isMpWeixin" class="btn" @click="onPay">微信支付（占位）</button>
  </view>
</template>

<style scoped>
.line {
  display: block;
  margin-top: 8rpx;
}
</style>
