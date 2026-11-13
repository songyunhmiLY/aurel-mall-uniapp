import { ApiError, request } from './http'
import { asRecord, readPageCount, readPositiveId } from './record'
import type {
  HomeArticleDetail,
  HomeArticleKind,
  HomeArticlePage,
  HomeArticleSummary,
  HomeBanner,
  HomeTicker,
} from '@/types/home'

const INVALID = '首页内容响应无效'
const ARTICLE_PAGE_SIZE = 20

/** GET /home/banners。已上架且带小程序页面的轮播，按接口顺序。 */
export function fetchHomeBanners() {
  return request<unknown>({ path: '/home/banners', withAuth: true }).then(readHomeBanners)
}

/** GET /home/tickers。已上架的滚动字幕，按接口顺序。 */
export function fetchHomeTickers() {
  return request<unknown>({ path: '/home/tickers', withAuth: true }).then(readHomeTickers)
}

/**
 * GET /home/articles。已发布的文章、新闻和通知，不含正文。
 * 不传 kind，三种一起返回。未知 kind 会被接口拒绝。
 */
export function fetchHomeArticles(page = 1, pageSize = ARTICLE_PAGE_SIZE) {
  return request<unknown>({
    path: '/home/articles',
    data: { page, pageSize },
    withAuth: true,
  }).then(readHomeArticlePage)
}

/** GET /home/articles/:id。在列表字段上增加 body。不存在时接口返回「内容不存在」。 */
export function fetchHomeArticle(id: string) {
  return request<unknown>({
    path: `/home/articles/${encodeURIComponent(id)}`,
    withAuth: true,
  }).then(readHomeArticleDetail)
}

export function readHomeBanners(data: unknown): HomeBanner[] {
  return readItems(data).flatMap((item) => {
    const banner = readBanner(item)
    return banner ? [banner] : []
  })
}

export function readHomeTickers(data: unknown): HomeTicker[] {
  return readItems(data).flatMap((item) => {
    const ticker = readTicker(item)
    return ticker ? [ticker] : []
  })
}

export function readHomeArticlePage(data: unknown): HomeArticlePage {
  const record = asRecord(data)
  if (!record || !Array.isArray(record.items)) throw new ApiError(INVALID)
  const page = readPageCount(record.page, INVALID)
  const pageSize = readPageCount(record.pageSize, INVALID)
  if (page < 1 || pageSize < 1) throw new ApiError(INVALID)
  return {
    items: record.items.flatMap((item) => {
      const article = readArticleSummary(item)
      return article ? [article] : []
    }),
    total: readPageCount(record.total, INVALID),
    page,
    pageSize,
  }
}

export function readHomeArticleDetail(data: unknown): HomeArticleDetail {
  const article = readArticleSummary(data)
  const record = asRecord(data)
  const body = typeof record?.body === 'string' ? record.body.trim() : ''
  if (!article || !body) throw new ApiError(INVALID)
  return { ...article, body }
}

function readItems(data: unknown): unknown[] {
  const record = asRecord(data)
  if (!record || !Array.isArray(record.items)) throw new ApiError(INVALID)
  return record.items
}

function readBanner(data: unknown): HomeBanner | null {
  const record = asRecord(data)
  if (!record) return null
  const title = readRequiredText(record.title)
  const imageUrl = readHttpUrl(record.imageUrl)
  const pagePath = readPagePath(record.pagePath)
  const sortOrder = readSortOrder(record.sortOrder)
  if (!title || !imageUrl || !pagePath || sortOrder == null) return null
  try {
    return { id: readPositiveId(record.id, INVALID), title, imageUrl, pagePath, sortOrder }
  } catch {
    return null
  }
}

function readTicker(data: unknown): HomeTicker | null {
  const record = asRecord(data)
  if (!record) return null
  const content = readRequiredText(record.content)
  const sortOrder = readSortOrder(record.sortOrder)
  if (!content || sortOrder == null) return null
  try {
    return { id: readPositiveId(record.id, INVALID), content, sortOrder }
  } catch {
    return null
  }
}

function readArticleSummary(data: unknown): HomeArticleSummary | null {
  const record = asRecord(data)
  if (!record) return null
  const kind = readKind(record.kind)
  const title = readRequiredText(record.title)
  const summary = readRequiredText(record.summary)
  const publishedAt = readPublishedAt(record.publishedAt)
  if (!kind || !title || !summary || !publishedAt) return null
  try {
    return {
      id: readPositiveId(record.id, INVALID),
      kind,
      title,
      summary,
      coverUrl: readCoverUrl(record.coverUrl),
      publishedAt,
    }
  } catch {
    return null
  }
}

function readKind(value: unknown): HomeArticleKind | null {
  if (value === 'article' || value === 'news' || value === 'notice') return value
  return null
}

function readRequiredText(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const text = value.trim()
  return text.length ? text : null
}

function readPublishedAt(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const text = value.trim()
  if (!/^\d{4}-\d{2}-\d{2}T/.test(text)) return null
  return text
}

function readCoverUrl(value: unknown): string | null {
  if (value == null) return null
  return readHttpUrl(value)
}

function readHttpUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const text = value.trim()
  if (!text || /\s/.test(text) || !/^https?:\/\//i.test(text)) return null
  return text
}

function readPagePath(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const text = value.trim()
  if (!text || /\s/.test(text)) return null
  if (/^[a-z][a-z0-9+.-]*:/i.test(text) || text.startsWith('//')) return null
  return text
}

function readSortOrder(value: unknown): number | null {
  if (typeof value !== 'number' || !Number.isInteger(value)) return null
  return value
}
