export interface BannerSlide {
  id: string
  title: string
  kicker?: string
  desc?: string
  href?: string
  tone?: string
}

export interface NoticeItem {
  id: string
  text: string
}

export interface ArticleBrief {
  id: string
  title: string
  summary: string
  date?: string
  typeName?: string
  type?: 'notice' | 'article'
  body?: string[]
}

export interface HomeFeed {
  banners?: BannerSlide[]
  notices?: NoticeItem[]
  articles?: ArticleBrief[]
}
