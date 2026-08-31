
# 프로그램 목록 — Payment 도메인

> 상위 문서: [readme.md](readme.md)
> **단계**: 상세설계 (S3) | **문서범위**: Domain (Payment) | **문서종류**: Design

---

## 1. 화면 (SCR)

| PGM-ID | 프로그램명 | 채널 | 화면레이아웃 참조 | 세부UC 참조 | 호출 API | 비고 |
|---|---|---|---|---|---|---|
| SCR-M-012 | 결제수단 관리 | mobile | — | UC-13 | API-019, API-020, API-021 | 마이페이지 하위 |

---

## 2. API

### 2-1. 고객웹 (mobile) API

| PGM-ID | Method | Endpoint | 프로그램명 | 세부UC | 시퀀스 | 호출원 | 상태전이 |
|---|---|---|---|---|---|---|---|
| API-019 | GET | /api/v1/payment-methods | 결제수단 목록 | UC-13 | — | SCR-M-012 | — |
| API-020 | POST | /api/v1/payment-methods | 결제수단 등록 | UC-13 | — | SCR-M-012 | — |
| API-021 | DELETE | /api/v1/payment-methods/{methodId} | 결제수단 삭제 | UC-13 | — | SCR-M-012 | — |
| API-044 | GET | /api/v1/members/me/payments | 결제 이력 조회 (REQ-PAY-020, 본인 결제 건만 최신순) | UC-28(추가예정) | §25(추가예정) | — (신규 SCR 필요, 추가예정) | — |

### 2-2. 어드민 (admin) API

| PGM-ID | Method | Endpoint | 프로그램명 | 세부UC | 시퀀스 | 호출원 | 상태전이 |
|---|---|---|---|---|---|---|---|
| API-045 | GET | /api/admin/v1/payments/search | 결제 검색 (CS, REQ-PAY-021: 상태·기간·주문번호·PG거래번호 필터) | UC-29(추가예정) | §26(추가예정) | — (신규 SCR 필요, 추가예정) | — |
| API-046 | GET | /api/admin/v1/payments/{paymentId}/pg-logs | PG 거래 로그 조회 (REQ-PAY-022: 요청·응답 전체 이력, PII 마스킹) | UC-30(추가예정) | §27(추가예정) | — (신규 SCR 필요, 추가예정) | — |

---

## 3. 컨슈머 (CSM)

> Order가 발행하는 이벤트를 Payment가 수신·구현하는 컨슈머. (Payment가 발행하는 이벤트를
> Order가 수신하는 컨슈머는 [order.md](order.md) §3 참조)

| PGM-ID | 프로그램명 | 트리거(이벤트) | 발행 도메인 | 수신 도메인 | 세부UC | 시퀀스 | 내부 호출 | 상태전이 |
|---|---|---|---|---|---|---|---|---|
| CSM-003 | 주문취소 PG 환불 요청 | ORDER_CANCELLED | Order | Payment | — | §21(추가예정) | PGApi.refund | PAID→REFUNDED |
| CSM-004 | 클레임완료 부분/전체 환불 | CLAIM_COMPLETED | Order | Payment | — | §22(추가예정) | PGApi.partialRefund | PAID→PARTIAL_REFUNDED/REFUNDED |

---

## 4. 배치 (BAT)

Payment 도메인 소유 배치 없음 (배송·주문 관련 배치 4건은 [order.md](order.md) §4 참조).

---

## 근거

집계·정합성 검증·전체 근거는 [readme.md](readme.md) 참조.
