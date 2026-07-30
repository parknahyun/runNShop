# ADM-020-008 페이지 템플릿 관리 (Template)

> 도메인 공통 사항(정책/도메인/엔티티 참조, `.spec.md` 통합 정책)은 [Display-readme.md](Display-readme.md) 참고.
>
> [신규] 원본 문서(`docs/6. 화면정의`)엔 이 화면의 상세 스펙 매핑 섹션 자체가 없었고 API
> 매핑표(52~55번)에만 등장했음. Section 화면과 동일한 형식으로 신설.

## 개요
페이지 생성 시 기본 섹션 구성을 제공하는 템플릿을 관리하는 목록 화면.
페이지는 템플릿을 **복사**(참조 아님)하여 생성하므로, 템플릿 수정이 기존 페이지에 영향 없음.

## 화면 구성

| 화면 | 화면유형 | 소스 |
|------|---------|------|
| 템플릿 목록 | 목록 (table) | `apps/runNshop-admin/src/display/template/Templates.tsx` |
| 템플릿 상세 | 상세 모달 (InnerTabs) | `apps/runNshop-admin/src/display/template/TemplateDetail.tsx` |
| 템플릿 등록 | 등록 모달 (2-Step) | `apps/runNshop-admin/src/display/template/AddTemplateModal.tsx` |
| 기본정보 탭 | 탭 (읽기/편집) | `apps/runNshop-admin/src/display/template/tabs/BasicInfoTab.tsx` |
| 영역 목록 탭 | 탭 (CRUD + 순서변경) | `apps/runNshop-admin/src/display/template/tabs/SectionsTab.tsx` |
| 페이지 목록 탭 | 탭 (읽기 전용) | `apps/runNshop-admin/src/display/template/tabs/PagesTab.tsx` |

## 템플릿 유형
| 코드 | 라벨 |
|------|------|
| HOME | 메인 |
| CATEGORY | 카테고리 |
| EXHIBITION | 기획전 |
| EVENT | 이벤트 |

## 상태
| 코드 | 라벨 |
|------|------|
| ACTIVE | 활성 |
| INACTIVE | 비활성 |
| DEPRECATED | 폐기 |

## 템플릿 목록 (TemplatePage)

### 필터바
- 키워드 (템플릿ID / 템플릿명)
- 유형 선택 (전체/메인/카테고리/기획전/이벤트)
- 상태 선택 (전체/활성/비활성/폐기)
- 조회 버튼

### 요약카드
**전체 / 활성 / 비활성 / 폐기 — 4개**, 조회 후에만 노출 (섹션 관리 화면과 동일 구성)

### 목록 테이블
| 컬럼 | 설명 |
|------|------|
| 템플릿ID | TPL-001 형식 |
| 템플릿명 | 클릭 시 상세 모달 |
| 유형 | 배지. 색상 구분 없는 plain 배지 (`data-*-status` 속성 없음) |
| 영역 수 | 섹션 개수 |
| 적용 페이지 수 | 이 템플릿 기반으로 생성된 페이지 수 |
| 상태 | 배지. 전용 컴포넌트 없이 기존 `data-product-status` 속성 재사용 (ACTIVE→ON_SALE, INACTIVE→DRAFT, DEPRECATED→DISCONTINUED로 매핑, 섹션 화면과 동일 패턴) |
| 최종수정 | 수정자 / 수정일시 |

## 템플릿 추가 (AddTemplateModal)

2-Step:
1. **기존 템플릿 선택** (복사 기반): 유형 필터 + 활성 템플릿 그리드 카드 (3열, 250x120px). "빈 템플릿으로 시작" 옵션 제공.
2. **상세 설정**: 기본 정보 탭 + 영역 목록 탭

## 템플릿 상세 (TemplateDetail)

- 헤더: 제목 "템플릿 상세 - {templateName}", 부제 templateId + 유형 배지 + 상태 배지 + 영역 수 + 적용 페이지 수, 닫기 버튼
- 탭 구성: **기본 정보 / 영역 목록 / 페이지 목록**
- 수정 제약: 없음. 페이지는 템플릿을 복사하여 생성하므로 템플릿 수정이 기존 페이지에 영향 없음

## 기본정보 탭 (BasicInfoTab)

### 읽기 모드
| 항목 | 설명 |
|------|------|
| 템플릿ID | TPL-001 형식 |
| 템플릿명 | - |
| 유형 | 배지 |
| 상태 | 배지 |
| 구성영역 수 | - |
| 적용 페이지 수 | - |
| 최초등록 | 등록자 / 등록일시 |
| 최종수정 | 수정자 / 수정일시 |

### 편집 모드
- 템플릿ID: 변경 불가
- 템플릿명: 텍스트 입력 (필수)
- 유형: 변경 불가 (disabled)
- 상태: 라디오 (활성/비활성/폐기)
- 저장/취소 버튼
- 수정 제약: 없음 (복사 방식이므로 자유 편집)

## 영역 목록 탭 (SectionsTab)

- 순서: 섹션 → 영역명
- 수정 제약: 없음 (복사 방식이므로 자유 편집)

### 테이블 컬럼 순서
| 순서 | 섹션 | 영역명 | 편집/삭제 |
|------|----------|--------|-----------|
| ↑↓ 버튼 | sectionType (배지) | sectionName | 편집/삭제 버튼 |

### 영역 추가/편집 모달
| 필드 | 설명 |
|------|------|
| 섹션 | select (sectionCode만 표시, 라벨 아님) |
| 영역명 | 기본값: `{섹션 라벨}_{번호}` |

- 영역 편집 모달에서는 섹션/영역명 모두 변경 가능

## 페이지 목록 탭 (PagesTab, 읽기 전용)

이 템플릿을 기반으로 생성된 페이지 목록을 보여주는 읽기 전용 탭.

### 테이블 컬럼
| 컬럼 | 설명 |
|------|------|
| 페이지ID | PAGE-001 형식 |
| 페이지명 | - |
| 상태 | 게시중/예약/미게시 배지 |
| 게시일시 | - |

- 읽기 전용 (이 탭에서 직접 수정 불가)
- 게시중: 실제 게시일시 표시
- 예약/미게시: 예정일 + "(예정)" 표기

## 영역 구조
```typescript
interface TemplateSection {
  sectionName: string     // 영역명
  sectionType: string     // 섹션 ID (sectionCode)
  sortOrder: number
}
```

## 크로스 도메인 의존성
- `display/section/mockData.ts`의 `MOCK_SECTIONS`를 직접 import (ACTIVE 상태만 필터) —
  영역 추가/편집의 섹션 select 옵션을 만드는 데 사용. 전용 헬퍼 함수 없음 — 화면 코드에서
  직접 filter/map 한다.
