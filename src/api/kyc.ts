import { request } from './http'
import { asRecord, readString } from './record'

/** POST /me/kyc。只提交这三项，不上传证件照。 */
export interface KycInput {
  realName: string
  idNumber: string
  mobile: string
}

export interface KycProfile extends KycInput {
  verified: boolean
}

export function fetchKyc() {
  return request<unknown>({ path: '/me/kyc', withAuth: true }).then(readKyc)
}

export function submitKyc(body: KycInput) {
  return request<unknown>({
    path: '/me/kyc',
    method: 'POST',
    data: body,
    withAuth: true,
  }).then(readKyc)
}

export function readKyc(data: unknown): KycProfile {
  const record = asRecord(data)
  if (!record) return { verified: false, realName: '', idNumber: '', mobile: '' }
  return {
    verified: record.verified === true,
    realName: readString(record.realName),
    idNumber: readString(record.idNumber),
    mobile: readString(record.mobile),
  }
}
