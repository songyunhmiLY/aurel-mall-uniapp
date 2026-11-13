<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { walletAccount } from '@/api/wallet'
import AppFrame from '@/components/chrome/AppFrame.vue'
import { formatFen, yuanFen } from '@/demo/format'
import { openPage, routes, withQuery } from '@/navigation/routes'
import { useWalletStore } from '@/stores/wallet'
import type { WalletAccount, WalletType } from '@/types/wallet'

const wallets = useWalletStore()

const accounts: { key: WalletType; label: string; hint: string }[] = [
  {
    key: 'points',
    label: '积分账户',
    hint: '只参与创业专区。账户只支付锁定单价的整数倍，零头留在账户里。',
  },
  {
    key: 'withdrawable',
    label: '可提现账户',
    hint: '创业专区和会员商城都会按固定顺序使用。提现由工作人员审核后打款。',
  },
  {
    key: 'consumption',
    label: '消费账户',
    hint: '只参与会员商城，可以支付任意余数，也可以划转给其他会员。',
  },
]

onShow(() => {
  void wallets.load()
})

function account(key: WalletType): WalletAccount {
  return walletAccount(wallets.balances, key)
}

function openLedger(walletType: WalletType) {
  openPage(withQuery(routes.ledger, { walletType }))
}
</script>

<template>
  <AppFrame title="钱包" tab="wallet">
    <view class="wallet-head">
      <text class="wh-kicker">WALLET</text>
      <view v-if="wallets.errorText" class="notice mt-12">{{ wallets.errorText }}</view>
      <view class="wallet-accounts">
        <view
          v-for="item in accounts"
          :key="item.key"
          class="wa-card hit"
          @click="openLedger(item.key)"
        >
          <text class="wa-lab">{{ item.label }} · 可用</text>
          <text class="wa-num">{{
            wallets.balances ? formatFen(account(item.key).availableFen) : '—'
          }}</text>
          <view class="wa-meta">
            <text>余额 {{ wallets.balances ? yuanFen(account(item.key).balanceFen) : '—' }}</text>
            <text>冻结 {{ wallets.balances ? yuanFen(account(item.key).frozenFen) : '—' }}</text>
          </view>
          <text class="wa-hint">{{ item.hint }}</text>
        </view>
      </view>
    </view>
    <view class="pad">
      <view class="pending-note"> 金额按元展示。三个账户之间不能互转。点按账户查看流水。 </view>
    </view>
    <view class="pad" style="padding-top: 0">
      <view class="list-group">
        <view class="list-cell hit" @click="openPage(routes.categories)">
          <text class="cell-body fw-6">可提现分类</text>
          <view class="chevron" />
        </view>
        <view class="list-cell hit" @click="openPage(routes.withdraw)">
          <text class="cell-body fw-6">申请提现</text>
          <view class="chevron" />
        </view>
        <view class="list-cell hit" @click="openPage(routes.withdrawals)">
          <text class="cell-body fw-6">提现记录</text>
          <view class="chevron" />
        </view>
        <view class="list-cell hit" @click="openPage(routes.transfer)">
          <text class="cell-body fw-6">消费划转</text>
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
