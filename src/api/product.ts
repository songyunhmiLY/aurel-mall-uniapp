import { request } from './http'
import type { ProductBrief, ProductDetail } from '@/types/product'

export function fetchProducts() {
  return request<ProductBrief[]>({ path: '/products' })
}

export function fetchProduct(id: string) {
  return request<ProductDetail>({ path: `/products/${encodeURIComponent(id)}` })
}
