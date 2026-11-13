import type { HomeArticleKind } from '@/types/home'

const KIND_LABEL: Record<HomeArticleKind, string> = {
  article: '文章',
  news: '新闻',
  notice: '通知',
}

export function homeArticleKindLabel(kind: HomeArticleKind): string {
  return KIND_LABEL[kind]
}

export function homeArticleKindClass(kind: HomeArticleKind): string {
  if (kind === 'notice') return 'is-notice'
  if (kind === 'news') return 'is-news'
  return 'is-article'
}
