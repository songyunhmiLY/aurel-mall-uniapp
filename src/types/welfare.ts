/** 首页入口。文案和图片由管理端配置，可以为空。 */
export interface WelfareEntry {
  copy: string
  imageUrl: string | null
}

/**
 * 会员能看到的福利专场状态。
 * 只有资格和当天是否已报名，不包含轮次、上限或金额。
 */
export interface WelfareStatus {
  eligible: boolean
  signedUpToday: boolean
}
