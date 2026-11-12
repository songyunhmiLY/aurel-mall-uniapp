<script setup lang="ts">
defineProps<{
  marketCount: number
  monthPerformance: string
}>()
</script>

<template>
  <view class="stats">
    <view class="stat">
      <text class="stat__label">我的市场</text>
      <text class="stat__value">{{ marketCount }} 个</text>
    </view>
    <view class="stat">
      <text class="stat__label">总业绩</text>
      <text class="stat__caption">本月</text>
      <text class="stat__value">¥{{ monthPerformance }}</text>
    </view>
  </view>
</template>

<style scoped>
.stats {
  display: flex;
  gap: 16rpx;
}

.stat {
  flex: 1;
  padding: 24rpx;
  background: #fff;
  border-radius: 20rpx;
}

.stat__label,
.stat__caption {
  display: block;
  color: #5f7672;
  font-size: 24rpx;
}

.stat__value {
  display: block;
  margin-top: 12rpx;
  font-size: 36rpx;
  font-weight: 600;
}
</style>
