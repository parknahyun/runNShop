# 05-수용기준(GWT) — 인덱스

| 항목 | 내용 |
|---|---|
| 산출물 유형 | Spec — 수용기준 (Given/When/Then) |
| Scope | Bolt 단위 |
| 상태 | 1차 파트 완료 (Order + Payment) |
| 작성일 | 2026-07-30 |

---

## 파일 구조

```
05-수용기준(GWT)/
├── README.md              ← 이 파일 (인덱스)
├── 01-Order-Cart.md       ← Order 도메인 — 장바구니·주문서
├── 01-Order-OrderPayment.md ← Order 도메인 — 주문결제·연동
├── 01-Order-Delivery.md   ← Order 도메인 — 배송관리
├── 01-Order-Claim.md      ← Order 도메인 — 클레임처리
└── 04-Payment.md          ← Payment 도메인
```

---

## 도메인별 현황

| # | 도메인 | 파일 | EARS 수 | GWT 수 | 커버리지 | 상태 |
|---|---|---|---|---|---|---|
| 1 | Order — Cart | 01-Order-Cart.md | 28 | 47 | 100% | ✅ 완료 |
| 2 | Order — OrderPayment | 01-Order-OrderPayment.md | 25 | 33 | 100% | ✅ 완료 |
| 3 | Order — Delivery | 01-Order-Delivery.md | 23 | 28 | 100% | ✅ 완료 |
| 4 | Order — Claim | 01-Order-Claim.md | 27 | 33 | 100% | ✅ 완료 |
| 5 | Payment | 04-Payment.md | 33 | 39 | 100% | ✅ 완료 |
| | **1차 파트 합계** | | **136** | **180** | **100%** | |

---

## 미작성 (2차 파트 이후)

| # | 도메인 | 예정 파일 | 비고 |
|---|---|---|---|
| 6 | Catalog | 02-Catalog.md | 2차 파트 |
| 7 | Member | 03-Member.md | 2차 파트 |
| 8 | Promotion | 05-Promotion.md | 3차 파트 |
| 9 | Settlement | 06-Settlement.md | 3차 파트 |
| 10 | Vendor | 07-Vendor.md | 3차 파트 |
| 11 | Notification | 08-Notification.md | 4차 파트 |
| 12 | Community | 09-Community.md | 4차 파트 |
| 13 | Search | 10-Search.md | 4차 파트 |
| 14 | Config | 11-Config.md | 4차 파트 |
| 15 | Audit | 12-Audit.md | 4차 파트 |

---

## ID 체계

- **Order 도메인**: `AC-ORD-{SEQ}` (001~141)
- **Payment 도메인**: `AC-PAY-{SEQ}` (001~039)

---

## 카테고리별 분포

| 카테고리 | Order | Payment | 합계 | 비율 |
|---|---|---|---|---|
| 정상 | 83 | 27 | 110 | 61.1% |
| 경계값 | 23 | 3 | 26 | 14.4% |
| 예외 | 35 | 9 | 44 | 24.4% |
| **합계** | **141** | **39** | **180** | 100% |

> 2026-07-30 정정: 기존 표(Order 정상76/예외37)가 5개 파일 요약(Cart 19·OrderPayment 21·
> Delivery 19·Claim 22 = 정상 81 / 예외 11+8+6+7 = 32)과 어긋나 있던 걸 재계산해 수정했다.
> 경계값(20)은 원래도 정확했다.

---

## 작성 규칙 요약

- EARS 요구사항 1개당 최소 1개 GWT 시나리오 도출
- 카테고리: 정상 / 경계값 / 예외
- 대응 EARS ID 필수 명시 (추적성)
- EARS 커버리지 100% 필수
- 파일 분리: EARS 구조와 동일 (Order는 Cart/OrderPayment/Delivery/Claim 분리)

---

## 변경 이력

| 버전 | 일자 | 변경 내용 |
|---|---|---|
| v1.0 | 2026-07-30 | 1차 파트 작성 완료 — Order(100 EARS → 133 GWT) + Payment(33 EARS → 39 GWT) |
| v1.1 | 2026-07-30 | 검토 피드백 반영: 타임아웃 3:00 경계, 교환 D+10 경계 추가 → 총 174 GWT |
| v1.1 | 2026-07-30 | 카테고리별 분포 표 정정 — Order 정상/예외 집계 오류(76/37→81/32) 수정, 5개 파일 요약과 재대조 |
| v1.2 | 2026-07-31 | ID 중복 정정 — 신규 항목 2건이 각각 AC-ORD-074(Delivery 기존 출고처리와 충돌)·AC-ORD-134로 잘못 번호 부여돼 있던 것을 AC-ORD-134·135로 재배정, ID 체계 범위 001~134→001~135 정정 |
| v1.3 | 2026-07-31 | REQ-ORD-106(수량구간할인 미충족 안내) 신규 반영 — Cart 26 EARS/43 GWT로 갱신, 1차 파트 합계 134 EARS/176 GWT, ID 체계 001~137 |
| v1.4 | 2026-07-31 | REQ-ORD-107·108(바로구매) 신규 반영 — Cart 28 EARS/47 GWT로 갱신, 1차 파트 합계 136 EARS/180 GWT, ID 체계 001~141 |
