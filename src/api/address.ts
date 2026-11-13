import { request } from './http'
import { asRecord, readString } from './record'

/** 写入 body 与地址接口一致。手机号字段是 contactPhone。 */
export interface AddressInput {
  contactName: string
  contactPhone: string
  province: string
  city: string
  district: string
  detail: string
  isDefault: boolean
}

export interface Address extends AddressInput {
  id: string
}

export function fetchAddresses() {
  return request<unknown>({ path: '/me/addresses', withAuth: true }).then(readAddressList)
}

export function createAddress(body: AddressInput) {
  return request<unknown>({
    path: '/me/addresses',
    method: 'POST',
    data: body,
    withAuth: true,
  })
}

export function updateAddress(id: string, body: AddressInput) {
  return request<unknown>({
    path: `/me/addresses/${encodeURIComponent(id)}`,
    method: 'PUT',
    data: body,
    withAuth: true,
  })
}

export function deleteAddress(id: string) {
  return request<unknown>({
    path: `/me/addresses/${encodeURIComponent(id)}`,
    method: 'DELETE',
    withAuth: true,
  })
}

export function setDefaultAddress(id: string) {
  return request<unknown>({
    path: `/me/addresses/${encodeURIComponent(id)}/default`,
    method: 'POST',
    withAuth: true,
  })
}

export function readAddressList(data: unknown): Address[] {
  if (!Array.isArray(data)) return []
  return data.map(readAddress).filter((item): item is Address => item !== null)
}

export function readAddress(data: unknown): Address | null {
  const record = asRecord(data)
  if (!record) return null
  const id = readString(record.id)
  if (!id) return null
  return {
    id,
    contactName: readString(record.contactName),
    contactPhone: readString(record.contactPhone),
    province: readString(record.province),
    city: readString(record.city),
    district: readString(record.district),
    detail: readString(record.detail),
    isDefault: record.isDefault === true,
  }
}
