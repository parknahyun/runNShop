# EARS 기능요구사항 — Order

> **단계**: 구조설계
> **문서범위**: Domain
> **문서종류**: Spec
>
> **작성 목적**: 상위 유스케이스(DC)를 기반으로, Order 도메인의 기능요구를 EARS 패턴으로 정형화한다.
> **흐름 내 위치**: DC 상위 UC → **DD EARS** → DE 메뉴구조도 → DF ERD → DG 비즈니스 프로세스 → DH 상태머신
> **작성 주체**: 시니어 개발자 + AI 협업 (기획자·현업 검토·확인)

| 항목 | 내용 |
|---|---|
| ID | SPEC-EARS-ORDER-001 |
| 상태 | **Finalized** |
| 작성일 | 2026-08-11 |
| 갱신일 | 2026-08-21 |

---

## 장바구니·주문서

| ID | 패턴 | 요구사항 | 도출 근거 |
|---|---|---|---|
| REQ-ORD-001 | Event-driven | WHEN 고객이 상품을 장바구니에 담으면, THE 시스템은 SHALL 해당 상품·옵션·수량을 장바구니에 저장한다. | 상위UC: 장바구니 담기 |
| REQ-ORD-002 | Event-driven | WHEN 고객이 장바구니 상품의 수량을 변경하면, THE 시스템은 SHALL 변경된 수량으로 갱신하고 소계를 재계산한다. | 상위UC: 수량 변경 |
| REQ-ORD-003 | Event-driven | WHEN 고객이 장바구니 상품을 삭제하면, THE 시스템은 SHALL 해당 항목을 논리 삭제(is_deleted)한다. | 상위UC: 삭제 |
| REQ-ORD-004 | Unwanted | IF 장바구니 상품 수가 50개를 초과하면, THEN THE 시스템은 SHALL 추가를 거부하고 "장바구니가 가득 찼습니다" 메시지를 반환한다. | 정책: 최대 50개 |
| REQ-ORD-005 | Ubiquitous | THE 시스템은 SHALL 동일 상품+옵션 조합이 이미 장바구니에 존재하면 수량을 합산한다. | 정책: 중복 방지 |
| REQ-ORD-006 | Event-driven | WHEN 비회원이 로그인하면, THE 시스템은 SHALL 비회원 장바구니를 회원 장바구니에 병합한다. | 정책: 병합 규칙 |
| REQ-ORD-007 | Event-driven | WHEN 고객이 바로구매를 선택하면, THE 시스템은 SHALL 장바구니를 거치지 않고 즉시 주문서로 이동한다. | 상위UC: 바로구매 |
| REQ-ORD-008 | Event-driven | WHEN 고객이 주문서를 제출하면, THE 시스템은 SHALL 배송지·결제수단·쿠폰 적용 여부를 검증한 뒤 주문을 생성한다. | 상위UC: 주문서 제출 |
| REQ-ORD-009 | Ubiquitous | THE 시스템은 SHALL 주문 생성 시 적용된 할인·쿠폰·포인트 내역을 주문에 스냅샷으로 저장한다. | 정책: 주문 시점 가격 확정 |
| REQ-ORD-010 | Unwanted | IF 주문서 제출 시 필수 정보(배송지, 결제수단)가 누락되면, THEN THE 시스템은 SHALL 주문 생성을 거부하고 누락 항목을 안내한다. | 유효성 검증 |
| REQ-ORD-011 | Ubiquitous | THE 시스템은 SHALL 주문 생성 시 입점사별로 주문을 분할한다 (1 플랫폼주문 → N 입점사주문). | 정책: 입점사별 처리 단위 |

---

## 주문결제·연동

| ID | 패턴 | 요구사항 | 도출 근거 |
|---|---|---|---|
| REQ-ORD-012 | Event-driven | WHEN 고객이 결제를 요청하면, THE 시스템은 SHALL 재고를 선점하고 Payment 도메인에 결제 요청을 전달한다. | 상위UC: 결제 요청 |
| REQ-ORD-013 | Event-driven | WHEN Payment 도메인으로부터 결제완료(PAYMENT_APPROVED) 이벤트를 수신하면, THE 시스템은 SHALL 주문 상태를 PAYMENT_COMPLETED로 전환한다. | 도메인정의서 §4: Payment→Order |
| REQ-ORD-014 | Unwanted | IF Payment 도메인으로부터 결제실패(PAYMENT_FAILED) 이벤트를 수신하면, THEN THE 시스템은 SHALL 선점된 재고를 복원하고 주문을 PAYMENT_FAILED로 전환한다. | 도메인정의서 §4 + 정책 |
| REQ-ORD-015 | Event-driven | WHEN 배송완료 후 7일이 경과하면, THE 시스템은 SHALL 자동으로 구매확정(CONFIRMED) 처리한다. | 정책: D+7 자동 구매확정 |
| REQ-ORD-016 | Event-driven | WHEN 고객이 수동 구매확정을 요청하면, THE 시스템은 SHALL 즉시 구매확정 처리한다. | 상위UC: 구매확정(수동) |
| REQ-ORD-017 | Optional | WHERE CS 담당자가 예외 취소를 요청한 경우, THE 시스템은 SHALL 결제 상태와 무관하게 취소를 수행하고 환불을 요청한다. | 상위UC: 예외 취소 (CS 전용) |
| REQ-ORD-018 | Event-driven | WHEN 고객이 단순 취소를 요청하면, THE 시스템은 SHALL PAYMENT_COMPLETED 상태인 경우에만 취소를 허용한다. | 정책: 출고 전 취소만 가능 |
| REQ-ORD-019 | Unwanted | IF 고객 취소 요청 시 주문 상태가 PREPARING 이후이면, THEN THE 시스템은 SHALL 취소를 거부하고 "반품 신청을 이용해주세요" 메시지를 반환한다. | 정책: 출고 후 취소 불가 |
| REQ-ORD-020 | Ubiquitous | THE 시스템은 SHALL 구매확정 시 Settlement 도메인에 정산 대상 등록 이벤트를 발행한다. | 도메인정의서: Order→Settlement |
| REQ-ORD-021 | Ubiquitous | THE 시스템은 SHALL 구매확정 시 Member 도메인에 포인트 적립 이벤트를 발행한다. | 도메인정의서: Order→Member |

---

## 배송관리

> v2 (2026-08-20 현행화): 배송 실행(택배사·운송장·집화/배송중/배송완료)을 `ord_shipment`로 분리(상태머신DG v6). 주문 상태(IN_DELIVERY 제거)는 더 이상 배송 진행을 직접 표현하지 않는다.

| ID | 패턴 | 요구사항 | 도출 근거 |
|---|---|---|---|
| REQ-ORD-022 | Event-driven | WHEN 입점사가 출고 처리를 요청하면, THE 시스템은 SHALL 주문 상태를 PREPARING으로 전환한다. | 상위UC: 출고 처리 |
| REQ-ORD-023 | Event-driven | WHEN 입점사가 운송장 번호를 등록하면, THE 시스템은 SHALL shipment(OUTBOUND)를 생성하고 상태를 IN_TRANSIT으로 전환한다 (주문 상태는 PREPARING 유지). | 상태머신: ord_shipment PENDING→IN_TRANSIT |
| REQ-ORD-024 | Event-driven | WHEN 택배사 API로부터 배송완료 신호를 수신하면, THE 시스템은 SHALL shipment(OUTBOUND) 상태를 DELIVERED로 전환하고, 이를 구독하여 주문 상태를 DELIVERED로 파생 전환한다. | 상태머신: ord_shipment IN_TRANSIT→DELIVERED → ord_order PREPARING→DELIVERED |
| REQ-ORD-025 | Event-driven | WHEN 고객이 배송지 변경을 요청하면, THE 시스템은 SHALL 출고 전(PAYMENT_COMPLETED) 상태에서만 변경을 허용한다. | 상위UC: 배송지 변경 |
| REQ-ORD-026 | Unwanted | IF 배송지 변경 요청 시 주문 상태가 PREPARING 이후이면, THEN THE 시스템은 SHALL 변경을 거부하고 "출고 후에는 변경할 수 없습니다" 메시지를 반환한다. | 정책: 출고 후 변경 불가 |
| REQ-ORD-027 | State-driven | WHILE shipment(OUTBOUND)가 IN_TRANSIT 상태인 동안, THE 시스템은 SHALL 60분 주기로 택배사 API에 배송 상태를 조회한다. | 정책: 배치 주기 |

---

## 클레임처리

> v2 (2026-08-20 현행화): REQ-ORD-031/032/034가 폐기된 구모델(IN_PROGRESS 등)을 참조하고 있어 실제 귀책판정·환불 흐름(상태머신DG)에 맞게 재정의. responsibility는 CUSTOMER/VENDOR 2종(PLATFORM 제거).

| ID | 패턴 | 요구사항 | 도출 근거 |
|---|---|---|---|
| REQ-ORD-028 | Event-driven | WHEN 고객이 반품을 신청하면, THE 시스템은 SHALL 클레임을 RECEIVED 상태로 생성한다. | 상위UC: 반품 신청 |
| REQ-ORD-029 | Event-driven | WHEN 고객이 교환을 신청하면, THE 시스템은 SHALL 클레임을 RECEIVED 상태(EXCHANGE 유형)로 생성한다. | 상위UC: 교환 신청 |
| REQ-ORD-030 | Unwanted | IF 반품/교환 신청 시 배송완료 후 10일이 초과되었으면, THEN THE 시스템은 SHALL 신청을 거부하고 "기한이 초과되었습니다" 메시지를 반환한다. | 정책: 반품 기한 10일 |
| REQ-ORD-031 | Event-driven | WHEN CS 담당자가 접수 내용을 확인해 입점사(VENDOR) 귀책으로 판정하면, THE 시스템은 SHALL shipment(PICKUP)를 생성하고 수거를 즉시 시작한다(배송비 없음). | 상태머신: RECEIVED 유지, shipment(PICKUP) 생성(v6) |
| REQ-ORD-032 | Event-driven | WHEN shipment(PICKUP)가 입점사의 입고 확인으로 DELIVERED 상태가 되면, THE 시스템은 SHALL 클레임 상태를 INSPECTING(품질점검)으로 전환한다. | 상태머신: RECEIVED/PAYMENT_PENDING→INSPECTING(v6, 파생전환) |
| REQ-ORD-033 | Event-driven | WHEN CS 담당자가 클레임을 반려하면, THE 시스템은 SHALL 클레임 상태를 REJECTED로 전환하고 사유를 기록한다. | 상위UC: 반려확정 |
| REQ-ORD-034 | Event-driven | WHEN CS 담당자가 환불 처리를 수행하면, THE 시스템은 SHALL 클레임 상태를 REFUNDED로 전환하고 Payment에 환불 이벤트, Catalog에 재고복원 이벤트를 발행한다. | 상태머신: PICKED_UP→REFUNDED |
| REQ-ORD-035 | Ubiquitous | THE 시스템은 SHALL 클레임 완료 시 CLAIM_COMPLETED 이벤트를 발행한다 (Payment 환불, Catalog 재고복원, Member 포인트복원). | 도메인정의서: 이벤트 발행 |

---

## 주문 조회·관리

| ID | 패턴 | 요구사항 | 도출 근거 |
|---|---|---|---|
| REQ-ORD-036 | Event-driven | WHEN 고객이 주문 목록을 조회하면, THE 시스템은 SHALL 본인 주문만 최신순으로 반환한다. | 상위UC: 내 주문 조회 |
| REQ-ORD-037 | Event-driven | WHEN 입점사가 주문 목록을 조회하면, THE 시스템은 SHALL 자기 매장 주문만 반환한다. | 상위UC: 입점사 주문 조회 |
| REQ-ORD-038 | Event-driven | WHEN CS 담당자가 주문을 검색하면, THE 시스템은 SHALL 상태·기간·주문번호·회원명 필터를 지원한다. | 상위UC: 전체 주문 검색 |
| REQ-ORD-039 | Ubiquitous | THE 시스템은 SHALL 모든 주문 상태 변경 시 이력(ord_order_history)을 기록한다. | 감사 추적 |

---

## 클레임 확장 (배송비 결제·수거·품질점검·폐기·반송)

> v2 (2026-08-12 현행화): S3 상세설계에서 클레임 프로세스 확장에 따라 추가.
> v3 (2026-08-20 현행화): REQ-ORD-050 상태명 오기 수정(PAYMENT_PENDING(RETURN) → RETURN_PAYMENT_PENDING), 반송배송완료(RETURN_DELIVERED)·자동완료 전환 요구 신설(REQ-ORD-052/053), 장바구니 옵션변경 REQ 번호 이동(052/053 → 054/055).
> v6 (2026-08-20 현행화): 배송 실행(PICKUP/RETURN_SHIPPING/RETURN_DELIVERED 상태)을 `ord_shipment`로 분리 — REQ-ORD-041/044/045/051/052/053을 shipment 기준으로 재정의.

| ID | 패턴 | 요구사항 | 도출 근거 |
|---|---|---|---|
| REQ-ORD-040 | Event-driven | WHEN 고객 귀책 클레임이 접수되면, THE 시스템은 SHALL 클레임 상태를 PAYMENT_PENDING으로 전환하고 수거 배송비 결제를 요청한다. | 정책: 고객 귀책 배송비 부담 |
| REQ-ORD-041 | Event-driven | WHEN 고객이 수거 배송비를 결제하면, THE 시스템은 SHALL shipment(PICKUP)를 생성하고 수거 프로세스를 시작한다(클레임 상태는 PAYMENT_PENDING 유지, INSPECTING 전환은 REQ-ORD-032 참조). | 상태머신: ord_shipment 생성(v6) |
| REQ-ORD-042 | Unwanted | IF 수거 배송비가 24시간 내 결제되지 않으면, THEN THE 시스템은 SHALL 클레임을 자동 취소(PAYMENT_EXPIRED)하고 고객에게 알림톡을 발송한다. | 정책: 결제 기한 24시간 |
| REQ-ORD-043 | Event-driven | WHEN 결제 대기 12시간이 경과하면, THE 시스템은 SHALL 미결제 리마인드 알림톡을 발송한다. | 정책: 신속 처리 유도 |
| REQ-ORD-044 | Event-driven | WHEN 입점사가 수거 운송장을 등록하면, THE 시스템은 SHALL shipment(PICKUP) 상태를 IN_TRANSIT으로 전환하고 수거 택배 추적을 시작한다. | 상태머신: ord_shipment PENDING→IN_TRANSIT |
| REQ-ORD-045 | Event-driven | WHEN 입점사가 상품 입고를 확인하면, THE 시스템은 SHALL shipment(PICKUP) 상태를 DELIVERED로 전환한다(클레임 상태의 INSPECTING 전환은 REQ-ORD-032). | 상태머신: ord_shipment IN_TRANSIT→DELIVERED |
| REQ-ORD-046 | Event-driven | WHEN 입점사가 품질점검 합격을 판정하면, THE 시스템은 SHALL 클레임 상태를 PICKED_UP(수거완료)으로 전환한다. | 상태머신: INSPECTING→PICKED_UP |
| REQ-ORD-047 | Event-driven | WHEN 입점사가 품질점검 거부를 판정하면, THE 시스템은 SHALL 클레임 상태를 PICKUP_REJECTED(수거거부)로 전환하고 거부 사유를 기록한다. | 상태머신: INSPECTING→PICKUP_REJECTED |
| REQ-ORD-048 | Unwanted | IF 입점사가 거부 사유 없이 품질점검 거부를 시도하면, THEN THE 시스템은 SHALL 거부를 차단하고 사유 입력을 요구한다. | 정책: 사유 필수 |
| REQ-ORD-049 | Event-driven | WHEN 어드민이 수거거부 건에 대해 폐기를 결정하면, THE 시스템은 SHALL 클레임 상태를 DISPOSED로 전환한다. | CS 운영: 반송 불가 판단 |
| REQ-ORD-050 | Event-driven | WHEN 어드민이 수거거부 건에 대해 반송 배송비 추가결제를 요청하면, THE 시스템은 SHALL 고객에게 반송 배송비 결제 알림톡을 발송하고 RETURN_PAYMENT_PENDING으로 전환한다. | CS 운영: 반송 결정 |
| REQ-ORD-051 | Event-driven | WHEN 반송 배송비 결제 완료 후 입점사가 반송 운송장을 등록하면, THE 시스템은 SHALL shipment(RETURN)를 생성하고 상태를 IN_TRANSIT으로 전환한다(클레임 상태는 RETURN_PAYMENT_PENDING 유지). | 상태머신: ord_shipment 생성·전환(v6) |
| REQ-ORD-052 | Event-driven | WHEN 택배사가 반송 배송완료를 확인하면, THE 시스템은 SHALL shipment(RETURN) 상태를 DELIVERED로 전환한다. | 상태머신: ord_shipment IN_TRANSIT→DELIVERED |
| REQ-ORD-053 | Event-driven | WHEN shipment(RETURN)가 DELIVERED 상태에서 배치가 실행되면, THE 시스템은 SHALL 클레임 상태를 COMPLETED로 자동 전환하고 고객에게 완료 알림톡을 발송한다. | 상태머신: RETURN_PAYMENT_PENDING→COMPLETED(v6, shipment 파생) |

---

## 장바구니 옵션 변경

| ID | 패턴 | 요구사항 | 도출 근거 |
|---|---|---|---|
| REQ-ORD-054 | Event-driven | WHEN 고객이 장바구니 상품의 옵션을 변경하면, THE 시스템은 SHALL 변경된 SKU로 갱신하고 소계를 재계산한다. | 상위UC: 옵션 변경 |
| REQ-ORD-055 | Unwanted | IF 변경하려는 옵션의 잔여수량(실재고−장바구니 선점수량)이 0 이하이면, THEN THE 시스템은 SHALL 변경을 거부하고 "해당 옵션은 품절입니다" 메시지를 반환한다. | 정책: 품절 판정 |

---

## 클레임 확장 — 교환(맞교환 원칙)

> v4 (2026-08-20 신설): 교환은 "맞교환"을 전제로 한다 — 선출고 후 수취 순서이며, 수취 시 품질점검 기준은 택(TAG) 유지 여부로 판단한다. REQ-ORD-046/047(품질점검 합격/거부)을 EXCHANGE 유형에 한해 아래 기준으로 특화한다.
> v6 (2026-08-20 현행화): REQ-ORD-056이 참조하던 PICKUP 상태가 ord_shipment로 이관됨에 따라 귀책판정 완료 시점 기준으로 재정의.

| ID | 패턴 | 요구사항 | 도출 근거 |
|---|---|---|---|
| REQ-ORD-056 | Event-driven | WHEN 클레임 유형이 EXCHANGE이고 귀책판정이 완료되면(고객귀책: 수거배송비 결제완료 / 입점사귀책: 판정 즉시), THE 시스템은 SHALL 교환 SKU 재고를 선점하고 shipment(EXCHANGE_OUT)를 생성해 교환상품을 즉시 선출고한다(원상품 수취 이전). | 정책: 맞교환 — 선출고 후 수취 |
| REQ-ORD-057 | Event-driven | WHEN 클레임 유형이 EXCHANGE이고 입점사가 회수 상품의 택(TAG) 부착 상태를 확인하면, THE 시스템은 SHALL 택이 유지된 경우 품질점검 합격(PICKED_UP)으로, 택이 제거·훼손된 경우 품질점검 거부(PICKUP_REJECTED)로 판정한다. | 상태머신: INSPECTING→PICKED_UP/PICKUP_REJECTED (EXCHANGE 특화 기준) |

> ⚠️ **정책 결정 필요**: 품질점검 불합격(택 미유지) 판정 시, 이미 선출고된 교환상품의 회수·추가청구 방법이 미정. CS 운영 정책 확정 필요.

---

## 클레임 접수 — 증빙 사진

> v6 (2026-08-20 신설): 입점사(VENDOR) 귀책 사유(상품불량 등)로 신청 시 사진 증빙을 의무화. 고객(CUSTOMER) 귀책(단순변심 등)은 기존대로 선택.

| ID | 패턴 | 요구사항 | 도출 근거 |
|---|---|---|---|
| REQ-ORD-058 | Unwanted | IF 반품/교환 신청 시 사유가 입점사(VENDOR) 귀책(상품불량 등)인데 첨부 사진이 0장이면, THEN THE 시스템은 SHALL 신청을 거부하고 "상품 상태를 확인할 수 있는 사진을 1장 이상 첨부해주세요" 메시지를 반환한다. | CS 운영: 귀책사유 확인 증빙 |

---

## 배송 실행 (ord_shipment)

> v6 (2026-08-20 신설): 배송 실행(택배사 이동 구간)을 order/claim 공용 `ord_shipment`로 분리. 고객·입점사·CS가 판단하지 않는 순수 물류 구간을 담당한다.

| ID | 패턴 | 요구사항 | 도출 근거 |
|---|---|---|---|
| REQ-ORD-059 | Event-driven | WHEN 입점사가 운송장을 등록하면(출고/수거/반송/교환선출고 공통), THE 시스템은 SHALL 해당 shipment 상태를 PENDING에서 IN_TRANSIT으로 전환한다. | 상태머신: ord_shipment PENDING→IN_TRANSIT |
| REQ-ORD-060 | Event-driven | WHEN 택배사 API가 배송완료를 확인하면, THE 시스템은 SHALL shipment 상태를 DELIVERED로 전환한다. | 상태머신: ord_shipment IN_TRANSIT→DELIVERED |
| REQ-ORD-061 | Unwanted | IF 택배사 API가 배송실패·반송 신호를 보내면, THEN THE 시스템은 SHALL shipment 상태를 FAILED로 전환하고 CS 담당자에게 알림을 발송한다. | 정책: 배송 예외 처리 (기존 미모델링 구간 보완) |
| REQ-ORD-062 | Event-driven | WHEN 입점사 또는 CS 담당자가 FAILED 건에 대해 재발송 처리를 하면, THE 시스템은 SHALL shipment 상태를 PENDING으로 되돌리고 운송장을 재등록받는다. | 정책: 배송실패 재처리 |

---

## 바텀업 검토 보완 (2026-08-21 신설)

> S3 상세설계(화면레이아웃·인터페이스명세·GWT)를 역으로 검토해 발견한, S2에 근거 요구사항이 없던 항목을 보완한다.

| ID | 패턴 | 요구사항 | 도출 근거 |
|---|---|---|---|
| REQ-ORD-063 | Unwanted | IF 품절·판매중지 상품을 장바구니에 담으려 하면, THEN THE 시스템은 SHALL 담기를 거부하고 "현재 구매할 수 없는 상품입니다" 메시지를 반환한다. | 인터페이스명세 PRODUCT_NOT_AVAILABLE 역반영 |
| REQ-ORD-064 | Unwanted | IF 장바구니 수량이 1~99 범위를 벗어나면, THEN THE 시스템은 SHALL 변경을 거부하고 유효 범위를 안내한다. | 인터페이스명세 INVALID_QUANTITY 역반영 |
| REQ-ORD-065 | Unwanted | IF 클레임 첨부 이미지가 3장을 초과하면, THEN THE 시스템은 SHALL 추가 첨부를 거부한다. | ERD `ord_claim_image` "최대 3장" 역반영 |
| REQ-ORD-066 | Event-driven | WHEN CS 담당자가 귀책 판정을 확정하면, THE 시스템은 SHALL 고객이 신청 시 제출한 responsibility 값을 CS 판정 결과로 덮어쓴다(불일치 시 CS 판정이 최종). | CS 운영: 접수 심사 — 고객 자진신고는 참고값, CS 확정이 최종 |
| REQ-ORD-067 | Ubiquitous | THE 시스템은 SHALL 반려(REJECTED)·만료(PAYMENT_EXPIRED)된 클레임의 수량을 "재신청 가능 수량" 계산에서 제외한다. | 상태머신(DH) "종료 상태(재신청 필요)" 주석 — 재신청 차단 방지 |
| REQ-ORD-068 | Unwanted | IF 클레임이 RECEIVED 상태로 24시간 이상 CS 미처리 상태이면, THEN THE 시스템은 SHALL CS 담당자에게 리마인드 알림을 발송한다. | 정책: PAYMENT_PENDING 12h 리마인드(REQ-ORD-043)와 동급 SLA |
| REQ-ORD-069 | Unwanted | IF 클레임 유형이 EXCHANGE이고 귀책판정 시점에 교환 SKU(exchangeSkuId) 재고가 없으면, THEN THE 시스템은 SHALL 귀책판정을 거부하고 "교환 가능한 재고가 없습니다" 메시지를 반환한다(선출고 전 단계에서 차단). | REQ-ORD-056 선행조건 — 재고선점 실패 시나리오 보완 |
| REQ-ORD-070 | Unwanted | IF 교환 신청 시 exchangeSkuId가 원 주문 상품(productId)과 다른 상품이면, THEN THE 시스템은 SHALL 신청을 거부한다. | 정책: 교환은 동일 상품 내 옵션(색상/사이즈) 변경만 허용 |
| REQ-ORD-071 | Unwanted | IF 클레임이 INSPECTING 상태 이후이면, THEN THE 시스템은 SHALL 고객의 자진 취소 요청을 거부한다(귀책판정·수거 시작 이후 취소 불가 — 주문 취소와 동일 원칙). | 상태머신(DH) PREPARING 이후 취소 불가 원칙과 대칭 |
| REQ-ORD-072 | Unwanted | IF 클레임 유형이 EXCHANGE이고 입점사가 품질점검 거부(택 미유지)를 판정하는데 사진이 0장이면, THEN THE 시스템은 SHALL 거부 처리를 차단하고 사진 첨부를 요구한다. | REQ-ORD-058(VENDOR귀책 사진 필수)과 대칭 — 입점사 판정도 증빙 필요 |

---

## 바텀업 재검증 보완 (2026-08-21 2차)

> 1차 보완(REQ-ORD-063~072)이 S3에 실제로 결선되는지 재검증한 결과, "요구사항은 있는데 대상 기능/필드/이력 자체가 없어 검증 불가"인 항목을 마저 보완한다.

| ID | 패턴 | 요구사항 | 도출 근거 |
|---|---|---|---|
| REQ-ORD-073 | Event-driven | WHEN 고객이 RECEIVED 또는 PAYMENT_PENDING 상태의 클레임을 자진 취소하면, THE 시스템은 SHALL 클레임 상태를 REJECTED로 전환하고 사유를 "고객 자진 철회"로 기록한다. | REQ-ORD-071(INSPECTING 이후 취소 거부)의 긍정 사례 — 취소 기능 자체가 없어 REQ-ORD-071을 검증할 대상이 없던 문제 해소 |
| REQ-ORD-074 | Ubiquitous | THE 시스템은 SHALL "재신청 가능 수량" 조회 시 반려(REJECTED)·만료(PAYMENT_EXPIRED) 클레임을 제외한 값을 API 응답 필드로 노출한다. | REQ-ORD-067 구체화 — 계산 로직이 필드로 실체화되지 않아 검증 불가였던 문제 해소 |
| REQ-ORD-075 | Ubiquitous | THE 시스템은 SHALL 클레임 첨부 이미지에 업로드 시점(고객 접수 시 / 입점사 품질점검 시)을 구분하는 값을 기록하며, "최대 3장" 제약은 접수 시점과 판정 시점에 각각 독립적으로 적용한다. | 접수 사진(REQ-ORD-058)과 판정 사진(REQ-ORD-072)이 같은 클레임에 공존할 때 서로를 침범하지 않도록 함 |
| REQ-ORD-076 | Ubiquitous | THE 시스템은 SHALL CS 귀책판정 확정 시 고객이 원래 제출한 responsibility 값을 덮어쓰지 않고 별도 이력으로 보존한다(`submitted_responsibility` vs 최종 `responsibility`). | REQ-ORD-066 구체화 — 단일 컬럼 덮어쓰기로 고객 자진신고 이력이 소실되던 문제 해소 |

---

## 근거

| 항목 | 출처 |
|---|---|
| 유스케이스 도출 | `../DC-상위유스케이스/order.md` |
| 정책 수치·규칙 | 자산 정책서 (장바구니 50개, D+7 자동확정, 반품 10일) |
| 도메인 간 연동 | `DB-도메인정의서.md` Order "의존·이벤트 발행" |
| 메뉴·화면 대응 | `DE-메뉴구조도/readme.md` Order 관련 화면 |
| 배송 실행 분리(ord_shipment) | 상태머신(DH) v6 — "판단·결정 지점만 order/claim status, 택배사 이동 구간은 shipment" 원칙 |
| 입점사귀책 사진 필수 | CS 운영 인터뷰 (귀책판정 증빙 필요) |
| 바텀업 검토 보완(REQ-ORD-063~072) | S3 상세설계(DL-인터페이스명세, DN-화면레이아웃, DF-ERD) 역검토 — 2026-08-21 |
| 바텀업 재검증 보완(REQ-ORD-073~076) | 2차 바텀업 재검증 — 기능/이력 실체 없이 요구사항만 있던 항목 보완, 2026-08-21 |
