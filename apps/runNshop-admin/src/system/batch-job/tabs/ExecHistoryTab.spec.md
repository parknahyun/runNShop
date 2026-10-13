# ExecHistoryTab — 탭 정의

## Overview
| 항목 | 내용 |
|------|------|
| 상위 화면 | BatchJobDetail |
| 탭 레이블 | 실행 이력 (N) |
| 편집 가능 | N |
| 페이지 크기 | 5건 고정 (MiniPager) |

---

## Layout

```
┌────────────────────────────────────────────────────────────────┐
│ 실행 ID │ 시작 │ 종료 │ 소요(초) │ 상태 │ 트리거 │ 실행자 │ 파라미터 │
│ ───────   ────   ────   ────────   ────   ──────   ──────   ──────── │
│  (rows)                                                        │
│  이력 없음 → "실행 이력이 없습니다." (colSpan=8)               │
└────────────────────────────────────────────────────────────────┘
‹ 1/N ›  (MiniPager — totalPages > 1일 때만 표시)

[실행 파라미터 조회 모달 — "N개" 버튼 클릭 시]
┌─────────────────────────────────────────────────────────┐
│ 실행 파라미터  {실행 ID}                            [✕] │
│ 파라미터 키 │ 값                                        │
└─────────────────────────────────────────────────────────┘
```

---

## 표시 항목

| 컬럼 | 설명 |
|------|------|
| 실행 ID | BatchExecution.executionId |
| 시작 | BatchExecution.startedAt |
| 종료 | BatchExecution.endedAt. null이면 "—" 표시 |
| 소요(초) | BatchExecution.durationSec. null이면 "—" 표시 |
| 상태 | RunStatusBadge — SUCCESS(성공) / FAILED(실패) / RUNNING(실행중) / SKIPPED / null(—). `data-run-status` 속성 부여 |
| 트리거 | 뱃지(`data-trigger`) — SCHEDULED(스케줄) / MANUAL(수동) |
| 실행자 | BatchExecution.triggeredBy |
| 파라미터 | params가 있으면 "N개" 버튼(btn-tool, height 22, padding 0 6px, font-size 11), 없으면 "—"(color #94a3b8) |

이력이 없을 때 "실행 이력이 없습니다." 안내 메시지 표시 (colSpan=8).

---

## 실행 파라미터 조회 모달

| 항목 | 내용 |
|------|------|
| 진입 | 실행 이력 행의 "N개" 버튼 클릭 |
| 모달 타입 | detail-modal--sm (소형 모달) |
| z-index | 200 |
| 헤더 | title: "실행 파라미터", subtitle: executionId |
| 내용 | 파라미터 키 / 값 2컬럼 테이블. 파라미터 키는 `<code>` 태그(font-size 12)로 표시 |
| 닫기 | [✕] 클릭 → expandedExecId null로 초기화 |

---

## Interactions

| 액션 | 동작 |
|------|------|
| 파라미터 "N개" 버튼 클릭 | expandedExecId를 해당 executionId로 업데이트. 실행 파라미터 모달 열림 |
| 실행 파라미터 모달 [✕] 클릭 | expandedExecId null로 초기화. 모달 닫힘 |
| MiniPager 페이지 변경 | 현재 페이지(pager.page) 변경. 5건씩 슬라이스(pager.slice) |

---

## Props

```ts
interface ExecHistoryTabProps {
  executions: BatchExecution[]   // jobId 필터링이 완료된 실행 이력 배열
}
```

---

## UX Rules

- 이 탭은 읽기 전용이다. 편집 기능이 없다.
- 실행 파라미터 조회 모달은 zIndex 200으로 렌더링하여 상위 detail-modal 위에 표시된다.
- params 배열이 없거나 길이가 0인 실행은 파라미터 열에 "—"(color #94a3b8)을 표시하고 버튼을 렌더링하지 않는다.
- "N개" 버튼 스타일: btn-tool (height 22, padding 0 6px, font-size 11).
- MiniPager는 totalPages가 1이면 렌더링하지 않는다.
- 페이지 크기는 5건 고정이다. usePager 훅을 사용한다.
- 트리거 뱃지는 `data-trigger` 속성으로 SCHEDULED / MANUAL 값을 부여한다.
- RunStatusBadge에서 status가 null이면 `data-run-status="SKIPPED"` 속성의 "—" 뱃지를 렌더링한다.
- 파라미터 열 헤더는 width 72, textAlign center로 지정된다.
