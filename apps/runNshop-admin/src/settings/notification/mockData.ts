// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ReceiverType = 'CUSTOMER' | 'VENDOR' | 'OPERATOR'
export type NotificationChannel = 'KAKAO' | 'SMS' | 'EMAIL'
export type TemplateStatus = 'ACTIVE' | 'INACTIVE'

export interface NotificationTemplate {
  templateId: string
  templateCode: string
  templateName: string
  eventType: string
  receiverType: ReceiverType
  channel: NotificationChannel
  title: string | null
  body: string
  isRequired: boolean
  status: TemplateStatus
  createdAt: string
  updatedAt: string
}

export interface NotificationTemplateFilter {
  keyword: string
  receiverType: ReceiverType | 'ALL'
  channel: NotificationChannel | 'ALL'
  status: TemplateStatus | 'ALL'
}

// ---------------------------------------------------------------------------
// Label maps
// ---------------------------------------------------------------------------

export const RECEIVER_TYPE_LABEL: Record<ReceiverType, string> = {
  CUSTOMER: '고객',
  VENDOR:   '입점사',
  OPERATOR: '운영자',
}

export const CHANNEL_LABEL: Record<NotificationChannel, string> = {
  KAKAO: '카카오톡',
  SMS:   'SMS',
  EMAIL: '이메일',
}

export const TEMPLATE_STATUS_LABEL: Record<TemplateStatus, string> = {
  ACTIVE:   '활성',
  INACTIVE: '비활성',
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

export const MOCK_NOTIFICATION_TEMPLATES: NotificationTemplate[] = [
  {
    templateId: 'NTF-001', templateCode: 'ORDER_CONFIRMED_KAKAO', templateName: '주문 확인 안내',
    eventType: 'ORDER_CONFIRMED', receiverType: 'CUSTOMER', channel: 'KAKAO',
    title: null, body: '[runNshop] 주문이 확인되었습니다. 주문번호: #{orderNo}',
    isRequired: true, status: 'ACTIVE',
    createdAt: '2025-11-01 09:00:00', updatedAt: '2025-11-01 09:00:00',
  },
  {
    templateId: 'NTF-002', templateCode: 'SHIPPING_STARTED_SMS', templateName: '배송 시작 안내',
    eventType: 'SHIPPING_STARTED', receiverType: 'CUSTOMER', channel: 'SMS',
    title: null, body: '[runNshop] 상품이 발송되었습니다. 송장번호: #{trackingNo}',
    isRequired: true, status: 'ACTIVE',
    createdAt: '2025-11-01 09:10:00', updatedAt: '2025-11-01 09:10:00',
  },
  {
    templateId: 'NTF-003', templateCode: 'CLAIM_RECEIVED_KAKAO', templateName: '클레임 접수 안내',
    eventType: 'CLAIM_RECEIVED', receiverType: 'CUSTOMER', channel: 'KAKAO',
    title: null, body: '[runNshop] 클레임 접수가 완료되었습니다. 처리까지 1~2일 소요됩니다.',
    isRequired: true, status: 'ACTIVE',
    createdAt: '2025-11-02 10:00:00', updatedAt: '2026-01-15 11:20:00',
  },
  {
    templateId: 'NTF-004', templateCode: 'VENDOR_SETTLEMENT_EMAIL', templateName: '정산 완료 안내',
    eventType: 'VENDOR_SETTLEMENT_COMPLETED', receiverType: 'VENDOR', channel: 'EMAIL',
    title: '[runNshop] 정산 완료 안내', body: '#{settlementMonth}월 정산이 완료되었습니다. 정산 내역을 확인해 주세요.',
    isRequired: true, status: 'ACTIVE',
    createdAt: '2025-12-01 09:00:00', updatedAt: '2025-12-01 09:00:00',
  },
  {
    templateId: 'NTF-005', templateCode: 'COUPON_ISSUED_SMS', templateName: '쿠폰 발급 안내',
    eventType: 'COUPON_ISSUED', receiverType: 'CUSTOMER', channel: 'SMS',
    title: null, body: '[runNshop] 신규 쿠폰이 발급되었습니다. 마이페이지에서 확인해 보세요.',
    isRequired: false, status: 'ACTIVE',
    createdAt: '2026-01-10 09:00:00', updatedAt: '2026-01-10 09:00:00',
  },
  {
    templateId: 'NTF-006', templateCode: 'OPERATOR_ACCOUNT_SUSPENDED_EMAIL', templateName: '운영자 계정 정지 안내',
    eventType: 'OPERATOR_SUSPENDED', receiverType: 'OPERATOR', channel: 'EMAIL',
    title: '[runNshop 어드민] 계정 정지 안내', body: '운영자 계정이 정지되었습니다. 관리자에게 문의해 주세요.',
    isRequired: true, status: 'INACTIVE',
    createdAt: '2025-08-20 09:00:00', updatedAt: '2026-02-01 15:00:00',
  },
  {
    templateId: 'NTF-007', templateCode: 'EVENT_PRICE_STARTED_KAKAO', templateName: '기획전 시작 안내',
    eventType: 'EVENT_PRICE_STARTED', receiverType: 'CUSTOMER', channel: 'KAKAO',
    title: null, body: '[runNshop] 관심 상품이 포함된 기획전이 시작되었습니다!',
    isRequired: false, status: 'ACTIVE',
    createdAt: '2026-02-05 09:00:00', updatedAt: '2026-02-05 09:00:00',
  },
]

// ---------------------------------------------------------------------------
// Filter
// ---------------------------------------------------------------------------

export function filterNotificationTemplates(
  items: NotificationTemplate[], filter: NotificationTemplateFilter
): NotificationTemplate[] {
  return items.filter((t) => {
    if (filter.keyword.trim()) {
      const kw = filter.keyword.trim().toLowerCase()
      if (
        !t.templateCode.toLowerCase().includes(kw) &&
        !t.templateName.toLowerCase().includes(kw) &&
        !t.eventType.toLowerCase().includes(kw)
      ) return false
    }
    if (filter.receiverType !== 'ALL' && t.receiverType !== filter.receiverType) return false
    if (filter.channel !== 'ALL' && t.channel !== filter.channel) return false
    if (filter.status !== 'ALL' && t.status !== filter.status) return false
    return true
  })
}

// ---------------------------------------------------------------------------
// ID generator
// ---------------------------------------------------------------------------

export function nextTemplateId(items: NotificationTemplate[]): string {
  const max = items.reduce((acc, t) => {
    const n = parseInt(t.templateId.replace('NTF-', ''), 10)
    return isNaN(n) ? acc : Math.max(acc, n)
  }, 0)
  return `NTF-${String(max + 1).padStart(3, '0')}`
}
