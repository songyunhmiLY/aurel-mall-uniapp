export interface BannerSlide {
  id: string
  title: string
}

export interface NoticeItem {
  id: string
  text: string
}

export interface ArticleBrief {
  id: string
  title: string
  summary: string
}

export interface HomeFeed {
  banners?: BannerSlide[]
  notices?: NoticeItem[]
  articles?: ArticleBrief[]
}
