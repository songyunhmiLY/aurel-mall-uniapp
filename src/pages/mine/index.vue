<script setup lang="ts">
import { computed } from 'vue'
import AppFrame from '@/components/chrome/AppFrame.vue'
import MineIcon from '@/components/mine/MineIcon.vue'
import CodeMark from '@/components/visual/CodeMark.vue'
import { orderCount } from '@/demo/catalog'
import { copyText, money } from '@/demo/format'
import { openPage, routes, withQuery } from '@/navigation/routes'
import { usePreviewStore } from '@/stores/preview'

const preview = usePreviewStore()
const profile = computed(() => preview.profile)
const code = computed(() => profile.value.inviteCode || 'AUREL')

const statuses = [
  { id: 'pendingPay', label: '待付款', icon: 'pay' },
  { id: 'pendingShip', label: '待发货', icon: 'ship' },
  { id: 'shipped', label: '待收货', icon: 'recv' },
  { id: 'refund', label: '退款/售后', icon: 'refund' },
]

const apps = computed(() => {
  const list: { url: string; label: string; icon: string }[] = [
    { url: routes.invite, label: '邀请好友', icon: 'invite' },
    { url: routes.team, label: '创业团队', icon: 'team' },
    { url: routes.service, label: '联系客服', icon: 'service' },
    { url: routes.addresses, label: '地址管理', icon: 'pin' },
    { url: routes.paymentAccount, label: '收款设置', icon: 'bank' },
    { url: routes.notices, label: '系统通知', icon: 'bell' },
    { url: routes.feedback, label: '我要反馈', icon: 'edit' },
  ]
  if (preview.isMember) {
    list.unshift({ url: routes.transfer, label: '消费转账', icon: 'transfer' })
  }
  return list
})

function openOrders(status: string) {
  openPage(withQuery(routes.orderList, { status }))
}
</script>

<template>
  <AppFrame title="我的" tab="mine">
    <view class="mine-head">
      <view class="mine-top">
        <view class="avatar">{{ preview.avatarText }}</view>
        <view class="flex-1">
          <text class="t-20 fw-6">{{ profile.name || '访客' }}</text>
          <text v-if="profile.phone" class="muted-2 t-13 mt-8">{{ profile.phone }}</text>
          <view class="mine-idline">
            <text class="tag" :class="{ 'tag-gold': preview.isMember }">
              {{ preview.isMember ? '会员' : '尚未成为会员' }}
            </text>
            <template v-if="preview.isMember && profile.memberId">
              <text class="mid-id">会员 ID <text class="mono">{{ profile.memberId }}</text></text>
              <text class="link-copy hit" @click="copyText(profile.memberId)">复制</text>
            </template>
          </view>
        </view>
        <view class="mine-gear hit" @click="openPage(routes.settings)">
          <MineIcon name="gear" />
        </view>
      </view>
      <view v-if="!preview.isMember" class="mt-16">
        <view class="btn btn-gold btn-block hit" @click="openPage(routes.shop)">前往创业专区，成为会员</view>
      </view>
    </view>
    <view class="mine-sheet">
      <view class="card asset-mini">
        <view class="hit" @click="openPage(routes.wallet)">
          <text class="am-lab">积分</text>
          <text class="am-num">{{ money(profile.points) }}</text>
        </view>
        <view class="hit" @click="openPage(routes.wallet)">
          <text class="am-lab">提现</text>
          <text class="am-num">{{ money(profile.withdraw) }}</text>
        </view>
        <view class="hit" @click="openPage(routes.wallet)">
          <text class="am-lab">消费</text>
          <text class="am-num">{{ money(profile.consume) }}</text>
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
          <view v-for="item in statuses" :key="item.id" class="order-status__btn hit" @click="openOrders(item.id)">
            <MineIcon :name="item.icon" />
            <text>{{ item.label }}</text>
            <text v-if="orderCount(item.id)" class="os-badge">{{ orderCount(item.id) }}</text>
          </view>
        </view>
      </view>
      <view class="card card-pad mb-12">
        <text class="fw-6 mb-12">会员码付款</text>
        <view class="barcode-wrap">
          <CodeMark mode="barcode" :value="code" />
          <text class="barcode-label">{{ code }}</text>
        </view>
      </view>
      <view class="card">
        <view class="card-pad" style="padding-bottom: 4px">
          <text class="fw-6">我的应用</text>
        </view>
        <view class="app-grid">
          <view v-for="item in apps" :key="item.label" class="app-grid__btn hit" @click="openPage(item.url)">
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
