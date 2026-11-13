import { request } from './http'
import { asRecord, readString } from './record'

/**
 * 写入字段与设置页一致：contactName、phone、province、city、district、detail、isDefault。
 * 读取时同时接受表字段 contactPhone。
 */
export interface AddressInput {
  contactName: string
  phone: string
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

export function fetchAddress(id: string) {
  return request<unknown>({
    path: `/me/addresses/${encodeURIComponent(id)}`,
    withAuth: true,
  }).then(readAddress)
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

export function toAddressInput(item: Address, isDefault = item.isDefault): AddressInput {
  return {
    contactName: item.contactName,
    phone: item.phone,
    province: item.province,
    city: item.city,
    district: item.district,
    detail: item.detail,
    isDefault,
  }
}

export function readAddressList(data: unknown): Address[] {
  const record = asRecord(data)
  const raw = Array.isArray(data)
    ? data
    : Array.isArray(record?.items)
      ? record.items
      : Array.isArray(record?.list)
        ? record.list
        : []
  return raw.map(readAddress).filter((item): item is Address => item !== null)
}

export function readAddress(data: unknown): Address | null {
  const record = asRecord(data)
  if (!record) return null
  const id = readString(record.id)
  if (!id) return null
  return {
    id,
    contactName: readString(record.contactName) || readString(record.name),
    phone: readString(record.phone) || readString(record.contactPhone),
    province: readString(record.province),
    city: readString(record.city),
    district: readString(record.district),
    detail: readString(record.detail),
    isDefault: record.isDefault === true || record.def === true,
  }
}
