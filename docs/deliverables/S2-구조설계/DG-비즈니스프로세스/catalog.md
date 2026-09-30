# 비즈니스 프로세스 — Catalog

> **단계**: 구조설계
> **문서범위**: Domain
> **문서종류**: Design
>
> **작성 목적**: 상태머신(⑩)의 전이를 액티비티 흐름으로 확장하여, "누가 어떤 순서로 업무를 수행하는가"를 시각화한다.
> **흐름 내 위치**: ⑩ 상태머신 → **⑪ 비즈니스 프로세스** → ⑫ 이벤트 플로우
> **작성 주체**: 시니어 개발자 + AI 협업 (기획자·현업 검토·확인)

| 항목 | 내용 |
|---|---|
| ID | DESIGN-BP-CATALOG-001 |
| 상태 | **Draft** |
| 작성일 | 2026-07-08 |
| 갱신일 | 2026-07-08 |

---

## 1. 상품등록·심사 프로세스

```plantuml
@startuml
skinparam backgroundColor transparent
skinparam defaultFontSize 11
title 상품등록·심사 비즈니스 프로세스

|판매자(벤더)|
start
:상품 초안 작성\n(name, category, price, image);
:상태: DRAFT;

if (필수 필드 충족?) then (yes)
  :심사 요청;
  :상태: REVIEW_REQUESTED;
else (no)
  :필수 필드 미충족 안내;
  stop
endif

|관리자(MD)|
:심사 착수;
:상태: UNDER_REVIEW;

if (상품 적합?) then (승인)
  :심사 승인;
  :상태: ON_SALE;
  :ProductApproved 이벤트 발행;
  stop
else (반려)
  :반려 사유 작성;
  :상태: REJECTED;
  :판매자 알림 발송;
endif

|판매자(벤더)|
:반려 사유 확인;
:상품 수정;
:상태: DRAFT;
backward :심사 요청;

@enduml
```

---

## 2. 재고 선점 프로세스 (동기)

```plantuml
@startuml
skinparam backgroundColor transparent
skinparam defaultFontSize 11
title 재고 선점 비즈니스 프로세스 (동기)

|시스템(Order)|
start
:재고 차감 요청\n(sku_id, quantity);

|시스템(Catalog)|
:SKU 가용 재고 조회\n(available_quantity);

if (available_quantity >= 요청 수량?) then (yes)
  :available_quantity 차감;
  :cat_stock_history 기록\n(change_type: RESERVE);
  :StockChanged 이벤트 발행;

  if (available_quantity == 0?) then (yes)
    :상품 상태: ON_SALE → SOLD_OUT;
  else (no)
  endif

  :성공 응답 반환;
  stop
else (no)
  :INSUFFICIENT_STOCK 응답 반환;
  stop
endif

@enduml
```

---

## 3. 재고 복원 프로세스 (비동기)

```plantuml
@startuml
skinparam backgroundColor transparent
skinparam defaultFontSize 11
title 재고 복원 비즈니스 프로세스 (비동기)

|시스템(Order)|
start
:ORDER_CANCELLED 이벤트 발행\n(sku_id, quantity);

|시스템(Catalog)|
:이벤트 수신\n(Consumer);
:멱등 검증\n(eventId 중복 체크);

if (이미 처리된 이벤트?) then (중복)
  :무시 (멱등);
  stop
else (신규)
  :available_quantity 복원\n(+quantity);
  :cat_stock_history 기록\n(change_type: RESTORE);
  :StockChanged 이벤트 발행;

  if (상태 == SOLD_OUT AND available_quantity > 0?) then (yes)
    :상품 상태: SOLD_OUT → ON_SALE;
    :재입고 알림 발송 대상 조회;
    :알림 발송;
  else (no)
  endif
  stop
endif

@enduml
```

---

## 4. 상품상태 자동전환 프로세스 (재고 연동)

```plantuml
@startuml
skinparam backgroundColor transparent
skinparam defaultFontSize 11
title 상품상태 자동전환 (재고 연동)

|시스템(배치)|
start
:주기적 재고 상태 점검\n(또는 StockChanged 이벤트 트리거);

|시스템(Catalog)|
:상품별 전체 SKU\navailable_quantity 합산;

if (합산 == 0 AND 상태 == ON_SALE?) then (yes)
  :상태: ON_SALE → SOLD_OUT;
  :StockChanged 이벤트 발행;
  stop
else if (합산 > 0 AND 상태 == SOLD_OUT?) then (yes)
  :상태: SOLD_OUT → ON_SALE;
  :StockChanged 이벤트 발행;
  :재입고 알림 트리거;
  stop
else (변동 없음)
  :상태 유지;
  stop
endif

@enduml
```

---

## 5. 전시페이지 게시 프로세스

```plantuml
@startuml
skinparam backgroundColor transparent
skinparam defaultFontSize 11
title 전시페이지 게시 비즈니스 프로세스

|관리자(MD)|
start
:전시 페이지 생성\n(상태: DRAFT);
:섹션·템플릿 구성;

if (즉시 게시?) then (yes)
  :즉시 게시 실행;
  :상태: PUBLISHED;
  :published_at 기록;
  stop
else (예약 게시)
  :scheduled_at 설정;
  :상태: SCHEDULED;
endif

|시스템(배치)|
:예약 시간 도래 감지\n(scheduled_at <= now);
:상태: SCHEDULED → PUBLISHED;
:published_at 기록;

|관리자(MD)|
fork
  :게시 중 운영;
fork again
  if (수정 필요?) then (yes)
    :편집 시작;
    :상태: DRAFT_EDIT;
    :수정 작업;
    :수정 반영 (재게시);
    :상태: PUBLISHED;
  else (no)
  endif
end fork

if (기간 만료 / 종료?) then (yes)
  :상태: CLOSED;
  :closed_at 기록;
  stop
else (no)
  stop
endif

@enduml
```

---

## 근거

| 항목 | 출처 |
|---|---|
| 상태 전이 | `DH-상태머신(Catalog).md` |
| 심사 흐름 | `DC-상위유스케이스(Catalog).md` 상품등록·심사 업무그룹 |
| 재고 선점 규칙 | REQ-CAT-002, REQ-CAT-003 |
| 재고 복원 규칙 | REQ-CAT-004, REQ-CAT-005 |
| 자동 상태 전환 | REQ-CAT-023, REQ-CAT-024 |
| 전시 예약 게시 | 운영 정책: 예약 게시 배치 |
| 재입고 알림 | REQ-CAT-029 |
