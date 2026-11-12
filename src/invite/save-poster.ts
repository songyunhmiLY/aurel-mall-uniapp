function drawPattern(ctx: CanvasRenderingContext2D, code: string, x: number, y: number, size: number) {
  const cells = 21
  const cell = size / cells
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(x, y, size, size)
  ctx.fillStyle = '#161A1F'
  let hash = 2166136261
  const seed = code || 'AUREL'
  for (let row = 0; row < cells; row += 1) {
    for (let col = 0; col < cells; col += 1) {
      hash ^= seed.charCodeAt((row * cells + col) % seed.length)
      hash = Math.imul(hash, 16777619)
      const finder =
        (col < 7 && row < 7) || (col > cells - 8 && row < 7) || (col < 7 && row > cells - 8)
      const edge = col === 0 || row === 0 || col === 6 || row === 6 || (col >= 2 && col <= 4 && row >= 2 && row <= 4)
      if ((finder && edge) || (!finder && (hash & 3) !== 0)) {
        ctx.fillRect(x + col * cell, y + row * cell, cell, cell)
      }
    }
  }
}

export function saveInvitePoster(name: string, code: string): void {
  if (typeof document === 'undefined') {
    uni.showToast({ title: '请在浏览器中保存', icon: 'none' })
    return
  }
  const canvas = document.createElement('canvas')
  const width = 750
  const height = 1100
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    uni.showToast({ title: '演示环境已保存示意', icon: 'none' })
    return
  }
  ctx.fillStyle = '#121820'
  ctx.fillRect(0, 0, width, height)
  ctx.strokeStyle = 'rgba(94,143,138,0.28)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(640, 80, 180, 0, Math.PI * 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(640, 80, 110, 0, Math.PI * 2)
  ctx.stroke()
  ctx.fillStyle = '#5E8F8A'
  ctx.font = '500 22px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('AUREL', width / 2, 120)
  ctx.fillStyle = '#F3F6F7'
  ctx.font = '600 64px sans-serif'
  ctx.fillText('奥瑞尔', width / 2, 210)
  ctx.fillStyle = '#B7AFA4'
  ctx.font = '400 26px sans-serif'
  ctx.fillText('邀请好友，关注健康科技', width / 2, 270)
  ctx.strokeStyle = '#5E8F8A'
  const cx = width / 2
  const cy = 460
  ctx.beginPath()
  for (let i = 0; i < 6; i += 1) {
    const angle = -Math.PI / 2 + (i * Math.PI) / 3
    const px = cx + Math.cos(angle) * 110
    const py = cy + Math.sin(angle) * 110
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.closePath()
  ctx.stroke()
  ctx.fillStyle = '#5E8F8A'
  ctx.beginPath()
  for (let i = 0; i < 6; i += 1) {
    const angle = -Math.PI / 2 + (i * Math.PI) / 3
    const px = cx + Math.cos(angle) * 70
    const py = cy + Math.sin(angle) * 70
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.closePath()
  ctx.fill()
  drawPattern(ctx, code, 70, 700, 200)
  ctx.textAlign = 'left'
  ctx.fillStyle = '#E8EEEF'
  ctx.font = '400 26px sans-serif'
  ctx.fillText(`我是 ${name || ''}`, 300, 760)
  ctx.fillStyle = '#8A9197'
  ctx.font = '400 22px sans-serif'
  ctx.fillText('长按识别或扫描二维码进入', 300, 804)
  ctx.fillStyle = '#5E8F8A'
  ctx.font = '500 20px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('我的邀请码', width / 2, 960)
  ctx.fillStyle = '#C5D9D6'
  ctx.font = '600 52px sans-serif'
  ctx.fillText(code, width / 2, 1030)
  canvas.toBlob((blob) => {
    if (!blob) {
      uni.showToast({ title: '演示环境已保存示意', icon: 'none' })
      return
    }
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'aurel-invite.png'
    document.body.appendChild(link)
    link.click()
    setTimeout(() => {
      URL.revokeObjectURL(link.href)
      link.remove()
    }, 800)
    uni.showToast({ title: '已保存邀请海报（演示）', icon: 'none' })
  })
}
