export type ProductZone = 'startup' | 'mall'

/** 用户商品接口的字段。金额都是分；商城 PV 也按分，100 = 1 PV。 */
export interface ProductView {
  id: string
  zone: ProductZone
  name: string
  subtitle: string
  body: string
  coverUrl: string
  freightFen: number
  priceFen: number
  stockQuantity: number
  categoryName: string
  pvFen: number | null
}
