<script setup lang="ts">
import { homeArticleKindClass, homeArticleKindLabel } from '@/home/labels'
import { formatInstant } from '@/demo/format'
import { openPage, routes, withId } from '@/navigation/routes'
import type { HomeArticleSummary } from '@/types/home'

defineProps<{ items: HomeArticleSummary[]; hasMore?: boolean; loadingMore?: boolean }>()

const emit = defineEmits<{ more: [] }>()
</script>

<template>
  <view v-if="items.length" class="home-news">
    <view class="section-title">资讯和知识</view>
    <view class="hn-list">
      <view
        v-for="item in items"
        :key="item.id"
        class="hn-item hit"
        @click="openPage(withId(routes.articleDetail, item.id))"
      >
        <text class="hn-tag" :class="homeArticleKindClass(item.kind)">
          {{ homeArticleKindLabel(item.kind) }}
        </text>
        <view class="hn-main">
          <text class="hn-title">{{ item.title }}</text>
          <text class="hn-sum">{{ item.summary }}</text>
          <text class="hn-meta">{{ formatInstant(item.publishedAt) }}</text>
        </view>
        <image v-if="item.coverUrl" class="hn-cover" :src="item.coverUrl" mode="aspectFill" />
        <view class="chevron" />
      </view>
    </view>
    <view v-if="hasMore" class="hn-more">
      <view class="btn btn-ghost btn-block hit" @click="emit('more')">
        {{ loadingMore ? '加载中' : '加载更多' }}
      </view>
    </view>
  </view>
</template>
