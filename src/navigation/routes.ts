export const routes = {
  home: '/pages/home/index',
  mall: '/pages/mall/index',
  wallet: '/pages/wallet/index',
  transfer: '/pages/wallet/transfer',
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
  orderList: '/pages/order/list',
  orderDetail: '/pages/order/detail',
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

export function openBanner(href?: string): void {
  if (href === 'startup') {
    openPage(routes.shop)
    return
  }
  if (href === 'mall') {
    openPage(routes.mall)
    return
  }
  if (href === 'founder') {
    openPage(routes.founder)
    return
  }
  if (href?.startsWith('article:')) {
    openPage(withId(routes.articleDetail, href.slice('article:'.length)))
    return
  }
  openPage(routes.home)
}
