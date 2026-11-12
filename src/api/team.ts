import { request } from './http'
import type { MarketBrief, TeamOverview } from '@/types/team'

const emptyOverview: TeamOverview = {
  marketCount: 0,
  monthPerformance: '0.00',
  markets: [],
}

function asMarket(value: Partial<MarketBrief> | undefined, index: number): MarketBrief | null {
  if (!value || typeof value.name !== 'string') return null
  return {
    id: value.id || String(index),
    name: value.name,
    monthAmount: value.monthAmount || '--',
    weekAmount: value.weekAmount || '--',
    dayAmount: value.dayAmount || '--',
  }
}

export async function loadTeamOverview(): Promise<TeamOverview> {
  const data = await request<Partial<TeamOverview>>({
    path: '/team/overview',
    withAuth: true,
  })
  const markets = Array.isArray(data.markets)
    ? data.markets
        .slice(0, 3)
        .map((item, index) => asMarket(item, index))
        .filter((item): item is MarketBrief => item !== null)
    : emptyOverview.markets

  return {
    marketCount: typeof data.marketCount === 'number' ? data.marketCount : markets.length,
    monthPerformance: data.monthPerformance || emptyOverview.monthPerformance,
    markets,
  }
}
