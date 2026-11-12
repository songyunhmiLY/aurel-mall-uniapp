<script setup lang="ts">
import type { NoticeItem } from '@/types/home'

defineProps<{ items: NoticeItem[] }>()
</script>

<template>
  <view class="wrap">
    <text class="label">滚动字幕</text>
    <swiper v-if="items.length" class="marquee" vertical circular autoplay :interval="2800">
      <swiper-item v-for="item in items" :key="item.id">
        <text class="text">{{ item.text }}</text>
      </swiper-item>
    </swiper>
    <text v-else class="text">暂无字幕</text>
  </view>
</template>

<style scoped>
.wrap {
  display: flex;
  align-items: center;
  margin-top: 20rpx;
  padding: 0 20rpx;
  height: 72rpx;
  background: #fff;
  border-radius: 999rpx;
}

.label {
  flex: none;
  margin-right: 16rpx;
  color: #0e7c74;
  font-size: 22rpx;
}

.marquee {
  flex: 1;
  height: 72rpx;
}

.text {
  display: block;
  overflow: hidden;
  color: #3d5552;
  font-size: 24rpx;
  line-height: 72rpx;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
