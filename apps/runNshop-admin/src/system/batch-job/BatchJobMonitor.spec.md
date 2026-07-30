# BatchJobMonitor — UI 정의

## Overview
| 항목 | 내용 |
|------|------|
| 목적 | 배치잡의 실행 이력(실행 로그)을 날짜·상태·트리거 유형별로 조회하고, 개별 실행을 수동으로 재실행한다 |
| 대상 | 운영자 (어드민) |
| 진입 경로 | 어드민 > 시스템 관리 > 배치잡 모니터링 |
| URL | /admin/system/batch-job/monitor |
| 관련 컴포넌트 | FilterBar, SummaryBar, ExecTable, Pagination, RerunModal, BatchJobDetail, RunStatusBadge |

---

## Layout

```
┌─────────────────────────────────────────────────────────┐
│ 배치잡 모니터링                    [스펙]  (page-title)  │
├─────────────────────────────────────────────────────────┤
│ [잡명] [전체 상태▾] [전체 트리거▾] [시작일] ~ [종료일] [조회] │
│                                          (filter-bar)   │
├─────────────────────────────────────────────────────────┤
│ SummaryBar  (조회 결과가 있을 때만 표시)                 │
│  전체 N건 | 성공 N건 | ⚠ 실패 N건 | 실행중 N건 | SKIPPED N건 │
├─────────────────────────────────────────────────────────┤
│ 실행 ID │ 잡명(링크) │ 시작 일시 │ 종료 일시 │ 소요(초)  │
│ 상태    │ 트리거     │ 실행자    │ 재실행     │           │
│  ...                                                    │
├─────────────────────────────────────────────────────────┤
│ [7개▾]  ← 1 / N →                       (Pagination)   │
└─────────────────────────────────────────────────────────┘

[재실행 모달 — [재실행] 버튼 클릭 시]
┌───────────────────────────────────────────┐
│ 재실행  {잡명}                        [✕] │
│ (파라미터가 없으면) 파라미터가 없습니다.    │
│ (파라미터가 있으면)                        │
│  파라미터 키 │ 값(입력) │ 설명             │
│                          [취소] [실행]    │
└───────────────────────────────────────────┘

[배치잡 상세 모달 — 잡명 링크 클릭 시 (BatchJobDetail 사용)]
┌─────────────────────────────────────────────────────────┐
│ {잡명}  배치잡 상세                            [✕]      │
│  [기본정보] [파라미터 (N)] [실행 이력 (N)]              │
│  (BatchJobDetail.spec.md 참조)                          │
└─────────────────────────────────────────────────────────┘
```

---

## Components

| 컴포넌트 | 역할 |
|----------|------|
| FilterBar | 잡명 텍스트 / 실행 상태(전체 상태·성공·실패·실행중·SKIPPED) / 트리거 유형(전체 트리거·스케줄·수동) / 시작일(date) / 종료일(date) 필터 및 [조회] 버튼 |
| SummaryBar | 조회 결과 기준 전체·성공·실패·실행중·SKIPPED 건수 카드. 성공 0이면 성공 카드 숨김. 실패 1 이상이면 warn 스타일. 실행중 1 이상이면 info 스타일. SKIPPED 1 이상이면 muted 스타일 |
| ExecTable | 실행 이력 테이블. RUNNING 행에 `data-exec-running="true"`, FAILED 행에 `data-exec-failed="true"` 속성 부여. 잡명 셀은 link-cell 스타일로 상세 모달 연결. 각 행에 [재실행] 버튼. 트리거 뱃지에 `data-trigger` 속성 부여 |
| Pagination | 페이지 크기(7·14·30·50·100) 선택 + 이전/다음 페이지 이동 |
| RerunModal | 재실행 대상 잡의 파라미터 값을 입력받아 수동 실행을 요청하는 소형 모달(detail-modal--sm). 파라미터가 없으면 안내 메시지만 표시 |
| BatchJobDetail | 배치잡 상세 모달(기본정보·파라미터·실행 이력 탭). 잡명 클릭 시 오픈. BatchJobDetail.tsx에서 default export |
| RunStatusBadge | `SUCCESS`(성공) / `FAILED`(실패) / `RUNNING`(실행중) / `SKIPPED` 뱃지. `data-run-status` 속성 부여 |

---

## States

| 상태 | 처리 |
|------|------|
| 초기(미조회) | 테이블 영역에 "조회 버튼을 눌러 실행 이력을 불러오세요." 메시지 표시 (searched=false) |
| 로딩 중 | "불러오는 중..." 메시지 표시. 테이블·SummaryBar 숨김 |
| 조회 후 결과 없음 | "조회된 실행 이력이 없습니다." 메시지 표시 (searched=true, displayed.length=0) |
| 조회 결과 있음 | SummaryBar + ExecTable + Pagination 표시 |
| RUNNING 실행 행 | `data-exec-running="true"` 속성 부여. CSS로 시각 강조 가능 |
| FAILED 실행 행 | `data-exec-failed="true"` 속성 부여. CSS로 시각 강조 가능 |
| 재실행 모달 — 파라미터 없음 | "파라미터가 없습니다." 메시지 + [취소][실행] 버튼 표시 |
| 재실행 모달 — 파라미터 있음 | 파라미터 키·값 입력·설명 테이블 표시. 각 파라미터 값 입력 후 [실행] |
| 재실행 완료 | 새 실행 레코드(status: RUNNING, triggerType: MANUAL)가 allExecutions 맨 앞에 추가. 현재 필터 기준으로 displayed 재계산. 페이지 1 초기화. 모달 닫힘 |
| 잡 상세 모달 열림 | detailJob 상태에 선택 잡 저장. BatchJobDetail 오버레이 렌더링 |

---

## Interactions

| 액션 | 반응 |
|------|------|
| 필터 입력 후 [조회] 클릭 | 300ms 지연 후 filterExecutions 적용. displayed 갱신. 페이지 1 초기화. searched=true |
| 날짜 범위 입력 | from/to date input으로 실행 시작 일시 범위 필터링 |
| 잡명 셀(link-cell) 클릭 | 해당 jobId로 allJobs에서 잡을 찾아 detailJob 상태에 저장. BatchJobDetail 오픈. 이벤트 버블링 차단(stopPropagation) |
| [재실행] 버튼 클릭 | 해당 실행의 jobId로 allJobs에서 잡을 찾아 rerunTarget 저장. RerunModal 오픈 |
| RerunModal [실행] 클릭 | 입력한 파라미터 값으로 BatchExecution 객체 생성(executionId: EXEC-{timestamp}, status: RUNNING, triggerType: MANUAL, triggeredBy: currentUser). allExecutions 맨 앞에 추가. displayed 재계산. 페이지 1 초기화. 모달 닫힘 |
| RerunModal [취소] 또는 [✕] 클릭 | rerunTarget null 초기화. 모달 닫힘 |
| BatchJobDetail 내 잡 정보 수정 [저장] | onUpdate 콜백으로 allJobs에서 해당 잡 업데이트. detailJob 상태 갱신 |
| BatchJobDetail [✕] 클릭 | detailJob null. 모달 닫힘 |
| 페이지 크기 변경 | pageSize 업데이트. 페이지 1로 초기화 |

---

## API

```
# 배치잡 모니터링은 현재 목업(mockData)으로 동작하며, 실제 API 연동 시 아래 엔드포인트를 사용한다.

GET    /api/admin/batch-executions
  Query: jobName, status(SUCCESS|FAILED|RUNNING|SKIPPED|ALL),
         triggerType(SCHEDULED|MANUAL|ALL), from(date), to(date)
  Response: BatchExecution[]

POST   /api/admin/batch-executions
  Body: { jobId, params: BatchExecParam[] }
  Response: BatchExecution   # 생성된 실행 레코드 (status: RUNNING)

# BatchJobDetail 재사용을 위해 아래 API도 필요
PUT    /api/admin/batch-jobs/{jobId}
  Body: { status, jobName, jobClass, schedule, scheduleDesc, description }
  Response: BatchJob

PUT    /api/admin/batch-jobs/{jobId}/params
  Body: BatchJobParam[]
  Response: BatchJob

# 타입 정의
RunStatus      : 'SUCCESS' | 'FAILED' | 'RUNNING' | 'SKIPPED'
TriggerType    : 'SCHEDULED' | 'MANUAL'
BatchExecParam : { key: string; value: string }

BatchExecution : {
  executionId   : string        # 예) EXEC-{timestamp}
  jobId         : string
  jobName       : string
  startedAt     : string        # 'YYYY-MM-DD HH:mm'
  endedAt       : string | null
  status        : RunStatus
  triggerType   : TriggerType
  triggeredBy   : string
  durationSec   : number | null
  processedCount: number
  errorCount    : number
  params        : BatchExecParam[] | undefined
}
```

---

## UX Rules

- 조회는 명시적으로 [조회] 버튼을 눌러야만 실행된다. 페이지 진입 시 자동 조회하지 않는다.
- 조회 전(searched=false)과 조회 후 결과 없음(searched=true)의 안내 메시지를 구분한다.
- 조회 결과가 없으면 SummaryBar를 렌더링하지 않는다. 결과가 있을 때만 표시한다.
- SummaryBar 카드는 해당 카운트가 0이면 표시하지 않는다. 단, 전체 카드는 항상 표시한다.
- 실패 카드는 warn 스타일, 실행중 카드는 info 스타일, SKIPPED 카드는 muted 스타일을 적용한다.
- RUNNING 실행 행에는 `data-exec-running="true"`, FAILED 행에는 `data-exec-failed="true"` 속성을 부여하여 CSS 강조를 지원한다.
- 잡명 셀은 link-cell 스타일로 표시하며, 클릭 시 행 전체 클릭 이벤트와 분리(stopPropagation)한다.
- [재실행] 버튼은 실행 이력의 모든 행에 항상 표시하며, 실행 당시 잡의 파라미터 스펙을 기준으로 값을 입력받는다.
- 재실행으로 생성된 실행 레코드는 executionId를 `EXEC-{Date.now()}`로 채번하고, allExecutions 배열의 맨 앞에 삽입한다.
- 재실행 시 트리거 유형은 항상 MANUAL, 실행자는 currentUser로 설정한다.
- 날짜 범위 필터(from~to)는 양쪽 모두 선택하지 않아도 조회가 가능하며, 한쪽만 입력해도 동작한다.
- 배치잡 상세 모달은 BatchJobDetail 컴포넌트를 사용한다. 모니터링 화면에서 수정한 잡 정보는 allJobs에 즉시 반영된다.
- 페이지 기본 크기는 7건이며 7·14·30·50·100건으로 변경할 수 있다. 변경 시 페이지를 1로 초기화한다.
- 종료 일시(endedAt)와 소요 시간(durationSec)이 없는 실행(실행중 등)은 해당 셀에 "—"을 표시한다.
- 트리거 뱃지는 `data-trigger` 속성으로 SCHEDULED / MANUAL 값을 부여한다.
