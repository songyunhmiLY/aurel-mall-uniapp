import { ApiError, request } from './http'
import { asRecord, readDecimalFen, readPageCount, readRequiredText } from './record'
import type { TeamMarket, TeamOverview } from '@/types/team'

const INVALID = '创业团队响应无效'

/** GET /me/team。金额是十进制字符串，单位分。 */
export function fetchTeam() {
  return request<unknown>({ path: '/me/team', withAuth: true }).then(readTeam)
}

export function readTeam(data: unknown): TeamOverview {
  const record = asRecord(data)
  if (!record || !Array.isArray(record.markets)) throw new ApiError(INVALID)
  return {
    marketCount: readPageCount(record.marketCount, INVALID),
    totalPerformanceFen: readDecimalFen(record.totalPerformanceFen, INVALID),
    markets: record.markets.map(readMarket),
  }
}

function readMarket(value: unknown): TeamMarket {
  const record = asRecord(value)
  if (!record) throw new ApiError(INVALID)
  return {
    name: readRequiredText(record.name, INVALID),
    monthPerformanceFen: readDecimalFen(record.monthPerformanceFen, INVALID),
    recent7DaysPerformanceFen: readDecimalFen(record.recent7DaysPerformanceFen, INVALID),
    todayPerformanceFen: readDecimalFen(record.todayPerformanceFen, INVALID),
  }
}
