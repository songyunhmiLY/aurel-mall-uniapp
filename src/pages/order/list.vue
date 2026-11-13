<script setup lang="ts">
import { onLoad, onShow } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import { fetchOrderPage } from '@/api/order'
import { sessionErrorMessage } from '@/auth/account-session'
import AppFrame from '@/components/chrome/AppFrame.vue'
import { yuanFen } from '@/demo/format'
import { openPage, routes, withId } from '@/navigation/routes'
import { isOrderStatus, statusLabel, zoneLabel } from '@/orders/labels'
import type { OrderStatus, OrderView } from '@/types/order'

const filters: { id: 'all' | OrderStatus; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'pending_payment', label: '待付款' },
  { id: 'paid', label: '已支付' },
  { id: 'shipped', label: '已发货' },
  { id: 'closed', label: '已关闭' },
]

const status = ref<'all' | OrderStatus>('all')
const orders = ref<OrderView[]>([])
const total = ref(0)
const page = ref(1)
const loaded = ref(false)
const loading = ref(false)
const errorText = ref('')

const visible = computed(() =>
  orders.value.filter((order) => status.value === 'all' || order.status === status.value),
)
const hasMore = computed(() => orders.value.length < total.value)

onLoad((query) => {
  const requested = typeof query?.status === 'string' ? query.status : 'all'
  status.value = isOrderStatus(requested) ? requested : 'all'
})

onShow(() => {
  void reload()
})

async function reload() {
  page.value = 1
  orders.value = []
  total.value = 0
  await load(1, false)
}

async function load(nextPage: number, append: boolean) {
  if (loading.value) return
  loading.value = true
  errorText.value = ''
  try {
    const result = await fetchOrderPage(nextPage, 20)
    orders.value = append ? orders.value.concat(result.items) : result.items
    total.value = result.total
    page.value = result.page
  } catch (error) {
    if (!append) orders.value = []
    errorText.value = sessionErrorMessage(error, '订单加载失败')
  } finally {
    loading.value = false
    loaded.value = true
  }
}
</script>

<template>
  <AppFrame title="我的订单">
    <view class="status-filters">
      <text
        v-for="item in filters"
        :key="item.id"
        class="tag hit"
        :class="{ 'tag-gold': status === item.id }"
        @click="status = item.id"
        >{{ item.label }}</text
      >
    </view>
    <view v-if="errorText" class="pad">
      <view class="notice">{{ errorText }}</view>
    </view>
    <view v-if="loaded && !visible.length" class="empty">
      <view class="empty__title">暂无订单</view>
    </view>
    <view
      v-for="item in visible"
      :key="item.id"
      class="order-card hit"
      @click="openPage(withId(routes.orderDetail, item.id))"
    >
      <view class="oc-head">
        <text>{{ zoneLabel(item.zone) }} · {{ item.orderNo }}</text>
        <text class="fw-6">{{ statusLabel(item.status) }}</text>
      </view>
      <view class="oc-items">
        <view v-for="goods in item.items" :key="goods.id" class="row-between">
          <text class="fw-6 t-14">{{ goods.productName }}</text>
          <text class="muted t-13">× {{ goods.quantity }}</text>
        </view>
      </view>
      <view class="oc-foot">
        <text class="muted">应付</text>
        <text class="price">{{ yuanFen(item.payAmountFen) }}</text>
      </view>
    </view>
    <view v-if="hasMore" class="pad">
      <view class="btn btn-ghost btn-block hit" @click="load(page + 1, true)">
        {{ loading ? '加载中' : '加载更多' }}
      </view>
    </view>
    <view style="height: 16px" />
  </AppFrame>
</template>
