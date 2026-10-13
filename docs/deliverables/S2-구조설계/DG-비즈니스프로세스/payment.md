# 비즈니스 프로세스 — Payment

> **단계**: 구조설계
> **문서범위**: Domain
> **문서종류**: Design
>
> **작성 목적**: 상태머신(DH)의 전이를 액티비티 흐름으로 확장하여, "누가 어떤 순서로 업무를 수행하는가"를 시각화한다.
> **흐름 내 위치**: DF ERD → **DG 비즈니스 프로세스** → DH 상태머신 → DI 이벤트 플로우
> **작성 주체**: 시니어 개발자 + AI 협업 (기획자·현업 검토·확인)

| 항목 | 내용 |
|---|---|
| ID | DESIGN-BP-PAYMENT-001 |
| 상태 | **Finalized** |
| 작성일 | 2026-08-11 |
| 갱신일 | 2026-08-11 |

---

## 1. 결제 승인 프로세스

```plantuml
@startuml
skinparam backgroundColor transparent
skinparam defaultFontSize 11
title 결제 승인 비즈니스 프로세스

|시스템(Order)|
start
:결제 요청 전달\n(order_id, amount, method);

|시스템(Payment)|
:결제 생성 (PENDING);
:금액 검증\n(요청 금액 == 주문 금액?);

if (금액 일치?) then (yes)
  :PG(토스페이먼츠) 승인 요청\n(최대 3회 재시도, 타임아웃 30초);
else (no)
  :금액 불일치 오류;
  :PAYMENT_FAILED 이벤트 발행;
  stop
endif

if (PG 승인 성공?) then (yes)
  :PAID;
  :pay_payment_log 기록 (APPROVE);
  :PAYMENT_APPROVED 이벤트 발행 → Order;
  stop
else (no — 실패 or 타임아웃, 3회 소진)
  :CANCELLED;
  :pay_payment_log 기록 (FAIL/TIMEOUT, final);
  :PAYMENT_FAILED 이벤트 발행 → Order;
  stop
endif

@enduml
```

> **재시도 상세**: PG 실패/타임아웃 시 지수 백오프(1초→2초→4초)로 최대 3회 재시도.
> 3회 모두 실패 시 CANCELLED로 전환. 각 시도마다 pay_payment_log에 기록.

---

## 2. 환불 프로세스

```plantuml
@startuml
skinparam backgroundColor transparent
skinparam defaultFontSize 11
title 환불 비즈니스 프로세스

|시스템(Order)|
start
:환불 요청 이벤트\n(ORDER_CANCELLED or CLAIM_COMPLETED);

|시스템(Payment)|
:환불 유형 판별;

if (전액 환불?) then (yes)
  :PG 전액 환불 요청;
else (부분 환불)
  :PG 부분 환불 요청\n(환불 금액 계산);
endif

if (PG 환불 성공?) then (yes)
  if (전액?) then (yes)
    :REFUNDED;
  else (부분)
    :PARTIAL_REFUNDED;
  endif
  :pay_payment_log 기록 (REFUND/PARTIAL_REFUND);
  stop
else (실패)
  :pay_payment_log 기록 (REFUND_FAIL);
  :CS 알림 발송\n(수동 환불 필요);
  stop
endif

@enduml
```

---

## 3. 수동 환불 프로세스

```plantuml
@startuml
skinparam backgroundColor transparent
skinparam defaultFontSize 11
title 수동 환불 비즈니스 프로세스

|CS 담당자|
start
:환불 실패 건 확인;

if (PG 재환불 가능?) then (yes)
  :수동 PG 재환불 요청;
  |시스템(Payment)|
  :PG 재환불 요청;
  if (성공?) then (yes)
    :상태 갱신 (REFUNDED/PARTIAL_REFUNDED);
    :pay_payment_log 기록;
    stop
  else (실패)
    :에스컬레이션\n(PG 관리자 직접 처리);
    stop
  endif
else (원결제수단 환불 불가)
  |CS 담당자|
  :고객에게 입금정보 요청;
  :입금정보 시스템 등록\n(은행/계좌번호/예금주);
  :직접 계좌이체 수행\n(수동);
  :환불완료 처리 클릭;
  |시스템(Payment)|
  :상태 갱신 (REFUNDED);
  :pay_payment_log 기록 (BANK_TRANSFER);
  stop
endif

@enduml
```

---

## 4. 카드 제한·해제 프로세스

```plantuml
@startuml
skinparam backgroundColor transparent
skinparam defaultFontSize 11
title 카드 제한·해제 프로세스

|시스템(Payment)|
start
:결제 실패 감지;
:동일 카드 실패 횟수 조회;

if (3회 연속 실패?) then (yes)
  :카드 당일 제한 등록\n(pay_card_restriction);
  :고객 안내 메시지;
else (no)
  :fail_count 증가;
endif
stop

|시스템(배치)|
start
:익일 00:00 배치 실행;
:전일 제한 카드 조회;
:released_at 갱신 (제한 해제);
stop

@enduml
```

---

## 근거

| 항목 | 출처 |
|---|---|
| 상태 전이 | `../DH-상태머신/payment.md` |
| 결제 흐름 | `../DC-상위유스케이스/payment.md` 결제 실행 업무그룹 |
| 재시도 규칙 | REQ-PAY-003 (3회), REQ-PAY-005 (30초 타임아웃) |
| 금액 검증 | REQ-PAY-007 |
| 카드 제한 | REQ-PAY-018, REQ-PAY-019 |
| 환불 정책 | REQ-PAY-008~013 |
