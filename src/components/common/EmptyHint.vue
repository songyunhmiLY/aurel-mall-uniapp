<script setup lang="ts">
defineProps<{ text: string }>()
</script>

<template>
  <view class="empty">
    <text>{{ text }}</text>
  </view>
</template>

<style scoped>
.empty {
  padding: 28rpx 8rpx;
  color: #8aa09c;
  font-size: 26rpx;
  text-align: center;
}
</style>
