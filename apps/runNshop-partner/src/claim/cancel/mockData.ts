// 취소 목록 (VND-030-001) 목업 데이터
// 취소는 배송 시작 전 플랫폼이 자동으로 처리하므로, 벤더는 조회만 가능하다 (액션 없음).

export type CancelStatus = 'REQUESTED' | 'COMPLETED'

export const CANCEL_STATUS_LABEL: Record<CancelStatus, string> = {
  REQUESTED: '접수',
  COMPLETED: '완료',
}

export interface CancelClaim {
  claim_no: string
  platform_order_no: string
  product_name: string
  customer_name: string
  refund_amount: number
  reason: string
  status: CancelStatus
  created_at: string
  completed_at: string | null
}

export const MOCK_CANCEL_CLAIMS: CancelClaim[] = [
  { claim_no: 'CLM-20260625-00001', platform_order_no: 'ORD-20260625-00012', product_name: '나이키 페가수스 41', customer_name: '김**', refund_amount: 152000, reason: '단순 변심', status: 'COMPLETED', created_at: '2026.06.25 09:12', completed_at: '2026.06.25 09:15' },
  { claim_no: 'CLM-20260626-00003', platform_order_no: 'ORD-20260626-00034', product_name: '나이키 보메로 18', customer_name: '이**', refund_amount: 189000, reason: '주문 실수', status: 'COMPLETED', created_at: '2026.06.26 11:40', completed_at: '2026.06.26 11:42' },
  { claim_no: 'CLM-20260627-00007', platform_order_no: 'ORD-20260627-00051', product_name: '나이키 드라이핏 ADV 러닝 티셔츠', customer_name: '박**', refund_amount: 59000, reason: '배송 지연', status: 'COMPLETED', created_at: '2026.06.27 14:05', completed_at: '2026.06.27 14:07' },
  { claim_no: 'CLM-20260628-00002', platform_order_no: 'ORD-20260628-00018', product_name: '나이키 에어 줌 스트럭쳐 25', customer_name: '최**', refund_amount: 159000, reason: '색상 재선택', status: 'REQUESTED', created_at: '2026.06.28 10:22', completed_at: null },
  { claim_no: 'CLM-20260629-00011', platform_order_no: 'ORD-20260629-00077', product_name: '나이키 런닝 캡 드라이핏', customer_name: '정**', refund_amount: 35000, reason: '단순 변심', status: 'REQUESTED', created_at: '2026.06.29 16:50', completed_at: null },
  { claim_no: 'CLM-20260630-00004', platform_order_no: 'ORD-20260630-00023', product_name: '나이키 인피니티 런 4', customer_name: '한**', refund_amount: 199000, reason: '중복 주문', status: 'COMPLETED', created_at: '2026.06.30 08:33', completed_at: '2026.06.30 08:36' },
  { claim_no: 'CLM-20260701-00006', platform_order_no: 'ORD-20260701-00042', product_name: '나이키 윈드러너 재킷', customer_name: '오**', refund_amount: 149000, reason: '사이즈 재선택', status: 'REQUESTED', created_at: '2026.07.01 13:10', completed_at: null },
  { claim_no: 'CLM-20260702-00009', platform_order_no: 'ORD-20260702-00060', product_name: '나이키 줌X 베이퍼플라이 NEXT% 3', customer_name: '장**', refund_amount: 329000, reason: '단순 변심', status: 'COMPLETED', created_at: '2026.07.02 09:47', completed_at: '2026.07.02 09:50' },
]
