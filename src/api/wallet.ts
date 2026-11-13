import { ApiError, request } from './http'
import { asRecord } from './record'
import type { WalletAccount, WalletBalances } from '@/types/wallet'

const zeroAccount: WalletAccount = {
  balanceFen: '0',
  frozenFen: '0',
  availableFen: '0',
}

/** GET /me/wallets。三个账户的金额都是十进制字符串。 */
export function fetchWallets() {
  return request<unknown>({ path: '/me/wallets', withAuth: true }).then(readWallets)
}

export function readWallets(data: unknown): WalletBalances {
  const record = asRecord(data)
  if (!record) throw new ApiError('钱包响应无效')
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
  if (!record) throw new ApiError('钱包响应无效')
  return {
    balanceFen: readFenString(record.balanceFen),
    frozenFen: readFenString(record.frozenFen),
    availableFen: readFenString(record.availableFen),
  }
}

function readFenString(value: unknown): string {
  if (typeof value !== 'string' || !/^-?\d+$/.test(value.trim())) {
    throw new ApiError('钱包响应无效')
  }
  return value.trim()
}
