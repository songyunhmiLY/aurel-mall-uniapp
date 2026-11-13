export type ProductZone = 'startup' | 'mall'

export interface ProductView {
  id: string
  zone: ProductZone
  name: string
  subtitle: string
  coverUrl: string
  category: string
  /** 元。接口金额以分返回时已换算。 */
  price: number
  /** 会员商城单独展示的 PV。创业专区为 null。 */
  pv: number | null
}

export interface ProductListResult {
  products: ProductView[]
  /** 列表只有一个单价，或接口给了系统单价时才有值。 */
  unitPrice: number | null
}
