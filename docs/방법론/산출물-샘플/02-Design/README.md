# 샘플 Bolt: 주문결제 — Design 공정 산출물 (11종)

`AI활용_개발공정_산출물_표준양식_v1.0.md` 기준. 입력: `../01-Spec/`(EARS/GWT/인터페이스명세).
Scope: 컴포넌트는 Project, 상위유스케이스·도메인ERD·상태머신·비즈니스프로세스·이벤트플로우는
Domain, 나머지(세부유스케이스·시퀀스·화면레이아웃·클래스설계)는 Bolt, ADR은 이번 결정 단위.

| 파일 | Scope |
|---|---|
| 01-컴포넌트.md | Project (모듈 구조 + **앱별 메뉴구조**) |
| 02-상위유스케이스.md | Domain |
| 03-도메인ERD.md | Domain(현행화: Bolt) |
| 04-상태머신.md | Domain(현행화: Bolt) |
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
| 나머지(ERD 상세 컬럼, 시퀀스 등) | 이 샘플에서 신규 작성 — 실제 정책서·ERD 대조 필요(Human Review) |

## Human Review 필요 항목

| # | 항목 | 사유 |
|---|---|---|
| 1 | Redis TTL 락 사용 여부 | ADR에서 언급했으나 이 프로토타입 단계 적용 여부 미정 (상세는 `08-시퀀스.md`, `10-ADR.md`) |
| 2 | pay_payment_log의 raw_response PII 마스킹 규칙 | 구체적 마스킹 로직 미정 (상세는 `03-도메인ERD.md`) |
