> ⚠️ **이 파일은 더 이상 사용되지 않습니다.** 공식 원본은 화면정의서입니다: `docs_ai/06-화면정의/admin/Display/03-Section.md` 참고.
> 앱의 "스펙(?)" 버튼 기능은 2026-07-09에 제거됐다 — 이 파일은 아무 코드에서도 읽지 않는다.
> 삭제 여부는 별도로 결정한다 (지금은 참고용으로만 남겨둠).
>
---

# 섹션 관리 (Sections)

## 개요
페이지/템플릿에서 사용하는 섹션의 종류(타입)를 정의하고 관리하는 화면.
각 섹션은 고유 ID(sectionCode)와 필드 스키마를 가짐.

## 섹션 속성
| 필드 | 설명 |
|------|------|
| sectionCode | 고유 ID (HERO_BANNER, BANNER_SLIDE 등) |
| sectionName | 라벨 (히어로 배너, 슬라이드 배너 등) |
| type | 대분류 (BANNER, PRODUCT_GRID, TEXT 등) |
| description | 설명 |
| previewColor | 미리보기 색상 |
| status | ACTIVE / INACTIVE / DEPRECATED |
| fieldCount | 정의된 필드 수 |
| sortOrder | 정렬 순서 |

## 필터바
- 키워드 (sectionCode / sectionName)
- 상태 선택 (전체/활성/비활성/폐기)
- 조회 버튼

## 요약카드
전체 / 활성 / 비활성 / 폐기 — 4개, 조회 후에만 노출

## 목록 테이블
| 컬럼 | 설명 |
|------|------|
| 순서 | sortOrder |
| 타입 ID | sectionCode |
| 라벨 | sectionName + 프리뷰 색상 칩(10x10px) 인라인 표시 (별도 컬럼 아님) |
| 설명 | description |
| 필드수 | fieldCount |
| 상태 | 배지. 전용 컴포넌트 없이 기존 `data-product-status` 속성 재사용
        (ACTIVE→ON_SALE, INACTIVE→DRAFT, DEPRECATED→DISCONTINUED로 매핑) |
| 최종수정 | 수정자 / 수정일시 |

※ `type`(대분류)은 데이터 필드로는 존재하지만 목록 테이블 컬럼으로는 노출하지 않는다.

## 상세 모달 (SectionDetail)
탭 구성: **기본 정보 / 필드 목록**

### 기본 정보 탭
- 타입 ID, 라벨, 설명, 프리뷰 색상, 정렬 순서, 상태
- 편집 모드 전환

### 필드 목록 탭
- 필드 추가/편집/삭제/순서 이동
- 필드 정의: 키, 라벨, 타입, 입력조건(필수/선택), 기본값, 플레이스홀더(텍스트만)

## 필드 타입 체계
| 타입 | 설명 | 기본값 UI |
|------|------|-----------|
| 이미지 | imageUrl + linkUrl + altText + linkTarget | 4개 입력 |
| 상품 | 상품 ID 선택 | 상품 피커 |
| 텍스트 | 단문/장문 | 텍스트 입력 + 플레이스홀더 |
| 링크 | URL | URL 입력 |
| 색상 | HEX 색상 | 컬러피커 |
| 숫자 | 정수/소수 | 숫자 입력 |
| 날짜시간 | datetime | datetime picker |
| 선택 | 공통코드 그룹 선택 | 셀렉트 (system/common-code 도메인의 `getGroupOptions()`로 그룹 목록을 채움 — 이 화면 자체 데이터 아님) |
| 이미지배열 | N개 이미지 아이템 | 그리드 카드 + 팝업 추가 |
| 상품배열 | N개 상품 | 그리드 카드 + 검색 추가 |
| 텍스트배열 | N개 텍스트 | 리스트 + 추가 버튼 |

## 이미지 필드 속성
| 속성 | 설명 |
|------|------|
| imageUrl | 이미지 소스 URL |
| linkUrl | 클릭 시 이동 경로 |
| altText | 접근성 대체 텍스트 |
| linkTarget | _self / _blank |

## 이미지배열 아이템 속성
| 속성 | 설명 |
|------|------|
| image | 이미지 필드 (4개 속성) |
| visible | 노출여부 |
| sortOrder | 노출순서 |

## Mock 데이터 (활성 섹션)
- HERO_BANNER (히어로 배너)
- BANNER_SLIDE (슬라이드 배너)
- PRODUCT_CAROUSEL (상품 캐러셀)
- PRODUCT_GRID (상품 그리드)
- IMAGE_LINK (이미지 링크)
- TEXT_BLOCK (텍스트 블록)
- COUNTDOWN_TIMER (카운트다운 타이머)
- COUPON_STRIP (쿠폰 띠배너) [비활성]
- DIVIDER_LINE (구분선) [폐기]
- MD_RECOMMEND (MD추천)
