<script setup lang="ts">
import AppFrame from '@/components/chrome/AppFrame.vue'
import { demoBank } from '@/demo/catalog'
</script>

<template>
  <AppFrame title="收款账户">
    <view class="pad">
      <view class="card card-pad">
        <view class="kv">
          <text class="k">开户名</text>
          <text class="v">{{ demoBank.holder }}</text>
        </view>
        <view class="kv">
          <text class="k">开户银行</text>
          <text class="v">{{ demoBank.bank }}</text>
        </view>
        <view class="kv">
          <text class="k">开户支行</text>
          <text class="v">{{ demoBank.branch }}</text>
        </view>
        <view class="kv">
          <text class="k">卡号</text>
          <text class="v">{{ demoBank.number }}</text>
        </view>
      </view>
      <text class="hint mt-12">资料为演示占位，当前页面不提交。</text>
    </view>
  </AppFrame>
</template>
