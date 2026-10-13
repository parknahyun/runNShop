// 교환 목록 (VND-030-003) 목업 데이터
// 벤더는 재고 확인 → 수거 운송장 등록 → 수거 완료 처리 → 교환 출고 처리 순으로 물류를 처리한다.

import { type ClaimHistoryEntry } from '@/claim/shared/types'

export type ExchangeStatus = 'REQUESTED' | 'STOCK_CHECKED' | 'PICKUP_REGISTERED' | 'PICKUP_DONE' | 'SHIPPED'

export const EXCHANGE_STATUS_LABEL: Record<ExchangeStatus, string> = {
  REQUESTED: '접수',
  STOCK_CHECKED: '재고 확인',
  PICKUP_REGISTERED: '수거 등록',
  PICKUP_DONE: '수거 완료',
  SHIPPED: '출고 완료',
}

export interface ExchangeClaim {
  claim_no: string
  platform_order_no: string
  product_name: string
  from_option: string
  to_option: string
  customer_name: string
  reason: string
  stock_available: boolean | null
  status: ExchangeStatus
  pickup_company: string | null
  pickup_tracking_no: string | null
  history: ClaimHistoryEntry[]
  created_at: string
}

export const MOCK_EXCHANGE_CLAIMS: ExchangeClaim[] = [
  {
    claim_no: 'CLM-20260621-00024', platform_order_no: 'ORD-20260619-00090', product_name: '나이키 페가수스 41',
    from_option: '블랙/260', to_option: '화이트/260', customer_name: '김**', reason: '색상 교환 희망',
    stock_available: true, status: 'SHIPPED', pickup_company: 'CJ대한통운', pickup_tracking_no: '651122334455',
    history: [
      { at: '2026.06.21 10:05', action: '교환 접수' },
      { at: '2026.06.21 14:30', action: '재고 확인', memo: '재고 있음' },
      { at: '2026.06.21 17:00', action: '수거 운송장 등록', memo: 'CJ대한통운 / 651122334455' },
      { at: '2026.06.22 11:10', action: '수거 완료 처리' },
      { at: '2026.06.22 16:20', action: '교환 출고 처리' },
    ],
    created_at: '2026.06.21 10:05',
  },
  {
    claim_no: 'CLM-20260628-00013', platform_order_no: 'ORD-20260626-00055', product_name: '나이키 보메로 18',
    from_option: '화이트/255', to_option: '화이트/260', customer_name: '이**', reason: '사이즈가 작음',
    stock_available: null, status: 'REQUESTED', pickup_company: null, pickup_tracking_no: null,
    history: [
      { at: '2026.06.28 09:15', action: '교환 접수' },
    ],
    created_at: '2026.06.28 09:15',
  },
  {
    claim_no: 'CLM-20260629-00020', platform_order_no: 'ORD-20260627-00061', product_name: '나이키 드라이핏 ADV 러닝 티셔츠',
    from_option: '네이비/M', to_option: '네이비/L', customer_name: '박**', reason: '사이즈가 작음',
    stock_available: true, status: 'STOCK_CHECKED', pickup_company: null, pickup_tracking_no: null,
    history: [
      { at: '2026.06.29 11:20', action: '교환 접수' },
      { at: '2026.06.29 15:40', action: '재고 확인', memo: '재고 있음' },
    ],
    created_at: '2026.06.29 11:20',
  },
  {
    claim_no: 'CLM-20260630-00010', platform_order_no: 'ORD-20260628-00039', product_name: '나이키 에어 줌 스트럭쳐 25',
    from_option: '그레이/270', to_option: '그레이/265', customer_name: '최**', reason: '사이즈가 큼',
    stock_available: true, status: 'PICKUP_REGISTERED', pickup_company: '한진택배', pickup_tracking_no: '412233445566',
    history: [
      { at: '2026.06.30 09:50', action: '교환 접수' },
      { at: '2026.06.30 13:10', action: '재고 확인', memo: '재고 있음' },
      { at: '2026.06.30 18:25', action: '수거 운송장 등록', memo: '한진택배 / 412233445566' },
    ],
    created_at: '2026.06.30 09:50',
  },
  {
    claim_no: 'CLM-20260701-00015', platform_order_no: 'ORD-20260629-00075', product_name: '나이키 인피니티 런 4',
    from_option: '레드/265', to_option: '블랙/265', customer_name: '정**', reason: '색상 교환 희망',
    stock_available: true, status: 'PICKUP_DONE', pickup_company: '롯데택배', pickup_tracking_no: '223344556677',
    history: [
      { at: '2026.07.01 08:30', action: '교환 접수' },
      { at: '2026.07.01 11:00', action: '재고 확인', memo: '재고 있음' },
      { at: '2026.07.01 15:20', action: '수거 운송장 등록', memo: '롯데택배 / 223344556677' },
      { at: '2026.07.02 10:00', action: '수거 완료 처리' },
    ],
    created_at: '2026.07.01 08:30',
  },
  {
    claim_no: 'CLM-20260702-00007', platform_order_no: 'ORD-20260630-00048', product_name: '나이키 윈드러너 재킷',
    from_option: '블랙/M', to_option: '블랙/L', customer_name: '한**', reason: '사이즈가 작음',
    stock_available: null, status: 'REQUESTED', pickup_company: null, pickup_tracking_no: null,
    history: [
      { at: '2026.07.02 14:00', action: '교환 접수' },
    ],
    created_at: '2026.07.02 14:00',
  },
]
