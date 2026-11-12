<script setup lang="ts">
import { ref } from 'vue'
import BannerArt from '@/components/visual/BannerArt.vue'
import { openBanner } from '@/navigation/routes'
import type { BannerSlide } from '@/types/home'

defineProps<{ items: BannerSlide[] }>()
const current = ref(0)

function onChange(event: { detail?: { current?: number } }) {
  current.value = event.detail?.current || 0
}
</script>

<template>
  <view v-if="items.length" class="home-carousel">
    <swiper class="hc-viewport" circular autoplay :interval="4200" :indicator-dots="false" @change="onChange">
      <swiper-item v-for="item in items" :key="item.id">
        <view class="hc-slide hit" @click="openBanner(item.href)">
          <BannerArt :tone="item.tone" />
          <view class="hc-copy">
            <text class="hc-kicker">{{ item.kicker || '奥瑞尔' }}</text>
            <text class="hc-title">{{ item.title }}</text>
            <text v-if="item.desc" class="hc-desc">{{ item.desc }}</text>
          </view>
        </view>
      </swiper-item>
    </swiper>
    <view class="hc-dots">
      <view v-for="(item, index) in items" :key="item.id" class="dot" :class="{ 'is-on': index === current }" />
    </view>
  </view>
</template>
