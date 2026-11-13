import { yuanFen } from '@/demo/format'
import type { LedgerDirection, WalletType, WithdrawalStatus } from '@/types/wallet'

const BIZ_LABELS: Record<string, string> = {
  order_payment: '订单支付',
  consumption_transfer: '消费划转',
  withdrawal_payout: '提现打款',
  mall_refund: '商城退款',
}

export function walletTypeLabel(type: WalletType): string {
  if (type === 'points') return '积分账户'
  if (type === 'withdrawable') return '可提现账户'
  return '消费账户'
}

export function ledgerTitle(type: WalletType): string {
  if (type === 'points') return '积分流水'
  if (type === 'withdrawable') return '可提现流水'
  return '消费流水'
}

export function ledgerBizLabel(bizType: string): string {
  return BIZ_LABELS[bizType] ?? '账户变动'
}

export function ledgerDirectionLabel(direction: LedgerDirection): string {
  return direction === 'credit' ? '收入' : '支出'
}

export function signedLedgerAmount(direction: LedgerDirection, amountFen: string): string {
  return `${direction === 'credit' ? '+' : '-'}${yuanFen(amountFen)}`
}

export function withdrawalStatusLabel(status: WithdrawalStatus): string {
  if (status === 'pending') return '审核中'
  if (status === 'rejected') return '已驳回'
  return '已打款'
}
