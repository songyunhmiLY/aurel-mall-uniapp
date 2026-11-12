export interface OrderBrief {
  id: string
  title: string
  statusText: string
  amountText: string
}

export interface OrderDetail extends OrderBrief {
  summary: string
}
