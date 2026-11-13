<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { computed, ref, watch } from 'vue'
import { fetchHomeArticles, fetchHomeBanners, fetchHomeTickers } from '@/api/home'
import { walletAccount } from '@/api/wallet'
import { fetchCofounderPage } from '@/api/cofounder'
import { fetchWelfareEntry } from '@/api/welfare'
import AppFrame from '@/components/chrome/AppFrame.vue'
import HomeBanner from '@/components/home/HomeBanner.vue'
import HomeMarquee from '@/components/home/HomeMarquee.vue'
import KnowledgeList from '@/components/home/KnowledgeList.vue'
import ZoneEntries from '@/components/home/ZoneEntries.vue'
import { formatFen, greetingName } from '@/demo/format'
import { openPage, routes } from '@/navigation/routes'
import { usePreviewStore } from '@/stores/preview'
import { useUserStore } from '@/stores/user'
import { useWalletStore } from '@/stores/wallet'
import type { HomeArticleSummary, HomeBanner as HomeBannerItem, HomeTicker } from '@/types/home'
import type { CofounderEntry } from '@/types/cofounder'
import type { WelfareEntry } from '@/types/welfare'

const preview = usePreviewStore()
const user = useUserStore()
const wallets = useWalletStore()
const banners = ref<HomeBannerItem[]>([])
const tickers = ref<HomeTicker[]>([])
const articles = ref<HomeArticleSummary[]>([])
const articleTotal = ref(0)
const articlePage = ref(1)
const articlePageSize = ref(20)
const articlesLoading = ref(false)
const welfareEntry = ref<WelfareEntry | null>(null)
const cofounderEntry = ref<CofounderEntry | null>(null)
let homeSeq = 0
const hello = computed(() => greetingName(user.nickname || preview.profile.name || '朋友'))
const hasMoreArticles = computed(
  () => articlePage.value * articlePageSize.value < articleTotal.value,
)

function availableText(key: 'points' | 'withdrawable' | 'consumption'): string {
  if (!wallets.balances) return '—'
  return formatFen(walletAccount(wallets.balances, key).availableFen)
}
const sub = computed(() => (preview.isMember ? '欢迎回到奥瑞尔' : '完成创业专区购买后即可成为会员'))

function refreshSignedIn() {
  if (!user.token) {
    clearHomeContent()
    return
  }
  void wallets.load()
  void loadWelfareEntry()
  void loadCofounderEntry()
  void loadHomeContent()
}

function clearHomeContent() {
  homeSeq += 1
  banners.value = []
  tickers.value = []
  articles.value = []
  articleTotal.value = 0
  articlePage.value = 1
  articlePageSize.value = 20
  articlesLoading.value = false
}

async function loadHomeContent() {
  const seq = ++homeSeq
  await Promise.all([loadBanners(seq), loadTickers(seq), loadArticles(seq, 1, false)])
}

async function loadBanners(seq: number) {
  try {
    const items = await fetchHomeBanners()
    if (seq !== homeSeq || !user.token) return
    banners.value = items
  } catch {
    // 刷新失败时保留上一次的轮播；还没有读到过时保持空白。
  }
}

async function loadTickers(seq: number) {
  try {
    const items = await fetchHomeTickers()
    if (seq !== homeSeq || !user.token) return
    tickers.value = items
  } catch {
    // 刷新失败时保留上一次的字幕；还没有读到过时保持空白。
  }
}

async function loadArticles(seq: number, page: number, append: boolean) {
  if (append && articlesLoading.value) return
  articlesLoading.value = true
  try {
    const result = await fetchHomeArticles(page)
    if (seq !== homeSeq || !user.token) return
    const incoming = uniqueArticles(result.items)
    articles.value = append ? uniqueArticles(articles.value.concat(incoming)) : incoming
    articleTotal.value = result.total
    articlePage.value = result.page
    articlePageSize.value = result.pageSize
  } catch {
    // 刷新失败时保留上一次的列表；还没有读到过时保持空白。
  } finally {
    if (seq === homeSeq) articlesLoading.value = false
  }
}

function uniqueArticles(items: HomeArticleSummary[]): HomeArticleSummary[] {
  const seen = new Set<string>()
  return items.filter((item) => {
    if (seen.has(item.id)) return false
    seen.add(item.id)
    return true
  })
}

function loadMoreArticles() {
  if (!user.token || !hasMoreArticles.value || articlesLoading.value) return
  void loadArticles(homeSeq, articlePage.value + 1, true)
}

async function loadWelfareEntry() {
  try {
    welfareEntry.value = await fetchWelfareEntry()
  } catch {
    // 读取失败时保留上一次的入口。还没有读到过时，卡片不展示配置文案和图片。
  }
}

async function loadCofounderEntry() {
  try {
    cofounderEntry.value = (await fetchCofounderPage()).entry
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
    <HomeMarquee :items="tickers" />
    <ZoneEntries :welfare-entry="welfareEntry" :cofounder-entry="cofounderEntry" />
    <KnowledgeList
      :items="articles"
      :has-more="hasMoreArticles"
      :loading-more="articlesLoading"
      @more="loadMoreArticles"
    />
  </AppFrame>
</template>
