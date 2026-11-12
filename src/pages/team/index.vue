<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { loadTeamOverview } from '@/api/team'
import MarketOverview from '@/components/team/MarketOverview.vue'
import MarketStatus from '@/components/team/MarketStatus.vue'
import type { TeamOverview } from '@/types/team'

const overview = ref<TeamOverview>({
  marketCount: 0,
  monthPerformance: '0.00',
  markets: [],
})

onLoad(() => {
  loadTeamOverview()
    .then((data) => {
      overview.value = data
    })
    .catch(() => undefined)
})
</script>

<template>
  <view class="page">
    <text class="h1">创业团队</text>
    <text class="muted">业绩只展示本月合计。</text>
    <view class="gap">
      <MarketOverview
        :market-count="overview.marketCount"
        :month-performance="overview.monthPerformance"
      />
      <MarketStatus :markets="overview.markets" />
    </view>
  </view>
</template>

<style scoped>
.gap {
  margin-top: 24rpx;
}
</style>
