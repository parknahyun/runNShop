# 메뉴구조도 (IA)

> **단계**: 구조설계
> **문서범위**: Project (앱별)
> **문서종류**: Design
>
> **작성 목적**: 앱(액터 관점)과 메뉴(도메인/업무 관점)를 매핑하여,
> "어떤 액터가 어떤 앱에서 어떤 업무 메뉴로 접근하는가"를 확정한다.
> **흐름 내 위치**: DC 상위 유스케이스 → **DD 메뉴구조도** → DE EARS
> **작성 주체**: 기획자 + 개발자 협업

| 항목 | 내용 |
|---|---|
| ID | DESIGN-IA-001 |
| 상태 | **Finalized** |
| 작성일 | 2026-08-11 |
| 갱신일 | 2026-08-11 |

> **범위**: 1차 파트(Order + Payment) 중심으로 메뉴를 확정하고, 나머지 도메인은 2~4차 파트 착수 시 보완한다.

---

## runNshop-admin (플랫폼 어드민)

| 셸 구조 | NavBar + Sidebar + TabBar(MDI) + TabContent |
|---|---|

| 1depth | 2depth | 화면(Bolt 대응) | 도메인 | 비고 |
|---|---|---|---|---|
| 홈 | — | 대시보드 | 공통 | |
| **주문관리** | 주문내역 | 주문목록 · 주문상세 | Order | 1차 |
| | 클레임관리 | 클레임목록 · 클레임상세 | Order | 1차 |
| **결제관리** | 결제내역 | 결제목록 · 결제상세 | Payment | 1차 |
| | 환불관리 | 환불목록 · 환불처리 | Payment | 1차 |
| 상품관리 | 상품목록 | 상품목록 · 상품상세 | Catalog | 2차 |
| | 상품심사 | 심사목록 | Catalog | 2차 |
| | 카테고리(표준) | 카테고리트리 | Catalog | 2차 |
| | 카테고리(전시) | 전시카테고리 매핑 | Catalog | 2차 |
| | 브랜드 | 브랜드목록 | Catalog | 2차 |
| 회원관리 | 회원목록 | 회원목록 · 회원상세 | Member | 3차 |
| | 등급관리 | 등급목록 · 등급설정 | Member | 3차 |
| 프로모션 | 쿠폰 | 쿠폰목록 · 쿠폰생성 | Promotion | 2차 |
| | 장바구니할인 | 할인규칙 목록 | Promotion | 2차 |
| 전시관리 | 페이지 | 페이지목록 · 편집 | Catalog(Display) | 2차 |
| | 섹션 | 섹션목록 · 편집 | Catalog(Display) | 2차 |
| | 템플릿 | 템플릿목록 | Catalog(Display) | 2차 |
| 정산 | 정산내역 | 정산목록 · 정산상세 | Settlement | 4차 |
| 커뮤니티 | 리뷰관리 | 리뷰목록 | Community | 3차 |
| | Q&A관리 | Q&A목록 | Community | 3차 |
| 설정 | 운영정책 | 정책설정 | Platform | 4차 |
| | 약관관리 | 약관목록 | Platform | 4차 |
| 가이드 | — | 이용가이드 | 공통 | |

---

## runNshop-partner (입점사 어드민)

| 셸 구조 | NavBar + Sidebar(틸 테마) + TabBar(MDI) + TabContent |
|---|---|

| 1depth | 2depth | 화면(Bolt 대응) | 도메인 | 비고 |
|---|---|---|---|---|
| 홈 | — | 판매자 대시보드 | 공통 | |
| **주문관리** | 주문목록 | 주문목록 · 주문상세 | Order | 1차 |
| | 출고관리 | 출고목록 · 운송장등록 | Order | 1차 |
| | 클레임 | 클레임목록 · 클레임상세 | Order | 1차 |
| 상품관리 | 상품목록 | 상품목록 · 상품등록 · 수정 | Catalog | 2차 |
| | 재고관리 | 재고현황 | Catalog | 2차 |
| 정산 | 정산내역 | 정산목록 · 정산상세 | Settlement | 4차 |
| 리뷰 | 리뷰목록 | 리뷰관리 | Community | 3차 |
| 설정 | 스토어정보 | 스토어설정 | Vendor | 4차 |
| | 배송정책 | 배송정책설정 | Vendor | 4차 |
| 가이드 | — | 이용가이드 | 공통 | |

---

## runNshop-mobile (고객웹)

| 셸 구조 | Header + Content(App Router) + BottomNav |
|---|---|

| BottomNav/경로 | 화면(Bolt 대응) | 도메인 | 비고 |
|---|---|---|---|
| 홈 `/` | 메인(전시 페이지) | Catalog(Display) | 2차 |
| 카테고리 `/category` | 카테고리 목록 · 상품목록 | Catalog | 2차 |
| 검색 `/search` | 검색결과 | Search | 2차 |
| 마이페이지 `/my` | 마이페이지 허브 | Member | 3차 |
| **`/my/orders`** | 주문내역 | Order | 1차 |
| **`/my/orders/[id]`** | 주문상세 | Order | 1차 |
| **`/my/claims`** | 클레임내역 | Order | 1차 |
| `/my/points` | 포인트내역 | Member | 3차 |
| `/my/coupons` | 쿠폰함 | Promotion | 2차 |
| `/my/reviews` | 내 리뷰 | Community | 3차 |
| `/my/address` | 배송지관리 | Member | 3차 |
| **`/my/payment-methods`** | 결제수단관리 | Payment | 1차 |
| `/my/settings` | 설정 | Member | 3차 |
| **장바구니 `/cart`** | 장바구니 | Order | 1차 |
| **주문서 `/checkout`** | 주문서 (배송지·결제·쿠폰) | Order | 1차 |
| **결제 `/checkout/payment`** | 결제 진행 | Payment | 1차 |
| 상품상세 `/products/[id]` | 상품상세 | Catalog | 2차 |

---

## Platform Bolt vs Domain Bolt 구분

| 구분 | 범위 | 메뉴구조도에서의 위치 |
|---|---|---|
| **Platform Bolt** | 셸 구조 (NavBar·Sidebar·TabBar·BottomNav·로그인·공통 컴포넌트) | 위 표의 "셸 구조" 행 |
| **Domain Bolt** | 업무 화면 (1depth~2depth 메뉴의 각 화면) | 위 표의 나머지 전체 |

> Platform Bolt는 모든 Domain Bolt의 선행 조건이다.

---

## 1차 파트 화면 목록 요약 (Order + Payment)

| 앱 | 화면 수 | 주요 화면 |
|---|---|---|
| admin | 6개 | 주문목록·상세, 클레임목록·상세, 결제목록·상세, 환불목록·처리 |
| partner | 5개 | 주문목록·상세, 출고목록·운송장등록, 클레임목록·상세 |
| mobile | 7개 | 장바구니, 주문서, 결제, 주문내역, 주문상세, 클레임내역, 결제수단관리 |
| **합계** | **18개** | |

---

## 근거

| 항목 | 출처 |
|---|---|
| 메뉴 항목 | `DC-상위유스케이스(Order).md`, `DC-상위유스케이스(Payment).md` 업무그룹·개별 UC |
| 도메인 매핑 | `DB-도메인정의서.md` 12개 도메인 책임 |
| 셸 구조 | 코딩 표준 "앱별 스타일링 방식" |
| 파트별 진행순서 | `D4-범위(Scope).md` 진행 순서 (4파트) |
| 앱 목록 | `D9-컴포넌트.md` C-1~C-3 |
