# 샘플: Proposal 공정 산출물 (Initiative 단위, 6종)

`AI활용_개발공정_산출물_표준양식_v1.0.md` 기준. Scope: 전부 **Initiative**(runNshop 사업 전체) —
Proposal은 Bolt보다 상위 단계라 "주문결제"라는 개별 Bolt는 등장하지 않는다. 각 파일은 실제
원본(`docs_ai/00-proposal/01~06.md`, Initiative 전체 대상 소급 작성본)의 발췌·압축이며,
전문·최신 Human Review 해결 현황은 원본을 따른다.

| 파일 | 원본 |
|---|---|
| 01-문제정의서.md | `docs_ai/00-proposal/01-문제정의서.md` |
| 02-목표KPI.md | `docs_ai/00-proposal/02-목표KPI.md` |
| 03-이해관계자맵.md | `docs_ai/00-proposal/03-이해관계자맵.md` |
| 04-범위(Scope).md | `docs_ai/00-proposal/04-범위(Scope).md` |
| 05-대안비교.md | `docs_ai/00-proposal/05-대안비교.md` |
| 06-리스크가정.md | `docs_ai/00-proposal/06-리스크가정.md` |

## 이 Proposal이 "주문결제" Bolt로 좁혀지는 경로

6종 산출물의 결정이 이 샘플 세트로 이어지는 사슬: **범위(04)**가 주문(Order) 모듈을 1차 구현
대상으로 확정 → **목표·KPI(02)** KR2-3이 "최소 1개 Domain(주문) 기준 Bolt 1회 이상 완주"를
요구 → 주문 모듈 안에서 첫 유스케이스로 **"결제"**를 고른 것은 이 표준양식 실증 세션에서의
예시 선택이며, Proposal 산출물 자체가 개별 Bolt까지 지정하지는 않는다(근거 없는 연결을 지어내지
않음).

## Human Review 필요 항목

| # | 항목 | 사유 |
|---|---|---|
| 1 | 원본 6개 문서의 모든 Human Review가 이 압축본엔 요약만 반영됨 | 최종 Pass/Reject 판단은 원본 문서(`00-proposal/`) 기준으로 해야 함 — 이 폴더는 실증용 발췌본 |
| 2 | "주문결제"를 첫 Bolt로 고른 근거가 Proposal 산출물엔 없음 | 방법론상 정상 — Bolt 선택은 Design/Tasks 단계 소관이며, Proposal은 Domain(주문) 단위까지만 확정 |
