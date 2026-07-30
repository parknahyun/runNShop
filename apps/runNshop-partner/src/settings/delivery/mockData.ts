export interface DeliverySettings {
  delivery_company: string // 배송 택배사
  free_shipping_min: number // 무료배송 최소금액
  base_shipping_fee: number // 기본배송비
  return_shipping_fee: number // 반품배송비 (customer-fault case)
  jeju_extra_fee: number // 제주/도서산간 추가배송비
}

export const DELIVERY_COMPANY_OPTIONS = ['CJ대한통운', '한진택배', '롯데택배', '로젠택배']

export const MOCK_DELIVERY_SETTINGS: DeliverySettings = {
  delivery_company: 'CJ대한통운',
  free_shipping_min: 50000,
  base_shipping_fee: 3000,
  return_shipping_fee: 5000,
  jeju_extra_fee: 3000,
}
