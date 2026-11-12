/**
 * H5 预览站点闸。用户名固定为 root，密码只与
 * VITE_DEMO_LOGIN_PASSWORD_SHA256 的十六进制摘要比对，源码里不放明文。
 * 未配置该变量时不拦截，方便本地对照演示页。
 */

const STORAGE_KEY = 'aurel-preview-gate'
export const PREVIEW_GATE_USERNAME = 'root'

export function previewGateHash(): string {
  const raw = import.meta.env.VITE_DEMO_LOGIN_PASSWORD_SHA256
  return typeof raw === 'string' ? raw.trim().toLowerCase() : ''
}

export function previewGateConfigured(): boolean {
  return /^[a-f0-9]{64}$/.test(previewGateHash())
}

export function isPreviewUnlocked(): boolean {
  if (!previewGateConfigured()) return true
  try {
    return sessionStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

export async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

function sameHash(left: string, right: string): boolean {
  if (left.length !== right.length) return false
  let diff = 0
  for (let index = 0; index < left.length; index += 1) {
    diff |= left.charCodeAt(index) ^ right.charCodeAt(index)
  }
  return diff === 0
}

export async function tryUnlockPreview(username: string, password: string): Promise<boolean> {
  const expected = previewGateHash()
  if (!/^[a-f0-9]{64}$/.test(expected)) return false
  if (username.trim() !== PREVIEW_GATE_USERNAME) return false
  const actual = await sha256Hex(password)
  if (!sameHash(actual, expected)) return false
  try {
    sessionStorage.setItem(STORAGE_KEY, '1')
  } catch {
    return false
  }
  return true
}
