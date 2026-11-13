<script setup lang="ts">
import { onLoad, onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { apiErrorMessage, isMembershipError } from '@/api/http'
import { fetchProducts } from '@/api/product'
import { sessionErrorMessage } from '@/auth/account-session'
import AppFrame from '@/components/chrome/AppFrame.vue'
import LockPanel from '@/components/common/LockPanel.vue'
import { money } from '@/demo/format'
import { openPage, routes, withQuery } from '@/navigation/routes'
import type { ProductView, ProductZone } from '@/types/product'

const zone = ref<ProductZone>('mall')
const products = ref<ProductView[]>([])
const loaded = ref(false)
const errorText = ref('')
const membershipText = ref('')
onLoad((query) => {
  zone.value = query?.zone === 'startup' ? 'startup' : 'mall'
  void load()
})

onShow(() => {
  if (loaded.value) void load()
})

async function load() {
  errorText.value = ''
  membershipText.value = ''
  try {
    const result = await fetchProducts(zone.value)
    products.value = result.products
  } catch (error) {
    products.value = []
    if (zone.value === 'mall' && isMembershipError(error)) {
      membershipText.value = apiErrorMessage(
        error,
        '会员商城仅对会员开放。请先在创业专区完成购买，成为会员后再来选购。',
      )
      return
    }
    errorText.value = sessionErrorMessage(error, '商品加载失败')
  } finally {
    loaded.value = true
  }
}

function pvText(pv: number | null): string {
  return pv == null ? '—' : money(pv)
}

function openDetail(id: string) {
  openPage(withQuery(routes.productDetail, { id, zone: zone.value }))
}
</script>

<template>
  <AppFrame :title="zone === 'startup' ? '创业专区' : '商品'" :show-cart="zone === 'mall'">
    <LockPanel
      v-if="membershipText"
      title="会员专属"
      :text="membershipText"
      action="前往创业专区"
      @action="openPage(routes.shop)"
    />
    <view v-else-if="errorText" class="empty">
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
        <view class="pr-info">
          <text class="pr-name">{{ item.name }}</text>
          <text v-if="item.subtitle" class="pr-desc">{{ item.subtitle }}</text>
          <view class="price-pv mt-8">
            <text class="price">¥{{ money(item.price) }}</text>
            <text v-if="zone === 'mall'" class="pv-badge">PV {{ pvText(item.pv) }}</text>
          </view>
        </view>
      </view>
    </view>
  </AppFrame>
</template>
