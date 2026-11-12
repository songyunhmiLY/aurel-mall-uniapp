export const routes = {
  home: '/pages/home/index',
  shop: '/pages/shop/index',
  welfare: '/pages/welfare/index',
  founder: '/pages/founder/index',
  cart: '/pages/cart/index',
  mine: '/pages/mine/index',
  team: '/pages/team/index',
  invite: '/pages/invite/index',
  login: '/pages/auth/login',
  settings: '/pages/settings/index',
  paymentAccount: '/pages/settings/payment-account',
  addresses: '/pages/settings/addresses',
  addressEdit: '/pages/settings/address-edit',
  agreements: '/pages/settings/agreements',
  privacy: '/pages/settings/privacy',
  payPassword: '/pages/settings/pay-password',
  productList: '/pages/product/list',
  productDetail: '/pages/product/detail',
  orderList: '/pages/order/list',
  orderDetail: '/pages/order/detail',
  articleDetail: '/pages/article/detail',
} as const

const tabPaths: string[] = [routes.home, routes.shop, routes.cart, routes.mine]

export function withId(path: string, id: string): string {
  return `${path}?id=${encodeURIComponent(id)}`
}

export function openPage(url: string): void {
  const path = url.split('?')[0] ?? url
  if (tabPaths.includes(path)) {
    uni.switchTab({ url: path })
    return
  }
  uni.navigateTo({ url })
}
