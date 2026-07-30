# ⑥ 엔티티정의(ERD) — cat_display_section_type / cat_display_section_field 교차참조 보완

> 원본: `docs/5. 엔티티정의/runNshop_erd_v1_0.md:1105-1158`. 테이블 정의·제약조건 자체는
> 정확해서(BE Task Spec 검증 통과) 내용을 바꾸지 않는다. 이 파일은 **역참조 링크만 추가**한다 —
> 정책서·도메인정의서·화면정의서가 이 테이블을 어떻게 쓰는지 ERD에서도 바로 찾아갈 수 있게.

> "작업지시서가 만들어질 때까진 정책서·도메인·화면정의·엔티티정의가 상호보완해야 한다"는 원칙에
> 따라, 나머지 3개 문서는 이미 Display를 반영했는데 ERD 쪽에서 그 반대 방향(이 테이블이 어느
> 정책/도메인/화면에 쓰이는지) 역참조가 없었던 게 마지막 빈 칸이었다.

## `cat_display_section_type` / `cat_display_section_field` 역참조

| 이 테이블을 참조하는 문서 | 내용 |
|---|---|
| 정책서 §3.13 | `docs_ai/02-정책서/3.13-섹션종류관리정책.md` — sectionCode/fieldKey 불변, 사용 중 폐기 차단 |
| 정책서 §19.3 | `docs_ai/02-정책서/19.3-소프트삭제-Display추가.md` — `is_deleted`+`status` 병행 근거 |
| 도메인정의서 | `docs_ai/03-도메인/Catalog-Display.md` — Catalog 도메인 소유, `DOM-CATALOG` |
| 화면정의서 | `docs_ai/06-화면정의/admin/Display/03-Section.md` (ADM-020-010 섹션종류 관리) |
| Task Spec | `docs_ai/09-task-spec/TSK-ADM-020-010-FE-v2.md` (FE),
             `docs_ai/09-task-spec/TSK-DPL-SEC-001-BE-v2.md` (BE) |

## Display 도메인 4개 문서 상호보완 상태 (2026-07-09 기준)

| 문서 | 상태 |
|---|---|
| ② 정책서 | ✅ §3.13(신설) + §19.3(행 추가) |
| ③ 도메인정의서 | ✅ Catalog-Display.md(신설, DOM-CATALOG 정의) |
| ⑤ 화면정의서 | ✅ `admin/Display/03-Section.md`(.spec.md 내용 통합) |
| ⑥ 엔티티정의(ERD) | ✅ 원본 내용 정확함 확인, 역참조만 이 파일로 보완 |

Section 화면 기준으로는 4개 문서가 서로 참조 가능한 상태가 됐다. Template 화면(ADM-020-008)도
같은 방식으로 도메인·정책 쪽 역참조를 마저 채워야 완결된다 — 정책서 §3.13은 섹션종류만 다루고
있고, 템플릿의 "사용 중이면 수정·삭제 금지"(decision_log 2026-06-30) 규칙은 아직 정책서에
정식 섹션이 없다.
