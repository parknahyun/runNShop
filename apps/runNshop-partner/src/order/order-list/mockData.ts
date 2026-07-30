export type OrderStatus = 'PAYMENT_COMPLETED' | 'PREPARING' | 'IN_DELIVERY' | 'DELIVERED' | 'CONFIRMED' | 'CANCELLED'

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PAYMENT_COMPLETED: '결제완료',
  PREPARING: '준비중',
  IN_DELIVERY: '배송중',
  DELIVERED: '배송완료',
  CONFIRMED: '구매확정',
  CANCELLED: '취소',
}

export interface OrderHistoryEntry {
  at: string
  action: string
  memo?: string
}

export interface Order {
  order_id: string
  platform_order_no: string
  product_name: string
  customer_name: string
  status: OrderStatus
  amount: number
  quantity: number
  order_date: string
  history: OrderHistoryEntry[]
}

export const MOCK_ORDERS: Order[] = [
  {
    order_id: 'OD-9001', platform_order_no: 'ORD-20260626-001', product_name: '나이키 페가수스 41',
    customer_name: '홍*동', status: 'PAYMENT_COMPLETED', amount: 152000, quantity: 1, order_date: '2026.06.26 09:15',
    history: [{ at: '2026.06.26 09:15', action: '주문 접수', memo: '결제 완료' }],
  },
  {
    order_id: 'OD-9002', platform_order_no: 'ORD-20260626-002', product_name: '나이키 보메로 18',
    customer_name: '김*수', status: 'PAYMENT_COMPLETED', amount: 189000, quantity: 1, order_date: '2026.06.26 10:02',
    history: [{ at: '2026.06.26 10:02', action: '주문 접수', memo: '결제 완료' }],
  },
  {
    order_id: 'OD-9003', platform_order_no: 'ORD-20260625-014', product_name: '나이키 드라이핏 ADV 러닝 티셔츠',
    customer_name: '이*영', status: 'PREPARING', amount: 118000, quantity: 2, order_date: '2026.06.25 13:40',
    history: [
      { at: '2026.06.25 13:40', action: '주문 접수', memo: '결제 완료' },
      { at: '2026.06.25 15:10', action: '출고 처리', memo: '판매자 출고 처리' },
    ],
  },
  {
    order_id: 'OD-9004', platform_order_no: 'ORD-20260624-031', product_name: '나이키 런닝 캡 드라이핏',
    customer_name: '박*진', status: 'IN_DELIVERY', amount: 35000, quantity: 1, order_date: '2026.06.24 11:05',
    history: [
      { at: '2026.06.24 11:05', action: '주문 접수', memo: '결제 완료' },
      { at: '2026.06.24 16:30', action: '출고 처리', memo: '판매자 출고 처리' },
      { at: '2026.06.25 08:00', action: '배송 시작', memo: 'CJ대한통운 123456789012' },
    ],
  },
  {
    order_id: 'OD-9005', platform_order_no: 'ORD-20260622-009', product_name: '나이키 에어 줌 스트럭쳐 25',
    customer_name: '최*민', status: 'DELIVERED', amount: 159000, quantity: 1, order_date: '2026.06.22 09:50',
    history: [
      { at: '2026.06.22 09:50', action: '주문 접수', memo: '결제 완료' },
      { at: '2026.06.22 14:00', action: '출고 처리', memo: '판매자 출고 처리' },
      { at: '2026.06.23 09:20', action: '배송 시작', memo: '한진택배 456789012345' },
      { at: '2026.06.24 18:40', action: '배송 완료', memo: '수령 확인' },
    ],
  },
  {
    order_id: 'OD-9006', platform_order_no: 'ORD-20260618-002', product_name: '나이키 페가수스 41',
    customer_name: '정*훈', status: 'CONFIRMED', amount: 152000, quantity: 1, order_date: '2026.06.18 10:30',
    history: [
      { at: '2026.06.18 10:30', action: '주문 접수', memo: '결제 완료' },
      { at: '2026.06.18 15:00', action: '출고 처리', memo: '판매자 출고 처리' },
      { at: '2026.06.19 09:10', action: '배송 시작', memo: '롯데택배 789012345678' },
      { at: '2026.06.20 17:20', action: '배송 완료', memo: '수령 확인' },
      { at: '2026.06.23 00:00', action: '구매 확정', memo: '자동 구매확정' },
    ],
  },
  {
    order_id: 'OD-9007', platform_order_no: 'ORD-20260620-021', product_name: '나이키 윈드러너 재킷',
    customer_name: '서*아', status: 'CANCELLED', amount: 149000, quantity: 1, order_date: '2026.06.20 15:30',
    history: [
      { at: '2026.06.20 15:30', action: '주문 접수', memo: '결제 완료' },
      { at: '2026.06.20 18:00', action: '주문 취소', memo: '고객 변심' },
    ],
  },
  {
    order_id: 'OD-9008', platform_order_no: 'ORD-20260626-003', product_name: '나이키 드라이핏 ADV 러닝 티셔츠',
    customer_name: '윤*서', status: 'PAYMENT_COMPLETED', amount: 59000, quantity: 1, order_date: '2026.06.26 11:22',
    history: [{ at: '2026.06.26 11:22', action: '주문 접수', memo: '결제 완료' }],
  },
  {
    order_id: 'OD-9009', platform_order_no: 'ORD-20260623-018', product_name: '나이키 보메로 18',
    customer_name: '장*우', status: 'IN_DELIVERY', amount: 189000, quantity: 1, order_date: '2026.06.23 14:15',
    history: [
      { at: '2026.06.23 14:15', action: '주문 접수', memo: '결제 완료' },
      { at: '2026.06.23 17:00', action: '출고 처리', memo: '판매자 출고 처리' },
      { at: '2026.06.24 09:30', action: '배송 시작', memo: '우체국택배 321654987012' },
    ],
  },
  {
    order_id: 'OD-9010', platform_order_no: 'ORD-20260621-006', product_name: '나이키 런닝 캡 드라이핏',
    customer_name: '한*빈', status: 'DELIVERED', amount: 70000, quantity: 2, order_date: '2026.06.21 09:00',
    history: [
      { at: '2026.06.21 09:00', action: '주문 접수', memo: '결제 완료' },
      { at: '2026.06.21 13:00', action: '출고 처리', memo: '판매자 출고 처리' },
      { at: '2026.06.22 10:00', action: '배송 시작', memo: 'CJ대한통운 111222333444' },
      { at: '2026.06.23 16:00', action: '배송 완료', memo: '수령 확인' },
    ],
  },
]
