export type BatchJobStatus = 'ACTIVE' | 'INACTIVE'
export type RunStatus      = 'SUCCESS' | 'FAILED' | 'RUNNING' | 'SKIPPED'
export type TriggerType    = 'SCHEDULED' | 'MANUAL'

export interface BatchJobParam {
  key: string
  description: string
}

export interface BatchExecParam {
  key: string
  value: string
}

export interface BatchJob {
  jobId: string
  jobName: string
  description: string
  jobClass: string
  schedule: string
  scheduleDesc: string
  params: BatchJobParam[]
  status: BatchJobStatus
  lastRunAt: string
  lastRunStatus: RunStatus | null
  nextRunAt: string
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
}

export interface BatchExecution {
  executionId: string
  jobId: string
  jobName: string
  startedAt: string
  endedAt: string | null
  status: RunStatus
  triggerType: TriggerType
  triggeredBy: string
  durationSec: number | null
  processedCount: number
  errorCount: number
  errorMessage?: string
  params?: BatchExecParam[]
}

export interface JobFilter {
  jobName: string
  status: BatchJobStatus | 'ALL'
  lastRunStatus: RunStatus | 'ALL'
}

export interface ExecFilter {
  jobName: string
  status: RunStatus | 'ALL'
  triggerType: TriggerType | 'ALL'
  from: string
  to: string
}

// ---------------------------------------------------------------------------
// MOCK_BATCH_JOBS
// ---------------------------------------------------------------------------

export const MOCK_BATCH_JOBS: BatchJob[] = [
  {
    jobId: 'BATCH-001',
    params: [
      { key: 'targetDate', description: '마감 처리 기준 일자 (today / YYYY-MM-DD)' },
      { key: 'dryRun',     description: '실제 반영 여부 (true=테스트, false=실반영)' },
    ],
    jobName: '주문 마감 처리',
    description: '당일 주문을 마감하고 출고 대상 목록을 확정합니다.',
    jobClass: 'com.commerce.batch.order.OrderClosingJob',
    schedule: '0 5 0 * * ?',
    scheduleDesc: '매일 00:05',
    status: 'ACTIVE',
    lastRunAt: '2026-05-19 00:05:03',
    lastRunStatus: 'SUCCESS',
    nextRunAt: '2026-05-20 00:05:00',
    createdBy: 'admin.kim',
    createdAt: '2025-01-15 09:00:00',
    updatedBy: 'admin.kim',
    updatedAt: '2025-01-15 09:00:00',
  },
  {
    jobId: 'BATCH-002',
    params: [
      { key: 'checkInterval',  description: '체크 주기(초)' },
      { key: 'alertThreshold', description: '불일치 허용 임계값' },
    ],
    jobName: '재고 예약 정합성 체크',
    description: 'Redis 예약 재고와 DB 재고의 정합성을 매시 검증합니다.',
    jobClass: 'com.commerce.batch.inventory.InventoryConsistencyJob',
    schedule: '0 0 * * * ?',
    scheduleDesc: '매시 정각',
    status: 'ACTIVE',
    lastRunAt: '2026-05-19 09:00:02',
    lastRunStatus: 'SUCCESS',
    nextRunAt: '2026-05-19 10:00:00',
    createdBy: 'admin.kim',
    createdAt: '2025-02-01 10:00:00',
    updatedBy: 'ops.lee',
    updatedAt: '2025-11-20 14:30:00',
  },
  {
    jobId: 'BATCH-003',
    params: [
      { key: 'settlementDate', description: '정산 기준 일자 (yesterday / YYYY-MM-DD)' },
      { key: 'batchSize',      description: '배치 처리 단위' },
      { key: 'retryOnFail',    description: '실패 시 재시도 여부' },
    ],
    jobName: '정산 집계',
    description: '전일 거래 데이터를 집계하여 정산 테이블에 적재합니다.',
    jobClass: 'com.commerce.batch.settlement.SettlementAggregationJob',
    schedule: '0 0 1 * * ?',
    scheduleDesc: '매일 01:00',
    status: 'ACTIVE',
    lastRunAt: '2026-05-19 01:00:07',
    lastRunStatus: 'FAILED',
    nextRunAt: '2026-05-20 01:00:00',
    createdBy: 'admin.kim',
    createdAt: '2025-03-10 09:00:00',
    updatedBy: 'admin.kim',
    updatedAt: '2026-01-05 11:00:00',
  },
  {
    jobId: 'BATCH-004',
    params: [
      { key: 'expiryDays', description: '만료 기준 경과 일수' },
      { key: 'notifyUser', description: '만료 시 회원 알림 여부' },
    ],
    jobName: '회원 포인트 만료 처리',
    description: '유효기간이 지난 포인트를 만료 처리합니다.',
    jobClass: 'com.commerce.batch.member.PointExpirationJob',
    schedule: '0 0 3 1 * ?',
    scheduleDesc: '매월 1일 03:00',
    status: 'ACTIVE',
    lastRunAt: '2026-05-01 03:00:04',
    lastRunStatus: 'SUCCESS',
    nextRunAt: '2026-06-01 03:00:00',
    createdBy: 'admin.kim',
    createdAt: '2025-04-01 09:00:00',
    updatedBy: 'admin.kim',
    updatedAt: '2025-04-01 09:00:00',
  },
  {
    jobId: 'BATCH-005',
    params: [
      { key: 'priceSource', description: '가격 동기화 소스 시스템 (ERP / CMS)' },
      { key: 'batchSize',   description: '동기화 단위' },
      { key: 'timeout',     description: 'API 응답 타임아웃(초)' },
    ],
    jobName: '상품 가격 동기화',
    description: '외부 가격 시스템과 상품 판매가를 동기화합니다.',
    jobClass: 'com.commerce.batch.product.PriceSyncJob',
    schedule: '0 0 6 * * ?',
    scheduleDesc: '매일 06:00',
    status: 'ACTIVE',
    lastRunAt: '2026-05-19 06:00:01',
    lastRunStatus: 'RUNNING',
    nextRunAt: '2026-05-20 06:00:00',
    createdBy: 'prod.park',
    createdAt: '2025-05-20 14:00:00',
    updatedBy: 'prod.park',
    updatedAt: '2026-03-15 10:00:00',
  },
  {
    jobId: 'BATCH-006',
    params: [
      { key: 'minStockAgeDays', description: '불용 처리 기준 경과 일수' },
      { key: 'dryRun',          description: '실제 반영 여부' },
    ],
    jobName: '불용 재고 정리',
    description: '6개월 이상 미판매 재고를 불용 처리합니다.',
    jobClass: 'com.commerce.batch.inventory.DeadStockCleanupJob',
    schedule: '0 0 4 ? * SUN',
    scheduleDesc: '매주 일요일 04:00',
    status: 'ACTIVE',
    lastRunAt: '2026-05-18 04:00:03',
    lastRunStatus: 'SKIPPED',
    nextRunAt: '2026-05-25 04:00:00',
    createdBy: 'ops.lee',
    createdAt: '2025-07-01 09:00:00',
    updatedBy: 'ops.lee',
    updatedAt: '2025-07-01 09:00:00',
  },
  {
    jobId: 'BATCH-007',
    params: [
      { key: 'archiveDays', description: '아카이빙 기준 경과 일수' },
    ],
    jobName: '로그 아카이빙',
    description: '30일 이전 운영 로그를 콜드 스토리지로 이관합니다.',
    jobClass: 'com.commerce.batch.system.LogArchivingJob',
    schedule: '0 0 3 * * ?',
    scheduleDesc: '매일 03:00',
    status: 'INACTIVE',
    lastRunAt: '—',
    lastRunStatus: null,
    nextRunAt: '—',
    createdBy: 'admin.kim',
    createdAt: '2025-08-10 09:00:00',
    updatedBy: 'admin.kim',
    updatedAt: '2026-02-01 12:00:00',
  },
  {
    jobId: 'BATCH-008',
    params: [
      { key: 'sourceSchema', description: '원본 스키마명' },
      { key: 'targetSchema', description: '대상 스키마명' },
      { key: 'dryRun',       description: '실제 반영 여부 (기본 true=테스트)' },
    ],
    jobName: '구버전 데이터 마이그레이션',
    description: '레거시 스키마 데이터를 신규 스키마로 일회성 마이그레이션합니다.',
    jobClass: 'com.commerce.batch.migration.LegacyDataMigrationJob',
    schedule: '—',
    scheduleDesc: '1회성 수동 실행',
    status: 'INACTIVE',
    lastRunAt: '—',
    lastRunStatus: null,
    nextRunAt: '—',
    createdBy: 'admin.kim',
    createdAt: '2026-04-20 09:00:00',
    updatedBy: 'admin.kim',
    updatedAt: '2026-04-20 09:00:00',
  },
]

// ---------------------------------------------------------------------------
// MOCK_EXECUTIONS
// ---------------------------------------------------------------------------

export const MOCK_EXECUTIONS: BatchExecution[] = [
  {
    executionId: 'EXEC-0001',
    jobId: 'BATCH-005',
    jobName: '상품 가격 동기화',
    startedAt: '2026-05-19 06:00:01',
    endedAt: null,
    status: 'RUNNING',
    triggerType: 'SCHEDULED',
    triggeredBy: 'scheduler',
    durationSec: null,
    processedCount: 0,
    errorCount: 0,
  },
  {
    executionId: 'EXEC-0002',
    jobId: 'BATCH-003',
    jobName: '정산 집계',
    startedAt: '2026-05-19 01:00:07',
    endedAt: '2026-05-19 01:04:52',
    status: 'FAILED',
    triggerType: 'SCHEDULED',
    triggeredBy: 'scheduler',
    durationSec: 285,
    processedCount: 0,
    errorCount: 1,
    errorMessage: 'DataIntegrityViolationException: 정산 원장 테이블 제약 조건 위반 (settlement_date UNIQUE)',
  },
  {
    executionId: 'EXEC-0003',
    jobId: 'BATCH-002',
    jobName: '재고 예약 정합성 체크',
    startedAt: '2026-05-19 09:00:02',
    endedAt: '2026-05-19 09:00:41',
    status: 'SUCCESS',
    triggerType: 'SCHEDULED',
    triggeredBy: 'scheduler',
    durationSec: 39,
    processedCount: 1248,
    errorCount: 0,
  },
  {
    executionId: 'EXEC-0004',
    jobId: 'BATCH-001',
    jobName: '주문 마감 처리',
    startedAt: '2026-05-19 00:05:03',
    endedAt: '2026-05-19 00:05:58',
    status: 'SUCCESS',
    triggerType: 'SCHEDULED',
    triggeredBy: 'scheduler',
    durationSec: 55,
    processedCount: 342,
    errorCount: 0,
  },
  {
    executionId: 'EXEC-0005',
    jobId: 'BATCH-006',
    jobName: '불용 재고 정리',
    startedAt: '2026-05-18 04:00:03',
    endedAt: '2026-05-18 04:00:04',
    status: 'SKIPPED',
    triggerType: 'SCHEDULED',
    triggeredBy: 'scheduler',
    durationSec: 1,
    processedCount: 0,
    errorCount: 0,
  },
  {
    executionId: 'EXEC-0006',
    jobId: 'BATCH-002',
    jobName: '재고 예약 정합성 체크',
    startedAt: '2026-05-18 08:00:01',
    endedAt: '2026-05-18 08:00:38',
    status: 'SUCCESS',
    triggerType: 'SCHEDULED',
    triggeredBy: 'scheduler',
    durationSec: 37,
    processedCount: 1201,
    errorCount: 0,
  },
  {
    executionId: 'EXEC-0007',
    jobId: 'BATCH-001',
    jobName: '주문 마감 처리',
    startedAt: '2026-05-18 00:05:01',
    endedAt: '2026-05-18 00:05:49',
    status: 'SUCCESS',
    triggerType: 'SCHEDULED',
    triggeredBy: 'scheduler',
    durationSec: 48,
    processedCount: 287,
    errorCount: 0,
  },
  {
    executionId: 'EXEC-0008',
    jobId: 'BATCH-003',
    jobName: '정산 집계',
    startedAt: '2026-05-18 01:00:05',
    endedAt: '2026-05-18 01:08:22',
    status: 'SUCCESS',
    triggerType: 'SCHEDULED',
    triggeredBy: 'scheduler',
    durationSec: 497,
    processedCount: 5823,
    errorCount: 0,
  },
  {
    executionId: 'EXEC-0009',
    jobId: 'BATCH-004',
    jobName: '회원 포인트 만료 처리',
    startedAt: '2026-05-01 03:00:04',
    endedAt: '2026-05-01 03:01:39',
    status: 'SUCCESS',
    triggerType: 'SCHEDULED',
    triggeredBy: 'scheduler',
    durationSec: 95,
    processedCount: 4120,
    errorCount: 0,
  },
  {
    executionId: 'EXEC-0010',
    jobId: 'BATCH-005',
    jobName: '상품 가격 동기화',
    startedAt: '2026-05-18 06:00:02',
    endedAt: '2026-05-18 06:03:11',
    status: 'SUCCESS',
    triggerType: 'SCHEDULED',
    triggeredBy: 'scheduler',
    durationSec: 189,
    processedCount: 9840,
    errorCount: 0,
  },
  {
    executionId: 'EXEC-0011',
    jobId: 'BATCH-003',
    jobName: '정산 집계',
    startedAt: '2026-05-18 01:00:05',
    endedAt: '2026-05-18 01:00:08',
    status: 'FAILED',
    triggerType: 'MANUAL',
    triggeredBy: 'admin.kim',
    durationSec: 3,
    processedCount: 0,
    errorCount: 1,
    errorMessage: 'ConnectionTimeoutException: DB 연결 타임아웃 (30s 초과)',
    params: [
      { key: 'settlementDate', value: '2026-05-17' },
      { key: 'batchSize',      value: '500' },
      { key: 'retryOnFail',    value: 'false' },
    ],
  },
  {
    executionId: 'EXEC-0012',
    jobId: 'BATCH-001',
    jobName: '주문 마감 처리',
    startedAt: '2026-05-17 00:05:02',
    endedAt: '2026-05-17 00:06:01',
    status: 'SUCCESS',
    triggerType: 'SCHEDULED',
    triggeredBy: 'scheduler',
    durationSec: 59,
    processedCount: 411,
    errorCount: 0,
  },
  {
    executionId: 'EXEC-0013',
    jobId: 'BATCH-002',
    jobName: '재고 예약 정합성 체크',
    startedAt: '2026-05-17 14:00:01',
    endedAt: '2026-05-17 14:00:45',
    status: 'SUCCESS',
    triggerType: 'SCHEDULED',
    triggeredBy: 'scheduler',
    durationSec: 44,
    processedCount: 1190,
    errorCount: 0,
  },
  {
    executionId: 'EXEC-0014',
    jobId: 'BATCH-005',
    jobName: '상품 가격 동기화',
    startedAt: '2026-05-17 06:00:01',
    endedAt: '2026-05-17 06:02:58',
    status: 'SUCCESS',
    triggerType: 'SCHEDULED',
    triggeredBy: 'scheduler',
    durationSec: 177,
    processedCount: 9712,
    errorCount: 0,
  },
  {
    executionId: 'EXEC-0015',
    jobId: 'BATCH-006',
    jobName: '불용 재고 정리',
    startedAt: '2026-05-11 04:00:02',
    endedAt: '2026-05-11 04:00:03',
    status: 'SKIPPED',
    triggerType: 'SCHEDULED',
    triggeredBy: 'scheduler',
    durationSec: 1,
    processedCount: 0,
    errorCount: 0,
  },
  {
    executionId: 'EXEC-0016',
    jobId: 'BATCH-004',
    jobName: '회원 포인트 만료 처리',
    startedAt: '2026-04-01 03:00:03',
    endedAt: '2026-04-01 03:01:22',
    status: 'SUCCESS',
    triggerType: 'SCHEDULED',
    triggeredBy: 'scheduler',
    durationSec: 79,
    processedCount: 3897,
    errorCount: 0,
  },
  {
    executionId: 'EXEC-0017',
    jobId: 'BATCH-003',
    jobName: '정산 집계',
    startedAt: '2026-05-17 01:00:06',
    endedAt: '2026-05-17 01:07:51',
    status: 'SUCCESS',
    triggerType: 'SCHEDULED',
    triggeredBy: 'scheduler',
    durationSec: 465,
    processedCount: 5601,
    errorCount: 0,
  },
  {
    executionId: 'EXEC-0018',
    jobId: 'BATCH-001',
    jobName: '주문 마감 처리',
    startedAt: '2026-05-19 00:05:03',
    endedAt: null,
    status: 'RUNNING',
    triggerType: 'MANUAL',
    triggeredBy: 'ops.lee',
    durationSec: null,
    processedCount: 0,
    errorCount: 0,
    params: [
      { key: 'targetDate', value: '2026-05-19' },
      { key: 'dryRun',     value: 'false' },
    ],
  },
  {
    executionId: 'EXEC-0019',
    jobId: 'BATCH-002',
    jobName: '재고 예약 정합성 체크',
    startedAt: '2026-05-16 10:00:01',
    endedAt: '2026-05-16 10:00:44',
    status: 'SUCCESS',
    triggerType: 'MANUAL',
    triggeredBy: 'ops.lee',
    durationSec: 43,
    processedCount: 1155,
    errorCount: 0,
    params: [
      { key: 'checkInterval',  value: '3600' },
      { key: 'alertThreshold', value: '100' },
    ],
  },
  {
    executionId: 'EXEC-0020',
    jobId: 'BATCH-005',
    jobName: '상품 가격 동기화',
    startedAt: '2026-05-15 11:30:00',
    endedAt: '2026-05-15 11:31:55',
    status: 'FAILED',
    triggerType: 'MANUAL',
    triggeredBy: 'prod.park',
    durationSec: 115,
    processedCount: 0,
    errorCount: 1,
    errorMessage: 'HttpClientErrorException: 외부 가격 API 응답 오류 (HTTP 503)',
    params: [
      { key: 'priceSource', value: 'ERP' },
      { key: 'batchSize',   value: '200' },
      { key: 'timeout',     value: '30' },
    ],
  },
  {
    executionId: 'EXEC-0021',
    jobId: 'BATCH-006',
    jobName: '불용 재고 정리',
    startedAt: '2026-05-04 04:00:02',
    endedAt: '2026-05-04 04:12:33',
    status: 'SUCCESS',
    triggerType: 'SCHEDULED',
    triggeredBy: 'scheduler',
    durationSec: 751,
    processedCount: 234,
    errorCount: 0,
  },
]

// ---------------------------------------------------------------------------
// Filter functions
// ---------------------------------------------------------------------------

export function filterJobs(all: BatchJob[], filter: JobFilter): BatchJob[] {
  return all.filter((j) => {
    if (filter.jobName && !j.jobName.includes(filter.jobName))            return false
    if (filter.status !== 'ALL' && j.status !== filter.status)            return false
    if (filter.lastRunStatus !== 'ALL' && j.lastRunStatus !== filter.lastRunStatus) return false
    return true
  })
}

export function filterExecutions(all: BatchExecution[], filter: ExecFilter): BatchExecution[] {
  return all.filter((e) => {
    if (filter.jobName && !e.jobName.includes(filter.jobName))              return false
    if (filter.status !== 'ALL' && e.status !== filter.status)              return false
    if (filter.triggerType !== 'ALL' && e.triggerType !== filter.triggerType) return false
    if (filter.from && e.startedAt < filter.from)                           return false
    if (filter.to   && e.startedAt > filter.to + ' 23:59')                 return false
    return true
  })
}
