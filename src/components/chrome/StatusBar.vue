<script setup lang="ts">
import { onUnmounted, ref } from 'vue'

function nowTime(): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Shanghai',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date())
}

const time = ref(nowTime())
const timer = setInterval(() => {
  time.value = nowTime()
}, 30000)

onUnmounted(() => clearInterval(timer))
</script>

<template>
  <view class="status-bar">
    <text class="status-bar__time">{{ time }}</text>
    <view class="status-bar__island" />
    <view class="status-bar__icons">
      <svg width="16" height="12" viewBox="0 0 18 12" fill="currentColor">
        <rect x="0" y="8" width="3" height="4" rx="0.4" />
        <rect x="5" y="5" width="3" height="7" rx="0.4" />
        <rect x="10" y="2.5" width="3" height="9.5" rx="0.4" />
        <rect x="15" y="0" width="3" height="12" rx="0.4" opacity="0.35" />
      </svg>
      <svg width="14" height="12" viewBox="0 0 16 12" fill="none">
        <path d="M1 4.2C4.2 1.5 11.8 1.5 15 4.2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
        <path d="M3.6 6.6c2.4-2 6.4-2 8.8 0" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
        <path d="M6.2 9c1.1-.9 2.5-.9 3.6 0" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
        <circle cx="8" cy="11" r="0.9" fill="currentColor" />
      </svg>
      <svg width="24" height="12" viewBox="0 0 26 12" fill="none">
        <rect x="0.6" y="1" width="22" height="10" rx="2" stroke="currentColor" stroke-width="1.2" />
        <rect x="2.2" y="2.6" width="16" height="6.8" rx="1" fill="currentColor" />
        <rect x="23.2" y="3.6" width="2" height="4.8" rx="0.6" fill="currentColor" />
      </svg>
    </view>
  </view>
</template>
