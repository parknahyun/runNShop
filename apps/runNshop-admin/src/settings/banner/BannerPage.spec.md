# BannerPage — UI 정의

## Overview
| 항목 | 내용 |
|------|------|
| 목적 | 메인·카테고리 화면에 노출되는 배너를 위치별·순서별로 등록·관리한다 |
| 대상 | 운영자 (어드민) |
| 진입 경로 | 어드민 > 설정 > 배너 관리 |
| URL | /admin/settings/banner |
| 관련 컴포넌트 | FilterBar, SummaryBar, Toolbar, BannerTable, Pagination, AddEditBannerModal |

---

## Layout

```
┌────────────────────────────────────────────────────────────┐
│ 배너 관리                                [스펙]            │
├────────────────────────────────────────────────────────────┤
│ [배너 제목 검색] [전체 위치▾] [조회]                        │
├──────────────────────────────────────┬───────────────────────┤
│ 전체 N건 | 위치별 N건                 │ [+ 배너 등록]         │
├────────────────────────────────────────────────────────────┤
│ 노출위치 │ 제목 │ 이미지(썸네일) │ 정렬순서 │ 노출기간 │ 등록자 │
│   ...                                                      │
├────────────────────────────────────────────────────────────┤
│ [10개▾]  ← 1 / N →                                         │
└────────────────────────────────────────────────────────────┘

[배너 등록/수정 모달]
┌───────────────────────────────┐
│ 배너 등록|수정            [✕] │
│ 노출위치*    │ 정렬순서*        │
│ 제목* (full width)             │
│ 이미지URL* (full width)        │
│ 링크URL (full width)           │
│ 노출시작일 │ 노출종료일         │
│ [삭제](수정시만) [취소] [등록/저장] │
└───────────────────────────────┘
```

---

## Components

| 컴포넌트 | 역할 |
|----------|------|
| FilterBar | 배너 제목 검색 / 노출위치 선택 및 조회 버튼 |
| SummaryBar | 조회 결과 기준 전체 건수 + 노출위치별(메인 상단/메인 중단/카테고리 상단) 건수 카드 |
| Toolbar | `+ 배너 등록` 버튼만 포함 |
| BannerTable | 배너 목록 테이블. 이미지 URL을 40px 높이 썸네일로 미리보기. 제목 클릭 시 수정 모달 오픈 |
| Pagination | 페이지 크기 선택 + 이전/다음 이동 |
| AddEditBannerModal | 등록/수정 겸용 소형 모달. 수정 모드에서만 [삭제] 노출 |

---

## States

| 상태 | 처리 |
|------|------|
| 초기(미조회) | "조회 버튼을 눌러 배너 목록을 불러오세요." 안내 |
| 로딩 중 | "불러오는 중..." 메시지. 나머지 영역 숨김 |
| 조회 결과 없음 | SummaryBar 숨김. "조회된 배너가 없습니다." 안내 |
| 조회 결과 있음 | SummaryBar + Toolbar + Table + Pagination 표시 |
| 유효성 오류 | 제목·이미지URL 미입력 또는 정렬순서가 숫자가 아니면 필드 하단 오류 표시. 등록/저장 차단 |

---

## Interactions

| 액션 | 반응 |
|------|------|
| 필터 입력 후 [조회] | loading = true → 300ms → filterBanners 실행 → displayed 갱신(노출위치→정렬순서 순 정렬), page = 1 |
| 배너 행 클릭 | modal = { mode: 'edit', banner } |
| [+ 배너 등록] 클릭 | modal = { mode: 'add' } |
| 모달 [등록] | bannerId는 `nextBannerId(allItems)`로 자동 채번 |
| 모달 [저장] | 해당 bannerId 항목 갱신 |
| 모달 [삭제] (수정 모드만) | allItems에서 제거, 모달 닫힘 |
| 모달 [취소] / [✕] | 모달 닫힘, 변경 없음 |

---

## API

```typescript
// 현재 목업(mockData)으로 동작. 실제 연동 시 아래 엔드포인트를 사용한다.

GET    /api/admin/banners
  Query: keyword, positionCode(MAIN_TOP|MAIN_MIDDLE|CATEGORY_TOP|ALL)
  Response: Banner[]

POST   /api/admin/banners
  Body: { positionCode, title, imageUrl, linkUrl, sortOrder, displayFrom, displayTo }
  Response: Banner

PUT    /api/admin/banners/{bannerId}
  Body: { positionCode, title, imageUrl, linkUrl, sortOrder, displayFrom, displayTo }
  Response: Banner

DELETE /api/admin/banners/{bannerId}
  Response: 204

// 타입 정의 (cfg_banner)
type BannerPosition = 'MAIN_TOP' | 'MAIN_MIDDLE' | 'CATEGORY_TOP'

interface Banner {
  bannerId: string; positionCode: BannerPosition; title: string; imageUrl: string
  linkUrl: string | null; sortOrder: number
  displayFrom: string | null; displayTo: string | null
  createdBy: string; createdAt: string; updatedAt: string
}
```

---

## UX Rules

- 조회는 [조회] 버튼을 눌러야만 실행된다.
- 이미지는 실제 업로드 없이 URL 입력만 지원한다(mock). placeholder 서비스 URL(`https://via.placeholder.com/...`) 예시를 안내한다.
- 정렬순서는 같은 노출위치 내에서 오름차순으로 배너가 표시되는 순서를 의미한다. 목록은 노출위치 → 정렬순서 순으로 정렬된다.
- 노출시작일·노출종료일이 모두 비어 있으면 목록에서 "상시"로 표시한다.
- 링크URL은 선택 입력이며, 비어 있으면 클릭 시 이동 없는 순수 이미지 배너로 동작한다(mock에서는 실제 이동을 구현하지 않는다).
- [삭제]는 수정 모달에서만 노출되며, 클릭 즉시 목록에서 제거된다(확인 팝업 없음, mock 동작).
- `[스펙]` 버튼 클릭 시 SpecModal이 열리며 현재 spec.md 내용을 표시한다.
