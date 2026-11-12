export interface ProductBrief {
  id: string
  name: string
  priceText: string
}

export interface ProductDetail extends ProductBrief {
  summary: string
}
