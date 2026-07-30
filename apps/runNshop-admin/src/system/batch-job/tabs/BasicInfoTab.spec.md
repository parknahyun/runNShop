# BasicInfoTab — 탭 정의

## Overview
| 항목 | 내용 |
|------|------|
| 상위 화면 | BatchJobDetail |
| 탭 레이블 | 기본정보 |
| 편집 가능 | Y |

---

## Layout

```
─ 조회 모드 ─                                      [편집]
┌────────────────────────────────────────────────────────┐
│ info-grid (좌우 2컬럼 dl)                              │
│  좌: 잡 ID / 잡명 / 잡 클래스 / 스케줄(cron) / 스케줄 설명 │
│  우: 상태(뱃지) / 마지막 실행 / 마지막 결과(뱃지)        │
│      다음 실행 / 최초등록 / 최종수정                    │
│ {설명 텍스트}  (pgm-desc, description 있을 때만)        │
└────────────────────────────────────────────────────────┘

─ 편집 모드 (add-form) ─
┌────────────────────────────────────────────────────────┐
│ 상태 (라디오: 활성 / 비활성)                             │
│ 잡명*    │ 잡 클래스                                    │
│ 스케줄(cron) │ 스케줄 설명                              │
│ 설명                                                    │
│                                        [취소] [저장]   │
└────────────────────────────────────────────────────────┘
```

---

## 표시 항목 (조회 모드)

좌우 2컬럼 info-grid 구성:

**좌측 컬럼 (info-dl)**
| 항목 | 표시 값 |
|------|---------|
| 잡 ID | job.jobId (읽기 전용) |
| 잡명 | job.jobName |
| 잡 클래스 | job.jobClass |
| 스케줄 (cron) | job.schedule |
| 스케줄 설명 | job.scheduleDesc |

**우측 컬럼 (info-dl)**
| 항목 | 표시 값 |
|------|---------|
| 상태 | JobStatusBadge — ACTIVE(활성) / INACTIVE(비활성) |
| 마지막 실행 | job.lastRunAt |
| 마지막 결과 | RunStatusBadge — SUCCESS(성공) / FAILED(실패) / RUNNING(실행중) / SKIPPED / null(—) |
| 다음 실행 | job.nextRunAt |
| 최초등록 | job.createdBy / job.createdAt |
| 최종수정 | job.updatedBy / job.updatedAt |

하단: job.description이 있을 때 `pgm-desc` 단락으로 표시.

---

## 편집 항목 (편집 모드)

| 항목 | 필수 | 설명 |
|------|------|------|
| 상태 | N | 라디오 버튼 — ACTIVE(활성) / INACTIVE(비활성). pgm-status-radio 스타일 |
| 잡명 | Y | 텍스트 input (`add-form__req` 표시) |
| 잡 클래스 | N | 텍스트 input |
| 스케줄 (cron) | N | 텍스트 input |
| 스케줄 설명 | N | 텍스트 input |
| 설명 | N | 텍스트 input |

> 잡 ID, 마지막 실행, 마지막 결과, 다음 실행, 최초등록, 최종수정은 편집 모드에서 표시하지 않는다.

---

## Interactions

| 액션 | 동작 |
|------|------|
| [편집] 클릭 | editing true. toDraft(job)으로 draft 초기화. add-form 레이아웃으로 전환 |
| 상태 라디오 변경 | draft.status 업데이트 |
| 잡명 input 변경 | draft.jobName 업데이트 |
| 잡 클래스 input 변경 | draft.jobClass 업데이트 |
| 스케줄(cron) input 변경 | draft.schedule 업데이트 |
| 스케줄 설명 input 변경 | draft.scheduleDesc 업데이트 |
| 설명 input 변경 | draft.description 업데이트 |
| [저장] 클릭 | now = `new Date().toISOString().replace('T', ' ').slice(0, 19)`. onUpdate({ ...job, ...draft, updatedBy: currentUser, updatedAt: now }) 호출. editing false |
| [취소] 클릭 | draft를 toDraft(job)으로 초기화. editing false. 조회 모드 복귀 |

---

## Props

```ts
interface BasicInfoTabProps {
  job         : BatchJob
  currentUser : string
  onUpdate    : (updated: BatchJob) => void
}

interface EditDraft {
  status      : BatchJobStatus   // 'ACTIVE' | 'INACTIVE'
  jobName     : string
  jobClass    : string
  schedule    : string
  scheduleDesc: string
  description : string
}
```

---

## UX Rules

- 조회 모드에서 우측 상단에 [편집] 버튼(btn-tool--toggle, height 28, padding 0 10px, font-size 12)을 표시한다.
- job prop이 변경될 때마다 useEffect로 draft를 재초기화한다.
- 필수 표시(add-form__req)는 잡명에만 붙이며, 별도의 클라이언트 유효성 검사는 구현하지 않는다.
- 폼 필드 id는 useId()로 생성한 uid와 필드 키를 조합하여 중복을 방지한다.
- 저장 시 updatedBy는 currentUser, updatedAt은 현재 시각(`new Date().toISOString().replace('T', ' ').slice(0, 19)`)으로 자동 갱신한다.
- 편집 모드 폼은 add-form 클래스, 편집 모드 상태 선택은 pgm-status-radio 클래스를 사용한다.
