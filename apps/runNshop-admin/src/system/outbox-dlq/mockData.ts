// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type OutboxStatus = 'PENDING' | 'PROCESSING' | 'PROCESSED' | 'FAILED'
export type DlqStatus    = 'PENDING' | 'RESOLVED' | 'IGNORED'

// cmn_outbox_event — 도메인 이벤트를 트랜잭션과 함께 적재하고 별도 릴레이가 발행하는 아웃박스
export interface OutboxEvent {
  eventId: string
  traceId: string
  aggregateType: string
  aggregateId: string
  eventType: string
  status: OutboxStatus
  retryCount: number
  errorMessage: string | null
  createdAt: string
  processedAt: string | null
}

// adt_dlq — 발행에 반복 실패한 이벤트가 격리되는 Dead Letter Queue
export interface DlqEntry {
  dlqId: string
  outboxEventId: string
  traceId: string
  eventType: string
  failReason: string
  retryCount: number
  status: DlqStatus
  resolvedBy: string | null
  resolvedAt: string | null
  resolveMemo: string | null
  createdAt: string
  updatedAt: string
}

export interface OutboxFilter {
  keyword: string
  status: OutboxStatus | 'ALL'
}

export interface DlqFilter {
  keyword: string
  status: DlqStatus | 'ALL'
}

// ---------------------------------------------------------------------------
// Label maps
// ---------------------------------------------------------------------------

export const OUTBOX_STATUS_LABEL: Record<OutboxStatus, string> = {
  PENDING:    '대기',
  PROCESSING: '처리중',
  PROCESSED:  '처리완료',
  FAILED:     '실패',
}

export const DLQ_STATUS_LABEL: Record<DlqStatus, string> = {
  PENDING:  '대기',
  RESOLVED: '해결',
  IGNORED:  '무시',
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

export const MOCK_OUTBOX_EVENTS: OutboxEvent[] = [
  {
    eventId: 'OBX-0001', traceId: 'TRC-20260706-0001', aggregateType: 'Order', aggregateId: 'ORD-20260706-014',
    eventType: 'ORDER_CREATED', status: 'PROCESSED', retryCount: 0, errorMessage: null,
    createdAt: '2026-07-06 09:12:03', processedAt: '2026-07-06 09:12:04',
  },
  {
    eventId: 'OBX-0002', traceId: 'TRC-20260706-0002', aggregateType: 'Claim', aggregateId: 'CLM-20260706-002',
    eventType: 'CLAIM_STATUS_CHANGED', status: 'PROCESSED', retryCount: 0, errorMessage: null,
    createdAt: '2026-07-06 10:03:11', processedAt: '2026-07-06 10:03:12',
  },
  {
    eventId: 'OBX-0003', traceId: 'TRC-20260706-0003', aggregateType: 'Inventory', aggregateId: 'SKU-88214',
    eventType: 'STOCK_RESERVED', status: 'PROCESSING', retryCount: 0, errorMessage: null,
    createdAt: '2026-07-06 11:40:55', processedAt: null,
  },
  {
    eventId: 'OBX-0004', traceId: 'TRC-20260706-0004', aggregateType: 'Settlement', aggregateId: 'STL-20260705-011',
    eventType: 'SETTLEMENT_COMPLETED', status: 'FAILED', retryCount: 3, errorMessage: 'MessageBrokerTimeoutException: 발행 응답 30s 초과',
    createdAt: '2026-07-05 01:05:20', processedAt: null,
  },
  {
    eventId: 'OBX-0005', traceId: 'TRC-20260706-0005', aggregateType: 'OperatorApplication', aggregateId: 'OPA-003',
    eventType: 'OPERATOR_APPROVED', status: 'PROCESSED', retryCount: 1, errorMessage: null,
    createdAt: '2026-07-02 11:00:05', processedAt: '2026-07-02 11:00:32',
  },
  {
    eventId: 'OBX-0006', traceId: 'TRC-20260706-0006', aggregateType: 'Member', aggregateId: 'MBR-330281',
    eventType: 'MEMBER_GRADE_CHANGED', status: 'PENDING', retryCount: 0, errorMessage: null,
    createdAt: '2026-07-06 12:00:01', processedAt: null,
  },
  {
    eventId: 'OBX-0007', traceId: 'TRC-20260706-0007', aggregateType: 'Product', aggregateId: 'PRD-501923',
    eventType: 'PRODUCT_APPROVAL_REJECTED', status: 'FAILED', retryCount: 5, errorMessage: 'SerializationException: payload 스키마 버전 불일치 (v2 → v1 컨슈머)',
    createdAt: '2026-07-04 15:22:40', processedAt: null,
  },
  {
    eventId: 'OBX-0008', traceId: 'TRC-20260706-0008', aggregateType: 'Coupon', aggregateId: 'CPN-2026-0071',
    eventType: 'COUPON_ISSUED', status: 'PROCESSED', retryCount: 0, errorMessage: null,
    createdAt: '2026-07-06 08:55:17', processedAt: '2026-07-06 08:55:18',
  },
]

export const MOCK_DLQ_ENTRIES: DlqEntry[] = [
  {
    dlqId: 'DLQ-0001', outboxEventId: 'OBX-0004', traceId: 'TRC-20260706-0004', eventType: 'SETTLEMENT_COMPLETED',
    failReason: 'MessageBrokerTimeoutException: 발행 응답 30s 초과 (최대 재시도 3회 초과)', retryCount: 3,
    status: 'PENDING', resolvedBy: null, resolvedAt: null, resolveMemo: null,
    createdAt: '2026-07-05 01:10:00', updatedAt: '2026-07-05 01:10:00',
  },
  {
    dlqId: 'DLQ-0002', outboxEventId: 'OBX-0007', traceId: 'TRC-20260706-0007', eventType: 'PRODUCT_APPROVAL_REJECTED',
    failReason: 'SerializationException: payload 스키마 버전 불일치 (v2 → v1 컨슈머, 최대 재시도 5회 초과)', retryCount: 5,
    status: 'PENDING', resolvedBy: null, resolvedAt: null, resolveMemo: null,
    createdAt: '2026-07-04 15:30:00', updatedAt: '2026-07-04 15:30:00',
  },
  {
    dlqId: 'DLQ-0003', outboxEventId: 'OBX-0101', traceId: 'TRC-20260703-0021', eventType: 'ORDER_CANCELLED',
    failReason: 'ConnectionRefusedException: 컨슈머 서비스 기동 전 발행 시도', retryCount: 4,
    status: 'RESOLVED', resolvedBy: 'ops.lee', resolvedAt: '2026-07-03 20:10:00', resolveMemo: '재시도 성공',
    createdAt: '2026-07-03 19:40:00', updatedAt: '2026-07-03 20:10:00',
  },
  {
    dlqId: 'DLQ-0004', outboxEventId: 'OBX-0088', traceId: 'TRC-20260701-0009', eventType: 'INVENTORY_ADJUSTED',
    failReason: 'DataIntegrityViolationException: 대상 SKU 삭제됨', retryCount: 3,
    status: 'IGNORED', resolvedBy: 'admin.kim', resolvedAt: '2026-07-01 18:00:00', resolveMemo: '단종 SKU 재고 조정 이벤트로 확인, 재처리 불필요하여 무시 처리',
    createdAt: '2026-07-01 17:20:00', updatedAt: '2026-07-01 18:00:00',
  },
  {
    dlqId: 'DLQ-0005', outboxEventId: 'OBX-0072', traceId: 'TRC-20260628-0033', eventType: 'CLAIM_STATUS_CHANGED',
    failReason: 'MessageBrokerTimeoutException: 브로커 연결 지연', retryCount: 3,
    status: 'PENDING', resolvedBy: null, resolvedAt: null, resolveMemo: null,
    createdAt: '2026-06-28 09:05:00', updatedAt: '2026-06-28 09:05:00',
  },
  {
    dlqId: 'DLQ-0006', outboxEventId: 'OBX-0065', traceId: 'TRC-20260625-0018', eventType: 'SETTLEMENT_COMPLETED',
    failReason: 'DataIntegrityViolationException: settlement_date UNIQUE 제약 위반', retryCount: 3,
    status: 'RESOLVED', resolvedBy: 'admin.kim', resolvedAt: '2026-06-25 14:00:00', resolveMemo: '중복 정산 배치 실행으로 확인, 정산 원장 정정 후 재시도 성공',
    createdAt: '2026-06-25 13:10:00', updatedAt: '2026-06-25 14:00:00',
  },
]

// ---------------------------------------------------------------------------
// Filter functions
// ---------------------------------------------------------------------------

export function filterOutboxEvents(all: OutboxEvent[], filter: OutboxFilter): OutboxEvent[] {
  return all.filter((e) => {
    if (filter.keyword.trim()) {
      const kw = filter.keyword.trim().toLowerCase()
      if (!e.eventType.toLowerCase().includes(kw) && !e.aggregateId.toLowerCase().includes(kw)) return false
    }
    if (filter.status !== 'ALL' && e.status !== filter.status) return false
    return true
  })
}

export function filterDlqEntries(all: DlqEntry[], filter: DlqFilter): DlqEntry[] {
  return all.filter((d) => {
    if (filter.keyword.trim()) {
      const kw = filter.keyword.trim().toLowerCase()
      if (!d.eventType.toLowerCase().includes(kw)) return false
    }
    if (filter.status !== 'ALL' && d.status !== filter.status) return false
    return true
  })
}
