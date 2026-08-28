# 샘플: EARS 기능요구사항

> **단계**: 구조설계
> **문서범위**: Domain
> **문서종류**: Spec

> **작성 목적**: 상위 유스케이스(⑥)와 메뉴구조도(⑦)를 기반으로,
> 각 도메인에 대해 "시스템이 무엇을 해야 하는가"를 EARS 패턴으로 정형화하여 정의한다.
>
> **흐름 내 위치**:
> ```
> ⑥ 상위 유스케이스 → ⑦ 메뉴 정리(화면 대상) → ⑧ EARS → ⑨ ERD → ⑩ 상태머신
> ```
> 메뉴구조도에서 "어떤 화면이 필요한가"가 확정된 뒤,
> 각 화면/업무에 대해 시스템의 기능 요구를 기술한다.
> EARS는 이후 ERD(엔티티 도출)·상태머신(상태 전이 근거)의 직접 입력이 된다.
>
> **작성 주체**: 시니어 개발자 + AI 협업 (기획자·현업 검토·확인)
> **작성 단위**: Domain (도메인 전체를 대상으로 작성, Bolt 단위가 아님)

---

## EARS 패턴 요약

| 패턴 | 구문 | 사용 상황 |
|---|---|---|
| **Ubiquitous** | THE 시스템 SHALL ... | 항상 적용되는 규칙 (조건 없음) |
| **Event-driven** | WHEN {이벤트} THE 시스템 SHALL ... | 특정 트리거에 의한 동작 |
| **State-driven** | WHILE {상태} THE 시스템 SHALL ... | 특정 상태 동안의 동작 |
| **Unwanted** | IF {비정상 상황} THEN THE 시스템 SHALL ... | 장애·예외·경계값 처리 |
| **Optional** | WHERE {조건} THE 시스템 SHALL ... | 선택적 기능 (특정 조건에서만) |

---

## ID 규칙

```
REQ-{DOMAIN}-{SEQ}
```
- DOMAIN: 3글자 도메인 약어 (ORD, PAY, CAT, PRM, MEM...)
- SEQ: 3자리 순번 (001~)

---

## 도출 방법

| 입력 | 어떻게 EARS로 변환하는가 |
|---|---|
| 상위 유스케이스(⑥) 유스케이스 1개 | → Event-driven 1~N개 (트리거별) |
| 상위 유스케이스(⑥) 권한 범위 | → State-driven / Ubiquitous (제약 규칙) |
| 정책서 예외 규칙 | → Unwanted (비정상 처리) |
| 정책서 조건부 규칙 | → Optional (특정 조건에서만) |
| 도메인정의서(⑤) 경계 규칙 | → Ubiquitous (도메인 간 통신 규칙) |

---

## 샘플: Order 도메인 (장바구니·주문서 업무그룹, 발췌)

| ID | 패턴 | 요구사항 | 도출 근거 |
|---|---|---|---|
| REQ-ORD-059 | Event-driven | WHEN 고객이 상품을 장바구니에 담으면, THE 시스템은 SHALL 해당 상품·옵션·수량을 장바구니에 저장한다. | 상위UC: 장바구니 담기 |
| REQ-ORD-060 | Event-driven | WHEN 고객이 장바구니 상품의 수량을 변경하면, THE 시스템은 SHALL 변경된 수량으로 갱신하고 소계를 재계산한다. | 상위UC: 수량 변경 |
| REQ-ORD-061 | Unwanted | IF 장바구니 상품 수가 50개를 초과하면, THEN THE 시스템은 SHALL 추가를 거부하고 "장바구니가 가득 찼습니다" 메시지를 반환한다. | 정책서 1.5: 최대 50개 |
| REQ-ORD-066 | Event-driven | WHEN 비회원이 로그인하면, THE 시스템은 SHALL 비회원 장바구니를 회원 장바구니에 병합한다. | 정책서 1.7: 병합 규칙 |
| REQ-ORD-072 | Event-driven | WHEN 고객이 주문서를 제출하면, THE 시스템은 SHALL 배송지·결제수단·쿠폰 적용 여부를 검증한 뒤 주문을 생성한다. | 상위UC: 주문서 제출 |
| REQ-ORD-073 | Ubiquitous | THE 시스템은 SHALL 주문 생성 시 적용된 할인·쿠폰·포인트 내역을 주문에 스냅샷으로 저장한다. | 정책서: 주문 시점 가격 확정 |

---

## 샘플: Order 도메인 (주문결제·연동 업무그룹, 발췌)

| ID | 패턴 | 요구사항 | 도출 근거 |
|---|---|---|---|
| REQ-ORD-001 | Event-driven | WHEN 고객이 결제를 요청하면, THE 시스템은 SHALL 재고를 선점하고 PG 결제 요청을 생성한다. | 상위UC: 결제 요청 |
| REQ-ORD-055 | Event-driven | WHEN Payment 도메인으로부터 결제완료 이벤트를 수신하면, THE 시스템은 SHALL 주문 상태를 PAYMENT_COMPLETED로 전환한다. | 도메인정의서 §4: Payment→Order 이벤트 |
| REQ-ORD-095 | Unwanted | IF Payment 도메인으로부터 결제실패 이벤트를 수신하면, THEN THE 시스템은 SHALL 선점된 재고를 복원하고 주문을 PAYMENT_FAILED로 전환한다. | 도메인정의서 §4 + 정책서: 실패 처리 |
| REQ-ORD-017 | Event-driven | WHEN 배송완료 후 7일이 경과하면, THE 시스템은 SHALL 자동으로 구매확정 처리한다. | 정책서 4.7: 자동 구매확정 |
| REQ-ORD-008 | Optional | WHERE CS 담당자가 예외 취소를 요청한 경우, THE 시스템은 SHALL 결제 상태와 무관하게 취소를 수행한다. | 상위UC: 예외 취소 (CS 전용) |

---

## 샘플: Catalog 도메인 (재고 관리 업무그룹, 발췌)

| ID | 패턴 | 요구사항 | 도출 근거 |
|---|---|---|---|
| REQ-CAT-001 | Event-driven | WHEN Order 도메인으로부터 재고선점 요청을 수신하면, THE 시스템은 SHALL 해당 SKU의 재고를 차감하고 선점 결과를 반환한다. | 도메인정의서 §4: Order→Catalog 동기 |
| REQ-CAT-002 | Unwanted | IF 요청된 수량이 가용 재고를 초과하면, THEN THE 시스템은 SHALL 선점을 거부하고 STOCK_INSUFFICIENT 에러를 반환한다. | 정책서: 품절 처리 |
| REQ-CAT-003 | Event-driven | WHEN Order 도메인으로부터 재고복원 이벤트를 수신하면, THE 시스템은 SHALL 선점 수량만큼 재고를 복원한다. | 도메인정의서 §4: Order→Catalog 비동기 |
| REQ-CAT-010 | State-driven | WHILE 상품이 판매중지(SUSPENDED) 상태인 동안, THE 시스템은 SHALL 해당 상품의 구매 요청을 거부한다. | 상위UC: 상품 상태 관리 |
| REQ-CAT-015 | Unwanted | IF SKU 재고가 안전재고(10개) 이하로 떨어지면, THEN THE 시스템은 SHALL Notification 도메인에 경고 알림을 요청한다. | 정책서 5.6: 안전재고 경고 |

---

## 작성 팁

| 팁 | 설명 |
|---|---|
| **1 EARS = 1 테스트 가능 단위** | 하나의 EARS는 하나의 GWT 시나리오로 검증 가능해야 한다 |
| **트리거를 명확히** | Event-driven의 WHEN절은 외부에서 관찰 가능한 이벤트여야 한다 (시스템 내부 판단 ✗) |
| **수치는 정책서에서** | "10일", "50개", "3분" 같은 수치는 정책서를 근거로 명시. 근거 없으면 정책서 확인 요청 |
| **도메인 간 연동은 양쪽에** | Order가 Catalog에 재고선점을 요청하면, Order 측 EARS + Catalog 측 EARS 양쪽 필요 |
| **Unwanted는 정상의 반대가 아님** | 단순 실패뿐 아니라 동시성·타임아웃·경계값 등 예외 시나리오를 포함 |
| **업무그룹 단위로 파일 분리 가능** | 도메인 내 EARS가 30개를 넘으면 업무그룹별로 파일 분리 권장 |

---

## 파일 분리 기준 (대규모 도메인)

| 조건 | 방식 |
|---|---|
| EARS 30개 이하 | 단일 파일 (`08-EARS-Payment.md`) |
| EARS 30개 초과 | 업무그룹별 분리 (`08-EARS-Order-Cart.md`, `08-EARS-Order-Delivery.md`, ...) |

---

## 근거

| 항목 | 출처 |
|---|---|
| EARS 패턴 정의 | Alistair Mavin et al., "Easy Approach to Requirements Syntax" |
| 도출 입력 | 상위 유스케이스(⑥), 메뉴구조도(⑦), 정책서, 도메인정의서(⑤) |
| 예시 수치·규칙 | 자산 정책서 템플릿 (S0-착수) |
