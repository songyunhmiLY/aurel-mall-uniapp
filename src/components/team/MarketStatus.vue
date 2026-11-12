<script setup lang="ts">
import { computed } from 'vue'
import { yuan } from '@/demo/format'
import type { MarketBrief } from '@/types/team'

const props = defineProps<{ markets: MarketBrief[] }>()
const visible = computed(() => props.markets.slice(0, 3))

function amount(value: string): string {
  const num = Number(value)
  return Number.isFinite(num) ? yuan(num) : value
}
</script>

<template>
  <view>
    <view class="section-title">市场情况</view>
    <view v-if="visible.length === 0" class="empty">
      <view class="empty__title">暂无市场</view>
    </view>
    <view v-else class="market-list">
      <view v-for="item in visible" :key="item.id" class="market-card">
        <view class="mc-head">
          <view class="tr-av">{{ item.name.slice(0, 1) }}</view>
          <text class="fw-6">{{ item.name }}</text>
        </view>
        <view class="mc-metrics">
          <view>
            <text class="mc-lab">本月</text>
            <text class="mc-num">{{ amount(item.monthAmount) }}</text>
          </view>
          <view>
            <text class="mc-lab">最近7天</text>
            <text class="mc-num">{{ amount(item.weekAmount) }}</text>
          </view>
          <view>
            <text class="mc-lab">当日</text>
            <text class="mc-num">{{ amount(item.dayAmount) }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
