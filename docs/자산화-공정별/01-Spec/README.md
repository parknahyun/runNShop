# 01-Spec

> AI활용 방법론 6.2절 "Spec 공정" — 무엇을 만들지 기능·비기능 요구사항과 인터페이스를 정의

## 현재 상태 (2026-07-30)

| # | 산출물 | Scope | 상태 |
|---|---|---|---|
| 01 | [용어집](01-용어집.md) | Project | DRAFT-v1 |
| 02 | [제약사항](02-제약사항.md) | Project | DRAFT-v1 |
| 03 | [비기능요구사항(NFR)](03-비기능요구사항(NFR).md) | Project+Domain | DRAFT-v1 |
| 04 | 기능요구사항(EARS) — Order(4분할)·Payment | Bolt | **구버전 대체 예정** — 舊 `01-Order.md`(33개 소분류 기준)를 폐기하고, Order 도메인 기능표가 75개 소분류로 커진 만큼 대분류 경계로 4개 파일 분할 착수(Bolt는 여전히 "Order" 하나 — 문서만 분리, 2026-07-30 확인) |
| 05 | 수용기준(GWT) | Bolt | 미착수 |
| 06 | 인터페이스 명세 | Bolt | 미착수 |

### Order EARS 문서 분할 (2026-07-30, 문서만 분리 — Bolt는 단일)

| 파일 | 대분류 범위 |
|---|---|
| `04-기능요구사항(EARS)/01-Order-Cart.md` | 장바구니 + 주문서(체크아웃 진입) |
| `04-기능요구사항(EARS)/01-Order-OrderPayment.md` | 주문결제 + 연동(결제/재고 이벤트) |
| `04-기능요구사항(EARS)/01-Order-Delivery.md` | 배송관리 |
| `04-기능요구사항(EARS)/01-Order-Claim.md` | 클레임처리 |

> 2계층 주문구조(platform_order/order, `01-용어집.md` HR#3)는 도메인기능표 `01-Order.md`의
> "2계층 주문구조 반영" 절에 중앙 정리돼 있다 — 4개 파일은 이를 링크만 하고 중복 서술하지 않는다.

## 진행 순서

`04-범위(Scope).md` 확정대로 **1차 = 거래(Order + Payment)**부터 진행한다. 4개 Order 파일은
동시 또는 순차 작성 모두 가능(파일 간 독립적) — 단, Cart→OrderPayment 순서(체크아웃→생성)와
OrderPayment→Delivery/Claim 순서(주문 확정 후 배송·클레임)는 참조 방향상 먼저 쓰인 쪽이
나중 파일의 전제가 되므로, 동시 진행 시 서로의 상태전이·용어를 임의로 가정하지 않도록 주의한다.

1. Project 공통 3종(용어집·제약사항·NFR) — 완료
2. Order EARS 4분할 작성(위 표 참고)
3. `04-기능요구사항(EARS)/02-Payment.md` 신규 작성
4. Order(4개)·Payment 각각 수용기준(GWT)·인터페이스 명세 작성

## 입력 자료

- `docs/자산화/참고자료/도메인기능표/` (12개 도메인, 소분류 286개+)
- `docs_archive/docs/2. 정책서/runNshop_policy_v1_2.md`
- `docs_archive/docs/3. 도메인/runNshop_bounded_context_v1_0.md`
- `docs_archive/docs/1.요구사항/runNshop_requirements_v1_0.md` (FR/NFR 챕터, 12개 도메인 전체)
- `docs_archive/docs/3. 도메인/runNshop_modular_monolith_v1_0.md`, `docs_archive/docs/7. 기술정의/`
- `.kiro/steering/` (coding-standards.md 등), `apps/` (실제 구현 소스)

### 입력자료 출처에 대한 안내 — RFP·제안서 부재

정상적인 SDLC라면 Proposal 이전 단계에 **RFP(제안요청서)·제안서**가 있고, Proposal·Spec은
그 위에서 요구사항을 구체화한다. runNshop은 3TOP 내부 자체 기획 프로젝트라 RFP·제안서 자체가
없다 — 정책서(`docs_archive/docs/2. 정책서/`)부터 바로 시작했고, Proposal 6종(`00-proposal/`)도
사후 소급 작성본이다(`00-proposal/README.md` 참고).

이 Spec 공정에서도 같은 상황이 이어진다. **RFP·제안서가 있어야 할 자리를, 실질적으로
`docs_archive/docs`(사후 작성된 설계 문서 9종 — 요구사항정의서·정책서·도메인정의서·화면정의서·
기술정의서 등)·`.kiro/steering`(AI 작업 지시 규칙, 실제 코딩 규범)·`apps/`(프로토타입이지만
실제로 구현된 소스코드)가 대신하고 있다** — 이 셋이 "무엇을 만들어야 하는가"에 대한 가장 신뢰할
수 있는 1차 근거라는 뜻이다. 각 산출물의 "근거 자료 출처 매핑" 표에 개별 챕터·파일을 인용할 때도
이 관점(RFP·제안서의 대체재)을 전제로 한다.
