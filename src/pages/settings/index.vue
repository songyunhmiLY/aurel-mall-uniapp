<script setup lang="ts">
import MenuRow from '@/components/common/MenuRow.vue'
import { routes } from '@/navigation/routes'
</script>

<template>
  <view class="page">
    <text class="h1">设置</text>
    <MenuRow title="收款账户" :url="routes.paymentAccount" />
    <MenuRow title="收货地址" :url="routes.addresses" />
    <MenuRow title="协议" :url="routes.agreements" />
    <MenuRow title="隐私政策" :url="routes.privacy" />
    <MenuRow title="支付密码" :url="routes.payPassword" />
  </view>
</template>
