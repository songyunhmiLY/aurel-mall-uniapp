<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { fetchHomeFeed } from '@/api/home'
import { fetchProfile } from '@/api/user'
import HomeBanner from '@/components/home/HomeBanner.vue'
import HomeMarquee from '@/components/home/HomeMarquee.vue'
import KnowledgeList from '@/components/home/KnowledgeList.vue'
import ZoneEntries from '@/components/home/ZoneEntries.vue'
import { useUserStore } from '@/stores/user'
import type { ArticleBrief, BannerSlide, NoticeItem } from '@/types/home'

const user = useUserStore()
const banners = ref<BannerSlide[]>([
  { id: 'banner-1', title: '轮播占位' },
  { id: 'banner-2', title: '活动占位' },
])
const notices = ref<NoticeItem[]>([
  { id: 'notice-1', text: '滚动字幕占位：欢迎来到奥瑞尔经销商城' },
])
const articles = ref<ArticleBrief[]>([
  { id: 'article-1', title: '资讯占位', summary: '知识内容稍后接入' },
])

onLoad(() => {
  fetchProfile()
    .then((profile) => {
      if (profile.nickname) user.applyNickname(profile.nickname)
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
  <view class="page">
    <view class="greet">
      <text class="h1">你好，{{ user.nickname }}</text>
      <text class="muted">欢迎来到奥瑞尔经销商城</text>
    </view>
    <HomeBanner :items="banners" />
    <HomeMarquee :items="notices" />
    <ZoneEntries />
    <KnowledgeList :items="articles" />
  </view>
</template>

<style scoped>
.greet {
  margin-bottom: 8rpx;
}
</style>
