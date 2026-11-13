export type OrderZone = 'startup' | 'mall'

export type OrderStatus = 'pending_payment' | 'paid' | 'shipped' | 'closed'

export interface OrderShipping {
  contactName: string
  contactPhone: string
  province: string
  city: string
  district: string
  detail: string
}

/** 订单行。金额字段是 JSON 数字，单位是分。 */
export interface OrderItem {
  id: string
  skuId: string
  productName: string
  skuName: string
  unitPriceFen: number
  unitPvFen: number
  unitFreightFen: number
  quantity: number
  lineTotalFen: number
  linePvFen: number
  lineFreightFen: number
}

/** GET /orders 与 GET /orders/:id 的订单。金额 *Fen 是 JSON 数字。 */
export interface OrderView {
  id: string
  orderNo: string
  userId: string
  zone: OrderZone
  status: OrderStatus
  goodsTotalFen: number
  freightFen: number
  payAmountFen: number
  pvFen: number
  pointsFen: number
  withdrawableFen: number
  consumptionFen: number
  wechatFen: number
  shipping: OrderShipping
  courierName: string | null
  trackingNumber: string | null
  items: OrderItem[]
  placedAt: string
  paidAt: string | null
  shippedAt: string | null
  closedAt: string | null
}

export interface OrderPage {
  items: OrderView[]
  total: number
  page: number
  pageSize: number
}

/** POST /orders/:id/pay 里的 wechat。账户够付时为 null。amountFen 等于订单 wechatFen。 */
export interface WechatPrepay {
  mode: 'sandbox' | 'live'
  payNo: string
  orderId: string
  amountFen: number
  status: string
  appId: string | null
  timeStamp: string | null
  nonceStr: string | null
  package: string | null
  signType: 'RSA' | null
  paySign: string | null
}

export interface PayOrderResult {
  order: OrderView
  wechat: WechatPrepay | null
}

/** POST /payments/wechat/sandbox/succeed|fail 的 data。联合创始人开通的 orderId 为 null。 */
export interface WechatSandboxResult {
  payNo: string
  status: string
  orderId: string | null
  amountFen: number
  orderStatus: string | null
  succeededAt: string | null
}
