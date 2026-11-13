import { isInviteCode } from './code'

/** 注册页路径。邀请码只放在页面查询里，不进入登录 body。 */
export function inviteRegisterPath(code: string): string {
  return `/pages/auth/register?inviteCode=${code}`
}

/**
 * 二维码内容。
 * H5 是带 ?inviteCode= 的预览地址，扫码打开注册页。
 * 小程序是页面路径和查询；正式小程序码以后再打包，这里不新增后端接口。
 */
export function inviteQrText(code: string): string {
  if (!isInviteCode(code)) return ''
  const query = `inviteCode=${code}`
  const page = `/pages/auth/register?${query}`
  if (typeof location !== 'undefined' && location.origin) {
    return `${location.origin}${location.pathname}?${query}#${page}`
  }
  return `pages/auth/register?${query}`
}
