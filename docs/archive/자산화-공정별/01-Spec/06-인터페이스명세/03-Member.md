# Member 도메인 인터페이스 명세 (초안)

| 항목 | 내용 |
|---|---|
| 산출물 ID | SPEC-API-MEMBER-001 |
| Scope | Bolt (Member 도메인) |
| 상태 | DRAFT-v1 |
| 작성일 | 2026-07-30 |
| 구현 단계 | **Mock** (1차 본개발: Order·Payment. Member는 PublicApi Mock 제공) |
| 입력 자산 | EARS(03-Member.md), GWT(03-Member.md), 도메인간-우선업무-의존관계.md |

---

## 1. Internal PublicApi (Order 연동 — Phase 0)

### GET /api/internal/member/members/{memberId}/points/balance — 포인트 잔액 조회

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-MEM-001 |
| 호출자 | Order BE (동기) |

**Response (200):**
```yaml
data:
  memberId: string
  balance: integer # 사용 가능 포인트
  minUsageAmount: integer # 최소 사용 금액 (Config)
```

---

### POST /api/internal/member/members/{memberId}/points/use — 포인트 사용

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-MEM-002, REQ-MEM-003 |
| 호출자 | Order BE (동기) |

**Request:**
```yaml
Body:
  amount: integer (required, min:1)
  orderId: string (required)
```

**Response (200):**
```yaml
data:
  success: boolean
  usedAmount: integer
  remainingBalance: integer
```

**Error:**
| code | 조건 | HTTP | 대응 GWT |
|---|---|---|---|
| POINT_INSUFFICIENT | 잔액 < 요청 금액 | 200 (success=false) | AC-MEM-003 |
| POINT_MIN_NOT_MET | 요청 금액 < 최소 사용 금액 | 422 | AC-MEM-028 |

---

### POST /api/internal/member/members/{memberId}/points/restore — 포인트 복원

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-MEM-004 |
| 호출자 | Order 도메인 이벤트 (비동기) 또는 동기 호출 |

**Request:**
```yaml
Body:
  amount: integer (required)
  orderId: string (required)
  reason: string (required) # CANCELLED | REFUND | COMPLEX_PAY_FAIL
```

**Response (200):**
```yaml
data:
  restoredAmount: integer
  newBalance: integer
```

---

### POST /api/internal/member/members/{memberId}/points/earn — 포인트 적립

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-MEM-005 |
| 호출자 | Order 도메인 이벤트 (구매확정, 비동기) |

**Request:**
```yaml
Body:
  orderAmount: integer (required) # 결제 금액 (적립 기준)
  orderId: string (required)
```

**Response (200):**
```yaml
data:
  earnedAmount: integer # 등급별 적립률 적용 결과
  grade: string # 적용된 등급
  rate: number # 적용된 적립률 (0.005~0.02)
  newBalance: integer
```

---

### GET /api/internal/member/members/{memberId}/addresses — 배송지 목록 조회

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-MEM-006 |
| 호출자 | Order BE (동기) |

**Response (200):**
```yaml
data:
  addresses:
    - addressId: string
      label: string # "집", "회사"
      recipientName: string
      phone: string # 마스킹: 010-****-5678
      address: string
      addressDetail: string
      zipCode: string
      isDefault: boolean
```

---

### GET /api/internal/member/members/{memberId}/grade — 회원 등급 조회

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-MEM-007 |
| 호출자 | Order BE (동기) |

**Response (200):**
```yaml
data:
  memberId: string
  grade: string # NEW | RUNNER | PACER | ELITE
  earnRate: number # 0.005 | 0.01 | 0.015 | 0.02
  benefits:
    - type: string # POINT_RATE | COUPON | FREE_SHIPPING
      description: string
```

---

## 2. 고객 API (Mobile)

### POST /api/v1/auth/login — 로그인

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-MEM-011, REQ-MEM-012 |
| 인증 | 불필요 |

**Request:**
```yaml
Body:
  email: string (required)
  password: string (required)
```

**Response (200):**
```yaml
data:
  accessToken: string
  memberId: string
  grade: string
```

**Error:**
| code | 조건 | HTTP | 대응 GWT |
|---|---|---|---|
| INVALID_CREDENTIALS | ID/PW 불일치 | 401 | — |
| ACCOUNT_LOCKED | 5회 실패 → 잠금 | 403 | AC-MEM-013 |

---

### GET /api/v1/members/me/addresses — 배송지 목록 (고객)

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-MEM-020~023 |
| 인증 | 필수 |

### POST /api/v1/members/me/addresses — 배송지 등록

### PUT /api/v1/members/me/addresses/{addressId} — 배송지 수정

### DELETE /api/v1/members/me/addresses/{addressId} — 배송지 삭제

---

### GET /api/v1/members/me/points — 포인트 내역 (고객)

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-MEM-040 |
| 인증 | 필수 |

**Response (200):**
```yaml
data:
  balance: integer
  history:
    - type: string # EARN | USE | RESTORE | EXPIRE
      amount: integer
      reason: string
      createdAt: datetime
  page: { ... }
```

---

### GET /api/v1/members/me/coupons — 쿠폰함 (고객)

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-MEM-050 |
| 인증 | 필수 |

**Response (200):**
```yaml
data:
  coupons:
    - couponId: string
      couponName: string
      discountType: string # RATE | AMOUNT
      discountValue: integer
      minOrderAmount: integer
      status: string # AVAILABLE | USED | EXPIRED
      expiresAt: datetime
```

---

## Error Catalog

| code | HTTP | 설명 | 대응 GWT |
|---|---|---|---|
| POINT_INSUFFICIENT | 200 (success=false) | 포인트 잔액 부족 | AC-MEM-003 |
| POINT_MIN_NOT_MET | 422 | 최소 사용 금액 미달 | AC-MEM-028 |
| INVALID_CREDENTIALS | 401 | 로그인 실패 | — |
| ACCOUNT_LOCKED | 403 | 계정 잠금 (5회 실패) | AC-MEM-013 |

---

## 변경 이력

| 버전 | 일자 | 변경 내용 |
|---|---|---|
| DRAFT-v1 | 2026-07-30 | 초판 — Internal PublicApi 6개 + 고객 API 주요 endpoint |
