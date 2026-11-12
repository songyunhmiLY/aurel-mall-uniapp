<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { fetchArticle } from '@/api/article'

const articleId = ref('')
const title = ref('资讯详情')
const summary = ref('正文稍后接入。')

onLoad((query) => {
  articleId.value = typeof query?.id === 'string' ? query.id : ''
  if (!articleId.value) return
  title.value = '资讯详情'
  fetchArticle(articleId.value)
    .then((article) => {
      if (article.title) title.value = article.title
      if (article.summary) summary.value = article.summary
    })
    .catch(() => undefined)
})
</script>

<template>
  <view class="page">
    <text class="h1">{{ title }}</text>
    <text class="muted">编号 {{ articleId || '未指定' }}</text>
    <view class="card">
      <text>{{ summary }}</text>
    </view>
  </view>
</template>
