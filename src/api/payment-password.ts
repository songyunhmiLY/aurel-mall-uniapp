import { ApiError, request } from './http'
import { asRecord } from './record'

const INVALID = '支付密码响应无效'

export function fetchPaymentPassword() {
  return request<unknown>({ path: '/me/payment-password', withAuth: true }).then(readPasswordStatus)
}

/** 首次设置。接口没有重置。 */
export function setPaymentPassword(password: string) {
  return request<unknown>({
    path: '/me/payment-password',
    method: 'POST',
    data: { password },
    withAuth: true,
  }).then(readPasswordStatus)
}

function readPasswordStatus(data: unknown): { set: boolean } {
  const record = asRecord(data)
  if (!record || typeof record.set !== 'boolean') throw new ApiError(INVALID)
  return { set: record.set }
}
