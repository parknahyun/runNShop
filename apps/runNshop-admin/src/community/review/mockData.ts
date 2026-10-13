// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ReviewRating = 1 | 2 | 3 | 4 | 5

export type ReviewStatus = 'ACTIVE' | 'HIDDEN' | 'DELETED'

export interface Review {
  reviewId: string
  productName: string
  memberName: string           // 마스킹 표시 (예: 박*희)
  rating: ReviewRating
  content: string
  imageUrls: string[]
  isPhotoReview: boolean
  status: ReviewStatus
  hiddenReason: string | null
  createdAt: string
  updatedAt: string
}

export interface ReviewFilter {
  keyword: string
  rating: ReviewRating | 'ALL'
  status: ReviewStatus | 'ALL'
  photoOnly: boolean
}

// ---------------------------------------------------------------------------
// Label maps
// ---------------------------------------------------------------------------

export const REVIEW_STATUS_LABEL: Record<ReviewStatus, string> = {
  ACTIVE: '활성',
  HIDDEN: '숨김',
  DELETED: '삭제',
}

export const REVIEW_RATING_LABEL: Record<ReviewRating, string> = {
  1: '1점',
  2: '2점',
  3: '3점',
  4: '4점',
  5: '5점',
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

export const MOCK_REVIEWS: Review[] = [
  {
    reviewId: 'RVW-001', productName: '나이키 알파플라이 3', memberName: '박*희', rating: 5,
    content: '가볍고 쿠셔닝이 좋아서 마라톤 완주에 큰 도움이 됐어요. 사이즈도 딱 맞습니다.',
    imageUrls: ['https://via.placeholder.com/200x200', 'https://via.placeholder.com/200x200'],
    isPhotoReview: true, status: 'ACTIVE', hiddenReason: null,
    createdAt: '2026.06.20 10:15', updatedAt: '2026.06.20 10:15',
  },
  {
    reviewId: 'RVW-002', productName: '아디다스 보스턴 13', memberName: '정*영', rating: 4,
    content: '전반적으로 만족하지만 발볼이 좁은 편이라 반사이즈 업 추천합니다.',
    imageUrls: [],
    isPhotoReview: false, status: 'ACTIVE', hiddenReason: null,
    createdAt: '2026.06.22 14:02', updatedAt: '2026.06.22 14:02',
  },
  {
    reviewId: 'RVW-003', productName: '살로몬 S/LAB 울트라 4', memberName: '강*현', rating: 2,
    content: '기대에 비해 접지력이 아쉬웠습니다. 트레일 초보에게는 부담스러운 신발이에요.',
    imageUrls: ['https://via.placeholder.com/200x200'],
    isPhotoReview: true, status: 'HIDDEN', hiddenReason: '제품과 무관한 비방성 표현 포함',
    createdAt: '2026.06.18 09:40', updatedAt: '2026.06.24 11:00',
  },
  {
    reviewId: 'RVW-004', productName: '뉴발란스 퓨얼셀 SC', memberName: '서*아', rating: 5,
    content: '레이스에서 신어봤는데 반발력이 정말 좋았습니다. 재구매 의사 있어요!',
    imageUrls: ['https://via.placeholder.com/200x200', 'https://via.placeholder.com/200x200', 'https://via.placeholder.com/200x200'],
    isPhotoReview: true, status: 'ACTIVE', hiddenReason: null,
    createdAt: '2026.06.25 16:30', updatedAt: '2026.06.25 16:30',
  },
  {
    reviewId: 'RVW-005', productName: '아식스 매직스피드 4', memberName: '임*진', rating: 3,
    content: '무난합니다. 특별히 좋지도 나쁘지도 않아요.',
    imageUrls: [],
    isPhotoReview: false, status: 'ACTIVE', hiddenReason: null,
    createdAt: '2026.06.28 08:11', updatedAt: '2026.06.28 08:11',
  },
  {
    reviewId: 'RVW-006', productName: '브룩스 글리세린 21', memberName: '윤*서', rating: 1,
    content: '광고성 문구와 도배성 링크가 포함되어 삭제 처리된 리뷰입니다.',
    imageUrls: [],
    isPhotoReview: false, status: 'DELETED', hiddenReason: '광고성 게시물로 판단되어 삭제',
    createdAt: '2026.06.15 11:20', updatedAt: '2026.06.16 09:00',
  },
]

// ---------------------------------------------------------------------------
// Filter
// ---------------------------------------------------------------------------

export function filterReviews(items: Review[], filter: ReviewFilter): Review[] {
  return items.filter((r) => {
    if (filter.keyword.trim()) {
      const kw = filter.keyword.trim().toLowerCase()
      if (
        !r.productName.toLowerCase().includes(kw) &&
        !r.memberName.toLowerCase().includes(kw)
      ) return false
    }
    if (filter.rating !== 'ALL' && r.rating !== filter.rating) return false
    if (filter.status !== 'ALL' && r.status !== filter.status) return false
    if (filter.photoOnly && !r.isPhotoReview) return false
    return true
  })
}
