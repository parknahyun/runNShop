# 러닝 커머스 플랫폼 Bounded Context 정의서

> 작성 주체: 3TOP 2본부
> 문서 버전: v1.0
> 작성일: 2026.06.22
> 상태: 초안 (Draft)

---

## 목차

1. [개요](#1-개요)
2. [도메인 구조 및 관계](#2-도메인-구조-및-관계)
3. [Order](#3-order)
4. [Catalog](#4-catalog)
5. [Member](#5-member)
6. [Payment](#6-payment)
7. [Promotion](#7-promotion)
8. [Settlement](#8-settlement)
9. [Vendor](#9-vendor)
10. [Notification](#10-notification)
11. [Community](#11-community)
12. [Search](#12-search)
13. [Config](#13-config)
14. [Audit](#14-audit)
15. [도메인 간 이벤트 흐름 요약](#15-도메인-간-이벤트-흐름-요약)

---

## 1. 개요

### 설계 원칙

- **단일 책임**: 각 도메인은 하나의 핵심 책임만 가진다
- **느슨한 결합**: 도메인 간 통신은 비동기 이벤트 기반을 원칙으로 한다
- **즉시 응답 필요 시에만 동기 API** 호출을 허용한다
- **데이터 소유권**: 각 도메인이 소유한 데이터는 타 도메인이 직접 접근하지 않는다
- **MSA 전환 가능**: 1단계 Modular Monolith에서 2단계 MSA 전환 시 도메인 = 독립 서비스

### 이벤트 처리 방식

| 방식 | 사용 조건 | 구현 |
|------|---------|------|
| 동기 API 호출 | 즉시 응답 필요 (사전 유효성 확인) | REST API |
| 비동기 이벤트 | 실제 처리·알림·정산 등 | Outbox Pattern + Spring Event Consumer |

### 12개 업무 도메인

| # | 도메인 | 핵심 책임 | 레이어 |
|---|--------|----------|--------|
| 1 | Order | 주문,배송,클레임 생명주기 오케스트레이션 | 거래 |
| 2 | Catalog | 상품 정보·재고 전시 관리 | 상품 |
| 3 | Member | 회원·포인트·쿠폰 관리 | 고객 |
| 4 | Payment | 결제 트랜잭션 처리 | 거래 |
| 5 | Promotion | 쿠폰·행사가·할인 관리 | 혜택 |
| 6 | Settlement | 정산 계산·지급 | 정산 |
| 7 | Vendor | 입점사 생명주기 관리 | 파트너 |
| 8 | Notification | 알림 발송 관리 | 운영 |
| 9 | Community | 리뷰·QnA·크루·챌린지 | 커뮤니티 |
| 10 | Search | 통합 검색·인덱스 | 운영 |
| 11 | Config | 권한·코드·설정 관리 | 운영 |
| 12 | Audit | 로그·감사·Trace | 운영 |

---

## 2. 도메인 구조 및 관계

### 레이어별 구조

```
[고객 경험]
    Member ─── Catalog ─── Promotion

[거래 처리]  ← Order (오케스트레이터)
    Order ─── Payment

[혜택·정산]
    Settlement ─── Community

[파트너]
    Vendor

[운영 인프라]
    Notification · Search · Config · Audit
```

### 핵심 의존 원칙

```
Order → Catalog   : 재고 선점(PG 결제 요청 시)·복구
Order → Member    : 쿠폰·포인트 사용·복원
Order → Payment   : 결제·취소
Order → Settlement: 구매확정·재정산 (비동기)
Order → Vendor    : 주문 지표 전달 (비동기)
Order → Community : QnA 요청 (비동기)

Notification ← 전 도메인 이벤트 수신
Search       ← Catalog·Promotion·Community 인덱스
Audit        ← 전 도메인 로그 수신
Config       → 전 도메인 권한 확인 제공
```

---

## 3. Order

### 핵심 책임

> 고객 주문의 전체 생명주기를 오케스트레이션한다.

### 소유 데이터

| 엔티티 | 설명 |
|--------|------|
| `Order` | 주문 헤더 (고객·주문금액·상태·클레임잠금) |
| `OrderItem` | 주문 상품 (판매가·수수료율스냅샷·분담금) |
| `OrderDiscount` | 주문 단위 할인·분담금 |
| `Delivery` | 배송 정보 (운송장·배송사·상태) |
| `Claim` | 클레임 (유형·귀책·사진·상담원·추가배송비·접수채널) |
| `OrderBatch` | 배치 실행 이력 |

### 도메인 경계

**Order가 하는 것**
- 주문 생성·상태 관리 (TEMP → PAYMENT_COMPLETED → ... → CONFIRMED)
- 환불금 계산 (상품별 공급가 비중 안분)
- 클레임 접수·잠금 관리 (claim_lock)
- 배송 처리 (운송장 등록·추적)
- 구매확정 (7일 자동·수동)
- 추가 배송비 결제 요청 (고객 귀책 클레임)
- 주문 QnA 작성 요청
- 배송지 변경 처리
  - PAYMENT_COMPLETED: 고객 직접 변경
  - PREPARING: CS(어드민) 직접 변경 + 입점사 알림
  - IN_DELIVERY 이후: 변경 불가
- 운송장 수정: IN_DELIVERY 이전만 가능 (이후 CS 협의)
- 교환 조건: 동일 상품 내 옵션 변경만 가능 (색상·사이즈)
  - 재고 없는 경우 교환 불가 → 반품 후 재구매 안내
  - 타 상품으로의 교환 불가

**Order가 하지 않는 것**
- 재고 직접 관리 → Catalog
- 결제 처리 → Payment
- 포인트·쿠폰 처리 → Member
- 알림 발송 → Notification
- 정산 계산 → Settlement

### 주문 상태 전이

```
TEMP (임시 주문, 30분 타임아웃)
    ├─ PG 인증 완료 후 재고 선점 + PG 결제 요청
    ├─ 결제 성공 → PAYMENT_COMPLETED
    ├─ 비동기 주문 생성: PROCESSING (3분 타임아웃)
    │   └─ 성공 → PAYMENT_COMPLETED 유지
    └─ 실패·타임아웃 → CANCELLED (재고·포인트·쿠폰 복원)

PAYMENT_COMPLETED → PREPARING → IN_DELIVERY → DELIVERED
    ├─ 고객 확정 or 7일 경과 → CONFIRMED
    ├─ 반품 신청 (10일 이내)
    │   → RETURN_REQUESTED → RETURNING → RETURNED
    │   └─ 수거 전 철회 → RETURN_WITHDRAWN → DELIVERED 복귀
    └─ 교환 신청 (10일 이내)
        → EXCHANGE_REQUESTED → EXCHANGING → EXCHANGED
        └─ 수거 전 철회 → EXCHANGE_WITHDRAWN → DELIVERED 복귀
```

### 취소 유형

| 유형 | 시점 | 처리 방식 |
|------|------|---------|
| 단순 취소 | PAYMENT_COMPLETED | 전액 즉시 환불·재고 자동 복구·재주문 가능 |
| 반품 | PREPARING 이후 | 실물 회수·환불금 계산·재고 수작업 |
| 예외 취소 | PREPARING 이후 | 상담원 + 입점사·물류담당자 협의 후 상태 복원 → 단순 취소 |

### 클레임 정책

- 동일 주문 동시 클레임 불가 (claim_lock)
- 클레임은 고객 직접 또는 상담원 대리 진행 가능
- 고객 귀책 배송비: 프론트 추가 결제 수납 (정산 차감 아님)
- 재고 복구: 반품·교환(기존상품)은 수작업, 단순취소만 자동

### Order 배치 목록

| 배치명 | 실행 주기 | 처리 내용 |
|--------|---------|---------|
| TempOrderTimeoutBatch | 1분마다 | TEMP 30분 초과 → CANCELLED + 보상 |
| ProcessingTimeoutBatch | 1분마다 | PROCESSING 3분 초과 → CANCELLED + 보상 |
| ShippingDeadlineBatch | 매일 09:00 | 출고 기한 초과 → Notification + Vendor 지표 |
| AutoConfirmBatch | 매일 02:00 | 배송완료 7일 경과 → 구매확정 이벤트 |
| ClaimExpireBatch | 매일 02:00 | 배송완료 10일 경과 → 클레임 불가 전환 |

### 제공 API

| API | 설명 | 호출 도메인 |
|-----|------|-----------|
| `GET /orders/{id}/discount` | 주문 분담금 조회 | Settlement |
| `GET /orders/{id}/delivery-fee` | 배송비·귀책 조회 | Settlement |

### 발행 이벤트

| 이벤트 | 수신 도메인 | 시점 |
|--------|-----------|------|
| `StockReserveRequested` | Catalog | TEMP 생성 후 |
| `CouponUseRequested` | Member | 재고 선점 완료 후 |
| `PointUseRequested` | Member | 재고 선점 완료 후 |
| `PaymentRequested` | Payment | 쿠폰·포인트 사용 완료 후 |
| `OrderConfirmed` | Notification | 결제 완료 후 |
| `PurchaseConfirmed` | Member·Settlement·Notification | 구매확정 시 (비동기) |
| `ClaimReceived` | Notification | 클레임 접수 시 (취합 배치) |
| `PaymentCancelRequested` | Payment | 클레임 취소 시 |
| `PointRestoreRequested` | Member | 결제 취소 완료 후 |
| `CouponRestoreRequested` | Member | 결제 취소 완료 후 |
| `StockRestoreRequested` | Catalog | 취소 완료 후 |
| `ReturnCompleted` | Settlement | 반품 완료 후 (비동기) |
| `ExchangeCompleted` | Settlement | 교환 완료 후 (비동기) |
| `CancelCompleted` | Settlement | 취소 완료 후 (비동기) |
| `OrderQnaRequested` | Community | 주문 QnA 작성 요청 |
| `OrderMetricPublished` | Vendor | 거래액·이행률·클레임율 지표 |
| `ShippingDeadlineExceeded` | Notification | 출고 기한 초과 |

### 수신 이벤트

| 이벤트 | 발행 도메인 | 처리 내용 |
|--------|-----------|---------|
| `StockReserveCompleted` | Catalog | 쿠폰·포인트 사용 진행 |
| `StockReserveFailed` | Catalog | CANCELLED 처리 |
| `CouponUseCompleted` | Member | 결제 진행 |
| `PointUseCompleted` | Member | 결제 진행 |
| `PaymentCompleted` | Payment | PAYMENT_COMPLETED 전환 |
| `PaymentFailed` | Payment | 보상 트랜잭션 |
| `PaymentCancelCompleted` | Payment | 포인트·쿠폰 복원 진행 |
| `ReviewCompleted` | Community | 리뷰 포인트 지급 요청 |

### 동기 API 호출

| 호출 대상 | 목적 | 시점 |
|---------|------|------|
| Catalog API | 재고 존재 여부 사전 확인 | 주문 요청 시 |
| Promotion API | 쿠폰 조건 유효성 확인 | 주문 요청 시 |
| Member API | 쿠폰 보유·포인트 잔액 확인 | 주문 요청 시 |
| Config API | 상담원 CS 롤 권한 확인 | 클레임 상담 처리 시 |
| Payment API | 추가 배송비 결제 요청 | 고객 귀책 클레임 시 |

---

## 4. Catalog

### 핵심 책임

> 상품 정보의 전체 생명주기와 가격·재고를 관리한다.

### 소유 데이터

| 엔티티 | 설명 |
|--------|------|
| `Product` | 상품 (이름·카테고리·상태·출시일) |
| `SKU` | 옵션 (색상·사이즈·재고·상태) |
| `Category` | 카테고리 (대분류·수수료율) |
| `Brand` | 브랜드 (이름·인증여부) |
| `ProductPrice` | 가격 이력 (정가·판매가·공급가·변경시각·변경자) |
| `ProductExposure` | 노출 설정 (MD 노출순서·ai_score·노출여부) |

### 상품 상태 전이

```
DRAFT → REVIEW_REQUESTED → UNDER_REVIEW → ON_SALE
                                        ↓
                                    REJECTED → DRAFT (재심사)

ON_SALE   → SOLD_OUT  : 재고 0 자동
SOLD_OUT  → ON_SALE   : 주문취소 재고 복구 자동
SOLD_OUT  → ON_SALE   : 담당자 수동 (반품·교환 후)
ON_SALE / SOLD_OUT → DISCONTINUED : 수동
```

### 재고-상태 연동 규칙

| 이벤트 | 재고 변화 | 상태 변화 | 처리 |
|--------|---------|---------|------|
| 주문 발생 | -1 | 재고=0 → SOLD_OUT 자동 | 시스템 |
| 주문 취소 | +1 | SOLD_OUT → ON_SALE 자동 | 시스템 |
| 반품 확정 | +1 | 상태 유지 (SOLD_OUT) | 시스템(재고) + 수작업(상태) |
| 교환 확정 | ±0 | 상태 유지 | 시스템 |
| 담당자 수동 | 무관 | SOLD_OUT → ON_SALE | 담당자 |

### 도메인 경계

**Catalog가 하는 것**
- 상품 등록·수정·상태 관리
- SKU·재고·가격 관리
- 가격 변경 이력 관리
- 카테고리·브랜드 관리
- 노출 순서 관리 (MD 설정)
- 재고 존재 여부 API 제공
- 평점 캐시 보유 (Community 이벤트 수신)

**Catalog가 하지 않는 것**
- 리뷰·평점·QnA 관리 → Community
- 행사가·쿠폰·수량 할인 → Promotion
- 검색 인덱스 관리 → Search
- 심사 권한 확인 → Config

### 제공 API

| API | 설명 | 호출 도메인 |
|-----|------|-----------|
| `GET /catalog/products/{id}/stock` | 재고 존재 여부 | Order |
| `GET /catalog/products/{id}/price` | 상품 가격 조회 | Order·프론트 |
| `GET /catalog/categories/{id}/fee-rate` | 수수료율 조회 | Vendor |
| `GET /catalog/products/{id}/rating` | 평점 캐시 조회 | 프론트 |

### 발행 이벤트

| 이벤트 | 수신 도메인 | 시점 |
|--------|-----------|------|
| `StockReserveCompleted` | Order | 재고 선점 성공 |
| `StockReserveFailed` | Order | 재고 선점 실패 |
| `ProductApproved` | Notification·Search | 심사 승인 (취합 배치) |
| `ProductRejected` | Notification | 심사 반려 (취합 배치) |
| `ProductSoldOut` | Search·Notification | 품절 전환 |
| `ProductPriceChanged` | Search·Audit | 가격 변경 |
| `ProductStatusChanged` | Search·Audit | 상태 변경 |
| `ProductQnaRequested` | Community | 상품 QnA 요청 |

### 수신 이벤트

| 이벤트 | 발행 도메인 | 처리 내용 |
|--------|-----------|---------|
| `StockReserveRequested` | Order | 재고 선점 처리 |
| `StockRestoreRequested` | Order | 재고 복구 처리 |
| `RatingUpdated` | Community | 평점 캐시 업데이트 |
| `VendorSuspended` | Vendor | 입점사 상품 노출 중지 |

### Catalog 배치 목록

| 배치명 | 실행 주기 | 처리 내용 |
|--------|---------|---------| 
| DisplayPageScheduleBatch | 매 5분 | 예약 전시 페이지 자동 전환 (SCHEDULED→PUBLISHED) |
| ProductIndexSyncBatch | 매일 03:00 | ES 상품 인덱스 전체 동기화 |

### 동기 API 호출

| 호출 대상 | 목적 | 시점 |
|---------|------|------|
| Config API | MD 롤·권한 확인 | 심사 처리 시 |
| Vendor API | 입점사 계약·운영 상태 확인 | 심사 시점 |

---

## 5. Member

### 핵심 책임

> 고객 계정·등급·포인트·쿠폰을 관리한다.

### 소유 데이터

| 엔티티 | 설명 |
|--------|------|
| `Member` | 회원 (이름·이메일·휴대폰·등급·상태) |
| `MemberGrade` | 등급 이력 (등급·산정일·기준점수) |
| `Point` | 포인트 (잔액·적립·사용·소멸 이력) |
| `MemberCoupon` | 보유 쿠폰 (쿠폰ID·사용여부·만료일) |
| `DeviceSession` | 디바이스 세션 (최대 3개) |
| `Address` | 배송지 목록 |
| `NotificationPreference` | 수신 거부 설정 (채널별) |

### 회원 등급 체계

| 등급 | 명칭 | 진입 조건 |
|------|------|---------|
| 1 | New | 기준 미달 |
| 2 | Runner | 누적 구매 100만원 + 활동지수 10점 이상 |
| 3 | Pacer | 누적 구매 200만원 + 활동지수 20점 이상 |
| 4 | Elite | 누적 구매 300만원 + 활동지수 30점 이상 |

### 포인트 정책

| 항목 | 기준 |
|------|------|
| 등급별 적립률 | New 0.5% / Runner 1.0% / Pacer 1.5% / Elite 2.0% |
| 최대 적립 | 1건당 1,000원 |
| 적립 시점 | 구매확정 완료 후 |
| 유효기간 | 적립일로부터 3년 |
| 최소 사용 | 1,000원 이상 보유 시 |
| 최대 사용 | 결제금액 100% |
| 입점사 부담 | 30% |

### 제공 API

| API | 설명 | 호출 도메인 |
|-----|------|-----------|
| `GET /members/{id}/coupons/available/{product_id}` | 보유 쿠폰 유효성 | Order |
| `GET /members/{id}/point/balance` | 포인트 잔액 | Order |
| `GET /members/{id}/grade-discount` | 등급 할인율 | 프론트 |

### 발행 이벤트

| 이벤트 | 수신 도메인 | 시점 |
|--------|-----------|------|
| `CouponUseCompleted` | Order | 쿠폰 사용 완료 |
| `PointUseCompleted` | Order | 포인트 사용 완료 |
| `CouponRestoreCompleted` | Order | 쿠폰 복원 완료 |
| `PointRestoreCompleted` | Order | 포인트 복원 완료 |
| `GradeChanged` | Notification | 등급 변경 |
| `PointExpiringSoon` | Notification | 소멸 30일 전 |

### 수신 이벤트

| 이벤트 | 발행 도메인 | 처리 내용 |
|--------|-----------|---------|
| `CouponUseRequested` | Order | 쿠폰 사용 처리 |
| `PointUseRequested` | Order | 포인트 사용 처리 |
| `CouponRestoreRequested` | Order | 쿠폰 복원 처리 |
| `PointRestoreRequested` | Order | 포인트 복원 처리 |
| `PurchaseConfirmed` | Order | 구매확정 포인트 적립 |
| `ReviewPointGrantRequested` | Order | 리뷰 포인트 적립 |
| `ActivityCompleted` | Community | 활동지수 반영 |
| `CouponIssued` | Promotion | 발급 쿠폰 → MemberCoupon 저장 |
| `CartMergeValidationRequested` | Order | 장바구니 머지 후 재고·행사 유효성 검사 |

### Member 배치 목록

| 배치명 | 실행 주기 | 처리 내용 |
|--------|---------|---------| 
| MemberGradeBatch | 매월 1일 00:00 | 전 회원 등급 산정·쿠폰 지급 |
| YearEndGradeCouponBatch | 매년 12월 31일 | 등급별 연말 쿠폰 일괄 지급 |
| PointExpireBatch | 매일 02:00 | 소멸 30일 전 알림 이벤트 발행 |

---

## 6. Payment

### 핵심 책임

> 결제 트랜잭션의 승인·취소·환불을 처리한다.

### 소유 데이터

| 엔티티 | 설명 |
|--------|------|
| `Payment` | 결제 (주문ID·금액·수단·상태·PG승인번호) |
| `PaymentCancel` | 취소·환불 (취소금액·취소사유·환불수단) |
| `ExtraPayment` | 추가 결제 (클레임 배송비) |

### 결제 처리 기준

| 항목 | 기준 |
|------|------|
| 1단계 지원 수단 | 신용카드 |
| 2단계 추가 | 간편결제 (카카오페이·네이버페이·토스) |
| 재고 선점 시점 | PG 결제 요청 시 (서버가 PG에 결제 요청하는 시점) |
| 선점 유지 | 30분 |
| 재고 선점 시점 | PG 인증 완료(AUTH_APPROVED) 후 서버가 PG에 결제 요청하는 시점 |
| 동기 재시도 | 없음 (즉시 실패 처리) |
| 동기 보상 처리 재시도 | 1회 (재고·포인트·쿠폰 복원) → 실패 시 운영팀 이관 |
| 비동기 재시도 | 최대 3회 (즉시→30초→1분) |
| PG 응답 대기 | 30초 |
| 승인 오류 임계치 | 10분 내 2회 이상 → 관리자 알림 |
| FDS 연동 | 이상 결제 탐지 시 자동 차단 |
| 결제 실패 3회 연속 | 해당 카드 당일 사용 제한 |

### 발행 이벤트

| 이벤트 | 수신 도메인 | 시점 |
|--------|-----------|------|
| `PaymentCompleted` | Order | 결제 승인 완료 |
| `PaymentFailed` | Order | 결제 승인 실패 |
| `PaymentCancelCompleted` | Order | 결제 취소 완료 |

### 수신 이벤트

| 이벤트 | 발행 도메인 | 처리 내용 |
|--------|-----------|---------|
| `PaymentRequested` | Order | 결제 승인 처리 |
| `PaymentCancelRequested` | Order | 결제 취소 처리 |

---

## 7. Promotion

### 핵심 책임

> 쿠폰·행사가·수량 할인·기획전 등 혜택 정책을 정의하고 관리한다.

### 소유 데이터

| 엔티티 | 설명 |
|--------|------|
| `Coupon` | 쿠폰 (발행기준·적용조건·할인액·유효기간) |
| `EventPrice` | 행사가 (상품ID·행사가·기간·수량제한·잔여수량) |
| `QuantityDiscount` | 수량 할인 (입점사·상품목록·구간·할인율) |
| `CartDiscount` | 장바구니 할인 (금액구간·할인액) |
| `Exhibition` | 기획전 (상품목록·기간·배너) |

### 쿠폰 정책

| 항목 | 기준 |
|------|------|
| 중복 사용 | 플랫폼 쿠폰 + 입점사 쿠폰 중복 가능 |
| 동일 주체 중복 | 1장만 적용 |
| 유효기간 | 발행일 기준 최대 90일 |
| 비용 부담 | 플랫폼 쿠폰: 플랫폼 / 입점사 쿠폰: 입점사 / 공동: 계약 비율 |

### 수량 할인 적용 조건

- MD가 수량 할인 행사로 설정한 상품
- 동일 입점사 (`vendor_id` 동일)
- 동일 판매가 (`price_sale` 동일)
- 3가지 모두 충족 시에만 적용

### 행사가 수량 관리

```
Redis DECR event:quantity:{event_id}  ← 주문 시 차감
Redis INCR event:quantity:{event_id}  ← 취소 시 복구 (행사 기간 내)
```

### 제공 API

| API | 설명 | 호출 도메인 |
|-----|------|-----------|
| `GET /promotions/coupons/validate/{coupon_id}` | 쿠폰 조건 유효성 | Order |
| `GET /promotions/price/{product_id}` | 행사가 조회 | 프론트·Order |
| `GET /promotions/coupons/public` | 전체 대상 쿠폰 | 프론트 |
| `GET /promotions/coupons/available/{product_id}` | 상품별 적용 가능 쿠폰 | 프론트 |
| `GET /promotions/quantity-discount/{vendor_id}` | 수량 할인 그룹 조회 | 프론트·Order |
| `GET /promotions/cart-discount` | 장바구니 할인 조건 | 프론트 |

### 발행 이벤트

| 이벤트 | 수신 도메인 | 시점 |
|--------|-----------|------|
| `CouponIssued` | Member | 쿠폰 발급 시 |
| `EventPriceSoldOut` | Search·Notification | 행사 수량 소진 |
| `EventPriceEnded` | Search | 행사 종료 |
| `ExhibitionPublished` | Search | 기획전 게시 |

---

## 8. Settlement

### 핵심 책임

> 구매확정 기준으로 입점사 정산을 계산·확정·지급한다.

### 소유 데이터

| 엔티티 | 설명 |
|--------|------|
| `SettlementTarget` | 정산 대상 (주문ID·수수료율스냅샷·분담금스냅샷) |
| `Settlement` | 정산 (입점사ID·정산기간·정산금·상태) |
| `SettlementItem` | 정산 항목 (매출·수수료·배송비·포인트·쿠폰·패널티) |
| `SettlementAdjustment` | 재정산 (반품·취소·교환 차감·가산) |
| `SettlementPayment` | 지급 (지급일·계좌·금액·상태) |
| `ExternalSettlement` | 외부 정산 (PG사·물류사·광고주) |
| `SettlementObjection` | 정산 이의제기 (사유·금액·상태·처리결과) |

### 반품 환불 처리 기준

| 항목 | 기준 |
|------|------|
| 환불 처리 시점 | 상품 검수 완료 후 |
| 환불 소요기간 | 검수 완료 후 영업일 3일 이내 |
| 신용카드 | 카드사 취소 (영업일 3~5일) |
| 포인트 | 즉시 복원 |

### 정산 원칙

- **지급자(플랫폼) 기준** 정산
- 구매확정 시점 수수료율 스냅샷 저장 → 이후 변경 무관
- 재정산 항목은 마이너스(-)로 표기
- 최종 지급액 음수 시 → 익월 이월 → 3회 초과 시 환수 청구
- **직매입 입점사** (is_platform_direct=TRUE) → 정산 계산 대상 제외
- **이의제기**: 정산 확정일 + 5영업일 이내, 플랫폼 검토 후 수용/기각

### 정산 주기

| 항목 | 기준 |
|------|------|
| 정산 대상 확정 | 익월 5일 |
| 정산금 지급 | 익월 15일 (전 등급 동일) |
| 최소 지급 금액 | 10,000원 (미만 시 이월, 3회 연속 시 강제 지급) |

### 세금계산서

| 항목 | 기준 |
|------|------|
| 발행 기준일 | 정산 확정일 |
| 플랫폼 발행 | 입점사에 수수료 세금계산서 발행 |
| 입점사 발행 | 플랫폼에 공급가액 세금계산서 발행 |

### 발행 이벤트

| 이벤트 | 수신 도메인 | 시점 |
|--------|-----------|------|
| `SettlementConfirmed` | Notification | 정산 확정 (취합 배치) |
| `SettlementPaid` | Notification | 지급 완료 |

### 수신 이벤트

| 이벤트 | 발행 도메인 | 처리 내용 |
|--------|-----------|---------|
| `PurchaseConfirmed` | Order | 정산 대상 등록 (비동기) |
| `ReturnCompleted` | Order | 재정산 차감 (비동기) |
| `CancelCompleted` | Order | 재정산 차감 (비동기) |
| `ExchangeCompleted` | Order | 재정산 조정 (비동기) |

### 동기 API 호출

| 호출 대상 | 목적 | 시점 |
|---------|------|------|
| Order API | 주문 분담금·배송비 조회 | 정산 계산 시 |
| Vendor API | 입점사 계좌·지급 정보 조회 | 지급 처리 시 |

---

## 9. Vendor

### 핵심 책임

> 입점사의 전체 생명주기와 계약·등급·배송사를 관리한다.

### 소유 데이터

| 엔티티 | 설명 |
|--------|------|
| `Vendor` | 입점사 (사업자정보·상태·유형) |
| `VendorContract` | 계약 (기간·수수료율·독점여부·자동갱신) |
| `VendorGrade` | 등급 (등급·산정점수·산정일·이력) |
| `VendorAccount` | 정산 계좌 (1원 송금 인증 완료 여부 포함·3회 실패 시 수동 처리) |
| `VendorDelivery` | 배송사 선택 (플랫폼 제공 2곳 중 선택) |
| `VendorPenalty` | 패널티 (사유·금액·부과일) |

### 입점사 상태 전이

```
신청 → 서류검토 → 심사중 → 계약체결 → 운영중
                        ↓
                      거절 → (재신청: 거절 후 30일 이후 가능)

운영중 → 경고 → 판매중지 → 강제퇴점
운영중 → 계약만료 → 자동갱신 or 퇴점
```

### 입점사 등급 체계

| 등급 | 명칭 | 진입 조건 |
|------|------|---------|
| 1 | 신규 (New) | 3개월 미만 또는 기준 미달 | 0% |
| 2 | 일반 (Runner) | 60점 + 월 100만원 | 0.5% |
| 3 | 우수 (Pacer) | 75점 + 월 500만원 | 1.0% |
| 4 | 프리미엄 (Elite) | 90점 + 월 2,000만원 | 1.5% |

> 최종 수수료율 = 카테고리 기본 수수료율 − 등급 감면율

### 입점사 유형 및 원천징수

| 유형 | 원천징수 |
|------|---------|
| 사업자 입점사 | 미적용 |
| 개인 셀러 | 소득 유형에 따라 관련 법령 처리 |

### 배송사 정책

- 플랫폼 제공 배송사 2개사 (API 연동 완료)
- 미선택 시 수동 운송장 등록 (API 자동화 미적용)
- 미선택 입점사 배송 관련 분쟁 귀책 입점사 귀속

### 제공 API

| API | 설명 | 호출 도메인 |
|-----|------|-----------|
| `GET /vendors/{id}/status` | 입점사 계약·운영 상태 | Catalog |
| `GET /vendors/{id}/fee-rate` | 수수료율 조회 | Settlement |
| `GET /vendors/{id}/account` | 정산 계좌 조회 | Settlement |
| `GET /vendors/{id}/delivery` | 배송사 선택 정보 | Order |

### 발행 이벤트

| 이벤트 | 수신 도메인 | 시점 |
|--------|-----------|------|
| `VendorApproved` | Notification | 심사 승인 |
| `VendorRejected` | Notification | 심사 반려 |
| `VendorGradeChanged` | Notification | 등급 변경 |
| `VendorContractExpiring` | Notification | 만료 30일·7일 전 |
| `VendorSuspended` | Catalog·Notification | 판매 중지 |
| `VendorTerminated` | Catalog·Settlement·Notification | 퇴점 |

### 수신 이벤트

| 이벤트 | 발행 도메인 | 처리 내용 |
|--------|-----------|---------|
| `OrderMetricPublished` | Order | 등급 산정 지표 누적 |

---

## 10. Notification

### 핵심 책임

> 이벤트를 수신하여 채널 우선순위에 따라 알림을 발송하고 이력을 관리한다.

### 소유 데이터

| 엔티티 | 설명 |
|--------|------|
| `NotificationTemplate` | 알림 템플릿 (이벤트유형·채널·본문·변수) |
| `NotificationHistory` | 발송 이력 (이벤트유형·수신자·채널·상태·재시도횟수) |
| `NotificationBatch` | 취합 배치 대기 목록 |

### 채널 우선순위

카카오 알림톡 → SMS → 이메일 (Fallback 구조)

### 발송 정책

| 항목 | 기준 |
|------|------|
| 야간 차단 | 22시~08시 마케팅 알림 차단 |
| 거래 알림 | 24시간 필수 발송 |
| 마케팅 알림 | 수신 거부 가능 |
| 재시도 | 최대 3회 (즉시→30초→1분) |
| 취합 배치 | 09·13·18시 (클레임·심사결과·정산확정) |
| 긴급 즉시 발송 | 판매금지 확인·출고기한 초과·중재 결정 |

### 동기 API 호출

| 호출 대상 | 목적 |
|---------|------|
| Member API | 수신 거부 여부 확인 |

---

## 11. Community

### 핵심 책임

> 러너 커뮤니티 활동(리뷰·QnA·크루·챌린지·러닝기록)을 관리한다.

### 소유 데이터

| 엔티티 | 설명 |
|--------|------|
| `Review` | 리뷰 (상품ID·회원ID·별점·내용·이미지·상태) |
| `Rating` | 평점 집계 (상품ID·평균별점·리뷰수) |
| `ProductQnA` | 상품 QnA (상품ID·질문·답변·공개여부) |
| `OrderQnA` | 주문 QnA (주문ID·질문·답변·상태) |
| `Crew` | 크루 (이름·소개·멤버·활동) |
| `Challenge` | 챌린지 (목표·기간·참여자·달성여부) |
| `RunningLog` | 러닝 기록 (거리·페이스·심박수·케이던스) |
| `CourseReview` | 코스 추천 (위치·거리·난이도·리뷰) |

### 활동지수 산정

| 활동 | 지수 |
|------|------|
| 리뷰 작성 | +2 |
| 러닝 기록 공유 | +1 |
| 크루 활동 참여 | +1 |
| 챌린지 완료 | +3 |
| QnA 답변 채택 | +2 |

### 제공 API

| API | 설명 | 호출 도메인 |
|-----|------|-----------|
| `GET /community/products/{id}/rating` | 상품 평점 조회 | Catalog·프론트 |
| `GET /community/products/{id}/reviews` | 리뷰 목록 | 프론트 |
| `GET /community/products/{id}/qna` | 상품 QnA | 프론트 |

### 발행 이벤트

| 이벤트 | 수신 도메인 | 시점 |
|--------|-----------|------|
| `ReviewCompleted` | Order | 리뷰 작성 완료 |
| `RatingUpdated` | Catalog | 평점 변경 |
| `ActivityCompleted` | Member | 활동 완료 |

### 수신 이벤트

| 이벤트 | 발행 도메인 | 처리 내용 |
|--------|-----------|---------|
| `ProductQnaRequested` | Catalog | 상품 QnA 등록 |
| `OrderQnaRequested` | Order | 주문 QnA 등록 |

---

## 12. Search

### 핵심 책임

> 전 도메인의 콘텐츠를 통합 인덱싱하여 검색·필터·정렬 서비스를 제공한다.

### 소유 데이터

| 엔티티 | 설명 |
|--------|------|
| `ProductIndex` | 상품 인덱스 (상품명·브랜드·태그·가격·평점·출시일) |
| `ExhibitionIndex` | 기획전·이벤트 인덱스 |
| `CommunityIndex` | 커뮤니티 콘텐츠 인덱스 |
| `SearchKeyword` | 인기 검색어 (MD 수동 관리) |
| `AutoComplete` | 자동완성 데이터 |

### 검색 기준

| 항목 | 기준 |
|------|------|
| 검색 대상 | 상품명·브랜드·태그 전체 |
| 기본 정렬 | 출시일 내림차순 (`release_date`) |
| 품절 상품 | 동일 위치 노출 |
| 인기 검색어 | MD 수동 관리 (추후 배치 자동화) |

### 제공 API

| API | 설명 |
|-----|------|
| `GET /search?q={keyword}` | 통합 검색 |
| `GET /search/products` | 상품 검색·필터 |
| `GET /search/autocomplete` | 자동완성 |

### 수신 이벤트

| 이벤트 | 발행 도메인 | 처리 내용 |
|--------|-----------|---------|
| `ProductApproved` | Catalog | 상품 인덱스 추가 |
| `ProductSoldOut` | Catalog | 품절 상태 갱신 |
| `ProductPriceChanged` | Catalog | 가격 인덱스 갱신 |
| `ProductUpdated` | Catalog | updated_at 갱신 (장바구니 유효성 검사 기준) |
| `EventPriceSoldOut` | Promotion | 행사가 종료 갱신 |
| `ExhibitionPublished` | Promotion | 기획전 인덱스 추가 |

### 배치 인덱스 동기화

| 대상 | 주기 | API |
|------|------|-----|
| ON_SALE 상품 | 주기적 | Catalog API |
| 기획전·이벤트 | 주기적 | Promotion API |
| 커뮤니티 콘텐츠 | 주기적 | Community API |

---

## 13. Config

### 핵심 책임

> 운영자 계정·롤·권한·공통코드·공지·약관·배너를 관리한다.

### 소유 데이터

| 엔티티 | 설명 |
|--------|------|
| `Operator` | 운영자 계정 |
| `Role` | 롤 (슈퍼관리자·MD·CS·정산담당·입점관리) |
| `Permission` | 권한 (롤별 메뉴·기능 접근 권한) |
| `CommonCode` | 공통코드 |
| `Notice` | 공지사항 |
| `Terms` | 약관 (유형·버전·시행일) |
| `Banner` | 배너 (위치·이미지·링크·노출기간) |

### 운영자 롤 정의

| 롤 | 주요 접근 권한 |
|----|-------------|
| 슈퍼관리자 | 전체 |
| MD | Catalog·Promotion·Search 조회·수정 |
| CS | Order·Claim·Member 조회·처리 |
| 정산담당 | Settlement·Vendor 조회·처리 |
| 입점관리 | Vendor 심사·계약·등급 관리 |

### 제공 API

| API | 설명 | 호출 도메인 |
|-----|------|-----------|
| `GET /config/permissions/{operator_id}` | 운영자 권한 확인 | Catalog·Vendor·Order |
| `GET /config/codes/{group}` | 공통코드 조회 | 전 도메인 |
| `GET /config/banners` | 배너 목록 | 프론트 |
| `GET /config/notices` | 공지사항 | 프론트 |

---

## 14. Audit

### 핵심 책임

> 전 도메인의 로그·감사·Trace를 수집·보존·모니터링한다.

### 소유 데이터

| 엔티티 | 설명 |
|--------|------|
| `AuditLog` | 감사 로그 (도메인·이벤트유형·변경전후·처리주체·TraceID) |
| `TraceLog` | Trace 로그 (TraceID·SpanID·레벨·메시지·시각) |
| `OutboxEvent` | Outbox 이벤트 (상태·재시도횟수·처리시각) |
| `DLQ` | Dead Letter Queue (실패 이벤트·운영팀 처리 이력) |

### 감사 로그 수집 대상

| 도메인 | 수집 항목 |
|--------|---------|
| Order | 주문 생성·상태 변경·취소·반품·교환 |
| Payment | 결제 요청·승인·실패·환불·보상 |
| Catalog | 재고 변경·가격 변경·상품 상태 변경 |
| Member | 포인트·쿠폰 사용·복원 |
| Settlement | 정산 확정·지급·재정산 |
| 전 도메인 | 소프트 삭제 이벤트 |

### 로그 레벨

| 레벨 | 환경 | 보존 기간 |
|------|------|---------|
| ERROR·WARN·INFO | 운영 수집 | 1년 |
| DEBUG | 스테이징만 수집 | 30일 |
| Trace 전체 | 전 환경 | 1년 |

### Trace ID 구조

```
TRC-{YYYYMMDD}-{일련번호 8자리}
전파: HTTP Header X-Trace-Id
출력: [TraceID] [SpanID] [레벨] 메시지
```

### 모니터링 기준

| 항목 | 알림 조건 | 대상 |
|------|---------|------|
| ERROR 발생 | 건별 즉시 | 운영팀 |
| ERROR 임계치 | 10분 내 2회 이상 | 관리자 |
| DLQ 적재 | 건별 즉시 | 운영팀 |

---

## 15. 도메인 간 이벤트 흐름 요약

### 시나리오 1 — 고객 주문·결제

```
[사전 확인 - 동기]
Order → Catalog API (재고 확인)
Order → Promotion API (쿠폰 조건)
Order → Member API (잔액·보유 확인)

[비동기 처리]
Order →(StockReserveRequested)→ Catalog
Catalog →(StockReserveCompleted)→ Order
Order →(CouponUseRequested)→ Member
Order →(PointUseRequested)→ Member
Member →(CouponUseCompleted)→ Order
Member →(PointUseCompleted)→ Order
Order →(PaymentRequested)→ Payment
Payment →(PaymentCompleted)→ Order
Order →(OrderConfirmed)→ Notification
Order →(PurchaseConfirmed)→ Member·Settlement·Notification
```

### 시나리오 2 — 입점사 상품 등록·심사

```
[동기]
Catalog → Config API (MD 권한 확인)
Catalog → Vendor API (입점사 유효성)

[비동기]
Catalog →(ProductApproved)→ Notification (취합 배치)
Catalog →(ProductApproved)→ Search
Catalog →(ProductQnaRequested)→ Community
```

### 시나리오 3 — 정산 처리

```
Order →(PurchaseConfirmed)→ Settlement
Order →(ReturnCompleted)→ Settlement (재정산)
Settlement → Order API (분담금 조회)
Settlement → Vendor API (계좌 조회)
Settlement →(SettlementConfirmed)→ Notification
Settlement →(SettlementPaid)→ Notification
```

### 시나리오 4 — 클레임·반품 처리

```
Order →(ClaimReceived)→ Notification (취합 배치)
Order →(PaymentCancelRequested)→ Payment
Payment →(PaymentCancelCompleted)→ Order
Order →(PointRestoreRequested)→ Member
Order →(CouponRestoreRequested)→ Member
Order →(StockRestoreRequested)→ Catalog
Order →(ReturnCompleted)→ Settlement
```

### 전체 이벤트 목록

| 이벤트 | 발행 | 수신 |
|--------|------|------|
| StockReserveRequested | Order | Catalog |
| StockReserveCompleted/Failed | Catalog | Order |
| CouponUseRequested | Order | Member |
| PointUseRequested | Order | Member |
| CouponUseCompleted | Member | Order |
| PointUseCompleted | Member | Order |
| PaymentRequested | Order | Payment |
| PaymentCompleted/Failed | Payment | Order |
| PaymentCancelRequested | Order | Payment |
| PaymentCancelCompleted | Payment | Order |
| OrderConfirmed | Order | Notification |
| PurchaseConfirmed | Order | Member·Settlement·Notification |
| ClaimReceived | Order | Notification (취합) |
| PointRestoreRequested | Order | Member |
| CouponRestoreRequested | Order | Member |
| StockRestoreRequested | Order | Catalog |
| ReturnCompleted | Order | Settlement |
| CancelCompleted | Order | Settlement |
| ExchangeCompleted | Order | Settlement |
| OrderMetricPublished | Order | Vendor |
| ShippingDeadlineExceeded | Order | Notification |
| OrderQnaRequested | Order | Community |
| ReviewCompleted | Community | Order |
| RatingUpdated | Community | Catalog |
| ActivityCompleted | Community | Member |
| ProductQnaRequested | Catalog | Community |
| ProductApproved | Catalog | Notification·Search |
| ProductRejected | Catalog | Notification |
| ProductSoldOut | Catalog | Search·Notification |
| ProductPriceChanged | Catalog | Search·Audit |
| ProductStatusChanged | Catalog | Search·Audit |
| CouponIssued | Promotion | Member |
| EventPriceSoldOut | Promotion | Search·Notification |
| ExhibitionPublished | Promotion | Search |
| SettlementConfirmed | Settlement | Notification |
| SettlementPaid | Settlement | Notification |
| VendorApproved/Rejected | Vendor | Notification |
| VendorGradeChanged | Vendor | Notification |
| VendorContractExpiring | Vendor | Notification |
| VendorSuspended | Vendor | Catalog·Notification |
| VendorTerminated | Vendor | Catalog·Settlement·Notification |
| GradeChanged | Member | Notification |
| PointExpiringSoon | Member | Notification |

---

*Confidential | 3TOP | Bounded Context v1.0 | 2026.06.22*
