<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import { loadTeamOverview } from '@/api/team'
import AppFrame from '@/components/chrome/AppFrame.vue'
import MarketOverview from '@/components/team/MarketOverview.vue'
import MarketStatus from '@/components/team/MarketStatus.vue'
import { placeholderMarkets } from '@/demo/catalog'
import { money } from '@/demo/format'
import { usePreviewStore } from '@/stores/preview'
import type { MarketBrief } from '@/types/team'

const preview = usePreviewStore()
const markets = ref<MarketBrief[]>(preview.isMember ? placeholderMarkets.slice(0, 2) : [])

const monthTotal = computed(() => {
  const sum = markets.value.reduce((total, item) => total + (Number(item.monthAmount) || 0), 0)
  return money(sum)
})

onLoad(() => {
  loadTeamOverview()
    .then((data) => {
      markets.value = data.markets
    })
    .catch(() => undefined)
})

const count = computed(() => markets.value.length)
</script>

<template>
  <AppFrame title="创业团队">
    <view class="team-banner" />
    <MarketOverview
      :name="preview.profile.name || '访客'"
      :initial="preview.avatarText"
      :membership="preview.isMember ? '会员' : '尚未成为会员'"
      :market-count="count"
      :month-performance="monthTotal"
    />
    <MarketStatus :markets="markets" />
  </AppFrame>
</template>
