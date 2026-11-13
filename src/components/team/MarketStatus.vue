<script setup lang="ts">
import { computed } from 'vue'
import { yuanFen } from '@/demo/format'
import type { TeamMarket } from '@/types/team'

const props = defineProps<{ markets: TeamMarket[] | null }>()
const visible = computed(() => (props.markets ? props.markets.slice(0, 3) : []))
</script>

<template>
  <view>
    <view class="section-title">市场情况</view>
    <view v-if="markets === null" class="empty">
      <view class="empty__title">正在读取</view>
    </view>
    <view v-else-if="visible.length === 0" class="empty">
      <view class="empty__title">暂无市场</view>
    </view>
    <view v-else class="market-list">
      <view v-for="(item, index) in visible" :key="`${index}-${item.name}`" class="market-card">
        <view class="mc-head">
          <view class="tr-av">{{ item.name.slice(0, 1) }}</view>
          <text class="fw-6">{{ item.name }}</text>
        </view>
        <view class="mc-metrics">
          <view>
            <text class="mc-lab">本月</text>
            <text class="mc-num">{{ yuanFen(item.monthPerformanceFen) }}</text>
          </view>
          <view>
            <text class="mc-lab">最近 7 天</text>
            <text class="mc-num">{{ yuanFen(item.recent7DaysPerformanceFen) }}</text>
          </view>
          <view>
            <text class="mc-lab">当日</text>
            <text class="mc-num">{{ yuanFen(item.todayPerformanceFen) }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
