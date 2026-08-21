# 프로그램 목록 (Order-Payment)

| ID | DESIGN-PGM-001 |
|---|---|
| 상태 | **Finalized** |
| 작성일 | 2026-08-12 |
| 갱신일 | 2026-08-21 |
| 도메인 | Order + Payment |
| 도출 소스 | 화면레이아웃(DN), 인터페이스명세(DL), 시퀀스(DM), 이벤트플로우(DI), EARS(DE) |

> **v2 (2026-08-20 현행화)**: S2 상태머신(Order) v4 반영 — 클레임 상태전이 오류 수정(API-026/027), EXCHANGE 판정기준 명시(API-039/040), 교환 선출고 API 신규(API-043), 반송배송완료 확인 API 신규(API-047, 인터페이스명세 39-2 대응). EARS(Payment) REQ-PAY-020~022 반영 — 결제이력조회/CS결제검색/PG거래로그조회 API 신규(API-044~046, 인터페이스명세 경로 2건 정정 포함).
> **v3 (2026-08-20 현행화)**: 전체 "상태전이" 컬럼 재점검 — 14/11/5상태 모델에 없는 값(CLAIM_RECEIVED, PICKUP_SHIPPING, SHIPPING, PURCHASE_CONFIRMED, ORDER_RECEIVED 오귀속) 6건 정정(API-013/034/037, BAT-001/003, CSM-001).
> **v4 (2026-08-20 현행화)**: S2 상태머신(Order) v6 반영 — 배송 실행(IN_DELIVERY/PICKUP/RETURN_SHIPPING/RETURN_DELIVERED)을 order.status·claim.status에서 신규 `ord_shipment`(order/claim 공용, shipment_type=OUTBOUND/PICKUP/RETURN/EXCHANGE_OUT, status=PENDING/IN_TRANSIT/DELIVERED/FAILED/CANCELLED)로 분리한 데 따라 "상태전이" 컬럼 10건 정정(API-018/026/027/034/036/037/041/043/047, BAT-003). 반품/교환 신청(API-013)에 "VENDOR귀책 시 사진 1장 이상 필수(REQ-ORD-058)" 비고 추가. 결제이력조회 등 responsibility 필터는 기존부터 CUSTOMER/VENDOR 2종으로 이미 일치(PLATFORM 값 미검출, 변경 불필요).
> **v5 (2026-08-21 바텀업 검토)**: 시퀀스(DM) §22(REQ-ORD-062) 신규 반영 — 배송 실패 재발송 API 신규 추가(API-048, 입점사 partner API, shipment FAILED→PENDING→IN_TRANSIT). 인터페이스명세(DL) #44와 1:1 대응 확인. 귀책 판정(API-026)에 "고객 자진신고 responsibility를 CS가 최종 확정(덮어쓰기 가능, REQ-ORD-066)" 비고 보강. 집계·정합성 검증 결과 갱신.
> **v6 (2026-08-21 시퀀스 §7-2 반영)**: 시퀀스(DM) §7-2 신규 반영 — 클레임 자진취소 API 신규 추가(API-049, 고객 mobile API, RECEIVED/PAYMENT_PENDING→REJECTED). API-048(재발송)에 "admin 클레임관리 화면에도 재발송 UI 추가 예정(DN-화면레이아웃 반영 중)" 비고 추가(현재 호출원은 SCR-P-004 단독, admin 화면 확정 시 SCR-A-004 추가 예정). 집계·정합성 검증 결과 갱신.

---

## 1. 화면 (SCR)

| PGM-ID | 프로그램명 | 채널 | 화면레이아웃 참조 | 세부UC 참조 | 호출 API | 비고 |
|---|---|---|---|---|---|---|
| SCR-M-001 | 장바구니 | mobile | §1 CartPage | UC-1, UC-2, UC-23 | API-001, API-002, API-003, API-004, API-005 | |
| SCR-M-002 | 주문서 | mobile | §2 OrderNewPage | UC-3, UC-4 | API-006, API-007, API-008, API-009 | 쿠폰 선택 포함 |
| SCR-M-003 | 주문 접수 완료 | mobile | §3 OrderCompletePage | UC-3 | — | 결과 표시만 |
| SCR-M-004 | 주문 접수 실패 | mobile | §4 OrderFailedPage | UC-3 | — | 결과 표시만 |
| SCR-M-005 | 마이페이지 | mobile | §7 MyPage | — | API-014, API-016 | 주문/클레임 진입점 |
| SCR-M-006 | 주문/배송 조회 목록 | mobile | §8 MyOrdersPage | UC-18 | API-014 | |
| SCR-M-007 | 주문 상세 | mobile | §8-1 OrderDetailPage | UC-18 | API-015, API-010, API-011, API-012 | 취소/확정/배송지변경 |
| SCR-M-008 | 반품/교환 신청 | mobile | §8-2 ClaimRequestPage | UC-10, UC-19 | API-013 | |
| SCR-M-009 | 반품/교환 신청 완료 | mobile | §8-3 ClaimRequestCompletePage | UC-19 | — | 결과 표시만 |
| SCR-M-010 | 클레임 목록 | mobile | §9 MyClaimsPage | UC-16 | API-016 | |
| SCR-M-011 | 클레임 상세 | mobile | §10 ClaimDetailPage | UC-17, UC-20 | API-017, API-018 | 배송비 결제 포함 |
| SCR-M-012 | 결제수단 관리 | mobile | — | UC-13 | API-019, API-020, API-021 | 마이페이지 하위 |
| SCR-A-001 | 주문 현황 (목록) | admin | §11 OrderHistory | UC-14 | API-022 | DataGrid+필터 |
| SCR-A-002 | 주문 상세 (컨테이너) | admin | §11 OrderDetail MDI탭 | UC-6, UC-14 | — | 감싸는 화면 |
| SCR-A-002-T1 | 주문 상세 — 주문상품 탭 | admin | §11 OrderItemsTab | UC-14 | API-023 | |
| SCR-A-002-T2 | 주문 상세 — 결제정보 탭 | admin | §11 PaymentInfoTab | UC-14 | API-023 | payment 섹션 |
| SCR-A-002-T3 | 주문 상세 — 배송정보 탭 | admin | §11 ShippingInfoTab | UC-14 | API-023 | shipping 섹션 |
| SCR-A-002-T4 | 주문 상세 — CS·클레임 탭 | admin | §11 ClaimTab | UC-6, UC-11 | API-023, API-024 | 예외취소 버튼 포함 |
| SCR-A-002-T5 | 주문 상세 — 주문문의 탭 | admin | §11 InquiryTab | UC-14 | API-023 | inquiries 섹션 |
| SCR-A-002-T6 | 주문 상세 — 변경이력 탭 | admin | §11 ChangeLogTab | UC-14 | API-023 | logs 섹션 |
| SCR-A-003 | 클레임 관리 (목록) | admin | §12 ClaimPage | UC-11 | API-025 | DataGrid+필터 |
| SCR-A-004 | 클레임 상세 (컨테이너) | admin | §12 ClaimDetail MDI탭 | UC-11, UC-22 | — | 감싸는 화면 |
| SCR-A-004-T1 | 클레임 상세 — 클레임상품 탭 | admin | §12 ClaimItemTab | UC-11, UC-22 | API-026, API-027, API-028 | 귀책판정/완료(수동)/반려 |
| SCR-A-004-T2 | 클레임 상세 — 환불정보 탭 | admin | §12 RefundTab | UC-22 | API-029 | 환불처리 |
| SCR-A-004-T3 | 클레임 상세 — 배송정보 탭 | admin | §12 ShippingTab | UC-22 | API-030, API-031 | 폐기/반송결제요청 |
| SCR-A-004-T4 | 클레임 상세 — 변경이력 탭 | admin | §12 LogTab | UC-11 | API-025 | logs 섹션 |
| SCR-P-001 | 입점사 주문 목록 (목록) | partner | §13 OrderListPage | UC-15 | API-032 | DataGrid |
| SCR-P-002 | 입점사 주문 상세 (컨테이너) | partner | §13 OrderDetail MDI탭 | UC-7, UC-15 | — | 감싸는 화면 |
| SCR-P-002-T1 | 입점사 주문 상세 — 주문상품 탭 | partner | §13 OrderItemTab | UC-7 | API-033, API-034 | 출고처리 버튼 |
| SCR-P-002-T2 | 입점사 주문 상세 — 배송정보 탭 | partner | §13 ShippingTab | UC-7 | API-033, API-036 | 운송장 등록 |
| SCR-P-002-T3 | 입점사 주문 상세 — 클레임 탭 | partner | §13 ClaimTab | UC-12 | API-033 | 클레임 목록 |
| SCR-P-002-T4 | 입점사 주문 상세 — 변경이력 탭 | partner | §13 LogTab | UC-15 | API-033 | logs 섹션 |
| SCR-P-003 | 입점사 클레임 상세 (컨테이너) | partner | §13-1 ClaimDetail MDI탭 | UC-12, UC-21 | — | 감싸는 화면 |
| SCR-P-003-T1 | 입점사 클레임 상세 — 클레임상품 탭 | partner | §13-1 ClaimItemTab | UC-21 | API-037, API-038, API-039, API-040 | 수거확인/품질점검 |
| SCR-P-003-T2 | 입점사 클레임 상세 — 배송정보 탭 | partner | §13-1 ShippingTab | UC-21 | API-037, API-041, API-043 | 수거/반송/교환선출고 운송장 |
| SCR-P-003-T3 | 입점사 클레임 상세 — 변경이력 탭 | partner | §13-1 LogTab | UC-21 | API-042 | logs 섹션 |
| SCR-P-004 | 배송 관리 (출고+회수+재배송) | partner | §14 ShippingPage | UC-7 | API-035 | 배경색 구분 |
| SCR-P-005 | 클레임 현황 | partner | §15 ClaimStatusPage | UC-12, UC-21 | API-042 | 취소/반품/교환 통합 |

---

## 2. API

### 2-1. 고객웹 (mobile) API

| PGM-ID | Method | Endpoint | 프로그램명 | 세부UC | 시퀀스 | 호출원 | 상태전이 |
|---|---|---|---|---|---|---|---|
| API-001 | POST | /api/v1/cart/items | 장바구니 담기 | UC-1 | §1 | SCR-M-001 | — |
| API-002 | GET | /api/v1/cart | 장바구니 조회 | UC-2 | §2 | SCR-M-001 | — |
| API-003 | PATCH | /api/v1/cart/items/{cartItemId}/quantity | 수량 변경 | UC-2 | — | SCR-M-001 | — |
| API-004 | DELETE | /api/v1/cart/items/{cartItemId} | 장바구니 삭제 | UC-2 | — | SCR-M-001 | — |
| API-005 | PUT | /api/v1/cart/items/{cartItemId}/option | 장바구니 옵션 변경 | UC-23 | — | SCR-M-001 | — |
| API-006 | POST | /api/v1/orders/sheet | 주문서 생성 | UC-3 | §3 | SCR-M-002 | — |
| API-007 | POST | /api/v1/orders/{orderSheetId}/pay | 결제 요청 | UC-3 | §4 | SCR-M-002 | PAYMENT_PENDING |
| API-008 | GET | /api/v1/orders/{orderSheetId}/coupon-combinations | 쿠폰 조합별 할인 계산 | UC-3 | — | SCR-M-002 | — |
| API-009 | POST | /api/v1/orders/{orderSheetId}/calculate | 쿠폰 확정 재계산 | UC-3 | — | SCR-M-002 | — |
| API-010 | POST | /api/v1/orders/{orderId}/cancel | 고객 주문 취소 | UC-5 | §5 | SCR-M-007 | CANCELLED |
| API-011 | POST | /api/v1/orders/{orderId}/confirm | 구매확정 | UC-9 | §6 | SCR-M-007 | CONFIRMED |
| API-012 | PUT | /api/v1/orders/{orderId}/shipping-address | 배송지 변경 | UC-8 | — | SCR-M-007 | — |
| API-013 | POST | /api/v1/orders/{orderId}/claims | 반품/교환 신청 | UC-10, UC-19 | §7 | SCR-M-008 | RECEIVED (VENDOR귀책 시 사진 1장 이상 필수, REQ-ORD-058) |
| API-014 | GET | /api/v1/members/me/orders | 내 주문 목록 | UC-18 | — | SCR-M-005, SCR-M-006 | — |
| API-015 | GET | /api/v1/members/me/orders/{orderId} | 내 주문 상세 | UC-18 | — | SCR-M-007 | — |
| API-016 | GET | /api/v1/members/me/claims | 내 클레임 목록 | UC-16 | — | SCR-M-005, SCR-M-010 | — |
| API-017 | GET | /api/v1/members/me/claims/{claimId} | 내 클레임 상세 | UC-17 | — | SCR-M-011 | — |
| API-018 | POST | /api/v1/claims/{claimId}/shipping-payment | 클레임 배송비 결제 | UC-20 | §12 | SCR-M-011 | — (claim.status는 PAYMENT_PENDING 유지) / shipment(PICKUP) 생성(PENDING) |
| API-019 | GET | /api/v1/payment-methods | 결제수단 목록 | UC-13 | — | SCR-M-012 | — |
| API-020 | POST | /api/v1/payment-methods | 결제수단 등록 | UC-13 | — | SCR-M-012 | — |
| API-021 | DELETE | /api/v1/payment-methods/{methodId} | 결제수단 삭제 | UC-13 | — | SCR-M-012 | — |
| API-044 | GET | /api/v1/members/me/payments | 결제 이력 조회 (REQ-PAY-020, 본인 결제 건만 최신순) | UC-28(추가예정) | §25(추가예정) | — (신규 SCR 필요, 추가예정) | — |
| API-049 | POST | /api/v1/claims/{claimId}/cancel | 클레임 자진취소 (신규) | UC-32(추가예정) | §7-2 | SCR-M-011 (취소 버튼 추가예정) | RECEIVED/PAYMENT_PENDING→REJECTED |

### 2-2. 어드민 (admin) API

| PGM-ID | Method | Endpoint | 프로그램명 | 세부UC | 시퀀스 | 호출원 | 상태전이 |
|---|---|---|---|---|---|---|---|
| API-022 | GET | /api/admin/v1/orders | 주문 검색 | UC-14 | — | SCR-A-001 | — |
| API-023 | GET | /api/admin/v1/orders/{orderId} | 주문 상세 | UC-14 | — | SCR-A-002-T1~T6 | — |
| API-024 | POST | /api/admin/v1/orders/{orderId}/force-cancel | CS 예외 취소 | UC-6 | §11 | SCR-A-002-T4 | CANCELLED |
| API-025 | GET | /api/admin/v1/claims | 클레임 목록 | UC-11 | — | SCR-A-003, SCR-A-004-T4 | — |
| API-026 | POST | /api/admin/v1/claims/{claimId}/blame-decision | 귀책 판정 (고객/판매자) | UC-11 | — | SCR-A-004-T1 | RECEIVED→PAYMENT_PENDING(고객귀책) / RECEIVED→INSPECTING(판매자귀책, shipment(PICKUP) 자동생성 + EXCHANGE 유형 시 shipment(EXCHANGE_OUT) 병행생성, REQ-ORD-056); 고객 자진신고 responsibility를 CS가 최종 확정(덮어쓰기 가능, REQ-ORD-066) |
| API-027 | POST | /api/admin/v1/claims/{claimId}/complete | 클레임 완료 (수동, 배치 선반영) | UC-11 | §10 | SCR-A-004-T1 | REFUNDED/RETURN_PAYMENT_PENDING(shipment(RETURN) DELIVERED 확인 후)/DISPOSED→COMPLETED (배치와 동일 로직을 CS가 즉시 트리거; PICKED_UP→REFUNDED 전이 자체는 API-029에서 수행) |
| API-028 | POST | /api/admin/v1/claims/{claimId}/reject | 클레임 반려 | UC-11 | — | SCR-A-004-T1 | REJECTED |
| API-029 | POST | /api/admin/v1/claims/{claimId}/refund | 환불 처리 (수동) | UC-22 | §13 | SCR-A-004-T2 | PICKED_UP→REFUNDED |
| API-030 | POST | /api/admin/v1/claims/{claimId}/dispose | 폐기 처리 | UC-22 | — | SCR-A-004-T3 | DISPOSED |
| API-031 | POST | /api/admin/v1/claims/{claimId}/request-return-payment | 반송 배송비 추가결제 요청 | UC-22 | — | SCR-A-004-T3 | — |
| API-045 | GET | /api/admin/v1/payments/search | 결제 검색 (CS, REQ-PAY-021: 상태·기간·주문번호·PG거래번호 필터) | UC-29(추가예정) | §26(추가예정) | — (신규 SCR 필요, 추가예정) | — |
| API-046 | GET | /api/admin/v1/payments/{paymentId}/pg-logs | PG 거래 로그 조회 (REQ-PAY-022: 요청·응답 전체 이력, PII 마스킹) | UC-30(추가예정) | §27(추가예정) | — (신규 SCR 필요, 추가예정) | — |

### 2-3. 입점사 (partner) API

| PGM-ID | Method | Endpoint | 프로그램명 | 세부UC | 시퀀스 | 호출원 | 상태전이 |
|---|---|---|---|---|---|---|---|
| API-032 | GET | /api/partner/v1/orders | 입점사 주문 목록 | UC-15 | — | SCR-P-001 | — |
| API-033 | GET | /api/partner/v1/orders/{orderId} | 입점사 주문 상세 | UC-15 | — | SCR-P-002-T1~T4 | — |
| API-034 | POST | /api/partner/v1/orders/{orderId}/ship | 출고 처리 | UC-7 | §8 | SCR-P-002-T1 | PAYMENT_COMPLETED→PREPARING (REQ-ORD-022; shipment(OUTBOUND) PENDING 생성, 운송장 등록에 의한 IN_TRANSIT 전환은 API-036) |
| API-035 | GET | /api/partner/v1/shipping | 배송 관리 목록 | UC-7 | — | SCR-P-004 | — |
| API-036 | POST | /api/partner/v1/shipping/{orderId} | 출고/재배송 운송장 등록 | UC-7 | §9 | SCR-P-002-T2 | — (order.status는 PREPARING 유지) / shipment(OUTBOUND) PENDING→IN_TRANSIT |
| API-037 | POST | /api/partner/v1/shipping/{claimId}/pickup | 수거 운송장 등록 | UC-21 | — | SCR-P-003-T1, SCR-P-003-T2 | — (claim.status 변경없음, 귀책유형에 따라 PAYMENT_PENDING 또는 INSPECTING 유지) / shipment(PICKUP) PENDING→IN_TRANSIT (수거 택배 추적 시작, REQ-ORD-044) |
| API-038 | POST | /api/partner/v1/claims/{claimId}/pickup-confirm | 입고 확인 → 품질점검 시작 | UC-21 | — | SCR-P-003-T1 | INSPECTING |
| API-039 | POST | /api/partner/v1/claims/{claimId}/inspect-pass | 품질점검 합격 (판정기준: RETURN=상품상태 양호 / EXCHANGE=택(TAG) 유지, REQ-ORD-057) | UC-21 | §14 | SCR-P-003-T1 | PICKED_UP |
| API-040 | POST | /api/partner/v1/claims/{claimId}/inspect-reject | 품질점검 거부 (판정기준: RETURN=상품 훼손 / EXCHANGE=택 제거·훼손, REQ-ORD-057, 사유 필수) | UC-21 | §15 | SCR-P-003-T1 | PICKUP_REJECTED |
| API-041 | POST | /api/partner/v1/claims/{claimId}/return-ship | 반송 운송장 등록 | UC-21 | — | SCR-P-003-T2 | — (claim.status는 RETURN_PAYMENT_PENDING 유지) / shipment(RETURN) PENDING→IN_TRANSIT |
| API-042 | GET | /api/partner/v1/claims | 클레임 현황 (통합) | UC-12 | — | SCR-P-003-T3, SCR-P-005 | — |
| API-043 | POST | /api/partner/v1/claims/{claimId}/exchange-ship | 교환상품 발송 운송장 등록 (선출고, EXCHANGE 전용) | UC-21 | §24(추가예정) | SCR-P-003-T2 | — (claim.status 변경없음) / shipment(EXCHANGE_OUT) PENDING→IN_TRANSIT (귀책판정 시점=INSPECTING 진입 시 병행 생성, REQ-ORD-056 맞교환 원칙) |
| API-047 | POST | /api/admin/v1/claims/{claimId}/return-delivered | 반송 배송완료 확인 (택배사 콜백 또는 배송추적 배치 호출) | UC-22 | §19 | BAT-003 | shipment(RETURN) IN_TRANSIT→DELIVERED (claim.status는 이후 배치가 RETURN_PAYMENT_PENDING→COMPLETED로 전환) |
| API-048 | POST | /api/partner/v1/shipping/{shipmentId}/reship | 배송 실패 재발송 처리 (신규, REQ-ORD-062) | UC-31(추가예정) | §22 | SCR-P-004 | shipment(전체 유형 공통) FAILED→PENDING→(운송장 재등록 시)IN_TRANSIT / 비고: admin 클레임관리 화면에도 재발송 UI 추가 예정(DN-화면레이아웃 반영 중) — 반영 시 호출원에 SCR-A-004 추가 필요 |

---

## 3. 컨슈머 (CSM)

| PGM-ID | 프로그램명 | 트리거(이벤트) | 발행 도메인 | 수신 도메인 | 세부UC | 시퀀스 | 내부 호출 | 상태전이 |
|---|---|---|---|---|---|---|---|---|
| CSM-001 | 결제완료 후처리 (재고확보·주문확정) | PAYMENT_APPROVED | Payment | Order | UC-24(추가예정) | §16 | CatalogPublicApi.reserveStock | PAYMENT_PENDING→PAYMENT_COMPLETED (AC-ORD-015 근거) |
| CSM-002 | 결제실패 후처리 (재고복원·주문실패) | PAYMENT_FAILED | Payment | Order | UC-24(추가예정) | §20(추가예정) | CatalogPublicApi.restoreStock | PAYMENT_PENDING→PAYMENT_FAILED |
| CSM-003 | 주문취소 PG 환불 요청 | ORDER_CANCELLED | Order | Payment | — | §21(추가예정) | PGApi.refund | PAID→REFUNDED |
| CSM-004 | 클레임완료 부분/전체 환불 | CLAIM_COMPLETED | Order | Payment | — | §22(추가예정) | PGApi.partialRefund | PAID→PARTIAL_REFUNDED/REFUNDED |

---

## 4. 배치 (BAT)

| PGM-ID | 프로그램명 | 트리거(스케줄) | EARS 근거 | 세부UC | 시퀀스 | 내부 호출 | 상태전이 |
|---|---|---|---|---|---|---|---|
| BAT-001 | D+7 자동구매확정 | 매일 02:00 | REQ-ORD-015 | UC-25(추가예정) | §17 | PaymentPublicApi.settle | DELIVERED→CONFIRMED |
| BAT-002 | 배송비결제 24시간 만료 | 매 시간 정각 | REQ-ORD-042 | UC-26(추가예정) | §18 | — | PAYMENT_PENDING→PAYMENT_EXPIRED |
| BAT-003 | 배송상태 갱신 (택배사 API) | 매 60분 | REQ-ORD-027 | UC-27(추가예정) | §19 | CourierApi.getTrackingStatus | shipment(전체 유형) IN_TRANSIT→DELIVERED (파생: OUTBOUND→order는 PREPARING 유지 상태에서 DELIVERED로 파생 표시, RETURN→claim RETURN_PAYMENT_PENDING→COMPLETED) |
| BAT-004 | 배송비 결제 12시간 리마인드 | 매 시간 정각 | REQ-ORD-043 | UC-26(추가예정) | §23(추가예정) | NotificationPublicApi.sendAlimtalk | — (알림만) |

---

## 5. 집계

| 유형 | 건수 |
|---|---|
| 화면 (SCR) | 38 |
| API | 49 |
| 컨슈머 (CSM) | 4 |
| 배치 (BAT) | 4 |
| **합계** | **95** |

---

## 6. 정합성 검증 결과

| # | 점검 항목 | 결과 | 상세 |
|---|---|---|---|
| 1 | 인터페이스명세 endpoint → API-* 대응 | ⚠️ 48/49 | 신규 6건(API-043,044,045,046,047,048)이 인터페이스명세(DL) #39-1,41,42,43,39-2,44와 1:1 대응 확인(경로 불일치 2건 정정: 41 `/api/customer/v1/payments`→`/api/v1/members/me/payments`, 42 `/payments`→`/payments/search`). API-049(클레임 자진취소)는 시퀀스(DM) §7-2 신규 반영이며 인터페이스명세(DL)에는 아직 미반영 — 후속 반영 필요 |
| 2 | 화면레이아웃 화면 → SCR-* 대응 | ✅ 38건 | 탭 포함 화면 = 컨테이너 + 각 탭 별도 SCR. 알림(§5,§6,§8-4~§8-6)은 SCR 제외. 결제이력/CS결제검색/PG로그(API-044~046)는 대응 SCR 미정. API-048(재발송)은 기존 SCR-P-004(배송 관리)를 호출원으로 사용, admin 클레임관리 화면(SCR-A-004)에도 재발송 UI 추가 예정(DN-화면레이아웃 반영 중). API-049(클레임 자진취소)는 기존 SCR-M-011(클레임 상세)에 취소 버튼 추가 예정 |
| 3 | 시퀀스 [컨슈머] → CSM-* 대응 | ⚠️ 1/4 | CSM-002~004 시퀀스 §20~§22 추가 필요 |
| 4 | 시퀀스 [배치] → BAT-* 대응 | ⚠️ 3/4 | BAT-004 시퀀스 §23 추가 필요 |
| 5 | 모든 PGM → 세부UC 역추적 | ⚠️ | UC-24~27 (컨슈머/배치), UC-28~30 (결제이력/CS결제검색/PG로그), UC-31 (재발송, API-048), UC-32 (클레임 자진취소, API-049) 세부UC 추가 필요 |
| 6 | 프로그램 총 건수(95) ≥ API 수(49) | ✅ | 화면(탭 포함)+컨슈머+배치 49건 포함 |
| 7 | 모든 API → 호출원(SCR/CSM/BAT) 1건 이상 | ⚠️ 46/49 | API-044~046(결제이력/CS결제검색/PG로그)은 대응 SCR 미정으로 호출원 공란 — 후속 화면 정의 필요. API-047(반송배송완료)은 BAT-003 확인. API-048(재발송)은 SCR-P-004로 매핑 완료(admin 추가 예정). API-049(클레임 자진취소)는 SCR-M-011로 매핑 완료 |
| 8 | 모든 SCR → 호출 API 매핑 존재 | ✅ | 컨테이너(감싸는 화면)는 자체 API 없음(정상) — 탭에서 호출 |
| 9 | CSM/BAT → 내부 호출 매핑 존재 | ✅ | 타 도메인 PublicApi / 외부 API 명시 |

### 미진 항목 (후속 조치)

| # | 항목 | 조치 | 우선순위 |
|---|---|---|---|
| 1 | 세부UC UC-24~27 추가 (컨슈머/배치) | DK-세부유스케이스에 §24~§27 추가 | 상 |
| 2 | 시퀀스 §20~§23 추가 (CSM-002~004, BAT-004) | DM-시퀀스에 추가 | 상 |
| 3 | 알림 템플릿 (SMS/알림톡/이메일) 프로그램화 여부 | 2차 파트(Notification) 착수 시 결정 | 하 |
| 4 | API-043(교환 선출고) 시퀀스 §24 추가 | DM-시퀀스에 추가 | 중 |
| 5 | API-044~046(결제이력/CS결제검색/PG로그) 화면·시퀀스 반영 | DN-화면레이아웃 SCR 신규 정의, DM-시퀀스 §25~§27 추가 (인터페이스명세는 반영 완료) | 중 |
| 6 | API-048(재발송) 인터페이스명세·세부UC 반영 | DL-인터페이스명세에 endpoint 추가, DK-세부유스케이스에 UC-31 추가 | 중 |
| 7 | API-049(클레임 자진취소) 인터페이스명세·세부UC 반영, API-048 admin 호출원 확정 | DL-인터페이스명세에 endpoint 추가, DK-세부유스케이스에 UC-32 추가, DN-화면레이아웃 admin 클레임관리 화면 반영 후 API-048 호출원에 SCR-A-004 추가 | 중 |

---

## 근거

| 항목 | 출처 |
|---|---|
| 화면 도출 | 화면레이아웃(DN) §1~§15 채널별 화면 |
| API 도출 | 인터페이스명세(DL) #1~#40, #39-1, #39-2, #41~#43 endpoint 전수(47건) + 시퀀스(DM) §22 신규(API-048, 인터페이스명세 미반영) + 시퀀스(DM) §7-2 신규(API-049, 클레임 자진취소, 인터페이스명세 미반영) |
| 컨슈머 도출 | 이벤트플로우(DI) PAYMENT_APPROVED/FAILED, ORDER_CANCELLED, CLAIM_COMPLETED 수신 액션 |
| 배치 도출 | EARS(DE) REQ-ORD-015, REQ-ORD-027, REQ-ORD-042, REQ-ORD-043 시간조건 |
| 클레임 상태전이 정정 | S2 `DG-상태머신(Order).md` ord_claim.status 14상태(v4) — API-026/027 상태전이 오류 수정, API-039/040 EXCHANGE 판정기준(REQ-ORD-057) 명시 |
| 결제 API 신규 | S2 `DE-EARS기능요구(Payment).md` REQ-PAY-020(결제이력조회)/021(CS결제검색)/022(PG거래로그조회) |
| 재발송 API 신규 | S2 `DE-EARS기능요구(Order).md` REQ-ORD-062(배송실패 재처리), S3 `DM-시퀀스(Order-Payment).md` §22 — API-048(입점사) |
| 클레임 자진취소 API 신규 | S3 `DM-시퀀스(Order-Payment).md` §7-2 — API-049(고객 mobile, RECEIVED/PAYMENT_PENDING→REJECTED) |
| 귀책판정 비고 보강 | S2 `DE-EARS기능요구(Order).md` REQ-ORD-066(고객 자진신고 responsibility, CS 판정으로 덮어쓰기) — API-026 |
| 정합성 규칙 | 작성가이드 '프로그램 목록 정합성 체크리스트' 6항목 |
