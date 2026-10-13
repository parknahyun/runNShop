# BatchJobDetail — UI 정의

## Overview
| 항목 | 내용 |
|------|------|
| 목적 | 선택한 배치잡의 기본 정보를 조회·수정하고, 파라미터와 실행 이력을 관리한다 |
| 대상 | 운영자 (어드민) |
| 진입 경로 | BatchJobStatus 목록 행 클릭 / BatchJobMonitor 잡명 링크 클릭 |
| 관련 컴포넌트 | InnerTabs, BasicInfoTab, ParamTab, ExecHistoryTab |

---

## Layout

```
┌─────────────────────────────────────────────────────────────┐
│ {잡명}  배치잡 상세                                  [✕]    │
├─────────────────────────────────────────────────────────────┤
│ [기본정보] [파라미터 (N)] [실행 이력 (N)]  (InnerTabs sticky)│
├─────────────────────────────────────────────────────────────┤
│ ─ 기본정보 탭 (조회 모드) ─                      [편집]     │
│  잡 ID │ 잡명 │ 잡 클래스 │ 스케줄(cron) │ 스케줄 설명      │
│  상태(뱃지) │ 마지막 실행 │ 마지막 결과(뱃지) │ 다음 실행   │
│  최초등록 │ 최종수정                                        │
│  {설명 텍스트}                                              │
├─────────────────────────────────────────────────────────────┤
│ ─ 기본정보 탭 (편집 모드) ─                                 │
│  상태 (라디오: 활성/비활성)                                 │
│  잡명*    │ 잡 클래스                                       │
│  스케줄(cron) │ 스케줄 설명                                 │
│  설명                                                       │
│                                          [취소] [저장]      │
├─────────────────────────────────────────────────────────────┤
│ ─ 파라미터 탭 (조회 모드) ─                      [편집]     │
│  파라미터 키 │ 설명                                         │
├─────────────────────────────────────────────────────────────┤
│ ─ 파라미터 탭 (편집 모드) ─                                 │
│  [+ 파라미터 추가]                     [취소] [저장]        │
│  파라미터 키(input) │ 설명(input) │ [삭제]                  │
├─────────────────────────────────────────────────────────────┤
│ ─ 실행 이력 탭 ─                                           │
│  실행 ID │ 시작 │ 종료 │ 소요(초) │ 상태 │ 트리거 │ 실행자 │ 파라미터 │
│  ‹ 1/N ›                                    (MiniPager)    │
└─────────────────────────────────────────────────────────────┘

[실행 파라미터 조회 모달 — 실행 이력 행의 파라미터 N개 버튼 클릭]
┌─────────────────────────────────────────────────────────┐
│ 실행 파라미터  {실행 ID}                            [✕] │
│ 파라미터 키 │ 값                                        │
└─────────────────────────────────────────────────────────┘
```

---

## 탭 목록

| 탭 레이블 | 컴포넌트 | 편집 가능 | 설명 |
|-----------|----------|-----------|------|
| 기본정보 | BasicInfoTab | Y | 배치잡 기본 속성 조회·수정 |
| 파라미터 (N) | ParamTab | Y | 배치잡 파라미터 정의 목록 조회·추가·삭제. N은 job.params.length |
| 실행 이력 (N) | ExecHistoryTab | N | 해당 잡의 실행 이력 목록. N은 필터링된 executions.length |

---

## Components

| 컴포넌트 | 역할 |
|----------|------|
| InnerTabs | sticky 모드 탭 UI. 3개 탭(기본정보·파라미터·실행 이력) 렌더링 |
| BasicInfoTab | 기본 정보 조회(info-grid)/편집(add-form) 전환 탭. props: job, currentUser, onUpdate |
| ParamTab | 파라미터 테이블 조회/편집 전환 탭. props: job, currentUser, onUpdate |
| ExecHistoryTab | 실행 이력 읽기 전용 탭. props: executions(jobId 필터링 완료). MiniPager(5건/페이지) 내장 |

---

## 공통 인터랙션

| 액션 | 동작 |
|------|------|
| 헤더 [✕] 클릭 | onClose 호출. 모달 닫힘 |
| 기본정보 저장 | onUpdate에 변경된 draft + updatedBy(currentUser) / updatedAt(현재 시각 ISO 초 단위) 전달 |
| 파라미터 저장 | onUpdate에 변경된 params + updatedBy(currentUser) / updatedAt(현재 시각 ISO 초 단위) 전달 |

---

## Props

```ts
interface BatchJobDetailProps {
  job           : BatchJob          // 표시할 배치잡
  currentUser   : string            // 저장 시 updatedBy에 사용
  allExecutions : BatchExecution[]  // 전체 실행 이력. jobId로 내부 필터링
  onClose       : () => void        // 모달 닫기
  onUpdate      : (updated: BatchJob) => void  // 잡 정보 변경 후 부모에 통보
}
```

---

## UX Rules

- 모달은 `detail-modal-overlay` 위에 `detail-modal`(role="dialog", aria-modal="true")로 렌더링한다.
- 헤더에 잡명(title: detail-modal__title)과 "배치잡 상세"(subtitle: detail-modal__subtitle)를 함께 표시한다.
- InnerTabs는 sticky 모드로 렌더링한다.
- 실행 이력은 allExecutions에서 jobId가 일치하는 항목만 필터링하여 ExecHistoryTab에 전달한다.
- 파라미터 탭 레이블은 job.params.length를 실시간 반영하여 "파라미터 (N)" 형태로 표시한다.
- 실행 이력 탭 레이블은 필터링된 executions.length를 반영하여 "실행 이력 (N)" 형태로 표시한다.
- updatedBy / updatedAt은 저장 시 currentUser와 현재 시각(`new Date().toISOString().replace('T', ' ').slice(0, 19)`)으로 자동 갱신한다.
- BatchJobDetail은 BatchJobStatus와 BatchJobMonitor 양쪽에서 default import로 재사용한다.
