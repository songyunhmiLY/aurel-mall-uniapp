import QRCode from 'qrcode'

export interface QrMatrix {
  size: number
  dark(x: number, y: number): boolean
}

export function qrMatrix(text: string): QrMatrix | null {
  if (!text) return null
  const qr = QRCode.create(text, { errorCorrectionLevel: 'M' })
  return {
    size: qr.modules.size,
    dark(x: number, y: number) {
      return Boolean(qr.modules.get(x, y))
    },
  }
}
