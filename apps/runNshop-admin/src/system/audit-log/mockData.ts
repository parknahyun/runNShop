// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'STATUS_CHANGE'
export type ActorType   = 'SYSTEM' | 'MEMBER' | 'OPERATOR' | 'VENDOR'

// adt_audit_log — 도메인 엔티티 변경 이력을 before/after 값과 함께 남기는 감사 로그
export interface AuditLog {
  logId: string
  traceId: string
  domain: string
  eventType: string
  aggregateType: string
  aggregateId: string
  action: AuditAction
  beforeValue: Record<string, unknown> | null
  afterValue: Record<string, unknown> | null
  actorType: ActorType
  actorId: string | null
  actorIp: string | null
  createdAt: string
}

export interface AuditLogFilter {
  keyword: string
  action: AuditAction | 'ALL'
  actorType: ActorType | 'ALL'
  from: string
  to: string
}

// ---------------------------------------------------------------------------
// Label maps
// ---------------------------------------------------------------------------

export const AUDIT_ACTION_LABEL: Record<AuditAction, string> = {
  CREATE:        '생성',
  UPDATE:        '수정',
  DELETE:        '삭제',
  STATUS_CHANGE: '상태변경',
}

export const ACTOR_TYPE_LABEL: Record<ActorType, string> = {
  SYSTEM:   '시스템',
  MEMBER:   '회원',
  OPERATOR: '운영자',
  VENDOR:   '입점사',
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    logId: 'AUD-000001', traceId: 'TRC-20260706-0002', domain: 'Claim', eventType: 'CLAIM_STATUS_CHANGED',
    aggregateType: 'Claim', aggregateId: 'CLM-20260706-002', action: 'STATUS_CHANGE',
    beforeValue: { status: 'PROCESSING', blameType: 'PENDING' },
    afterValue: { status: 'COMPLETED', blameType: 'VENDOR' },
    actorType: 'OPERATOR', actorId: 'CS-박도윤', actorIp: '10.20.4.15',
    createdAt: '2026-07-06 10:03:12',
  },
  {
    logId: 'AUD-000002', traceId: 'TRC-20260706-0001', domain: 'Order', eventType: 'ORDER_CREATED',
    aggregateType: 'Order', aggregateId: 'ORD-20260706-014', action: 'CREATE',
    beforeValue: null,
    afterValue: { orderStatus: 'CREATED', totalAmount: 219000, itemCount: 1 },
    actorType: 'MEMBER', actorId: 'MBR-330281', actorIp: '211.44.12.9',
    createdAt: '2026-07-06 09:12:04',
  },
  {
    logId: 'AUD-000003', traceId: 'TRC-20260706-0006', domain: 'Member', eventType: 'MEMBER_GRADE_CHANGED',
    aggregateType: 'Member', aggregateId: 'MBR-330281', action: 'UPDATE',
    beforeValue: { grade: 'RUNNER' },
    afterValue: { grade: 'PACER' },
    actorType: 'SYSTEM', actorId: null, actorIp: null,
    createdAt: '2026-07-06 12:00:05',
  },
  {
    logId: 'AUD-000004', traceId: 'TRC-20260704-0022', domain: 'Product', eventType: 'PRODUCT_APPROVAL_REJECTED',
    aggregateType: 'Product', aggregateId: 'PRD-501923', action: 'STATUS_CHANGE',
    beforeValue: { approvalStatus: 'PENDING' },
    afterValue: { approvalStatus: 'REJECTED', rejectReason: '필수 인증정보 누락' },
    actorType: 'OPERATOR', actorId: 'prod.park', actorIp: '10.20.4.31',
    createdAt: '2026-07-04 15:20:08',
  },
  {
    logId: 'AUD-000005', traceId: 'TRC-20260702-0011', domain: 'OperatorApplication', eventType: 'OPERATOR_APPROVED',
    aggregateType: 'OperatorApplication', aggregateId: 'OPA-003', action: 'STATUS_CHANGE',
    beforeValue: { status: 'APPLIED' },
    afterValue: { status: 'APPROVED', reviewedBy: 'admin.kim' },
    actorType: 'OPERATOR', actorId: 'admin.kim', actorIp: '10.20.4.2',
    createdAt: '2026-07-02 11:00:05',
  },
  {
    logId: 'AUD-000006', traceId: 'TRC-20260701-0009', domain: 'Inventory', eventType: 'INVENTORY_ADJUSTED',
    aggregateType: 'Inventory', aggregateId: 'SKU-77102', action: 'DELETE',
    beforeValue: { skuId: 'SKU-77102', qty: 12, status: 'ACTIVE' },
    afterValue: null,
    actorType: 'OPERATOR', actorId: 'ops.lee', actorIp: '10.20.4.18',
    createdAt: '2026-07-01 17:22:00',
  },
  {
    logId: 'AUD-000007', traceId: 'TRC-20260629-0005', domain: 'Promotion', eventType: 'COUPON_ISSUED',
    aggregateType: 'Coupon', aggregateId: 'CPN-2026-0071', action: 'CREATE',
    beforeValue: null,
    afterValue: { couponName: '7월 신규가입 쿠폰', discountType: 'RATE', discountValue: 10 },
    actorType: 'OPERATOR', actorId: 'admin.kim', actorIp: '10.20.4.2',
    createdAt: '2026-06-29 09:40:00',
  },
  {
    logId: 'AUD-000008', traceId: 'TRC-20260625-0018', domain: 'Settlement', eventType: 'SETTLEMENT_CORRECTED',
    aggregateType: 'Settlement', aggregateId: 'STL-20260624-041', action: 'UPDATE',
    beforeValue: { settlementAmount: 5823000, status: 'FAILED' },
    afterValue: { settlementAmount: 5823000, status: 'COMPLETED' },
    actorType: 'OPERATOR', actorId: 'admin.kim', actorIp: '10.20.4.2',
    createdAt: '2026-06-25 14:00:12',
  },
  {
    logId: 'AUD-000009', traceId: 'TRC-20260620-0033', domain: 'Vendor', eventType: 'VENDOR_CONTRACT_TERMINATED',
    aggregateType: 'Vendor', aggregateId: 'VDR-00042', action: 'STATUS_CHANGE',
    beforeValue: { contractStatus: 'ACTIVE' },
    afterValue: { contractStatus: 'TERMINATED', reason: '정산 지연 누적' },
    actorType: 'OPERATOR', actorId: 'admin.kim', actorIp: '10.20.4.2',
    createdAt: '2026-06-20 16:10:00',
  },
  {
    logId: 'AUD-000010', traceId: 'TRC-20260618-0002', domain: 'Vendor', eventType: 'VENDOR_PRICE_UPDATED',
    aggregateType: 'Product', aggregateId: 'PRD-501877', action: 'UPDATE',
    beforeValue: { priceSale: 219000 },
    afterValue: { priceSale: 199000 },
    actorType: 'VENDOR', actorId: 'vendor.newbalance', actorIp: '203.128.4.71',
    createdAt: '2026-06-18 11:05:00',
  },
]

// ---------------------------------------------------------------------------
// Filter
// ---------------------------------------------------------------------------

export function filterAuditLogs(items: AuditLog[], filter: AuditLogFilter): AuditLog[] {
  return items.filter((l) => {
    if (filter.keyword.trim()) {
      const kw = filter.keyword.trim().toLowerCase()
      if (
        !l.domain.toLowerCase().includes(kw) &&
        !l.eventType.toLowerCase().includes(kw) &&
        !l.aggregateId.toLowerCase().includes(kw)
      ) return false
    }
    if (filter.action !== 'ALL' && l.action !== filter.action) return false
    if (filter.actorType !== 'ALL' && l.actorType !== filter.actorType) return false
    if (filter.from) {
      const day = l.createdAt.slice(0, 10)
      if (day < filter.from) return false
    }
    if (filter.to) {
      const day = l.createdAt.slice(0, 10)
      if (day > filter.to) return false
    }
    return true
  })
}
