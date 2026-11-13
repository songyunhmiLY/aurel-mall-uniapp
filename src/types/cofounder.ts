/** 首页入口。文案和图片由管理端配置，都可以为空。 */
export interface CofounderEntry {
  copy: string
  imageUrls: string[]
}

/** 介绍页。标题、正文和图片都由管理端配置。 */
export interface CofounderIntro {
  title: string
  body: string
  imageUrls: string[]
}

/**
 * GET /me/cofounder 里页面会用到的字段。
 * 名额、来源、入籍时间和待支付单即使出现在响应里也不进入页面。
 */
export interface CofounderPage {
  entry: CofounderEntry
  intro: CofounderIntro
  enrolled: boolean
  button: CofounderButton
  /** 开通金额，单位分。bigint 序列化后的十进制字符串。 */
  activationAmountFen: string
}

export interface CofounderButton {
  available: boolean
  reason: string
}

/** POST /me/cofounder/activations。purpose 固定为联合创始人开通，不关联订单。 */
export interface CofounderActivation {
  activationId: string
  mode: 'sandbox' | 'live'
  purpose: 'cofounder_activation'
  payNo: string
  orderId: null
  amountFen: number
  status: string
  appId: string | null
  timeStamp: string | null
  nonceStr: string | null
  package: string | null
  signType: 'RSA' | null
  paySign: string | null
}
