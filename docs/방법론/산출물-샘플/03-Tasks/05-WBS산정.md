# 샘플: WBS(하위)·산정 (Tasks, Bolt)

| ID | Task | 담당 | 예상시간 | 선행 | DoD 체크 |
|---|---|---|---|---|---|
| T1 | PaymentController/Service 스캐폴딩 | BE | 1h | - | 코드품질 |
| T2 | Mock PG 어댑터 구현(성공/실패/타임아웃 응답) | BE | 2h | T1 | 코드품질, 보안 |
| T3 | 재고선점 API 연동(StockService 호출) | BE | 2h | T1 | 코드품질 |
| T4 | 상태전이(TEMP→PAID/PAYMENT_FAILED) 로직 | BE | 2h | T2, T3 | 코드품질, 테스트 |
| T5 | 결제 API Mock JSON 작성 | BE | 1h | T1 | 코드품질 |
| T6 | 결제수단 선택 UI + API 연동(FE) | FE | 3h | T5 | 코드품질 |
| T7 | 로딩/완료/실패 화면 처리(FE) | FE | 2h | T6 | 코드품질 |
| T8 | 단위테스트(GWT 6개 시나리오) | BE | 2h | T4 | 테스트 |
| T9 | 통합테스트(FE-BE 연동) | FE+BE | 2h | T7, T8 | 테스트 |

합계: BE 10h, FE 5h, 공통 2h → **총 17h(약 2일, 반나절 Time-box 기준 부록A 준수)**
병렬 가능: T5(Mock) 완료 즉시 T6(FE) 착수 가능(FE 블로킹 방지 원칙)

## Human Review 필요 항목
| # | 항목 | 사유 |
|---|---|---|
| 1 | WBS 산정치(17h)의 실측 검증 | 아직 실제 구현 전 추정치 — KR2-3(Bolt 완주) 완료 후 실측 대비 오차 확인 필요 |

---
근거: `AI활용_개발공정_지침서_v2.2` 부록 A(WBS Time-box 기준).
