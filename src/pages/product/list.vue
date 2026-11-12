<script setup lang="ts">
import AppFrame from '@/components/chrome/AppFrame.vue'
import { mallProducts } from '@/demo/catalog'
import { money } from '@/demo/format'
import { openPage, routes, withQuery } from '@/navigation/routes'

function openDetail(id: string) {
  openPage(withQuery(routes.productDetail, { id, zone: 'mall' }))
}
</script>

<template>
  <AppFrame title="商品" show-cart>
    <view class="prod-list">
      <view v-for="item in mallProducts" :key="item.id" class="prod-row hit" @click="openDetail(item.id)">
        <view class="pr-info">
          <text class="pr-name">{{ item.name }}</text>
          <view class="price-pv mt-8">
            <text class="price">¥{{ money(item.price) }}</text>
            <text class="pv-badge">PV {{ money(item.pv || 0) }}</text>
          </view>
        </view>
      </view>
    </view>
  </AppFrame>
</template>
