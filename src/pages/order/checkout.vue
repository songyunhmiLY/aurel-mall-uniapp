<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import { fetchAddresses, type Address } from '@/api/address'
import { apiErrorMessage, isMallPurchaseError, isMissingInviterError } from '@/api/http'
import { createOrder } from '@/api/order'
import { fetchProduct } from '@/api/product'
import { sessionErrorMessage } from '@/auth/account-session'
import AppFrame from '@/components/chrome/AppFrame.vue'
import QtyStepper from '@/components/common/QtyStepper.vue'
import { formatFen, yuanFen } from '@/demo/format'
import { openPage, routes, withId } from '@/navigation/routes'
import { isOrderZone, zoneLabel } from '@/orders/labels'
import { useCartStore } from '@/stores/cart'
import type { OrderZone } from '@/types/order'

interface DraftLine {
  productId: string
  quantity: number
  name: string
  unitPriceFen: number
  unitFreightFen: number
  unitPvFen: number | null
}

const cart = useCartStore()
const zone = ref<OrderZone>('startup')
const lines = ref<DraftLine[]>([])
const addresses = ref<Address[]>([])
const addressId = ref('')
const loaded = ref(false)
const pending = ref(false)
const errorText = ref('')
const invitePrompt = ref(false)
const fromCart = ref(false)

const goodsFen = computed(() =>
  lines.value.reduce((sum, line) => sum + line.unitPriceFen * line.quantity, 0),
)
const freightFen = computed(() =>
  lines.value.reduce((sum, line) => sum + line.unitFreightFen * line.quantity, 0),
)
const payableFen = computed(() => goodsFen.value + freightFen.value)

onLoad((query) => {
  const requested = typeof query?.zone === 'string' ? query.zone : ''
  zone.value = isOrderZone(requested) ? requested : 'startup'
  fromCart.value = query?.source === 'cart'
  void load(query)
})

async function load(query?: Record<string, unknown>) {
  errorText.value = ''
  invitePrompt.value = false
  try {
    const [addressList, drafts] = await Promise.all([fetchAddresses(), loadLines(query)])
    addresses.value = addressList
    lines.value = drafts
    const preferred = addressList.find((item) => item.isDefault) ?? addressList[0]
    addressId.value = preferred?.id ?? ''
  } catch (error) {
    lines.value = []
    errorText.value = sessionErrorMessage(error, '结算信息加载失败')
  } finally {
    loaded.value = true
  }
}

async function loadLines(query?: Record<string, unknown>): Promise<DraftLine[]> {
  const requested = fromCart.value
    ? cart.selected.map((item) => ({ productId: item.id, quantity: item.quantity }))
    : [
        {
          productId: typeof query?.productId === 'string' ? query.productId : '',
          quantity: Number(query?.quantity),
        },
      ]
  if (!requested.length || requested.some((item) => !item.productId)) {
    throw new Error('请选择商品')
  }
  const seen = new Set<string>()
  const drafts: DraftLine[] = []
  for (const item of requested) {
    if (seen.has(item.productId)) throw new Error('商品重复')
    seen.add(item.productId)
    if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 9999) {
      throw new Error('数量不正确')
    }
    const product = await fetchProduct(item.productId, zone.value)
    if (product.zone !== zone.value) throw new Error('商品专区不一致')
    drafts.push({
      productId: product.id,
      quantity: item.quantity,
      name: product.name,
      unitPriceFen: product.priceFen,
      unitFreightFen: product.freightFen,
      unitPvFen: product.pvFen,
    })
  }
  return drafts
}

function changeQty(productId: string, delta: number) {
  const line = lines.value.find((item) => item.productId === productId)
  if (!line) return
  line.quantity = Math.min(9999, Math.max(1, line.quantity + delta))
}

function region(item: Address): string {
  return [item.province, item.city, item.district, item.detail].filter(Boolean).join(' ')
}

async function submit() {
  if (pending.value) return
  if (!addressId.value) {
    errorText.value = '请选择收货地址'
    invitePrompt.value = false
    return
  }
  if (!lines.value.length) {
    errorText.value = '请选择商品'
    return
  }
  pending.value = true
  errorText.value = ''
  invitePrompt.value = false
  try {
    const order = await createOrder({
      zone: zone.value,
      addressId: addressId.value,
      items: lines.value.map((line) => ({ productId: line.productId, quantity: line.quantity })),
    })
    if (fromCart.value) {
      for (const line of lines.value) cart.remove(line.productId)
    }
    uni.redirectTo({ url: withId(routes.orderDetail, order.id) })
  } catch (error) {
    invitePrompt.value = isMissingInviterError(error)
    errorText.value =
      invitePrompt.value || isMallPurchaseError(error)
        ? apiErrorMessage(error, '订单未创建')
        : sessionErrorMessage(error, '订单未创建')
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <AppFrame title="确认订单">
    <view v-if="!loaded" class="empty">
      <view class="empty__title">正在准备订单</view>
    </view>
    <view v-else class="pad">
      <text class="fw-6">{{ zoneLabel(zone) }}</text>
      <text class="hint mt-8">应付为商品金额加运费。必须选择一个已有收货地址。</text>
      <view v-if="errorText" class="notice mt-12">{{ errorText }}</view>
      <view v-if="invitePrompt" class="mt-12">
        <text class="hint"
          >登录不会自动绑定邀请人。请填写一名未停用会员的 6 位邀请码后再下创业专区订单。</text
        >
        <view class="btn btn-gold btn-block mt-12 hit" @click="openPage(routes.register)"
          >填写邀请码</view
        >
      </view>

      <view class="card card-pad mt-16">
        <view class="row-between">
          <text class="fw-6">收货地址</text>
          <text class="t-13 fw-6 hit" @click="openPage(routes.addresses)">管理地址</text>
        </view>
        <view v-if="!addresses.length" class="hint mt-12">还没有收货地址。请先新增一条。</view>
        <view
          v-for="item in addresses"
          :key="item.id"
          class="addr-pick hit"
          @click="addressId = item.id"
        >
          <view class="check" :class="{ 'is-on': addressId === item.id }" />
          <view class="flex-1">
            <text class="fw-6"
              >{{ item.contactName }} <text class="muted t-13">{{ item.contactPhone }}</text></text
            >
            <text v-if="item.isDefault" class="tag tag-gold">默认</text>
            <text class="muted t-13 mt-8">{{ region(item) }}</text>
          </view>
        </view>
      </view>

      <view v-if="!lines.length" class="empty">
        <view class="empty__title">没有可结算的商品</view>
      </view>
      <view v-for="line in lines" :key="line.productId" class="card card-pad mt-12">
        <view class="row-between">
          <text class="fw-6">{{ line.name }}</text>
          <text class="price">{{ yuanFen(line.unitPriceFen) }}</text>
        </view>
        <text class="muted t-13 mt-8">运费 {{ yuanFen(line.unitFreightFen) }} / 件</text>
        <text v-if="zone === 'mall'" class="muted t-13">PV {{ formatFen(line.unitPvFen) }}</text>
        <view class="row-between mt-12">
          <text class="t-14">数量</text>
          <QtyStepper :qty="line.quantity" @change="changeQty(line.productId, $event)" />
        </view>
      </view>

      <view class="card card-pad mt-12">
        <view class="kv">
          <text class="k">商品金额</text>
          <text class="v">{{ yuanFen(goodsFen) }}</text>
        </view>
        <view class="kv">
          <text class="k">运费</text>
          <text class="v">{{ yuanFen(freightFen) }}</text>
        </view>
        <view class="kv">
          <text class="k">预计应付</text>
          <text class="v fw-6">{{ yuanFen(payableFen) }}</text>
        </view>
        <text class="hint mt-8">提交后以订单返回的金额为准。</text>
      </view>
      <view class="btn btn-primary btn-block mt-16 hit" @click="submit">
        {{ pending ? '提交中' : '提交订单' }}
      </view>
    </view>
  </AppFrame>
</template>
