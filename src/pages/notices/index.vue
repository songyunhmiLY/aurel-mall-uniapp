<script setup lang="ts">
import AppFrame from '@/components/chrome/AppFrame.vue'
import { demoNotices } from '@/demo/catalog'
</script>

<template>
  <AppFrame title="系统通知">
    <view v-for="item in demoNotices" :key="item.id" class="notice-item">
      <text class="fw-6">{{ item.title }}</text>
      <text class="ni-time">{{ item.time }}</text>
      <text class="ni-body">{{ item.body }}</text>
    </view>
  </AppFrame>
</template>
