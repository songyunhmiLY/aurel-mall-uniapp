export const routes = {
  home: '/pages/home/index',
  mall: '/pages/mall/index',
  wallet: '/pages/wallet/index',
  ledger: '/pages/wallet/ledger',
  categories: '/pages/wallet/categories',
  transfer: '/pages/wallet/transfer',
  withdraw: '/pages/wallet/withdraw',
  withdrawals: '/pages/wallet/withdrawals',
  withdrawalDetail: '/pages/wallet/withdrawal',
  mine: '/pages/mine/index',
  shop: '/pages/shop/index',
  welfare: '/pages/welfare/index',
  founder: '/pages/founder/index',
  cart: '/pages/cart/index',
  team: '/pages/team/index',
  invite: '/pages/invite/index',
  login: '/pages/auth/login',
  register: '/pages/auth/register',
  settings: '/pages/settings/index',
  paymentAccount: '/pages/settings/payment-account',
  addresses: '/pages/settings/addresses',
  addressEdit: '/pages/settings/address-edit',
  realName: '/pages/settings/real-name',
  agreements: '/pages/settings/agreements',
  privacy: '/pages/settings/privacy',
  payPassword: '/pages/settings/pay-password',
  productList: '/pages/product/list',
  productDetail: '/pages/product/detail',
  checkout: '/pages/order/checkout',
  orderList: '/pages/order/list',
  orderDetail: '/pages/order/detail',
  refunds: '/pages/order/refunds',
  refundDetail: '/pages/order/refund',
  articleDetail: '/pages/article/detail',
  service: '/pages/service/index',
  notices: '/pages/notices/index',
  feedback: '/pages/feedback/index',
} as const

export type TabKey = 'home' | 'mall' | 'wallet' | 'mine'

const tabPaths: string[] = [routes.home, routes.mall, routes.wallet, routes.mine]

export function withId(path: string, id: string): string {
  return `${path}?id=${encodeURIComponent(id)}`
}

export function withQuery(path: string, query: Record<string, string>): string {
  const qs = Object.entries(query)
    .filter(([, value]) => value !== '')
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&')
  return qs ? `${path}?${qs}` : path
}

export function openPage(url: string): void {
  const path = url.split('?')[0] ?? url
  if (tabPaths.includes(path)) {
    uni.reLaunch({ url: path })
    return
  }
  uni.navigateTo({ url })
}

export function resetTo(url: string): void {
  uni.reLaunch({ url })
}

const knownPages = new Set<string>(Object.values(routes))

/**
 * 打开轮播图配置的小程序页面。
 * 只接受本小程序已注册的页面；http(s) 和其他协议不打开。
 */
export function openMiniProgramPage(pagePath: string): void {
  const url = resolveMiniProgramPage(pagePath)
  if (!url) return
  openPage(url)
}

function resolveMiniProgramPage(pagePath: string): string | null {
  const text = pagePath.trim()
  if (!text || /\s/.test(text) || text.includes('\\') || text.includes('..')) return null
  if (/^[a-z][a-z0-9+.-]*:/i.test(text) || text.startsWith('//')) return null
  const withSlash = text.startsWith('/') ? text : `/${text}`
  const queryIndex = withSlash.indexOf('?')
  const path = queryIndex === -1 ? withSlash : withSlash.slice(0, queryIndex)
  if (path.endsWith('/') || !knownPages.has(path)) return null
  return queryIndex === -1 ? path : withSlash
}
