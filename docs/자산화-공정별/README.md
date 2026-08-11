# docs_ai

`docs/`는 백업(원본 SDLC 산출물, 0~8번)으로 보존한다. 여기(`docs_ai/`)는 "09. Task Spec" 하네스가
실제로 AI 코딩의 유일한 입력으로 충분한지 검증하고, 검증된 형식대로 산출물을 재작업하는 새 작업 공간이다.

## 폴더 구조

```
docs_ai/
  00-proposal/       # Proposal 공정 소급 작성 (방법론 v2.2 신설 공정, docs/ 원본엔 없음 — 상세는 폴더 내 README)
  02-정책서/         # ② 정책서 보완 (§3.13 신설, §19.3 표에 빠진 행 추가 등, 누락분만)
  03-도메인/         # ③ 도메인정의서 보완 (Catalog의 Display 하위 스코프 등, 누락분만)
  05-엔티티정의/     # ⑥ ERD 역참조 보완 (내용은 정확, 다른 문서로의 링크만 추가)
  06-화면정의/       # ⑤ 화면정의서 수정본, app/domain/feature 단위로 분리 (예: admin/Display/03-Section.md)
                     #    .spec.md 내용은 여기로 통합됨 (2026-07-09, 아래 로그 참고)
  09-표준양식/       # ⑨ Task Spec 표준양식 수정본
  09-task-spec/      # ⑨ Task Spec 작성본 (v1=원본 그대로 옮김, v2=수정본)
```

방법론 지침서·프롬프트 라이브러리·산출물 표준양식/작성가이드·산출물 샘플 등 공정 횡단 자산은
`docs_ai/` 밖, 프로젝트 루트의 **`docs_method/`**로 이동했다(2026-07-28) — `docs/`(원본 백업)·
`docs_ai/`(재작업 공간)와 대등한 레벨의 세 번째 최상위 폴더다. 상세 구조는 `docs_method/`
자체를 참고.

**현재 위치 안내 (2026-07-28)**: 이 폴더 자체가 `docs_ai/` → `docs/자산화/`로 이동했고,
그 중 `00-proposal/`만 여기 남아있다. 위 폴더 구조에 있는 **02-정책서·03-도메인·05-엔티티정의·
06-화면정의·09-표준양식·09-task-spec은 `docs_archive/docs_ai/`로 옮겨졌다** — 아래 로그의
경로 표기는 당시 기준이며, 최신 위치는 이 안내를 따른다.

**참조 대상과의 관계 (사업 오너 확인, 2026-07-28)**: 아래는 전부 **참조용일 뿐, 앞으로 자산화
작업의 가이드로 쓰지 않는다** — "이미 있던 내용을 확인할 때"만 참고하고, "어떻게 작성해야
하는가"는 항상 `docs/방법론/`(AI활용 개발공정 지침서·표준양식·작성가이드)을 따른다.

- `docs_archive/docs/` — 원본 9대공정 백업
- `docs_archive/docs_ai/` — 옛 자산화 산출물(02~09)
- `apps/` — 실제 프론트엔드 코드(admin·partner·mobile)
- `api/` — 실제 백엔드 코드
- `.kiro/steering/` — 코딩 컨벤션·스티어링 문서

이 원칙은 이 세션 초반부터 있던 "9대공정 산출물은 참고자료일 뿐"이라는 결론을 코드·스티어링
문서까지 확장한 것과 일관된다.

검증 중 Task Spec만 고치고 원천 문서(화면정의서)는 안 고친 적이 있었음 — Task Spec 원칙("설계가
바뀌면 원천 문서를 고친다")을 지키려면 gap을 찾을 때마다 **원천 쪽도 같이 docs_ai에 반영**해야 한다.

## 진행 중: Task Spec 자기완결성 검증

`docs/x. 하네스/샘플/09-DPL. Task Spec 하네스 샘플 (Display) v1 0.md`의 샘플 2
(`TSK-ADM-020-010-FE`, 섹션종류 관리 화면)를 `09-task-spec/TSK-ADM-020-010-FE.md`로 옮겨와서,
**이 Task Spec 문서 하나만 보고** 실제 구현체(`apps/runNshop-admin/src/display/section/`)를
재구성할 수 있는지 검증한다 (0~8번 원본이나 화면정의서를 참조하지 않고).

검증 결과는 이 문서 하단에 기록한다.

## 검증 결과 (2026-07-09)

`TSK-ADM-020-010-FE.md` 하나만 놓고 실제 코드(`section/SectionTypePage.tsx`, `SectionTypeDetail.tsx`,
`mockData.ts`, `tabs/FieldsTab.tsx`, `tabs/AddFieldModal.tsx`)와 줄 단위로 대조. **결론: 부족하다.**
파일 목록·API 경로 같은 구조적 지시는 정확했지만, 실제 화면의 세부 사양과는 5곳에서 어긋났다:

| # | Task Spec 지시 | 실제 코드 | 문제 |
|---|---|---|---|
| 1 | 요약카드 "전체/활성/비활성" 3개 | 실제는 4개 (전체/활성/비활성/**폐기**) | Task Spec만 보고 만들면 폐기 카드가 빠짐 |
| 2 | 테이블 컬럼에 "대분류" 포함, "설명" 없음 | 실제 테이블엔 "설명" 컬럼 있고 "대분류"(type) 컬럼은 아예 없음 (데이터엔 있지만 미노출) | 컬럼 구성이 반대로 틀림 |
| 3 | 필드 타입 "노출선택" | 실제 라벨은 "선택" | 사소하지만 리터럴 불일치 |
| 4 | AddFieldModal 사양에 없음 | "선택" 타입일 때 `common/commonCode`의 `getGroupOptions()`를 불러와 그룹코드 드롭다운을 채움 | **구조적 의존성이 Task Spec에 전혀 언급 안 됨** — 이것만 보고 만들면 이 연동을 놓친다 |
| 5 | 배지 색상 구현 방식 언급 없음 | `data-product-status`를 재사용(ACTIVE→ON_SALE 등으로 매핑) — 전용 StatusBadge 파일 없음 | 컴포넌트 가이드의 "프로모션 계열 예외"와 같은 패턴이 Display 도메인에도 있는데 Task Spec엔 안 적혀 있음 |

부가로: 실제 `SectionTypeDetail.tsx`는 `DetailShell`을 쓰지 않는 옛 방식인데, Task Spec은 이에 대해
아무 지시가 없어 지금 코드 하네스(`scaffold-screen.js`)로 새로 만들면 오히려 최신 패턴(DetailShell)으로
만들어져 기존 화면과 미묘하게 달라질 수 있다.

**시사점**: 09 Task Spec 표준양식 자체는 구조(파일 목록·API·검증 항목)를 잡는 데는 유효하지만,
① 세부 UI 사양(정확한 컬럼/카드 구성)과 ② 화면 간 공유되는 숨은 의존성(commonCode 같은)은
지금 양식만으로는 빠지기 쉽다. 다음 버전에서는 "화면정의서 6개 스펙 파일" 같은 원본을 완전히
대체하기보다, 위 두 항목(정확한 필드 목록 diff, 크로스 도메인 의존성 목록)을 Task Spec에 명시적으로
추가하는 쪽으로 표준양식을 보완해야 재작업 시 안전하다.

## 표준양식 보완 + 재검증 (2026-07-09)

`09-표준양식/09. Task Spec 하네스 표준양식 v1_1.md`를 만들어 v1.0에 3가지를 추가했다:
1. 헤더에 `cross_module_deps` 필드 신설 (빈 배열도 "(없음)"으로 명시, 누락과 구분)
2. FE 구현 순서 1번에 "UI 구성요소 정확한 목록"을 요구 — 필터 항목/요약카드/테이블 컬럼을
   화면정의서에서 표 그대로 옮겨적도록 강제 (요약 서술 금지)
3. 상태 표시 구현 방식(전용 배지 파일 신규 vs 기존 속성 재사용) 명시를 구현 순서에 포함

이 v1.1 양식으로 `09-task-spec/TSK-ADM-020-010-FE-v2.md`를 다시 작성하고, 실제 코드와 재대조:

| # | v1 문제 | v2 반영 | 재검증 결과 |
|---|---|---|---|
| 1 | 요약카드 개수 불일치 | "정확히 4개: 전체/활성/비활성/폐기" 명시 | ✅ 일치 |
| 2 | 테이블 컬럼 반대로 틀림 | "정확히 7개" 목록 + "대분류 컬럼 없음" 명시 | ✅ 일치 |
| 3 | 필드 타입 라벨 오차 | "선택 (노출선택 아님)" 명시 | ✅ 일치 |
| 4 | commonCode 의존성 누락 | `cross_module_deps`에 `getGroupOptions()` 명시 | ✅ 일치 |
| 5 | 배지 구현방식 누락 | `cross_module_deps`에 data-product-status 재사용 매핑 명시 | ✅ 일치 |

**결론: v1.1 양식 + v2 문서로 5개 gap 전부 닫혔다.** 다만 이번 검증은 FE 1건(섹션종류 관리)만
대상으로 했다 — BE/BATCH 섹션은 이번에 손대지 않았고, 다른 FE 화면에서도 같은 유형의 gap이
반복되는지는 별도로 1~2건 더 검증해봐야 표준양식 보완이 일반화될 수 있는지 확인 가능하다.

## 2차 검증: 템플릿 관리 화면 (2026-07-09)

같은 09-DPL 샘플의 샘플 4(`TSK-ADM-020-008-FE`, 전시 템플릿 관리)를 v1 그대로 옮겨와
`apps/runNshop-admin/src/display/template/` 실제 코드와 대조. **새로운 유형의 gap을 포함해 4곳 발견**:

| # | Task Spec 지시 | 실제 코드 | 문제 |
|---|---|---|---|
| 1 | 요약카드 언급 자체가 없음 | 실제는 4개(전체/활성/비활성/폐기) SummaryBar 존재 | 섹션종류 화면과 같은 유형(누락) — v1.1의 "정확한 목록 요구"가 있었다면 애초에 안 생겼을 gap |
| 2 | reference_impl: "section/mockData.ts의 `getSectionLabel`·`getSectionColor` 헬퍼 재사용" | **두 함수는 실존하지 않음** — 실제로는 `MOCK_SECTION_TYPES` 배열을 직접 import해서 화면에서 자체 filter/map | **신규 유형의 gap**: 참조 대상 자체가 틀림. 이 지시를 그대로 따르면 import 에러가 난다 |
| 3 | 유형 배지 색상 언급 없음 | plain `<span className="badge">` (색상 구분 없음, data-*-status 없음) | 경미하지만 "배지=색상 있음"으로 오해할 여지 |
| 4 | 상태 배지 구현방식 언급 없음 | data-product-status 재사용 (섹션종류 화면과 동일 패턴) | 1차 검증과 동일한 gap 유형 — 반복 확인됨 |

**표준양식 추가 보완**: gap #2는 v1.1이 다루지 않던 새로운 실패 유형이라 `reference_impl` 필드에
"언급하는 헬퍼명이 실제로 존재하는지 작성 시점에 확인" 규칙과, FE 완료조건에 대응 체크리스트를
추가했다 (파일은 계속 `v1_1.md`로 유지 — 같은 파일럿 사이클 내 보완이라 버전 번호는 올리지 않음).

`09-task-spec/TSK-ADM-020-008-FE-v2.md`로 재작성 후 재대조 → 4곳 전부 일치 확인.

**종합 결론 (2건 검증 기준)**:
- 요약카드/테이블 컬럼 같은 "정확한 UI 구성요소" 누락은 반복되는 패턴 → v1.1의 강제 목록화로 방지됨
- 배지 구현방식(전용 파일 vs 속성 재사용) 누락도 2건 다 발생 → `cross_module_deps` 필드로 방지됨
- reference_impl의 **사실 오류**(존재하지 않는 함수명)는 1건에서만 나왔지만 심각도가 높음(그대로 따르면
  빌드 에러) → 표준양식에 검증 규칙 추가로 대응
- BE/BATCH는 아직 검증 안 함 — 다음 단계로 남겨둠

## 원천 문서(화면정의서) 수정 (2026-07-09)

Task Spec의 gap을 코드 기준으로만 고치고 원천은 안 고쳤던 문제를 짚어주셔서 원천까지 추적했다.
"요약카드 3개" 오류의 진짜 출처는 `.spec.md`가 아니라 그보다 더 위, **`docs/6. 화면정의/
runNshop_screen_definition_v1_1.md` 자체(line 506, "요약카드(전체/활성/비활성)")**였다 — 원본 0~8
문서 단계에서부터 이미 낡아 있었고, 그게 `.spec.md`를 거쳐 Task Spec까지 그대로 이어진 것.

`docs/`는 백업이라 직접 고치지 않고, 수정본을 `docs_ai/06-화면정의/ADM-020-Display.md`에 만들었다
(Section + Template 두 화면, 도메인별 발췌). 코드 쪽 원본도 함께 고쳤다:
- `apps/runNshop-admin/src/display/section/SectionTypePage.spec.md`
- `apps/runNshop-admin/src/display/section/tabs/AddFieldModal.spec.md`
- `apps/runNshop-admin/src/display/template/TemplatePage.spec.md`

브라우저로 스펙(?) 버튼 눌러 실제 렌더링까지 확인함, 콘솔 에러 없음.

**다음에 이어서 할 것**: `docs_ai/09-task-spec/`의 v2 Task Spec 두 개가 지금은 "코드에서 역추적한
값"인데, 원천(화면정의서)이 고쳐졌으니 이제는 "고쳐진 원천을 그대로 베낀 것"인지 재대조가 필요하다
(내용은 실질적으로 같을 것으로 예상되지만 확인 전).

## 3차 검증: BE Task Spec (2026-07-09)

FE만 검증하다가, BE Task Spec(`TSK-DPL-SEC-001-BE`, 섹션종류 관리 API)도 정책서·도메인정의서·
ERD·decision_log와 대조했다. 결과는 FE보다 더 근본적인 문제였다:

- ERD (`cat_display_section_type`/`_field`) — ✅ 실존, 제약조건 대부분 일치
- 정책서 "해당 정책 없음" — ✅ 맞음
- decision_log 인용 — ✅ 정확
- **도메인정의서의 `DOM-CATALOG`** — ❌ 원본 도메인문서엔 Display가 Catalog 소유 데이터로
  전혀 안 나열돼 있었고, `DOM-` ID 표기법 자체도 원본엔 없음
- **기술정의서의 `TC-001`** — ❌ 원본에 `TC-*` ID가 아예 하나도 없음

**원인 파악**: 두 인용 다 "가짜"가 아니라 "아직 현행화 안 된 것"이었다. 하네스 표준양식
(`x. 하네스/표준양식/03...`, `07...`)엔 `DOM-{name}`·`TC-{id}` 형식이 이미 정의돼 있고, 그 규칙들
(물리적 DELETE 금지 등)은 요구사항/정책서/ERD 여기저기에 실제로 존재했다 — 다만 그걸 하나의 ID로
모아서 도메인정의서·기술정의서에 반영하는 작업이 안 돼 있었을 뿐.

**보완**: 이 gap을 "역추적한 값 끼워넣기"가 아니라 "실제 원천을 현행화"로 해결했다.
- `docs_ai/03-도메인/Catalog-Display.md` — Catalog의 "소유 데이터"에 Display 9개 엔티티 추가
  (전부 ERD에 실존하는 것만, 새로 만들지 않음), `DOM-CATALOG` ID 명시
- `docs_ai/07-기술정의/TC-공통기술제약.md` — TC-001(물리삭제 금지)/TC-002(도메인간 접근 금지)/
  TC-003(복제테이블 read-only) 신설. 셋 다 요구사항·정책서·ERD에 이미 있던 규칙을 처음으로
  TC-ID로 모은 것 — 새 규칙 발명 아님. TC-001엔 Display 도메인이 `is_deleted` 플래그 대신
  `status=DEPRECATED` 전환을 쓰는 구현 차이도 명시해 같은 원칙의 다른 구현임을 밝혔다

이제 `TSK-DPL-SEC-001-BE`의 `source_domain`/`source_tech` 인용이 실제로 추적 가능해졌다.
BE 쪽 UI-레벨 gap(FE에서 봤던 요약카드 개수 같은 것)은 아직 안 봤음 — BE는 화면이 없어서
같은 방법(코드 대조)이 안 통하고, 이번처럼 원천 문서 자체의 완결성을 보는 방식으로 검증했다.

## 정책서 보완 (2026-07-09)

"TC-001 대신 status로 구현" 같은 표현이 정확한지 다시 확인해보자는 질문을 받고 재검토.
정책서 §19.3(도메인별 소프트 삭제 적용 기준)에 이미 "상품 | 판매종료·강제 삭제 | `DISCONTINUED`
상태와 **병행**" 행이 있었다 — 즉 `is_deleted` 플래그와 도메인 상태값을 **같이 쓰는 게 기존
확립된 패턴**이었다. ERD 확인 결과 `cat_display_section_type`도 `is_deleted`+`status` 컬럼을
둘 다 가지고 있어 정확히 이 패턴과 같은데, §19.3 표에 "전시(Display)" 행만 빠져 있었다.

`docs_ai/02-정책서/19.3-소프트삭제-Display추가.md`로 그 행을 보완하고, TC-001 note와
TSK-DPL-SEC-001-BE-v2의 "대신"이라는 잘못된 표현도 "병행"으로 정정했다.
**패턴 확인**: 이번 라운드까지 4개 문서(화면정의서 2건, 도메인정의서, 기술정의서, 정책서)에서
모두 "새로운 규칙을 만들 필요는 없었고, 이미 있는 규칙/패턴이 특정 도메인(Display)에만
반영이 안 된 현행화 누락"이었다.

## 정책서 §3.13 신설 — 섹션종류 관리 정책 (2026-07-09)

§19.3(소프트 삭제 표)만 고치고 끝내지 않고, 섹션종류 화면(FE 검증에서 확인한 HARD 규칙:
sectionCode/fieldKey 불변, 사용 중 섹션종류 폐기 차단)을 §3.12(전시 페이지 상태 정책)와 같은
격의 정식 정책 섹션으로 승격했다 — `docs_ai/02-정책서/3.13-섹션종류관리정책.md`.
`docs/2. 정책서/runNshop_policy_v1_2.md`엔 3장이 §3.12에서 끝나 있어 이 섹션 자체가 없었다.

## ERD 역참조 보완 + Display 4문서 상호보완 상태 (2026-07-09)

"작업지시서가 만들어질 때까진 정책서·도메인·화면정의·엔티티정의가 상호보완해야 한다"는 원칙에
따라, Section 화면(ADM-020-010) 기준으로 4개 문서가 서로 참조 가능한 상태인지 점검했다.
ERD(`cat_display_section_type`/`_field`) 내용 자체는 이미 정확해서 바꿀 필요 없었고, 다른
문서들이 ERD를 가리키기만 하고 ERD에서 그 문서들로 돌아가는 역참조가 없었던 게 마지막 빈 칸이었다
— `docs_ai/05-엔티티정의/cat_display_section_type-교차참조.md`로 보완, Section 화면은 4문서
상호보완 완결.

**남은 것 (해결됨 — 아래 "TC-* 체계 도입 여부 최종 결정" 참고)**:
- ~~`docs_ai/07-기술정의/TC-공통기술제약.md` 처리 방향~~ → TC-ID 체계 도입하지 않기로 결정,
  파일 삭제 + Task Spec에서 원본 직접 인용으로 확정

## Template 화면도 화면정의서 기준으로 보완 (2026-07-09)

Section과 같은 방식으로 Template(ADM-020-008)도 4개 문서를 마저 채웠다:
- `docs_ai/02-정책서/3.14-템플릿관리정책.md` (신설) — `usedPageCount>0 && ACTIVE` 수정/삭제
  금지(decision_log 2026-06-30), 복사 원칙. **실제 코드(`SectionsTab.tsx`)는 이 제약을
  `hasActivePages = false`로 하드코딩 해제해둔 상태**라 정책과 프로토타입 구현이 다르다는 것도
  명시함(본개발 시 교체 필요)
- `docs_ai/03-도메인/Catalog-Display.md`의 "관련 정책 참조" 섹션을 §3.13/§3.14 신설 반영해서
  갱신 (예전엔 "적용 정책 없음"이라고 잘못 적혀 있었음)
- `docs_ai/05-엔티티정의/cat_display_template-교차참조.md` (신규) — 역참조 + ERD의
  `area_type`(FIXED/FLEXIBLE)/`cat_display_content`가 현재 FE Mock보다 세분화돼 있어 구조가
  다르다는 **미해결 이슈**를 명시 (새로 발견한 게 아니라 원본 하네스 샘플에 이미 있던 경고를
  옮겨온 것 — 결정 전까지 이 문서들은 Mock 기준 임시 버전)

Section·Template 둘 다 이제 정책서·도메인정의서·화면정의서·ERD 4문서가 상호참조 가능한
상태다. `07-기술정의`(TC-* 체계 도입 여부)는 아래에서 최종 결정.

## 페이지 관리(ADM-020-007)도 화면정의서 기준으로 보완 (2026-07-09)

Section→Template에 이어 세 번째 화면. **이번엔 다른 결과가 나왔다** — `Page.spec.md` (당시 파일명은 EventPage.spec.md, 이후 페이지 관리 화면 전체가 display-page→page로 리네임됨)는
Section/Template과 달리 이미 정확했다(요약카드 5개·테이블 7컬럼·탭 4개 전부 실제 코드와 일치,
수정 불필요). 정책서 §3.12·ERD도 이미 정확하고, ERD는 심지어 Mock과의 상태모델 불일치를
**스스로 주석으로 이미 경고해뒀다**(line 1046-1051, "본개발 전환 시 반드시 재확인").

한 게: `docs_ai/06-화면정의/ADM-020-Display.md`에 ADM-020-007 섹션 신설(원본엔 API 매핑표에만
있고 상세 스펙 매핑 섹션 자체가 없었음), `docs_ai/05-엔티티정의/cat_display_page-교차참조.md`
신설(역참조만, 내용 정정 없음), Task Spec v2 2건(`TSK-ADM-020-007-FE-v2.md`,
`TSK-DPL-001-BE-v2.md`).

**부수 발견**: Template v2에서 "getSectionLabel/getSectionColor 함수가 존재하지 않는다"고 했던
게 부정확했음을 발견 — 그 함수들은 실제로 **page/mockData.ts (당시 폴더명은 display-page)에 존재**한다(Page 화면이
씀). Template 화면 자체는 안 쓰는 게 맞지만 "존재하지 않는다"는 표현은 틀렸어서 두 v2 문서 모두
정정했다 — 문서를 여러 개 만들다 보니 서로 다른 화면을 검증하면서 이전 판단이 뒤집히는 경우도
있다는 걸 보여주는 사례.

**Display 도메인 3개 화면(Section/Template/Page) 전부 4문서 상호보완 완결.** 다음 화면은 없고
(하네스 샘플에 포함된 Display 체인은 여기까지), 남은 건 BE 코드가 없어서 런타임 검증을 못 했다는
한계뿐이다.

## TC-* 체계 도입 여부 최종 결정 (2026-07-09)

`docs_ai/07-기술정의/TC-공통기술제약.md`(TC-001/002/003 신설안)를 만들었으나, 검토 후
**"불필요"로 결론** — 파일을 삭제하고 아래로 대체했다:

- TC-ID 같은 새 참조 체계를 만드는 대신, Task Spec의 `source_tech`가 실제 원본(요구사항
  FR-COM-005 / 정책서 §19.1 / 도메인정의서 §1 / ERD 설계원칙)을 **직접 인용**한다
- 영향받은 파일 전부 수정: `TSK-DPL-SEC-001-BE-v2.md`, `TSK-DPL-001-BE-v2.md`,
  `docs_ai/03-도메인/Catalog-Display.md`, `docs_ai/02-정책서/19.3-소프트삭제-Display추가.md`
- `docs_ai/07-기술정의/` 폴더 제거

이유: 규칙 자체(물리적 삭제 금지 등)는 이미 요구사항·정책서·ERD에 실존하므로, 그 위에 또 다른
ID 레이어(TC-*)를 얹는 건 04(Task Spec)만을 위한 별도 문서를 새로 만드는 것과 같아
"현행화"(이미 있는 걸 연결)보다는 "신규 표준 도입"에 가까웠다. 화면정의서·도메인정의서처럼
**원본에 실제로 빠져 있던 내용을 보완하는 경우**와, 기술정의서처럼 **이미 다른 문서에 규칙이
있고 단지 모아놓은 색인이 없는 경우**는 다르게 처리하는 게 맞다는 결론.

## 4차 검증: "reference_impl 그대로 적용"의 함정 (2026-07-09)

`TSK-ADM-020-007-FE`의 "등록 플로우" 항목을 다시 보니 **새로운 유형의 gap**을 발견했다 —
지금까지는 "값이 틀렸다/빠졌다"였는데, 이번엔 "구조 자체가 텍스트로 없다"는 문제였다.

- 문제: `AddPageModal`을 어떻게 구성해야 하는지가 "reference_impl(AddTemplateModal) 그대로
  적용" 한 줄뿐이었다. 마크업 스켈레톤(모달 오버레이 > 헤더의 step-indicator > body의 add-form
  > footer 버튼)이 Task Spec 어디에도 텍스트로 없어서, `AddTemplateModal.tsx` 원본 파일을
  직접 열어봐야만 알 수 있었다 — Task Spec의 "원본을 다시 안 열어봐도 된다"는 목적과 어긋난다.
- 실제로 열어서 대조해보니, reference와 실제 구현 사이에 **문서화 안 된 차이**도 하나 있었다:
  `AddTemplateModal`의 오버레이는 `onClick={onClose}`로 배경 클릭 시 닫히는데, 이는 코드
  가이드의 "서브 모달은 overlay 클릭 닫기 차단(데이터 유실 방지)" 규칙 위반이다(Template 쪽
  기존 결함). `AddPageModal`은 이 핸들러가 없어 올바르게 차단한다. "그대로 적용"을 문자 그대로
  따르면 이 올바른 동작을 실수로 없애버렸을 것이다.
- 추가로 상태 select 3개 하드코딩(DEPRECATED 제외), Slug 미입력 시 자동 생성 로직도 누락 확인.

**보완**: `TSK-ADM-020-007-FE-v2.md`에 마크업 스켈레톤을 텍스트로 명시하고, reference_impl과의
차이점(overlay 클릭 차단)을 "그대로 복사하면 안 됨" 경고로 박아넣었다. 상태 select·Slug 자동생성도
반영.

**시사점**: `reference_impl` 필드는 "구조를 텍스트로 서술하는 대신 참조 파일을 가리키는" 방식인데,
이게 Task Spec 자기완결성 원칙과 근본적으로 긴장 관계에 있다 — 참조 파일이 있으면 구조 설명을
생략해도 된다고 하면 결국 그 파일을 열어봐야 하고, 참조 파일과 실제 구현이 다른 부분(이번처럼
버그 수정이 반영된 경우)은 반드시 "차이점"으로 명시하지 않으면 잘못된 부분까지 그대로 복사하게
된다. 표준양식에 "reference_impl 인용 시 핵심 마크업 스켈레톤 1~2줄 요약 + 실제 차이점"을
필수 항목으로 추가하는 게 좋을 것 같다 — 다음 라운드에서 검토.

## 표현 방식 문제: "역작성 샘플"의 서술체 vs 지시문 (2026-07-09)

지적받은 내용: `TSK-ADM-020-007-FE-v2.md`에 "`AddPageModal`은 `onClick` 없이 ... 올바르게
차단한다"처럼 **대상 컴포넌트를 이미 존재하는 것처럼 3인칭으로 서술**한 문장이 있었다. 이 도메인의
FE Task Spec 전부가 `status: DONE`(이미 구현된 걸 역추적해서 쓴 샘플)이다 보니, 검증 과정에서
실제 파일을 열어 "맞다/틀리다"를 판정하다가 그 서술 습관이 지시문에도 스며든 것 — "AddPageModal이
있다"는 전제 없인 성립하지 않는 문장이라, 진짜 신규 화면을 만들 때 쓰는 지시문으로는 순환논리다.

`TSK-ADM-020-007-FE-v2.md`에서 "~은 ~이다/한다"(서술) 형태를 "~하게 만든다/~는 넣지 않는다"
(지시) 형태로 다시 고쳤다 — 그리드 열 수, "빈 템플릿으로 시작" 옵션 배제, overlay onClick 배제,
등록 버튼 활성 조건 3곳.

**패턴 정리**: `status: DONE` 역작성 샘플은 검증(코드 대조)에는 유용하지만, 그대로 지시문으로
재사용하려면 서술체 문장을 매번 지시문으로 바꿔 써야 한다. 표준양식에 "본문은 항상 명령형으로
쓴다(대상을 3인칭으로 서술하지 않는다)"는 원칙을 추가해두는 게 다음 신규 화면(아직 안 만들어진
것)에 실제로 쓰일 때 이 문제를 예방하는 방법일 것 같다.

## `.spec.md` 2세트 정책 확정 (2026-07-09)

`.spec.md`가 실질적으로 화면정의서라면 위치도 화면정의 폴더여야 한다는 지적을 받고 검토 —
결론은 "2세트를 두고 원본을 docs_ai로 표시"였다. 앱의 "스펙(?)" 버튼이 `/api/spec` 라우트를
통해 `src/` 밖의 파일은 못 읽게 막혀 있어서(경로 탈출 방지), 운영 복사본은 계속 코드 트리에
둬야 한다 — 그래서 실제로 옮기는 대신 **복제 + 원본 지정**으로 처리했다:

- `docs_ai/06-화면정의/spec/`(section/template/page, 총 13개 파일)를 **원본(마스터)**으로 신설.
  기존 `src/` 파일을 그대로 복사해온 것이라 지금은 두 세트 내용이 동일하다
- 원본 파일 맨 위에 "이 문서가 원본, 운영 복사본은 `apps/.../*.spec.md`" 안내문 추가
- 운영 복사본(`src/`) 맨 위에도 반대 방향 안내문 추가 ("원본은 `docs_ai/...`, 정기 동기화할 것")
- `docs_ai/06-화면정의/ADM-020-Display.md`에 이 정책 설명 추가

**규칙**: 화면을 고칠 땐 **`docs_ai` 원본을 먼저 고치고, 운영 복사본에 정기적으로 현행화(동기화)
한다.** 반대 순서(운영 복사본을 먼저 고침)로 흘러가면 지금까지 이 문서에서 계속 봐온 "코드는
맞는데 문서가 낡음" 패턴이 다시 반복된다 — 이번엔 원본이 docs_ai이므로 그게 안 고쳐지면
"원본이 낡음"이 되는 셈이니 더 주의가 필요하다.

브라우저로 운영 복사본(`section/SectionTypePage.spec.md`)의 "?" 버튼을 눌러 새 안내문이 정상
렌더링되는지 확인함, 콘솔 에러 없음. Display 도메인 13개 파일만 우선 처리했고, 나머지 60개 넘는
`.spec.md`(다른 도메인)는 아직 미반영 — 필요할 때 같은 방식으로 확장하면 된다.

## `.spec.md` 2세트 정책 폐기 + 화면정의서 통합, app/domain/feature 분리 (2026-07-09)

바로 위 "2세트" 정책은 만든 지 얼마 안 돼서 뒤집혔다: 화면정의서와 `.spec.md`가 결국 같은
내용을 두 군데(마스터/운영)에서 관리하는 구조라 현행화 부담이 컸다. **`.spec.md` 확인 기능(앱의
"스펙(?)" 버튼)은 잠시 제쳐두고, 그 내용을 화면정의서로 완전히 통합**하기로 결정했다.

- `docs_ai/06-화면정의/spec/`(방금 만든 마스터 미러 13개 파일) 삭제
- `docs_ai/06-화면정의/ADM-020-Display.md`(도메인 하나에 화면 3개를 몰아넣은 파일) 삭제,
  대신 **`app/domain/feature`** 단위로 분리:
  `docs_ai/06-화면정의/admin/Display/{README,Section,Template,Page}.md`
  (`README.md`에 도메인 공통 사항, 나머지 3개에 화면별 상세 — `.spec.md` 13개 파일의 내용을
  전부 흡수해서 병합함)
- 운영 복사본(`apps/runNshop-admin/src/display/**/*.spec.md`, 13개)은 앱의 "스펙(?)" 버튼이
  당장 참조하므로 그대로 두되, 머리말을 "공식 원본은 화면정의서"로 바꾸고 이 기능을 계속 유지할지/
  화면정의서와 어떻게 동기화할지는 **추후 검토**로 남겨둠 (지금 결정하지 않음)
- 관련 문서의 경로 참조 갱신: `docs_ai/02-정책서/3.14-템플릿관리정책.md`,
  `docs_ai/05-엔티티정의/cat_display_{template,page,section_type}-교차참조.md`

이 폴더 구조(`app/domain/feature`)는 Display 도메인에만 적용된 상태다 — 다른 도메인을 옮길 때도
같은 3단 분리를 따른다. 이전 로그(위 "2세트" 섹션, line ~290)의 `docs_ai/06-화면정의/spec/`,
`ADM-020-Display.md` 경로는 더 이상 존재하지 않는다 — 이 섹션이 최신 상태다.

## 화면정의서 feature 파일 번호순 정렬 + "스펙(?)" 버튼 기능 완전 제거 (2026-07-09)

**번호순 정렬**: `admin/Display/{Section,Template,Page}.md`를 실제 메뉴(AppShell `product` 그룹)
노출 순서(페이지 관리 → 템플릿 → 섹션종류)에 맞춰 `01-Page.md`/`02-Template.md`/`03-Section.md`로
재명명. `Display-readme.md`도 함께 재명명(도메인이 늘어날 때 파일 목록에서 구분되도록 `{도메인}-readme.md`
형식). 참조하는 모든 문서(`Display-readme.md` 자체, 정책서 §3.14, ERD 교차참조 3개, 이 README)의
경로도 같이 갱신.

**"스펙(?)" 버튼 기능 완전 제거**: 바로 위 항목에서 "추후 검토"로 남겨뒀던 그 결정을 실행했다 —
admin 앱 전체(약 70개 화면)에서 `SpecModal` 컴포넌트, `/api/spec` API 라우트(경로 탈출 방지
로직 포함), 각 화면의 `showSpec` state·버튼(`.spec-btn` 텍스트형 33개 + Display 도메인의 인라인
"?" 원형 버튼 6개, 그중 `SectionTypeDetail.tsx`/`AddSectionTypeModal.tsx`는 탭 라벨에 붙는
`SpecBtn` 서브컴포넌트까지 별도로 있었음)를 전부 제거. `globals.css`의 `.spec-btn`/`.spec-modal*`/
`.spec-h1`~`.spec-table` 관련 dead CSS 블록(약 200줄, 실제로는 이미 안 쓰이던 구버전 SpecModal
마크다운 렌더러 잔재였음)도 같이 삭제. 가이드 탭(`guide/tabs/NewScreenGuide.tsx`,
`ListGuide.tsx`, partner 쪽 동일 파일들)에서 이 기능을 설명/차이점으로 언급하던 부분도 갱신.
하네스 스크립트(`scripts/harness/screen/scaffold-screen.js`의 `.spec.md`/버튼 자동생성,
`check-screen-conventions.js`의 `.spec.md` 존재 검사)도 같이 제거 — 새 화면을 스캐폴딩할 때
더 이상 `.spec.md`를 만들지 않는다.

`src/` 안의 운영 복사본 `.spec.md` 파일 자체(Display 13개 + 다른 도메인 60여 개)는 지우지 않고
남겨뒀다 — 이제 아무 코드도 읽지 않는 순수 참고 문서가 됐다는 사실을 헤더에 명시했다(Display
13개만 우선 처리). 완전 삭제할지는 별도 결정 사항으로 남김. `tsc --noEmit`으로 admin/partner
둘 다 타입 에러 없음 확인(`.next/types`의 stale spec route 참조 1건은 캐시 재생성으로 해소).

## 용어 변경: "섹션종류" → "섹션" (2026-07-09)

**feature명 규칙**(사용자 지정): `<Feature>Page.tsx` → `<Features>.tsx`(복수형, "Page" 접미사 제거),
`<Feature>Detail.tsx`는 단수 유지. 이 규칙을 적용해 섹션종류 관리 화면을 리네임:
- `section/SectionTypePage.tsx` → `section/Sections.tsx` (컴포넌트명 `Sections`)
- `section/SectionTypeDetail.tsx` → `section/SectionDetail.tsx`
- `section/AddSectionTypeModal.tsx` → `section/AddSectionModal.tsx`
- 타입/식별자: `SectionTypeItem`→`SectionItem`, `MOCK_SECTION_TYPES`→`MOCK_SECTIONS`,
  `filterSectionTypes`→`filterSections`. **단, `SectionType`(대분류 enum: BANNER/PRODUCT_GRID
  등, `SECTION_TYPE_LABEL`도 동일)은 그대로 유지** — 이건 "섹션종류(entity)"가 아니라 섹션 하나가
  갖는 "타입(대분류)" 필드라 별개 개념이다. `PageSection`/`TemplateSection`의 `sectionType`
  필드(섹션의 sectionCode를 참조하는 FK 성격)도 스키마 필드명이라 그대로 뒀다.
- AppShell 메뉴 label: `'섹션종류'` → `'섹션'` (menu id `product/section-type`는 라우팅 키라 유지)
- 화면 내 한글 텍스트("섹션종류 관리"→"섹션 관리" 등) + 가이드 탭(MainGuide/ListGuide/DetailGuide)
  예시 텍스트까지 전부 갱신

**범위 결정**: 코드에서 실제로 참조하는 파일/식별자가 있는 문서(화면정의서 `admin/Display/
{01-Page,02-Template,03-Section,Display-readme}.md`, v2 Task Spec 4개 — `TSK-ADM-020-010-FE-v2`,
`TSK-ADM-020-008-FE-v2`, `TSK-ADM-020-007-FE-v2`, `TSK-DPL-SEC-001-BE-v2`)는 전부 갱신했다.
**정책서/도메인정의서/ERD 교차참조(`3.13-섹션종류관리정책.md`, `Catalog-Display.md`,
`cat_display_section_type-교차참조.md` 등)와 v1 Task Spec(이미 "검증 전 baseline"으로 보존 중인
`TSK-ADM-020-010-FE.md`, `TSK-ADM-020-008-FE.md`), 이 README의 과거 로그는 손대지 않았다** — ERD
테이블명 `cat_display_section_type`/`cat_display_section_field` 자체가 스키마 레벨 이름이라
이번 FE 용어 변경과 별개 사안이고, v1/로그는 "당시 상태"를 보존하는 게 의도이기 때문이다.

작업 중 발견: 블라인드 문자열 치환("섹션종류"→"섹션")이 조사(助詞)를 깨뜨렸다 — "섹션종류가"→
"섹션가"(X, "섹션이"가 맞음), "섹션종류를"→"섹션를"(X, "섹션을"), "섹션종류는"→"섹션는"(X,
"섹션은") 등. 받침 있는 "섹션"과 받침 없는 "섹션종류"는 조사가 다르다. 전체 재검색으로 5곳 발견해
수동 수정. 이런 용어 변경 작업에서는 항상 조사 재검사가 필요하다는 걸 기록해둔다.

`tsc --noEmit` admin 앱 재확인 — 타입 에러 없음.

## 메뉴명/화면명 "{feature} 관리" 통일 (2026-07-09)

Display 도메인 3개 화면의 화면 타이틀(h1)은 이미 전부 "OOO 관리"였는데(페이지 관리/템플릿 관리/
섹션 관리), AppShell 메뉴 라벨은 템플릿·섹션만 "관리"가 빠져 있었다(`'템플릿'`, `'섹션'`) — 화면
타이틀과 메뉴 라벨이 불일치. `'템플릿 관리'`/`'섹션 관리'`로 통일(`shell/AppShell.tsx`). MDI 탭
제목은 메뉴 라벨을 그대로 쓰므로(`AppShell.tsx`의 `openTab({..., label: item.label, ...})`) 탭
제목도 자동으로 같이 바뀐다 — 가이드 탭(`MainGuide.tsx`)의 탭 목업 텍스트("섹션 ×")도 실제와
맞춰 "섹션 관리 ×"로 갱신.

이 작업 중 위 "용어 변경" 라운드에서 만든 버그 2건을 추가로 발견해 수정: `Display-readme.md`와
`TSK-DPL-SEC-001-BE-v2.md`가 정책서 파일을 `3.13-섹션관리정책.md`로 인용하고 있었는데, 실제
파일명은 `3.13-섹션종류관리정책.md`(정책 파일명 자체는 리네임 범위 밖이라 그대로 뒀음)다 — 블라인드
"섹션종류"→"섹션" 치환이 파일 경로 문자열까지 건드려서 생긴 깨진 링크. 두 곳 다 정정.

## Page/Template 화면도 "{feature}Page → {feature}s" 규칙 적용 (2026-07-09)

Section에만 적용했던 feature명 규칙("{feature}Page.tsx → {feature}s.tsx, Detail은 단수 유지")을
Page/Template에도 똑같이 적용해야 하는 게 맞다는 지적을 받았다 — Section만 규칙을 따르고 나머지
둘은 예전 이름 그대로면 오히려 앱 안에서 컨벤션이 갈린다.

- `display/page/Page.tsx` → `Pages.tsx` (컴포넌트명 `Page`→`Pages`), `Page.spec.md`→`Pages.spec.md`
- `display/template/TemplatePage.tsx` → `Templates.tsx` (컴포넌트명 `TemplatePage`→`Templates`),
  `TemplatePage.spec.md`→`Templates.spec.md`
- `PageDetail.tsx`/`AddPageModal.tsx`, `TemplateDetail.tsx`/`AddTemplateModal.tsx`는 이미 규칙에
  맞는 이름이라 변경 없음
- `shell/AppShell.tsx`의 import·JSX·(라벨은 이미 지난 라운드에서 "관리"로 통일됨) 갱신
- 화면정의서(`01-Page.md`, `02-Template.md`) 파일 경로 인용 + v2 Task Spec 2개(`TSK-ADM-020-007-
  FE-v2`, `TSK-ADM-020-008-FE-v2`)의 "생성 대상 파일" 목록 갱신

부수적으로 `03-Section.md` 제목의 `(SectionType)`이 지난 용어 변경 라운드에서 안 고쳐진 채
남아있던 걸 발견 — `(Section)`으로 정정(다른 두 파일은 `(Page)`/`(Template)`처럼 이미 단수
feature명을 쓰고 있었음). `tsc --noEmit` admin 앱 클린.
