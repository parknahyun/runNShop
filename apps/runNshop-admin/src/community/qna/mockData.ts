// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type QnaType = 'PRODUCT' | 'ORDER'

export type AnsweredByType = 'OPERATOR' | 'VENDOR'

export type QnaStatus = 'PENDING' | 'ANSWERED' | 'HIDDEN'

export interface Qna {
  qnaId: string
  qnaType: QnaType
  refName: string               // 상품명 또는 주문번호 (표시용)
  memberName: string            // 마스킹 표시 (예: 박*희)
  question: string
  answer: string | null
  answeredByType: AnsweredByType | null
  answeredAt: string | null
  isPublic: boolean             // ORDER 타입은 항상 false
  activityScoreGranted: boolean
  activityScoreAt: string | null
  status: QnaStatus
  createdAt: string
  updatedAt: string
}

export interface QnaFilter {
  keyword: string
  qnaType: QnaType | 'ALL'
  status: QnaStatus | 'ALL'
}

// ---------------------------------------------------------------------------
// Label maps
// ---------------------------------------------------------------------------

export const QNA_TYPE_LABEL: Record<QnaType, string> = {
  PRODUCT: '상품문의',
  ORDER: '주문문의',
}

export const QNA_STATUS_LABEL: Record<QnaStatus, string> = {
  PENDING: '답변대기',
  ANSWERED: '답변완료',
  HIDDEN: '숨김',
}

export const ANSWERED_BY_TYPE_LABEL: Record<AnsweredByType, string> = {
  OPERATOR: '운영자',
  VENDOR: '입점사',
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

export const MOCK_QNAS: Qna[] = [
  {
    qnaId: 'QNA-001', qnaType: 'PRODUCT', refName: '나이키 알파플라이 3', memberName: '박*희',
    question: '실측 사이즈가 정사이즈인가요, 아니면 반사이즈 작게 나오나요?',
    answer: '해당 모델은 브랜드 기준 정사이즈로 제작되었습니다. 발볼이 넓으신 경우 반사이즈 업을 추천드립니다.',
    answeredByType: 'OPERATOR', answeredAt: '2026.06.21 09:30',
    isPublic: true, activityScoreGranted: true, activityScoreAt: '2026.06.21 09:35',
    status: 'ANSWERED', createdAt: '2026.06.20 11:00', updatedAt: '2026.06.21 09:35',
  },
  {
    qnaId: 'QNA-002', qnaType: 'ORDER', refName: 'ORD-20260624-041', memberName: '정*영',
    question: '배송이 3일째 그대로인데 언제쯔음 발송되나요?',
    answer: null, answeredByType: null, answeredAt: null,
    isPublic: false, activityScoreGranted: false, activityScoreAt: null,
    status: 'PENDING', createdAt: '2026.06.29 10:20', updatedAt: '2026.06.29 10:20',
  },
  {
    qnaId: 'QNA-003', qnaType: 'PRODUCT', refName: '아디다스 보스턴 13', memberName: '강*현',
    question: '이 신발로 풀코스 마라톤 완주 가능할까요? 후기 부탁드립니다.',
    answer: '카본플레이트가 탑재된 레이싱화로 풀코스 완주에 적합합니다. 다만 착화감 적응 기간이 필요할 수 있습니다.',
    answeredByType: 'VENDOR', answeredAt: '2026.06.23 15:10',
    isPublic: true, activityScoreGranted: false, activityScoreAt: null,
    status: 'ANSWERED', createdAt: '2026.06.23 08:50', updatedAt: '2026.06.23 15:10',
  },
  {
    qnaId: 'QNA-004', qnaType: 'PRODUCT', refName: '살로몬 S/LAB 울트라 4', memberName: '서*아',
    question: '트레일 러닝 초보도 신을 수 있을까요?',
    answer: null, answeredByType: null, answeredAt: null,
    isPublic: true, activityScoreGranted: false, activityScoreAt: null,
    status: 'PENDING', createdAt: '2026.06.27 13:45', updatedAt: '2026.06.27 13:45',
  },
  {
    qnaId: 'QNA-005', qnaType: 'ORDER', refName: 'ORD-20260622-027', memberName: '임*진',
    question: '결제는 완료됐는데 주문 상태가 계속 대기중으로 보여요.',
    answer: '결제 승인 확인되었으며 정상적으로 상품 준비 중입니다. 금일 중 발송 예정입니다.',
    answeredByType: 'OPERATOR', answeredAt: '2026.06.22 17:00',
    isPublic: false, activityScoreGranted: false, activityScoreAt: null,
    status: 'ANSWERED', createdAt: '2026.06.22 16:40', updatedAt: '2026.06.22 17:00',
  },
  {
    qnaId: 'QNA-006', qnaType: 'PRODUCT', refName: '브룩스 글리세린 21', memberName: '윤*서',
    question: '경쟁사 제품 광고 링크가 포함된 부적절한 문의로 숨김 처리되었습니다.',
    answer: null, answeredByType: null, answeredAt: null,
    isPublic: true, activityScoreGranted: false, activityScoreAt: null,
    status: 'HIDDEN', createdAt: '2026.06.18 10:00', updatedAt: '2026.06.19 09:00',
  },
]

// ---------------------------------------------------------------------------
// Filter
// ---------------------------------------------------------------------------

export function filterQnas(items: Qna[], filter: QnaFilter): Qna[] {
  return items.filter((q) => {
    if (filter.keyword.trim()) {
      const kw = filter.keyword.trim().toLowerCase()
      if (
        !q.question.toLowerCase().includes(kw) &&
        !q.memberName.toLowerCase().includes(kw)
      ) return false
    }
    if (filter.qnaType !== 'ALL' && q.qnaType !== filter.qnaType) return false
    if (filter.status !== 'ALL' && q.status !== filter.status) return false
    return true
  })
}
