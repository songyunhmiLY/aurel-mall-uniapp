export interface MarketBrief {
  id: string
  name: string
  monthAmount: string
  weekAmount: string
  dayAmount: string
}

export interface TeamOverview {
  marketCount: number
  monthPerformance: string
  markets: MarketBrief[]
}
