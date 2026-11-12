const TOKEN_KEY = 'aurel_access_token'

export function getToken(): string {
  const value = uni.getStorageSync(TOKEN_KEY)
  return typeof value === 'string' ? value : ''
}

export function setToken(token: string): void {
  if (!token) {
    uni.removeStorageSync(TOKEN_KEY)
    return
  }
  uni.setStorageSync(TOKEN_KEY, token)
}
