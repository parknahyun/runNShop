# EARS 기능요구사항 — Order

> **단계**: 구조설계
> **문서범위**: Domain
> **문서종류**: Spec
>
> **작성 목적**: 상위 유스케이스(⑥)와 메뉴구조도(⑦)를 기반으로, Order 도메인의 기능요구를 EARS 패턴으로 정형화한다.
> **흐름 내 위치**: ⑥ 상위 UC → ⑦ 메뉴구조도 → **⑧ EARS** → ⑨ ERD → ⑩ 상태머신
> **작성 주체**: 시니어 개발자 + AI 협업 (기획자·현업 검토·확인)

| 항목 | 내용 |
|---|---|
| ID | SPEC-EARS-ORDER-001 |
| 상태 | **Finalized** |
| 작성일 | 2026-08-11 |
| 갱신일 | 2026-08-11 |

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

| ID | 패턴 | 요구사항 | 도출 근거 |
|---|---|---|---|
| REQ-ORD-022 | Event-driven | WHEN 판매자가 출고 처리를 요청하면, THE 시스템은 SHALL 주문 상태를 PREPARING으로 전환한다. | 상위UC: 출고 처리 |
| REQ-ORD-023 | Event-driven | WHEN 판매자가 운송장 번호를 등록하면, THE 시스템은 SHALL 주문 상태를 IN_DELIVERY로 전환하고 배송 추적을 시작한다. | 상위UC: 운송장 등록 |
| REQ-ORD-024 | Event-driven | WHEN 택배사 API로부터 배송완료 신호를 수신하면, THE 시스템은 SHALL 주문 상태를 DELIVERED로 전환한다. | 상위UC: 배송상태 갱신 |
| REQ-ORD-025 | Event-driven | WHEN 고객이 배송지 변경을 요청하면, THE 시스템은 SHALL 출고 전(PAYMENT_COMPLETED) 상태에서만 변경을 허용한다. | 상위UC: 배송지 변경 |
| REQ-ORD-026 | Unwanted | IF 배송지 변경 요청 시 주문 상태가 PREPARING 이후이면, THEN THE 시스템은 SHALL 변경을 거부하고 "출고 후에는 변경할 수 없습니다" 메시지를 반환한다. | 정책: 출고 후 변경 불가 |
| REQ-ORD-027 | State-driven | WHILE 주문이 IN_DELIVERY 상태인 동안, THE 시스템은 SHALL 60분 주기로 택배사 API에 배송 상태를 조회한다. | 정책: 배치 주기 |

---

## 클레임처리

| ID | 패턴 | 요구사항 | 도출 근거 |
|---|---|---|---|
| REQ-ORD-028 | Event-driven | WHEN 고객이 반품을 신청하면, THE 시스템은 SHALL 클레임을 RECEIVED 상태로 생성한다. | 상위UC: 반품 신청 |
| REQ-ORD-029 | Event-driven | WHEN 고객이 교환을 신청하면, THE 시스템은 SHALL 클레임을 RECEIVED 상태(EXCHANGE 유형)로 생성한다. | 상위UC: 교환 신청 |
| REQ-ORD-030 | Unwanted | IF 반품/교환 신청 시 배송완료 후 10일이 초과되었으면, THEN THE 시스템은 SHALL 신청을 거부하고 "기한이 초과되었습니다" 메시지를 반환한다. | 정책: 반품 기한 10일 |
| REQ-ORD-031 | Event-driven | WHEN CS 담당자가 클레임 처리를 시작하면, THE 시스템은 SHALL 클레임 상태를 IN_PROGRESS로 전환한다. | 상위UC: 처리시작 |
| REQ-ORD-032 | Event-driven | WHEN CS 담당자가 클레임을 완료 처리하면, THE 시스템은 SHALL 클레임 상태를 COMPLETED로 전환하고 환불/교환 프로세스를 시작한다. | 상위UC: 완료처리 |
| REQ-ORD-033 | Event-driven | WHEN CS 담당자가 클레임을 반려하면, THE 시스템은 SHALL 클레임 상태를 REJECTED로 전환하고 사유를 기록한다. | 상위UC: 반려확정 |
| REQ-ORD-034 | Event-driven | WHEN 판매자가 수거 완료를 확인하면, THE 시스템은 SHALL 재고를 복원하고 Payment에 환불 이벤트를 발행한다. | 상위UC: 수거·재고복구 |
| REQ-ORD-035 | Ubiquitous | THE 시스템은 SHALL 클레임 완료 시 CLAIM_COMPLETED 이벤트를 발행한다 (Payment 환불, Catalog 재고복원, Member 포인트복원). | 도메인정의서: 이벤트 발행 |

---

## 주문 조회·관리

| ID | 패턴 | 요구사항 | 도출 근거 |
|---|---|---|---|
| REQ-ORD-036 | Event-driven | WHEN 고객이 주문 목록을 조회하면, THE 시스템은 SHALL 본인 주문만 최신순으로 반환한다. | 상위UC: 내 주문 조회 |
| REQ-ORD-037 | Event-driven | WHEN 판매자가 주문 목록을 조회하면, THE 시스템은 SHALL 자기 매장 주문만 반환한다. | 상위UC: 입점사 주문 조회 |
| REQ-ORD-038 | Event-driven | WHEN CS 담당자가 주문을 검색하면, THE 시스템은 SHALL 상태·기간·주문번호·회원명 필터를 지원한다. | 상위UC: 전체 주문 검색 |
| REQ-ORD-039 | Ubiquitous | THE 시스템은 SHALL 모든 주문 상태 변경 시 이력(ord_order_history)을 기록한다. | 감사 추적 |

---

## 클레임 확장 (배송비 결제·수거·품질점검·폐기·반송)

> v2 (2026-08-12 현행화): S3 상세설계에서 클레임 프로세스 확장에 따라 추가.

| ID | 패턴 | 요구사항 | 도출 근거 |
|---|---|---|---|
| REQ-ORD-040 | Event-driven | WHEN 고객 귀책 클레임이 접수되면, THE 시스템은 SHALL 클레임 상태를 PAYMENT_PENDING으로 전환하고 수거 배송비 결제를 요청한다. | 정책: 고객 귀책 배송비 부담 |
| REQ-ORD-041 | Event-driven | WHEN 고객이 수거 배송비를 결제하면, THE 시스템은 SHALL 클레임 상태를 PICKUP으로 전환하고 수거 프로세스를 시작한다. | 상태머신: PAYMENT_PENDING→PICKUP |
| REQ-ORD-042 | Unwanted | IF 수거 배송비가 24시간 내 결제되지 않으면, THEN THE 시스템은 SHALL 클레임을 자동 취소(PAYMENT_EXPIRED)하고 고객에게 알림톡을 발송한다. | 정책: 결제 기한 24시간 |
| REQ-ORD-043 | Event-driven | WHEN 결제 대기 12시간이 경과하면, THE 시스템은 SHALL 미결제 리마인드 알림톡을 발송한다. | 정책: 신속 처리 유도 |
| REQ-ORD-044 | Event-driven | WHEN 입점사가 수거 운송장을 등록하면, THE 시스템은 SHALL 수거 택배 추적을 시작한다. | 상위UC: 수거정보 입력 |
| REQ-ORD-045 | Event-driven | WHEN 입점사가 상품 입고를 확인하면, THE 시스템은 SHALL 클레임 상태를 INSPECTING(품질점검)으로 전환한다. | 상태머신: PICKUP→INSPECTING |
| REQ-ORD-046 | Event-driven | WHEN 입점사가 품질점검 합격을 판정하면, THE 시스템은 SHALL 클레임 상태를 PICKED_UP(수거완료)으로 전환한다. | 상태머신: INSPECTING→PICKED_UP |
| REQ-ORD-047 | Event-driven | WHEN 입점사가 품질점검 거부를 판정하면, THE 시스템은 SHALL 클레임 상태를 PICKUP_REJECTED(수거거부)로 전환하고 거부 사유를 기록한다. | 상태머신: INSPECTING→PICKUP_REJECTED |
| REQ-ORD-048 | Unwanted | IF 입점사가 거부 사유 없이 품질점검 거부를 시도하면, THEN THE 시스템은 SHALL 거부를 차단하고 사유 입력을 요구한다. | 정책: 사유 필수 |
| REQ-ORD-049 | Event-driven | WHEN 어드민이 수거거부 건에 대해 폐기를 결정하면, THE 시스템은 SHALL 클레임 상태를 DISPOSED로 전환한다. | CS 운영: 반송 불가 판단 |
| REQ-ORD-050 | Event-driven | WHEN 어드민이 수거거부 건에 대해 반송 배송비 추가결제를 요청하면, THE 시스템은 SHALL 고객에게 반송 배송비 결제 알림톡을 발송하고 PAYMENT_PENDING(RETURN)으로 전환한다. | CS 운영: 반송 결정 |
| REQ-ORD-051 | Event-driven | WHEN 반송 배송비 결제 완료 후 입점사가 반송 운송장을 등록하면, THE 시스템은 SHALL 클레임 상태를 RETURN_SHIPPING으로 전환한다. | 상태머신: 반송 배송 |

---

## 장바구니 옵션 변경

| ID | 패턴 | 요구사항 | 도출 근거 |
|---|---|---|---|
| REQ-ORD-052 | Event-driven | WHEN 고객이 장바구니 상품의 옵션을 변경하면, THE 시스템은 SHALL 변경된 SKU로 갱신하고 소계를 재계산한다. | 상위UC: 옵션 변경 |
| REQ-ORD-053 | Unwanted | IF 변경하려는 옵션의 잔여수량(실재고−장바구니 선점수량)이 0 이하이면, THEN THE 시스템은 SHALL 변경을 거부하고 "해당 옵션은 품절입니다" 메시지를 반환한다. | 정책: 품절 판정 |

---

## 근거

| 항목 | 출처 |
|---|---|
| 유스케이스 도출 | `06-상위유스케이스(Order).md` |
| 정책 수치·규칙 | 자산 정책서 (장바구니 50개, D+7 자동확정, 반품 10일) |
| 도메인 간 연동 | `05-도메인정의서.md` Order "의존·이벤트 발행" |
| 메뉴·화면 대응 | `07-메뉴구조도(IA).md` Order 관련 화면 |
