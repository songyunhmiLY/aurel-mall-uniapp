import { request } from './http'

export interface UserProfile {
  nickname?: string
}

export function fetchProfile() {
  return request<UserProfile>({ path: '/me', withAuth: true })
}
