<script setup lang="ts">
import type { BannerSlide } from '@/types/home'

defineProps<{ items: BannerSlide[] }>()
</script>

<template>
  <view class="wrap">
    <text class="label">轮播图</text>
    <swiper v-if="items.length" class="banner" circular autoplay indicator-dots>
      <swiper-item v-for="item in items" :key="item.id">
        <view class="slide">
          <text>{{ item.title }}</text>
        </view>
      </swiper-item>
    </swiper>
    <view v-else class="slide">暂无轮播</view>
  </view>
</template>

<style scoped>
.wrap {
  margin-top: 24rpx;
}

.label {
  display: block;
  margin-bottom: 12rpx;
  color: #5f7672;
  font-size: 22rpx;
}

.banner {
  height: 280rpx;
}

.slide {
  display: flex;
  align-items: flex-end;
  height: 280rpx;
  padding: 28rpx;
  box-sizing: border-box;
  border-radius: 24rpx;
  color: #f4fffd;
  font-size: 34rpx;
  background: linear-gradient(135deg, #0b6e68, #1aa6a0 55%, #d8efe4);
}
</style>
