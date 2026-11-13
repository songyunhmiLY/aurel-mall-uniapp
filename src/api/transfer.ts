import { ApiError, request } from './http'
import { asRecord, readDecimalFen, readPositiveId, readRequiredText } from './record'
import type { TransferLookup, TransferResult } from '@/types/wallet'

const INVALID = '划转响应无效'

export function lookupTransfer(payeeId: string) {
  return request<unknown>({
    path: '/me/transfers/lookup',
    method: 'POST',
    data: { payeeId },
    withAuth: true,
  }).then(readLookup)
}

export function createTransfer(body: {
  payeeId: string
  amountFen: string
  paymentPassword: string
}) {
  return request<unknown>({
    path: '/me/transfers',
    method: 'POST',
    data: {
      payeeId: body.payeeId,
      amountFen: body.amountFen,
      paymentPassword: body.paymentPassword,
    },
    withAuth: true,
  }).then(readTransfer)
}

function readLookup(data: unknown): TransferLookup {
  const record = asRecord(data)
  if (!record || typeof record.nickname !== 'string') throw new ApiError(INVALID)
  return {
    payeeId: readPositiveId(record.payeeId, INVALID),
    nickname: record.nickname.trim(),
  }
}

function readTransfer(data: unknown): TransferResult {
  const record = asRecord(data)
  if (!record) throw new ApiError(INVALID)
  return {
    id: readPositiveId(record.id, INVALID),
    payeeId: readPositiveId(record.payeeId, INVALID),
    amountFen: readDecimalFen(record.amountFen, INVALID),
    createdAt: readRequiredText(record.createdAt, INVALID),
  }
}
