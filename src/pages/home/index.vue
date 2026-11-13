<script setup lang="ts">
import { onLoad, onShow } from '@dcloudio/uni-app'
import { computed, ref, watch } from 'vue'
import { fetchHomeFeed } from '@/api/home'
import { walletAccount } from '@/api/wallet'
import { fetchWelfareEntry } from '@/api/welfare'
import AppFrame from '@/components/chrome/AppFrame.vue'
import HomeBanner from '@/components/home/HomeBanner.vue'
import HomeMarquee from '@/components/home/HomeMarquee.vue'
import KnowledgeList from '@/components/home/KnowledgeList.vue'
import ZoneEntries from '@/components/home/ZoneEntries.vue'
import { homeArticles, homeBanners, homeTicker } from '@/demo/catalog'
import { formatFen, greetingName } from '@/demo/format'
import { openPage, routes } from '@/navigation/routes'
import { usePreviewStore } from '@/stores/preview'
import { useUserStore } from '@/stores/user'
import { useWalletStore } from '@/stores/wallet'
import type { ArticleBrief, BannerSlide, NoticeItem } from '@/types/home'
import type { WelfareEntry } from '@/types/welfare'

const preview = usePreviewStore()
const user = useUserStore()
const wallets = useWalletStore()
const banners = ref<BannerSlide[]>(homeBanners)
const notices = ref<NoticeItem[]>(homeTicker)
const articles = ref<ArticleBrief[]>(homeArticles)
const welfareEntry = ref<WelfareEntry | null>(null)
const hello = computed(() => greetingName(user.nickname || preview.profile.name || '朋友'))

function availableText(key: 'points' | 'withdrawable' | 'consumption'): string {
  if (!wallets.balances) return '—'
  return formatFen(walletAccount(wallets.balances, key).availableFen)
}
const sub = computed(() => (preview.isMember ? '欢迎回到奥瑞尔' : '完成创业专区购买后即可成为会员'))

onLoad(() => {
  fetchHomeFeed()
    .then((feed) => {
      if (feed.banners?.length) banners.value = feed.banners
      if (feed.notices?.length) notices.value = feed.notices
      if (feed.articles?.length) articles.value = feed.articles.slice(0, 6)
    })
    .catch(() => undefined)
})

function refreshSignedIn() {
  if (!user.token) return
  void wallets.load()
  void loadWelfareEntry()
}

async function loadWelfareEntry() {
  try {
    welfareEntry.value = await fetchWelfareEntry()
  } catch {
    // 读取失败时保留上一次的入口。还没有读到过时，卡片不展示配置文案和图片。
  }
}

onShow(() => {
  refreshSignedIn()
})

watch(
  () => user.token,
  () => {
    refreshSignedIn()
  },
)
</script>

<template>
  <AppFrame title="奥瑞尔" tab="home">
    <view class="home-hero">
      <text class="home-kicker">AUREL · 科技健康</text>
      <text class="home-hello">{{ hello }}</text>
      <text class="home-sub">{{ sub }}</text>
      <view class="asset-strip hit" @click="openPage(routes.wallet)">
        <view class="as-item">
          <text class="as-lab">积分</text>
          <text class="as-num">{{ availableText('points') }}</text>
        </view>
        <view class="as-item">
          <text class="as-lab">提现</text>
          <text class="as-num">{{ availableText('withdrawable') }}</text>
        </view>
        <view class="as-item">
          <text class="as-lab">消费</text>
          <text class="as-num">{{ availableText('consumption') }}</text>
        </view>
      </view>
      <view v-if="!preview.isMember" class="mt-16">
        <view class="btn btn-gold btn-block hit" @click="openPage(routes.shop)"
          >前往创业专区，成为会员</view
        >
      </view>
    </view>
    <HomeBanner :items="banners" />
    <HomeMarquee :items="notices" />
    <ZoneEntries :welfare-entry="welfareEntry" />
    <KnowledgeList :items="articles" />
  </AppFrame>
</template>
