<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { fetchProduct } from '@/api/product'
import type { ProductDetail } from '@/types/product'

const product = ref<ProductDetail>({
  id: '',
  name: '占位商品',
  priceText: '¥ --',
  summary: '详情稍后接入。',
})

onLoad((query) => {
  const id = typeof query?.id === 'string' ? query.id : ''
  product.value = { ...product.value, id }
  if (!id) return
  fetchProduct(id)
    .then((detail) => {
      product.value = { ...product.value, ...detail, id }
    })
    .catch(() => undefined)
})

function onBuy() {
  uni.showToast({ title: '购买流程尚未接入', icon: 'none' })
}
</script>

<template>
  <view class="page">
    <text class="h1">{{ product.name }}</text>
    <text class="muted">编号 {{ product.id || '未指定' }}</text>
    <view class="card">
      <text class="price">{{ product.priceText }}</text>
      <text class="summary">{{ product.summary }}</text>
    </view>
    <button class="btn" @click="onBuy">购买（占位）</button>
  </view>
</template>

<style scoped>
.price {
  display: block;
  color: #0e7c74;
  font-size: 36rpx;
}

.summary {
  display: block;
  margin-top: 12rpx;
  color: #3d5552;
}
</style>
