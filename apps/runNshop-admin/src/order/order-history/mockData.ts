export type OrderStatus = 'ORDER_RECEIVED' | 'PAYMENT_COMPLETED' | 'PREPARING' | 'IN_DELIVERY' | 'DELIVERED' | 'CONFIRMED' | 'CANCELLED'

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  ORDER_RECEIVED: '접수',
  PAYMENT_COMPLETED: '결제완료',
  PREPARING: '준비중',
  IN_DELIVERY: '배송중',
  DELIVERED: '배송완료',
  CONFIRMED: '구매확정',
  CANCELLED: '취소',
}

export interface Order {
  orderId: string
  platformOrderNo: string
  productName: string
  customer: string
  status: OrderStatus
  amount: number
  orderDate: string
  vendorName: string
}

export interface OrderFilter {
  keyword: string
  status: OrderStatus | 'ALL'
  from: string
  to: string
}

// ---------------------------------------------------------------------------
// 주문 상세 (GET /api/admin/v1/orders/{orderId}) 응답 타입
// OrderDetail.tsx와 tabs/*.tsx가 공유한다.
// ---------------------------------------------------------------------------

export interface OrderItem {
  productName: string
  optionName: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export interface OrderPayment {
  method: string
  pgProvider: string
  transactionId: string
  paidAt: string
}

export interface OrderShipping {
  recipientName: string
  phone: string
  address: string
  carrier: string
  trackingNumber: string
}

export interface OrderHistoryEntry {
  fromStatus: OrderStatus
  toStatus: OrderStatus
  changedBy: string
  createdAt: string
}

export interface OrderClaim {
  claimId: string
  claimType: string
  status: string
  refundAmount: number
  extraShippingFee: number
  extraShippingFeeStatus: string
  receivedAt: string
}

export interface OrderInquiry {
  inquiryId: string
  type: string
  status: string
  writer: string
  createdAt: string
}

export interface OrderLog {
  at: string
  event: string
  detail: string
}

export interface OrderDetailData {
  orderId: string
  platformOrderNo: string
  status: OrderStatus
  customer: string
  vendorName: string
  amount: number
  orderDate: string
  items: OrderItem[]
  payment: OrderPayment
  shipping: OrderShipping
  history: OrderHistoryEntry[]
  claims: OrderClaim[]
  inquiries: OrderInquiry[]
  logs: OrderLog[]
}
