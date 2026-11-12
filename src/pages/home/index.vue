<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import { fetchHomeFeed } from '@/api/home'
import { fetchProfile } from '@/api/user'
import AppFrame from '@/components/chrome/AppFrame.vue'
import HomeBanner from '@/components/home/HomeBanner.vue'
import HomeMarquee from '@/components/home/HomeMarquee.vue'
import KnowledgeList from '@/components/home/KnowledgeList.vue'
import ZoneEntries from '@/components/home/ZoneEntries.vue'
import { homeArticles, homeBanners, homeTicker } from '@/demo/catalog'
import { greetingName, money } from '@/demo/format'
import { openPage, routes } from '@/navigation/routes'
import { usePreviewStore } from '@/stores/preview'
import type { ArticleBrief, BannerSlide, NoticeItem } from '@/types/home'

const preview = usePreviewStore()
const banners = ref<BannerSlide[]>(homeBanners)
const notices = ref<NoticeItem[]>(homeTicker)
const articles = ref<ArticleBrief[]>(homeArticles)
const hello = computed(() => greetingName(preview.profile.name || '朋友'))
const sub = computed(() =>
  preview.isMember ? '欢迎回到奥瑞尔' : '完成创业专区购买后即可成为会员',
)

onLoad(() => {
  fetchProfile()
    .then((profile) => {
      if (profile.nickname) preview.applyNickname(profile.nickname)
    })
    .catch(() => undefined)

  fetchHomeFeed()
    .then((feed) => {
      if (feed.banners?.length) banners.value = feed.banners
      if (feed.notices?.length) notices.value = feed.notices
      if (feed.articles?.length) articles.value = feed.articles.slice(0, 6)
    })
    .catch(() => undefined)
})
</script>

<template>
  <AppFrame title="奥瑞尔" tab="home">
    <view class="home-hero">
      <text class="home-kicker">AUREL · 科技健康</text>
      <text class="home-hello">{{ hello }}</text>
      <text class="home-sub">{{ sub }}</text>
      <view v-if="preview.isMember" class="asset-strip hit" @click="openPage(routes.wallet)">
        <view class="as-item">
          <text class="as-lab">积分</text>
          <text class="as-num">{{ money(preview.profile.points) }}</text>
        </view>
        <view class="as-item">
          <text class="as-lab">提现</text>
          <text class="as-num">{{ money(preview.profile.withdraw) }}</text>
        </view>
        <view class="as-item">
          <text class="as-lab">消费</text>
          <text class="as-num">{{ money(preview.profile.consume) }}</text>
        </view>
      </view>
      <view v-else class="mt-16">
        <view class="btn btn-gold btn-block hit" @click="openPage(routes.shop)">前往创业专区，成为会员</view>
      </view>
    </view>
    <HomeBanner :items="banners" />
    <HomeMarquee :items="notices" />
    <ZoneEntries />
    <KnowledgeList :items="articles" />
  </AppFrame>
</template>
