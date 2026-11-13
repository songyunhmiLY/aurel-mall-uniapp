import { ApiError, request } from './http'
import { asRecord, readString } from './record'
import { isOrderStatus, isOrderZone } from '@/orders/labels'
import type {
  OrderItem,
  OrderPage,
  OrderShipping,
  OrderView,
  OrderZone,
  PayOrderResult,
  WechatPrepay,
} from '@/types/order'

export interface CreateOrderInput {
  zone: OrderZone
  addressId: string
  items: { productId: string; quantity: number }[]
}

export function fetchOrderPage(page = 1, pageSize = 20) {
  return request<unknown>({
    path: '/orders',
    data: { page, pageSize },
    withAuth: true,
  }).then(readOrderPage)
}

export function fetchOrder(id: string) {
  return request<unknown>({
    path: `/orders/${encodeURIComponent(id)}`,
    withAuth: true,
  }).then(readOrder)
}

export function createOrder(body: CreateOrderInput) {
  return request<unknown>({
    path: '/orders',
    method: 'POST',
    data: {
      zone: body.zone,
      addressId: body.addressId,
      items: body.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    },
    withAuth: true,
  }).then(readOrder)
}

/**
 * 按服务端固定顺序支付。只有微信支付且商户资料已配齐时才带 appId、openid。
 * 不走 POST /payments/wechat/prepay。
 */
export function payOrder(id: string, credentials?: { appId: string; openid: string }) {
  const data =
    credentials && credentials.appId && credentials.openid
      ? { appId: credentials.appId, openid: credentials.openid }
      : {}
  return request<unknown>({
    path: `/orders/${encodeURIComponent(id)}/pay`,
    method: 'POST',
    data,
    withAuth: true,
  }).then(readPayResult)
}

export function cancelOrder(id: string) {
  return request<unknown>({
    path: `/orders/${encodeURIComponent(id)}/cancel`,
    method: 'POST',
    withAuth: true,
  }).then(readOrder)
}

export function timeoutOrder(id: string) {
  return request<unknown>({
    path: `/orders/${encodeURIComponent(id)}/timeout`,
    method: 'POST',
    withAuth: true,
  }).then(readOrder)
}

export function readOrderPage(data: unknown): OrderPage {
  const record = asRecord(data)
  if (!record || !Array.isArray(record.items)) throw new ApiError('订单响应无效')
  return {
    items: record.items.map(readOrder),
    total: readCount(record.total),
    page: readCount(record.page),
    pageSize: readCount(record.pageSize),
  }
}

export function readPayResult(data: unknown): PayOrderResult {
  const record = asRecord(data)
  if (!record || !('order' in record) || !('wechat' in record)) throw new ApiError('支付响应无效')
  return {
    order: readOrder(record.order),
    wechat: readWechat(record.wechat),
  }
}

export function readOrder(data: unknown): OrderView {
  const record = asRecord(data)
  if (!record) throw new ApiError('订单响应无效')
  const zone = readString(record.zone)
  const status = readString(record.status)
  if (!isOrderZone(zone) || !isOrderStatus(status)) throw new ApiError('订单响应无效')
  const shipping = readShipping(record.shipping)
  if (!Array.isArray(record.items)) throw new ApiError('订单响应无效')
  return {
    id: requireId(record.id),
    orderNo: requireText(record.orderNo),
    userId: requireId(record.userId),
    zone,
    status,
    goodsTotalFen: requireFen(record.goodsTotalFen),
    freightFen: requireFen(record.freightFen),
    payAmountFen: requireFen(record.payAmountFen),
    pvFen: requireFen(record.pvFen),
    pointsFen: requireFen(record.pointsFen),
    withdrawableFen: requireFen(record.withdrawableFen),
    consumptionFen: requireFen(record.consumptionFen),
    wechatFen: requireFen(record.wechatFen),
    shipping,
    courierName: requireNullableString(record.courierName),
    trackingNumber: requireNullableString(record.trackingNumber),
    items: record.items.map(readItem),
    placedAt: requireText(record.placedAt),
    paidAt: requireNullableString(record.paidAt),
    shippedAt: requireNullableString(record.shippedAt),
    closedAt: requireNullableString(record.closedAt),
  }
}

function readItem(data: unknown): OrderItem {
  const record = asRecord(data)
  if (!record) throw new ApiError('订单响应无效')
  const quantity = record.quantity
  if (typeof quantity !== 'number' || !Number.isInteger(quantity))
    throw new ApiError('订单响应无效')
  return {
    id: requireId(record.id),
    skuId: requireId(record.skuId),
    productName: requireText(record.productName),
    skuName: readText(record.skuName),
    unitPriceFen: requireFen(record.unitPriceFen),
    unitPvFen: requireFen(record.unitPvFen),
    unitFreightFen: requireFen(record.unitFreightFen),
    quantity,
    lineTotalFen: requireFen(record.lineTotalFen),
    linePvFen: requireFen(record.linePvFen),
    lineFreightFen: requireFen(record.lineFreightFen),
  }
}

function readShipping(value: unknown): OrderShipping {
  const record = asRecord(value)
  if (!record) throw new ApiError('订单响应无效')
  return {
    contactName: readText(record.contactName),
    contactPhone: readText(record.contactPhone),
    province: readText(record.province),
    city: readText(record.city),
    district: readText(record.district),
    detail: readText(record.detail),
  }
}

function readWechat(value: unknown): WechatPrepay | null {
  if (value === null) return null
  const record = asRecord(value)
  if (!record) throw new ApiError('支付响应无效')
  if (record.mode !== 'sandbox' && record.mode !== 'live') throw new ApiError('支付响应无效')
  if (record.signType !== null && record.signType !== 'RSA') throw new ApiError('支付响应无效')
  return {
    mode: record.mode,
    payNo: requireText(record.payNo),
    orderId: requireId(record.orderId),
    amountFen: requireFen(record.amountFen),
    status: requireText(record.status),
    appId: requireNullableString(record.appId),
    timeStamp: requireNullableString(record.timeStamp),
    nonceStr: requireNullableString(record.nonceStr),
    package: requireNullableString(record.package),
    signType: record.signType,
    paySign: requireNullableString(record.paySign),
  }
}

function requireFen(value: unknown): number {
  if (typeof value !== 'number' || !Number.isInteger(value)) throw new ApiError('订单响应无效')
  return value
}

function readText(value: unknown): string {
  if (typeof value !== 'string') throw new ApiError('订单响应无效')
  return value.trim()
}

function requireText(value: unknown): string {
  const text = readText(value)
  if (!text) throw new ApiError('订单响应无效')
  return text
}

function requireId(value: unknown): string {
  const text = requireText(value)
  if (!/^[1-9]\d*$/.test(text)) throw new ApiError('订单响应无效')
  return text
}

function requireNullableString(value: unknown): string | null {
  if (value === null) return null
  if (typeof value !== 'string') throw new ApiError('订单响应无效')
  const text = value.trim()
  return text.length ? text : null
}

function readCount(value: unknown): number {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
    throw new ApiError('订单响应无效')
  }
  return value
}
