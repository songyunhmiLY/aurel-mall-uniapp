<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { fetchOrders } from '@/api/order'
import EmptyHint from '@/components/common/EmptyHint.vue'
import { openPage, routes, withId } from '@/navigation/routes'
import type { OrderBrief } from '@/types/order'

const orders = ref<OrderBrief[]>([
  { id: 'demo-1', title: '占位订单', statusText: '待接入', amountText: '¥ --' },
])

onLoad(() => {
  fetchOrders()
    .then((list) => {
      if (Array.isArray(list) && list.length) orders.value = list
    })
    .catch(() => undefined)
})

function openDetail(id: string) {
  openPage(withId(routes.orderDetail, id))
}
</script>

<template>
  <view class="page">
    <text class="h1">我的订单</text>
    <view v-if="orders.length === 0" class="card">
      <EmptyHint text="暂无订单" />
    </view>
    <view v-for="item in orders" :key="item.id" class="card" @click="openDetail(item.id)">
      <text class="title">{{ item.title }}</text>
      <text class="meta">{{ item.statusText }} · {{ item.amountText }}</text>
    </view>
  </view>
</template>

<style scoped>
.title {
  display: block;
  font-size: 30rpx;
}

.meta {
  display: block;
  margin-top: 8rpx;
  color: #5f7672;
  font-size: 24rpx;
}
</style>
