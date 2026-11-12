<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { fetchCart } from '@/api/cart'
import EmptyHint from '@/components/common/EmptyHint.vue'
import { openPage, routes } from '@/navigation/routes'
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()

onShow(() => {
  fetchCart()
    .then((data) => {
      if (Array.isArray(data.items)) cart.replace(data.items)
    })
    .catch(() => undefined)
})

function goShop() {
  openPage(routes.shop)
}
</script>

<template>
  <view class="page">
    <text class="h1">购物车</text>
    <text class="muted">共 {{ cart.count }} 件</text>
    <view v-if="cart.items.length === 0" class="card">
      <EmptyHint text="购物车是空的" />
    </view>
    <view v-for="item in cart.items" :key="item.id" class="card line">
      <text>{{ item.name }}</text>
      <text class="qty">x{{ item.quantity }}</text>
      <text>{{ item.priceText }}</text>
    </view>
    <button class="btn" @click="goShop">去创业专区</button>
  </view>
</template>

<style scoped>
.line {
  display: flex;
  justify-content: space-between;
  gap: 16rpx;
}

.qty {
  color: #5f7672;
}
</style>
