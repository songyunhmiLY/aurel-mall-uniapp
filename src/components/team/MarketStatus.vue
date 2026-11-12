<script setup lang="ts">
import { computed } from 'vue'
import EmptyHint from '@/components/common/EmptyHint.vue'
import type { MarketBrief } from '@/types/team'

const props = defineProps<{ markets: MarketBrief[] }>()
const visible = computed(() => props.markets.slice(0, 3))
</script>

<template>
  <view class="block">
    <text class="block__title">市场情况</text>
    <EmptyHint v-if="visible.length === 0" text="暂无市场" />
    <view v-for="item in visible" :key="item.id" class="market">
      <text class="market__name">{{ item.name }}</text>
      <view class="market__row">
        <text>本月 {{ item.monthAmount }}</text>
        <text>最近7天 {{ item.weekAmount }}</text>
        <text>当日 {{ item.dayAmount }}</text>
      </view>
    </view>
  </view>
</template>

<style scoped>
.block {
  margin-top: 24rpx;
  padding: 24rpx;
  background: #fff;
  border-radius: 20rpx;
}

.block__title,
.market__name {
  display: block;
  font-weight: 600;
}

.market {
  margin-top: 20rpx;
  padding-top: 16rpx;
  border-top: 1px solid #e6f0ee;
}

.market__row {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx 24rpx;
  margin-top: 10rpx;
  color: #3d5552;
  font-size: 24rpx;
}
</style>
