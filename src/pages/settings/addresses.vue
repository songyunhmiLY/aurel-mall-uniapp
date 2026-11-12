<script setup lang="ts">
import AppFrame from '@/components/chrome/AppFrame.vue'
import { demoAddresses } from '@/demo/catalog'
import { openPage, routes } from '@/navigation/routes'
</script>

<template>
  <AppFrame title="收货地址">
    <view class="pad">
      <view v-for="item in demoAddresses" :key="item.id" class="card card-pad mb-12">
        <text class="fw-6">{{ item.name }} <text class="muted t-13">{{ item.phone }}</text></text>
        <text v-if="item.def" class="tag tag-gold">默认</text>
        <text class="muted t-13 mt-8">{{ item.region }} {{ item.detail }}</text>
      </view>
      <view class="btn btn-primary btn-block hit" @click="openPage(routes.addressEdit)">新增地址</view>
    </view>
  </AppFrame>
</template>
