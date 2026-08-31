
# 프로그램 목록 — Order 도메인

> 상위 문서: [readme.md](readme.md)
> **단계**: 상세설계 (S3) | **문서범위**: Domain (Order) | **문서종류**: Design

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
| API-049 | POST | /api/v1/claims/{claimId}/cancel | 클레임 자진취소 (신규) | UC-32(추가예정) | §7-2 | SCR-M-011 (취소 버튼 추가예정) | RECEIVED/PAYMENT_PENDING→REJECTED |

### 2-2. 어드민 (admin) API

| PGM-ID | Method | Endpoint | 프로그램명 | 세부UC | 시퀀스 | 호출원 | 상태전이 |
|---|---|---|---|---|---|---|---|
| API-022 | GET | /api/admin/v1/orders | 주문 검색 | UC-14 | — | SCR-A-001 | — |
| API-023 | GET | /api/admin/v1/orders/{orderId} | 주문 상세 | UC-14 | — | SCR-A-002-T1~T6 | — |
| API-024 | POST | /api/admin/v1/orders/{orderId}/force-cancel | CS 예외 취소 | UC-6 | §11 | SCR-A-002-T4 | CANCELLED |
| API-025 | GET | /api/admin/v1/claims | 클레임 목록 | UC-11 | — | SCR-A-003, SCR-A-004-T4 | — |
| API-026 | POST | /api/admin/v1/claims/{claimId}/blame-decision | 귀책 판정 (고객/입점사) | UC-11 | — | SCR-A-004-T1 | RECEIVED→PAYMENT_PENDING(고객귀책) / RECEIVED→INSPECTING(입점사귀책, shipment(PICKUP) 자동생성 + EXCHANGE 유형 시 shipment(EXCHANGE_OUT) 병행생성, REQ-ORD-056); 고객 자진신고 responsibility를 CS가 최종 확정(덮어쓰기 가능, REQ-ORD-066) |
| API-027 | POST | /api/admin/v1/claims/{claimId}/complete | 클레임 완료 (수동, 배치 선반영) | UC-11 | §10 | SCR-A-004-T1 | REFUNDED/RETURN_PAYMENT_PENDING(shipment(RETURN) DELIVERED 확인 후)/DISPOSED→COMPLETED (배치와 동일 로직을 CS가 즉시 트리거; PICKED_UP→REFUNDED 전이 자체는 API-029에서 수행) |
| API-028 | POST | /api/admin/v1/claims/{claimId}/reject | 클레임 반려 | UC-11 | — | SCR-A-004-T1 | REJECTED |
| API-029 | POST | /api/admin/v1/claims/{claimId}/refund | 환불 처리 (수동) | UC-22 | §13 | SCR-A-004-T2 | PICKED_UP→REFUNDED |
| API-030 | POST | /api/admin/v1/claims/{claimId}/dispose | 폐기 처리 | UC-22 | — | SCR-A-004-T3 | DISPOSED |
| API-031 | POST | /api/admin/v1/claims/{claimId}/request-return-payment | 반송 배송비 추가결제 요청 | UC-22 | — | SCR-A-004-T3 | — |
| API-050 | POST | /api/admin/v1/claims/{claimId}/start | 클레임 처리 시작 (UI전용 — 인터페이스명세(DL) §19에는 있었으나 API-* ID 누락, 2026-08-24 신규 부여) | UC-11 | — | — (호출원 미정, 추가예정) | — (claim.status는 `RECEIVED` 유지, 11상태 모델에 별도 IN_PROGRESS 없음) |

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

> Payment가 발행하는 이벤트를 Order가 수신·구현하는 컨슈머. (Order가 발행하는 이벤트를
> Payment가 수신하는 컨슈머는 [payment.md](payment.md) §3 참조)

| PGM-ID | 프로그램명 | 트리거(이벤트) | 발행 도메인 | 수신 도메인 | 세부UC | 시퀀스 | 내부 호출 | 상태전이 |
|---|---|---|---|---|---|---|---|---|
| CSM-001 | 결제완료 후처리 (재고확보·주문확정) | PAYMENT_APPROVED | Payment | Order | UC-24(추가예정) | §16 | CatalogPublicApi.reserveStock | PAYMENT_PENDING→PAYMENT_COMPLETED (AC-ORD-015 근거) |
| CSM-002 | 결제실패 후처리 (재고복원·주문실패) | PAYMENT_FAILED | Payment | Order | UC-24(추가예정) | §20(추가예정) | CatalogPublicApi.restoreStock | PAYMENT_PENDING→PAYMENT_FAILED |

---

## 4. 배치 (BAT)

| PGM-ID | 프로그램명 | 트리거(스케줄) | EARS 근거 | 세부UC | 시퀀스 | 내부 호출 | 상태전이 |
|---|---|---|---|---|---|---|---|
| BAT-001 | D+7 자동구매확정 | 매일 02:00 | REQ-ORD-015 | UC-25(추가예정) | §17 | PaymentPublicApi.settle | DELIVERED→CONFIRMED |
| BAT-002 | 배송비결제 24시간 만료 | 매 시간 정각 | REQ-ORD-042 | UC-26(추가예정) | §18 | — | PAYMENT_PENDING→PAYMENT_EXPIRED |
| BAT-003 | 배송상태 갱신 (택배사 API) | 매 60분 | REQ-ORD-027 | UC-27(추가예정) | §19 | CourierApi.getTrackingStatus | shipment(전체 유형) IN_TRANSIT→DELIVERED (파생: OUTBOUND→order는 PREPARING 유지 상태에서 DELIVERED로 파생 표시, RETURN→claim RETURN_PAYMENT_PENDING→COMPLETED) |
| BAT-004 | 배송비 결제 12시간 리마인드 | 매 시간 정각 | REQ-ORD-043 | UC-26(추가예정) | §23(추가예정) | NotificationPublicApi.sendAlimtalk | — (알림만) |

---

## 근거

집계·정합성 검증·전체 근거는 [readme.md](readme.md) 참조.
