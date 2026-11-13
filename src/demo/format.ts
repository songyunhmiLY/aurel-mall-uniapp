export function money(value: number): string {
  const rounded = Math.round((Number(value) || 0) * 100) / 100
  return rounded.toFixed(2)
}

export function yuan(value: number): string {
  return `¥${money(value)}`
}

/** 把分格式化成元。订单金额是数字，钱包金额是十进制字符串。 */
export function formatFen(value: number | string | null | undefined): string {
  let text = ''
  if (typeof value === 'number' && Number.isFinite(value)) text = String(Math.trunc(value))
  if (typeof value === 'string') text = value.trim()
  if (!/^-?\d+$/.test(text)) return '0.00'
  const negative = text.startsWith('-')
  const digits = (negative ? text.slice(1) : text).replace(/^0+(?=\d)/, '')
  const padded = digits.padStart(3, '0')
  return `${negative ? '-' : ''}${padded.slice(0, -2)}.${padded.slice(-2)}`
}

export function yuanFen(value: number | string | null | undefined): string {
  return `¥${formatFen(value)}`
}

export function formatInstant(iso: string | null): string {
  if (!iso) return '—'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)
}

export function greetingName(name: string): string {
  const hour = Number(
    new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Shanghai',
      hour: '2-digit',
      hour12: false,
    }).format(new Date()),
  )
  const hello = hour < 12 ? '早上好' : hour < 18 ? '下午好' : '晚上好'
  const first = name.trim().split(/\s+/)[0] || '朋友'
  return `${hello}，${first}`
}

export function copyText(text: string): void {
  const done = () => uni.showToast({ title: '已复制', icon: 'none' })
  // #ifdef H5
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    navigator.clipboard
      .writeText(text)
      .then(done)
      .catch(() => {
        uni.setClipboardData({ data: text, success: done })
      })
    return
  }
  // #endif
  uni.setClipboardData({ data: text, success: done })
}
