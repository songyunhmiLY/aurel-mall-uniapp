/**
 * 微信小程序能力占位。
 * 登录、手机号、支付的产品规则都未确定，这里只保留调用位置。
 */

interface WxLoginApi {
  login(options: {
    success?: (res: { code?: string }) => void
    fail?: (err: unknown) => void
  }): void
  requestPayment(options: { success?: () => void; fail?: (err: unknown) => void }): void
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
    // 只取 code。账号如何创建、是否绑定手机号，都不在这里决定。
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

export function handlePhoneNumberEvent(event: PhoneAuthEvent): void {
  // #ifdef MP-WEIXIN
  // 手机号授权结果只作占位，不上传、不绑定账号。
  void event.detail?.errMsg
  // #endif
  // #ifndef MP-WEIXIN
  void event
  // #endif
}

export function requestWechatPayPlaceholder(): Promise<void> {
  return new Promise((resolve, reject) => {
    // #ifdef MP-WEIXIN
    // 支付参数未定。保留 wx.requestPayment 的调起位置，不填写业务单号或签名。
    wx.requestPayment({
      success: () => resolve(),
      fail: () => reject(new Error('微信支付未完成')),
    })
    // #endif
    // #ifndef MP-WEIXIN
    reject(new Error('微信支付仅能在微信小程序内调起'))
    // #endif
  })
}
