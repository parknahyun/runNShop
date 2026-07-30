# 샘플: 도메인·ERD (Design, Domain: Order/Payment, DBML)

```dbml
// 주문결제 Bolt 관련 테이블
Table ord_order {
  id varchar [pk]
  platform_order_id varchar [ref: > ord_platform_order.id]
  vendor_id varchar
  status varchar [note: 'TEMP/PAID/PAYMENT_FAILED/PREPARING/...']
  total_amount int
  created_at timestamp
  updated_at timestamp
  is_deleted boolean [default: false]
}

Table pay_payment {
  id varchar [pk]
  order_id varchar [ref: > ord_order.id]
  pg_token varchar [note: 'PG 발급 토큰, 카드번호 등 원본 저장 금지']
  payment_method varchar [note: 'CARD/VIRTUAL_ACCOUNT/EASY_PAY']
  amount int
  status varchar [note: 'REQUESTED/APPROVED/FAILED']
  approved_at timestamp
  created_at timestamp
}

Table pay_payment_log {
  id varchar [pk]
  payment_id varchar [ref: > pay_payment.id]
  event_type varchar [note: 'REQUEST/APPROVE/FAIL/RETRY']
  raw_response text [note: 'PG 원본 응답(디버깅용), PII 마스킹 처리']
  created_at timestamp
}
```
- **불변식**: `pay_payment.amount == ord_order.total_amount` (금액 불일치 시 승인 거부)
- **PII**: `pay_payment.pg_token`은 원본 카드정보 아님(PG 토큰), 그래도 접근 로그 필수

## Human Review 필요 항목
| # | 항목 | 사유 |
|---|---|---|
| 1 | pay_payment_log의 raw_response PII 마스킹 규칙 | 구체적 마스킹 로직 미정 |

---
근거: 이 샘플에서 신규 작성 — 실제 정책서·ERD 대조 필요.
