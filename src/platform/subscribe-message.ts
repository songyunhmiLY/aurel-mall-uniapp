import {
  fetchSubscribeTemplates,
  templateIdsFor,
  type SubscribeEvent,
  type SubscribeTemplate,
} from '@/api/subscribe'
import { getToken } from '@/auth/session'
import type { OrderZone } from '@/types/order'
import { invokeSubscribeMessage, isMpWeixin } from '@/platform/mp-weixin'

/**
 * 小程序订阅消息授权。
 * 只在 mp-weixin 且已登录时读取模板并调用 wx.requestSubscribeMessage。
 * H5 和其他端直接返回，不请求接口。
 * 微信一次最多收 3 个模板 ID。列表为空、用户拒绝或调用失败都不抛出。
 */

const TEMPLATE_BATCH = 3

const WALLET_CREDIT_EVENTS = [
  'wallet_credit_withdrawable',
  'wallet_credit_points',
  'wallet_credit_consumption',
] as const satisfies readonly SubscribeEvent[]

let cache: SubscribeTemplate[] | null = null
let flight: Promise<SubscribeTemplate[] | null> | null = null

export function paymentSubscribeEvents(zone: OrderZone): SubscribeEvent[] {
  if (zone === 'startup') return ['lucky_return_credited', ...WALLET_CREDIT_EVENTS]
  return [...WALLET_CREDIT_EVENTS]
}

/** 进入相关页时预先取模板，好让点击回调里能同步调起微信授权。 */
export function prepareSubscribeTemplates(): void {
  if (!isMpWeixin || !getToken()) return
  void loadTemplates()
}

/**
 * 在当前点击或微信支付成功回调里请求这些事件的模板。
 * 已有列表时会同步调用 wx.requestSubscribeMessage，微信才会弹出授权。
 */
export function requestSubscribeFor(events: readonly SubscribeEvent[]): Promise<void> {
  if (!isMpWeixin || !getToken() || events.length === 0) return Promise.resolve()
  const ready = cache
  if (ready) {
    return ask(ready, events).finally(() => {
      void loadTemplates()
    })
  }
  return loadTemplates().then((list) => ask(list, events))
}

function ask(list: SubscribeTemplate[] | null, events: readonly SubscribeEvent[]): Promise<void> {
  if (!list?.length) return Promise.resolve()
  const ids = templateIdsFor(list, events)
  if (!ids.length) return Promise.resolve()
  return requestBatches(ids).catch(() => undefined)
}

function requestBatches(ids: readonly string[]): Promise<void> {
  const next = (offset: number): Promise<void> => {
    if (offset >= ids.length) return Promise.resolve()
    return invokeSubscribeMessage(ids.slice(offset, offset + TEMPLATE_BATCH)).then(() =>
      next(offset + TEMPLATE_BATCH),
    )
  }
  return next(0)
}

function loadTemplates(): Promise<SubscribeTemplate[] | null> {
  if (flight) return flight
  flight = fetchSubscribeTemplates()
    .then((list) => {
      cache = list
      return list
    })
    .catch(() => cache)
    .finally(() => {
      flight = null
    })
  return flight
}
