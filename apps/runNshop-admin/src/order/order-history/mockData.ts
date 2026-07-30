export type OrderStatus = 'PAYMENT_COMPLETED' | 'PREPARING' | 'IN_DELIVERY' | 'DELIVERED' | 'CONFIRMED' | 'CANCELLED'

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
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

export const MOCK_ORDERS: Order[] = [
  { orderId: '1', platformOrderNo: 'ORD-20260626-001', productName: '나이키 페가수스 41', customer: '홍*동', status: 'PAYMENT_COMPLETED', amount: 152000, orderDate: '2026.06.26 09:15', vendorName: '나이키코리아' },
  { orderId: '2', platformOrderNo: 'ORD-20260626-002', productName: '아식스 젤카야노 31', customer: '김*수', status: 'PREPARING', amount: 199000, orderDate: '2026.06.26 10:30', vendorName: '아식스코리아' },
  { orderId: '3', platformOrderNo: 'ORD-20260625-015', productName: '호카 클리프턴 9', customer: '이*미', status: 'IN_DELIVERY', amount: 169000, orderDate: '2026.06.25 14:22', vendorName: '호카코리아' },
  { orderId: '4', platformOrderNo: 'ORD-20260625-014', productName: '뉴발란스 퓨얼셀 SC', customer: '박*희', status: 'CANCELLED', amount: 219000, orderDate: '2026.06.25 11:45', vendorName: '뉴발란스' },
  { orderId: '5', platformOrderNo: 'ORD-20260624-042', productName: '온 클라우드서퍼 2', customer: '최*준', status: 'CONFIRMED', amount: 209000, orderDate: '2026.06.24 16:00', vendorName: '온코리아' },
  { orderId: '6', platformOrderNo: 'ORD-20260624-041', productName: '아디다스 보스턴 13', customer: '정*영', status: 'DELIVERED', amount: 189000, orderDate: '2026.06.24 13:20', vendorName: '아디다스코리아' },
  { orderId: '7', platformOrderNo: 'ORD-20260623-033', productName: '살로몬 S/LAB 울트라 4', customer: '강*현', status: 'CONFIRMED', amount: 349000, orderDate: '2026.06.23 09:45', vendorName: '살로몬코리아' },
  { orderId: '8', platformOrderNo: 'ORD-20260623-032', productName: '브룩스 글리세린 21', customer: '윤*서', status: 'DELIVERED', amount: 229000, orderDate: '2026.06.23 08:10', vendorName: '브룩스코리아' },
  { orderId: '9', platformOrderNo: 'ORD-20260622-028', productName: '미즈노 웨이브 라이더 28', customer: '한*우', status: 'CONFIRMED', amount: 179000, orderDate: '2026.06.22 17:30', vendorName: '미즈노코리아' },
  { orderId: '10', platformOrderNo: 'ORD-20260622-027', productName: '나이키 알파플라이 3', customer: '서*아', status: 'IN_DELIVERY', amount: 379000, orderDate: '2026.06.22 15:00', vendorName: '나이키코리아' },
  { orderId: '11', platformOrderNo: 'ORD-20260621-019', productName: '아식스 매직스피드 4', customer: '임*진', status: 'PREPARING', amount: 249000, orderDate: '2026.06.21 11:45', vendorName: '아식스코리아' },
  { orderId: '12', platformOrderNo: 'ORD-20260621-018', productName: '호카 로켓 X3', customer: '조*민', status: 'PAYMENT_COMPLETED', amount: 299000, orderDate: '2026.06.21 09:20', vendorName: '호카코리아' },
]

// ---------------------------------------------------------------------------
// Filter
// ---------------------------------------------------------------------------

export function filterOrders(items: Order[], filter: OrderFilter): Order[] {
  return items.filter((order) => {
    if (filter.keyword.trim()) {
      const kw = filter.keyword.trim().toLowerCase()
      if (
        !order.platformOrderNo.toLowerCase().includes(kw) &&
        !order.productName.toLowerCase().includes(kw) &&
        !order.customer.toLowerCase().includes(kw)
      ) return false
    }
    if (filter.status !== 'ALL' && order.status !== filter.status) return false
    // 날짜 필터: orderDate 형식은 "2026.06.26 09:15"
    if (filter.from) {
      const orderDay = order.orderDate.slice(0, 10).replace(/\./g, '-')
      if (orderDay < filter.from) return false
    }
    if (filter.to) {
      const orderDay = order.orderDate.slice(0, 10).replace(/\./g, '-')
      if (orderDay > filter.to) return false
    }
    return true
  })
}
