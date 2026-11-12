export interface PreviewProfile {
  name: string
  phone: string
  memberId: string
  inviteCode: string
  isMember: boolean
  points: number
  withdraw: number
  consume: number
}

export const memberProfile: PreviewProfile = {
  name: 'Martin Keller',
  phone: '176****8841',
  memberId: 'M100086',
  inviteCode: 'AR8K2Q',
  isMember: true,
  points: 2300,
  withdraw: 2900,
  consume: 468.5,
}

export const nonMemberProfile: PreviewProfile = {
  name: 'Anna Berg',
  phone: '138****2610',
  memberId: '',
  inviteCode: '',
  isMember: false,
  points: 0,
  withdraw: 80,
  consume: 0,
}

export const guestProfile: PreviewProfile = {
  name: '',
  phone: '',
  memberId: '',
  inviteCode: '',
  isMember: false,
  points: 0,
  withdraw: 0,
  consume: 0,
}

/** 演示收款人，用于走通消费转账确认层。 */
export const transferPeer = {
  memberId: 'M100102',
  name: 'Lena Hartmann',
}
