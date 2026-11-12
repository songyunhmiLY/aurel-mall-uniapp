<script setup lang="ts">
import { computed, ref } from 'vue'
import AppFrame from '@/components/chrome/AppFrame.vue'
import LockPanel from '@/components/common/LockPanel.vue'
import ProductArt from '@/components/visual/ProductArt.vue'
import { mallCategories, mallProducts } from '@/demo/catalog'
import { money } from '@/demo/format'
import { openPage, routes, withQuery } from '@/navigation/routes'
import { usePreviewStore } from '@/stores/preview'

const preview = usePreviewStore()
const category = ref('全部')
const visible = computed(() =>
  mallProducts.filter((item) => category.value === '全部' || item.cat === category.value),
)

function openDetail(id: string) {
  openPage(withQuery(routes.productDetail, { id, zone: 'mall' }))
}
</script>

<template>
  <AppFrame title="会员商城" tab="mall" show-cart>
    <LockPanel
      v-if="!preview.isMember"
      title="会员专属"
      text="会员商城仅对会员开放。请先在创业专区完成购买，成为会员后再来选购。"
      action="前往创业专区"
      @action="openPage(routes.shop)"
    />
    <template v-else>
      <view class="cats">
        <view
          v-for="item in mallCategories"
          :key="item"
          class="cat-chip hit"
          :class="{ 'is-active': item === category }"
          @click="category = item"
        >
          {{ item }}
        </view>
      </view>
      <view class="prod-grid">
        <view v-for="item in visible" :key="item.id" class="prod-tile hit" @click="openDetail(item.id)">
          <ProductArt :tone="item.tone" />
          <view class="pt-body">
            <text class="pt-name">{{ item.name }}</text>
            <view class="price-pv mt-8">
              <text class="price t-16"><text class="yen">¥</text>{{ money(item.price) }}</text>
              <text class="pv-badge">PV {{ money(item.pv || 0) }}</text>
            </view>
          </view>
        </view>
      </view>
    </template>
  </AppFrame>
</template>
