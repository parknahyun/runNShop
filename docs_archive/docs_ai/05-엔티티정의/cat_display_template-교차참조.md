# ⑥ 엔티티정의(ERD) — cat_display_template / cat_display_area 교차참조 보완

> 원본: `docs/5. 엔티티정의/runNshop_erd_v1_0.md:970-1009`. 컬럼·제약조건은 정확하지만,
> `area_type`(FIXED/FLEXIBLE)·`cat_display_content` 구조가 현재 FE Mock(`TemplateSection`
> 3필드)보다 세분화돼 있어 **아직 결정되지 않은 구조 차이**가 있다 (아래 참조). 이 파일은
> 그 사실을 명시하고 역참조만 추가한다 — ERD 내용을 바꾸지 않는다.

## `cat_display_template` / `cat_display_area` 역참조

| 이 테이블을 참조하는 문서 | 내용 |
|---|---|
| 정책서 §3.14 | `docs_ai/02-정책서/3.14-템플릿관리정책.md` — 사용 중 템플릿 수정/삭제 금지, 복사 원칙 |
| 정책서 §19.3 | `docs_ai/02-정책서/19.3-소프트삭제-Display추가.md` |
| 도메인정의서 | `docs_ai/03-도메인/Catalog-Display.md` — Catalog 도메인 소유, `DOM-CATALOG` |
| 화면정의서 | `docs_ai/06-화면정의/admin/Display/02-Template.md` (ADM-020-008 템플릿 관리) |
| Task Spec | `docs_ai/09-task-spec/TSK-ADM-020-008-FE-v2.md` (FE) |

## ⚠ 구조 불일치 (미해결, ERD를 신뢰 소스로 확정하기 전 주의)

- ERD: `cat_display_area`는 `area_code`, `area_type`(FIXED/FLEXIBLE 2종) 컬럼을 가지고,
  별도 `cat_display_content` 테이블에 영역별 콘텐츠 데이터를 분리 저장한다.
- FE Mock: `template/mockData.ts`의 `TemplateSection`은 `sectionName`/`sectionType`/`sortOrder`
  3필드뿐 — `area_type`(FIXED/FLEXIBLE) 구분이나 별도 콘텐츠 테이블 개념이 없다.
- 결정 필요: "ERD 구조로 FE Mock을 맞출지" vs "ERD를 Mock 수준으로 단순화할지" — 원본 하네스
  샘플(`docs/x. 하네스/샘플/09-DPL...`)에 이미 같은 경고가 있었고 아직 미결정 상태다.
  이 문서(및 정책서 §3.14, 화면정의서 보완본)는 모두 **현재 Mock 기준**으로 작성했다 — 결정이
  나면 세 문서를 다시 맞춰야 한다.

## Display 도메인 문서 상호보완 상태 갱신 (2026-07-09)

| 화면 | 정책서 | 도메인정의서 | 화면정의서 | ERD |
|---|---|---|---|---|
| 섹션종류 (ADM-020-010) | ✅ §3.13 | ✅ | ✅ | ✅ (역참조만) |
| 템플릿 (ADM-020-008) | ✅ §3.14 | ✅ (Display 공통 스코프에 포함) | ✅ | ✅ (역참조만, 구조 불일치 미해결 명시) |
