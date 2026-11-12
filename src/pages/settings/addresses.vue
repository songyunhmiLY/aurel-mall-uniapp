<script setup lang="ts">
import EmptyHint from '@/components/common/EmptyHint.vue'
import { openPage, routes } from '@/navigation/routes'

function createAddress() {
  openPage(routes.addressEdit)
}
</script>

<template>
  <view class="page">
    <text class="h1">收货地址</text>
    <view class="card">
      <EmptyHint text="暂无收货地址" />
    </view>
    <button class="btn" @click="createAddress">新增地址</button>
  </view>
</template>
