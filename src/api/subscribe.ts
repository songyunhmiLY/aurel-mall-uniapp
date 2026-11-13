import { ApiError, request } from './http'
import { asRecord, readString } from './record'

/**
 * GET /notifications/subscribe-templates。
 * 只列出当前可以交给 wx.requestSubscribeMessage 的模板。登录即可，不看是否会员。
 */
export const SUBSCRIBE_EVENTS = [
  'refund_result',
  'lucky_return_credited',
  'withdrawal_outcome',
  'wallet_credit_withdrawable',
  'wallet_credit_points',
  'wallet_credit_consumption',
] as const

export type SubscribeEvent = (typeof SUBSCRIBE_EVENTS)[number]

export interface SubscribeTemplate {
  event: SubscribeEvent
  templateId: string
  page: string
}

const EVENT_SET = new Set<string>(SUBSCRIBE_EVENTS)

export function isSubscribeEvent(value: string): value is SubscribeEvent {
  return EVENT_SET.has(value)
}

export function fetchSubscribeTemplates() {
  return request<unknown>({
    path: '/notifications/subscribe-templates',
    withAuth: true,
  }).then(readSubscribeTemplates)
}

export function readSubscribeTemplates(data: unknown): SubscribeTemplate[] {
  const record = asRecord(data)
  if (!record || !Array.isArray(record.templates)) throw new ApiError('订阅模板响应无效')
  const templates: SubscribeTemplate[] = []
  for (const item of record.templates) {
    const row = asRecord(item)
    if (!row) continue
    const event = readString(row.event)
    const templateId = readString(row.templateId)
    if (!isSubscribeEvent(event) || !templateId) continue
    templates.push({ event, templateId, page: readString(row.page) })
  }
  return templates
}

/** 按接口返回的顺序取出这些事件的模板 ID，重复 ID 只保留一次。 */
export function templateIdsFor(
  templates: readonly SubscribeTemplate[],
  events: readonly SubscribeEvent[],
): string[] {
  const wanted = new Set<string>(events)
  const seen = new Set<string>()
  const ids: string[] = []
  for (const template of templates) {
    if (!wanted.has(template.event) || seen.has(template.templateId)) continue
    seen.add(template.templateId)
    ids.push(template.templateId)
  }
  return ids
}
