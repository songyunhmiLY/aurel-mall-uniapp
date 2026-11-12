import { request } from './http'
import type { OrderBrief, OrderDetail } from '@/types/order'

export function fetchOrders() {
  return request<OrderBrief[]>({ path: '/orders', withAuth: true })
}

export function fetchOrder(id: string) {
  return request<OrderDetail>({ path: `/orders/${encodeURIComponent(id)}`, withAuth: true })
}
