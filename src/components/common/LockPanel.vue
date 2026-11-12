<script setup lang="ts">
defineProps<{ title: string; text: string; action: string }>()
const emit = defineEmits<{ action: [] }>()
</script>

<template>
  <view class="lock-page">
    <view class="lock-mark">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.6" />
        <path d="M8 10V7.5a4 4 0 0 1 8 0V10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
      </svg>
    </view>
    <view class="lock-title">{{ title }}</view>
    <view class="lock-text">{{ text }}</view>
    <view class="btn btn-primary btn-block hit" @click="emit('action')">{{ action }}</view>
  </view>
</template>
