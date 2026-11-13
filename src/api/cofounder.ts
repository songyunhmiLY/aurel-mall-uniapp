import { ApiError, request } from './http'
import { asRecord, readNullableText, readPositiveId } from './record'
import type { CofounderActivation, CofounderButton, CofounderPage } from '@/types/cofounder'

const PAGE_INVALID = '联合创始人响应无效'
const PAY_INVALID = '支付响应无效'

export const COFOUNDER_ACTIVATION_PURPOSE = 'cofounder_activation' as const

/** GET /me/cofounder。介绍、是否已开通，以及「成为联合创始人」是否可点。 */
export function fetchCofounderPage() {
  return request<unknown>({ path: '/me/cofounder', withAuth: true }).then(readCofounderPage)
}

/** POST /me/cofounder/activations。只创建微信支付预下单，支付成功后才入籍。 */
export function startCofounderActivation() {
  return request<unknown>({
    path: '/me/cofounder/activations',
    method: 'POST',
    withAuth: true,
  }).then(readCofounderActivation)
}

export function readCofounderPage(data: unknown): CofounderPage {
  const record = asRecord(data)
  const entry = asRecord(record?.entry)
  const intro = asRecord(record?.intro)
  const button = readButton(record?.button)
  if (!record || !entry || !intro || typeof record.enrolled !== 'boolean' || !button) {
    throw new ApiError(PAGE_INVALID)
  }
  return {
    entry: {
      copy: readText(entry.copy, PAGE_INVALID),
      imageUrls: readImageUrls(entry.imageUrls),
    },
    intro: {
      title: readText(intro.title, PAGE_INVALID),
      body: readText(intro.body, PAGE_INVALID),
      imageUrls: readImageUrls(intro.imageUrls),
    },
    enrolled: record.enrolled,
    button,
    activationAmountFen: readAmountFen(record.activationAmountFen),
  }
}

export function readCofounderActivation(data: unknown): CofounderActivation {
  const record = asRecord(data)
  if (!record) throw new ApiError(PAY_INVALID)
  if (record.mode !== 'sandbox' && record.mode !== 'live') throw new ApiError(PAY_INVALID)
  if (record.purpose !== COFOUNDER_ACTIVATION_PURPOSE) throw new ApiError(PAY_INVALID)
  if (record.orderId !== null) throw new ApiError(PAY_INVALID)
  if (record.signType !== null && record.signType !== 'RSA') throw new ApiError(PAY_INVALID)
  const amountFen = record.amountFen
  if (typeof amountFen !== 'number' || !Number.isInteger(amountFen) || amountFen <= 0) {
    throw new ApiError(PAY_INVALID)
  }
  const payNo = readText(record.payNo, PAY_INVALID)
  const status = readText(record.status, PAY_INVALID)
  if (!payNo || !status) throw new ApiError(PAY_INVALID)
  return {
    activationId: readPositiveId(record.activationId, PAY_INVALID),
    mode: record.mode,
    purpose: COFOUNDER_ACTIVATION_PURPOSE,
    payNo,
    orderId: null,
    amountFen,
    status,
    appId: readNullableText(record.appId, PAY_INVALID),
    timeStamp: readNullableText(record.timeStamp, PAY_INVALID),
    nonceStr: readNullableText(record.nonceStr, PAY_INVALID),
    package: readNullableText(record.package, PAY_INVALID),
    signType: record.signType,
    paySign: readNullableText(record.paySign, PAY_INVALID),
  }
}

function readButton(value: unknown): CofounderButton | null {
  const record = asRecord(value)
  if (!record || typeof record.available !== 'boolean') return null
  const reason = readText(record.reason, PAGE_INVALID)
  if (!reason) return null
  return { available: record.available, reason }
}

function readImageUrls(value: unknown): string[] {
  if (!Array.isArray(value)) throw new ApiError(PAGE_INVALID)
  return value.map((item) => {
    const text = readText(item, PAGE_INVALID)
    if (!text) throw new ApiError(PAGE_INVALID)
    return text
  })
}

function readAmountFen(value: unknown): string {
  if (typeof value !== 'string' || !/^\d+$/.test(value)) throw new ApiError(PAGE_INVALID)
  return value
}

function readText(value: unknown, invalid: string): string {
  if (typeof value !== 'string') throw new ApiError(invalid)
  return value.trim()
}
