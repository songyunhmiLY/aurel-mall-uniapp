<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { fetchOrder } from '@/api/order'
import AppFrame from '@/components/chrome/AppFrame.vue'
import { demoOrders, type DemoOrder } from '@/demo/catalog'
import { yuan } from '@/demo/format'
import { isMpWeixin, requestWechatPayPlaceholder } from '@/platform/mp-weixin'

const order = ref<DemoOrder | null>(null)

onLoad((query) => {
  const id = typeof query?.id === 'string' ? query.id : ''
  order.value = demoOrders.find((item) => item.id === id) || null
  if (!id) return
  fetchOrder(id)
    .then((detail) => {
      if (!detail?.title) return
      order.value = {
        id,
        typeName: '订单',
        status: '',
        statusName: detail.statusText,
        createdAt: '',
        payable: Number(String(detail.amountText).replace(/[^\d.]/g, '')) || order.value?.payable || 0,
        items: [{ name: detail.title, qty: 1, price: 0 }],
      }
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
  <AppFrame title="订单详情">
    <view v-if="!order" class="empty">
      <view class="empty__title">订单不存在</view>
    </view>
    <view v-else class="pad">
      <view class="card card-pad">
        <view class="kv">
          <text class="k">订单号</text>
          <text class="v">{{ order.id }}</text>
        </view>
        <view class="kv">
          <text class="k">类型</text>
          <text class="v">{{ order.typeName }}</text>
        </view>
        <view class="kv">
          <text class="k">状态</text>
          <text class="v">{{ order.statusName }}</text>
        </view>
        <view class="kv">
          <text class="k">应付</text>
          <text class="v fw-6">{{ yuan(order.payable) }}</text>
        </view>
      </view>
      <view class="card card-pad mt-12">
        <view v-for="item in order.items" :key="item.name" class="row-between">
          <text>{{ item.name }}</text>
          <text class="muted">× {{ item.qty }}</text>
        </view>
      </view>
      <text v-if="order.typeName === '创业专区'" class="hint mt-12">创业专区订单付款后不可退单。</text>
      <button v-if="isMpWeixin" class="btn btn-primary btn-block mt-16" @click="onPay">微信支付（占位）</button>
    </view>
  </AppFrame>
</template>
