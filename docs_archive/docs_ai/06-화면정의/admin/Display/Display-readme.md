# ⑤ 화면정의서 — admin / Display 도메인

> 폴더 구조·작성 규칙은 [../../README.md](../../README.md)(화면정의서 작성 기준) 참고.
>
> **폴더 구조 변경 (2026-07-09)**: 화면정의서를 `app/domain/feature` 단위로 분리한다
> (`docs_ai/06-화면정의/<app>/<domain>/<feature>.md`). 기존에는 도메인 하나에 화면 3개
> (섹션/템플릿/페이지)를 한 파일(`ADM-020-Display.md`)에 몰아서 담고 있었는데,
> `.spec.md` 내용을 화면정의서에 통합하면서 파일이 커져 기능(feature) 단위로 다시 쪼갰다.
>
> **`.spec.md` 통합 정책 (2026-07-09, 이전 "2세트" 정책 대체)**: 기존에는 `.spec.md`
> (운영 복사본 `apps/.../src/...`)와 그 원본(마스터, `docs_ai/06-화면정의/spec/...`)을
> 별도로 관리했으나, 이제 그 내용을 이 폴더의 feature별 화면정의서 파일로 직접 통합한다.
> `docs_ai/06-화면정의/spec/` 마스터 미러는 삭제했다.
>
> **앱의 "스펙(?)" 버튼 기능 제거 (2026-07-09)**: "추후 검토" 상태였던 그 버튼 기능(`SpecModal`
> 컴포넌트, `/api/spec` 라우트, 각 화면의 버튼/상태)을 admin 앱 전체(70여 개 화면)에서 완전히
> 제거했다. `src/` 안의 운영 복사본 `.spec.md` 파일들(Display 도메인 13개 포함, 다른 도메인은
> 60여 개 더 있음)은 이제 아무 코드에서도 읽지 않는 orphan 파일이다 — 지우지 않고 참고용으로만
> 남겨뒀고, 헤더에 그 사실과 이 화면정의서로의 링크를 남겼다. 완전 삭제 여부는 별도 결정 사항.
>
> 원본: `docs/6. 화면정의/runNshop_screen_definition_v1_1.md` (line 495~509, ADM-020-010
> 부분만 존재, ADM-020-008/007은 API 매핑표에만 등장하고 상세 섹션 자체가 없었음).
> `docs/`는 백업으로 보존하고 여기(`docs_ai/`)에 수정본을 둔다.
>
> 수정 배경: Task Spec 자기완결성 검증(`docs_ai/README.md`) 중 실제 코드와 대조해서 발견한
> 오류를 반영. 원본 문서 자체가 실제 구현과 다른 부분이 있었음(요약카드 개수 등) — 코드가
> 아니라 문서가 낡은 경우였다.

## 이 도메인의 화면 (feature)

파일명 앞 번호는 실제 메뉴(AppShell `product` 메뉴 그룹) 노출 순서와 동일하다 — 목록에서
정렬했을 때 메뉴 순서 그대로 보이게 하기 위함.

| feature 파일 | 화면 ID | 화면 |
|---|---|---|
| [01-Page.md](01-Page.md) | ADM-020-007 | 전시 페이지 관리 |
| [02-Template.md](02-Template.md) | ADM-020-008 | 페이지 템플릿 관리 |
| [03-Section.md](03-Section.md) | ADM-020-010 | 섹션 관리 |

## 도메인 공통 사항

- 상태 배지: 전용 컴포넌트 없이(Page 제외) 기존 `data-product-status` 속성을 재사용한다.
  이 예외가 프로모션 계열만이 아니라 **Display 도메인 화면 3개 전부**(Section/Template/Page)에
  해당한다.
- 관련 정책: `docs/2. 정책서/runNshop_policy_v1_2.md` §3.12(페이지 상태),
  `docs_ai/02-정책서/3.13-섹션종류관리정책.md`, `docs_ai/02-정책서/3.14-템플릿관리정책.md`,
  `docs_ai/02-정책서/19.3-소프트삭제-Display추가.md`
- 관련 도메인정의서: `docs_ai/03-도메인/Catalog-Display.md` (`DOM-CATALOG`)
- 관련 엔티티정의: `docs_ai/05-엔티티정의/cat_display_section_type-교차참조.md`,
  `cat_display_template-교차참조.md`, `cat_display_page-교차참조.md`
