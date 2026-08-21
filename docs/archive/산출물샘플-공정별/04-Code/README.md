# 샘플 Bolt: 주문결제 — Code 공정 산출물 (5종)

`AI활용_개발공정_산출물_표준양식_v1.0.md` 기준. 입력: `../02-Design/`(클래스설계·시퀀스),
`../01-Spec/`(EARS/GWT/인터페이스명세). 프로토타입 단계 제약(`.kiro/steering/coding-standards.md`,
`mock-data-rules.md`) 준수 — 실 DB 연동 없이 MockLoader로 응답.

| 파일 | 내용 |
|---|---|
| 01-코드구현.md | 실제 Kotlin 코드(Controller/Service/DTO) + Mock JSON |
| 02-자동검증.md | 컴파일/Lint/SAST 결과 |
| 03-단위테스트실행결과.md | GWT 6개 대응 테스트케이스·커버리지 |
| 04-클래스설계(현행화).md | Design 대비 구현 diff |
| 05-도메인ERD상태머신(현행화).md | Design 대비 변경 없음 확인 |

## 근거 자료 출처 매핑

| 항목 | 출처 |
|---|---|
| Controller→Service→MockLoader 패턴, 파일 위치 | `.kiro/steering/coding-standards.md`, `mock-data-rules.md` |
| 프로토타입 단계 제약(실 DB 미연동) | `AI활용_개발공정_지침서_v2.2` 6.5절, `runNshop_policy_v1_2.md` 20장 |

## Human Review 필요 항목

| # | 항목 | 사유 |
|---|---|---|
| 1 | 커버리지 72% (목표 80% 미달) | 상세는 `03-단위테스트실행결과.md` |
| 2 | 중복 결제 거부(멱등성) 로직 미구현 | 상세는 `03-단위테스트실행결과.md` |
| 3 | 프로토타입 단순화 범위 | 상세는 `01-코드구현.md` |
