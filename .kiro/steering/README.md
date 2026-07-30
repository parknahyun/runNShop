---
inclusion: manual
---
# Steering 파일 가이드

## docs vs steering 역할 분리

| | docs/ | .kiro/steering/ |
|--|-------|-----------------|
| **내용** | 설계 원본 (정책서, ERD, 화면정의) | AI 작업 지시·규칙 요약 |
| **대상** | 사람 (팀원, 이해관계자) | AI (Kiro) |
| **형식** | 상세 문서 | 간결한 규칙 + 원본 참조 |
| **수정 주체** | 기획자, 설계자 | 개발자 |
| **동기화** | Single Source of Truth (원본) | `#[[file:...]]`로 원본 참조 |
| **버전 관리** | 파일명 버전 (_v1_0, _v1_1) | Git으로 이력 관리 |

## 동기화 원칙

- Steering은 docs 문서를 **복사하지 않고 참조**한다
- docs가 업데이트되면 Steering의 `#[[file:...]]` 경로만 변경
- 규칙 요약은 Steering에, 상세 내용은 docs에 유지

## 참조 문법

```markdown
#[[file:docs/6. 화면정의/runNshop_screen_definition_v1_0.md]]
```

이렇게 작성하면 해당 파일 내용이 AI 컨텍스트에 자동 포함됩니다.

## inclusion 유형

| 유형 | front-matter | 동작 |
|------|-------------|------|
| 항상 포함 | `inclusion: always` | 매 대화마다 자동 적용 |
| 파일 매치 | `inclusion: fileMatch` + `fileMatchPattern: "**/*.kt"` | 특정 파일 열 때만 적용 |
| 수동 호출 | `inclusion: manual` | 채팅에서 #으로 직접 호출 |

## 현재 Steering 파일 목록

| 파일 | inclusion | 용도 |
|------|-----------|------|
| coding-standards.md | always | 코딩 컨벤션, 네이밍, Git 규칙 |
| mock-data-rules.md | always | Mock 파일명, 응답 표준 |
| api-design-rules.md | always | URL prefix, Controller 분리 기준 |
| kotlin-guide.md | fileMatch (*.kt) | Kotlin/Spring Boot 규칙 |
| nextjs-guide.md | fileMatch (*.tsx, *.ts) | Next.js App Router 규칙 |
| screen-definition.md | manual | 화면정의서 참조 |
| domain-context.md | manual | 도메인 바운디드 컨텍스트 참조 |
| README.md | manual | 이 가이드 문서 |

## Steering 수정 시 체크리스트

- [ ] docs 원본이 변경되었는가? → `#[[file:...]]` 경로 확인
- [ ] 새 규칙 추가 시 적절한 inclusion 유형 선택
- [ ] always 파일은 간결하게 유지 (AI 컨텍스트 절약)
- [ ] 상세 내용은 docs에 두고 steering은 요약만
