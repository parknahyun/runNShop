# 공통 레이아웃 — AppShell (admin 전체 적용)

> 도메인 공통 사항·작성 방향은 [Shell-readme.md](Shell-readme.md), [../../README.md](../../README.md)
> (화면정의서 작성 기준) 참고.
>
> **화면 ID 없음** — 이 문서는 특정 화면이 아니라 admin 앱의 모든 화면이 공통으로 올라타는
> 셸(NavBar + TabBar + TabContent)을 다룬다. [01-Dashboard.md](01-Dashboard.md)(`ADM-HOME`)를
> 포함해 다른 모든 도메인 화면(Display, Order, Member, ...)이 이 셸 안에서 탭 하나로 열린다 —
> 대시보드는 그중 첫 번째로 고정된 탭일 뿐, 이 문서가 다루는 셸 자체의 일부가 아니다. 로그인
> 화면(`ADM-000-001`) 자체의 폼 구성·Mock 동작은 [02-Login.md](02-Login.md) 참고 — 이 문서는
> 로그인 이후(또는 세션 확인 중) `app/page.tsx`가 어떻게 셸로 넘어오는지 흐름만 다룬다.
>
> **⑤ 화면정의서 하네스 표준양식**(`docs/x. 하네스/표준양식/05. 화면정의서 하네스 표준양식 v1 0.md`)
> 기준으로 작성한다. 그 표준양식은 "화면 하나당 문서 하나, 화면 ID 하나"를 전제로 하는데,
> 이 문서는 특정 화면이 아니라 모든 화면이 공통으로 쓰는 셸(공통 컴포넌트)이라 화면 ID가 없다
> — 그래서 아래 "하네스 헤더"는 `화면 ID: (해당 없음 — 공통 컴포넌트)`로 표기하고,
> `[UI 요소]`·`[화면 전환]`·AI-H12/13/14는 "화면 하나"가 아니라 "셸 자체"를 대상으로 채운다.
> [01-Dashboard.md](01-Dashboard.md)·[02-Login.md](02-Login.md)는 실제 화면 ID가 있어 표준양식에
> 그대로 맞아 들어간다.
>
> **이 문서는 기준(spec)이다.** 원본 문서(`docs/6. 화면정의/runNshop_screen_definition_v1_1.md`
> §3.1 공통 레이아웃 / §3.2 롤별 메뉴 접근 권한 / §3.3 메뉴 트리)를 기준으로 셸이 어떻게 동작해야
> 하는지 먼저 정의하고, 현재 소스(`shell/AppShell.tsx`, `TabContext.tsx`, `app/page.tsx`)가 그
> 기준과 다른 부분은 각 절 끝의 **"소스 수정 필요"**로 명시한다.
>
> **디자인 시스템**: admin 앱은 별도 프레임워크 없이 `src/app/globals.css` 하나로 만든 자체 CSS
> 디자인 시스템을 쓴다. 색상·타이포그래피·버튼·폼·레이아웃 토큰은 앱 내 개발자용 가이드 화면
> (`system` 메뉴의 `guide/ui`, 컴포넌트 `guide/GuidePage.tsx`)의 **"디자인 시스템" 탭**
> (`guide/tabs/DesignSystemGuide.tsx`)에 이미 정리돼 있다 — 이 문서와 소스가 쓰는 색상 hex 값
> (`#1e293b`, `#3b82f6` 등)은 전부 거기서 가져온 것이다. 같은 가이드 화면의 **"메인 프레임"
> 탭**(`guide/tabs/MainGuide.tsx`)이 AppShell 레이아웃 자체의, **"로그인" 탭**
> (`guide/tabs/LoginGuide.tsx`)이 로그인 화면의, **"대시보드 탭" 탭**(`guide/tabs/DashboardGuide.tsx`)이
> 대시보드의 참고 스펙을 이미 갖고 있었다 — 이 문서들을 작성/구현하며 그 내용과 실제 소스를
> 대조해 어긋난 곳(예: `MainGuide.tsx`가 옛날 "탭 최대 8개+비활성화" 동작을 그대로 적어둔 것,
> `LoginGuide.tsx`의 "세션 항상 유지" 규칙을 처음엔 놓친 것)을 찾아 양쪽을 맞췄다.

## 하네스 헤더

```
화면 ID   : (해당 없음 — 공통 컴포넌트, admin 전체 화면에 적용)
화면명    : 공통 레이아웃 (AppShell)
앱        : 어드민 (runNshop-admin)
화면 유형 : (해당 없음 — 셸/레이아웃 컴포넌트. 표준양식의 목록/상세/등록/수정/팝업 분류 대상 아님)
접근 권한 : 로그인한 모든 운영자 — 단, 메뉴 노출은 role별로 다름(아래 "롤별 메뉴 접근 권한" 참고)
```

## [레이아웃]

```
┌──────────────────────────────────────────────────────────┐
│ 🛍 Admin   [상품 관리▼] [프로모션▼] ... [시스템▼]   [🔔] [사용자명] [로그아웃] │  ← NavBar
├──────────────────────────────────────────────────────────┤
│ 📌 대시보드   [탭2 ×]  [탭3 ×]  ...  (최대 9개, 초과 시 가장 오래된 탭 자동 닫힘) │  ← TabBar
├──────────────────────────────────────────────────────────┤
│                        TabContent                          │  ← 현재 활성 탭의 화면(대시보드 포함 모든 도메인 화면)
└──────────────────────────────────────────────────────────┘
```

Breadcrumb 바는 만들지 않기로 결정했다 — 아래 "Breadcrumb — 제거 결정" 참고.

## [UI 요소]

| # | 요소 | 타입 | 동작 | 비고 |
|---|------|------|------|------|
| 1 | 브랜드 로고 | text | 없음 | 🛍 Admin |
| 2 | 1depth 메뉴(9개) | dropdown | 클릭 → 드롭다운 열기/닫기, 바깥 클릭 시 닫힘 | 아래 "메뉴 구조 정책" 참고 |
| 3 | 2/3depth 메뉴 항목 | dropdown item | 클릭 → 탭 열기(이미 열려 있으면 활성화만) | `system` 그룹만 3depth |
| 4 | 알림(🔔) | icon | 미정 | 아래 "알림 — 미정 항목" 참고 |
| 5 | 사용자명 표시 | text | 없음 | 로그인 세션의 `userId` |
| 6 | 로그아웃 버튼 | button | 클릭 → 세션 삭제 → 로그인 화면으로 전환 | |
| 7 | 대시보드 탭(고정) | tab | 클릭 → 활성화, 닫기 불가 | `pinned: true` |
| 8 | 일반 탭(최대 9개) | tab | 클릭 → 활성화, ×클릭 → 닫기 | 초과 시 LRU 자동 닫힘(아래 참고) |
| 9 | 탭 콘텐츠 영역 | container | 활성 탭의 화면 렌더링 | |

## [화면 전환]

- 메뉴 항목 클릭 → 해당 화면(각 도메인 화면정의서의 화면 ID)을 탭으로 열기 — 예: `product/list` → 상품 목록 화면
- 로그아웃 버튼 → `ADM-000-001` (로그인, [02-Login.md](02-Login.md))

## AI 보강 섹션

### [AI-H12] 컴포넌트-API 매핑

| UI 요소/영역 | 호출 API | 시점 | 비고 |
|---|---|---|---|
| 셸 전체(AppShell 마운트) | `GET /api/admin/v1/programs` | role이 정해질 때(로그인 직후, role 변경 시) | `navMenus.fetchProgramList(role)` — role별로 필터링된 메뉴 목록을 응답으로 받음 |
| 로그아웃 버튼 | `POST /api/admin/v1/auth/logout` | onClick | 현재는 `localStorage` 삭제뿐, 실제 API 호출 없음(`mockAuth.logout()`) |

### [AI-H13] 유효성 검증 규칙 (프론트)

해당 없음 — 입력 폼이 없는 순수 네비게이션/레이아웃 컴포넌트.

### [AI-H14] 화면 상태 관리

```
states:
  - name: session
    source: GET /api/admin/v1/auth/me
    refresh_trigger: ["로그인 성공", "로그아웃"]
  - name: menus
    source: GET /api/admin/v1/programs
    refresh_trigger: ["role 변경(로그인 직후 최초 1회)"]
  - name: tabs
    derived: "TabContext의 openTab/closeTab/activateTab으로 관리되는 배열 상태(API 아님)"
  - name: openMenuId
    derived: "현재 열려 있는 1depth 드롭다운 id(NavBar 로컬 상태, API 아님)"

loading_states:
  - api: GET /api/admin/v1/auth/me
    skeleton: false   # "로그인 확인 중..." 텍스트로 대체
  - api: GET /api/admin/v1/programs
    skeleton: false   # "메뉴 불러오는 중..." 텍스트로 대체(NavBar 메뉴 영역)
```

---

## 보강 설명

### 개요
`app/page.tsx`가 진입점이자 인증 게이트다: 로그인 세션이 유효하지 않으면 로그인 화면을 보여주고,
유효하면 admin SPA 전체를 감싸는 셸(AppShell)을 렌더링한다. 셸의 상단 메뉴바(NavBar)에서 화면을
선택하면 MDI 방식 탭바(TabBar)에 탭으로 열리고, 탭 콘텐츠 영역(TabContent)에 해당 도메인 화면이
렌더링된다. 메뉴는 로그인 후 확정된 역할(role)로 "프로그램목록 API"를 호출해 그 역할이 접근
가능한 메뉴만 받아와 활성화한다 — 아래 "로그인 게이팅 + 메뉴 로딩 흐름" 참고.

### 화면 구성

| 구성 요소 | 역할 | 구현 위치 |
|------|---------|------|
| 진입점 · 인증 게이트 | 세션 확인 → 로그인 화면 또는 셸 분기 | `apps/runNshop-admin/src/app/page.tsx` |
| 로그인 화면 (`ADM-000-001`) | `layer` — [02-Login.md](02-Login.md) 참고 | `apps/runNshop-admin/src/shell/LoginScreen.tsx` |
| 세션(로그인 유효성 확인·로그인·로그아웃) | Mock API 함수 | `apps/runNshop-admin/src/shell/mockAuth.ts` |
| AppShell (NavBar+TabBar+TabContent) | 공통 레이아웃 — 구성 순서는 위 "[레이아웃]" 참고, 조각별 상세는 "메뉴 구조 정책"·"탭 정책" 참고 | `apps/runNshop-admin/src/shell/AppShell.tsx` |
| 메뉴 구조 (id/라벨/롤) + 프로그램목록 API | Mock 데이터 + Mock API 함수 (단일 소스) — 정의는 "메뉴 구조 정책"·"메뉴 트리"·"롤별 메뉴 접근 권한" 참고 | `apps/runNshop-admin/src/shell/navMenus.ts` |
| 탭 상태 관리 | Context (열기/닫기/활성화/LRU) — 정의는 "탭 데이터 구조"·"LRU 자동 닫힘" 참고 | `apps/runNshop-admin/src/shell/TabContext.tsx` |
| 운영자 신청 / 비밀번호 변경 최초 (`ADM-000-002~003`) | `layer` | **미구현** — [02-Login.md](02-Login.md) "이번 범위 밖" 참고 |

### 로그인 게이팅 + 메뉴 로딩 흐름 (구현 완료, Mock)

```
app/page.tsx
  ├─ checkSession() 호출 (Mock: GET /api/admin/v1/auth/me 격)
  │    ├─ 세션 없음/무효 → <LoginScreen />
  │    │      └─ 로그인 제출 → login(email, password) (Mock: POST /api/admin/v1/auth/login 격)
  │    │             └─ 성공 시 role='SUPER' 고정 세션 반환 → <AppShell role="SUPER" .../>
  │    └─ 세션 있음(localStorage에 저장돼 있음) → <AppShell role={session.role} .../>
  └─ <AppShell role>
        └─ role이 정해지면 fetchProgramList(role) 호출 (Mock: GET /api/admin/v1/programs 격)
              └─ role이 접근 가능한 메뉴 그룹만 응답으로 받아 NavBar에 그대로 렌더링
                 (클라이언트가 다시 필터링하지 않음 — 권한 필터링은 API 응답 시점에 끝난 것으로 취급)
```

인증 상태는 `localStorage`에 저장한다(`guide/ui`의 "로그인" 가이드 규칙: "세션 만료 없이 항상
로그인 유지") — 새로고침해도 로그인 상태가 풀리지 않는다. 로그아웃을 눌러야만 세션이 사라진다.
실제 세션 저장(쿠키/토큰)은 진짜 로그인 API 연동 시 구현한다.

`fetchProgramList` 응답을 기다리는 동안(약 300ms) NavBar의 메뉴 영역은 드롭다운 대신
"메뉴 불러오는 중..." 텍스트를 보여준다.

### 연동 필요 API (현재 Mock) — [AI-H12] 상세

| API | Method | URL(가정) | 구현 위치 | 원본 §3.5 대응 |
|---|---|---|---|---|
| 로그인 유효성 확인 | GET | `/api/admin/v1/auth/me` | `mockAuth.checkSession()` | 없음(신규) |
| 로그인 | POST | `/api/admin/v1/auth/login` | `mockAuth.login()` | API #1 |
| 로그아웃 | POST | `/api/admin/v1/auth/logout` | `mockAuth.logout()`(현재는 `localStorage` 삭제뿐, 실제 API 호출 없음) | API #3 |
| 프로그램(메뉴)목록 조회 | GET | `/api/admin/v1/programs` | `navMenus.fetchProgramList(role)` | **없음(신규)** — 원본 API 매핑표에 없던 개념. `system` 메뉴의 "프로그램 관리"(`system/permission`) 화면이 관리하는 데이터를 조회하는 API로 추정 |

토큰 갱신(원본 API #2, `/auth/refresh`)은 세션을 영구 유지하는 현재 Mock 방식에선 필요 없어
다루지 않았다 — 실제 로그인 연동 시 토큰 만료 정책과 함께 재검토 필요. 로그인 화면 자체의
API 상세는 [02-Login.md](02-Login.md) "[AI-H12] 컴포넌트-API 매핑" 참고(위 표와 동일 내용,
로그인 화면 관점으로 반복 기술).

### 메뉴 구조 정책 (구현 완료)

- **1depth 최대 9개**: `NAV_MENU_STRUCTURE`(상단 메뉴바 그룹) 배열 길이가 정확히 9개 —
  상품/프로모션/주문/회원/입점사/정산/커뮤니티/운영설정/시스템. 원본 §3.3도 9개 그룹이라 개수
  기준으로는 이미 일치.
- **최대 3depth**: 1depth=그룹, 2depth=`items`의 각 원소(리프이거나 하위그룹 라벨),
  3depth=하위그룹의 `children`(리프). 이보다 더 깊이 중첩하지 않는다. 대부분 그룹은
  2depth에서 바로 리프(화면)로 끝나고, `system` 그룹만 9개 화면이 한 드롭다운에 평평하게
  나열돼 있던 걸 "계정·권한"/"인프라 운영" 2개 하위그룹(2depth)으로 나눠 3depth까지 사용한다
  (아래 "시스템 메뉴 상세" 참고).

### 메뉴 트리 — 기준(원본 §3.3) vs 실제 코드(`NAV_MENU_STRUCTURE`)

| 그룹 | 원본 하위 항목 수 | 실제 코드 하위 항목 수 | 비고 |
|---|---|---|---|
| 상품 관리 | 10 | 8 | 미구현 2건 — 카테고리 매핑(ADM-020-005), 상품 상세 타입 관리(ADM-020-009). **Shell 범위 밖**(상품 도메인 화면정의서 확인 필요) |
| 프로모션 관리 | 6 | 5 | 미구현 1건 — 프로모션 그룹(ADM-030-006). **Shell 범위 밖**(프로모션 도메인 화면정의서 확인 필요) |
| 주문 관리 | 2 | 2 | 일치 |
| 회원 관리 | 2 | 2 | 일치 |
| 입점사 관리 | 3 | 3 | 일치 |
| 정산 관리 | 3 | 3 | 일치 |
| 커뮤니티 관리 | 2 | 2 | 일치 |
| 운영 설정 | 10 | 6 | 그룹 경계 재편성 — 아래 "채택 항목" 참고 |
| 시스템 관리 | 3 | 9 (그중 1건은 개발용) | 그룹 경계 재편성 + 원본 1항목 분리 — 아래 참고 |

**채택 항목 (기준 갱신)**: 원본 §3.3의 "운영 설정"(090-001~010)과 "시스템 관리"(100-001~003) 그룹
경계를, 코드가 재편성한 대로 채택한다 — 계정·권한·기술운영 계열(운영자 계정/신청승인/
권한·프로그램 관리/공통코드/배치/Outbox·DLQ/감사로그)을 "시스템"으로, 콘텐츠 운영 계열(알림
템플릿/금지어/공지사항/약관/배너/고객정보 접근이력)을 "운영 설정"으로 분리한 쪽이 원본보다
합리적이다. `ADM-090-003 권한·프로그램 관리`(원본 1항목)를 권한 관리/프로그램 관리 2항목으로
나눈 것도 채택한다.

**소스 수정 필요**: `system` 메뉴의 마지막 항목 `guide/ui`(화면 작성 가이드)는 원본 메뉴 트리에
없는 개발용 화면이다. 운영 메뉴 목록에서 제외하거나, 최소한 아래 롤별 접근 권한 대상에서
제외해야 한다.

### 메뉴 트리 — 전체 목록 (채택 기준, 구현 완료)

위 표는 그룹별 개수 비교였고, 아래는 실제 코드의 단일 소스인 `navMenus.ts`의
`NAV_MENU_STRUCTURE`와 정확히 일치하는 전체 목록이다. 이 구조는 `navMenus.ts`의
`fetchProgramList(role)`(프로그램목록 API, Mock)이 role로 필터링해 반환하는 데이터의 원본이기도
하다. `AppShell.tsx`는 그 응답을 받아 화면 id별 컴포넌트(`SCREEN_REGISTRY`)를 붙이기만 한다 —
메뉴 id/라벨/그룹/롤은 전부 `navMenus.ts`가 유일한 소스다. 각 항목의 실제 화면 구현은 해당
도메인 화면정의서를 따른다.

| 그룹 id | 그룹 라벨 | 항목 id | 항목 라벨 |
|---|---|---|---|
| `product` | 상품 관리 | `product/review` | 상품 심사 |
| | | `product/list` | 상품 목록 |
| | | `product/category-std` | 표준 카테고리 |
| | | `product/category-display` | 전시 카테고리 |
| | | `product/brand` | 브랜드 관리 |
| | | `product/display-page` | 페이지 관리 |
| | | `product/display-template` | 템플릿 관리 |
| | | `product/section-type` | 섹션 관리 |
| `promotion` | 프로모션 | `promotion/exhibition` | 기획전 |
| | | `promotion/event-price` | 즉시할인 |
| | | `promotion/coupon` | 쿠폰할인 |
| | | `promotion/qty-discount` | 수량별 할인 |
| | | `promotion/cart-discount` | 장바구니 할인 |
| `order` | 주문 관리 | `order/order-history` | 주문 목록 |
| | | `order/claim` | 클레임 목록 |
| `member` | 회원 관리 | `member/list` | 회원 목록 |
| | | `member/grade` | 등급 기준 관리 |
| `vendor` | 입점사 관리 | `vendor/apply` | 입점 신청 심사 |
| | | `vendor/list` | 입점사 목록 |
| | | `vendor/delivery` | 배송사 관리 |
| `settlement` | 정산 관리 | `settlement/list` | 정산 목록 |
| | | `settlement/payment` | 지급 관리 |
| | | `settlement/external` | 외부 정산 |
| `community` | 커뮤니티 | `community/review` | 리뷰 관리 |
| | | `community/qna` | QnA 관리 |
| `settings` | 운영 설정 | `settings/notification` | 알림 템플릿 |
| | | `settings/banned-word` | 금지어 관리 |
| | | `settings/notice` | 공지사항 |
| | | `settings/terms` | 약관 관리 |
| | | `settings/banner` | 배너 관리 |
| | | `settings/access-log` | 고객정보 접근 이력 |
| `system` | 시스템 | (2depth 하위그룹 2개 + 리프 1개 — 3depth 구조, 아래 "시스템 메뉴 상세" 참고) | |

### 시스템 메뉴 상세 (3depth, 구현 완료)

`system` 그룹만 2depth에서 하위그룹으로 한 번 더 갈라진다 — 나머지 8개 그룹은 위 표의 2depth
항목이 곧 리프(화면)다.

| 2depth (하위그룹/리프) | 3depth id | 3depth 라벨 |
|---|---|---|
| 계정·권한 (하위그룹) | `system/operator` | 운영자 계정 |
| | `system/operator-apply` | 운영자 신청 승인 |
| | `system/permission` | 프로그램 관리 |
| | `system/role` | 권한 관리 |
| | `system/common-code` | 공통코드 |
| 인프라 운영 (하위그룹) | `system/batch` | 배치 관리 |
| | `system/outbox-dlq` | Outbox·DLQ |
| | `system/audit-log` | 감사 로그 |
| `guide/ui` (리프, 하위그룹 없이 2depth에 바로 존재) | — | 화면 작성 가이드 (개발용, 위 "소스 수정 필요" 참고) |

메뉴 항목 클릭 시 동작: 이미 열린 탭이면 활성화만, 아니면 `{id, label, element}`로 새 탭 열기
(아래 "탭 데이터 구조" 참고). 탭 최대치 도달 시에도 드롭다운 항목은 계속 클릭 가능하다 — 대신
가장 오래된 비고정 탭이 자동으로 닫힌다(아래 "LRU 자동 닫힘" 참고. 예전엔 항목을 비활성화하는
방식이었으나 LRU로 대체됐다).

### 롤별 메뉴 접근 권한 (원본 §3.2, 5개 역할) — 구현 완료 (Mock 역할)

| 메뉴 | 슈퍼(SUPER) | MD | CS | 정산(SETTLEMENT) | 입점관리(VENDOR_MGMT) |
|------|------|----|----|------|---------|
| 상품 관리 | ✅ | ✅ | ❌ | ❌ | ❌ |
| 프로모션 관리 | ✅ | ✅ | ❌ | ❌ | ❌ |
| 주문 관리 | ✅ | ❌ | ✅ | ❌ | ❌ |
| 회원 관리 | ✅ | ❌ | ✅ | ❌ | ❌ |
| 입점사 관리 | ✅ | ❌ | ❌ | ❌ | ✅ |
| 정산 관리 | ✅ | ❌ | ❌ | ✅ | ❌ |
| 커뮤니티 관리 | ✅ | ✅ | ✅ | ❌ | ❌ |
| 운영 설정 | ✅ | ❌ | ❌ | ❌ | ❌ |
| 시스템 관리 | ✅ | ❌ | ❌ | ❌ | ❌ |

이 표는 `navMenus.ts`의 그룹별 `roles: OperatorRole[]`로 그대로 구현돼 있다. `navMenus.ts`의
`fetchProgramList(role)`(프로그램목록 API, Mock)이 `NAV_MENU_STRUCTURE`를 이 표대로 필터링해
반환하고, `AppShell.tsx`는 role이 정해질 때마다(`useEffect(..., [role])`) 이 함수를 다시 호출해
메뉴를 새로 받아온다 — role이 로그인 후 바뀌어도 재계산된다.

로그인 화면(`ADM-000-001`, Mock)에서 어떤 이메일·비밀번호를 입력하든 `mockAuth.ts`의 `login()`이
항상 role `'SUPER'`(최상위 권한, 전체 메뉴 노출)로 로그인시킨다 — 실제 로그인 정보에서 role을
가져오는 것은 후속 과제(아래 체크리스트 참고).

### 탭 데이터 구조 (`TabContext.tsx`) — 확인 완료, 변경 없음

```typescript
interface TabItem {
  id: string          // 메뉴 항목 id와 동일 (예: 'product/list'), 대시보드는 'dashboard'
  label: string
  element: ReactElement
  pinned?: boolean     // true면 닫기 불가, 최초 탭(대시보드)만 true
}
```

Context가 제공하는 동작: `openTab(tab)`(이미 있으면 활성화만, 없으면 추가), `closeTab(id)`(pinned면
무시), `activateTab(id)`.

### LRU 자동 닫힘 — 정확한 동작 (구현 완료)

`TabContext.tsx`의 `MAX_NON_PINNED_TABS = 9`. "가장 오래된 탭"의 기준은 **탭 배열(`tabs`)에서
pinned를 제외하고 가장 앞쪽(=가장 먼저 열린) 탭**이다(별도의 마지막 접근 시각 추적 없음 — 배열
순서 자체가 열린 순서). `openTab`이 새 탭을 열 때 비고정 탭 수가 `MAX_NON_PINNED_TABS`에 이미
도달해 있으면, pinned가 아닌 첫 번째 탭을 제거한 뒤 새 탭을 추가하고 그 탭을 활성화한다. 기존의
"탭 최대 개수 도달 시 메뉴 항목 비활성화 + 배지 표시" 동작(`nav-limit-badge`, `is-disabled`)은
LRU 자동 닫힘으로 대체되어 제거했다 — 항상 새 탭을 열 수 있다.

### Breadcrumb — 제거 결정 (기준 갱신)

원본 §3.1 공통 레이아웃엔 Breadcrumb 바가 있었고, 한때 실제로 구현도 했었다 —
`AppShell.tsx`에 `Breadcrumb` 컴포넌트를 만들어 활성 탭의 `id`를 메뉴 트리에서 역참조해
`그룹 > (하위그룹 >) 항목` 경로를 TabBar 바로 아래 별도 바로 표시했다.

**제거 사유**: 실제 화면으로 띄워보니(스크린샷 확인), TabContent 맨 위에는 이미 각 도메인
화면 자신의 제목(`<h1 class="page-title">상품 목록</h1>` 같은 것 — admin 앱 약 70개 화면 전부
공통 패턴)이 있어서, Breadcrumb 바("상품 관리 > 상품 목록")와 그 바로 아래 페이지 제목("상품
목록")이 리프 이름을 중복 표시했다. 상위 경로("상품 관리")만큼의 정보 가치에 비해 화면 공간을
한 줄 더 차지하는 게 배보다 배꼽이 커서, Breadcrumb 바 자체를 없애기로 했다 — 각 화면이 이미
자기 제목을 갖고 있으므로 "지금 이 화면이 뭔지"는 페이지 제목만으로 충분하고, "메뉴 어디
소속인지"는 NavBar 드롭다운을 열어보면 확인할 수 있다.

**소스**: `AppShell.tsx`의 `Breadcrumb` 컴포넌트와 렌더 호출, `navMenus.ts`의
`findMenuPath()`, `globals.css`의 `.breadcrumb` 스타일을 전부 제거했다. `TabContent`가
`TabBar` 바로 아래에 온다(위 "[레이아웃]" 다이어그램 참고).

**본개발 전환 시**: 원본 §3.1이 Breadcrumb을 요구하고 있으므로, 실제 기획/디자인 검토 단계에서
이 제거 결정을 다시 확인할 필요가 있다 — 이 문서는 각 화면의 페이지 제목이 이미 있다는 전제로
"불필요하다"고 판단했을 뿐, 정책적으로 확정된 결정은 아니다.

### 알림(🔔) — 미정 항목 (원본도 불충분)

원본 §3.1엔 "운영자·알림·로그아웃"이라는 존재 언급만 있고 배지 카운트 소스, 클릭 시 동작(팝오버
목록/별도 화면 이동), 알림 종류 등 상세 사양이 없다. 이 문서에서 임의로 만들어내지 않고 **미정**으로
남긴다 — 본개발 전환 전에 정책 확정 필요(신규 정책서 항목 후보).

### 탭 정책 — 기준 vs 실제 소스

| 항목 | 기준 (원본 §3.1) | 실제 소스 상태 | 조치 |
|---|---|---|---|
| 대시보드(홈) 탭 | 로고 클릭·첫 번째 고정·닫기 불가 | `pinned: true`로 최초 탭 고정, `closeTab`도 pinned면 무시, 닫기(×) 버튼 렌더 안 됨 | 조치 없음 (일치) |
| 최대 탭 수 | 9개 (홈 탭 제외 — 총 10개) | `MAX_NON_PINNED_TABS = 9`(홈 제외) | 조치 없음 (구현 완료) |
| 탭 초과 시 | 가장 오래된 탭 LRU 자동 닫힘 | `openTab`이 pinned 제외 가장 오래된 탭을 닫고 새 탭 추가(위 "LRU 자동 닫힘" 참고) | 조치 없음 (구현 완료) |
| 탭 중복 진입 | 기존 탭 활성화 | `openTab`: 이미 있으면 `activateTab`만 호출 | 조치 없음 (일치) |
| 탭 더블클릭 리로드 | 현재 탭 리로드 | 더블클릭 핸들러 없음 | **소스 수정 필요** — `TabBar`에 `onDoubleClick` 핸들러 추가(탭 엘리먼트 재마운트 방식) |
| Breadcrumb | 레이아웃에 별도 바 존재 | 없음 — 한때 구현했다가 제거(위 "Breadcrumb — 제거 결정" 참고) | **기준 갱신** — 각 화면 자체 제목과 중복이라 판단해 제외. 본개발 전환 시 재확인 필요 |
| 알림(🔔) | "운영자·알림·로그아웃" 명시(상세 사양 없음 — 위 "알림 미정 항목" 참고) | `nav-user`엔 사용자명 + 로그아웃 버튼만 | **정책 확정 후 소스 수정 필요** — 배지 카운트 소스·클릭 동작 먼저 결정 |
| 롤별 메뉴 접근 권한 (§3.2, 5개 역할) | 역할별로 9개 메뉴 노출 제한(슈퍼/MD/CS/정산/입점관리) | `LoginScreen`→`app/page.tsx`의 로그인 세션에서 나온 `role`을 `AppShell`이 받아 `navMenus.ts`의 `fetchProgramList(role)`에 넘기고, 그 응답(role별 `roles` 필터링 결과)을 그대로 렌더링(위 "롤별 메뉴 접근 권한" 참고) | 조치 없음 (구현 완료 — 로그인이 항상 SUPER로 고정 mock이라 육안상 전체 노출과 동일) |
| Layer Popup 패턴 | 모든 상세/등록/수정 화면 → Layer Popup, 독립 URL 없음 | 각 도메인 화면은 모달 또는 InnerTabs(MDI 상세 탭)로 구현 | 조치 없음 — Shell 범위 밖, 화면마다 개별 확인(예: [Display 도메인](../Display/01-Page.md)은 InnerTabs 방식으로 이미 확정) |

### 크로스 도메인 의존성
해당 없음(역방향) — AppShell은 다른 도메인 mock 데이터를 참조하지 않는다. 반대로 **모든 도메인
화면이 이 셸에 종속**된다(각 화면 컴포넌트를 import해 탭 콘텐츠로 렌더링) — 이는 셸의 구조적
역할이지 숨은 의존성이 아니므로 각 도메인 문서에 별도 기재하지 않는다.

### 소스 수정 필요 — 요약 체크리스트

- [x] `navMenus.ts`: 메뉴 구조(id/라벨/그룹/롤) 단일 소스로 신규 작성
- [x] `navMenus.ts`: `fetchProgramList(role)` 프로그램목록 API(Mock) 신규 작성
- [x] `mockAuth.ts`: 세션 확인(`checkSession`)·로그인(`login`)·로그아웃(`logout`) Mock API 신규 작성
      (로그인 정보에서 role을 가져올 예정 — 지금은 최상위 권한 SUPER로 고정 mock)
- [x] `mockAuth.ts`: 세션 저장을 모듈 변수 → `localStorage`로 변경(`guide/ui` "로그인" 가이드의
      "세션 항상 유지" 규칙 반영 — 새로고침해도 로그인 풀리지 않도록 수정)
- [x] `LoginScreen.tsx`: `guide/ui` "로그인" 가이드 대조해 누락분 추가 — 서브타이틀("런앤샵 플랫폼
      관리"), 하단 링크("운영자 신청"/"비밀번호 찾기", 비활성 표시), 비밀번호 힌트, 5회 잠금 안내 문구
- [x] `guide/tabs/MainGuide.tsx`: 옛 탭 정책("최대 8개, 초과 시 비활성화") 텍스트를 실제 구현
      (최대 9개, LRU 자동 닫힘)에 맞춰 수정 — 가이드 자체가 stale했던 것 발견·수정
- [x] `LoginScreen.tsx` 신규 작성 ([02-Login.md](02-Login.md) 참고, Mock 인증 폼)
- [x] `app/page.tsx`: 세션 유효성에 따라 로그인 화면/셸을 분기하는 인증 게이트로 변경
- [x] `TabContext.tsx`: `MAX_NON_PINNED_TABS`(=9, 홈 탭 제외) 기준으로 수정
- [x] `TabContext.tsx`: 탭 초과 시 LRU 자동 닫힘 구현
- [x] `AppShell.tsx`: §3.2 기준 롤별 메뉴 접근 권한 구현(Mock 역할 기준, 프로그램목록 API 응답으로 활성화)
- [x] `navMenus.ts`: 메뉴 구조 정책(최대 3depth, 1depth 9개) 적용 — `system` 그룹을
      "계정·권한"/"인프라 운영" 2개 하위그룹(2depth)으로 재편성, `NavMenuItem.children`으로 3depth 지원
- [x] `AppShell.tsx` (`NavBar`): 3depth 하위그룹 드롭다운 렌더링(그룹 라벨 + 구분선 + 들여쓰기) 추가
- [x] Breadcrumb 제거 — `AppShell.tsx`의 `Breadcrumb` 컴포넌트·`navMenus.ts`의 `findMenuPath()`·
      `globals.css`의 `.breadcrumb` 삭제(제거 사유는 위 "Breadcrumb — 제거 결정" 참고)
- [ ] `AppShell.tsx` (`TabBar`): 탭 더블클릭 시 리로드 구현
- [ ] `AppShell.tsx` (`NavBar`): 알림(🔔) — 배지 카운트 소스·클릭 동작 정책 확정 후 UI 추가
- [ ] `navMenus.ts`: `system` 메뉴의 `guide/ui` 항목(`devOnly: true`)을 운영 메뉴에서 제외(또는
      접근권한 대상에서 확실히 배제 — 현재는 표시만 해두고 필터링에선 아직 안 뺌)
- [ ] 로그인 화면 3종 중 나머지 2종(`ADM-000-002` 운영자 신청, `ADM-000-003` 비밀번호 변경 최초)
      신규 구현 — 이번 범위 밖, [02-Login.md](02-Login.md) "이번 범위 밖" 참고
- [ ] 실제 로그인 API 연동 시: `mockAuth.ts`의 `checkSession`/`login`을 실제 세션 저장(쿠키/토큰)과
      서버 인증으로 교체, `login()`이 실제 계정의 role을 반환하도록 교체(현재는 SUPER 고정)

**Shell 범위 밖 (참고용, 각 도메인 화면정의서에서 처리)**: 카테고리 매핑(ADM-020-005), 상품 상세
타입 관리(ADM-020-009), 프로모션 그룹(ADM-030-006) — 아직 어떤 도메인 폴더에도 화면정의서가
없는 미구현 화면.
