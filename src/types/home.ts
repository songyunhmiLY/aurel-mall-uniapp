export interface HomeBanner {
  id: string
  title: string
  imageUrl: string
  pagePath: string
  sortOrder: number
}

export interface HomeTicker {
  id: string
  content: string
  sortOrder: number
}

export type HomeArticleKind = 'article' | 'news' | 'notice'

/** 列表项不含正文。 */
export interface HomeArticleSummary {
  id: string
  kind: HomeArticleKind
  title: string
  summary: string
  coverUrl: string | null
  publishedAt: string
}

export interface HomeArticleDetail extends HomeArticleSummary {
  body: string
}

export interface HomeArticlePage {
  items: HomeArticleSummary[]
  total: number
  page: number
  pageSize: number
}
