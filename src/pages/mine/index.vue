<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import { fetchOrderPage } from '@/api/order'
import { walletAccount } from '@/api/wallet'
import AppFrame from '@/components/chrome/AppFrame.vue'
import MineIcon from '@/components/mine/MineIcon.vue'
import CodeMark from '@/components/visual/CodeMark.vue'
import { copyText, formatFen } from '@/demo/format'
import { openPage, routes, withQuery } from '@/navigation/routes'
import { usePreviewStore } from '@/stores/preview'
import { useUserStore } from '@/stores/user'
import { useWalletStore } from '@/stores/wallet'
import type { OrderStatus } from '@/types/order'

const preview = usePreviewStore()
const user = useUserStore()
const wallets = useWalletStore()
const counts = ref<Record<OrderStatus, number>>({
  pending_payment: 0,
  paid: 0,
  shipped: 0,
  closed: 0,
})

const statuses: { id: OrderStatus; label: string; icon: string }[] = [
  { id: 'pending_payment', label: '待付款', icon: 'pay' },
  { id: 'paid', label: '已支付', icon: 'ship' },
  { id: 'shipped', label: '已发货', icon: 'recv' },
  { id: 'closed', label: '已关闭', icon: 'refund' },
]

const apps = computed(() => {
  const list: { url: string; label: string; icon: string }[] = [
    { url: routes.register, label: '填写邀请码', icon: 'invite' },
    { url: routes.invite, label: '邀请好友', icon: 'invite' },
    { url: routes.team, label: '创业团队', icon: 'team' },
    { url: routes.service, label: '联系客服', icon: 'service' },
    { url: routes.addresses, label: '地址管理', icon: 'pin' },
    { url: routes.paymentAccount, label: '收款设置', icon: 'bank' },
    { url: routes.refunds, label: '退款记录', icon: 'refund' },
    { url: routes.notices, label: '系统通知', icon: 'bell' },
    { url: routes.feedback, label: '我要反馈', icon: 'edit' },
  ]
  return list
})

function availableText(key: 'points' | 'withdrawable' | 'consumption'): string {
  if (!wallets.balances) return '—'
  return formatFen(walletAccount(wallets.balances, key).availableFen)
}

onShow(() => {
  if (!user.token) return
  void wallets.load()
  void fetchOrderPage(1, 100)
    .then((page) => {
      const next = { pending_payment: 0, paid: 0, shipped: 0, closed: 0 }
      for (const order of page.items) next[order.status] += 1
      counts.value = next
    })
    .catch(() => undefined)
})

function openOrders(status: string) {
  openPage(withQuery(routes.orderList, { status }))
}
</script>

<template>
  <AppFrame title="我的" tab="mine">
    <view class="mine-head">
      <view class="mine-top">
        <view class="avatar">{{ user.avatarText }}</view>
        <view class="flex-1">
          <text class="t-20 fw-6">{{ user.nickname || '访客' }}</text>
          <text v-if="user.phone" class="muted-2 t-13 mt-8">{{ user.phone }}</text>
          <view class="mine-idline">
            <text class="tag" :class="{ 'tag-gold': preview.isMember }">
              {{ preview.isMember ? '会员' : '尚未成为会员' }}
            </text>
            <template v-if="user.userId">
              <text class="mid-id"
                >{{ preview.isMember ? '会员编号' : '用户 ID' }}
                <text class="mono">{{ user.userId }}</text></text
              >
              <text class="link-copy hit" @click="copyText(user.userId)">复制</text>
            </template>
          </view>
        </view>
        <view class="mine-gear hit" @click="openPage(routes.settings)">
          <MineIcon name="gear" />
        </view>
      </view>
      <view v-if="!preview.isMember" class="mt-16">
        <view class="btn btn-gold btn-block hit" @click="openPage(routes.shop)"
          >前往创业专区，成为会员</view
        >
      </view>
    </view>
    <view class="mine-sheet">
      <view class="card asset-mini">
        <view class="hit" @click="openPage(routes.wallet)">
          <text class="am-lab">积分</text>
          <text class="am-num">{{ availableText('points') }}</text>
        </view>
        <view class="hit" @click="openPage(routes.wallet)">
          <text class="am-lab">提现</text>
          <text class="am-num">{{ availableText('withdrawable') }}</text>
        </view>
        <view class="hit" @click="openPage(routes.wallet)">
          <text class="am-lab">消费</text>
          <text class="am-num">{{ availableText('consumption') }}</text>
        </view>
      </view>
      <view class="entry-pair">
        <view class="entry-pair__btn hit" @click="openPage(routes.invite)">
          <text class="ep-kicker">INVITE</text>
          <text class="ep-title">邀请好友</text>
          <text class="ep-desc">分享海报与邀请码</text>
        </view>
        <view class="entry-pair__btn hit" @click="openPage(routes.welfare)">
          <text class="ep-kicker">WELFARE</text>
          <text class="ep-title">福利专场</text>
          <text class="ep-desc">报名参加当日红包</text>
        </view>
      </view>
      <view class="card mb-12">
        <view class="row-between card-pad" style="padding-bottom: 4px">
          <text class="fw-6">我的订单</text>
          <text class="muted t-13 hit" @click="openOrders('all')">全部</text>
        </view>
        <view class="order-status">
          <view
            v-for="item in statuses"
            :key="item.id"
            class="order-status__btn hit"
            @click="openOrders(item.id)"
          >
            <MineIcon :name="item.icon" />
            <text>{{ item.label }}</text>
            <text v-if="counts[item.id]" class="os-badge">{{ counts[item.id] }}</text>
          </view>
        </view>
      </view>
      <view class="card card-pad mb-12">
        <text class="fw-6 mb-12">会员码</text>
        <view v-if="user.inviteCode" class="barcode-wrap">
          <CodeMark mode="barcode" :value="user.inviteCode" />
          <text class="barcode-label">{{ user.inviteCode }}</text>
        </view>
        <text v-else class="hint">成为会员后才会有邀请码。</text>
      </view>
      <view class="card">
        <view class="card-pad" style="padding-bottom: 4px">
          <text class="fw-6">我的应用</text>
        </view>
        <view class="app-grid">
          <view
            v-for="item in apps"
            :key="item.label"
            class="app-grid__btn hit"
            @click="openPage(item.url)"
          >
            <view class="ag-ico">
              <MineIcon :name="item.icon" />
            </view>
            <text>{{ item.label }}</text>
          </view>
        </view>
      </view>
    </view>
  </AppFrame>
</template>
