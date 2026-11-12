<script setup lang="ts">
import AppFrame from '@/components/chrome/AppFrame.vue'
import ProductArt from '@/components/visual/ProductArt.vue'
import { startupProducts, startupUnitPrice } from '@/demo/catalog'
import { money, yuan } from '@/demo/format'
import { openPage, routes, withQuery } from '@/navigation/routes'

function openDetail(id: string) {
  openPage(withQuery(routes.productDetail, { id, zone: 'startup' }))
}
</script>

<template>
  <AppFrame title="创业专区">
    <view class="pad">
      <view class="notice notice-ink">
        区内所有产品单价均为 {{ yuan(startupUnitPrice) }}，可同时购买多件。付款成功后不可退单。
      </view>
    </view>
    <view class="prod-list">
      <view v-for="item in startupProducts" :key="item.id" class="prod-row hit" @click="openDetail(item.id)">
        <ProductArt :tone="item.tone" size="md" />
        <view class="pr-info">
          <text class="pr-name">{{ item.name }}</text>
          <text class="pr-desc">{{ item.desc }}</text>
          <view class="pr-foot">
            <text class="price t-17"><text class="yen">¥</text>{{ money(item.price) }}</text>
            <view class="btn btn-primary btn-sm hit" @click.stop="openDetail(item.id)">立即购买</view>
          </view>
        </view>
      </view>
    </view>
  </AppFrame>
</template>
