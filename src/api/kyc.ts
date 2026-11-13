import { request } from './http'
import { asRecord, readString } from './record'

/** 实名只收集这三项。不上传证件照，也不走微信人脸核身。 */
export interface KycInput {
  name: string
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
  if (!record) return { verified: false, name: '', idNumber: '', mobile: '' }
  const status = readString(record.status)
  return {
    verified: record.verified === true || status === 'verified',
    name: readString(record.name) || readString(record.realName),
    idNumber:
      readString(record.idNumber) || readString(record.nationalId) || readString(record.idCardNo),
    mobile: readString(record.mobile) || readString(record.phone) || readString(record.mobilePhone),
  }
}
