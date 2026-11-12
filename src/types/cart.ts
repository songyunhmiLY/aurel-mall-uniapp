export interface CartLine {
  id: string
  name: string
  quantity: number
  priceText: string
  price?: number
  pv?: number
  tone?: string
  checked?: boolean
}
