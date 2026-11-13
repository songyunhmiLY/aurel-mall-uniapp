/** GET /me/team 的一个市场。业绩是十进制字符串，单位分。 */
export interface TeamMarket {
  name: string
  monthPerformanceFen: string
  recent7DaysPerformanceFen: string
  todayPerformanceFen: string
}

/**
 * GET /me/team 的 data。
 * marketCount 是 JSON 数字。金额字段经 bigint 序列化后是十进制字符串。
 */
export interface TeamOverview {
  marketCount: number
  totalPerformanceFen: string
  markets: TeamMarket[]
}
