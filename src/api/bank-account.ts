import { ApiError, request } from './http'
import { asRecord, readRequiredText } from './record'
import type { BankAccount } from '@/types/wallet'

const INVALID = '收款账户响应无效'

export interface BankAccountInput {
  accountName: string
  bankName: string
  accountNo: string
  branchName: string
}

export function fetchBankAccount() {
  return request<unknown>({ path: '/me/bank-account', withAuth: true }).then((data) => {
    if (data === null) return null
    return readBankAccount(data)
  })
}

export function saveBankAccount(body: BankAccountInput) {
  return request<unknown>({
    path: '/me/bank-account',
    method: 'PUT',
    data: {
      accountName: body.accountName,
      bankName: body.bankName,
      accountNo: body.accountNo,
      branchName: body.branchName,
    },
    withAuth: true,
  }).then(readBankAccount)
}

function readBankAccount(data: unknown): BankAccount {
  const record = asRecord(data)
  if (!record) throw new ApiError(INVALID)
  return {
    accountName: readRequiredText(record.accountName, INVALID),
    bankName: readRequiredText(record.bankName, INVALID),
    accountNo: readRequiredText(record.accountNo, INVALID),
    branchName: readRequiredText(record.branchName, INVALID),
    updatedAt: readRequiredText(record.updatedAt, INVALID),
  }
}
