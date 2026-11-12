<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { fetchArticle } from '@/api/article'
import AppFrame from '@/components/chrome/AppFrame.vue'
import { findArticle } from '@/demo/catalog'
import type { ArticleBrief } from '@/types/home'

const article = ref<ArticleBrief | null>(null)

onLoad((query) => {
  const id = typeof query?.id === 'string' ? query.id : ''
  article.value = findArticle(id) || null
  if (!id) return
  fetchArticle(id)
    .then((remote) => {
      if (!remote?.title) return
      article.value = {
        ...(article.value || { id, title: remote.title, summary: remote.summary }),
        title: remote.title,
        summary: remote.summary || article.value?.summary || '',
      }
    })
    .catch(() => undefined)
})
</script>

<template>
  <AppFrame title="资讯详情">
    <view v-if="!article" class="empty">
      <view class="empty__title">内容不存在</view>
      <view class="empty__text">这条资讯可能已下线。</view>
    </view>
    <view v-else class="pad">
      <text class="hn-tag" :class="article.type === 'notice' ? 'is-notice' : 'is-article'">
        {{ article.typeName || '文章' }}
      </text>
      <view class="article-title">{{ article.title }}</view>
      <view v-if="article.date" class="article-date">{{ article.date }}</view>
      <view class="article-body">
        <view v-for="(para, index) in article.body || [article.summary]" :key="index" class="para">{{ para }}</view>
      </view>
    </view>
  </AppFrame>
</template>
