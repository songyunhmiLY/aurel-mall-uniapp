<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import { fetchProduct } from '@/api/product'
import AppFrame from '@/components/chrome/AppFrame.vue'
import LockPanel from '@/components/common/LockPanel.vue'
import QtyStepper from '@/components/common/QtyStepper.vue'
import ProductArt from '@/components/visual/ProductArt.vue'
import { findMall, findStartup, type CatalogProduct } from '@/demo/catalog'
import { money, yuan } from '@/demo/format'
import { openPage, routes } from '@/navigation/routes'
import { useCartStore } from '@/stores/cart'
import { usePreviewStore } from '@/stores/preview'

const preview = usePreviewStore()
const cart = useCartStore()
const zone = ref<'mall' | 'startup'>('mall')
const qty = ref(1)
const product = ref<CatalogProduct | null>(null)

const isMall = computed(() => zone.value === 'mall')
const blocked = computed(() => isMall.value && preview.loggedIn && !preview.isMember)
const amount = computed(() => (product.value ? product.value.price * qty.value : 0))

onLoad((query) => {
  const id = typeof query?.id === 'string' ? query.id : ''
  zone.value = query?.zone === 'startup' ? 'startup' : 'mall'
  product.value = (zone.value === 'startup' ? findStartup(id) : findMall(id)) || null
  if (!id) return
  fetchProduct(id)
    .then((detail) => {
      if (!detail?.name) return
      product.value = {
        id,
        name: detail.name,
        price: product.value?.price || 0,
        pv: product.value?.pv,
        tone: product.value?.tone || 'slate',
        desc: detail.summary || product.value?.desc || '',
        cat: product.value?.cat,
      }
    })
    .catch(() => undefined)
})

function change(delta: number) {
  qty.value = Math.max(1, qty.value + delta)
}

function addCart() {
  if (!product.value) return
  cart.add(product.value, qty.value)
  uni.showToast({ title: '已加入购物车', icon: 'none' })
}

function buyNow() {
  uni.showToast({ title: '支付尚未接入', icon: 'none' })
}
</script>

<template>
  <AppFrame title="商品详情" :show-cart="isMall">
    <LockPanel
      v-if="blocked"
      title="会员专属"
      text="会员商城仅对已在创业专区完成购买的会员开放。"
      action="前往创业专区"
      @action="openPage(routes.shop)"
    />
    <view v-else-if="!product" class="empty">
      <view class="empty__title">商品不存在</view>
    </view>
    <template v-else>
      <view class="detail-art">
        <ProductArt :tone="product.tone" size="hero" />
      </view>
      <view class="detail-body">
        <text v-if="product.cat" class="muted t-12">{{ product.cat }}</text>
        <text class="detail-name" :class="{ 'mt-8': product.cat }">{{ product.name }}</text>
        <view class="price-pv mt-12">
          <text class="price t-24"><text class="yen">¥</text>{{ money(product.price) }}</text>
          <text v-if="isMall" class="pv-badge">PV {{ money(product.pv || 0) }}</text>
        </view>
        <text v-if="isMall" class="hint mt-8">价格与 PV 分别展示。PV 为分红基数，不等于售价。</text>
        <text class="detail-desc">{{ product.desc }}</text>
        <view class="card card-pad mt-16 row-between">
          <text class="t-14">购买数量</text>
          <QtyStepper :qty="qty" @change="change" />
        </view>
        <view v-if="!isMall" class="notice mt-16">创业专区订单付款后不可退单。</view>
      </view>
    </template>
    <template v-if="product && !blocked" #footer>
      <view v-if="isMall" class="bottom-bar">
        <view class="btn btn-ghost flex-1 hit" @click="addCart">加入购物车</view>
        <view class="btn btn-primary flex-1 hit" @click="buyNow">立即购买</view>
      </view>
      <view v-else class="bottom-bar">
        <view class="bb-price">
          <view class="lab">应付</view>
          <view class="num">{{ yuan(amount) }}</view>
        </view>
        <view class="btn btn-primary hit" @click="buyNow">立即购买</view>
      </view>
    </template>
  </AppFrame>
</template>
