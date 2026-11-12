<script setup lang="ts">
import { openPage, routes, withId } from '@/navigation/routes'
import type { ArticleBrief } from '@/types/home'

defineProps<{ items: ArticleBrief[] }>()

function openArticle(id: string) {
  openPage(withId(routes.articleDetail, id))
}
</script>

<template>
  <view class="block">
    <text class="block__title">资讯知识</text>
    <view v-if="items.length === 0" class="empty">暂无资讯</view>
    <view v-for="item in items" :key="item.id" class="item" @click="openArticle(item.id)">
      <text class="item__title">{{ item.title }}</text>
      <text class="item__summary">{{ item.summary }}</text>
    </view>
  </view>
</template>

<style scoped>
.block {
  margin-top: 28rpx;
}

.block__title {
  display: block;
  margin-bottom: 8rpx;
  font-size: 32rpx;
  font-weight: 600;
}

.empty,
.item__summary {
  color: #8aa09c;
  font-size: 24rpx;
}

.item {
  margin-top: 16rpx;
  padding: 24rpx;
  background: #fff;
  border-radius: 20rpx;
}

.item__title {
  display: block;
  font-size: 28rpx;
}

.item__summary {
  display: block;
  margin-top: 8rpx;
}
</style>
