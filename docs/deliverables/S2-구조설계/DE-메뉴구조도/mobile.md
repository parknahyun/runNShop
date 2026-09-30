# 메뉴구조도 (IA) — runNshop-mobile (고객웹)

> 상위 문서: [readme.md](readme.md)
> **단계**: 구조설계 | **문서종류**: Design | **상태**: Finalized

---

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

*근거: [readme.md](readme.md) "근거" 절 참조*
