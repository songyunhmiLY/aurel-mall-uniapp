<script setup lang="ts">
import type { NoticeItem } from '@/types/home'

defineProps<{ items: NoticeItem[] }>()
</script>

<template>
  <view v-if="items.length" class="home-ticker" aria-label="滚动公告">
    <text class="ht-lab">公告</text>
    <view class="ht-mask">
      <view class="ht-track">
        <view class="ht-seq">
          <text v-for="item in items" :key="item.id">{{ item.text }}</text>
        </view>
        <view class="ht-seq">
          <text v-for="item in items" :key="`${item.id}-copy`">{{ item.text }}</text>
        </view>
      </view>
    </view>
  </view>
</template>
