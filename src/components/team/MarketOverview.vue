<script setup lang="ts">
import { yuanFen } from '@/demo/format'

defineProps<{
  name: string
  initial: string
  membership: string
  marketCount: number | null
  totalPerformanceFen: string | null
}>()
</script>

<template>
  <view class="card team-card">
    <view class="avatar">{{ initial }}</view>
    <text class="t-17 fw-6">{{ name }}（{{ membership }}）</text>
    <view class="team-stats">
      <view>
        <text class="ts-lab">我的市场</text>
        <text class="ts-num">{{ marketCount === null ? '—' : `${marketCount} 个` }}</text>
      </view>
      <view>
        <text class="ts-lab">总业绩</text>
        <text class="ts-num">{{
          totalPerformanceFen === null ? '—' : yuanFen(totalPerformanceFen)
        }}</text>
      </view>
    </view>
  </view>
</template>
