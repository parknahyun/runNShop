# GWT 수용기준 — 주문·결제 도메인

> **단계**: 상세설계 (S3)  
> **문서범위**: Bolt (Order + Payment)  
> **문서종류**: Spec  
>
> **작성 목적**: EARS(⑧)의 기능요구를 Given-When-Then 시나리오로 변환하여,  
> "이 요구가 올바르게 구현되었는지 어떻게 검증하는가"를 정의한다.  
> QA가 그대로 테스트 케이스로 사용할 수 있는 수준으로 작성한다.
>
> **흐름 내 위치**:
> ```
> Bolt 분할 → ⑬ GWT → ⑭ 세부UC → ⑮ 인터페이스 명세
> ```

---

## ID 규칙

```
AC-{DOMAIN}-{SEQ}
```
- AC: Acceptance Criteria
- DOMAIN: ORD(주문) / PAY(결제)
- SEQ: 3자리 순번

---

## 1. 장바구니 Bolt

| ID | 카테고리 | 대응 EARS | Given | When | Then |
|---|---|---|---|---|---|
| AC-ORD-001 | 정상 | REQ-ORD-001 | 고객이 로그인 상태이고, 상품A(SKU-001)가 판매중이다 | 고객이 상품A를 장바구니에 담는다 | 장바구니에 상품A·SKU-001·수량1이 저장된다 |
| AC-ORD-002 | 정상 | REQ-ORD-002 | 장바구니에 상품A·수량2가 있다 | 고객이 수량을 5로 변경한다 | 수량이 5로 갱신되고 소계가 재계산된다 |
| AC-ORD-003 | 정상 | REQ-ORD-003 | 장바구니에 상품A가 있다 | 고객이 상품A를 삭제한다 | 해당 항목이 is_deleted=true로 논리 삭제된다 |
| AC-ORD-004 | 경계값 | REQ-ORD-004 | 장바구니에 상품이 49개 있다 | 고객이 50번째 상품을 담는다 | 정상 추가된다 (최대 50개 허용) |
| AC-ORD-005 | 예외 | REQ-ORD-004 | 장바구니에 상품이 50개 있다 | 고객이 51번째 상품을 담는다 | "장바구니가 가득 찼습니다" 메시지 반환, 추가 거부 |
| AC-ORD-006 | 정상 | REQ-ORD-005 | 장바구니에 상품A(SKU-001)·수량2가 있다 | 고객이 같은 상품A(SKU-001)를 수량3으로 담는다 | 수량이 5로 합산된다 (중복 라인 미생성) |
| AC-ORD-007 | 정상 | REQ-ORD-006 | 비회원 장바구니에 상품A·수량3이 있고, 회원 장바구니에 상품A·수량5가 있다 | 비회원이 로그인한다 | 상품A 수량이 8로 합산 병합된다 |
| AC-ORD-008 | 예외 | REQ-ORD-001 | 상품B가 품절(SOLD_OUT) 상태이다 | 고객이 상품B를 장바구니에 담으려 한다 | "현재 구매할 수 없는 상품입니다" 반환, 추가 거부 |

---

## 2. 주문 생성·결제 요청 Bolt

| ID | 카테고리 | 대응 EARS | Given | When | Then |
|---|---|---|---|---|---|
| AC-ORD-009 | 정상 | REQ-ORD-008 | 고객이 장바구니에 상품 2개를 담고, 배송지·결제수단을 선택했다 | 고객이 주문서를 제출한다 | ord_platform_order 생성, 입점사별 ord_order 분할, 상태=ORDER_RECEIVED |
| AC-ORD-010 | 정상 | REQ-ORD-009 | 주문서에 쿠폰 5,000원, 포인트 3,000원이 적용되었다 | 주문이 생성된다 | 할인·쿠폰·포인트 내역이 주문에 스냅샷으로 저장된다 |
| AC-ORD-011 | 정상 | REQ-ORD-011 | 장바구니에 입점사A 상품 2개, 입점사B 상품 1개가 있다 | 고객이 주문서를 제출한다 | 1개 platform_order + 2개 ord_order(입점사별)로 분할 생성된다 |
| AC-ORD-012 | 예외 | REQ-ORD-010 | 고객이 배송지를 입력하지 않았다 | 고객이 주문서를 제출한다 | "배송지를 입력해주세요" 반환, 주문 생성 거부 |
| AC-ORD-013 | 정상 | REQ-ORD-012 | 주문이 ORDER_RECEIVED 상태로 생성되었다 | 시스템이 결제 요청을 전달한다 | Catalog에 재고 선점 후 상태→PAYMENT_PENDING 전환, Payment에 결제 요청 전달 |
| AC-ORD-014 | 정상 | REQ-ORD-007 | 고객이 상품상세에서 "바로구매"를 선택했다 | 바로구매 주문서를 제출한다 | 장바구니 미경유, 즉시 주문 생성 |

---

## 3. 결제 완료 처리 Bolt

| ID | 카테고리 | 대응 EARS | Given | When | Then |
|---|---|---|---|---|---|
| AC-ORD-015 | 정상 | REQ-ORD-013 | 주문이 PAYMENT_PENDING 상태이다 | PAYMENT_APPROVED 이벤트를 수신한다 | 주문 상태가 PAYMENT_COMPLETED로 전환된다 |
| AC-PAY-001 | 정상 | REQ-PAY-001 | Order에서 결제 요청을 수신했다 | Payment가 PG에 승인을 요청한다 | PG 승인 성공 응답 수신, 상태→PAID |
| AC-PAY-002 | 정상 | REQ-PAY-002 | PG 승인이 성공했다 | 결제 상태가 PAID로 전환된다 | PAYMENT_APPROVED 이벤트가 Order에 발행된다 |
| AC-PAY-003 | 정상 | REQ-PAY-006 | PG에 승인 요청을 보냈다 | 응답이 도착한다 | 요청·응답 전체가 pay_payment_log에 기록된다 |
| AC-PAY-004 | 정상 | REQ-PAY-007 | PG 승인 요청 금액이 100,000원이다 | 주문 결제 요청 금액과 비교한다 | 금액이 일치하면 승인 진행, 불일치 시 거부 |

---

## 4. 결제 실패 처리 Bolt

| ID | 카테고리 | 대응 EARS | Given | When | Then |
|---|---|---|---|---|---|
| AC-PAY-005 | 정상 | REQ-PAY-003 | PG 승인이 실패했다 (1회차) | 시스템이 재시도한다 | 최대 3회까지 재시도 (retry_count 증가) |
| AC-PAY-006 | 경계값 | REQ-PAY-003 | PG 승인이 3회 연속 실패했다 | 3회차 실패 응답을 수신한다 | 결제 상태→CANCELLED, PAYMENT_FAILED 이벤트 발행 |
| AC-PAY-007 | 예외 | REQ-PAY-005 | PG에 승인 요청을 보냈다 | 30초 내 응답이 없다 | 타임아웃 처리, 재시도 프로세스 시작 |
| AC-ORD-016 | 정상 | REQ-ORD-014 | 주문이 PAYMENT_PENDING 상태이다 | PAYMENT_FAILED 이벤트를 수신한다 | 재고 복원, 주문 상태→PAYMENT_FAILED |

---

## 5. 고객 취소 Bolt

| ID | 카테고리 | 대응 EARS | Given | When | Then |
|---|---|---|---|---|---|
| AC-ORD-017 | 정상 | REQ-ORD-018 | 주문이 PAYMENT_COMPLETED 상태이다 | 고객이 취소를 요청한다 | 주문 상태→CANCELLED, ORDER_CANCELLED 이벤트 발행 (환불·재고복원) |
| AC-ORD-018 | 예외 | REQ-ORD-019 | 주문이 PREPARING 상태이다 | 고객이 취소를 요청한다 | "출고 준비 중에는 취소할 수 없습니다. 반품 신청을 이용해주세요" 반환 |
| AC-ORD-019 | 예외 | REQ-ORD-019 | 주문이 IN_DELIVERY 상태이다 | 고객이 취소를 요청한다 | "배송 중에는 취소할 수 없습니다. 반품 신청을 이용해주세요" 반환 |
| AC-ORD-020 | 정상 | REQ-ORD-017 | 주문이 PREPARING 상태이다 (CS 예외 취소) | CS 담당자가 예외 취소를 요청한다 | 주문 상태→CANCELLED, 환불 요청 발행 |

---

## 6. 출고·배송 Bolt

| ID | 카테고리 | 대응 EARS | Given | When | Then |
|---|---|---|---|---|---|
| AC-ORD-021 | 정상 | REQ-ORD-022 | 주문이 PAYMENT_COMPLETED 상태이다 | 판매자가 출고 처리를 요청한다 | 주문 상태→PREPARING |
| AC-ORD-022 | 정상 | REQ-ORD-023 | 주문이 PREPARING 상태이다 | 판매자가 운송장 번호를 등록한다 | 주문 상태→IN_DELIVERY, 배송 추적 시작 |
| AC-ORD-023 | 정상 | REQ-ORD-024 | 주문이 IN_DELIVERY 상태이다 | 택배사 API로부터 배송완료 신호를 수신한다 | 주문 상태→DELIVERED |
| AC-ORD-024 | 정상 | REQ-ORD-025 | 주문이 PAYMENT_COMPLETED 상태이다 | 고객이 배송지 변경을 요청한다 | 배송지 정보가 갱신된다 |
| AC-ORD-025 | 예외 | REQ-ORD-026 | 주문이 PREPARING 상태이다 | 고객이 배송지 변경을 요청한다 | "출고 후에는 변경할 수 없습니다" 반환 |

---

## 7. 구매확정 Bolt

| ID | 카테고리 | 대응 EARS | Given | When | Then |
|---|---|---|---|---|---|
| AC-ORD-026 | 정상 | REQ-ORD-015 | 주문이 DELIVERED 상태이고 7일이 경과했다 | 자동 구매확정 배치가 실행된다 | 주문 상태→CONFIRMED, 정산 등록 + 포인트 적립 이벤트 발행 |
| AC-ORD-027 | 정상 | REQ-ORD-016 | 주문이 DELIVERED 상태이고 3일 경과했다 | 고객이 수동 구매확정을 요청한다 | 주문 상태→CONFIRMED (7일 미경과도 가능) |
| AC-ORD-028 | 경계값 | REQ-ORD-015 | 주문이 DELIVERED 상태이고 정확히 7일(168시간)이 경과했다 | 배치가 실행된다 | 자동 구매확정 처리됨 |

---

## 8. 클레임(반품·교환) Bolt

| ID | 카테고리 | 대응 EARS | Given | When | Then |
|---|---|---|---|---|---|
| AC-ORD-029 | 정상 | REQ-ORD-028 | 주문이 DELIVERED 상태, 배송완료 후 5일 경과 | 고객이 반품을 신청한다 | 클레임이 RECEIVED 상태(RETURN 유형)로 생성된다 |
| AC-ORD-030 | 정상 | REQ-ORD-029 | 주문이 DELIVERED 상태, 배송완료 후 3일 경과 | 고객이 교환을 신청한다 | 클레임이 RECEIVED 상태(EXCHANGE 유형)로 생성된다 |
| AC-ORD-031 | 경계값 | REQ-ORD-030 | 배송완료 후 정확히 10일 경과 | 고객이 반품을 신청한다 | 정상 접수 (10일 이내 허용) |
| AC-ORD-032 | 예외 | REQ-ORD-030 | 배송완료 후 11일 경과 | 고객이 반품을 신청한다 | "기한이 초과되었습니다" 반환, 신청 거부 |
| AC-ORD-033 | 정상 | REQ-ORD-040 | 클레임이 RECEIVED 상태이고 CS가 고객 귀책으로 판정했다 | 귀책판정이 확정된다 | 클레임 상태→PAYMENT_PENDING, 수거 배송비 결제 알림톡 발송 |
| AC-ORD-034 | 정상 | — | 클레임이 RECEIVED 상태이고 CS가 판매자 귀책으로 판정했다 | 귀책판정이 확정된다 | 클레임 상태→PICKUP (배송비 없이 수거 즉시 시작) |
| AC-ORD-035 | 정상 | REQ-ORD-033 | 클레임이 RECEIVED 상태이다 | CS 담당자가 즉시 반려한다 | 클레임 상태→REJECTED, 사유 기록 |
| AC-ORD-036 | 정상 | REQ-ORD-035 | 클레임이 완료 처리되어 CLAIM_COMPLETED 이벤트가 발행된다 | Payment·Catalog·Member가 각각 이벤트를 수신한다 | Payment는 환불, Catalog는 재고복원, Member는 포인트복원을 수행한다 |

---

## 9. 환불 Bolt (Payment)

| ID | 카테고리 | 대응 EARS | Given | When | Then |
|---|---|---|---|---|---|
| AC-PAY-008 | 정상 | REQ-PAY-008 | 결제가 PAID 상태이다 | ORDER_CANCELLED 이벤트를 수신한다 | PG에 전액 환불 요청, 상태→REFUNDED |
| AC-PAY-009 | 정상 | REQ-PAY-009 | 결제가 PAID 상태이다 | CLAIM_COMPLETED 이벤트를 수신한다 | PG에 부분 환불 요청, 상태→PARTIAL_REFUNDED |
| AC-PAY-010 | 정상 | REQ-PAY-010 | PG 환불 요청이 성공했다 (전액) | 환불 응답을 수신한다 | 결제 상태→REFUNDED |
| AC-PAY-011 | 정상 | REQ-PAY-010 | PG 부분 환불이 성공했다 | 환불 응답을 수신한다 | 결제 상태→PARTIAL_REFUNDED |
| AC-PAY-012 | 예외 | REQ-PAY-011 | PG 자동 환불이 실패했다 | 환불 실패 응답을 수신한다 | CS 담당자에게 알림, 수동 환불 대기 상태 전환 |
| AC-PAY-013 | 정상 | REQ-PAY-012 | 수동 환불 대기 상태이다 | CS 담당자가 수동 환불을 처리한다 | PG 재환불 요청, 결과 기록 |
| AC-PAY-014 | 정상 | REQ-PAY-013 | 환불을 처리한다 | — | 원칙적으로 원결제 수단으로 환불된다. 단, 원결제 수단 환불이 불가능한 경우 CS 담당자 승인 하에 계좌이체(수동)로 대체할 수 있다 |

---

## 10. 결제수단 관리 Bolt (Payment)

| ID | 카테고리 | 대응 EARS | Given | When | Then |
|---|---|---|---|---|---|
| AC-PAY-015 | 정상 | REQ-PAY-014 | 고객이 신용카드 정보를 입력했다 | 결제수단을 등록한다 | PG 토큰 발급, pay_payment_method에 저장 (카드번호 미저장) |
| AC-PAY-016 | 정상 | REQ-PAY-015 | 고객이 등록된 결제수단이 있다 | 결제수단을 삭제한다 | 토큰 무효화, 목록에서 제거 (is_deleted=true) |
| AC-PAY-017 | 정상 | REQ-PAY-016 | 고객이 결제수단 2개를 등록했다 | 결제수단 목록을 조회한다 | 본인 수단만 마스킹(****-1234)하여 반환 |
| AC-PAY-018 | 정상 | REQ-PAY-017 | — | 결제수단 등록 시 | 카드번호·CVV는 서버에 저장되지 않는다 (PG 토큰만 보유) |

---

## 11. 카드 제한 Bolt (Payment)

| ID | 카테고리 | 대응 EARS | Given | When | Then |
|---|---|---|---|---|---|
| AC-PAY-019 | 정상 | REQ-PAY-018 | 동일 카드로 2회 연속 결제 실패했다 | 3회째 실패한다 | 해당 카드 당일 결제 차단, 고객에게 안내 |
| AC-PAY-020 | 경계값 | REQ-PAY-018 | 동일 카드로 2회 실패 후 1회 성공했다 | 다시 실패한다 | 연속 카운트 리셋 → 1회 실패 (차단 안 됨) |
| AC-PAY-021 | 정상 | REQ-PAY-019 | 카드가 당일 차단 상태이다 | 익일 00:00이 된다 | 제한 자동 해제 (released_at 기록) |

---

## 12. 주문 조회 Bolt

| ID | 카테고리 | 대응 EARS | Given | When | Then |
|---|---|---|---|---|---|
| AC-ORD-037 | 정상 | REQ-ORD-036 | 고객이 주문 3건을 보유하고 있다 | 주문 목록을 조회한다 | 본인 주문만 최신순으로 반환된다 |
| AC-ORD-038 | 정상 | REQ-ORD-037 | 판매자가 주문 5건을 수주했다 | 주문 목록을 조회한다 | 자기 매장 주문만 반환된다 |
| AC-ORD-039 | 정상 | REQ-ORD-038 | CS 담당자가 전체 주문을 조회한다 | 상태=CANCELLED, 기간=2026.06.01~06.30 필터를 적용한다 | 해당 조건의 주문만 반환된다 |
| AC-ORD-040 | 정상 | REQ-ORD-039 | 주문 상태가 PAYMENT_COMPLETED→PREPARING으로 변경되었다 | — | ord_order_history에 이력이 기록된다 |

---

## 13. 클레임 배송비 결제 Bolt

| ID | 카테고리 | 대응 EARS | Given | When | Then |
|---|---|---|---|---|---|
| AC-ORD-041 | 정상 | REQ-ORD-041 | 고객 귀책 클레임이 PAYMENT_PENDING 상태이다 | 고객이 수거 배송비 5,000원을 결제한다 | 배송비 결제 완료, 클레임 상태 → PICKUP (수거 시작) |
| AC-ORD-042 | 정상 | REQ-ORD-041 | 배송비 쿠폰이 적용되어 결제금액 0원이다 | 고객이 [결제하기] 클릭한다 | 쿠폰으로 전액 충당, 수거 즉시 시작 |
| AC-ORD-043 | 예외 | REQ-ORD-042 | 클레임 PAYMENT_PENDING 상태에서 24시간이 경과했다 | 배치가 실행된다 | 클레임 자동 취소 (PAYMENT_EXPIRED) + 알림톡 발송 |
| AC-ORD-044 | 경계값 | REQ-ORD-042 | 클레임 PAYMENT_PENDING 상태에서 23시간 59분 경과 | 고객이 배송비를 결제한다 | 정상 결제 완료 (기한 내) |
| AC-ORD-045 | 정상 | REQ-ORD-043 | 클레임 PAYMENT_PENDING 상태에서 12시간 경과 | 배치가 실행된다 | 미결제 리마인드 알림톡 발송 |

---

## 14. 입점사 수거·품질점검 Bolt

| ID | 카테고리 | 대응 EARS | Given | When | Then |
|---|---|---|---|---|---|
| AC-ORD-046 | 정상 | REQ-ORD-044 | 배송비 결제 완료 상태이다 | 입점사가 수거 운송장을 등록한다 | 클레임 상태 → PICKUP (수거중) |
| AC-ORD-047 | 예외 | — | 배송비가 미결제 상태이다 | 입점사가 수거 운송장을 등록하려 한다 | "배송비 결제 후 수거 가능" 거부 |
| AC-ORD-048 | 정상 | REQ-ORD-045 | 클레임이 PICKUP 상태, 상품이 입고되었다 | 입점사가 [입고 확인] 클릭한다 | 클레임 상태 → INSPECTING (품질점검) |
| AC-ORD-049 | 정상 | REQ-ORD-046 | 클레임이 INSPECTING 상태, 상품 상태 양호 | 입점사가 [품질점검 합격] 클릭한다 | 클레임 상태 → PICKED_UP (수거완료) |
| AC-ORD-050 | 정상 | REQ-ORD-047 | 클레임이 INSPECTING 상태, 상품 훼손 확인 | 입점사가 [품질점검 거부] + 사유 입력한다 | 클레임 상태 → PICKUP_REJECTED (수거거부) |
| AC-ORD-051 | 예외 | REQ-ORD-048 | 클레임이 INSPECTING 상태이다 | 입점사가 사유 없이 [품질점검 거부]를 클릭한다 | "거부 사유를 입력해주세요" 반환, 거부 불가 |

---

## 15. 어드민 환불·폐기·반송 Bolt

| ID | 카테고리 | 대응 EARS | Given | When | Then |
|---|---|---|---|---|---|
| AC-ORD-052 | 정상 | — | 클레임이 PICKED_UP(수거완료) 상태이다 | 어드민이 [환불 처리] 클릭한다 | 클레임 상태 → REFUNDED, PG 환불 진행 |
| AC-ORD-053 | 정상 | — | 클레임이 REFUNDED 상태이다 | 환불 완료 배치가 실행된다 | 클레임 상태 → COMPLETED, 알림톡 발송 |
| AC-ORD-054 | 정상 | REQ-ORD-049 | 클레임이 PICKUP_REJECTED(수거거부) 상태이다 | 어드민이 [폐기 처리] 클릭한다 | 클레임 상태 → DISPOSED → COMPLETED |
| AC-ORD-055 | 정상 | REQ-ORD-050 | 클레임이 PICKUP_REJECTED 상태이다 | 어드민이 [반송 배송비 추가결제 요청] 클릭한다 | 고객에게 반송 배송비 결제 알림톡 발송, 상태 → RETURN_PAYMENT_PENDING |
| AC-ORD-056 | 정상 | REQ-ORD-051 | 클레임이 RETURN_PAYMENT_PENDING 상태, 반송 배송비 결제 완료 | 입점사가 반송 운송장을 등록한다 | 클레임 상태 → RETURN_SHIPPING (반송 배송중) |
| AC-ORD-057 | 정상 | REQ-ORD-052 | 클레임이 RETURN_SHIPPING 상태이다 | 택배사가 반송 배송완료를 확인한다(API) | 클레임 상태 → RETURN_DELIVERED (반송 배송완료) |
| AC-ORD-058 | 정상 | REQ-ORD-053 | 클레임이 RETURN_DELIVERED 상태이다 | 배치가 실행된다 | 클레임 상태 → COMPLETED, 알림톡 발송 |
| AC-ORD-062 | 정상 | REQ-ORD-056 | 클레임 유형이 EXCHANGE이고 귀책판정이 완료되어 PICKUP 상태로 전환된다 | 시스템이 PICKUP 전환을 처리한다 | 교환 SKU 재고가 선점되고 교환상품이 즉시 선출고된다 (원상품 수취 이전, 맞교환 원칙) |
| AC-ORD-063 | 정상 | REQ-ORD-057 | 클레임 유형이 EXCHANGE이고 INSPECTING 상태에서 회수 상품이 입고되었다 | 입점사가 택(TAG) 부착 상태를 확인한다 | 택이 유지되어 있으면 PICKED_UP(합격), 택이 제거·훼손되어 있으면 PICKUP_REJECTED(거부)로 판정된다 |
| AC-PAY-022 | 정상 | REQ-PAY-013 | 원결제수단 환불이 불가능하여 CS 담당자가 계좌이체 대체를 승인했다 | 어드민이 계좌이체 환불을 진행한다 | 입금정보(은행/계좌/예금주) 시스템 저장, 수동 이체 후 환불완료 처리 |

---

## 16. 장바구니 옵션 변경 Bolt

| ID | 카테고리 | 대응 EARS | Given | When | Then |
|---|---|---|---|---|---|
| AC-ORD-059 | 정상 | REQ-ORD-054 | 장바구니에 상품A(SKU-001, 블랙/265)가 있다 | 고객이 옵션을 화이트/265(SKU-002)로 변경한다 | SKU가 변경되고 소계 재계산 |
| AC-ORD-060 | 예외 | REQ-ORD-055 | 화이트/275(SKU-003) 옵션의 잔여수량(실재고−장바구니 선점)이 0이다 | 고객이 해당 옵션을 선택한다 | "해당 옵션은 품절입니다" 선택 불가 |
| AC-ORD-061 | 정상 | — | 블랙/265(SKU-001) 잔여수량이 7개이다 | 고객이 옵션변경 팝업을 연다 | 잔여수량 "7개" 표시, 품절 옵션은 [×] 비활성화 |

---

## 17. 조회 Bolt (Payment)

| ID | 카테고리 | 대응 EARS | Given | When | Then |
|---|---|---|---|---|---|
| AC-PAY-023 | 정상 | REQ-PAY-020 | 고객이 결제 3건을 보유하고 있다 | 고객이 결제 이력을 조회한다 | 본인 결제 건만 최신순으로 반환된다 |
| AC-PAY-024 | 정상 | REQ-PAY-021 | CS 담당자가 결제를 검색한다 | 상태·기간·주문번호·PG거래번호 필터를 적용한다 | 해당 조건에 맞는 결제 내역만 반환된다 |
| AC-PAY-025 | 정상 | REQ-PAY-022 | CS 담당자가 특정 결제 건의 PG 거래 로그를 조회한다 | 조회를 실행한다 | 해당 결제의 전체 요청·응답 이력이 PII 마스킹되어 반환된다 |

---

## 근거

| 항목 | 출처 |
|---|---|
| 시나리오 도출 | EARS(⑧) REQ-ORD-001~057, REQ-PAY-001~022 → GWT 변환 |
| 경계값 수치 | 정책서 (50개 장바구니, D+7 자동확정, 반품 10일, 재시도 3회, 30초 타임아웃, 배송비결제 24시간) |
| 예외 시나리오 | EARS Unwanted/Optional 패턴 + 화면레이아웃(⑰) 정책 미결 사항 |
| 상태 전이 | 상태머신(⑩) Order 11상태, Claim 14상태(RECEIVED→PAYMENT_PENDING/PICKUP→INSPECTING→PICKED_UP/PICKUP_REJECTED→REFUNDED→COMPLETED/DISPOSED/RETURN_PAYMENT_PENDING→RETURN_SHIPPING→RETURN_DELIVERED). Claim은 CS "처리시작(IN_PROGRESS)" 단계 없이 RECEIVED에서 귀책판정으로 곧바로 분기한다 |
