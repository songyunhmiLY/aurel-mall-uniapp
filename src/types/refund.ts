export type RefundStatus = 'pending' | 'approved' | 'rejected'

export type WechatRefundStatus = 'none' | 'sandbox' | 'accepted'

export interface RefundView {
  id: string
  orderId: string
  userId: string
  status: RefundStatus
  payAmountFen: number
  freightFen: number
  deductionHint: string
  refundFen: number | null
  deductionFen: number | null
  wechatRefundFen: number | null
  withdrawableDeductionFen: number | null
  consumptionCreditFen: number | null
  wechatRefundStatus: WechatRefundStatus | null
  appliedAt: string
  decidedAt: string | null
}

export interface RefundPage {
  items: RefundView[]
  total: number
  page: number
  pageSize: number
}

export function isRefundStatus(value: string): value is RefundStatus {
  return value === 'pending' || value === 'approved' || value === 'rejected'
}

export function isWechatRefundStatus(value: string): value is WechatRefundStatus {
  return value === 'none' || value === 'sandbox' || value === 'accepted'
}
