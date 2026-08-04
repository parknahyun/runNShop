# Payment 도메인 인터페이스 명세 (초안)

| 항목 | 내용 |
|---|---|
| 산출물 ID | SPEC-API-PAYMENT-001 |
| Scope | Bolt (Payment 도메인) |
| 상태 | DRAFT-v1 |
| 작성일 | 2026-07-30 |
| 구현 단계 | **본개발** (1차 대상 — PG 연동(토스페이먼츠), 실제 결제 승인/취소) |
| 입력 자산 | EARS(04-Payment.md), GWT(04-Payment.md), 용어집, API 설계규칙, CONS-004/005 |

> **본개발 전환 (2026-07-30 확정)**:
> - Order·Payment = **본개발** (실제 구현)
> - 연관 도메인 = **Mock 유지** (Catalog 재고확인 → 항상 성공, Config 정책 → 기본값 등)
> - BFF: Payment 도메인은 인증 후 + 이벤트 기반 → BFF 미적용

> **Payment 도메인 특성**: 대부분의 API가 이벤트 컨슈머(C) 채널이며 화면 직접 호출이 아님.
> 고객·관리자 화면에서 호출하는 API만 여기에 정의하고, 이벤트 기반 처리는 이벤트 플로우에서 관리.
>
> **제약사항**: CONS-004(토스페이먼츠 단일 PG), CONS-005(미지원 결제수단 제외)

---

## 공통 응답 구조

```yaml
# 성공
{ "code": "SUCCESS", "data": { ... } }

# 에러
{ "code": "ERROR_CODE", "message": "사용자 메시지", "detail": "디버그 정보" }
```

## 인증 방식

Order 도메인 인터페이스 명세(`01-Order.md`)의 "공통 헤더" 절과 동일.
`Authorization: Bearer {userId}` — 프로토타입에서는 토큰 값을 사용자 ID로 직접 해석.

---

## 1. 결제수단 관리 (고객)

### GET /api/v1/members/me/payment-methods — 결제수단 목록

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-PAY-017 |
| 채널 | 고객웹 (M) |
| 인증 | 필수 |

**Response (200):**
```yaml
data:
  methods:
    - id: string
      type: string # CARD | EASY_PAY
      displayName: string # "신한 ****-1234"
      isDefault: boolean
      registeredAt: datetime
```

---

### POST /api/v1/members/me/payment-methods — 결제수단 등록

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-PAY-018 |
| 채널 | 고객웹 (M) |

**Request:**
```yaml
Body:
  type: string (required) # CARD
  pgAuthData: object (required) # PG 인증 완료 후 받은 데이터
    billingKey: string
    cardCompany: string
    cardNumberMasked: string # "****-****-****-1234"
```

**Response (200):**
```yaml
data:
  id: string
  type: string
  displayName: string
  registeredAt: datetime
```

---

### DELETE /api/v1/members/me/payment-methods/{methodId} — 결제수단 삭제

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-PAY-019 |
| 채널 | 고객웹 (M) |

**Response (200):**
```yaml
data:
  deleted: true
```

---

## 2. 결제내역 조회 (고객)

### GET /api/v1/members/me/payments — 결제 트랜잭션 조회

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-PAY-020 |
| 채널 | 고객웹 (M) |

**Query:**
```yaml
page: integer (default:0)
size: integer (default:20)
```

**Response (200):**
```yaml
data:
  content:
    - paymentId: string
      orderId: string
      method: string
      amount: integer
      status: string # PAID | CANCELLED | REFUNDED | PARTIAL_REFUNDED
      approvedAt: datetime
  page: { number, size, totalElements, totalPages }
```

---

### GET /api/v1/members/me/payments/{paymentId}/refund-status — 환불 진행상태

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-PAY-021 |
| 채널 | 고객웹 (M) |

**Response (200):**
```yaml
data:
  paymentId: string
  refundStatus: string # REQUESTED | PROCESSING | COMPLETED | FAILED
  requestedAt: datetime
  estimatedCompleteAt: datetime | null
  refundAmount: integer
```

---

## 3. 결제 관리 (Admin)

### GET /api/admin/v1/payments — 결제 내역 조회

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-PAY-016 |
| 채널 | Admin (A) |

**Query:**
```yaml
page, size
method: string (optional) # CARD | EASY_PAY
status: string (optional) # PAID | CANCELLED | REFUNDED
dateFrom: date (optional)
dateTo: date (optional)
```

**Response (200):**
```yaml
data:
  content:
    - paymentId: string
      orderId: string
      memberId: string
      method: string
      amount: integer
      pointAmount: integer
      status: string
      approvedAt: datetime
      pgTransactionId: string
  page: { ... }
  summary:
    totalAmount: integer
    totalCount: integer
```

---

### GET /api/admin/v1/payments/monitoring — 결제 성공/실패 모니터링

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-PAY-027 |
| 채널 | Admin (A) |

**Query:**
```yaml
period: string # TODAY | WEEK | MONTH
```

**Response (200):**
```yaml
data:
  successCount: integer
  failCount: integer
  successRate: number # 0.0~1.0
  totalAmount: integer
  periodStart: date
  periodEnd: date
```

---

### GET /api/admin/v1/payments/failures — 결제 실패 로그

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-PAY-028 |
| 채널 | Admin (A) |

**Query:**
```yaml
page, size, dateFrom, dateTo
```

**Response (200):**
```yaml
data:
  content:
    - paymentId: string
      orderId: string
      method: string
      failedAt: datetime
      failReason: string
      retryCount: integer
      retryHistory:
        - attemptAt: datetime
          result: string # FAIL | SUCCESS
```

---

## 4. PG 관리 (Admin)

### GET /api/admin/v1/pg/settings — PG 연동 설정 조회

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-PAY-023, REQ-PAY-024 |
| 채널 | Admin (A) |

**Response (200):**
```yaml
data:
  pgProvider: "TOSS" # CONS-004
  methods:
    - type: "CARD"
      enabled: boolean
    - type: "KAKAO_PAY"
      enabled: boolean
    - type: "NAVER_PAY"
      enabled: boolean
    - type: "TOSS_PAY"
      enabled: boolean
```

---

### PUT /api/admin/v1/pg/settings/methods/{type} — 결제수단 활성/비활성

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-PAY-024 |
| 채널 | Admin (A) |

**Request:**
```yaml
Body:
  enabled: boolean (required)
```

---

### GET /api/admin/v1/pg/policy — 결제 정책 조회

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-PAY-025 |
| 채널 | Admin (A) |

**Response (200):**
```yaml
data:
  minPaymentAmount: integer # 최소 결제금액
  maxPaymentAmount: integer # 최대 결제금액
  installmentMonths: integer[] # 무이자 할부 개월 [3, 6, 12]
  pointMinUsage: integer # 포인트 최소 사용액
```

---

## 5. 이벤트 기반 처리 (화면 API 아님 — 참조용)

아래는 화면에서 직접 호출하지 않고 **이벤트 컨슈머가 처리**하는 내부 API입니다.
상세 스키마는 `Design/06-이벤트플로우.md` 참조.

| 이벤트 | 처리 내용 | 대응 EARS |
|---|---|---|
| PaymentRequested (Order→Payment) | PG 승인 요청 + 결과 이벤트 발행 | REQ-PAY-001~005 |
| PaymentCancelRequested (Order→Payment) | PG 취소 → REFUNDED | REQ-PAY-011, 037 |
| ApprovalCancelRequested (Order→Payment) | PG 승인취소 (PAID/PENDING) | REQ-PAY-036 |
| PartialRefundRequested (Order→Payment) | PG 부분환불 → PARTIAL_REFUNDED | REQ-PAY-012 |
| ExtraPaymentRequested (Order→Payment) | 추가배송비 결제 생성 | REQ-PAY-015 |
| PG Callback (PG→Payment) | 서명검증 + 멱등처리 + 상태 전환 | REQ-PAY-034, 035 |

---

## 6. Cross-Field Rules

| 규칙 | 설명 | 대응 EARS |
|---|---|---|
| 금액 일치 검증 | PG 승인금액 == 주문금액 (불일치 시 즉시 취소 + 운영팀 알림) | REQ-PAY-006 |
| 복합결제 포인트 우선 | 포인트 차감 → 잔여 카드 결제. 카드 실패 시 포인트 즉시 복원 | REQ-PAY-008, 009 |
| 원결제수단 환불 | 환불 시 원결제수단 기준 (포인트→포인트 복원, 카드→카드 취소) | REQ-PAY-013, 037 |
| 결제 금액 제한 | Config 설정 최소·최대 금액 범위 벗어나면 결제 거부 | REQ-PAY-026 |
| 3회 실패 제한 | 동일 카드 당일 3회 연속 실패 → 당일 제한, 익일 자동 해제 | REQ-PAY-031~033 |
| PG 토큰만 저장 | 카드번호 등 원본 정보 저장 금지 | REQ-PAY-007 |
| 콜백 멱등 | 동일 pgTransactionId 중복 수신 시 최초 1회만 처리 | REQ-PAY-035 |
| 비동기 재시도 | PG 통신 실패 시 동기 재시도 없이 비동기 최대 3회 | REQ-PAY-004, 005 |

---

## Error Catalog (Payment 도메인 전체)

| code | HTTP | 설명 | 대응 GWT |
|---|---|---|---|
| PAYMENT_AMOUNT_TOO_LOW | 422 | 최소 결제금액 미달 | AC-PAY-032 |
| PAYMENT_AMOUNT_TOO_HIGH | 422 | 최대 결제금액 초과 | AC-PAY-033 |
| CARD_RESTRICTED | 403 | 당일 결제 제한 카드 | AC-PAY-038 |
| PG_APPROVAL_FAILED | 502 | PG 승인 실패 | AC-PAY-003 |
| PG_FDS_BLOCKED | 502 | FDS 이상거래 거부 | AC-PAY-004 |
| PG_RETRY_EXHAUSTED | 502 | 재시도 3회 모두 실패 | AC-PAY-006 |
| PG_AMOUNT_MISMATCH | 502 | PG 승인금액 불일치 (즉시 취소됨) | AC-PAY-007 |
| PG_SIGNATURE_INVALID | 401 | 콜백 서명 검증 실패 | AC-PAY-011 |
| REFUND_FAILED | 502 | PG 환불 실패 (재시도 중) | AC-PAY-018 |
| REFUND_EXHAUSTED | 502 | 환불 재시도 3회 실패 (수동 처리 필요) | AC-PAY-019 |
| COMPLEX_PAY_CARD_FAILED | 502 | 복합결제 카드 부분 실패 (포인트 복원됨) | AC-PAY-014 |

---

## 변경 이력

| 버전 | 일자 | 변경 내용 |
|---|---|---|
| DRAFT-v1 | 2026-07-30 | 초판 — EARS 33개 + GWT 39개 기반 API 도출 |
