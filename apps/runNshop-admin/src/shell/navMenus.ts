// 메뉴 구조 정의(단일 소스) — docs_ai/06-화면정의/admin/Shell/00-AppShell.md "메뉴 트리" 참고.
// 원본 §3.2 롤별 메뉴 접근 권한을 그룹별 roles로 함께 정의한다.
//
// 구조 정책: 메뉴는 최대 3depth, 1depth(NAV_MENU_STRUCTURE 배열 길이)는 최대 9개다.
//   1depth = 그룹(NavMenuGroup, 상단 메뉴바 항목)
//   2depth = NavMenuGroup.items의 각 원소 — 리프(화면)이거나, children을 가진 하위그룹 라벨
//   3depth = children 안의 리프(화면). 이보다 더 깊이 중첩하지 않는다(children.children 금지).
export type OperatorRole = 'SUPER' | 'MD' | 'CS' | 'SETTLEMENT' | 'VENDOR_MGMT'

export interface NavMenuItem {
  id: string
  label: string
  devOnly?: boolean // 원본 메뉴 트리(§3.3)엔 없는 개발용 화면 — 운영 메뉴 정식 항목이 아님
  children?: NavMenuItem[] // 있으면 이 항목은 3depth 리프를 묶는 2depth 그룹 라벨(클릭 불가, id는 라우팅에 쓰이지 않음)
}

export interface NavMenuGroup {
  id: string
  label: string
  roles: OperatorRole[]
  items: NavMenuItem[]
}

export const NAV_MENU_STRUCTURE: NavMenuGroup[] = [
  {
    id: 'product',
    label: '상품 관리',
    roles: ['SUPER', 'MD'],
    items: [
      { id: 'product/review', label: '상품 심사' },
      { id: 'product/list', label: '상품 목록' },
      { id: 'product/category-std', label: '표준 카테고리' },
      { id: 'product/category-display', label: '전시 카테고리' },
      { id: 'product/brand', label: '브랜드 관리' },
      { id: 'product/display-page', label: '페이지 관리' },
      { id: 'product/display-template', label: '템플릿 관리' },
      { id: 'product/section-type', label: '섹션 관리' },
    ],
  },
  {
    id: 'promotion',
    label: '프로모션',
    roles: ['SUPER', 'MD'],
    items: [
      { id: 'promotion/exhibition', label: '기획전' },
      { id: 'promotion/event-price', label: '즉시할인' },
      { id: 'promotion/coupon', label: '쿠폰할인' },
      { id: 'promotion/qty-discount', label: '수량별 할인' },
      { id: 'promotion/cart-discount', label: '장바구니 할인' },
    ],
  },
  {
    id: 'order',
    label: '주문 관리',
    roles: ['SUPER', 'CS'],
    items: [
      { id: 'order/order-history', label: '주문 목록' },
      { id: 'order/claim', label: '클레임 목록' },
    ],
  },
  {
    id: 'member',
    label: '회원 관리',
    roles: ['SUPER', 'CS'],
    items: [
      { id: 'member/list', label: '회원 목록' },
      { id: 'member/grade', label: '등급 기준 관리' },
    ],
  },
  {
    id: 'vendor',
    label: '입점사 관리',
    roles: ['SUPER', 'VENDOR_MGMT'],
    items: [
      { id: 'vendor/apply', label: '입점 신청 심사' },
      { id: 'vendor/list', label: '입점사 목록' },
      { id: 'vendor/delivery', label: '배송사 관리' },
    ],
  },
  {
    id: 'settlement',
    label: '정산 관리',
    roles: ['SUPER', 'SETTLEMENT'],
    items: [
      { id: 'settlement/list', label: '정산 목록' },
      { id: 'settlement/payment', label: '지급 관리' },
      { id: 'settlement/external', label: '외부 정산' },
    ],
  },
  {
    id: 'community',
    label: '커뮤니티',
    roles: ['SUPER', 'MD', 'CS'],
    items: [
      { id: 'community/review', label: '리뷰 관리' },
      { id: 'community/qna', label: 'QnA 관리' },
    ],
  },
  {
    id: 'settings',
    label: '운영 설정',
    roles: ['SUPER'],
    items: [
      { id: 'settings/notification', label: '알림 템플릿' },
      { id: 'settings/banned-word', label: '금지어 관리' },
      { id: 'settings/notice', label: '공지사항' },
      { id: 'settings/terms', label: '약관 관리' },
      { id: 'settings/banner', label: '배너 관리' },
      { id: 'settings/access-log', label: '고객정보 접근 이력' },
    ],
  },
  {
    // 9개 화면이 평평하게 나열돼 있던 걸 3depth로 재구성 — 계정·권한 계열/인프라 운영 계열로 분리.
    id: 'system',
    label: '시스템',
    roles: ['SUPER'],
    items: [
      {
        id: 'system/account-group',
        label: '계정·권한',
        children: [
          { id: 'system/operator', label: '운영자 계정' },
          { id: 'system/operator-apply', label: '운영자 신청 승인' },
          { id: 'system/permission', label: '프로그램 관리' },
          { id: 'system/role', label: '권한 관리' },
          { id: 'system/common-code', label: '공통코드' },
        ],
      },
      {
        id: 'system/infra-group',
        label: '인프라 운영',
        children: [
          { id: 'system/batch', label: '배치 관리' },
          { id: 'system/outbox-dlq', label: 'Outbox·DLQ' },
          { id: 'system/audit-log', label: '감사 로그' },
        ],
      },
      { id: 'guide/ui', label: '화면 작성 가이드', devOnly: true },
    ],
  },
]

// GET /api/admin/v1/programs 격 — 프로그램(메뉴) 목록 API. 실제 서버가 없어 권한 필터링을
// 여기서 흉내 낸다: 로그인한 role이 접근 가능한 그룹만 반환한다(응답 자체가 이미 필터링된
// 상태 — 클라이언트는 받은 목록을 그대로 활성화하면 된다).
export function fetchProgramList(role: OperatorRole): Promise<NavMenuGroup[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(NAV_MENU_STRUCTURE.filter((group) => group.roles.includes(role)))
    }, 300)
  })
}
