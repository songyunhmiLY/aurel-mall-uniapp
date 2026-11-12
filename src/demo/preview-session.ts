export type PreviewRole = 'member' | 'nonmember' | 'guest'

const ROLE_KEY = 'aurel_h5_preview_role'
const PAY_KEY = 'aurel_h5_preview_pay_password'
const CONSUME_KEY = 'aurel_h5_preview_consume'

export function readRole(): PreviewRole {
  const value = uni.getStorageSync(ROLE_KEY)
  if (value === 'guest' || value === 'nonmember' || value === 'member') return value
  return 'member'
}

export function writeRole(role: PreviewRole): void {
  uni.setStorageSync(ROLE_KEY, role)
}

export function readPayPassword(): string {
  const value = uni.getStorageSync(PAY_KEY)
  return typeof value === 'string' ? value : ''
}

export function writePayPassword(value: string): void {
  uni.setStorageSync(PAY_KEY, value)
}

export function readConsumeOverride(): number | null {
  const value = uni.getStorageSync(CONSUME_KEY)
  if (value === '' || value == null) return null
  const num = Number(value)
  return Number.isFinite(num) ? num : null
}

export function writeConsumeOverride(value: number | null): void {
  if (value == null) {
    uni.removeStorageSync(CONSUME_KEY)
    return
  }
  uni.setStorageSync(CONSUME_KEY, String(value))
}
