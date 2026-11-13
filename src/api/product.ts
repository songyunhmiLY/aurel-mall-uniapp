import { ApiError, request } from './http'
import { asRecord, readNumber, readString } from './record'
import type { ProductView, ProductZone } from '@/types/product'

const PAGE_SIZE = 100

/**
 * GET /catalog/products?zone=startup|mall
 * GET /catalog/products/:id
 * 列表 data 是 { items, total, page, pageSize }。金额字段是分。
 */
export function fetchProducts(zone: ProductZone): Promise<ProductView[]> {
  return collectProducts(zone)
}

export function fetchProduct(id: string, zone: ProductZone) {
  return request<unknown>({
    path: `/catalog/products/${encodeURIComponent(id)}`,
    withAuth: true,
  }).then((data) => {
    const product = readProduct(data, zone)
    if (!product) throw new ApiError('商品不存在', 404)
    return product
  })
}

export function fenToYuan(fen: number): number {
  return fen / 100
}

async function collectProducts(zone: ProductZone): Promise<ProductView[]> {
  const products: ProductView[] = []
  let page = 1
  let total = 0
  do {
    const data = await request<unknown>({
      path: '/catalog/products',
      data: { zone, page, pageSize: PAGE_SIZE },
      withAuth: true,
    })
    const parsed = readProductPage(data, zone)
    products.push(...parsed.items)
    total = parsed.total
    page += 1
  } while (products.length < total && page <= 20)
  return products
}

export function readProductPage(
  data: unknown,
  zone: ProductZone,
): { items: ProductView[]; total: number; page: number; pageSize: number } {
  const record = asRecord(data)
  if (!record || !Array.isArray(record.items)) throw new ApiError('商品响应无效')
  const items = record.items
    .map((item) => readProduct(item, zone))
    .filter((item): item is ProductView => item !== null)
  return {
    items,
    total: readNumber(record.total) ?? items.length,
    page: readNumber(record.page) ?? 1,
    pageSize: readNumber(record.pageSize) ?? PAGE_SIZE,
  }
}

export function readProduct(data: unknown, fallbackZone: ProductZone): ProductView | null {
  const record = asRecord(data)
  if (!record) return null
  const id = readString(record.id)
  const name = readString(record.name)
  const priceFen = readNumber(record.priceFen)
  if (!id || !name || priceFen == null) return null
  const zone = readZone(record.zone, fallbackZone)
  const category = asRecord(record.category)
  const pvFen = zone === 'mall' ? readNumber(record.pvFen) : null
  return {
    id,
    zone,
    name,
    subtitle: readString(record.subtitle),
    body: readString(record.body),
    coverUrl: readString(record.coverUrl),
    freightFen: readNumber(record.freightFen) ?? 0,
    priceFen,
    stockQuantity: readNumber(record.stockQuantity) ?? 0,
    categoryName: category ? readString(category.name) : '',
    pvFen,
  }
}

function readZone(value: unknown, fallback: ProductZone): ProductZone {
  const text = readString(value)
  if (text === 'startup' || text === 'mall') return text
  return fallback
}
