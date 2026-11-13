<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import { fetchTeam } from '@/api/team'
import { sessionErrorMessage } from '@/auth/account-session'
import AppFrame from '@/components/chrome/AppFrame.vue'
import MarketOverview from '@/components/team/MarketOverview.vue'
import MarketStatus from '@/components/team/MarketStatus.vue'
import { usePreviewStore } from '@/stores/preview'
import { useUserStore } from '@/stores/user'
import type { TeamOverview } from '@/types/team'

const preview = usePreviewStore()
const user = useUserStore()
const overview = ref<TeamOverview | null>(null)
const errorText = ref('')

const displayName = computed(() => user.nickname || preview.profile.name || '访客')
const initial = computed(() => displayName.value.slice(0, 1) || '客')

onShow(() => {
  if (!user.token) return
  void load()
})

async function load() {
  errorText.value = ''
  try {
    overview.value = await fetchTeam()
  } catch (error) {
    overview.value = null
    errorText.value = sessionErrorMessage(error, '创业团队加载失败')
  }
}
</script>

<template>
  <AppFrame title="创业团队">
    <view class="team-banner" />
    <view v-if="errorText" class="pad">
      <view class="notice">{{ errorText }}</view>
    </view>
    <MarketOverview
      :name="displayName"
      :initial="initial"
      :membership="preview.isMember ? '会员' : '尚未成为会员'"
      :market-count="overview ? overview.marketCount : null"
      :total-performance-fen="overview ? overview.totalPerformanceFen : null"
    />
    <MarketStatus v-if="!errorText" :markets="overview ? overview.markets : null" />
  </AppFrame>
</template>
