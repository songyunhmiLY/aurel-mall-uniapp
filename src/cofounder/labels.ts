/**
 * 按钮不可用时的说明。
 * 这些句子与开通接口拒绝时的文案一致：名额已满、金额未设、非会员、已开通，其余都是暂未开放。
 */
export function cofounderUnavailableHint(reason: string): string {
  if (reason === 'cap_full') return '联合创始人名额已满'
  if (reason === 'amount_unset') return '尚未设置开通金额'
  if (reason === 'not_member') return '非会员不能开通联合创始人'
  if (reason === 'already_enrolled') return '你已是联合创始人'
  return '成为联合创始人暂未开放'
}
