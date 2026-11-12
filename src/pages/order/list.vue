<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import { fetchOrders } from '@/api/order'
import AppFrame from '@/components/chrome/AppFrame.vue'
import { demoOrders, type DemoOrder } from '@/demo/catalog'
import { yuan } from '@/demo/format'
import { openPage, routes, withId } from '@/navigation/routes'

const status = ref('all')
const orders = ref<DemoOrder[]>(demoOrders)

const visible = computed(() =>
  orders.value.filter((order) => {
    if (status.value === 'all' || !status.value) return true
    if (status.value === 'refund') return order.status === 'refunding' || order.status === 'refunded'
    return order.status === status.value
  }),
)

onLoad((query) => {
  status.value = typeof query?.status === 'string' ? query.status : 'all'
  fetchOrders()
    .then((list) => {
      if (!Array.isArray(list) || !list.length) return
      orders.value = list.map((item) => ({
        id: item.id,
        typeName: '订单',
        status: 'all',
        statusName: item.statusText,
        createdAt: '',
        payable: Number(String(item.amountText).replace(/[^\d.]/g, '')) || 0,
        items: [{ name: item.title, qty: 1, price: 0 }],
      }))
    })
    .catch(() => undefined)
})
</script>

<template>
  <AppFrame title="我的订单">
    <view v-if="visible.length === 0" class="empty">
      <view class="empty__title">暂无订单</view>
    </view>
    <view v-for="item in visible" :key="item.id" class="order-card hit" @click="openPage(withId(routes.orderDetail, item.id))">
      <view class="oc-head">
        <text>{{ item.typeName }} · {{ item.createdAt }}</text>
        <text class="fw-6">{{ item.statusName }}</text>
      </view>
      <view class="oc-items">
        <view v-for="goods in item.items" :key="goods.name" class="row-between">
          <text class="fw-6 t-14">{{ goods.name }}</text>
          <text class="muted t-13">× {{ goods.qty }}</text>
        </view>
      </view>
      <view class="oc-foot">
        <text class="muted">应付</text>
        <text class="price">{{ yuan(item.payable) }}</text>
      </view>
    </view>
    <view style="height: 16px" />
  </AppFrame>
</template>
