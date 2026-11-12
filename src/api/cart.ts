import { request } from './http'
import type { CartLine } from '@/types/cart'

export function fetchCart() {
  return request<{ items?: CartLine[] }>({ path: '/cart', withAuth: true })
}
