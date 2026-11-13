import { ApiError, request } from './http'
import { asRecord, readNumber, readString } from './record'
import type { ProductListResult, ProductView, ProductZone } from '@/types/product'

/**
 * GET /products?zone=startup|mall
 * GET /products/:id
 * 只展示接口返回的在售商品。价格用 priceFen（分）；没有 priceFen 时再读 priceYuan / price（元）。
 * 创业专区不读 PV。会员商城的 PV 与价格分列。
 */
export function fetchProducts(zone: ProductZone) {
  return request<unknown>({
    path: '/products',
    data: { zone },
    withAuth: true,
  }).then((data) => readProductList(data, zone))
}

export function fetchProduct(id: string, zone: ProductZone) {
  return request<unknown>({
    path: `/products/${encodeURIComponent(id)}`,
    withAuth: true,
  }).then((data) => {
    const product = readProduct(data, zone)
    if (!product) throw new ApiError('商品不存在', 404)
    return product
  })
}

export function readProductList(data: unknown, zone: ProductZone): ProductListResult {
  const record = asRecord(data)
  const raw = Array.isArray(data)
    ? data
    : Array.isArray(record?.items)
      ? record.items
      : Array.isArray(record?.list)
        ? record.list
        : Array.isArray(record?.products)
          ? record.products
          : []
  const unitPrice = record ? readUnitPrice(record) : null
  const products = raw
    .map((item) => readProduct(item, zone, unitPrice))
    .filter((item): item is ProductView => item !== null)
  return {
    products,
    unitPrice: unitPrice ?? sharedPrice(products),
  }
}

export function readProduct(
  data: unknown,
  fallbackZone: ProductZone,
  unitPrice: number | null = null,
): ProductView | null {
  const record = unwrapProduct(data)
  if (!record) return null
  const status = readString(record.status)
  if (status && status !== 'on') return null
  const id = readString(record.id)
  const name = readString(record.name)
  if (!id || !name) return null
  const zone = readZone(record.zone, fallbackZone)
  const price = readPriceYuan(record) ?? unitPrice
  if (price == null) return null
  return {
    id,
    zone,
    name,
    subtitle:
      readString(record.subtitle) || readString(record.summary) || readString(record.description),
    coverUrl:
      readString(record.coverUrl) || readString(record.imageUrl) || readString(record.cover),
    category:
      readString(record.category) || readString(record.categoryName) || readString(record.cat),
    price,
    pv: readPv(record, zone),
  }
}

function unwrapProduct(data: unknown): Record<string, unknown> | null {
  const record = asRecord(data)
  if (!record) return null
  if (record.id != null || record.name != null) return record
  return asRecord(record.product)
}

function readZone(value: unknown, fallback: ProductZone): ProductZone {
  const text = readString(value)
  if (text === 'startup' || text === 'mall') return text
  return fallback
}

function readUnitPrice(record: Record<string, unknown>): number | null {
  const fen = readNumber(record.unitPriceFen)
  if (fen != null) return fenToYuan(fen)
  return readNumber(record.unitPriceYuan) ?? readNumber(record.unitPrice)
}

function readPriceYuan(record: Record<string, unknown>): number | null {
  const fen =
    readNumber(record.priceFen) ?? readNumber(record.unitPriceFen) ?? readSkuPriceFen(record)
  if (fen != null) return fenToYuan(fen)
  return readNumber(record.priceYuan) ?? readNumber(record.price)
}

function readSkuPriceFen(record: Record<string, unknown>): number | null {
  const single = asRecord(record.sku)
  const fromSingle = single ? readNumber(single.priceFen) : null
  if (fromSingle != null) return fromSingle
  if (!Array.isArray(record.skus)) return null
  for (const item of record.skus) {
    const sku = asRecord(item)
    if (!sku) continue
    const status = readString(sku.status)
    if (status && status !== 'on') continue
    const fen = readNumber(sku.priceFen)
    if (fen != null) return fen
  }
  return null
}

function readPv(record: Record<string, unknown>, zone: ProductZone): number | null {
  if (zone !== 'mall') return null
  if (record.pv != null) return readNumber(record.pv)
  const fen = readNumber(record.pvFen)
  return fen == null ? null : fenToYuan(fen)
}

function sharedPrice(products: ProductView[]): number | null {
  const first = products[0]
  if (!first) return null
  return products.every((item) => item.price === first.price) ? first.price : null
}

function fenToYuan(fen: number): number {
  return Math.round(fen) / 100
}
