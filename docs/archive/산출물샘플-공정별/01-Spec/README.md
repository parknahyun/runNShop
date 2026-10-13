# 샘플 Bolt: 주문결제 — Spec 공정 산출물 (6종)

`AI활용_개발공정_산출물_표준양식_v1.0.md` 기준 실제 작성 샘플. Bolt 정의: **"고객이 주문서
화면에서 결제를 진행하면, PG 승인 결과에 따라 주문이 확정되거나 실패 처리된다."**
Scope: 용어집·제약사항·NFR은 Project 단위(이 샘플에서는 발췌), EARS·GWT·인터페이스명세는 Bolt 단위.

| 파일 | 내용 |
|---|---|
| 01-용어집.md | 용어-정의 표 |
| 02-제약사항.md | 제약ID·카테고리·적용범위 |
| 03-비기능요구(NFR).md | 품질특성별 기준치 |
| 04-기능요구(EARS).md | REQ-ORDER-PAY-001~005 |
| 05-수용기준(GWT).md | AC-ORDER-PAY-001~006 |
| 06-인터페이스명세.md | OpenAPI 3.0 (결제 API) |

## 근거 자료 출처 매핑

| 서술 위치 | 출처 |
|---|---|
| 재고 선점 시점(결제 요청 시) | `runNshop_ai_collaboration_process_v1_0.md` 주요 결정 이력 #3 |
| 2계층 주문 구조 | `runNshop_sdlc_approach_v1_01.md` 4.2절 |
| PG사(토스페이먼츠) | `runNshop_project_management_v1_0.md` Track3 |
| 성능 기준(5초) | `runNshop_project_management_v1_0.md` 9장 |
| NFR 가용성·정합성, EARS/GWT 전체 | 이 샘플에서 신규 작성(원본 근거 없음 — 확인 필요) |

## Human Review 필요 항목

| # | 항목 | 사유 |
|---|---|---|
| 1 | PG 장애 재시도 정책(3회/1초 간격) | 신규 제안, 실제 정책 미확정 (상세는 `03-비기능요구(NFR).md`) |
| 2 | 결제 실패 시 보상(재고 복원) 자동화 범위 | 수동 개입 필요 케이스가 있는지 확인 필요 (상세는 `03-비기능요구(NFR).md`) |
