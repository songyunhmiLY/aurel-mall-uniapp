import { ApiError, request } from './http'
import { asRecord, readString } from './record'
import type { WechatSandboxResult } from '@/types/order'

/** 商户证书未配置时，用支付单号模拟微信结果。不是微信网页授权。 */
export function sandboxSucceed(payNo: string) {
  return request<unknown>({
    path: '/payments/wechat/sandbox/succeed',
    method: 'POST',
    data: { payNo },
    withAuth: true,
  }).then(readSandboxResult)
}

export function sandboxFail(payNo: string) {
  return request<unknown>({
    path: '/payments/wechat/sandbox/fail',
    method: 'POST',
    data: { payNo },
    withAuth: true,
  }).then(readSandboxResult)
}

export function readSandboxResult(data: unknown): WechatSandboxResult {
  const record = asRecord(data)
  if (!record) throw new ApiError('支付响应无效')
  const payNo = readString(record.payNo)
  const status = readString(record.status)
  const orderId = readSandboxOrderId(record.orderId)
  if (!payNo || !status) throw new ApiError('支付响应无效')
  if (typeof record.amountFen !== 'number' || !Number.isInteger(record.amountFen)) {
    throw new ApiError('支付响应无效')
  }
  const orderStatus = record.orderStatus
  if (orderStatus !== null && typeof orderStatus !== 'string') throw new ApiError('支付响应无效')
  const succeededAt = record.succeededAt
  if (succeededAt !== null && typeof succeededAt !== 'string') throw new ApiError('支付响应无效')
  return {
    payNo,
    status,
    orderId,
    amountFen: record.amountFen,
    orderStatus,
    succeededAt,
  }
}

/** 订单支付带回订单号。联合创始人开通没有订单，orderId 为 null。 */
function readSandboxOrderId(value: unknown): string | null {
  if (value === null) return null
  const text = readString(value)
  if (!text) throw new ApiError('支付响应无效')
  return text
}
