/**
 * 仅微信小程序可用的能力。
 * 登录使用 wx.login 的 code。手机号按钮只取出授权 code，不在这里决定账号。
 * 支付使用订单支付接口返回的 JSAPI 字段。这里不实现微信网页授权。
 * 订阅消息只把模板 ID 交给微信的授权弹层，不在这里决定业务是否成功。
 */

interface WxLoginApi {
  login(options: {
    success?: (res: { code?: string }) => void
    fail?: (err: unknown) => void
  }): void
  requestPayment(options: {
    timeStamp: string
    nonceStr: string
    package: string
    signType: 'RSA'
    paySign: string
    success?: () => void
    fail?: (err: unknown) => void
  }): void
  requestSubscribeMessage(options: {
    tmplIds: string[]
    success?: (res: unknown) => void
    fail?: (err: unknown) => void
    complete?: () => void
  }): void
}

export interface WechatPayRequest {
  timeStamp: string
  nonceStr: string
  prepayPackage: string
  signType: 'RSA'
  paySign: string
}

declare const wx: WxLoginApi

export interface PhoneAuthEvent {
  detail?: {
    code?: string
    errMsg?: string
  }
}

function detectMpWeixin(): boolean {
  // #ifdef MP-WEIXIN
  return true
  // #endif
  // #ifndef MP-WEIXIN
  return false
  // #endif
}

export const isMpWeixin = detectMpWeixin()

export function requestWechatLoginCode(): Promise<string> {
  return new Promise((resolve, reject) => {
    // #ifdef MP-WEIXIN
    wx.login({
      success(res) {
        if (res.code) {
          resolve(res.code)
          return
        }
        reject(new Error('未取得登录 code'))
      },
      fail: reject,
    })
    // #endif
    // #ifndef MP-WEIXIN
    reject(new Error('微信登录仅能在微信小程序内使用'))
    // #endif
  })
}

export function readPhoneAuthCode(event: PhoneAuthEvent): string {
  const code = event.detail?.code
  return typeof code === 'string' ? code.trim() : ''
}

/**
 * `onSuccess` 在微信支付成功回调里同步执行。
 * 微信在这个回调里允许弹出订阅授权。
 */
export function requestWechatPayment(
  params: WechatPayRequest,
  onSuccess?: () => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    // #ifdef MP-WEIXIN
    wx.requestPayment({
      timeStamp: params.timeStamp,
      nonceStr: params.nonceStr,
      package: params.prepayPackage,
      signType: params.signType,
      paySign: params.paySign,
      success: () => {
        try {
          onSuccess?.()
        } catch {
          // 订阅授权失败不影响已经成功的支付。
        }
        resolve()
      },
      fail: () => reject(new Error('微信支付未完成')),
    })
    // #endif
    // #ifndef MP-WEIXIN
    reject(new Error('微信支付仅能在微信小程序内调起'))
    // #endif
  })
}

/** 调一次 wx.requestSubscribeMessage。拒绝、失败或当前不是小程序都视为结束。 */
export function invokeSubscribeMessage(tmplIds: readonly string[]): Promise<void> {
  if (!isMpWeixin || tmplIds.length === 0) return Promise.resolve()
  const ids = tmplIds.slice(0, 3)
  return new Promise((resolve) => {
    let settled = false
    const finish = () => {
      if (settled) return
      settled = true
      resolve()
    }
    // #ifdef MP-WEIXIN
    try {
      wx.requestSubscribeMessage({
        tmplIds: [...ids],
        fail: finish,
        complete: finish,
      })
    } catch {
      finish()
    }
    // #endif
    // #ifndef MP-WEIXIN
    finish()
    // #endif
  })
}
