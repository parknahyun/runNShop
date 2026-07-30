# 샘플: ADR (Design, Domain/Bolt)

> **ADR-011: 재고 선점 시점을 "PG 결제 요청 시"로 확정**
> - Context: 재고 선점을 언제 할지(주문서 진입 시 vs 결제 요청 시) 결정 필요
> - Decision: 결제 요청 시점에 재고 선점
> - Alternatives: (a) 주문서 진입 시 선점 — 이탈률 높아 재고 낭비, (b) 결제 요청 시 선점(채택) — 실구매 의도 확인 후 선점
> - Consequences: 결제 요청 폭주 시 재고 선점 API 부하 집중 → Redis 기반 TTL 락으로 대응

## Human Review 필요 항목
| # | 항목 | 사유 |
|---|---|---|
| 1 | Redis TTL 락 사용 여부 | 이 프로토타입 단계 적용 여부 미정 |

---
근거: `runNshop_ai_collaboration_process_v1_0.md` 주요 결정 이력 #3.
