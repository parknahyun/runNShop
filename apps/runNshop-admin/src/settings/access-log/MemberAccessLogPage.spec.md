# MemberAccessLogPage — UI 정의

## Overview
| 항목 | 내용 |
|------|------|
| 목적 | 운영자가 회원(고객)의 개인정보를 조회한 이력을 감사(audit)할 수 있도록 접근 로그를 조회하는 화면. 어떤 운영자가 언제 어떤 회원 정보를 왜(어떤 검색어로) 조회했는지 추적하여 개인정보 오남용을 방지한다 |
| 대상 | 운영자 (어드민, 개인정보보호책임자 등 감사 목적) |
| 진입 경로 | 어드민 > 설정 > 고객정보 접근 이력 |
| URL | /admin/settings/access-log |
| 관련 컴포넌트 | FilterBar, SummaryBar, Toolbar, AccessLogTable, Pagination |
| 등록/수정/삭제 | 없음 — 조회 전용(읽기 전용) 화면. 로그는 시스템이 자동 기록하며 운영자가 직접 생성·변경할 수 없다 |

---

## Layout

```
┌───────────────────────────────────────────────────────────────┐
│ 고객정보 접근 이력                              [스펙]         │
├───────────────────────────────────────────────────────────────┤
│ [운영자명·대상회원] [전체 구분▾] [시작일] ~ [종료일] [조회]      │
├─────────────────────────────────────┬───────────────────────────┤
│ 전체 N건 | 목록조회 N건 | 상세조회 N건 │ [엑셀 다운로드]           │
├───────────────────────────────────────────────────────────────┤
│ 접근시각 │ 운영자명 │ 역할 │ 구분 │ 검색어 │ 대상회원 │ 조회건수 │ IP │
│   ...                                                         │
├───────────────────────────────────────────────────────────────┤
│ [10개▾]  ← 1 / N →                                            │
└───────────────────────────────────────────────────────────────┘
```

행 클릭에 반응하지 않으며 상세 모달을 열지 않는다 — 로그 그 자체가 조회 대상이므로 하위 상세 화면이 필요 없다.

---

## Components

| 컴포넌트 | 역할 |
|----------|------|
| FilterBar | 키워드(운영자명·대상회원) / 구분(전체·목록조회·상세조회) / 기간(from~to) 및 조회 버튼 |
| SummaryBar | 조회 결과 기준 전체·목록조회·상세조회 건수 카드. 결과 있을 때만 렌더링 |
| Toolbar | `엑셀 다운로드` 버튼만 포함 (등록 버튼 없음) |
| AccessLogTable | 접근 로그 목록 테이블. 행 클릭 동작 없음 |
| Pagination | 페이지 크기 선택 + 이전/다음 이동 |
| AccessTypeBadge | `LIST`(목록조회) / `DETAIL`(상세조회) 뱃지 |

---

## States

| 상태 | 처리 |
|------|------|
| 초기(미조회) | "조회 버튼을 눌러 접근 이력 목록을 불러오세요." 안내 |
| 로딩 중 | "불러오는 중..." 메시지. 나머지 영역 숨김 |
| 조회 결과 없음(조회 이력 있음) | SummaryBar 숨김. "조건에 맞는 접근 이력이 없습니다." 안내 |
| 조회 결과 있음 | SummaryBar + Toolbar + Table + Pagination 표시 |

---

## Interactions

| 액션 | 반응 |
|------|------|
| 필터 입력 후 [조회] | loading = true → 300ms → filterMemberAccessLogs 실행 → displayed 갱신, page = 1, searched = true |
| [엑셀 다운로드] 클릭 | `alert('엑셀 다운로드 기능은 준비 중입니다.')` (mock 스텁) |
| 페이지 크기/페이지 변경 | pageSize·page 갱신. 크기 변경 시 page = 1 |

---

## API

```typescript
// 현재 목업(mockData)으로 동작. 실제 연동 시 아래 엔드포인트를 사용한다.
// 등록/수정/삭제 API는 없다 — 로그는 회원 목록·상세 조회 시 시스템이 자동 기록한다.

GET    /api/admin/member-access-logs
  Query: keyword(operatorName|memberName), accessType(LIST|DETAIL|ALL), from, to
  Response: MemberAccessLog[]

GET    /api/admin/member-access-logs/excel
  Query: (위와 동일한 조회 조건)
  Response: (엑셀 파일 스트림)

// 타입 정의 (adt_member_access_log)
type MemberAccessType = 'LIST' | 'DETAIL'

interface MemberAccessLog {
  logId: string; operatorName: string; operatorRole: string
  accessType: MemberAccessType
  searchKeyword: string; memberName: string; resultCount: number | null
  accessIp: string; accessAt: string
}
```

---

## UX Rules

- 조회는 [조회] 버튼을 눌러야만 실행된다. 진입 시 자동 조회하지 않는다.
- 등록/수정/삭제 기능이 없다 — 순수 조회·감사 목적 화면이다.
- `resultCount`는 `accessType = LIST`(목록조회)일 때만 값이 존재하며, `DETAIL`(상세조회)에서는 `-`로 표시한다.
- `searchKeyword`와 `memberName`은 이미 마스킹된 값으로 기록된다(예: `010-****-5678`, `홍*동`). 본 화면은 마스킹된 값을 그대로 노출할 뿐 추가 마스킹 처리를 하지 않는다.
- 본 화면은 [회원 목록](../../member/list/MemberPage.spec.md)에서 발생하는 검색·상세조회 행위가 기록되는 `adt_member_access_log`를 조회하는 화면이다. 회원 목록 화면의 비고에는 상태변경·포인트지급·쿠폰발급 등 `ACTION` 유형과 `target_type`(MEMBER/MEMBER_POINT/MEMBER_COUPON)까지 포함한 더 넓은 로깅 범위가 기술되어 있으나, 본 화면은 그중 회원 조회(목록·상세) 이력만을 다루는 것으로 범위를 한정했다. 실 연동 시에는 `access_type`에 `ACTION`을, 컬럼에 `target_type`을 추가하는 확장을 고려한다.
- `[스펙]` 버튼 클릭 시 SpecModal이 열리며 현재 spec.md 내용을 표시한다.
