<script setup lang="ts">
import { openPage, routes } from '@/navigation/routes'
import { useCartStore } from '@/stores/cart'

defineProps<{ title: string; back: boolean; showCart: boolean }>()

const cart = useCartStore()

function goBack() {
  const pages = getCurrentPages()
  if (pages.length > 1) {
    uni.navigateBack()
    return
  }
  openPage(routes.home)
}

function goCart() {
  openPage(routes.cart)
}
</script>

<template>
  <view class="nav-bar">
    <view class="nav-bar__side">
      <view v-if="back" class="nav-bar__back hit" @click="goBack">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M15 5L8 12l7 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </view>
    </view>
    <view class="nav-bar__title">{{ title }}</view>
    <view class="nav-bar__side nav-bar__side--right">
      <view v-if="showCart" class="nav-bar__icon hit" @click="goCart">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M6 7h15l-1.5 9h-12L6 7z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" />
          <path d="M6 7L5 4H3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
          <circle cx="10" cy="20" r="1.2" fill="currentColor" />
          <circle cx="18" cy="20" r="1.2" fill="currentColor" />
        </svg>
        <text v-if="cart.count" class="nav-badge">{{ cart.count }}</text>
      </view>
      <view v-else class="nav-capsule">
        <view class="nav-capsule__btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="6" cy="12" r="1.6" />
            <circle cx="12" cy="12" r="1.6" />
            <circle cx="18" cy="12" r="1.6" />
          </svg>
        </view>
        <view class="nav-capsule__div" />
        <view class="nav-capsule__btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.6" />
          </svg>
        </view>
      </view>
    </view>
  </view>
</template>
