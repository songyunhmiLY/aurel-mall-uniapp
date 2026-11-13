<script setup lang="ts">
import { ref, watch } from 'vue'
import { openMiniProgramPage } from '@/navigation/routes'
import type { HomeBanner } from '@/types/home'

const props = defineProps<{ items: HomeBanner[] }>()
const current = ref(0)

watch(
  () => props.items.length,
  (length) => {
    if (current.value >= length) current.value = 0
  },
)

function onChange(event: { detail?: { current?: number } }) {
  current.value = event.detail?.current || 0
}
</script>

<template>
  <view v-if="items.length" class="home-carousel">
    <swiper
      class="hc-viewport"
      :circular="items.length > 1"
      :autoplay="items.length > 1"
      :interval="4200"
      :indicator-dots="false"
      @change="onChange"
    >
      <swiper-item v-for="item in items" :key="item.id">
        <view class="hc-slide hit" @click="openMiniProgramPage(item.pagePath)">
          <image class="hc-photo" :src="item.imageUrl" mode="aspectFill" />
          <view class="hc-copy">
            <text class="hc-title">{{ item.title }}</text>
          </view>
        </view>
      </swiper-item>
    </swiper>
    <view class="hc-dots">
      <view
        v-for="(item, index) in items"
        :key="item.id"
        class="dot"
        :class="{ 'is-on': index === current }"
      />
    </view>
  </view>
</template>
