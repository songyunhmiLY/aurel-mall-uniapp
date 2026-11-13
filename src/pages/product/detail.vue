<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import { ApiError, apiErrorMessage, isMembershipError } from '@/api/http'
import { fenToYuan, fetchProduct } from '@/api/product'
import { sessionErrorMessage } from '@/auth/account-session'
import AppFrame from '@/components/chrome/AppFrame.vue'
import LockPanel from '@/components/common/LockPanel.vue'
import QtyStepper from '@/components/common/QtyStepper.vue'
import ProductArt from '@/components/visual/ProductArt.vue'
import { money, yuan } from '@/demo/format'
import { openPage, routes } from '@/navigation/routes'
import { useCartStore } from '@/stores/cart'
import type { ProductView, ProductZone } from '@/types/product'

const cart = useCartStore()
const zone = ref<ProductZone>('mall')
const qty = ref(1)
const product = ref<ProductView | null>(null)
const loaded = ref(false)
const errorText = ref('')
const membershipText = ref('')

const isMall = computed(() => (product.value?.zone ?? zone.value) === 'mall')
const amount = computed(() => (product.value ? fenToYuan(product.value.priceFen) * qty.value : 0))

onLoad((query) => {
  const id = typeof query?.id === 'string' ? query.id : ''
  zone.value = query?.zone === 'startup' ? 'startup' : 'mall'
  if (!id) {
    loaded.value = true
    errorText.value = '商品不存在'
    return
  }
  void load(id)
})

async function load(id: string) {
  try {
    product.value = await fetchProduct(id, zone.value)
  } catch (error) {
    product.value = null
    if (zone.value === 'mall' && isMembershipError(error)) {
      membershipText.value = apiErrorMessage(error, '非会员不能浏览会员商城')
      return
    }
    errorText.value =
      error instanceof ApiError && error.statusCode === 404
        ? '商品不存在'
        : sessionErrorMessage(error, '商品加载失败')
  } finally {
    loaded.value = true
  }
}

function pvText(pvFen: number | null): string {
  return pvFen == null ? '—' : money(fenToYuan(pvFen))
}

function change(delta: number) {
  qty.value = Math.max(1, qty.value + delta)
}

function addCart() {
  if (!product.value) return
  cart.add(
    {
      id: product.value.id,
      name: product.value.name,
      price: fenToYuan(product.value.priceFen),
      pv: product.value.pvFen == null ? 0 : fenToYuan(product.value.pvFen),
    },
    qty.value,
  )
  uni.showToast({ title: '已加入购物车', icon: 'none' })
}

function buyNow() {
  uni.showToast({ title: '支付尚未接入', icon: 'none' })
}
</script>

<template>
  <AppFrame title="商品详情" :show-cart="isMall">
    <LockPanel
      v-if="membershipText"
      title="会员专属"
      :text="membershipText"
      action="前往创业专区"
      @action="openPage(routes.shop)"
    />
    <view v-else-if="errorText" class="empty">
      <view class="empty__title">{{
        errorText === '商品不存在' ? '商品不存在' : '暂时无法加载'
      }}</view>
      <view v-if="errorText !== '商品不存在'" class="empty__text">{{ errorText }}</view>
    </view>
    <view v-else-if="loaded && !product" class="empty">
      <view class="empty__title">商品不存在</view>
    </view>
    <template v-else-if="product">
      <view class="detail-art">
        <image
          v-if="product.coverUrl"
          class="prod-cover"
          :src="product.coverUrl"
          mode="aspectFill"
        />
        <ProductArt v-else tone="slate" size="hero" />
      </view>
      <view class="detail-body">
        <text v-if="product.categoryName" class="muted t-12">{{ product.categoryName }}</text>
        <text class="detail-name" :class="{ 'mt-8': product.categoryName }">{{
          product.name
        }}</text>
        <view class="price-pv mt-12">
          <text class="price t-24"
            ><text class="yen">¥</text>{{ money(fenToYuan(product.priceFen)) }}</text
          >
          <text v-if="isMall" class="pv-badge">PV {{ pvText(product.pvFen) }}</text>
        </view>
        <text v-if="isMall" class="hint mt-8"
          >价格与 PV 分别展示。100 分 PV 等于 1 PV，不是售价。</text
        >
        <text v-if="product.subtitle" class="detail-desc">{{ product.subtitle }}</text>
        <text v-if="product.body" class="detail-desc">{{ product.body }}</text>
        <text class="muted t-13 mt-8"
          >运费 {{ yuan(fenToYuan(product.freightFen)) }} · 库存 {{ product.stockQuantity }}</text
        >
        <view class="card card-pad mt-16 row-between">
          <text class="t-14">购买数量</text>
          <QtyStepper :qty="qty" @change="change" />
        </view>
        <view v-if="!isMall" class="notice mt-16">创业专区订单付款后不可退单。</view>
      </view>
    </template>
    <template v-if="product && !membershipText" #footer>
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
