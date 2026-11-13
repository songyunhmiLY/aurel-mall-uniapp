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

/**
 * 把用户输入的元转成正整数分。最多两位小数。
 * 0、空串和超过 18 位有效数字都不是合法金额。
 */
export function yuanInputToFen(raw: string): string | null {
  const text = raw.trim()
  if (!/^\d+(\.\d{1,2})?$/.test(text)) return null
  const [wholeRaw, frac = ''] = text.split('.')
  const digits = `${wholeRaw ?? '0'}${frac.padEnd(2, '0')}`.replace(/^0+(?=\d)/, '')
  if (!/^[1-9]\d{0,18}$/.test(digits)) return null
  return digits
}

/** 比较两个十进制整数字符串。用于分，不经过浮点。 */
export function compareDecimal(left: string, right: string): number {
  const a = normalizeDecimal(left)
  const b = normalizeDecimal(right)
  const aNeg = a.startsWith('-')
  const bNeg = b.startsWith('-')
  if (aNeg !== bNeg) return aNeg ? -1 : 1
  const as = aNeg ? a.slice(1) : a
  const bs = bNeg ? b.slice(1) : b
  if (as.length !== bs.length) {
    const cmp = as.length > bs.length ? 1 : -1
    return aNeg ? -cmp : cmp
  }
  if (as === bs) return 0
  const cmp = as > bs ? 1 : -1
  return aNeg ? -cmp : cmp
}

function normalizeDecimal(value: string): string {
  const text = value.trim()
  if (!/^-?\d+$/.test(text)) return '0'
  const negative = text.startsWith('-')
  const digits = (negative ? text.slice(1) : text).replace(/^0+(?=\d)/, '') || '0'
  if (digits === '0') return '0'
  return `${negative ? '-' : ''}${digits}`
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
