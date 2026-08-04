# 샘플 Bolt: 주문결제 — Design 공정 산출물 (11종)

`AI활용_개발공정_산출물_표준양식_v1.0.md` 기준. 입력: `../01-Spec/`(EARS/GWT/인터페이스명세).
Scope: 컴포넌트는 Project, 상위유스케이스·도메인ERD·상태머신·비즈니스프로세스·이벤트플로우는
Domain, 나머지(세부유스케이스·시퀀스·화면레이아웃·클래스설계)는 Bolt, ADR은 이번 결정 단위.

| 파일 | Scope |
|---|---|
| 01-컴포넌트.md | Project (모듈 구조 + **전체 도메인(12개) 연관관계** + 앱별 메뉴구조·Platform Bolt 식별) |
| 02-상위유스케이스.md | Domain (액터정의 + **업무그룹 4종**(장바구니·주문서/주문결제·연동/배송관리/클레임처리) + 관계도 + 권한범위) |
| 03-도메인ERD.md | Domain(현행화: Bolt) |
| 04-상태머신.md | Domain(현행화: Bolt) — **2계층 구조**(platform_order 경량 + order 상세 7상태) |
| 05-비즈니스프로세스.md | Domain |
| 06-이벤트플로우.md | Domain 간 |
| 07-세부유스케이스.md | Bolt |
| 08-시퀀스.md | Bolt |
| 09-화면레이아웃.md | Bolt |
| 10-ADR.md | Domain/Bolt |
| 11-클래스설계.md | Bolt(현행화) |

## 근거 자료 출처 매핑

| 항목 | 출처 |
|---|---|
| 재고 선점 시점(ADR-011) | `runNshop_ai_collaboration_process_v1_0.md` 결정 이력 #3 |
| Outbox 패턴, 도메인 경계 규칙 | `runNshop_modular_monolith_v1_0.md`(원본 언급, 본 샘플에서 재적용) |
| 앱별 메뉴구조 | 프로토타입 구현 실사(admin Sidebar·constants.ts, partner Sidebar, mobile BottomNav) |
| 전체 도메인(12개) 연관관계 | `도메인기능표/도메인기능리스트_대분류정리.md` 8-2·8-3절(재구성, Security→Config 편입 반영) |
| 상위 유스케이스 액터·업무그룹·권한범위 | `01-Spec/04-기능요구사항(EARS)/01-Order-{Cart,OrderPayment,Delivery,Claim}.md` 4파일에서 발췌 재구성 |
| 상태머신 상태·전이·트리거 | `01-Spec/04-기능요구사항(EARS)/01-Order-{OrderPayment,Delivery,Claim}.md` 3파일 발췌 재구성 + `참고자료/도메인기능표/01-Order.md` 2계층 주문구조 절 |
| 나머지(ERD 상세 컬럼, 시퀀스 등) | 이 샘플에서 신규 작성 — 실제 정책서·ERD 대조 필요(Human Review) |

## Human Review 필요 항목

| # | 항목 | 사유 |
|---|---|---|
| 1 | Redis TTL 락 사용 여부 | ADR에서 언급했으나 이 프로토타입 단계 적용 여부 미정 (상세는 `08-시퀀스.md`, `10-ADR.md`) |
| 2 | pay_payment_log의 raw_response PII 마스킹 규칙 | 구체적 마스킹 로직 미정 (상세는 `03-도메인ERD.md`) |
| 3 | platform_order → order 분할 시점 | "결제완료 즉시 분할"은 도메인기능표가 이미 추정으로 남겨둔 것 — 코드/정책서 대조 필요 (상세는 `04-상태머신.md` ①) |
