import { ApiError, request } from './http'
import {
  asRecord,
  readIntFen,
  readNullableIntFen,
  readNullableText,
  readPageCount,
  readPositiveId,
  readRequiredText,
} from './record'
import type { RefundPage, RefundView } from '@/types/refund'
import { isRefundStatus, isWechatRefundStatus } from '@/types/refund'

const INVALID = '退款响应无效'

export function applyOrderRefund(orderId: string) {
  return request<unknown>({
    path: `/orders/${encodeURIComponent(orderId)}/refunds`,
    method: 'POST',
    withAuth: true,
  }).then(readRefund)
}

export function fetchRefunds(page = 1, pageSize = 20) {
  return request<unknown>({
    path: '/me/refunds',
    data: { page, pageSize },
    withAuth: true,
  }).then(readRefundPage)
}

export function fetchRefund(id: string) {
  return request<unknown>({
    path: `/me/refunds/${encodeURIComponent(id)}`,
    withAuth: true,
  }).then(readRefund)
}

function readRefundPage(data: unknown): RefundPage {
  const record = asRecord(data)
  if (!record || !Array.isArray(record.items)) throw new ApiError(INVALID)
  return {
    items: record.items.map(readRefund),
    total: readPageCount(record.total, INVALID),
    page: readPageCount(record.page, INVALID),
    pageSize: readPageCount(record.pageSize, INVALID),
  }
}

function readRefund(data: unknown): RefundView {
  const record = asRecord(data)
  if (!record) throw new ApiError(INVALID)
  const status = readRequiredText(record.status, INVALID)
  if (!isRefundStatus(status)) throw new ApiError(INVALID)
  const wechatRefundStatus = readWechatStatus(record.wechatRefundStatus)
  return {
    id: readPositiveId(record.id, INVALID),
    orderId: readPositiveId(record.orderId, INVALID),
    userId: readPositiveId(record.userId, INVALID),
    status,
    payAmountFen: readIntFen(record.payAmountFen, INVALID),
    freightFen: readIntFen(record.freightFen, INVALID),
    deductionHint: readRequiredText(record.deductionHint, INVALID),
    refundFen: readNullableIntFen(record.refundFen, INVALID),
    deductionFen: readNullableIntFen(record.deductionFen, INVALID),
    wechatRefundFen: readNullableIntFen(record.wechatRefundFen, INVALID),
    withdrawableDeductionFen: readNullableIntFen(record.withdrawableDeductionFen, INVALID),
    consumptionCreditFen: readNullableIntFen(record.consumptionCreditFen, INVALID),
    wechatRefundStatus,
    appliedAt: readRequiredText(record.appliedAt, INVALID),
    decidedAt: readNullableText(record.decidedAt, INVALID),
  }
}

function readWechatStatus(value: unknown): RefundView['wechatRefundStatus'] {
  if (value === null) return null
  if (typeof value !== 'string' || !isWechatRefundStatus(value)) throw new ApiError(INVALID)
  return value
}
