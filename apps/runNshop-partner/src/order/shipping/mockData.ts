export type ShippingStatus = 'PREPARING' | 'IN_DELIVERY' | 'DELIVERED'

export const SHIPPING_STATUS_LABEL: Record<ShippingStatus, string> = {
  PREPARING: '송장 미입력',
  IN_DELIVERY: '배송중',
  DELIVERED: '배송완료',
}

export const DELIVERY_COMPANIES = ['CJ대한통운', '한진택배', '롯데택배', '우체국택배', '로젠택배']

export interface ShippingItem {
  order_id: string
  platform_order_no: string
  product_name: string
  customer_name: string
  status: ShippingStatus
  delivery_company: string | null
  tracking_no: string | null
  shipped_at: string | null
}

export const MOCK_SHIPPING: ShippingItem[] = [
  { order_id: 'OD-9003', platform_order_no: 'ORD-20260625-014', product_name: '나이키 드라이핏 ADV 러닝 티셔츠', customer_name: '이*영', status: 'PREPARING', delivery_company: null, tracking_no: null, shipped_at: null },
  { order_id: 'OD-9011', platform_order_no: 'ORD-20260626-004', product_name: '나이키 페가수스 41', customer_name: '문*경', status: 'PREPARING', delivery_company: null, tracking_no: null, shipped_at: null },
  { order_id: 'OD-9012', platform_order_no: 'ORD-20260626-005', product_name: '나이키 보메로 18', customer_name: '오*석', status: 'PREPARING', delivery_company: null, tracking_no: null, shipped_at: null },
  { order_id: 'OD-9004', platform_order_no: 'ORD-20260624-031', product_name: '나이키 런닝 캡 드라이핏', customer_name: '박*진', status: 'IN_DELIVERY', delivery_company: 'CJ대한통운', tracking_no: '123456789012', shipped_at: '2026.06.25 08:00' },
  { order_id: 'OD-9009', platform_order_no: 'ORD-20260623-018', product_name: '나이키 보메로 18', customer_name: '장*우', status: 'IN_DELIVERY', delivery_company: '우체국택배', tracking_no: '321654987012', shipped_at: '2026.06.24 09:30' },
  { order_id: 'OD-9005', platform_order_no: 'ORD-20260622-009', product_name: '나이키 에어 줌 스트럭쳐 25', customer_name: '최*민', status: 'DELIVERED', delivery_company: '한진택배', tracking_no: '456789012345', shipped_at: '2026.06.23 09:20' },
  { order_id: 'OD-9010', platform_order_no: 'ORD-20260621-006', product_name: '나이키 런닝 캡 드라이핏', customer_name: '한*빈', status: 'DELIVERED', delivery_company: 'CJ대한통운', tracking_no: '111222333444', shipped_at: '2026.06.22 10:00' },
  { order_id: 'OD-9006', platform_order_no: 'ORD-20260618-002', product_name: '나이키 페가수스 41', customer_name: '정*훈', status: 'DELIVERED', delivery_company: '롯데택배', tracking_no: '789012345678', shipped_at: '2026.06.19 09:10' },
]
