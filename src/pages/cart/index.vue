<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { fetchCart } from '@/api/cart'
import AppFrame from '@/components/chrome/AppFrame.vue'
import LockPanel from '@/components/common/LockPanel.vue'
import QtyStepper from '@/components/common/QtyStepper.vue'
import ProductArt from '@/components/visual/ProductArt.vue'
import { money, yuan } from '@/demo/format'
import { openPage, routes } from '@/navigation/routes'
import { useCartStore } from '@/stores/cart'
import { usePreviewStore } from '@/stores/preview'

const preview = usePreviewStore()
const cart = useCartStore()

onShow(() => {
  fetchCart()
    .then((data) => {
      if (Array.isArray(data.items) && data.items.length) cart.replace(data.items)
    })
    .catch(() => undefined)
})

function checkout() {
  if (!cart.selected.length) return
  uni.showToast({ title: '支付尚未接入', icon: 'none' })
}
</script>

<template>
  <AppFrame title="购物车">
    <LockPanel
      v-if="preview.loggedIn && !preview.isMember"
      title="会员专属"
      text="会员商城仅对会员开放。请先在创业专区完成购买，成为会员后再来选购。"
      action="前往创业专区"
      @action="openPage(routes.shop)"
    />
    <view v-else-if="cart.items.length === 0" class="empty">
      <view class="empty__title">购物车是空的</view>
      <view class="empty__text">在会员商城挑选商品，可合并为一笔订单结算。</view>
      <view class="btn btn-primary hit" @click="openPage(routes.mall)">去逛逛</view>
    </view>
    <view v-else class="prod-list">
      <view v-for="item in cart.items" :key="item.id" class="prod-row">
        <view class="hit" style="display: flex; align-items: center; padding-top: 22px" @click="cart.toggle(item.id)">
          <view class="check" :class="{ 'is-on': item.checked !== false }" />
        </view>
        <ProductArt :tone="item.tone" size="md" />
        <view class="pr-info">
          <text class="pr-name">{{ item.name }}</text>
          <view class="price-pv mt-8">
            <text class="price t-16"><text class="yen">¥</text>{{ money(item.price || 0) }}</text>
            <text class="pv-badge">PV {{ money(item.pv || 0) }}</text>
          </view>
          <view class="pr-foot">
            <QtyStepper :qty="item.quantity" @change="cart.changeQty(item.id, $event)" />
            <text class="muted t-13 hit" @click="cart.remove(item.id)">删除</text>
          </view>
        </view>
      </view>
    </view>
    <template v-if="preview.isMember && cart.items.length" #footer>
      <view class="bottom-bar">
        <view class="bb-price">
          <view class="lab">已选 {{ cart.selected.length }} 件 · 合计 PV {{ money(cart.selectedPv) }}</view>
          <view class="num">{{ yuan(cart.selectedAmount) }}</view>
        </view>
        <view class="btn btn-primary hit" @click="checkout">去结算</view>
      </view>
    </template>
  </AppFrame>
</template>
