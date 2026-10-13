# 프로젝트 규율: Issue → Branch → PR 워크플로우 (필수)

모든 작업은 아래 흐름을 따른다. 예외 없음 (오타 수정 포함). 일부는 `.claude/hooks/workflow-guard.js`가 강제한다.

1. **Issue 먼저**: 요구사항/스펙/버그는 반드시 GitHub 이슈로 등록한다 (`gh issue create`, `.github/ISSUE_TEMPLATE` 사용).
   이슈 없이 구현을 시작하지 않는다. 스펙 문서(`docs/`, speckit)를 작성하면 해당 내용을 이슈에 링크/요약한다.
2. **Branch 작업**: `main`에서 직접 커밋/푸시 금지. 이슈 번호가 포함된 브랜치를 만든다.
   - 형식: `<type>/<issue-number>-<short-slug>` (type: feat, fix, docs, refactor, chore)
   - 예: `feat/12-product-review-list`
3. **커밋**: 메시지에 이슈 번호 참조 (`feat: 리뷰 목록 추가 (#12)`).
4. **PR로 완료 요청**: 작업 완료는 PR 생성으로만 요청한다 (`gh pr create`).
   - 본문에 `Closes #<issue>` 필수, PR 템플릿(`.github/pull_request_template.md`) 항목 작성.
   - 머지는 사용자(리뷰어)가 승인한 뒤에만 수행한다. 임의로 `gh pr merge` 하지 않는다.
5. **스펙 변경**: 구현 중 요구사항이 바뀌면 코드보다 먼저 이슈를 갱신한다.

## 에이전트 행동 규칙
- 작업 요청을 받으면 먼저 대응 이슈가 있는지 확인(`gh issue list`)하고, 없으면 이슈 초안을 제안/생성한 뒤 브랜치를 만든다.
- 현재 브랜치가 `main`이면 코드 변경 전에 브랜치부터 만든다.
- 작업이 끝나면 "완료"라고만 보고하지 말고 PR을 생성해 링크를 제공한다.
