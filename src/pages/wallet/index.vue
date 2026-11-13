<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { walletAccount } from '@/api/wallet'
import AppFrame from '@/components/chrome/AppFrame.vue'
import { formatFen, yuanFen } from '@/demo/format'
import { openPage, routes } from '@/navigation/routes'
import { useWalletStore } from '@/stores/wallet'
import type { WalletAccount } from '@/types/wallet'

const wallets = useWalletStore()

const accounts: { key: 'points' | 'withdrawable' | 'consumption'; label: string; hint: string }[] =
  [
    {
      key: 'points',
      label: '积分账户',
      hint: '只参与创业专区。账户只支付锁定单价的整数倍，零头留在账户里。',
    },
    {
      key: 'withdrawable',
      label: '可提现账户',
      hint: '创业专区和会员商城都会按固定顺序使用。本阶段不能申请提现。',
    },
    {
      key: 'consumption',
      label: '消费账户',
      hint: '只参与会员商城，可以支付任意余数。三个账户之间不能互转。',
    },
  ]

onShow(() => {
  void wallets.load()
})

function account(key: 'points' | 'withdrawable' | 'consumption'): WalletAccount {
  return walletAccount(wallets.balances, key)
}
</script>

<template>
  <AppFrame title="钱包" tab="wallet">
    <view class="wallet-head">
      <text class="wh-kicker">WALLET</text>
      <view v-if="wallets.errorText" class="notice mt-12">{{ wallets.errorText }}</view>
      <view class="wallet-accounts">
        <view v-for="item in accounts" :key="item.key" class="wa-card">
          <text class="wa-lab">{{ item.label }} · 可用</text>
          <text class="wa-num">{{ formatFen(account(item.key).availableFen) }}</text>
          <view class="wa-meta">
            <text>余额 {{ yuanFen(account(item.key).balanceFen) }}</text>
            <text>冻结 {{ yuanFen(account(item.key).frozenFen) }}</text>
          </view>
          <text class="wa-hint">{{ item.hint }}</text>
        </view>
      </view>
    </view>
    <view class="pad">
      <view class="pending-note"
        >金额单位在接口里是分，这里按元展示。冻结只在订单占用且微信尚未成功时大于 0。</view
      >
    </view>
    <view class="pad" style="padding-top: 0">
      <view class="list-group">
        <view class="list-cell">
          <text class="cell-body">本阶段没有提现申请，也没有账户划转。</text>
        </view>
        <view class="list-cell hit" @click="openPage(routes.paymentAccount)">
          <text class="cell-body fw-6">收款账户</text>
          <view class="chevron" />
        </view>
      </view>
    </view>
  </AppFrame>
</template>
