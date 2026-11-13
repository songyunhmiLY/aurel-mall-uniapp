<script setup lang="ts">
import AppFrame from '@/components/chrome/AppFrame.vue'
</script>

<template>
  <AppFrame title="消费转账">
    <view class="pad">
      <view class="notice">本阶段没有转账。三个账户之间不能互转，也不能把余额转给其他用户。</view>
    </view>
  </AppFrame>
</template>
