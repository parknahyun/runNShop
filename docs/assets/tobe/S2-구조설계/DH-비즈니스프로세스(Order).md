# 비즈니스 프로세스 — Order

> **단계**: 구조설계
> **문서범위**: Domain
> **문서종류**: Design
>
> **작성 목적**: 상태머신(DG)의 전이를 액티비티 흐름으로 확장하여, "누가 어떤 순서로 업무를 수행하는가"를 시각화한다.
> **흐름 내 위치**: DG 상태머신 → **DH 비즈니스 프로세스** → DI 이벤트 플로우
> **작성 주체**: 시니어 개발자 + AI 협업 (기획자·현업 검토·확인)

| 항목 | 내용 |
|---|---|
| ID | DESIGN-BP-ORDER-001 |
| 상태 | **Finalized** |
| 작성일 | 2026-08-11 |
| 갱신일 | 2026-08-20 |

---

## 1. 주문결제 프로세스

> v2 (2026-08-20 현행화): 구모델 잔재 `PROCESSING` 제거 — 상태머신(DG) TEMP→ORDER_RECEIVED→PAYMENT_PENDING 3단계로 정정

```plantuml
@startuml
skinparam backgroundColor transparent
skinparam defaultFontSize 11
title 주문결제 비즈니스 프로세스

|고객|
start
:주문서 화면 진입\n(TEMP 임시주문 생성);
:주문서 작성\n(배송지·쿠폰·포인트 선택);
:결제 요청;

|시스템(Order)|
:주문 접수 (ORDER_RECEIVED)\n(재고차감 요청);
:재고 선점 요청\n→ Catalog PublicApi;

if (재고 충분?) then (yes)
  :주문 상태 → PAYMENT_PENDING;
  :Payment 도메인에 결제 요청;
else (no)
  :재고 부족 → 주문 접수 실패 (STOCK_FAILED);
  :STOCK_FAILED 이벤트 발행\n→ 고객 알림톡;
  stop
endif

|시스템(Payment)|
:PG 승인 요청\n(최대 3회 재시도, 타임아웃 30초);

if (승인 성공?) then (yes)
  :PAYMENT_APPROVED 이벤트 발행;
else (no — 3회 재시도 소진)
  :PAYMENT_FAILED 이벤트 발행;
  |시스템(Order)|
  :재고 복원;
  :주문 상태 → PAYMENT_FAILED;
  :고객 알림톡 발송;
  stop
endif

|시스템(Order)|
:주문 상태 → PAYMENT_COMPLETED;
:입점사별 주문 분할;
:ORDER_PAID 이벤트 발행;
note right: → Settlement(정산 대기)\n→ Notification(주문확인 알림톡+이메일)

stop
@enduml
```

---

## 2. 배송·구매확정 프로세스

> v2 (2026-08-20 현행화): 배송 실행(IN_DELIVERY)을 `ord_shipment`(OUTBOUND)로 분리 — 상태머신(DG) v6

```plantuml
@startuml
skinparam backgroundColor transparent
skinparam defaultFontSize 11
title 배송·구매확정 비즈니스 프로세스

|입점사|
start
:출고 준비 확인;
:PREPARING;
:운송장 등록\n→ shipment(OUTBOUND) 생성;

|시스템(Order)|
:shipment(OUTBOUND) → IN_TRANSIT;
:배송상태 갱신 (배치 60분, 택배사 API 조회);

if (배송완료?) then (yes)
  :shipment(OUTBOUND) → DELIVERED;
  :주문 상태 → DELIVERED\n(shipment 이벤트 구독, 파생 전환);
else (no)
  :계속 추적;
  stop
endif

|고객|
if (수동 구매확정?) then (yes)
  :구매확정 요청;
else (D+7 경과)
  |시스템(배치)|
  :자동 구매확정;
endif

|시스템(Order)|
:CONFIRMED;
:ORDER_CONFIRMED 이벤트 발행;
note right: → Settlement(정산 등록)\n→ Member(포인트 적립)
stop

@enduml
```

---

## 3. 취소 프로세스

> v2 (2026-08-20 현행화): CS 예외취소가 PREPARING까지만 가능함을 명시(IN_DELIVERY→DELIVERED 등 배송 시작 이후는 CS도 취소 불가, 상태머신DG 금지전이)

```plantuml
@startuml
skinparam backgroundColor transparent
skinparam defaultFontSize 11
title 주문 취소 비즈니스 프로세스

|고객 / CS|
start
:취소 요청;

|시스템(Order)|
if (PAYMENT_COMPLETED 상태?) then (yes)
  :고객 단순 취소 허용;
  :CANCELLED;
  :ORDER_CANCELLED 이벤트 발행;
  note right: → Payment(환불)\n→ Catalog(재고 복원)\n→ Member(포인트 복원)
  stop
else (PREPARING 상태?) then (yes)
  if (CS 예외 취소?) then (yes)
    :CS 예외 취소 처리;
    :CANCELLED;
    :ORDER_CANCELLED 이벤트 발행;
    note right: → Payment(환불)\n→ Catalog(재고 복원)
    stop
  else (no)
    :취소 거부\n"반품 신청을 이용해주세요";
    stop
  endif
else (DELIVERED 이후 — 배송 시작됨)
  :취소 거부(CS도 불가)\n"배송 시작 후에는 취소할 수 없습니다.\n반품 신청으로 처리해주세요";
  stop
endif

@enduml
```

---

## 4. 클레임(반품/교환) 프로세스

> v2 (2026-08-12 현행화): 12상태 확장 반영 (배송비 결제→수거→품질점검→합격/거부→환불/폐기/반송)
> v3 (2026-08-20 현행화): 14상태 반영 — 반송 배송비결제 대기(RETURN_PAYMENT_PENDING)·반송배송완료(RETURN_DELIVERED) 상태 보강
> v4 (2026-08-20 현행화): 교환(EXCHANGE) "맞교환" 원칙 반영 — PICKUP 진입 시 교환상품 선출고, 품질점검 판정 기준을 EXCHANGE는 택(TAG) 유지 여부로 명시
> v5 (2026-08-20 현행화): 배송 실행(PICKUP/RETURN_SHIPPING/RETURN_DELIVERED)을 `ord_shipment`로 분리(상태머신DG v6) — 11상태로 축소. 귀책판정 후 곧바로 INSPECTING으로 전이하며, 수거·반송 배송은 shipment 하위 흐름으로 표시. VENDOR귀책 신청 시 사진 1장 필수(REQ-ORD-058) 반영.

```plantuml
@startuml
skinparam backgroundColor transparent
skinparam defaultFontSize 11
title 클레임 비즈니스 프로세스 (확장)

|고객|
start
:반품/교환 신청\n(주문상세에서 아이템 선택, 사유·회수지 입력\nVENDOR귀책 사유 선택 시 사진 1장 이상 필수 — REQ-ORD-058);

|시스템(Order)|
if (배송완료 후 10일 이내?) then (yes)
  :클레임 생성 (RECEIVED);
else (no)
  :신청 거부\n"기한이 초과되었습니다";
  stop
endif

|어드민|
if (접수 승인?) then (yes)
  :귀책사유 확인·귀책 판정;
  if (고객(CUSTOMER) 귀책?) then (yes)
    :배송비 결제 요청 (PAYMENT_PENDING)\n알림톡 발송;
    |고객|
    if (24시간 내 결제?) then (yes)
      :수거 배송비 결제 완료\n(쿠폰 적용 가능)\n→ shipment(PICKUP) 생성;
    else (no)
      :자동 취소 (PAYMENT_EXPIRED)\n알림톡 발송;
      stop
    endif
  else (입점사(VENDOR) 귀책)
    :배송비 불필요\n→ shipment(PICKUP) 즉시 생성;
  endif
else (no)
  :반려 (REJECTED)\n알림톡 발송;
  stop
endif

note right
  EXCHANGE(교환) 유형: 귀책판정 완료 시점에
  shipment(EXCHANGE_OUT) 병렬 생성 →
  교환상품 선출고 (맞교환 원칙,
  선출고 후 수취 — REQ-ORD-056)
end note

|입점사|
:수거 운송장 등록\n→ shipment(PICKUP) IN_TRANSIT;
:상품 입고 확인\n→ shipment(PICKUP) DELIVERED, 클레임 상태 → INSPECTING;
:품질점검;
note right
  판정 기준:
  RETURN → 상품 상태(훼손 여부)
  EXCHANGE → 택(TAG) 유지 여부
  (REQ-ORD-057)
end note

if (합격?) then (yes)
  :수거완료 (PICKED_UP);
else (no)
  :수거거부 (PICKUP_REJECTED)\n사유 등록;

  |어드민|
  if (반송 가능?) then (yes)
    :반송 배송비 추가결제 요청 (RETURN_PAYMENT_PENDING)\n고객 알림톡;
    |고객|
    :반송 배송비 결제 완료;
    |입점사|
    :반송 운송장 등록\n→ shipment(RETURN) IN_TRANSIT;
    |시스템(Order)|
    :반송 배송완료 확인(택배사 API)\n→ shipment(RETURN) DELIVERED;
    :클레임완료 (COMPLETED)\n(배치 자동전환, 알림톡);
    stop
  else (no)
    :폐기 처리 (DISPOSED)\n→ 클레임완료 (COMPLETED);
    stop
  endif
endif

|어드민|
:환불 처리;
note right
  원결제수단 PG 환불
  또는 계좌이체(수동)
  - 입금정보 시스템 등록
  - 이체 행위 휴먼 진행
  - 환불완료 처리
end note
:환불완료 (REFUNDED);

|시스템(Order)|
:클레임완료 (COMPLETED)\n알림톡+이메일 발송;
note right: → Payment(환불)\n→ Catalog(재고 복원)\n→ Member(포인트 복원)
stop

@enduml
```

---

## 근거

| 항목 | 출처 |
|---|---|
| 상태 전이 | `DG-상태머신(Order).md` |
| 액터·업무 흐름 | `DC-상위유스케이스(Order).md` |
| 도메인 간 호출 | `DB-도메인정의서.md` §4 관계도 |
| 업무 규칙 | REQ-ORD-015 (D+7), REQ-ORD-019 (취소 제한), REQ-ORD-030 (반품 10일), REQ-ORD-058 (VENDOR귀책 사진 필수) |
| 배송 실행 분리(ord_shipment) | REQ-ORD-059~062 |
