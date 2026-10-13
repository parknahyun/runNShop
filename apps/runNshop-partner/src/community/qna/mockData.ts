export type QnaStatus = 'PENDING' | 'ANSWERED' | 'HIDDEN'

export const QNA_STATUS_LABEL: Record<QnaStatus, string> = {
  PENDING: '답변대기',
  ANSWERED: '답변완료',
  HIDDEN: '숨김',
}

export interface Qna {
  qna_id: string
  product_name: string
  member_name: string
  question: string
  answer: string | null
  answered_at: string | null
  activity_score_granted: boolean
  status: QnaStatus
  created_at: string
}

export const MOCK_QNAS: Qna[] = [
  {
    qna_id: 'QNA-00001',
    product_name: '나이키 페가수스 41',
    member_name: '김**',
    question: '평소 260 신는데 이 제품은 정사이즈인가요, 크게 나오나요?',
    answer: null,
    answered_at: null,
    activity_score_granted: false,
    status: 'PENDING',
    created_at: '2026.07.05 10:20',
  },
  {
    qna_id: 'QNA-00002',
    product_name: '나이키 보메로 18',
    member_name: '이**',
    question: '이 신발 발볼이 넓은 편인가요? 발볼이 넓어서 고민중입니다.',
    answer: '안녕하세요. 보메로 18은 표준 발볼(D)로 제작되어 일반적인 발볼에 적합합니다. 발볼이 넓으신 경우 반 사이즈 크게 착용하시는 것을 권장드립니다.',
    answered_at: '2026.07.02 14:10',
    activity_score_granted: true,
    status: 'ANSWERED',
    created_at: '2026.07.01 09:30',
  },
  {
    qna_id: 'QNA-00003',
    product_name: '나이키 드라이핏 ADV 러닝 티셔츠',
    member_name: '박**',
    question: '세탁 시 수축이 있나요? 사이즈 선택에 참고하고 싶습니다.',
    answer: null,
    answered_at: null,
    activity_score_granted: false,
    status: 'PENDING',
    created_at: '2026.07.04 16:45',
  },
  {
    qna_id: 'QNA-00004',
    product_name: '나이키 에어 줌 스트럭쳐 25',
    member_name: '최**',
    question: '족저근막염이 있는데 이 제품 착용해도 괜찮을까요?',
    answer: '족저근막염이 있으신 경우 안정성과 쿠셔닝이 좋은 스트럭쳐 라인이 도움이 될 수 있습니다.다만 증상이 심한 경우 전문의와 상담 후 착용을 권장드립니다.',
    answered_at: '2026.06.29 11:05',
    activity_score_granted: false,
    status: 'ANSWERED',
    created_at: '2026.06.28 08:50',
  },
  {
    qna_id: 'QNA-00005',
    product_name: '나이키 런닝 캡 드라이핏',
    member_name: '정**',
    question: '헤드 사이즈가 큰 편인데 사이즈 조절이 가능한가요?',
    answer: null,
    answered_at: null,
    activity_score_granted: false,
    status: 'PENDING',
    created_at: '2026.07.06 13:15',
  },
  {
    qna_id: 'QNA-00006',
    product_name: '나이키 인피니티 런 4',
    member_name: '한**',
    question: '이전 모델 대비 무게 차이가 궁금합니다.',
    answer: '인피니티 런 4는 이전 모델 대비 약 15g 가벼워졌습니다. 안정성은 유지하면서 경량화한 것이 특징입니다.',
    answered_at: '2026.06.20 10:40',
    activity_score_granted: true,
    status: 'ANSWERED',
    created_at: '2026.06.19 15:22',
  },
  {
    qna_id: 'QNA-00007',
    product_name: '나이키 페가수스 41',
    member_name: '윤**',
    question: '부적절한 표현이 포함된 문의였습니다.',
    answer: '문의 내용 확인 후 별도 안내드리겠습니다.',
    answered_at: '2026.06.15 09:00',
    activity_score_granted: false,
    status: 'HIDDEN',
    created_at: '2026.06.14 22:10',
  },
]
