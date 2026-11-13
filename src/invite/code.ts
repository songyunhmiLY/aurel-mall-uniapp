const PENDING_KEY = 'aurel_pending_invite_code'
const BOUND_PREFIX = 'aurel_inviter_bound_'

export function isInviteCode(value: string): boolean {
  return /^\d{6}$/.test(value)
}

export function normalizeInviteCode(value: unknown): string {
  if (typeof value !== 'string') return ''
  const text = value.trim()
  return isInviteCode(text) ? text : ''
}

/** 只认完整的 6 位码，或查询串里的 inviteCode。不从其它数字里截取。 */
export function inviteCodeFromText(value: string): string {
  const text = safeDecode(value.trim())
  const exact = normalizeInviteCode(text)
  if (exact) return exact
  const queryIndex = text.indexOf('?')
  const query = (queryIndex >= 0 ? text.slice(queryIndex + 1) : text).split('#')[0] ?? ''
  if (!query.includes('=')) return ''
  const named = new URLSearchParams(query).get('inviteCode')
  return normalizeInviteCode(named)
}

export function inviteCodeFromSource(source: unknown): string {
  if (typeof source === 'string') return inviteCodeFromText(source)
  if (typeof source !== 'object' || source === null) return ''
  const record = source as Record<string, unknown>
  const named = inviteCodeFromSource(record.inviteCode)
  if (named) return named
  if (typeof record.scene === 'string') {
    const scene = inviteCodeFromText(record.scene)
    if (scene) return scene
  }
  if (record.query && record.query !== source) {
    const nested = inviteCodeFromSource(record.query)
    if (nested) return nested
  }
  return ''
}

export function rememberInviteCode(code: string): void {
  if (!isInviteCode(code)) return
  uni.setStorageSync(PENDING_KEY, code)
}

export function readPendingInviteCode(): string {
  const value = uni.getStorageSync(PENDING_KEY)
  return normalizeInviteCode(value)
}

export function captureInviteCode(source: unknown): string {
  const code = inviteCodeFromSource(source)
  if (code) rememberInviteCode(code)
  return code
}

/** H5 的 ?inviteCode=，以及小程序启动 query / scene。不写入登录请求。 */
export function captureLaunchInviteCode(): string {
  let code = ''
  // #ifdef H5
  if (typeof window !== 'undefined') {
    code = inviteCodeFromText(window.location.search) || inviteCodeFromText(window.location.hash)
  }
  // #endif
  // #ifdef MP-WEIXIN
  try {
    const options = uni.getLaunchOptionsSync()
    code = code || inviteCodeFromSource(options.query) || inviteCodeFromSource(options)
  } catch {
    code = code || ''
  }
  // #endif
  if (code) rememberInviteCode(code)
  return code
}

export function markInviterBound(userId: string): void {
  if (!userId) return
  uni.setStorageSync(`${BOUND_PREFIX}${userId}`, '1')
}

export function hasInviterBound(userId: string): boolean {
  if (!userId) return false
  return uni.getStorageSync(`${BOUND_PREFIX}${userId}`) === '1'
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}
