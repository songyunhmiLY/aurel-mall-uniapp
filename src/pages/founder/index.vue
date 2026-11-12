<script setup lang="ts">
import AppFrame from '@/components/chrome/AppFrame.vue'
import { yuan } from '@/demo/format'

const fee = 20000

function pay() {
  uni.showToast({ title: '微信支付尚未接入', icon: 'none' })
}
</script>

<template>
  <AppFrame title="联合创始人">
    <view class="cf-hero">
      <svg viewBox="0 0 390 220" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <rect width="390" height="220" fill="#161A1F" />
        <circle cx="320" cy="24" r="110" fill="none" stroke="#5E8F8A" stroke-width="1" opacity="0.35" />
        <circle cx="320" cy="24" r="70" fill="none" stroke="#C5D9D6" stroke-width="1" opacity="0.25" />
        <circle cx="196" cy="110" r="28" fill="#5E8F8A" opacity="0.9" />
        <circle cx="154" cy="136" r="12" fill="#C5D9D6" opacity="0.85" />
        <circle cx="238" cy="136" r="12" fill="#C5D9D6" opacity="0.85" />
        <line x1="176" y1="122" x2="154" y2="136" stroke="#C5D9D6" stroke-width="1.4" />
        <line x1="216" y1="122" x2="238" y2="136" stroke="#C5D9D6" stroke-width="1.4" />
      </svg>
    </view>
    <view class="cf-body">
      <text class="cf-title">联合创始人</text>
      <text class="cf-lead">
        本页介绍内容由管理端配置，以下为演示占位文案。联合创始人按规则分享创业专区订单与会员商城 PV 的分红，分红进入提现账户。
      </text>
      <view class="mt-16">
        <text class="fw-6">开通说明</text>
        <text class="hint">全网限量招募。开通仅支持微信支付，不能使用积分、提现或消费账户。须先成为会员。</text>
      </view>
      <view class="card card-pad mt-16">
        <view class="kv">
          <text class="k">开通费用</text>
          <text class="v fw-6">{{ yuan(fee) }}</text>
        </view>
        <view class="kv">
          <text class="k">支付方式</text>
          <text class="v">仅微信支付</text>
        </view>
      </view>
    </view>
    <view class="pad">
      <view class="btn btn-gold btn-block hit" @click="pay">成为联合创始人</view>
    </view>
  </AppFrame>
</template>
