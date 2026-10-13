# OperatorStatus — UI 정의

## Overview
| 항목 | 내용 |
|------|------|
| 목적 | 시스템에 등록된 운영자 계정을 조회·추가·수정하고, 권한·상태·이력을 통합 관리한다 |
| 대상 | 운영자 (어드민) |
| 진입 경로 | 어드민 > 시스템 관리 > 운영자 현황 |
| URL | /system/operator-status |
| 관련 컴포넌트 | OperatorDetail, AddOperatorModal, Pagination, InnerTabs |

---

## Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  운영자 현황                                      [스펙]         │
├─────────────────────────────────────────────────────────────────┤
│  [이름] [로그인 ID] [전체 권한 ▾] [전체 상태 ▾]  [조회]         │
├──────────────────────────────────────────────────────────────────┤
│  (로딩 중 → "불러오는 중..." 메시지만 표시)                      │
│                                                                  │
│  (비로딩 시)                                                     │
│  ┌─────────────────────────────────┬──────────────────────────┐ │
│  │  SummaryBar (결과 있을 때만)    │  [+ 운영자 추가]          │ │
│  │  전체 N명 | 활동 N명 |          │                           │ │
│  │  신청 N명 | ⚠중지 N명 | 탈퇴 N명│                           │ │
│  └─────────────────────────────────┴──────────────────────────┘ │
│                                                                  │
│  (결과 있음)                                                     │
│  운영자ID │ 이름 │ 로그인ID │ 부서 │ 권한 │ 상태 │ 최근 로그인  │
│  ──────────────────────────────────────────────────────────────  │
│  (행 클릭 → 상세 모달)                                           │
│  [7개 ▾]  ← 1 / N →                                            │
│                                                                  │
│  (결과 없음)                                                     │
│  "조회 버튼을 눌러 운영자 목록을 불러오세요."                    │
└─────────────────────────────────────────────────────────────────┘

[운영자 상세 모달]
┌──────────────────────────────────────────────────┐
│  {이름}  운영자 상세                          [✕] │
├──────────────────────────────────────────────────┤
│  [기본정보] [프로그램 접근 권한] [로그인 이력] [화면 접근 이력] │
│  (탭 콘텐츠 영역 — sticky 탭바)                  │
└──────────────────────────────────────────────────┘

[운영자 추가 모달 (small, detail-modal--sm)]
┌──────────────────────────────────┐
│  운영자 추가                  [✕]│
├──────────────────────────────────┤
│  이름*        │ 로그인 ID*        │
│  이메일       │ 연락처            │
│  부서         │ 권한*  │ 상태*    │
│                  [취소]  [등록]   │
└──────────────────────────────────┘
```

---

## Components

| 컴포넌트 | 역할 |
|----------|------|
| FilterBar | 이름·로그인ID 텍스트 검색 + 권한·상태 셀렉트 필터 + 조회 버튼 |
| SummaryBar | 조회 결과 기준 전체·활동·(신청)·(중지)·(탈퇴) 인원 수 카드 표시 |
| Toolbar | `+ 운영자 추가` 버튼 (`pgm-toolbar` 클래스) |
| OperatorTable | 운영자 목록 테이블 (행 클릭 시 상세 모달 오픈, 행에 `data-op-status-row` 속성) |
| Pagination | 페이지 크기 선택 (7/14/30/50/100개) + 페이지 이동 |
| RoleBadge | 권한 레이블 뱃지 (`data-op-role` 속성, SUPER_ADMIN / ADMIN / OPERATOR / VIEWER) |
| StatusBadge | 상태 레이블 뱃지 (`data-op-status` 속성, APPLIED / ACTIVE / SUSPENDED / WITHDRAWN) |
| OperatorDetail | 선택 운영자의 탭형 상세 모달 (overlay + `detail-modal`) |
| AddOperatorModal | 운영자 신규 등록 소형 모달 (`detail-modal--sm`) |
| SpecModal | 스펙 문서를 표시하는 모달 (스펙 버튼으로 토글) |

---

## States

| 상태 | 처리 |
|------|------|
| 로딩 중 | `loading === true` — "불러오는 중..." 메시지만 표시. SummaryBar·Toolbar·테이블·페이지네이션 모두 숨김 |
| 조회 결과 없음 (초기 포함) | `displayed.length === 0` — "조회 버튼을 눌러 운영자 목록을 불러오세요." 메시지 표시, SummaryBar 비표시, Toolbar 표시 |
| 조회 결과 있음 | `displayed.length > 0` — SummaryBar + 테이블 + 페이지네이션 표시 |
| 신청(APPLIED) 인원 존재 | SummaryBar에 `summary-card--info` 클래스 "신청 N명" 카드 추가 표시 |
| 중지(SUSPENDED) 인원 존재 | SummaryBar에 `summary-card--warn` 클래스 "⚠ 중지 N명" 카드 추가 표시 |
| 탈퇴(WITHDRAWN) 인원 존재 | SummaryBar에 `summary-card--muted` 클래스 "탈퇴 N명" 카드 추가 표시 |
| 유효성 오류 (추가 모달) | 이름·로그인ID 미입력 시 해당 필드 하단에 "필수" 오류 메시지 표시 |

---

## Interactions

| 액션 | 반응 |
|------|------|
| 필터 입력 후 [조회] 클릭 | `loading` true → 300ms 후 `filterOperators` 결과를 `displayed`에 반영, 페이지 1로 리셋, `loading` false |
| 테이블 행 클릭 | `detailOperator` 상태에 해당 운영자 설정 → OperatorDetail 모달 오픈 |
| [+ 운영자 추가] 클릭 | `showAdd` true → AddOperatorModal 오픈 |
| 추가 모달 [등록] 클릭 | 유효성 검사 통과 시 신규 운영자를 `allOperators`·`displayed`에 반영, 모달 닫기 |
| 추가 모달 [취소] / [✕] 클릭 | 모달 닫기 (`showAdd` false) |
| 상세 모달 [✕] 클릭 | `detailOperator` null → 모달 닫기 |
| OperatorDetail `onUpdate` 콜백 | `allOperators` 갱신 후 현재 필터로 `displayed` 재계산, `detailOperator`를 수정된 값으로 업데이트 |
| 탭 전환 (기본정보/권한/로그인/화면) | 해당 탭 콘텐츠 표시로 전환 (InnerTabs) |
| 페이지 크기 변경 | `pageSize` 갱신, 페이지 1로 리셋 |
| 페이지 이동 버튼 | 이전/다음 페이지로 이동 (경계값에서 비활성화) |
| [스펙] 버튼 클릭 | SpecModal 오픈 |

---

## API

```typescript
// 현재 구현은 목(mock) 데이터 기반. 실제 API 연동 시 아래 엔드포인트 사용 예정.

// 운영자 목록 조회
GET /api/system/operators
  Query: name?, loginId?, role?: SUPER_ADMIN|ADMIN|OPERATOR|VIEWER|ALL
         status?: APPLIED|ACTIVE|SUSPENDED|WITHDRAWN|ALL
         page, pageSize
  Response: { data: Operator[], total: number }

// 운영자 상세 조회
GET /api/system/operators/:operatorId
  Response: Operator (permissions, loginHistory, screenHistory 포함)

// 운영자 등록
POST /api/system/operators
  Body: { name, loginId, email?, phone?, department?, role, status }
  Response: Operator

// 운영자 수정
PUT /api/system/operators/:operatorId
  Body: { name, email?, phone?, department?, role, status }
  Response: Operator

// 타입 정의 (mockData.ts 기준)
type OperatorRole   = 'SUPER_ADMIN' | 'ADMIN' | 'OPERATOR' | 'VIEWER'
type OperatorStatus = 'APPLIED' | 'ACTIVE' | 'SUSPENDED' | 'WITHDRAWN'

interface OperatorPermission {
  menu: string
  read: boolean
  write: boolean
}

interface LoginHistory {
  loginAt: string   // 'YYYY-MM-DD HH:mm:ss'
  ip: string
  device: string
  result: 'SUCCESS' | 'FAIL'
}

interface ScreenAccessHistory {
  accessAt: string  // 'YYYY-MM-DD HH:mm:ss'
  menu: string
  screen: string
  action: string
  ip: string
}

interface Operator {
  operatorId: string        // 예: OPR-001
  name: string
  loginId: string
  email: string
  phone: string
  department: string
  role: OperatorRole
  status: OperatorStatus
  permissions: OperatorPermission[]
  loginHistory: LoginHistory[]
  screenHistory: ScreenAccessHistory[]
  createdBy: string
  createdAt: string         // 'YYYY-MM-DD HH:mm:ss'
  updatedBy: string
  updatedAt: string         // 'YYYY-MM-DD HH:mm:ss'
  lastLoginAt: string       // 'YYYY-MM-DD HH:mm:ss' 또는 '—'
}

interface OperatorFilter {
  name: string
  loginId: string
  role: OperatorRole | 'ALL'
  status: OperatorStatus | 'ALL'
}
```

---

## UX Rules

- 조회 버튼을 명시적으로 눌러야만 목록을 불러온다. 페이지 진입 시 자동 조회하지 않는다.
- 조회 결과가 없으면(`displayed.length === 0`) 페이지 초기 진입 상태와 구분 없이 동일 메시지("조회 버튼을 눌러 운영자 목록을 불러오세요.")를 표시한다.
- SummaryBar는 조회 결과가 1건 이상일 때만 표시한다. 신청·중지·탈퇴는 해당 인원이 있을 때만 해당 카드를 조건부로 추가 표시한다.
- Toolbar(`+ 운영자 추가` 버튼)는 로딩 중에는 숨기고, 비로딩 상태에서는 결과 유무와 관계없이 항상 표시한다. SummaryBar와 같은 `op-summary-row` 행에 위치한다.
- SummaryBar가 없을 때 Toolbar는 `op-summary-row` 오른쪽 끝에 단독으로 표시된다.
- 테이블 행 전체가 클릭 영역이다. 운영자 ID 셀은 `link-cell` 클래스로 강조 표시된다. 행에는 `data-op-status-row` 속성으로 상태값이 부여된다.
- 운영자 추가 시 이름·로그인ID는 필수(`*` 표시)이며, 권한 기본값은 조회자(VIEWER), 상태 기본값은 신청(APPLIED)이다. 권한 필드도 `*` 표시(필수 선택)로 표시된다.
- 운영자 ID는 기존 목록의 최댓값 + 1을 `OPR-NNN` 형식(3자리 패딩)으로 자동 채번한다.
- 신규 운영자의 `permissions`는 `DEFAULT_PERMISSIONS`(전 메뉴 read/write false)로 초기화된다.
- 신규 운영자의 `loginHistory`·`screenHistory`는 빈 배열로, `lastLoginAt`은 '—'로 초기화된다.
- 페이지 크기 선택지: 7 / 14 / 30 / 50 / 100개. 기본값 7개. 변경 시 페이지는 1로 리셋된다.
- 로딩 중에는 SummaryBar, Toolbar, 테이블, 페이지네이션 등 모든 콘텐츠를 숨기고 로딩 메시지만 표시한다.
- 상세 편집 후 저장 시 `allOperators`와 `displayed` 양쪽 모두 갱신되며, 모달에 표시 중인 `detailOperator`도 수정된 값으로 업데이트된다.
