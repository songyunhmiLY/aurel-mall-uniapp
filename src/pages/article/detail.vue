<script setup lang="ts">
import { onLoad, onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { fetchHomeArticle } from '@/api/home'
import { ApiError } from '@/api/http'
import { sessionErrorMessage } from '@/auth/account-session'
import AppFrame from '@/components/chrome/AppFrame.vue'
import { formatInstant } from '@/demo/format'
import { homeArticleKindClass, homeArticleKindLabel } from '@/home/labels'
import { useUserStore } from '@/stores/user'
import type { HomeArticleDetail } from '@/types/home'

const user = useUserStore()
const articleId = ref('')
const article = ref<HomeArticleDetail | null>(null)
const loaded = ref(false)
const errorText = ref('')

onLoad((query) => {
  articleId.value = typeof query?.id === 'string' ? query.id : ''
})

onShow(() => {
  void load()
})

async function load() {
  const id = articleId.value
  if (!/^[1-9]\d*$/.test(id)) {
    article.value = null
    errorText.value = '内容不存在'
    loaded.value = true
    return
  }
  if (!user.token) {
    article.value = null
    loaded.value = false
    return
  }
  if (article.value && article.value.id !== id) {
    article.value = null
    loaded.value = false
  }
  try {
    const next = await fetchHomeArticle(id)
    if (articleId.value !== id) return
    article.value = next
    errorText.value = ''
  } catch (error) {
    if (articleId.value !== id) return
    article.value = null
    errorText.value = isMissing(error) ? '内容不存在' : sessionErrorMessage(error, '内容加载失败')
  } finally {
    if (articleId.value === id) loaded.value = true
  }
}

function isMissing(error: unknown): boolean {
  return error instanceof ApiError && (error.statusCode === 404 || error.message === '内容不存在')
}
</script>

<template>
  <AppFrame title="资讯详情">
    <view v-if="loaded && errorText" class="empty">
      <view class="empty__title">{{
        errorText === '内容不存在' ? '内容不存在' : '暂时无法加载'
      }}</view>
      <view v-if="errorText !== '内容不存在'" class="empty__text">{{ errorText }}</view>
    </view>
    <view v-else-if="article">
      <view v-if="article.coverUrl" class="detail-art">
        <image class="prod-cover" :src="article.coverUrl" mode="aspectFill" />
      </view>
      <view class="pad">
        <text class="hn-tag" :class="homeArticleKindClass(article.kind)">
          {{ homeArticleKindLabel(article.kind) }}
        </text>
        <view class="article-title">{{ article.title }}</view>
        <view class="article-date">{{ formatInstant(article.publishedAt) }}</view>
        <text class="article-body">{{ article.body }}</text>
      </view>
    </view>
  </AppFrame>
</template>
