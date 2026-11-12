<script setup lang="ts">
import { openPage, routes, withId } from '@/navigation/routes'
import type { ArticleBrief } from '@/types/home'

defineProps<{ items: ArticleBrief[] }>()
</script>

<template>
  <view v-if="items.length" class="home-news">
    <view class="section-title">资讯与知识</view>
    <view class="hn-list">
      <view v-for="item in items" :key="item.id" class="hn-item hit" @click="openPage(withId(routes.articleDetail, item.id))">
        <text class="hn-tag" :class="item.type === 'notice' ? 'is-notice' : 'is-article'">
          {{ item.typeName || '文章' }}
        </text>
        <view class="hn-main">
          <text class="hn-title">{{ item.title }}</text>
          <text class="hn-sum">{{ item.summary }}</text>
          <text v-if="item.date" class="hn-meta">{{ item.date }}</text>
        </view>
        <view class="chevron" />
      </view>
    </view>
  </view>
</template>
