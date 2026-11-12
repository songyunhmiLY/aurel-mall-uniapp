<script setup lang="ts">
import { openPage } from '@/navigation/routes'

defineProps<{ title: string; url: string; note?: string }>()
</script>

<template>
  <view class="row" @click="openPage(url)">
    <view>
      <text class="row__title">{{ title }}</text>
      <text v-if="note" class="row__note">{{ note }}</text>
    </view>
    <text class="row__arrow">›</text>
  </view>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16rpx;
  padding: 28rpx 24rpx;
  background: #fff;
  border-radius: 20rpx;
}

.row__title {
  display: block;
  font-size: 30rpx;
}

.row__note {
  display: block;
  margin-top: 6rpx;
  color: #8aa09c;
  font-size: 22rpx;
}

.row__arrow {
  color: #8aa09c;
  font-size: 40rpx;
  line-height: 1;
}
</style>
