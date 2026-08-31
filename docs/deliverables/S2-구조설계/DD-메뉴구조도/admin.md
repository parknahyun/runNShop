# 메뉴구조도 (IA) — runNshop-admin (플랫폼 어드민)

> 상위 문서: [readme.md](readme.md)
> **단계**: 구조설계 | **문서종류**: Design | **상태**: Finalized

---

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

*근거: [readme.md](readme.md) "근거" 절 참조*
