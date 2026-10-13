# BatchJobStatus — UI 정의

## Overview
| 항목 | 내용 |
|------|------|
| 목적 | 시스템에 등록된 배치잡의 현황(상태·스케줄·최근 실행 결과)을 조회하고, 잡을 등록·수정한다 |
| 대상 | 운영자 (어드민) |
| 진입 경로 | 어드민 > 시스템 관리 > 배치잡 현황 |
| URL | /admin/system/batch-job/status |
| 관련 컴포넌트 | FilterBar, SummaryBar, Toolbar, JobTable, Pagination, BatchJobDetail, AddJobModal, JobStatusBadge, RunStatusBadge |

---

## Layout

```
┌─────────────────────────────────────────────────────────┐
│ 배치잡 현황                        [스펙]  (page-title)  │
├─────────────────────────────────────────────────────────┤
│ [잡명] [전체 상태▾] [전체 결과▾] [조회]   (filter-bar)  │
├─────────────────────────────────────────────────────────┤
│ SummaryBar (결과 있을 때만)  │  [+ 배치잡 추가] (Toolbar)│
│  전체 N개 | 활성 N개 | 비활성 N개 | ⚠ 실패 N개          │
├─────────────────────────────────────────────────────────┤
│ 잡 ID │ 잡명 │ 스케줄 │ 상태 │ 마지막 실행 │ 마지막 결과 │ 다음 실행 │
│ ────  │ ─── │ ─────  │ ──── │ ──────────  │ ────────── │ ───────── │
│ (row) │     │        │ 뱃지  │             │ 뱃지        │           │
│  ...                                                    │
├─────────────────────────────────────────────────────────┤
│ [7개▾]  ← 1 / N →                       (Pagination)   │
└─────────────────────────────────────────────────────────┘

[배치잡 상세 모달 — 행 클릭 시 열림 (BatchJobDetail 컴포넌트)]
┌─────────────────────────────────────────────────────────┐
│ {잡명}  배치잡 상세                            [✕]      │
├─────────────────────────────────────────────────────────┤
│ [기본정보] [파라미터 (N)] [실행 이력 (N)]  (InnerTabs)  │
│  (BatchJobDetail.spec.md 참조)                          │
└─────────────────────────────────────────────────────────┘

[배치잡 추가 모달]
┌───────────────────────────────────────────┐
│ 배치잡 추가                           [✕] │
│ 잡명*        │ 잡 클래스*                  │
│ 스케줄(cron)*│ 스케줄 설명                 │
│ 설명                                      │
│                          [취소] [등록]    │
└───────────────────────────────────────────┘
```

---

## Components

| 컴포넌트 | 역할 |
|----------|------|
| FilterBar | 잡명 텍스트 / 잡 상태(전체 상태·활성·비활성) / 마지막 결과(전체 결과·성공·실패·실행중·SKIPPED) 선택 및 [조회] 버튼 |
| SummaryBar | 조회 결과 기준 전체·활성·비활성 개수 카드. 비활성 0이면 카드 숨김. 활성 상태이면서 FAILED인 잡이 1개 이상이면 ⚠ 실패 카드(warn 스타일) 추가 표시 |
| Toolbar | `+ 배치잡 추가` 버튼 포함. 항상 렌더링되며 SummaryBar 우측에 배치 |
| JobTable | 배치잡 목록 테이블. lastRunStatus가 RUNNING인 행에 `data-job-running="true"` 속성 부여. 행 클릭 시 상세 모달 오픈. 잡 ID 셀에 link-cell 스타일 적용. 스케줄 열에는 scheduleDesc 표시, title 속성으로 실제 cron 식(schedule) 노출 |
| Pagination | 페이지 크기(7·14·30·50·100) 선택 + 이전/다음 페이지 이동. shared/Pagination에서 import |
| BatchJobDetail | 배치잡 상세 오버레이 모달. 기본정보·파라미터·실행 이력 탭으로 구성. BatchJobDetail.tsx에서 default import |
| AddJobModal | 배치잡 신규 등록 소형 모달(detail-modal--sm). 잡명·잡 클래스·스케줄 필수 입력 검사 |
| JobStatusBadge | `ACTIVE`(활성) / `INACTIVE`(비활성) 뱃지. `data-job-status` 속성 부여 |
| RunStatusBadge | `SUCCESS`(성공) / `FAILED`(실패) / `RUNNING`(실행중) / `SKIPPED` / null(—) 뱃지. `data-run-status` 속성 부여 |

---

## States

| 상태 | 처리 |
|------|------|
| 초기(미조회) | 테이블 영역에 "조회 버튼을 눌러 배치잡 목록을 불러오세요." 메시지 표시. Toolbar는 항상 표시 |
| 로딩 중 | "불러오는 중..." 메시지 표시. 테이블·SummaryBar 숨김. Toolbar도 숨김 |
| 조회 결과 없음 | SummaryBar 숨김. Toolbar 표시. 테이블 안내 메시지("조회 버튼을 눌러…") 표시 |
| 조회 결과 있음 | SummaryBar + Toolbar + JobTable + Pagination 표시 |
| 잡 lastRunStatus RUNNING | 해당 행에 `data-job-running="true"` 속성 적용(CSS로 시각 강조 가능) |
| 배치잡 추가 모달 — 유효성 오류 | jobName·jobClass·schedule 미입력 시 "필수" 오류 표시. 등록 차단 |

---

## Interactions

| 액션 | 반응 |
|------|------|
| 필터 입력 후 [조회] 클릭 | 300ms 지연 후 filterJobs 적용 결과를 displayed에 반영. 페이지 1 초기화 |
| 잡 목록 행 클릭 | BatchJobDetail 모달 오픈. detailJob 상태에 선택 잡 저장 |
| [+ 배치잡 추가] 클릭 | AddJobModal 오픈 |
| AddJobModal [등록] 클릭 | 유효성 통과 시 BATCH-NNN 형태로 jobId 자동 채번. allJobs 추가 후 현재 필터로 displayed 재계산. 모달 닫힘. 초기 상태: ACTIVE, lastRunStatus: null |
| BatchJobDetail 기본정보 [저장] | onUpdate 콜백으로 allJobs·displayed 갱신. detailJob 갱신 |
| BatchJobDetail [✕] 클릭 | detailJob null. 모달 닫힘 |
| 페이지 크기 변경 | pageSize 업데이트. 페이지 1로 초기화 |
| 모달 [✕] 클릭 | 해당 모달 상태 null/false. 오버레이 닫힘 |

---

## API

```
# 배치잡 현황은 현재 목업(mockData)으로 동작하며, 실제 API 연동 시 아래 엔드포인트를 사용한다.

GET    /api/admin/batch-jobs
  Query: jobName, status(ACTIVE|INACTIVE|ALL), lastRunStatus(SUCCESS|FAILED|RUNNING|SKIPPED|ALL)
  Response: BatchJob[]

POST   /api/admin/batch-jobs
  Body: { jobName, description, jobClass, schedule, scheduleDesc }
  Response: BatchJob

PUT    /api/admin/batch-jobs/{jobId}
  Body: { status, jobName, jobClass, schedule, scheduleDesc, description }
  Response: BatchJob

PUT    /api/admin/batch-jobs/{jobId}/params
  Body: BatchJobParam[]   # [{ key, description }]
  Response: BatchJob

GET    /api/admin/batch-jobs/{jobId}/executions
  Response: BatchExecution[]

# 타입 정의
BatchJobStatus : 'ACTIVE' | 'INACTIVE'
RunStatus      : 'SUCCESS' | 'FAILED' | 'RUNNING' | 'SKIPPED'
TriggerType    : 'SCHEDULED' | 'MANUAL'
BatchJobParam  : { key: string; description: string }
BatchExecParam : { key: string; value: string }

BatchJob : {
  jobId         : string
  jobName       : string
  description   : string
  jobClass      : string
  schedule      : string        # cron 식
  scheduleDesc  : string        # 사람이 읽기 쉬운 스케줄 설명
  status        : BatchJobStatus
  lastRunAt     : string
  lastRunStatus : RunStatus | null
  nextRunAt     : string
  params        : BatchJobParam[]
  createdBy     : string
  createdAt     : string
  updatedBy     : string
  updatedAt     : string
}
```

---

## UX Rules

- 조회는 명시적으로 [조회] 버튼을 눌러야만 실행된다. 페이지 진입 시 자동 조회하지 않는다.
- Toolbar([+ 배치잡 추가])는 로딩 중일 때를 제외하고 항상 렌더링된다. 조회 결과 유무에 무관하다.
- SummaryBar는 조회 결과(displayed.length > 0)가 있을 때만 렌더링된다.
- 비활성 잡 수가 0이면 SummaryBar 비활성 카드를 숨긴다. 활성 상태이면서 FAILED인 잡이 1개 이상이면 ⚠ 실패 카드(warn 스타일)를 별도 표시한다.
- 활성 카드는 inactive > 0 여부와 무관하게 항상 표시한다.
- JobTable에서 lastRunStatus가 RUNNING인 행에는 `data-job-running="true"` 속성을 부여하여 CSS 하이라이트를 지원한다.
- 잡 ID 셀에 link-cell 스타일을 적용하여 링크처럼 보이도록 한다.
- 스케줄 열에는 scheduleDesc(설명 텍스트)를 표시하고, title 속성으로 실제 cron 식(schedule)을 노출한다.
- 배치잡 추가 시 jobId는 MOCK_BATCH_JOBS 기준 최대 번호 + 1로 자동 채번(`BATCH-NNN`)한다. createdBy·updatedBy는 'guest'로 고정.
- 필수 필드(잡명·잡 클래스·스케줄) 누락 시 각 필드 하단에 인라인 오류("필수")를 표시하며 제출을 차단한다.
- updatedBy / updatedAt은 저장 시 currentUser와 현재 시각(ISO 초 단위)으로 자동 갱신한다.
- 배치잡 상세는 BatchJobDetail 컴포넌트를 default import하여 사용한다.
- 페이지 기본 크기는 7건이며 7·14·30·50·100건으로 변경할 수 있다. 변경 시 페이지를 1로 초기화한다.
