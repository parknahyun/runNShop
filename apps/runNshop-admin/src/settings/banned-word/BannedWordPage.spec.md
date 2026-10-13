# BannedWordPage — UI 정의

## Overview
| 항목 | 내용 |
|------|------|
| 목적 | 게시글·리뷰·문의 등 사용자 입력에서 자동 필터링할 금지어를 등록·관리한다 |
| 대상 | 운영자 (어드민) |
| 진입 경로 | 어드민 > 설정 > 금지어 관리 |
| URL | /admin/settings/banned-word |
| 관련 컴포넌트 | FilterBar, Toolbar, BannedWordTable, Pagination, AddEditWordModal |

---

## Layout

```
┌─────────────────────────────────────────────────┐
│ 금지어 관리                     [스펙]           │
├─────────────────────────────────────────────────┤
│ [금지어 검색] [전체 분류▾] [전체 상태▾] [조회]    │
├─────────────────────────────────────────────────┤
│                              [+ 금지어 등록]      │
├─────────────────────────────────────────────────┤
│ 금지어 │ 분류 │ 상태 │ 등록자 │ 등록일            │
│  ...                                            │
├─────────────────────────────────────────────────┤
│ [10개▾]  ← 1 / N →                              │
└─────────────────────────────────────────────────┘

[금지어 등록/수정 모달]
┌───────────────────────────┐
│ 금지어 등록|수정      [✕] │
│ 금지어* (full width)      │
│ 분류*        │ 상태*      │
│ [삭제](수정시만) [취소] [등록/저장] │
└───────────────────────────┘
```

이 화면은 배치의 6개 설정 화면 중 가장 단순한 CRUD로, 결과 건수 요약이 큰 의미가 없어 SummaryBar 없이 Toolbar만 노출한다.

---

## Components

| 컴포넌트 | 역할 |
|----------|------|
| FilterBar | 금지어 텍스트 검색 / 분류 / 상태 선택 및 조회 버튼 |
| Toolbar | `+ 금지어 등록` 버튼만 포함. 로딩 중이 아닐 때 항상 렌더링 |
| BannedWordTable | 금지어 목록 테이블. 행 클릭 시 수정 모달 오픈 |
| Pagination | 페이지 크기 선택 + 이전/다음 이동 |
| AddEditWordModal | 등록/수정 겸용 소형 모달. 수정 모드에서만 [삭제] 버튼 노출 |
| BannedWordStatusBadge | `ACTIVE`(활성) / `INACTIVE`(비활성) 뱃지 |

---

## States

| 상태 | 처리 |
|------|------|
| 초기(미조회) | `displayed` 비어 있음. "조회 버튼을 눌러 금지어 목록을 불러오세요." 안내 |
| 로딩 중 | "불러오는 중..." 메시지. 나머지 영역 숨김 |
| 조회 결과 없음 | "조회된 금지어가 없습니다." 안내 (테이블 컴포넌트 내부 메시지) |
| 조회 결과 있음 | Table + Pagination 표시 |
| 유효성 오류 | 금지어 미입력 시 필드 하단 "필수" 오류. 등록/저장 차단 |

---

## Interactions

| 액션 | 반응 |
|------|------|
| 필터 입력 후 [조회] | loading = true → 300ms → filterBannedWords 실행 → displayed 갱신, page = 1 |
| 금지어 행 클릭 | modal = { mode: 'edit', word } |
| [+ 금지어 등록] 클릭 | modal = { mode: 'add' } |
| 모달 [등록] | wordId는 `nextWordId(allItems)`로 자동 채번, createdBy = currentUser |
| 모달 [저장] | 해당 wordId 항목 갱신 |
| 모달 [삭제] (수정 모드만) | allItems에서 제거, 모달 닫힘 |
| 모달 [취소] / [✕] | 모달 닫힘, 변경 없음 |

---

## API

```typescript
// 현재 목업(mockData)으로 동작. 실제 연동 시 아래 엔드포인트를 사용한다.
// ERD 테이블 없음 — 본 화면 전용으로 신규 설계한 최소 스키마.

GET    /api/admin/banned-words
  Query: keyword, category(PROFANITY|PERSONAL_INFO|SPAM|OTHER|ALL), status(ACTIVE|INACTIVE|ALL)
  Response: BannedWord[]

POST   /api/admin/banned-words
  Body: { word, category, status }
  Response: BannedWord

PUT    /api/admin/banned-words/{wordId}
  Body: { word, category, status }
  Response: BannedWord

DELETE /api/admin/banned-words/{wordId}
  Response: 204

type BannedWordCategory = 'PROFANITY' | 'PERSONAL_INFO' | 'SPAM' | 'OTHER'
type BannedWordStatus = 'ACTIVE' | 'INACTIVE'

interface BannedWord {
  wordId: string; word: string; category: BannedWordCategory; status: BannedWordStatus
  createdBy: string; createdAt: string; updatedAt: string
}
```

---

## UX Rules

- 조회는 [조회] 버튼을 눌러야만 실행된다.
- SummaryBar는 두지 않는다 — 금지어 성격상 활성/비활성 건수 구분이 운영 판단에 큰 영향을 주지 않는다.
- 금지어 텍스트는 등록 후에도 자유롭게 수정할 수 있다(고유 식별자는 wordId).
- 비활성 상태인 금지어는 필터링 로직에서 제외되지만(실 서비스 기준) mock에서는 필터링 자체를 시뮬레이션하지 않는다.
- [삭제]는 수정 모달에서만 노출되며, 클릭 즉시 목록에서 제거된다(확인 팝업 없음, mock 동작).
- `[스펙]` 버튼 클릭 시 SpecModal이 열리며 현재 spec.md 내용을 표시한다.
