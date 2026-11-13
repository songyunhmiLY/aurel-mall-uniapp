<script setup lang="ts">
import { onLoad, onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { fetchOrder } from '@/api/order'
import { sessionErrorMessage } from '@/auth/account-session'
import AppFrame from '@/components/chrome/AppFrame.vue'
import OrderPay from '@/components/order/OrderPay.vue'
import { formatFen, formatInstant, yuanFen } from '@/demo/format'
import { statusLabel, zoneLabel } from '@/orders/labels'
import type { OrderView } from '@/types/order'

const orderId = ref('')
const order = ref<OrderView | null>(null)
const loaded = ref(false)
const errorText = ref('')
let requestSerial = 0

onLoad((query) => {
  orderId.value = typeof query?.id === 'string' ? query.id : ''
})

onShow(() => {
  void load()
})

async function load() {
  const serial = ++requestSerial
  if (!orderId.value) {
    loaded.value = true
    errorText.value = '订单不存在'
    return
  }
  errorText.value = ''
  try {
    const next = await fetchOrder(orderId.value)
    if (serial !== requestSerial) return
    order.value = next
  } catch (error) {
    if (serial !== requestSerial) return
    order.value = null
    errorText.value = sessionErrorMessage(error, '订单加载失败')
  } finally {
    if (serial === requestSerial) loaded.value = true
  }
}

function replace(next: OrderView) {
  requestSerial += 1
  order.value = next
  errorText.value = ''
}

function shippingLine(current: OrderView): string {
  const shipping = current.shipping
  return [shipping.province, shipping.city, shipping.district, shipping.detail]
    .filter(Boolean)
    .join(' ')
}
</script>

<template>
  <AppFrame title="订单详情">
    <view v-if="!loaded" class="empty">
      <view class="empty__title">正在读取订单</view>
    </view>
    <view v-else-if="!order" class="empty">
      <view class="empty__title">{{ errorText || '订单不存在' }}</view>
    </view>
    <view v-else class="pad">
      <view class="card card-pad">
        <view class="kv">
          <text class="k">订单号</text>
          <text class="v">{{ order.orderNo }}</text>
        </view>
        <view class="kv">
          <text class="k">专区</text>
          <text class="v">{{ zoneLabel(order.zone) }}</text>
        </view>
        <view class="kv">
          <text class="k">状态</text>
          <text class="v">{{ statusLabel(order.status) }}</text>
        </view>
        <view class="kv">
          <text class="k">下单时间</text>
          <text class="v">{{ formatInstant(order.placedAt) }}</text>
        </view>
        <view v-if="order.paidAt" class="kv">
          <text class="k">支付时间</text>
          <text class="v">{{ formatInstant(order.paidAt) }}</text>
        </view>
        <view v-if="order.shippedAt" class="kv">
          <text class="k">发货时间</text>
          <text class="v">{{ formatInstant(order.shippedAt) }}</text>
        </view>
        <view v-if="order.closedAt" class="kv">
          <text class="k">关闭时间</text>
          <text class="v">{{ formatInstant(order.closedAt) }}</text>
        </view>
      </view>

      <view class="card card-pad mt-12">
        <text class="fw-6">收货信息</text>
        <text class="mt-8">{{ order.shipping.contactName }} {{ order.shipping.contactPhone }}</text>
        <text class="muted t-13 mt-8">{{ shippingLine(order) }}</text>
        <text v-if="order.courierName || order.trackingNumber" class="muted t-13 mt-8">
          {{ order.courierName || '快递' }} {{ order.trackingNumber || '' }}
        </text>
      </view>

      <view class="card card-pad mt-12">
        <text class="fw-6">商品</text>
        <view v-for="item in order.items" :key="item.id" class="mt-12">
          <view class="row-between">
            <text class="fw-6">{{ item.productName }}</text>
            <text class="muted">× {{ item.quantity }}</text>
          </view>
          <text v-if="item.skuName" class="muted t-13">{{ item.skuName }}</text>
          <view class="kv">
            <text class="k">单价</text>
            <text class="v">{{ yuanFen(item.unitPriceFen) }}</text>
          </view>
          <view class="kv">
            <text class="k">行商品金额</text>
            <text class="v">{{ yuanFen(item.lineTotalFen) }}</text>
          </view>
          <view class="kv">
            <text class="k">行运费</text>
            <text class="v">{{ yuanFen(item.lineFreightFen) }}</text>
          </view>
          <view class="kv">
            <text class="k">行 PV</text>
            <text class="v">{{ formatFen(item.linePvFen) }}</text>
          </view>
        </view>
      </view>

      <view class="card card-pad mt-12">
        <view class="kv">
          <text class="k">商品金额</text>
          <text class="v">{{ yuanFen(order.goodsTotalFen) }}</text>
        </view>
        <view class="kv">
          <text class="k">运费</text>
          <text class="v">{{ yuanFen(order.freightFen) }}</text>
        </view>
        <view class="kv">
          <text class="k">应付</text>
          <text class="v fw-6">{{ yuanFen(order.payAmountFen) }}</text>
        </view>
        <view class="kv">
          <text class="k">PV</text>
          <text class="v">{{ formatFen(order.pvFen) }}</text>
        </view>
        <view class="kv">
          <text class="k">积分</text>
          <text class="v">{{ yuanFen(order.pointsFen) }}</text>
        </view>
        <view class="kv">
          <text class="k">可提现</text>
          <text class="v">{{ yuanFen(order.withdrawableFen) }}</text>
        </view>
        <view class="kv">
          <text class="k">消费</text>
          <text class="v">{{ yuanFen(order.consumptionFen) }}</text>
        </view>
        <view class="kv">
          <text class="k">微信</text>
          <text class="v">{{ yuanFen(order.wechatFen) }}</text>
        </view>
      </view>
      <text v-if="order.zone === 'startup'" class="hint mt-12">创业专区订单付款后不可退单。</text>
      <OrderPay :order="order" @changed="replace" />
    </view>
  </AppFrame>
</template>
