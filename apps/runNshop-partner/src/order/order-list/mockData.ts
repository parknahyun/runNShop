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

export interface OrderHistoryEntry {
  at: string
  action: string
  memo?: string
}

export interface Order {
  orderId: string
  platformOrderNo: string
  productName: string
  customerName: string
  status: OrderStatus
  amount: number
  quantity: number
  orderDate: string
  history: OrderHistoryEntry[]
}
