import type { OrderStatus, OrderZone } from '@/types/order'

export function zoneLabel(zone: OrderZone): string {
  return zone === 'startup' ? '创业专区' : '会员商城'
}

export function statusLabel(status: OrderStatus): string {
  switch (status) {
    case 'pending_payment':
      return '待付款'
    case 'paid':
      return '已支付'
    case 'shipped':
      return '已发货'
    case 'closed':
      return '已关闭'
  }
}

export function payRule(zone: OrderZone): string {
  if (zone === 'startup') {
    return '支付顺序固定为积分、可提现、微信。账户只支付锁定单价的整数倍，零头留在账户里。消费账户不参与。不能跳过或调整顺序。'
  }
  return '支付顺序固定为消费、可提现、微信。消费账户可以支付任意余数。积分不参与。不能跳过或调整顺序。'
}

export function isOrderStatus(value: string): value is OrderStatus {
  return (
    value === 'pending_payment' || value === 'paid' || value === 'shipped' || value === 'closed'
  )
}

export function isOrderZone(value: string): value is OrderZone {
  return value === 'startup' || value === 'mall'
}
