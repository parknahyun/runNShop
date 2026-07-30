# ADM-020-007 전시 페이지 관리 (Page)

> 도메인 공통 사항(정책/도메인/엔티티 참조, `.spec.md` 통합 정책)은 [Display-readme.md](Display-readme.md) 참고.
>
> [신규] 원본 문서(`docs/6. 화면정의`)엔 이 화면도 상세 스펙 매핑 섹션이 없었고 API
> 매핑표(43~51번)에만 등장했음. 다만 이 화면의 옛 `.spec.md`(`page/Pages.spec.md`) 자체는
> Section/Template과 달리 이미 정확했다 — 요약카드 5개, 테이블 컬럼 7개, 탭 구성 4개 전부 실제
> 코드와 대조해서 일치 확인됨.

## 개요
전시 페이지(홈, 카테고리, 기획전, 기획전 메인, 프로모션, 브랜드)를 관리하는 목록 화면.

## 화면 구성

| 화면 | 화면유형 | 소스 |
|------|---------|------|
| 페이지 목록 | 목록 (table) | `apps/runNshop-admin/src/display/page/Pages.tsx` |
| 페이지 상세 | 상세 (MDI 탭, InnerTabs) | `apps/runNshop-admin/src/display/page/PageDetail.tsx` |
| 페이지 등록 | 등록 모달 (2-Step) | `apps/runNshop-admin/src/display/page/AddPageModal.tsx` |

※ Section/Template은 목록/상세/등록 화면마다 각각 별도 `.spec.md`를 갖는데(예: `Sections.tsx`
+`SectionDetail.tsx`+`AddSectionModal.tsx`), 옛 Page 화면은 `Pages.spec.md` 하나에 전부 몰아서
기술돼 있었다 — 코드 조직 컨벤션이 다르다는 점만 기록(이번 통합으로 이 화면정의서 파일이 그
내용을 대체한다).

## 페이지 유형
| 코드 | 라벨 |
|------|------|
| HOME | 홈 |
| CATEGORY | 카테고리 |
| EXHIBITION | 기획전 |
| EXHIBITION_MAIN | 기획전 메인 |
| PROMOTION | 프로모션 |
| BRAND | 브랜드 |

## 상태 (현재 Mock 기준 — 하단 "알려진 이슈" 참고)
| 코드 | 라벨 |
|------|------|
| PUBLISHED | 게시중 |
| SCHEDULED | 예약 |
| DRAFT | 미게시 |
| DEPRECATED | 폐기 |

## 페이지 목록 (Page)

### 필터바
- 키워드 (페이지ID / 페이지명)
- 유형 선택 (전체/홈/카테고리/기획전/기획전메인/프로모션/브랜드)
- 상태 선택 (전체/게시중/예약/미게시/폐기)
- 기간 (시작일 ~ 종료일)
- 조회 버튼

### 요약바
**전체 / 게시중 / 예약 / 미게시 / 폐기 — 5개** 건수 표시 — 전부 실제 코드와 일치 확인됨

### 목록 테이블 (7컬럼) — 전부 실제 코드와 일치 확인됨
| 컬럼 | 설명 |
|------|------|
| 페이지ID | PG-001 형식 |
| 페이지명 | 클릭 시 상세 모달 |
| 유형 | 배지 |
| 상태 | 배지 |
| 기간 | YY-MM-DD HH:mm ~ YY-MM-DD HH:mm |
| 영역수 | N개 (숨김 M개) |
| 최종수정 | 수정자 / 수정일시 |

### 상태 배지
전용 컴포넌트(`PageStatusBadge.tsx`) 존재. 내부적으로는 Section/Template과 동일하게
`data-product-status` 재사용(PUBLISHED→ON_SALE, SCHEDULED→RESERVED, DRAFT→DRAFT,
DEPRECATED→DISCONTINUED) — 이 예외가 프로모션 계열만이 아니라 **Display 도메인 화면 3개
전부**(Section/Template/Page)에 해당한다.

## 페이지 등록 (AddPageModal)

2-Step 등록:
1. **템플릿 선택**: 유형 필터 + 활성 템플릿 그리드 카드 (2열, 250x120px 고정)
2. **기본 정보**: 페이지명, Slug, 유형, 상태, 시작/종료 일시

등록 시 선택한 템플릿의 섹션 구성을 복사하여 초기 섹션 생성.

## 상세 모달 (PageDetail)

탭 구성: **기본정보 / 섹션편집기 / 미리보기 / 변경이력**(실제 컴포넌트명은 `logs`)

### 기본정보 탭
- 제목 + 편집 버튼 같은 줄
- 읽기 모드: 페이지ID, 페이지명, Slug, 유형, 상태, 템플릿, 시작/종료, 게시일시, 등록/수정 정보
- 편집 모드: 페이지명, Slug, 유형, 상태, 시작/종료 수정 가능

### 섹션편집기 탭
- 좌측: 섹션 목록 (순서이동, 숨김/표시, 삭제, 추가)
- 우측: 선택된 섹션의 필드 데이터 입력 폼
  - 필드 타입별 UI 렌더링 (텍스트, 링크, 숫자, 색상, 날짜시간, 선택, 이미지, 이미지배열, 상품배열, 텍스트배열)
  - 이미지배열: 그리드 카드 + 팝업으로 추가
  - 상품배열: 그리드 카드 + 검색 팝업으로 추가

### 미리보기 탭
모바일 프레임 내 섹션 블록 시각화

### 변경이력 탭
변경일시 / 변경자 / 변경내용 테이블

※ `tabs/DataMappingTab.tsx` 파일은 존재하지만 이 InnerTabs 배열에 연결되지 않음
(`decision_log` 2026-07-06 #3에 이미 기록된 알려진 이슈).

## 섹션 구조
```typescript
interface PageSection {
  sectionId: string       // SEC-0001 형식
  sectionName: string     // 영역명
  sectionType: string     // 섹션 ID (sectionCode)
  sortOrder: number
  visible: boolean
}
```

섹션 ID는 섹션 관리에서 정의된 sectionCode를 참조.

## 크로스 도메인 의존성 (2건)
- `page/mockData.ts`의 `getSectionLabel`/`getSectionColor` 함수가 `display/section/mockData.ts`의
  `MOCK_SECTIONS`를 참조 (섹션편집기 탭에서 사용)
- `AddPageModal.tsx`가 `display/template/mockData.ts`의 `MOCK_TEMPLATES`를 직접 import
  (등록 Step1의 템플릿 선택 그리드, ACTIVE만 필터)

## ⚠ 알려진 이슈 (미해결, 새로 발견한 게 아니라 ERD에 이미 기록됨)
`docs/5. 엔티티정의/runNshop_erd_v1_0.md:1046-1051`에 이미 상세히 적혀 있음 — 정책서 §3.12는
페이지 상태 7종(DRAFT/DRAFT_EDIT/PUBLISHED/SCHEDULED/RESERVED/CLOSED/CANCELLED)인데 이 화면의
Mock은 4종(PUBLISHED/SCHEDULED/DRAFT/DEPRECATED)으로 단순화돼 있다. ERD는 예약을
`cat_display_page_schedule` 별도 행으로 관리하지만 Mock은 단일 `status` 컬럼이다.
본개발 전환 시 반드시 재확인 필요 — 이 문서는 **현재 Mock 기준**으로 작성했다.
