# EARS 기능요구사항 — Payment

> **단계**: 구조설계
> **문서범위**: Domain
> **문서종류**: Spec
>
> **작성 목적**: 상위 유스케이스(DC)와 메뉴구조도(DD)를 기반으로, Payment 도메인의 기능요구를 EARS 패턴으로 정형화한다.
> **흐름 내 위치**: DC 상위 UC → DD 메뉴구조도 → **DE EARS** → DF ERD → DG 상태머신
> **작성 주체**: 시니어 개발자 + AI 협업 (기획자·현업 검토·확인)

| 항목 | 내용 |
|---|---|
| ID | SPEC-EARS-PAYMENT-001 |
| 상태 | **Finalized** |
| 작성일 | 2026-08-11 |
| 갱신일 | 2026-08-21 |

---

## 결제 실행

| ID | 패턴 | 요구사항 | 도출 근거 |
|---|---|---|---|
| REQ-PAY-001 | Event-driven | WHEN Order 도메인으로부터 결제 요청을 수신하면, THE 시스템은 SHALL PG(토스페이먼츠)에 결제 승인을 요청한다. | 상위UC: PG 결제 승인 |
| REQ-PAY-002 | Event-driven | WHEN PG로부터 승인 성공 응답을 수신하면, THE 시스템은 SHALL 결제 상태를 PAID로 전환하고 PAYMENT_APPROVED 이벤트를 발행한다. | 상위UC: 결제완료 이벤트 |
| REQ-PAY-003 | Unwanted | IF PG로부터 승인 실패 응답을 수신하면, THEN THE 시스템은 SHALL 결제 상태를 유지하고 재시도한다 (최대 3회). | 상위UC: 결제 재시도 |
| REQ-PAY-004 | Unwanted | IF 3회 재시도 후에도 실패하면, THEN THE 시스템은 SHALL 결제 상태를 CANCELLED로 전환하고 PAYMENT_FAILED 이벤트를 발행한다. | 상위UC: 결제실패 이벤트 |
| REQ-PAY-005 | Unwanted | IF PG 응답이 30초 내 도착하지 않으면, THEN THE 시스템은 SHALL 타임아웃으로 처리하고 재시도 프로세스를 시작한다. | 장애 대응: 타임아웃 |
| REQ-PAY-006 | Ubiquitous | THE 시스템은 SHALL 모든 PG 요청·응답을 pay_payment_log에 기록한다 (pg_transaction_id 포함). | 감사 추적 + 멱등 판별 |
| REQ-PAY-007 | Ubiquitous | THE 시스템은 SHALL PG 승인 요청 시 금액이 Order의 결제 요청 금액과 일치하는지 검증한다. | NFR-SE-09: 금액 위변조 방지 |

---

## 환불·취소

| ID | 패턴 | 요구사항 | 도출 근거 |
|---|---|---|---|
| REQ-PAY-008 | Event-driven | WHEN Order 도메인으로부터 ORDER_CANCELLED 이벤트를 수신하면, THE 시스템은 SHALL PG에 전액 환불을 요청한다. | 상위UC: 전액 환불 |
| REQ-PAY-009 | Event-driven | WHEN Order 도메인으로부터 CLAIM_COMPLETED 이벤트를 수신하면, THE 시스템은 SHALL 해당 금액만큼 부분 환불을 요청한다. | 상위UC: 부분 환불 |
| REQ-PAY-010 | Event-driven | WHEN PG로부터 환불 성공 응답을 수신하면, THE 시스템은 SHALL 결제 상태를 REFUNDED(전액) 또는 PARTIAL_REFUNDED(부분)로 전환한다. | 환불 상태 관리 |
| REQ-PAY-011 | Unwanted | IF PG 자동 환불이 실패하면, THEN THE 시스템은 SHALL 환불 실패 알림을 CS 담당자에게 발송하고 수동 환불 대기 상태로 전환한다. | 상위UC: 수동 환불 |
| REQ-PAY-012 | Event-driven | WHEN CS 담당자가 수동 환불을 처리하면, THE 시스템은 SHALL PG에 재환불을 요청하고 결과를 기록한다. | 상위UC: 수동 환불 처리 |
| REQ-PAY-013 | Ubiquitous | THE 시스템은 SHALL 환불 시 원결제 수단으로 환불한다. 단, 원결제 수단 환불 불가 시 CS 담당자 승인 하에 계좌이체(수동)로 대체할 수 있다. | 권한 범위: PG 환불 정책 + CS 예외 처리 |

---

## 결제수단 관리

| ID | 패턴 | 요구사항 | 도출 근거 |
|---|---|---|---|
| REQ-PAY-014 | Event-driven | WHEN 고객이 결제수단을 등록하면, THE 시스템은 SHALL PG 토큰을 발급받아 저장한다 (카드번호 원본 미저장). | 상위UC: 결제수단 등록 |
| REQ-PAY-015 | Event-driven | WHEN 고객이 결제수단을 삭제하면, THE 시스템은 SHALL 해당 토큰을 무효화하고 목록에서 제거한다. | 상위UC: 결제수단 삭제 |
| REQ-PAY-016 | Event-driven | WHEN 고객이 결제수단 목록을 조회하면, THE 시스템은 SHALL 본인 등록 수단만 마스킹하여 반환한다 (****-1234). | 상위UC: 결제수단 조회 |
| REQ-PAY-017 | Ubiquitous | THE 시스템은 SHALL 카드번호·CVV를 서버에 저장하지 않는다 (PG 토큰화만 허용). | NFR-SE-08: PCI DSS |
| REQ-PAY-018 | Event-driven | WHEN 동일 카드로 3회 연속 결제 실패 시, THE 시스템은 SHALL 해당 카드를 당일 결제 차단하고 고객에게 안내한다. | 상위UC: 카드 일일 제한 |
| REQ-PAY-019 | Event-driven | WHEN 익일 00:00이 되면, THE 시스템은 SHALL 전일 차단된 카드의 제한을 자동 해제한다. | 상위UC: 카드 제한 해제 (배치) |

---

## 결제 조회·관리

| ID | 패턴 | 요구사항 | 도출 근거 |
|---|---|---|---|
| REQ-PAY-020 | Event-driven | WHEN 고객이 결제 이력을 조회하면, THE 시스템은 SHALL 본인 결제 건만 최신순으로 반환한다. | 상위UC: 내 결제 이력 |
| REQ-PAY-021 | Event-driven | WHEN CS 담당자가 결제를 검색하면, THE 시스템은 SHALL 상태·기간·주문번호·PG거래번호 필터를 지원한다. | 상위UC: 전체 결제 검색 |
| REQ-PAY-022 | Event-driven | WHEN CS 담당자가 PG 거래 로그를 조회하면, THE 시스템은 SHALL 해당 결제의 전체 요청·응답 이력을 반환한다 (PII 마스킹). | 상위UC: PG 거래 로그 |

---

## 바텀업 검토 보완 (2026-08-21 신설)

> S3 상세설계(GWT AC-PAY-019/020, 화면레이아웃 환불 계산 규칙) 역검토로 발견한 미문서화 항목 보완.

| ID | 패턴 | 요구사항 | 도출 근거 |
|---|---|---|---|
| REQ-PAY-023 | Ubiquitous | THE 시스템은 SHALL 카드별 연속 결제 실패 횟수를 저장하고, 결제 성공 시 해당 카드의 연속 실패 횟수를 0으로 초기화한다. | REQ-PAY-018(3회 연속 실패 차단) 선행조건 — AC-PAY-019/020 근거 |
| REQ-PAY-024 | Ubiquitous | THE 시스템은 SHALL 부분 환불(PARTIAL_REFUNDED) 금액 계산 시 배송비를 차감하지 않고 상품 결제금액만을 기준으로 한다. | 화면레이아웃 환불상세 계산 규칙 역반영 |

---

## 근거

| 항목 | 출처 |
|---|---|
| 유스케이스 도출 | `DC-상위유스케이스(Payment).md` |
| 보안 정책 | `D8-NFR.md` NFR-SE-08(PCI DSS), NFR-SE-09(금액 검증) |
| PG 연동 규칙 | 토스페이먼츠 API 표준 (재시도 3회, 30초 타임아웃) |
| 도메인 간 연동 | `DB-도메인정의서.md` Payment "의존·이벤트 발행" |
| 메뉴·화면 대응 | `DD-메뉴구조도(IA).md` Payment 관련 화면 |
