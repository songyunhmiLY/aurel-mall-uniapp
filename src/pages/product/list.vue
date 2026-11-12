<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { fetchProducts } from '@/api/product'
import { openPage, routes, withId } from '@/navigation/routes'
import type { ProductBrief } from '@/types/product'

const products = ref<ProductBrief[]>([
  { id: 'demo-1', name: '占位商品 A', priceText: '¥ --' },
  { id: 'demo-2', name: '占位商品 B', priceText: '¥ --' },
])

onLoad(() => {
  fetchProducts()
    .then((list) => {
      if (Array.isArray(list) && list.length) products.value = list
    })
    .catch(() => undefined)
})

function openDetail(id: string) {
  openPage(withId(routes.productDetail, id))
}
</script>

<template>
  <view class="page">
    <text class="h1">商品</text>
    <view v-for="item in products" :key="item.id" class="card item" @click="openDetail(item.id)">
      <text class="name">{{ item.name }}</text>
      <text class="price">{{ item.priceText }}</text>
    </view>
  </view>
</template>

<style scoped>
.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.name {
  font-size: 30rpx;
}

.price {
  color: #0e7c74;
}
</style>
