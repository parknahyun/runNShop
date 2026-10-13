# ⑥ 엔티티정의(ERD) — cat_display_page / cat_display_page_area / cat_display_page_schedule 교차참조

> 원본: `docs/5. 엔티티정의/runNshop_erd_v1_0.md:1035-1082, 1160-`.
> Section/Template과 달리 이 ERD 섹션은 **이미 자체적으로 잘 현행화돼 있었다** — 정책서 §3.12와의
> 상태값 불일치를 ERD 주석(line 1048-1051)에 이미 명시해뒀고, 원본 하네스 샘플 참조까지 걸어놨다.
> 이 파일은 그 사실을 확인하고 역참조만 추가한다 — ERD도 정책서도 바꿀 필요가 없었다.

## `cat_display_page` / `cat_display_page_area` / `cat_display_page_schedule` 역참조

| 이 테이블을 참조하는 문서 | 내용 |
|---|---|
| 정책서 §3.12 | `docs/2. 정책서/runNshop_policy_v1_2.md` (원본 그대로 — 이미 정확해서 docs_ai 보완 불필요) |
| 도메인정의서 | `docs_ai/03-도메인/Catalog-Display.md` — DisplayPage/DisplayPageArea/DisplayPageSchedule |
| 화면정의서 | `docs_ai/06-화면정의/admin/Display/01-Page.md` (ADM-020-007) |
| Task Spec | `docs_ai/09-task-spec/TSK-ADM-020-007-FE-v2.md` (FE),
             `docs_ai/09-task-spec/TSK-DPL-001-BE-v2.md` (BE) |

## 상태 모델 불일치 (ERD가 이미 알고 있던 이슈 — 재확인만)

ERD 원본 주석(line 1046-1051) 요약:
- 정책서 §3.12 기준 7종 상태(DRAFT/DRAFT_EDIT/PUBLISHED/SCHEDULED/RESERVED/CLOSED/CANCELLED)가
  맞고, ERD 컬럼 코멘트의 예전 3종은 축약 오류였다고 2026-07-06 정정됨
- 현재 FE Mock(`page/mockData.ts`)은 4종(PUBLISHED/SCHEDULED/DRAFT/DEPRECATED)으로
  단순화 — ERD와 구조 자체가 다름(Mock은 단일 행 status, ERD는 예약을
  `cat_display_page_schedule` 별도 행으로 관리)
- ERD 스스로 "본개발 전환 시 반드시 재확인" 필요하다고 명시 — **결정 전까지 Mock 기준으로 만든
  이 docs_ai의 화면정의서·Task Spec은 모두 임시 버전**

## Display 도메인 문서 상호보완 상태 갱신 (2026-07-09)

| 화면 | 정책서 | 도메인정의서 | 화면정의서 | ERD |
|---|---|---|---|---|
| 섹션종류 (ADM-020-010) | ✅ §3.13(신설) | ✅ | ✅ | ✅ (역참조만) |
| 템플릿 (ADM-020-008) | ✅ §3.14(신설) | ✅ | ✅ | ✅ (역참조 + 구조 불일치 명시) |
| 페이지 (ADM-020-007) | ✅ §3.12(원본이 이미 정확) | ✅ | ✅ | ✅ (역참조만, 상태모델 불일치는 ERD가 이미 알고 있었음) |

세 화면 모두 4문서 상호보완 완결. 페이지는 유일하게 **원본 정책서·ERD가 이미 정확했던 케이스**라
새 정책 섹션을 만들 필요가 없었다 — Section/Template과 다른 점.
