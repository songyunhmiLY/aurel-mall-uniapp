export function money(value: number): string {
  const rounded = Math.round((Number(value) || 0) * 100) / 100
  return rounded.toFixed(2)
}

export function yuan(value: number): string {
  return `¥${money(value)}`
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
    navigator.clipboard.writeText(text).then(done).catch(() => {
      uni.setClipboardData({ data: text, success: done })
    })
    return
  }
  // #endif
  uni.setClipboardData({ data: text, success: done })
}
