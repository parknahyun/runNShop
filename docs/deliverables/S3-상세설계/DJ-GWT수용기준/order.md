# GWT 수용기준 — Order 도메인

> 상위 문서: [readme.md](readme.md)
> **단계**: 상세설계 (S3) | **문서범위**: Bolt (Order) | **문서종류**: Spec
> Payment 관련 시나리오는 [payment.md](payment.md) 참조

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
| AC-ORD-008 | 예외 | REQ-ORD-001, REQ-ORD-063 | 상품B가 품절(SOLD_OUT) 상태이다 | 고객이 상품B를 장바구니에 담으려 한다 | "현재 구매할 수 없는 상품입니다" 반환, 추가 거부 |
| AC-ORD-065 | 경계값 | REQ-ORD-064 | 장바구니 상품 수량이 1이다 | 고객이 수량을 0으로 변경한다 | 변경이 거부된다, "수량은 1~99 사이로 입력해주세요" 반환 (1 유지) |
| AC-ORD-066 | 경계값 | REQ-ORD-064 | 장바구니 상품 수량이 99이다 | 고객이 수량을 100으로 변경한다 | 변경이 거부된다, 유효 범위 안내 (99 유지) |

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

> (Payment 도메인 관련 나머지 항목은 [payment.md](payment.md) 참조)

| ID | 카테고리 | 대응 EARS | Given | When | Then |
|---|---|---|---|---|---|
| AC-ORD-015 | 정상 | REQ-ORD-013 | 주문이 PAYMENT_PENDING 상태이다 | PAYMENT_APPROVED 이벤트를 수신한다 | 주문 상태가 PAYMENT_COMPLETED로 전환된다 |

---

## 4. 결제 실패 처리 Bolt

> (Payment 도메인 관련 나머지 항목은 [payment.md](payment.md) 참조)

| ID | 카테고리 | 대응 EARS | Given | When | Then |
|---|---|---|---|---|---|
| AC-ORD-016 | 정상 | REQ-ORD-014 | 주문이 PAYMENT_PENDING 상태이다 | PAYMENT_FAILED 이벤트를 수신한다 | 재고 복원, 주문 상태→PAYMENT_FAILED |

---

## 5. 고객 취소 Bolt

| ID | 카테고리 | 대응 EARS | Given | When | Then |
|---|---|---|---|---|---|
| AC-ORD-017 | 정상 | REQ-ORD-018 | 주문이 PAYMENT_COMPLETED 상태이다 | 고객이 취소를 요청한다 | 주문 상태→CANCELLED, ORDER_CANCELLED 이벤트 발행 (환불·재고복원) |
| AC-ORD-018 | 예외 | REQ-ORD-019 | 주문이 PREPARING 상태이다 | 고객이 취소를 요청한다 | "출고 준비 중에는 취소할 수 없습니다. 반품 신청을 이용해주세요" 반환 |
| AC-ORD-019 | 예외 | REQ-ORD-019 | 주문이 PREPARING 상태이고 shipment(OUTBOUND)가 IN_TRANSIT 상태이다 (배송 중) | 고객이 취소를 요청한다 | "배송 중에는 취소할 수 없습니다. 반품 신청을 이용해주세요" 반환 |
| AC-ORD-020 | 정상 | REQ-ORD-017 | 주문이 PREPARING 상태이다 (CS 예외 취소) | CS 담당자가 예외 취소를 요청한다 | 주문 상태→CANCELLED, 환불 요청 발행 |

---

## 6. 출고·배송 Bolt

| ID | 카테고리 | 대응 EARS | Given | When | Then |
|---|---|---|---|---|---|
| AC-ORD-021 | 정상 | REQ-ORD-022 | 주문이 PAYMENT_COMPLETED 상태이다 | 입점사가 출고 처리를 요청한다 | 주문 상태→PREPARING |
| AC-ORD-022 | 정상 | REQ-ORD-023 | 주문이 PREPARING 상태이다 | 입점사가 운송장 번호를 등록한다 | shipment(OUTBOUND) 생성, 상태→IN_TRANSIT (주문 상태는 PREPARING 유지) |
| AC-ORD-023 | 정상 | REQ-ORD-024 | shipment(OUTBOUND)가 IN_TRANSIT 상태이다 | 택배사 API로부터 배송완료 신호를 수신한다 | shipment(OUTBOUND) 상태→DELIVERED, 이를 구독하여 주문 상태→DELIVERED로 파생 전환된다 |
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
| AC-ORD-072 | 예외 | REQ-ORD-070 | 원 주문 상품이 상품A(productId=P001)이다 | 고객이 교환 신청 시 exchangeSkuId를 다른 상품(productId=P002)의 SKU로 지정한다 | 신청이 거부된다 ("교환은 동일 상품 내 옵션 변경만 가능합니다") |
| AC-ORD-031 | 경계값 | REQ-ORD-030 | 배송완료 후 정확히 10일 경과 | 고객이 반품을 신청한다 | 정상 접수 (10일 이내 허용) |
| AC-ORD-032 | 예외 | REQ-ORD-030 | 배송완료 후 11일 경과 | 고객이 반품을 신청한다 | "기한이 초과되었습니다" 반환, 신청 거부 |
| AC-ORD-069 | 정상 | REQ-ORD-067 | 동일 주문 상품에 반려(REJECTED) 클레임 1건, 만료(PAYMENT_EXPIRED) 클레임 1건이 있다 | 고객이 재신청 가능 수량을 조회한다 | 반려·만료 건은 차감 대상에서 제외되어 원래 구매수량 그대로 재신청 가능 수량으로 반환된다 |
| AC-ORD-033 | 정상 | REQ-ORD-040 | 클레임이 RECEIVED 상태이고 CS가 고객 귀책으로 판정했다 | 귀책판정이 확정된다 | 클레임 상태→PAYMENT_PENDING, 수거 배송비 결제 알림톡 발송 |
| AC-ORD-034 | 정상 | REQ-ORD-031 | 클레임이 RECEIVED 상태이고 CS가 입점사 귀책으로 판정했다 | 귀책판정이 확정된다 | shipment(PICKUP) 생성, 수거 즉시 시작 (배송비 없음). 클레임 상태는 RECEIVED 유지 (입고 확인 시 INSPECTING으로 전환, REQ-ORD-032) |
| AC-ORD-068 | 정상 | REQ-ORD-066, REQ-ORD-076 | 클레임이 RECEIVED 상태, 고객이 submitted_responsibility=CUSTOMER로 신청했다 | CS 담당자가 접수 확인 중 실제로는 입점사 귀책이라고 판단해 VENDOR로 판정한다 | 클레임 상태는 RECEIVED 유지, shipment(PICKUP) 생성 및 즉시 수거 시작 (CS 판정이 최종 — submitted_responsibility=CUSTOMER는 그대로 보존되고 responsibility만 VENDOR로 갱신됨. INSPECTING 전환은 입고확인 이후, AC-ORD-048 참조) |
| AC-ORD-064 | 예외 | REQ-ORD-058 | 고객이 입점사(VENDOR) 귀책 사유를 선택했고 첨부 사진이 0장이다 | 고객이 반품/교환 신청을 제출한다 | "상품 상태를 확인할 수 있는 사진을 1장 이상 첨부해주세요" 반환, 신청 거부 |
| AC-ORD-067 | 경계값 | REQ-ORD-065 | 클레임 신청 중 첨부 이미지가 3장 첨부되어 있다 | 고객이 4번째 이미지를 첨부하려 한다 | 추가 첨부가 거부된다 ("최대 3장까지 첨부 가능합니다") |
| AC-ORD-035 | 정상 | REQ-ORD-033 | 클레임이 RECEIVED 상태이다 | CS 담당자가 즉시 반려한다 | 클레임 상태→REJECTED, 사유 기록 |
| AC-ORD-070 | 정상 | REQ-ORD-068 | 클레임이 RECEIVED 상태로 24시간 이상 CS 미처리 상태이다 | 리마인드 배치가 실행된다 | CS 담당자에게 리마인드 알림이 발송된다 |
| AC-ORD-075 | 정상 | REQ-ORD-073 | 클레임이 RECEIVED 상태이다 (또는 PAYMENT_PENDING 상태, 귀책판정 이전) | 고객이 클레임 자진 취소를 요청한다 | 클레임 상태 → REJECTED로 전환되고 사유가 "고객 자진 철회"로 기록되며, 취소완료 알림톡이 발송된다 |
| AC-ORD-073 | 예외 | REQ-ORD-071 | 클레임이 INSPECTING 상태이다 | 고객이 클레임 자진 취소를 요청한다 | "귀책판정 이후에는 취소할 수 없습니다" 반환, 취소가 거부된다 |
| AC-ORD-036 | 정상 | REQ-ORD-035 | 클레임이 완료 처리되어 CLAIM_COMPLETED 이벤트가 발행된다 | Payment·Catalog·Member가 각각 이벤트를 수신한다 | Payment는 환불, Catalog는 재고복원, Member는 포인트복원을 수행한다 |

---

## 12. 주문 조회 Bolt

| ID | 카테고리 | 대응 EARS | Given | When | Then |
|---|---|---|---|---|---|
| AC-ORD-037 | 정상 | REQ-ORD-036 | 고객이 주문 3건을 보유하고 있다 | 주문 목록을 조회한다 | 본인 주문만 최신순으로 반환된다 |
| AC-ORD-038 | 정상 | REQ-ORD-037 | 입점사가 주문 5건을 수주했다 | 주문 목록을 조회한다 | 자기 매장 주문만 반환된다 |
| AC-ORD-039 | 정상 | REQ-ORD-038 | CS 담당자가 전체 주문을 조회한다 | 상태=CANCELLED, 기간=2026.06.01~06.30 필터를 적용한다 | 해당 조건의 주문만 반환된다 |
| AC-ORD-040 | 정상 | REQ-ORD-039 | 주문 상태가 PAYMENT_COMPLETED→PREPARING으로 변경되었다 | — | ord_order_history에 이력이 기록된다 |

---

## 13. 클레임 배송비 결제 Bolt

| ID | 카테고리 | 대응 EARS | Given | When | Then |
|---|---|---|---|---|---|
| AC-ORD-041 | 정상 | REQ-ORD-041 | 고객 귀책 클레임이 PAYMENT_PENDING 상태이다 | 고객이 수거 배송비 5,000원을 결제한다 | 배송비 결제 완료, shipment(PICKUP) 생성 및 수거 프로세스 시작 (클레임 상태는 PAYMENT_PENDING 유지, INSPECTING 전환은 AC-ORD-048 참조) |
| AC-ORD-042 | 정상 | REQ-ORD-041 | 배송비 쿠폰이 적용되어 결제금액 0원이다 | 고객이 [결제하기] 클릭한다 | 쿠폰으로 전액 충당, shipment(PICKUP) 생성 및 수거 즉시 시작 (클레임 상태는 PAYMENT_PENDING 유지) |
| AC-ORD-043 | 예외 | REQ-ORD-042 | 클레임 PAYMENT_PENDING 상태에서 24시간이 경과했다 | 배치가 실행된다 | 클레임 자동 취소 (PAYMENT_EXPIRED) + 알림톡 발송 |
| AC-ORD-044 | 경계값 | REQ-ORD-042 | 클레임 PAYMENT_PENDING 상태에서 23시간 59분 경과 | 고객이 배송비를 결제한다 | 정상 결제 완료 (기한 내) |
| AC-ORD-045 | 정상 | REQ-ORD-043 | 클레임 PAYMENT_PENDING 상태에서 12시간 경과 | 배치가 실행된다 | 미결제 리마인드 알림톡 발송 |

---

## 14. 입점사 수거·품질점검 Bolt

| ID | 카테고리 | 대응 EARS | Given | When | Then |
|---|---|---|---|---|---|
| AC-ORD-046 | 정상 | REQ-ORD-044 | 배송비 결제 완료 상태이다 (클레임: PAYMENT_PENDING, 또는 입점사귀책으로 RECEIVED 유지 중) | 입점사가 수거 운송장을 등록한다 | shipment(PICKUP) 상태 → IN_TRANSIT (클레임 상태는 PAYMENT_PENDING 또는 RECEIVED로 그대로 유지) |
| AC-ORD-047 | 예외 | — | 배송비가 미결제 상태이다 | 입점사가 수거 운송장을 등록하려 한다 | "배송비 결제 후 수거 가능" 거부 |
| AC-ORD-048 | 정상 | REQ-ORD-045, REQ-ORD-032 | shipment(PICKUP)가 IN_TRANSIT 상태이고 상품이 입고되었다 | 입점사가 [입고 확인] 클릭한다 | shipment(PICKUP) 상태 → DELIVERED, 클레임 상태 → INSPECTING (품질점검) 전환 |
| AC-ORD-049 | 정상 | REQ-ORD-046 | 클레임이 INSPECTING 상태, 상품 상태 양호 | 입점사가 [품질점검 합격] 클릭한다 | 클레임 상태 → PICKED_UP (수거완료) |
| AC-ORD-050 | 정상 | REQ-ORD-047 | 클레임이 INSPECTING 상태, 상품 훼손 확인 | 입점사가 [품질점검 거부] + 사유 입력한다 | 클레임 상태 → PICKUP_REJECTED (수거거부) |
| AC-ORD-051 | 예외 | REQ-ORD-048 | 클레임이 INSPECTING 상태이다 | 입점사가 사유 없이 [품질점검 거부]를 클릭한다 | "거부 사유를 입력해주세요" 반환, 거부 불가 |
| AC-ORD-074 | 예외 | REQ-ORD-072 | 클레임 유형이 EXCHANGE이고 INSPECTING 상태이며, 입점사가 첨부 사진 없이 [품질점검 거부]를 시도한다 | 입점사가 거부 처리를 제출한다 | "사진을 첨부해주세요" 반환, 거부 처리가 거부된다 (사진 미첨부 시 처리 불가) |
| AC-ORD-078 | 정상 | REQ-ORD-075 | 고객이 클레임 접수 시 사진 3장(uploaded_by=CUSTOMER)을 첨부했다 | 이후 입점사가 같은 클레임의 품질점검거부 처리를 하며 별도로 사진 2장(uploaded_by=VENDOR)을 첨부한다 | 업로더(CUSTOMER/VENDOR)별로 "최대 3장" 제약이 독립 적용되어, 입점사의 첨부가 고객 첨부 수량과 합산되지 않고 정상 등록된다 |

---

## 15. 어드민 환불·폐기·반송 Bolt

> (Payment 도메인 관련 나머지 항목은 [payment.md](payment.md) 참조)

| ID | 카테고리 | 대응 EARS | Given | When | Then |
|---|---|---|---|---|---|
| AC-ORD-052 | 정상 | — | 클레임이 PICKED_UP(수거완료) 상태이다 | 어드민이 [환불 처리] 클릭한다 | 클레임 상태 → REFUNDED, PG 환불 진행 |
| AC-ORD-053 | 정상 | — | 클레임이 REFUNDED 상태이다 | 환불 완료 배치가 실행된다 | 클레임 상태 → COMPLETED, 알림톡 발송 |
| AC-ORD-054 | 정상 | REQ-ORD-049 | 클레임이 PICKUP_REJECTED(수거거부) 상태이다 | 어드민이 [폐기 처리] 클릭한다 | 클레임 상태 → DISPOSED → COMPLETED |
| AC-ORD-055 | 정상 | REQ-ORD-050 | 클레임이 PICKUP_REJECTED 상태이다 | 어드민이 [반송 배송비 추가결제 요청] 클릭한다 | 고객에게 반송 배송비 결제 알림톡 발송, 상태 → RETURN_PAYMENT_PENDING |
| AC-ORD-056 | 정상 | REQ-ORD-051 | 클레임이 RETURN_PAYMENT_PENDING 상태, 반송 배송비 결제 완료 | 입점사가 반송 운송장을 등록한다 | shipment(RETURN) 생성, 상태 → IN_TRANSIT (클레임 상태는 RETURN_PAYMENT_PENDING 유지) |
| AC-ORD-057 | 정상 | REQ-ORD-052 | shipment(RETURN)가 IN_TRANSIT 상태이다 | 택배사가 반송 배송완료를 확인한다(API) | shipment(RETURN) 상태 → DELIVERED (클레임 상태는 RETURN_PAYMENT_PENDING 유지, COMPLETED 전환은 배치가 수행 — AC-ORD-058 참조) |
| AC-ORD-058 | 정상 | REQ-ORD-053 | 클레임이 RETURN_PAYMENT_PENDING 상태이고 shipment(RETURN)가 DELIVERED 상태이다 | 배치가 실행된다 | 클레임 상태 → COMPLETED로 직접 전환 (RETURN_SHIPPING/RETURN_DELIVERED 경유 없음), 알림톡 발송 |
| AC-ORD-071 | 예외 | REQ-ORD-069 | 클레임 유형이 EXCHANGE이고 교환 요청 SKU(exchangeSkuId)의 재고가 0이다 | CS 담당자가 입점사(VENDOR) 귀책으로 귀책판정을 확정하려 한다 | "교환 가능한 재고가 없습니다" 반환, 귀책판정 자체가 거부된다 (선출고 전 단계에서 차단) |
| AC-ORD-062 | 정상 | REQ-ORD-056 | 클레임 유형이 EXCHANGE이고 귀책판정이 완료된다 (입점사귀책: 판정 즉시 / 고객귀책: 수거배송비 결제완료) | 시스템이 귀책판정 완료를 처리한다 | 교환 SKU 재고가 선점되고 shipment(EXCHANGE_OUT)가 생성되어 교환상품이 즉시 선출고된다 (원상품 수취 이전, 맞교환 원칙) |
| AC-ORD-063 | 정상 | REQ-ORD-057 | 클레임 유형이 EXCHANGE이고 INSPECTING 상태에서 회수 상품이 입고되었다 | 입점사가 택(TAG) 부착 상태를 확인한다 | 택이 유지되어 있으면 PICKED_UP(합격), 택이 제거·훼손되어 있으면 PICKUP_REJECTED(거부)로 판정된다 |

---

## 16. 장바구니 옵션 변경 Bolt

| ID | 카테고리 | 대응 EARS | Given | When | Then |
|---|---|---|---|---|---|
| AC-ORD-059 | 정상 | REQ-ORD-054 | 장바구니에 상품A(SKU-001, 블랙/265)가 있다 | 고객이 옵션을 화이트/265(SKU-002)로 변경한다 | SKU가 변경되고 소계 재계산 |
| AC-ORD-060 | 예외 | REQ-ORD-055 | 화이트/275(SKU-003) 옵션의 잔여수량(실재고−장바구니 선점)이 0이다 | 고객이 해당 옵션을 선택한다 | "해당 옵션은 품절입니다" 선택 불가 |
| AC-ORD-061 | 정상 | — | 블랙/265(SKU-001) 잔여수량이 7개이다 | 고객이 옵션변경 팝업을 연다 | 잔여수량 "7개" 표시, 품절 옵션은 [×] 비활성화 |

---

## 18. 배송 재발송 Bolt

> 신규 (2026-08-21 바텀업 재검증): REQ-ORD-062 대응. shipment_type 공통(OUTBOUND/PICKUP/RETURN/EXCHANGE_OUT), DM-시퀀스/order §19 배치가 FAILED로 전환한 건을 입점사/CS가 수동 재처리한다.


| ID | 카테고리 | 대응 EARS | Given | When | Then |
|---|---|---|---|---|---|
| AC-ORD-076 | 정상 | REQ-ORD-062 | shipment(임의 유형)가 FAILED 상태이다 | 입점사 또는 CS 담당자가 새 운송장 정보로 재발송 처리를 요청한다 | shipment 상태가 FAILED→PENDING→IN_TRANSIT으로 전환되고 새 운송장이 등록된다 (이후 60분 주기 배치가 다시 추적) |
| AC-ORD-077 | 예외 | REQ-ORD-062 | shipment가 FAILED가 아닌 상태(예: IN_TRANSIT)이다 | 입점사 또는 CS 담당자가 재발송 처리를 요청한다 | "FAILED 상태만 재발송 가능합니다" 반환 (RESHIP_NOT_ALLOWED), 처리 거부 |

---

## 근거

| 항목 | 출처 |
|---|---|
| 시나리오 도출 | EARS(DD) REQ-ORD-001~076, REQ-PAY-001~024 → GWT 변환 (바텀업 재검증분 REQ-ORD-063~076, REQ-PAY-023~024 포함) |
| 경계값 수치 | 정책서 (50개 장바구니, D+7 자동확정, 반품 10일, 재시도 3회, 30초 타임아웃, 배송비결제 24시간) |
| 예외 시나리오 | EARS Unwanted/Optional 패턴 + 화면레이아웃(DN) 정책 미결 사항 |
| 상태 전이 | 상태머신(DH) v6 — Order 10상태(배송 실행은 ord_shipment로 분리; PREPARING에서 shipment(OUTBOUND) DELIVERED 이벤트 구독으로 DELIVERED 파생전환, IN_DELIVERY 상태 없음). Claim 11상태(RECEIVED→PAYMENT_PENDING(고객귀책) 또는 RECEIVED→INSPECTING(입점사귀책, shipment(PICKUP) 생성·DELIVERED 후 전환)→PICKED_UP/PICKUP_REJECTED→REFUNDED→COMPLETED/DISPOSED/RETURN_PAYMENT_PENDING→COMPLETED(shipment(RETURN) DELIVERED 후 배치가 직접 전환, RETURN_SHIPPING/RETURN_DELIVERED 경유 없음)). Claim은 CS "처리시작(IN_PROGRESS)" 단계 없이 RECEIVED에서 귀책판정으로 곧바로 분기한다. 신규 shipment.status(PENDING/IN_TRANSIT/DELIVERED/FAILED/CANCELLED, order/claim 공용, shipment_type=OUTBOUND/PICKUP/RETURN/EXCHANGE_OUT). responsibility는 CUSTOMER/VENDOR 2종 |
