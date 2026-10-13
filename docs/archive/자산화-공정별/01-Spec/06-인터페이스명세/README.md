# 06-인터페이스명세 — 인덱스

| 항목 | 내용 |
|---|---|
| 산출물 유형 | Spec — 인터페이스 명세 |
| Scope | Bolt 단위 |
| 상태 | 1차 파트 초안 완료 (Order + Payment) |
| 작성일 | 2026-07-30 |

---

## 파일 구조

```
06-인터페이스명세/
├── README.md        ← 이 파일
├── 01-Order.md      ← Order 도메인 (13개 영역, ~40 endpoints)
└── 04-Payment.md    ← Payment 도메인 (5개 영역, ~15 endpoints)
```

---

## 도메인별 현황

| # | 도메인 | 파일 | Endpoints | Error Codes | 상태 |
|---|---|---|---|---|---|
| 1 | Order | 01-Order.md | ~40 | 18 | ✅ 초안 |
| 2 | Payment | 04-Payment.md | ~15 | 11 | ✅ 초안 |

---

## URL Path Prefix 규칙

| 앱 | Path Prefix | 인증 |
|---|---|---|
| 고객웹 | `/api/v1/**` | Bearer token + X-Member-Id |
| 어드민 | `/api/admin/v1/**` | Bearer token (admin) |
| 입점사 | `/api/partner/v1/**` | Bearer token + X-Vendor-Id |

---

## 미작성 (2차 파트 이후)

| # | 도메인 | 예정 파일 |
|---|---|---|
| 3 | Catalog | 02-Catalog.md |
| 4 | Member | 03-Member.md |
| 5 | Promotion | 05-Promotion.md |
| 6 | Settlement | 06-Settlement.md |
| 7 | Vendor | 07-Vendor.md |
| 8 | Notification | 08-Notification.md |
| 9 | Community | 09-Community.md |
| 10 | Search | 10-Search.md |
| 11 | Config | 11-Config.md |
| 12 | Audit | 12-Audit.md |

---

## 변경 이력

| 버전 | 일자 | 변경 내용 |
|---|---|---|
| v1.0 | 2026-07-30 | 1차 파트 초안 — Order + Payment |
