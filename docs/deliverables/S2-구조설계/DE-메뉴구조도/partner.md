# 메뉴구조도 (IA) — runNshop-partner (입점사 어드민)

> 상위 문서: [readme.md](readme.md)
> **단계**: 구조설계 | **문서종류**: Design | **상태**: Finalized

---

| 셸 구조 | NavBar + Sidebar(틸 테마) + TabBar(MDI) + TabContent |
|---|---|

| 1depth | 2depth | 화면(Bolt 대응) | 도메인 | 비고 |
|---|---|---|---|---|
| 홈 | — | 입점사 대시보드 | 공통 | |
| **주문관리** | 주문목록 | 주문목록 · 주문상세 | Order | 1차 |
| | 출고관리 | 출고목록 · 운송장등록 | Order | 1차 |
| | 클레임 | 클레임목록 · 클레임상세 | Order | 1차 |
| 상품관리 | 상품목록 | 상품목록 · 상품등록 · 수정 | Catalog | 2차 |
| | 재고관리 | 재고현황 | Catalog | 2차 |
| 프로모션 | 쿠폰 | 쿠폰목록 · 쿠폰등록 · 쿠폰비활성화 | Promotion | 2차 |
| 정산 | 정산내역 | 정산목록 · 정산상세 | Settlement | 4차 |
| 리뷰 | 리뷰목록 | 리뷰관리 | Community | 3차 |
| 설정 | 스토어정보 | 스토어설정 | Vendor | 4차 |
| | 배송정책 | 배송정책설정 | Vendor | 4차 |
| 가이드 | — | 이용가이드 | 공통 | |

---

*근거: [readme.md](readme.md) "근거" 절 참조*
