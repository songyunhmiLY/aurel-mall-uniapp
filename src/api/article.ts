import { request } from './http'
import type { ArticleBrief } from '@/types/home'

export function fetchArticle(id: string) {
  return request<ArticleBrief>({ path: `/articles/${encodeURIComponent(id)}` })
}
