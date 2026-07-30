# ③ 도메인정의서 — Catalog 도메인 Display(전시) 하위 스코프 보완

> 원본: `docs/3. 도메인/runNshop_bounded_context_v1_0.md` §4 Catalog (line 247-341).
> `docs/`는 백업으로 보존, 이 파일은 그 위에 빠진 부분만 추가하는 보완본이다 (전체 재작성 아님).
>
> 수정 배경: BE Task Spec(`TSK-DPL-SEC-001-BE`) 검증 중 `source_domain: DOM-CATALOG`를 원본에서
> 찾을 수 없었음. 원인은 ERD에 2026-07-06 `cat_display_*` 테이블 9종이 추가됐는데(`decision_log`
> 2026-07-06 항목 참조), 도메인정의서 쪽 "소유 데이터"에는 그 반영이 안 됐던 것 — 현행화 누락.
> 하네스 표준양식(`x. 하네스/표준양식/03. 도메인정의서 하네스 표준양식`)이 요구하는 `DOM-{name}` ID
> 표기법도 원본엔 아직 없어서 함께 반영한다.

## 도메인 ID

```
DOM-CATALOG   (원본 도메인명: "Catalog", §4)
```

## 소유 데이터 — Display(전시) 하위 스코프 추가

원본 §4 "소유 데이터" 표(Product/SKU/Category/Brand/ProductPrice/ProductExposure)에 아래 9개
엔티티를 추가한다. 전부 ERD에 이미 존재(`docs/5. 엔티티정의/runNshop_erd_v1_0.md`), 테이블 접두사
`cat_display_*`로 Catalog 소유임이 표시돼 있었으나 도메인정의서 문서에는 목록화가 안 돼 있었다.

| 엔티티 | 설명 | ERD 위치 |
|--------|------|---------|
| `DisplayCategory` (`cat_display_category`) | 전시 카테고리 (표준 카테고리와 별개, 화면 노출용) | ERD:605 |
| `DisplaySectionType` (`cat_display_section_type`) | 섹션종류 마스터 (배너/상품그리드 등 타입 정의) | ERD:1105 |
| `DisplaySectionField` (`cat_display_section_field`) | 섹션종류별 필드 스키마 | ERD:1135 |
| `DisplayTemplate` (`cat_display_template`) | 전시 템플릿 (섹션 구성 묶음) | ERD:970 |
| `DisplayArea` (`cat_display_area`) | 템플릿의 영역(섹션 배치) | ERD:990 |
| `DisplayContent` (`cat_display_content`) | 영역별 콘텐츠 데이터 | ERD:1011 |
| `DisplayPage` (`cat_display_page`) | 전시 페이지 (템플릿을 복사해 생성) | ERD:1035 |
| `DisplayPageArea` (`cat_display_page_area`) | 페이지의 영역(템플릿 영역을 복사) | ERD:1063 |
| `DisplayPageContentItem` | 페이지 영역별 콘텐츠 아이템 | ERD:1084 |
| `DisplayPageSchedule` (`cat_display_page_schedule`) | 페이지 예약 전환 스케줄 | ERD:1160 |

## 도메인 경계 — 추가 조항

**Catalog가 하는 것 (추가)**
- 전시 섹션종류·템플릿·페이지의 등록·수정·상태 관리 (어드민 "전시 관리" 화면 일체)
- 템플릿→페이지 복사 원칙 유지 (템플릿 수정이 기존 페이지에 전파되지 않음)
- 페이지 예약(SCHEDULED) 자동 전환 배치 실행 (`DisplayPageScheduleBatch`, 원본 §4 배치 목록에
  이미 있었음 — line 339)

**Catalog가 하지 않는 것 (추가)**
- 프로모션 대상 상품 선정 로직 → Promotion (전시 템플릿은 프로모션 콘텐츠를 담을 수 있지만
  프로모션 자체의 대상/기간/할인 로직은 소유하지 않음)

## 관련 정책 참조

- 전시 페이지 상태 정책: `docs/2. 정책서/runNshop_policy_v1_2.md` §3.12
- 섹션종류 관리 정책: `docs_ai/02-정책서/3.13-섹션종류관리정책.md` (신설 — 원본엔 없었음)
- 템플릿 관리 정책: `docs_ai/02-정책서/3.14-템플릿관리정책.md` (신설 — 원본엔 없었음)
- 소프트 삭제(병행 패턴): `docs_ai/02-정책서/19.3-소프트삭제-Display추가.md`

※ "물리적 DELETE 금지" 등 기술 제약은 TC-ID 체계를 새로 만들지 않기로 결정 — Task Spec에서
요구사항 FR-COM-005/정책서 §19.1/ERD 설계원칙을 직접 인용한다(`docs_ai/09-task-spec/
TSK-DPL-SEC-001-BE-v2.md`, `TSK-DPL-001-BE-v2.md` 참고).
