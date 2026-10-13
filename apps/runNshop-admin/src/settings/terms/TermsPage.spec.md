# TermsPage — UI 정의

## Overview
| 항목 | 내용 |
|------|------|
| 목적 | 서비스 이용약관·개인정보 처리방침·마케팅 수신동의 등의 약관 버전을 등록·조회·삭제한다 |
| 대상 | 운영자 (어드민) |
| 진입 경로 | 어드민 > 설정 > 약관 관리 |
| URL | /admin/settings/terms |
| 관련 컴포넌트 | FilterBar, SummaryBar, Toolbar, TermsTable, Pagination, AddTermsModal, TermsViewModal |

---

## Layout

```
┌──────────────────────────────────────────────────────┐
│ 약관 관리                            [스펙]           │
├──────────────────────────────────────────────────────┤
│ [버전 검색] [전체 유형▾] [조회]                        │
├────────────────────────────────────┬───────────────────┤
│ 전체 N건 | 유형별 N건               │ [+ 약관 등록]      │
├──────────────────────────────────────────────────────┤
│ 약관유형 │ 버전 │ 시행일 │ 등록자 │ 등록일             │
│  ...                                                 │
├──────────────────────────────────────────────────────┤
│ [10개▾]  ← 1 / N →                                   │
└──────────────────────────────────────────────────────┘

[약관 등록 모달] (등록 전용)
┌───────────────────────────┐
│ 약관 등록             [✕] │
│ 약관유형*    │ 버전*        │
│ 내용* (textarea rows=6)    │
│ 시행일*                    │
│         [취소] [등록]      │
└───────────────────────────┘

[약관 상세 모달] (읽기 전용 + 삭제, 수정 없음)
┌───────────────────────────┐
│ {약관유형} v{버전}    [✕] │
│ 내용 전문                  │
│ 등록자 / 등록일             │
│ [삭제]           [닫기]    │
└───────────────────────────┘
```

---

## Components

| 컴포넌트 | 역할 |
|----------|------|
| FilterBar | 버전 키워드 검색 / 약관유형 선택 및 조회 버튼 |
| SummaryBar | 조회 결과 기준 전체 건수 + 유형별(서비스/개인정보/마케팅) 건수 카드 |
| Toolbar | `+ 약관 등록` 버튼만 포함 |
| TermsTable | 약관 목록 테이블. 행 클릭 시 읽기 전용 상세 모달(TermsViewModal) 오픈 |
| Pagination | 페이지 크기 선택 + 이전/다음 이동 |
| AddTermsModal | 신규 버전 등록 전용 모달. **수정 기능 없음** — 등록만 지원 |
| TermsViewModal | 읽기 전용 상세 모달. 내용 전문 표시 + [삭제] 버튼만 제공 (수정 불가) |

---

## States

| 상태 | 처리 |
|------|------|
| 초기(미조회) | "조회 버튼을 눌러 약관 목록을 불러오세요." 안내 |
| 로딩 중 | "불러오는 중..." 메시지. 나머지 영역 숨김 |
| 조회 결과 없음 | SummaryBar 숨김. "조회된 약관이 없습니다." 안내 |
| 조회 결과 있음 | SummaryBar + Toolbar + Table + Pagination 표시 |
| 등록 모달 유효성 오류 | 버전·내용·시행일 미입력 시 "필수" 오류. 동일 약관유형+버전이 이미 존재하면 버전 필드에 "이미 등록된 버전입니다" 오류 |

---

## Interactions

| 액션 | 반응 |
|------|------|
| 필터 입력 후 [조회] | loading = true → 300ms → filterTerms 실행 → displayed 갱신, page = 1 |
| 약관 행 클릭 | viewing = 해당 Terms. TermsViewModal 오픈 (읽기 전용) |
| [+ 약관 등록] 클릭 | showAdd = true. AddTermsModal 오픈 |
| AddTermsModal [등록] | 유효성·중복 통과 시 allItems 최상단에 추가. termsId는 `nextTermsId(allItems)`로 자동 채번 |
| TermsViewModal [삭제] | allItems에서 해당 항목 제거. 모달 닫힘 |
| TermsViewModal [닫기] / [✕] | viewing = null |
| AddTermsModal [취소] / [✕] | showAdd = false |

---

## API

```typescript
// 현재 목업(mockData)으로 동작. 실제 연동 시 아래 엔드포인트를 사용한다.
// 약관은 버전 단위로 불변 레코드이므로 수정(PUT) API는 제공하지 않는다.

GET    /api/admin/terms
  Query: keyword(version), termsType(SERVICE|PRIVACY|MARKETING|ALL)
  Response: Terms[]

POST   /api/admin/terms
  Body: { termsType, version, content, effectiveAt }
  Response: Terms

DELETE /api/admin/terms/{termsId}
  Response: 204

// 타입 정의 (cfg_terms)
type TermsType = 'SERVICE' | 'PRIVACY' | 'MARKETING'

interface Terms {
  termsId: string; termsType: TermsType; version: string; content: string
  effectiveAt: string; createdBy: string; createdAt: string
}
```

---

## UX Rules

- 조회는 [조회] 버튼을 눌러야만 실행된다.
- 약관은 버전 단위 불변 레코드다 — 등록 이후 내용을 수정할 수 없으며, 개정이 필요하면 새 버전을 등록한다.
- 동일한 약관유형 + 버전 조합은 중복 등록할 수 없다(mock 유효성 검사, `isDuplicateVersion`).
- 행 클릭 시 열리는 상세 모달은 읽기 전용이며 [삭제] 버튼만 제공한다. 편집 폼은 노출하지 않는다.
- [삭제]는 클릭 즉시 목록에서 제거된다(확인 팝업 없음, mock 동작).
- `[스펙]` 버튼 클릭 시 SpecModal이 열리며 현재 spec.md 내용을 표시한다.
