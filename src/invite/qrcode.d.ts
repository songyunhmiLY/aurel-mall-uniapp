declare module 'qrcode' {
  export interface QRCodeModules {
    size: number
    get(x: number, y: number): number | boolean
  }

  export interface QRCode {
    modules: QRCodeModules
  }

  export function create(
    text: string,
    options?: { errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H' },
  ): QRCode
}
