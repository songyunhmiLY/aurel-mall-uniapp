<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import { apiErrorMessage, isMembershipError } from '@/api/http'
import { fetchProducts } from '@/api/product'
import { sessionErrorMessage } from '@/auth/account-session'
import AppFrame from '@/components/chrome/AppFrame.vue'
import LockPanel from '@/components/common/LockPanel.vue'
import ProductArt from '@/components/visual/ProductArt.vue'
import { money } from '@/demo/format'
import { openPage, routes, withQuery } from '@/navigation/routes'
import type { ProductView } from '@/types/product'

const products = ref<ProductView[]>([])
const category = ref('全部')
const loaded = ref(false)
const errorText = ref('')
const membershipText = ref('')

const categories = computed(() => {
  const names = products.value.map((item) => item.category).filter(Boolean)
  const unique = [...new Set(names)]
  return unique.length ? ['全部', ...unique] : []
})

const visible = computed(() =>
  products.value.filter((item) => category.value === '全部' || item.category === category.value),
)

onShow(() => {
  void load()
})

async function load() {
  errorText.value = ''
  membershipText.value = ''
  try {
    const result = await fetchProducts('mall')
    products.value = result.products
    if (!categories.value.includes(category.value)) category.value = '全部'
  } catch (error) {
    products.value = []
    if (isMembershipError(error)) {
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
  openPage(withQuery(routes.productDetail, { id, zone: 'mall' }))
}
</script>

<template>
  <AppFrame title="会员商城" tab="mall" show-cart>
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
    <template v-else>
      <view v-if="categories.length" class="cats">
        <view
          v-for="item in categories"
          :key="item"
          class="cat-chip hit"
          :class="{ 'is-active': item === category }"
          @click="category = item"
        >
          {{ item }}
        </view>
      </view>
      <view class="prod-grid">
        <view
          v-for="item in visible"
          :key="item.id"
          class="prod-tile hit"
          @click="openDetail(item.id)"
        >
          <image v-if="item.coverUrl" class="prod-cover" :src="item.coverUrl" mode="aspectFill" />
          <ProductArt v-else tone="slate" />
          <view class="pt-body">
            <text class="pt-name">{{ item.name }}</text>
            <view class="price-pv mt-8">
              <text class="price t-16"><text class="yen">¥</text>{{ money(item.price) }}</text>
              <text class="pv-badge">PV {{ pvText(item.pv) }}</text>
            </view>
          </view>
        </view>
      </view>
    </template>
  </AppFrame>
</template>
