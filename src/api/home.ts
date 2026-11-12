import { request } from './http'
import type { HomeFeed } from '@/types/home'

export function fetchHomeFeed() {
  return request<HomeFeed>({ path: '/home' })
}
