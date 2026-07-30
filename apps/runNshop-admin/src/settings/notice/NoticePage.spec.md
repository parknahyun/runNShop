# NoticePage — UI 정의

## Overview
| 항목 | 내용 |
|------|------|
| 목적 | 고객·입점사 대상 공지사항을 조회·등록·수정·삭제한다 |
| 대상 | 운영자 (어드민) |
| 진입 경로 | 어드민 > 설정 > 공지사항 |
| URL | /admin/settings/notice |
| 관련 컴포넌트 | FilterBar, SummaryBar, Toolbar, NoticeTable, Pagination, AddEditNoticeModal |

---

## Layout

```
┌──────────────────────────────────────────────────────────┐
│ 공지사항                                [스펙]            │
├──────────────────────────────────────────────────────────┤
│ [제목 검색] [전체 대상▾] [조회]                            │
├────────────────────────────────────┬──────────────────────┤
│ 전체 N건 | 팝업노출 N건 | 중요공지 N건 │ [+ 공지사항 등록]    │
├──────────────────────────────────────────────────────────┤
│ 제목 │ 대상 │ 팝업여부 │ 중요여부 │ 노출기간 │ 등록자 │ 등록일 │
│  ...                                                     │
├──────────────────────────────────────────────────────────┤
│ [10개▾]  ← 1 / N →                                       │
└──────────────────────────────────────────────────────────┘

[공지사항 등록/수정 모달]
┌───────────────────────────────┐
│ 공지사항 등록|수정        [✕] │
│ 대상*                          │
│ 제목* (full width)             │
│ 내용* (textarea rows=6, full)  │
│ 팝업노출(체크박스) │ 중요공지(체크박스) │
│ 노출시작일 │ 노출종료일          │
│ [삭제](수정시만) [취소] [등록/저장] │
└───────────────────────────────┘
```

---

## Components

| 컴포넌트 | 역할 |
|----------|------|
| FilterBar | 제목 키워드 검색 / 대상(전체·고객·입점사) 선택 및 조회 버튼 |
| SummaryBar | 조회 결과 기준 전체·팝업노출·중요공지 건수 카드. 결과 있을 때만 렌더링 |
| Toolbar | `+ 공지사항 등록` 버튼만 포함 |
| NoticeTable | 공지 목록 테이블. 제목 클릭 시 수정 모달 오픈 |
| Pagination | 페이지 크기 선택 + 이전/다음 이동 |
| AddEditNoticeModal | 등록/수정 겸용 소형 모달. 수정 모드에서만 [삭제] 노출 |
| PopupBadge / ImportantBadge | 팝업여부(노출/미노출), 중요여부(중요/일반) 뱃지 |

---

## States

| 상태 | 처리 |
|------|------|
| 초기(미조회) | "조회 버튼을 눌러 공지사항 목록을 불러오세요." 안내 |
| 로딩 중 | "불러오는 중..." 메시지. 나머지 영역 숨김 |
| 조회 결과 없음 | SummaryBar 숨김. "조회된 공지사항이 없습니다." 안내 |
| 조회 결과 있음 | SummaryBar + Toolbar + Table + Pagination 표시 |
| 유효성 오류 | 제목·내용 미입력 시 필드 하단 "필수" 오류. 등록/저장 차단 |

---

## Interactions

| 액션 | 반응 |
|------|------|
| 필터 입력 후 [조회] | loading = true → 300ms → filterNotices 실행 → displayed 갱신, page = 1 |
| 제목 클릭 | modal = { mode: 'edit', notice } |
| [+ 공지사항 등록] 클릭 | modal = { mode: 'add' } |
| 모달 [등록] | noticeId는 `nextNoticeId(allItems)`로 자동 채번, createdBy = currentUser |
| 모달 [저장] | 해당 noticeId 항목 갱신, updatedAt 현재 시각으로 갱신 |
| 모달 [삭제] (수정 모드만) | allItems에서 제거, 모달 닫힘 |
| 모달 [취소] / [✕] | 모달 닫힘, 변경 없음 |

---

## API

```typescript
// 현재 목업(mockData)으로 동작. 실제 연동 시 아래 엔드포인트를 사용한다.

GET    /api/admin/notices
  Query: keyword, targetType(CUSTOMER|VENDOR|ALL|ALL)
  Response: Notice[]

POST   /api/admin/notices
  Body: { targetType, title, content, isPopup, isImportant, displayFrom, displayTo }
  Response: Notice

PUT    /api/admin/notices/{noticeId}
  Body: { targetType, title, content, isPopup, isImportant, displayFrom, displayTo }
  Response: Notice

DELETE /api/admin/notices/{noticeId}
  Response: 204

// 타입 정의 (cfg_notice)
type NoticeTargetType = 'CUSTOMER' | 'VENDOR' | 'ALL'

interface Notice {
  noticeId: string; targetType: NoticeTargetType; title: string; content: string
  isPopup: boolean; isImportant: boolean
  displayFrom: string | null; displayTo: string | null
  createdBy: string; createdAt: string; updatedAt: string
}
```

---

## UX Rules

- 조회는 [조회] 버튼을 눌러야만 실행된다.
- 노출시작일·노출종료일이 모두 비어 있으면 목록에서 "상시"로 표시한다.
- 팝업노출(`isPopup`)은 로그인 시 팝업 배너로 노출되는지 여부이며, 중요공지(`isImportant`)는 목록 상단 고정 여부를 의미한다(둘은 독립적으로 설정 가능).
- [삭제]는 수정 모달에서만 노출되며, 클릭 즉시 목록에서 제거된다(확인 팝업 없음, mock 동작).
- `[스펙]` 버튼 클릭 시 SpecModal이 열리며 현재 spec.md 내용을 표시한다.
