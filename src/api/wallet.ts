import { ApiError, request } from './http'
import {
  asRecord,
  readDecimalFen,
  readNullableText,
  readPageCount,
  readPositiveId,
  readRequiredText,
} from './record'
import type {
  LedgerDirection,
  WalletAccount,
  WalletBalances,
  WalletLedgerEntry,
  WalletLedgerPage,
  WalletType,
  WithdrawalCategory,
  WithdrawalCategorySnapshot,
} from '@/types/wallet'
import { isLedgerDirection, isWalletType } from '@/types/wallet'

const zeroAccount: WalletAccount = {
  balanceFen: '0',
  frozenFen: '0',
  availableFen: '0',
}

const INVALID = '钱包响应无效'
const LEDGER_INVALID = '流水响应无效'

/** GET /me/wallets。三个账户的金额都是十进制字符串。 */
export function fetchWallets() {
  return request<unknown>({ path: '/me/wallets', withAuth: true }).then(readWallets)
}

export function fetchWalletLedger(walletType: WalletType, page = 1, pageSize = 20) {
  return request<unknown>({
    path: `/me/wallets/${walletType}/ledger`,
    data: { page, pageSize },
    withAuth: true,
  }).then(readLedgerPage)
}

/** GET /me/wallets/withdrawable/categories。分类按接口返回的 displayName 分组。 */
export function fetchWithdrawableCategories() {
  return request<unknown>({
    path: '/me/wallets/withdrawable/categories',
    withAuth: true,
  }).then(readCategories)
}

export function fetchCategoryLedger(displayName: string, page = 1, pageSize = 20) {
  return request<unknown>({
    path: '/me/wallets/withdrawable/categories/ledger',
    data: { displayName, page, pageSize },
    withAuth: true,
  }).then(readLedgerPage)
}

export function readWallets(data: unknown): WalletBalances {
  const record = asRecord(data)
  if (!record) throw new ApiError(INVALID)
  return {
    points: readAccount(record.points),
    withdrawable: readAccount(record.withdrawable),
    consumption: readAccount(record.consumption),
  }
}

export function walletAccount(
  balances: WalletBalances | null,
  key: keyof WalletBalances,
): WalletAccount {
  return balances?.[key] ?? zeroAccount
}

function readAccount(value: unknown): WalletAccount {
  const record = asRecord(value)
  if (!record) throw new ApiError(INVALID)
  return {
    balanceFen: readDecimalFen(record.balanceFen, INVALID),
    frozenFen: readDecimalFen(record.frozenFen, INVALID),
    availableFen: readDecimalFen(record.availableFen, INVALID),
  }
}

function readCategories(data: unknown): WithdrawalCategorySnapshot {
  const record = asRecord(data)
  if (!record || !Array.isArray(record.categories)) throw new ApiError(INVALID)
  return {
    balanceFen: readDecimalFen(record.balanceFen, INVALID),
    frozenFen: readDecimalFen(record.frozenFen, INVALID),
    availableFen: readDecimalFen(record.availableFen, INVALID),
    categories: record.categories.map(readCategory),
  }
}

function readCategory(value: unknown): WithdrawalCategory {
  const record = asRecord(value)
  if (!record || !Array.isArray(record.sourceCodes)) throw new ApiError(INVALID)
  const sourceCodes = record.sourceCodes.map((item) => readRequiredText(item, INVALID))
  return {
    displayName: readRequiredText(record.displayName, INVALID),
    totalFen: readDecimalFen(record.totalFen, INVALID),
    sourceCodes,
  }
}

function readLedgerPage(data: unknown): WalletLedgerPage {
  const record = asRecord(data)
  if (!record || !Array.isArray(record.items)) throw new ApiError(LEDGER_INVALID)
  return {
    items: record.items.map(readLedgerEntry),
    total: readPageCount(record.total, LEDGER_INVALID),
    page: readPageCount(record.page, LEDGER_INVALID),
    pageSize: readPageCount(record.pageSize, LEDGER_INVALID),
  }
}

function readLedgerEntry(value: unknown): WalletLedgerEntry {
  const record = asRecord(value)
  if (!record) throw new ApiError(LEDGER_INVALID)
  const walletType = readRequiredText(record.walletType, LEDGER_INVALID)
  const direction = readRequiredText(record.direction, LEDGER_INVALID)
  if (!isWalletType(walletType) || !isLedgerDirection(direction)) {
    throw new ApiError(LEDGER_INVALID)
  }
  return {
    id: readPositiveId(record.id, LEDGER_INVALID),
    walletType,
    direction: direction as LedgerDirection,
    amountFen: readDecimalFen(record.amountFen, LEDGER_INVALID),
    balanceAfterFen: readDecimalFen(record.balanceAfterFen, LEDGER_INVALID),
    bizType: readRequiredText(record.bizType, LEDGER_INVALID),
    bizId: readRequiredText(record.bizId, LEDGER_INVALID),
    sourceCode: readNullableText(record.sourceCode, LEDGER_INVALID),
    occurredAt: readRequiredText(record.occurredAt, LEDGER_INVALID),
  }
}
