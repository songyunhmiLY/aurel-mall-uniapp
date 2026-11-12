<script setup lang="ts">
import { openPage, routes, type TabKey } from '@/navigation/routes'

defineProps<{ current: TabKey }>()

const items: { key: TabKey; label: string; url: string }[] = [
  { key: 'home', label: '首页', url: routes.home },
  { key: 'mall', label: '商城', url: routes.mall },
  { key: 'wallet', label: '钱包', url: routes.wallet },
  { key: 'mine', label: '我的', url: routes.mine },
]
</script>

<template>
  <view class="tabbar">
    <view
      v-for="item in items"
      :key="item.key"
      class="tabbar__item hit"
      :class="{ 'is-active': item.key === current }"
      @click="openPage(item.url)"
    >
      <view class="tabbar__ico">
        <svg v-if="item.key === 'home'" viewBox="0 0 24 24" width="24" height="24" fill="none">
          <path d="M4 11.5L12 5l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-8.5z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" />
        </svg>
        <svg v-else-if="item.key === 'mall'" viewBox="0 0 24 24" width="24" height="24" fill="none">
          <path d="M5 8h14l-1 12H6L5 8z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" />
          <path d="M9 8V7a3 3 0 0 1 6 0v1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
        </svg>
        <svg v-else-if="item.key === 'wallet'" viewBox="0 0 24 24" width="24" height="24" fill="none">
          <rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" stroke-width="1.6" />
          <path d="M15 13h4v3h-4a1.5 1.5 0 1 1 0-3z" stroke="currentColor" stroke-width="1.6" />
          <path d="M3 10h18" stroke="currentColor" stroke-width="1.6" />
        </svg>
        <svg v-else viewBox="0 0 24 24" width="24" height="24" fill="none">
          <circle cx="12" cy="8" r="3.2" stroke="currentColor" stroke-width="1.6" />
          <path d="M5 19c1.2-3.2 3.7-4.8 7-4.8s5.8 1.6 7 4.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
        </svg>
      </view>
      <text>{{ item.label }}</text>
    </view>
  </view>
</template>
