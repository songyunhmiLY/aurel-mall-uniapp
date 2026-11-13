<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import { fetchProducts } from '@/api/product'
import { sessionErrorMessage } from '@/auth/account-session'
import AppFrame from '@/components/chrome/AppFrame.vue'
import ProductArt from '@/components/visual/ProductArt.vue'
import { money, yuan } from '@/demo/format'
import { openPage, routes, withQuery } from '@/navigation/routes'
import type { ProductView } from '@/types/product'

const products = ref<ProductView[]>([])
const unitPrice = ref<number | null>(null)
const loaded = ref(false)
const errorText = ref('')

const notice = computed(() => {
  if (!loaded.value || errorText.value || !products.value.length) return ''
  const refund = '可同时购买多件。付款成功后不可退单。'
  if (unitPrice.value == null) return refund
  return `区内所有产品单价均为 ${yuan(unitPrice.value)}，${refund}`
})

onShow(() => {
  void load()
})

async function load() {
  errorText.value = ''
  try {
    const result = await fetchProducts('startup')
    products.value = result.products
    unitPrice.value = result.unitPrice
  } catch (error) {
    products.value = []
    unitPrice.value = null
    errorText.value = sessionErrorMessage(error, '商品加载失败')
  } finally {
    loaded.value = true
  }
}

function openDetail(id: string) {
  openPage(withQuery(routes.productDetail, { id, zone: 'startup' }))
}
</script>

<template>
  <AppFrame title="创业专区">
    <view v-if="notice" class="pad">
      <view class="notice notice-ink">{{ notice }}</view>
    </view>
    <view v-if="errorText" class="empty">
      <view class="empty__title">暂时无法加载</view>
      <view class="empty__text">{{ errorText }}</view>
    </view>
    <view v-else-if="loaded && !products.length" class="empty">
      <view class="empty__title">暂无在售商品</view>
    </view>
    <view v-else class="prod-list">
      <view
        v-for="item in products"
        :key="item.id"
        class="prod-row hit"
        @click="openDetail(item.id)"
      >
        <image
          v-if="item.coverUrl"
          class="prod-cover prod-cover--md"
          :src="item.coverUrl"
          mode="aspectFill"
        />
        <ProductArt v-else tone="slate" size="md" />
        <view class="pr-info">
          <text class="pr-name">{{ item.name }}</text>
          <text v-if="item.subtitle" class="pr-desc">{{ item.subtitle }}</text>
          <view class="pr-foot">
            <text class="price t-17"><text class="yen">¥</text>{{ money(item.price) }}</text>
            <view class="btn btn-primary btn-sm hit" @click.stop="openDetail(item.id)"
              >立即购买</view
            >
          </view>
        </view>
      </view>
    </view>
  </AppFrame>
</template>
