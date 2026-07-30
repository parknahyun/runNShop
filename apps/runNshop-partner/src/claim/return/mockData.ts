// 반품 목록 (VND-030-002) 목업 데이터
// 벤더는 수거 운송장 등록 → 수거 완료 처리 → 재고 수동 복구 순으로 물류를 처리하며,
// 귀책 판정에 이의가 있으면 의견(이의제기)을 등록할 수 있다.

import { type ClaimHistoryEntry } from '@/claim/shared/types'

export type ReturnStatus = 'REQUESTED' | 'PICKUP_REGISTERED' | 'PICKUP_DONE' | 'STOCK_RESTORED' | 'COMPLETED'
export type BlameType = 'CUSTOMER' | 'VENDOR' | 'PLATFORM' | 'PENDING'

export const RETURN_STATUS_LABEL: Record<ReturnStatus, string> = {
  REQUESTED: '접수',
  PICKUP_REGISTERED: '수거 등록',
  PICKUP_DONE: '수거 완료',
  STOCK_RESTORED: '재고 복구',
  COMPLETED: '완료',
}

export const BLAME_TYPE_LABEL: Record<BlameType, string> = {
  CUSTOMER: '고객 귀책',
  VENDOR: '판매자 귀책',
  PLATFORM: '플랫폼 귀책',
  PENDING: '귀책 판정중',
}

export interface ReturnClaim {
  claim_no: string
  platform_order_no: string
  product_name: string
  sku_option: string
  customer_name: string
  refund_amount: number
  reason: string
  blame_type: BlameType
  status: ReturnStatus
  pickup_company: string | null
  pickup_tracking_no: string | null
  vendor_opinion: string | null
  history: ClaimHistoryEntry[]
  created_at: string
}

export const MOCK_RETURN_CLAIMS: ReturnClaim[] = [
  {
    claim_no: 'CLM-20260620-00021', platform_order_no: 'ORD-20260618-00081', product_name: '나이키 페가수스 41', sku_option: '블랙 / 260',
    customer_name: '김**', refund_amount: 152000, reason: '사이즈가 맞지 않음', blame_type: 'CUSTOMER', status: 'COMPLETED',
    pickup_company: 'CJ대한통운', pickup_tracking_no: '651234567890', vendor_opinion: null,
    history: [
      { at: '2026.06.20 09:10', action: '반품 접수' },
      { at: '2026.06.20 15:22', action: '수거 운송장 등록', memo: 'CJ대한통운 / 651234567890' },
      { at: '2026.06.21 11:05', action: '수거 완료 처리' },
      { at: '2026.06.21 16:40', action: '재고 수동 복구' },
      { at: '2026.06.22 10:00', action: '환불 완료' },
    ],
    created_at: '2026.06.20 09:10',
  },
  {
    claim_no: 'CLM-20260627-00014', platform_order_no: 'ORD-20260625-00047', product_name: '나이키 보메로 18', sku_option: '화이트 / 255',
    customer_name: '이**', refund_amount: 189000, reason: '제품 불량 (밑창 마감 불량)', blame_type: 'VENDOR', status: 'REQUESTED',
    pickup_company: null, pickup_tracking_no: null, vendor_opinion: null,
    history: [
      { at: '2026.06.27 13:44', action: '반품 접수' },
    ],
    created_at: '2026.06.27 13:44',
  },
  {
    claim_no: 'CLM-20260628-00006', platform_order_no: 'ORD-20260626-00030', product_name: '나이키 드라이핏 ADV 러닝 티셔츠', sku_option: '네이비 / L',
    customer_name: '박**', refund_amount: 59000, reason: '색상이 사진과 다름', blame_type: 'PENDING', status: 'PICKUP_REGISTERED',
    pickup_company: '한진택배', pickup_tracking_no: '412345678901', vendor_opinion: null,
    history: [
      { at: '2026.06.28 08:30', action: '반품 접수' },
      { at: '2026.06.28 17:12', action: '수거 운송장 등록', memo: '한진택배 / 412345678901' },
    ],
    created_at: '2026.06.28 08:30',
  },
  {
    claim_no: 'CLM-20260629-00019', platform_order_no: 'ORD-20260627-00058', product_name: '나이키 에어 줌 스트럭쳐 25', sku_option: '그레이 / 270',
    customer_name: '최**', refund_amount: 159000, reason: '단순 변심', blame_type: 'CUSTOMER', status: 'PICKUP_DONE',
    pickup_company: '롯데택배', pickup_tracking_no: '223456789012', vendor_opinion: null,
    history: [
      { at: '2026.06.29 10:02', action: '반품 접수' },
      { at: '2026.06.29 14:20', action: '수거 운송장 등록', memo: '롯데택배 / 223456789012' },
      { at: '2026.06.30 09:55', action: '수거 완료 처리' },
    ],
    created_at: '2026.06.29 10:02',
  },
  {
    claim_no: 'CLM-20260630-00008', platform_order_no: 'ORD-20260629-00072', product_name: '나이키 런닝 캡 드라이핏', sku_option: '블랙 / FREE',
    customer_name: '정**', refund_amount: 35000, reason: '수령 후 파손 발견', blame_type: 'PLATFORM', status: 'STOCK_RESTORED',
    pickup_company: '우체국택배', pickup_tracking_no: '334455667788', vendor_opinion: null,
    history: [
      { at: '2026.06.30 11:15', action: '반품 접수' },
      { at: '2026.06.30 18:02', action: '수거 운송장 등록', memo: '우체국택배 / 334455667788' },
      { at: '2026.07.01 10:30', action: '수거 완료 처리' },
      { at: '2026.07.01 15:48', action: '재고 수동 복구' },
    ],
    created_at: '2026.06.30 11:15',
  },
  {
    claim_no: 'CLM-20260701-00011', platform_order_no: 'ORD-20260630-00040', product_name: '나이키 인피니티 런 4', sku_option: '레드 / 265',
    customer_name: '한**', refund_amount: 199000, reason: '착화감이 설명과 다름', blame_type: 'PENDING', status: 'REQUESTED',
    pickup_company: null, pickup_tracking_no: null, vendor_opinion: '해당 제품은 사이즈 가이드에 명확히 안내되어 있어 판매자 귀책이 아니라고 판단됩니다.',
    history: [
      { at: '2026.07.01 09:20', action: '반품 접수' },
      { at: '2026.07.01 09:55', action: '이의제기 등록', memo: '해당 제품은 사이즈 가이드에 명확히 안내되어 있어 판매자 귀책이 아니라고 판단됩니다.' },
    ],
    created_at: '2026.07.01 09:20',
  },
  {
    claim_no: 'CLM-20260702-00003', platform_order_no: 'ORD-20260701-00015', product_name: '나이키 윈드러너 재킷', sku_option: '블랙 / M',
    customer_name: '오**', refund_amount: 149000, reason: '지퍼 불량', blame_type: 'VENDOR', status: 'PICKUP_REGISTERED',
    pickup_company: 'CJ대한통운', pickup_tracking_no: '778899001122', vendor_opinion: null,
    history: [
      { at: '2026.07.02 08:40', action: '반품 접수' },
      { at: '2026.07.02 13:33', action: '수거 운송장 등록', memo: 'CJ대한통운 / 778899001122' },
    ],
    created_at: '2026.07.02 08:40',
  },
  {
    claim_no: 'CLM-20260703-00017', platform_order_no: 'ORD-20260702-00062', product_name: '나이키 줌X 베이퍼플라이 NEXT% 3', sku_option: '화이트 / 275',
    customer_name: '장**', refund_amount: 329000, reason: '오배송 (다른 사이즈 수령)', blame_type: 'PLATFORM', status: 'REQUESTED',
    pickup_company: null, pickup_tracking_no: null, vendor_opinion: null,
    history: [
      { at: '2026.07.03 15:05', action: '반품 접수' },
    ],
    created_at: '2026.07.03 15:05',
  },
]
