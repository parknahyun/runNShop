# 04-기능요구사항 (EARS) — 인덱스

| 항목 | 내용 |
|---|---|
| 상태 | 1차 파트(거래: Order+Payment) 완료, 2~4차 미착수 |
| 전체 도메인 수 | 12개 |
| 파트 순서 | 1차 거래 → 2차 상품 → 3차 고객 → 4차 파트너운영 |
| 작성 기준 | 도메인기능표 390건 → EARS 5패턴 변환 |
| 표준양식 | `REQ-{DOM}-{SEQ}` + 패턴 + 채널 + 요구사항 문장 + 출처 + 우선순위(P1/P2/P3) |

> **파일 분리 방침**: 도메인 내 업무그룹이 크고 BC(Bounded Context) 이슈가 많은 도메인은
> `{순번}-{도메인}-{업무그룹}.md`로 분리한다. 산출물 ID는 도메인 단위로 하나
> (예: `SPEC-EARS-ORDER-001`)이며, 파일 분리는 물리적 편의일 뿐 논리적 산출물 분리가 아니다.
> REQ 번호는 도메인 내 전 파일에서 연속·고유하다.
>
> **분리 대상 도메인**: Order(확정), Catalog(예정), Promotion(예정)

---

## 파트별 진행 현황

### 1차 파트 — 거래 (Order + Payment)

| 도메인 | 파일 | 영역 | REQ 수 | 상태 |
|---|---|---|---|---|
| Order | `01-Order-Cart.md` | 장바구니 + 주문서 | 25 | DRAFT-v2 |
| Order | `01-Order-OrderPayment.md` | 주문결제 + 연동 | 25 | DRAFT-v2 |
| Order | `01-Order-Delivery.md` | 배송관리 | 23 | DRAFT-v2 |
| Order | `01-Order-Claim.md` | 클레임처리 | 27 | DRAFT-v2 |
| **Order 소계** | | | **100** | |
| Payment | `04-Payment.md` | 전체 | 33 | DRAFT-v1.2 |
| **1차 파트 합계** | | | **133** | |

### 2~4차 파트 — 미착수

| 파트 | 도메인 | 파일 | 비고 |
|---|---|---|---|
| 2차 상품 | Catalog | — | 분리 예정 (상품등록/전시/재고 등) |
| 2차 상품 | Promotion | — | 분리 예정 (쿠폰/행사가/수량할인 등) |
| 2차 상품 | Search | — | 단일 파일 예상 |
| 3차 고객 | Member | — | |
| 3차 고객 | Community | — | |
| 3차 고객 | Notification | — | |
| 4차 파트너운영 | Vendor | — | |
| 4차 파트너운영 | Settlement | — | |
| 4차 파트너운영 | Config | — | |
| 4차 파트너운영 | Audit | — | |

---

## 파일 네이밍 규칙

```
{도메인순번}-{도메인명}.md              ← 단일 파일 도메인
{도메인순번}-{도메인명}-{업무그룹}.md    ← 분리 도메인
```

| 순번 | 도메인 | 파일(들) |
|---|---|---|
| 01 | Order | `01-Order-Cart.md`, `01-Order-OrderPayment.md`, `01-Order-Delivery.md`, `01-Order-Claim.md` |
| 02 | Catalog | (미착수, 분리 예정) |
| 03 | Member | (미착수) |
| 04 | Payment | `04-Payment.md` |
| 05 | Promotion | (미착수, 분리 예정) |
| 06 | Settlement | (미착수) |
| 07 | Vendor | (미착수) |
| 08 | Notification | (미착수) |
| 09 | Community | (미착수) |
| 10 | Search | (미착수) |
| 11 | Config | (미착수) |
| 12 | Audit | (미착수) |

---

## 도메인 간 이벤트 연동 맵 (1차 파트)

| 발행 도메인 | 이벤트 | 구독 도메인 | Order 측 REQ | Payment 측 REQ |
|---|---|---|---|---|
| Order | 결제요청 | Payment | REQ-ORD-001, 093 | REQ-PAY-001 |
| Payment | 결제완료 | Order | REQ-ORD-055 | REQ-PAY-002 |
| Payment | 결제실패 | Order | REQ-ORD-095 | REQ-PAY-003, 005 |
| Order | 결제취소요청 | Payment | REQ-ORD-006 | REQ-PAY-011 |
| Order | 승인취소 | Payment | REQ-ORD-096 | REQ-PAY-036 |
| Order | 부분반품 | Payment | REQ-ORD-092 | REQ-PAY-012 |
| Order | 추가배송비결제 | Payment | REQ-ORD-052, 098 | REQ-PAY-015 |
| Order | 재고선점요청 | Catalog | REQ-ORD-057 | — |
| Catalog | 재고선점실패 | Order | REQ-ORD-058 | — |
| Order | 알림발송요청 | Notification | REQ-ORD-067, 079 | — |

---

## 미해결 사항 (전 파트 공통)

**전 항목 해결 완료(2026-07-30)** — HR#3(2계층 주문구조)·CONS-014(도서산간)·CONS-005(미지원 결제수단)·
클레임기한 중첩 4건 모두 해결. 상세 내역은 `CHANGELOG.md` 참고.

---

## 변경 이력

상세 이력은 `CHANGELOG.md` 참고. 최근 변경: Human Review 전 항목 해결, Cart/OrderPayment/Delivery에
신규 요구사항(097~105) 추가, Payment 정리(010/029/030 삭제) — Order 100개, Payment 33개, 총합 133개.
