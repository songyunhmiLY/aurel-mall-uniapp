<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import { fetchRefunds } from '@/api/refund'
import { sessionErrorMessage } from '@/auth/account-session'
import AppFrame from '@/components/chrome/AppFrame.vue'
import { formatInstant, yuanFen } from '@/demo/format'
import { openPage, routes, withId } from '@/navigation/routes'
import { refundStatusLabel } from '@/orders/labels'
import type { RefundView } from '@/types/refund'

const items = ref<RefundView[]>([])
const total = ref(0)
const page = ref(1)
const loaded = ref(false)
const loading = ref(false)
const errorText = ref('')
const hasMore = computed(() => items.value.length < total.value)

onShow(() => {
  void reload()
})

async function reload() {
  page.value = 1
  items.value = []
  total.value = 0
  await load(1, false)
}

async function load(nextPage: number, append: boolean) {
  if (loading.value) return
  loading.value = true
  errorText.value = ''
  try {
    const result = await fetchRefunds(nextPage, 20)
    items.value = append ? items.value.concat(result.items) : result.items
    total.value = result.total
    page.value = result.page
  } catch (error) {
    if (!append) items.value = []
    errorText.value = sessionErrorMessage(error, '退款记录加载失败')
  } finally {
    loading.value = false
    loaded.value = true
  }
}
</script>

<template>
  <AppFrame title="退款记录">
    <view v-if="errorText" class="pad">
      <view class="notice">{{ errorText }}</view>
    </view>
    <view v-if="loaded && !items.length && !errorText" class="empty">
      <view class="empty__title">暂无退款申请</view>
    </view>
    <view class="pad">
      <view
        v-for="item in items"
        :key="item.id"
        class="card card-pad mb-12 hit"
        @click="openPage(withId(routes.refundDetail, item.id))"
      >
        <view class="row-between">
          <text class="fw-6">应付 {{ yuanFen(item.payAmountFen) }}</text>
          <text>{{ refundStatusLabel(item.status) }}</text>
        </view>
        <text class="muted t-13 mt-8">订单 {{ item.orderId }}</text>
        <text class="muted t-13 mt-8">{{ formatInstant(item.appliedAt) }}</text>
      </view>
      <view v-if="hasMore" class="btn btn-ghost btn-block hit" @click="load(page + 1, true)">
        {{ loading ? '加载中' : '加载更多' }}
      </view>
    </view>
  </AppFrame>
</template>
