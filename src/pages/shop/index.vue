<script setup lang="ts">
import { openPage, routes } from '@/navigation/routes'

function openProducts() {
  openPage(routes.productList)
}
</script>

<template>
  <view class="page">
    <text class="h1">创业专区</text>
    <text class="muted">商品稍后接入。这里先进入选购占位。</text>
    <button class="btn" @click="openProducts">查看商品</button>
  </view>
</template>
