/** 单个钱包。三个金额都是十进制字符串，单位是分。 */
export interface WalletAccount {
  balanceFen: string
  frozenFen: string
  availableFen: string
}

export interface WalletBalances {
  points: WalletAccount
  withdrawable: WalletAccount
  consumption: WalletAccount
}

export type WalletType = 'points' | 'withdrawable' | 'consumption'

export type LedgerDirection = 'credit' | 'debit'

export interface WalletLedgerEntry {
  id: string
  walletType: WalletType
  direction: LedgerDirection
  amountFen: string
  balanceAfterFen: string
  bizType: string
  bizId: string
  sourceCode: string | null
  occurredAt: string
}

export interface WalletLedgerPage {
  items: WalletLedgerEntry[]
  total: number
  page: number
  pageSize: number
}

/** 可提现账户按 displayName 合并后的一项。totalFen 是十进制字符串。 */
export interface WithdrawalCategory {
  displayName: string
  totalFen: string
  sourceCodes: string[]
}

export interface WithdrawalCategorySnapshot {
  balanceFen: string
  frozenFen: string
  availableFen: string
  categories: WithdrawalCategory[]
}

export interface TransferLookup {
  payeeId: string
  nickname: string
}

export interface TransferResult {
  id: string
  payeeId: string
  amountFen: string
  createdAt: string
}

export interface BankAccount {
  accountName: string
  bankName: string
  accountNo: string
  branchName: string
  updatedAt: string
}

export type WithdrawalStatus = 'pending' | 'rejected' | 'paid'

export interface WithdrawalSettlement {
  outcome: WithdrawalStatus
  amountFen: string
  feeFen: string | null
  payoutFen: string | null
  adminId: string
  settledAt: string
}

export interface WithdrawalView {
  id: string
  userId: string
  amountFen: string
  status: WithdrawalStatus
  accountName: string
  bankName: string
  accountNo: string
  branchName: string
  appliedAt: string
  settlement: WithdrawalSettlement | null
}

export interface WithdrawalPage {
  items: WithdrawalView[]
  total: number
  page: number
  pageSize: number
}

export function isWalletType(value: string): value is WalletType {
  return value === 'points' || value === 'withdrawable' || value === 'consumption'
}

export function isLedgerDirection(value: string): value is LedgerDirection {
  return value === 'credit' || value === 'debit'
}

export function isWithdrawalStatus(value: string): value is WithdrawalStatus {
  return value === 'pending' || value === 'rejected' || value === 'paid'
}
