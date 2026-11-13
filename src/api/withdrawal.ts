import { ApiError, request } from './http'
import {
  asRecord,
  readDecimalFen,
  readNullableDecimalFen,
  readPageCount,
  readPositiveId,
  readRequiredText,
} from './record'
import type { WithdrawalPage, WithdrawalSettlement, WithdrawalView } from '@/types/wallet'
import { isWithdrawalStatus } from '@/types/wallet'

const INVALID = '提现响应无效'

export function fetchWithdrawals(page = 1, pageSize = 20) {
  return request<unknown>({
    path: '/me/withdrawals',
    data: { page, pageSize },
    withAuth: true,
  }).then(readWithdrawalPage)
}

export function fetchWithdrawal(id: string) {
  return request<unknown>({
    path: `/me/withdrawals/${encodeURIComponent(id)}`,
    withAuth: true,
  }).then(readWithdrawal)
}

export function applyWithdrawal(amountFen: string) {
  return request<unknown>({
    path: '/me/withdrawals',
    method: 'POST',
    data: { amountFen },
    withAuth: true,
  }).then(readWithdrawal)
}

function readWithdrawalPage(data: unknown): WithdrawalPage {
  const record = asRecord(data)
  if (!record || !Array.isArray(record.items)) throw new ApiError(INVALID)
  return {
    items: record.items.map(readWithdrawal),
    total: readPageCount(record.total, INVALID),
    page: readPageCount(record.page, INVALID),
    pageSize: readPageCount(record.pageSize, INVALID),
  }
}

function readWithdrawal(data: unknown): WithdrawalView {
  const record = asRecord(data)
  if (!record) throw new ApiError(INVALID)
  const status = readRequiredText(record.status, INVALID)
  if (!isWithdrawalStatus(status)) throw new ApiError(INVALID)
  return {
    id: readPositiveId(record.id, INVALID),
    userId: readPositiveId(record.userId, INVALID),
    amountFen: readDecimalFen(record.amountFen, INVALID),
    status,
    accountName: readRequiredText(record.accountName, INVALID),
    bankName: readRequiredText(record.bankName, INVALID),
    accountNo: readRequiredText(record.accountNo, INVALID),
    branchName: readRequiredText(record.branchName, INVALID),
    appliedAt: readRequiredText(record.appliedAt, INVALID),
    settlement: readSettlement(record.settlement),
  }
}

function readSettlement(value: unknown): WithdrawalSettlement | null {
  if (value === null) return null
  const record = asRecord(value)
  if (!record) throw new ApiError(INVALID)
  const outcome = readRequiredText(record.outcome, INVALID)
  if (!isWithdrawalStatus(outcome)) throw new ApiError(INVALID)
  return {
    outcome,
    amountFen: readDecimalFen(record.amountFen, INVALID),
    feeFen: readNullableDecimalFen(record.feeFen, INVALID),
    payoutFen: readNullableDecimalFen(record.payoutFen, INVALID),
    adminId: readPositiveId(record.adminId, INVALID),
    settledAt: readRequiredText(record.settledAt, INVALID),
  }
}
