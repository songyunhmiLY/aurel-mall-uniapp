<script setup lang="ts">
import { computed } from 'vue'
import AppFrame from '@/components/chrome/AppFrame.vue'
import { money, yuan } from '@/demo/format'
import { openPage, routes } from '@/navigation/routes'
import { usePreviewStore } from '@/stores/preview'

const preview = usePreviewStore()
const profile = computed(() => preview.profile)
const unit = 1000

function later() {
  uni.showToast({ title: '提现表单稍后接入', icon: 'none' })
}
</script>

<template>
  <AppFrame title="钱包" tab="wallet">
    <view class="wallet-head">
      <text class="wh-kicker">WALLET</text>
      <view class="wallet-accounts">
        <view class="wa-card">
          <text class="wa-lab">积分账户</text>
          <text class="wa-num">{{ money(profile.points) }}</text>
          <text class="wa-hint">可用于创业专区，按 {{ yuan(unit) }} 整数倍划扣</text>
        </view>
        <view class="wa-card">
          <text class="wa-lab">提现账户</text>
          <text class="wa-num">{{ money(profile.withdraw) }}</text>
          <text class="wa-hint">会员可申请提现，亦可用于两类下单划扣</text>
        </view>
        <view class="wa-card">
          <text class="wa-lab">消费账户</text>
          <text class="wa-num">{{ money(profile.consume) }}</text>
          <text class="wa-hint">仅用于会员商城付款</text>
        </view>
      </view>
    </view>
    <view class="pad">
      <view class="pending-note">三个账户之间不能互转。其他入账与扣减规则待补充。</view>
    </view>
    <view class="pad" style="padding-top: 0">
      <view class="list-group">
        <view class="list-cell hit" @click="later">
          <text class="cell-body fw-6">申请提现</text>
          <view class="chevron" />
        </view>
        <view class="list-cell hit" @click="later">
          <text class="cell-body fw-6">提现记录</text>
          <view class="chevron" />
        </view>
        <view class="list-cell hit" @click="openPage(routes.paymentAccount)">
          <text class="cell-body fw-6">收款账户</text>
          <view class="chevron" />
        </view>
      </view>
    </view>
  </AppFrame>
</template>
