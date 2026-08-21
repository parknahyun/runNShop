# Order 도메인 기능요구사항 — 배송관리 (EARS)

| 항목 | 내용 |
|---|---|
| 산출물 ID | SPEC-EARS-ORDER-001 (분리 파일 3/4) |
| Scope | Bolt (Order 도메인 — Delivery) |
| 상태 | DRAFT-v2 |
| 작성일 | 2026-07-30 |
| 입력 자산 | 도메인기능표(01-Order.md), runNshop_policy_v1_2.md §7/§13.0~§13.6, 용어집, 제약사항(CONS-008/014) |

> 이 파일은 출고 처리부터 배송완료까지의 배송 생명주기, 배송지 변경, 지연·분실·반송 처리를 다룬다.
>
> **관련 파일**: `01-Order-Cart.md`(장바구니·주문서), `01-Order-OrderPayment.md`(주문결제·연동),
> `01-Order-Claim.md`(클레임처리)
>
> **제약사항 연동**:
> - CONS-008: 배송사 API 연동 2곳 한정, 미선택 시 수동 운송장 등록
> - CONS-014: 도서산간 배송 정책 상충(미해결)

---

## 배송관리

| ID | 패턴 | 채널 | 요구사항 | 출처 | 우선순위 |
|---|---|---|---|---|---|
| REQ-ORD-018 | Event-driven | P | WHEN 판매자가 PAYMENT_COMPLETED 상태 주문에 대해 출고 처리를 실행하면, THE 주문시스템 SHALL 주문 상태를 PREPARING으로 전환하고 출고 일시를 기록한다 | 정책서 7장 | P1 |
| REQ-ORD-019 | State-driven | P | WHILE 주문이 PAYMENT_COMPLETED 상태인 동안, THE 주문시스템 SHALL 판매자에게 출고 처리 버튼을 활성화하여 제공한다 | 정책서 7장 | P1 |
| REQ-ORD-020 | Event-driven | P | WHEN 판매자가 PREPARING 상태 주문에 대해 택배사와 운송장번호를 입력하면, THE 주문시스템 SHALL 배송정보를 저장하고 주문 상태를 IN_DELIVERY로 전환한다 | 정책서 7장 | P1 |
| REQ-ORD-021 | State-driven | P | WHILE 주문이 PREPARING 상태인 동안, THE 주문시스템 SHALL 배송정보 입력 폼을 편집 가능 상태로 제공한다 | 정책서 7장 | P1 |
| REQ-ORD-022 | Event-driven | P | WHEN 판매자가 엑셀 파일로 다건의 배송정보를 업로드하면, THE 주문시스템 SHALL 각 주문에 택배사·운송장번호를 일괄 매핑하고 상태를 IN_DELIVERY로 전환한다 | 정책서 7장 | P2 |
| REQ-ORD-023 | Unwanted | P | IF 엑셀 업로드 시 PREPARING 상태가 아닌 주문이 포함되어 있으면, THEN THE 주문시스템 SHALL 해당 행을 건너뛰고 오류 목록을 반환한다 | 정책서 7장 | P2 |
| REQ-ORD-024 | Event-driven | M | WHEN 고객이 PAYMENT_COMPLETED 상태에서 배송지 변경을 요청하면, THE 주문시스템 SHALL 변경된 배송지를 저장하고 변경 이력을 기록한다 | 정책서 §13.0-1 | P2 |
| REQ-ORD-025 | Event-driven | A | WHEN CS 담당자가 PREPARING 상태에서 배송지 변경을 처리하면, THE 주문시스템 SHALL 배송지를 업데이트하고 입점사에게 변경 알림을 발송한다 | 정책서 §13.0-1 | P2 |
| REQ-ORD-081 | Unwanted | A | IF 배송지 변경 요청 시점에 주문이 IN_DELIVERY 이후 상태이면, THEN THE 주문시스템 SHALL 변경을 거부하고 택배사 직접 문의를 안내한다 | 정책서 §13.0-1 | P2 |
| REQ-ORD-026 | State-driven | P | WHILE 주문이 PREPARING 상태인 동안, THE 주문시스템 SHALL 판매자의 운송장 수정(택배사·운송장번호 재입력)을 허용한다 | 정책서 §13.1-1 | P2 |
| REQ-ORD-027 | Unwanted | P | IF 운송장 수정 요청 시 주문이 IN_DELIVERY 이후 상태이면, THEN THE 주문시스템 SHALL 수정을 거부한다 | 정책서 §13.1-1 | P2 |
| REQ-ORD-028 | Event-driven | M | WHEN 고객이 배송추적 화면을 요청하면, THE 주문시스템 SHALL 택배사 API를 통해 실시간 배송 상태를 조회하여 표시한다 | 정책서 §13.3 | P3 |
| REQ-ORD-029 | Event-driven | B | WHEN 배송상태 갱신 배치가 실행되면, THE 주문시스템 SHALL 택배사 API로 배송완료 여부를 조회하고, 배송완료된 주문의 상태를 IN_DELIVERY에서 DELIVERED로 전환한다 | 정책서 §13.3 | P1 |
| REQ-ORD-030 | Ubiquitous | B | THE 주문시스템 SHALL 배송상태 갱신 배치를 정해진 주기(60분)로 자동 실행한다 | 정책서 §13.3 | P1 |
| REQ-ORD-082 | Event-driven | A | WHEN 출고 기한(1영업일)을 초과한 주문이 감지되면, THE 주문시스템 SHALL 배송 지연 안내를 판매자·고객에게 발송한다 | 정책서 §13.4 | P2 |
| REQ-ORD-083 | Event-driven | A | WHEN 배송중 3일 이상 미진행이 감지되면, THE 주문시스템 SHALL 배송사 확인 후 고객에게 지연 안내를 발송한다 | 정책서 §13.4 | P2 |
| REQ-ORD-084 | Event-driven | A | WHEN 배송 분실이 확정되면, THE 주문시스템 SHALL CS 판단에 따라 재발송 또는 환불을 처리한다 | 정책서 §13.4 | P2 |
| REQ-ORD-085 | Unwanted | M | IF 배송 불가 지역(도서산간) 주소로 주문을 시도하면, THEN THE 주문시스템 SHALL 주문을 차단하고 배송 불가 사유를 안내한다 | 정책서 §13.5, CONS-014 해결(A안 채택 — 1단계 차단) | P2 |
| REQ-ORD-086 | Event-driven | A | WHEN 수취인 부재로 반송이 발생하면, THE 주문시스템 SHALL 고객 연락 후 재배송 또는 환불 선택을 처리한다 | 정책서 §13.6 | P2 |
| REQ-ORD-087 | Event-driven | B | WHEN 배송완료 후 14일간 미수령 상태가 지속되면, THE 주문시스템 SHALL 반송 처리를 수행하고 환불을 진행한다 | 정책서 §13.6 | P2 |
| REQ-ORD-098 | Event-driven | A | WHEN 주소 오류로 반송이 발생하면, THE 주문시스템 SHALL 고객 귀책으로 처리하고, 재배송 시 추가 배송비를 고객에게 부과한다(Payment 도메인에 추가배송비결제 요청 이벤트 발행) | 정책서 §13.6 | P2 |
| REQ-ORD-088 | Event-driven | P | WHEN 배송사 미선택(자체 배송) 판매자가 배송완료를 수동 확인하면, THE 주문시스템 SHALL 주문 상태를 IN_DELIVERY에서 DELIVERED로 전환한다 | 정책서 §13.2 | P2 |
| REQ-ORD-089 | Event-driven | A | WHEN 관리자가 출고 기한 초과 모니터링 화면을 요청하면, THE 주문시스템 SHALL 출고 기한 초과 건 목록과 지연 현황을 반환한다 | 정책서 §13.1 | P3 |

---

## 요약

| 영역 | ID 범위 | 수량 | P1 | P2 | P3 |
|---|---|---|---|---|---|
| 배송관리 | REQ-ORD-018~030, 081~089, 098 | 23 | 6 | 15 | 2 |

---

## Human Review

| # | 항목 | 사유 | 우선순위 |
|---|---|---|---|
| ~~1~~ | ~~CONS-014 도서산간 정책 상충~~ | **해결(A안 확정)** — 1단계 도서산간 차단 유지. partner "도서산간 배송비" 필드는 2단계 확장 예비로 비활성 | ~~중~~ |
| ~~2~~ | ~~배송상태 갱신 주기~~ | **해결** — 10분 주기 확정 (REQ-ORD-030) | ~~낮음~~ |
