# ⑤ 화면정의서 — admin / Shell 도메인

> 폴더 구조·작성 규칙은 [../../README.md](../../README.md)(화면정의서 작성 기준) 참고.
>
> Shell은 업무 도메인이 아니라 **admin 앱 전체를 감싸는 공통 셸(레이아웃/탭/네비게이션)
> + 그 셸 안에서 열리는 첫 번째 고정 탭(대시보드)**을 다루는 인프라성 화면이다. 그래서
> `docs_ai/02-정책서`, `docs_ai/03-도메인`, `docs_ai/05-엔티티정의`에 대응하는 문서가 없다 —
> 이 폴더가 유일한 원천이다.
>
> 셸(00-AppShell.md)·대시보드(01-Dashboard.md)·로그인(02-Login.md)은 별도 파일로 분리돼 있다 —
> 각각 성격이 다르다: 셸은 화면 ID 없는 공통 인프라, 대시보드는 셸이 호스팅하는 여러 탭 중
> 하나(`ADM-HOME`), 로그인은 셸 진입 전 단계의 별도 화면(`ADM-000-001`)이다. 다른 도메인 화면
> (Display, Order, Member, ...)도 전부 같은 셸 안에서 탭으로 열린다.
>
> 원본: `docs/6. 화면정의/runNshop_screen_definition_v1_1.md` §3.1(공통 레이아웃),
> §3.2(롤별 메뉴 접근 권한), §3.3(메뉴 트리, `ADM-HOME` 표기), §3.5 API #6~11(`ADM-HOME` 6개 API).
> 원본엔 `ADM-HOME` 전용 상세 스펙 섹션이 없고 API 매핑표·유형분류표에만 흩어져 등장한다.
>
> **하네스 적용**: 이 도메인의 화면정의서 3개는 ⑤ 화면정의서 하네스 표준양식
> (`docs/x. 하네스/표준양식/05. 화면정의서 하네스 표준양식 v1 0.md`)을 기반으로 작성한다 —
> 각 파일 상단에 하네스 헤더/[레이아웃]/[UI 요소]/[화면 전환]/AI-H12~14가 있고, 그 뒤에
> "보강 설명"으로 이 프로젝트(docs_ai) 특유의 "기준 vs 실제 소스" 비교·소스 수정 필요 체크리스트가
> 이어진다. `00-AppShell.md`는 화면 ID가 없는 공통 컴포넌트라 하네스 헤더를 그에 맞게 변형했다
> (해당 문서 상단 설명 참고). Display 등 다른 도메인 화면정의서는 아직 이 형식을 안 쓴다 —
> Shell 도메인에서 먼저 시범 적용했다.

## 이 도메인의 화면 (feature)

| feature 파일 | 화면 ID | 화면 |
|---|---|---|
| [00-AppShell.md](00-AppShell.md) | (없음, 공통) | 공통 레이아웃 — NavBar/TabBar/메뉴트리/탭 정책/로그인 게이팅 흐름 |
| [01-Dashboard.md](01-Dashboard.md) | ADM-HOME | 대시보드 (셸의 첫 번째 고정 탭) |
| [02-Login.md](02-Login.md) | ADM-000-001 | 로그인 (Mock 인증) |

## 도메인 공통 사항

- 로그인 화면 3종 중 `ADM-000-001`(로그인)만 Mock으로 구현 완료 — `app/page.tsx`가 세션 유효성에
  따라 로그인 화면/셸을 분기한다. `ADM-000-002`(운영자 신청)·`ADM-000-003`(비밀번호 변경 최초)는
  미구현. [02-Login.md](02-Login.md) 참고.
- 소스: `apps/runNshop-admin/src/shell/AppShell.tsx`, `Dashboard.tsx`, `LoginScreen.tsx`,
  `TabContext.tsx`, `navMenus.ts`(메뉴 구조 단일 소스 + 프로그램목록 API mock),
  `mockAuth.ts`(세션 확인·로그인·로그아웃 mock), `apps/runNshop-admin/src/app/page.tsx`
