<script setup lang="ts">
import { openPage, routes } from '@/navigation/routes'

const entries = [
  { key: 'shop', title: '创业专区', hint: '选购入口', url: routes.shop },
  { key: 'welfare', title: '福利专场', hint: '稍后接入', url: routes.welfare },
  { key: 'founder', title: '联合创始人', hint: '稍后接入', url: routes.founder },
]
</script>

<template>
  <view class="grid">
    <view v-for="item in entries" :key="item.key" class="cell" @click="openPage(item.url)">
      <text class="cell__title">{{ item.title }}</text>
      <text class="cell__hint">{{ item.hint }}</text>
    </view>
  </view>
</template>

<style scoped>
.grid {
  display: flex;
  gap: 16rpx;
  margin-top: 20rpx;
}

.cell {
  flex: 1;
  padding: 24rpx 16rpx;
  background: #fff;
  border-radius: 20rpx;
}

.cell__title {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
}

.cell__hint {
  display: block;
  margin-top: 8rpx;
  color: #8aa09c;
  font-size: 22rpx;
}
</style>
