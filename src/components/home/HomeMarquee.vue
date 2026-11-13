<script setup lang="ts">
import type { HomeTicker } from '@/types/home'

defineProps<{ items: HomeTicker[] }>()
</script>

<template>
  <view v-if="items.length" class="home-ticker" aria-label="滚动字幕">
    <view class="ht-mask">
      <view class="ht-track">
        <view class="ht-seq">
          <text v-for="item in items" :key="item.id">{{ item.content }}</text>
        </view>
        <view class="ht-seq" aria-hidden="true">
          <text v-for="item in items" :key="`${item.id}-copy`">{{ item.content }}</text>
        </view>
      </view>
    </view>
  </view>
</template>
