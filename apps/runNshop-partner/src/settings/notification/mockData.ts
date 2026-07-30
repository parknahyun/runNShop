export interface NotificationPreference {
  event_type: string
  event_label: string
  is_required: boolean
  email_enabled: boolean
  sms_enabled: boolean
  push_enabled: boolean
}

export const MOCK_NOTIFICATION_PREFERENCES: NotificationPreference[] = [
  { event_type: 'ORDER_RECEIVED', event_label: '신규 주문 접수', is_required: true, email_enabled: true, sms_enabled: true, push_enabled: true },
  { event_type: 'CLAIM_RECEIVED', event_label: '클레임 접수', is_required: true, email_enabled: true, sms_enabled: true, push_enabled: true },
  { event_type: 'SETTLEMENT_CONFIRMED', event_label: '정산 확정', is_required: false, email_enabled: true, sms_enabled: false, push_enabled: true },
  { event_type: 'QNA_RECEIVED', event_label: 'QnA 등록', is_required: false, email_enabled: true, sms_enabled: false, push_enabled: false },
  { event_type: 'PRODUCT_APPROVED', event_label: '상품 승인', is_required: false, email_enabled: false, sms_enabled: false, push_enabled: true },
  { event_type: 'PRODUCT_REJECTED', event_label: '상품 반려', is_required: false, email_enabled: true, sms_enabled: false, push_enabled: true },
]
