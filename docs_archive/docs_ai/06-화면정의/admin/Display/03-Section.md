# ADM-020-010 섹션 관리 (Section)

> 도메인 공통 사항(정책/도메인/엔티티 참조, `.spec.md` 통합 정책)은 [Display-readme.md](Display-readme.md) 참고.

## 개요
페이지/템플릿에서 사용하는 섹션의 종류(타입)를 정의하고 관리하는 화면.
각 섹션은 고유 ID(sectionCode)와 필드 스키마를 가진다.

## 화면 구성

| 화면 | 화면유형 | 소스 |
|------|---------|------|
| 섹션 목록 | 목록 (table) | `apps/runNshop-admin/src/display/section/Sections.tsx` |
| 섹션 상세 | 상세 모달 (InnerTabs) | `apps/runNshop-admin/src/display/section/SectionDetail.tsx` |
| 섹션 등록 | 등록 모달 (InnerTabs) | `apps/runNshop-admin/src/display/section/AddSectionModal.tsx` |
| 기본정보 탭 | 탭 (읽기/편집/등록) | `apps/runNshop-admin/src/display/section/tabs/BasicInfoTab.tsx` |
| 필드관리 탭 | 탭 (CRUD + 순서변경) | `apps/runNshop-admin/src/display/section/tabs/FieldsTab.tsx` |
| 필드 추가/편집 | 서브 모달 | `apps/runNshop-admin/src/display/section/tabs/AddFieldModal.tsx` |

## 섹션 속성

| 필드 | 설명 |
|------|------|
| sectionCode | 고유 ID (HERO_BANNER, BANNER_SLIDE 등, 영문 대문자 + 언더스코어) |
| sectionName | 라벨 (히어로 배너, 슬라이드 배너 등) |
| type | 대분류 (BANNER, PRODUCT_GRID, TEXT 등) |
| description | 설명 |
| previewColor | 미리보기 색상 |
| status | ACTIVE / INACTIVE / DEPRECATED |
| fieldCount | 정의된 필드 수 |
| sortOrder | 정렬 순서 |

## 섹션 목록 (Sections)

### 필터바
- 키워드 (sectionCode / sectionName)
- 상태 선택 (전체/활성/비활성/폐기)
- 조회 버튼

### 요약카드
**전체 / 활성 / 비활성 / 폐기 — 4개**, 조회 후에만 노출
← [수정] 원본 문서(`docs/6. 화면정의`)는 "전체/활성/비활성"(3개)로 폐기 카드가 누락돼 있었음

### 목록 테이블 컬럼
순서 / 타입ID / 라벨(프리뷰 색상칩 인라인) / 설명 / 필드수 / 상태 / 최종수정
← [수정] 원본 스펙 파일엔 "대분류" 컬럼이 있고 "설명"·"순서" 컬럼이 없어 실제 구현과 반대로 기술돼 있었음

| 컬럼 | 설명 |
|------|------|
| 순서 | sortOrder |
| 타입 ID | sectionCode |
| 라벨 | sectionName + 프리뷰 색상 칩(10x10px) 인라인 표시 (별도 컬럼 아님) |
| 설명 | description |
| 필드수 | fieldCount |
| 상태 | 배지. 전용 컴포넌트 없이 기존 `data-product-status` 속성 재사용 (ACTIVE→ON_SALE, INACTIVE→DRAFT, DEPRECATED→DISCONTINUED로 매핑) ← [신규] 원본에 구현방식 언급 없었음 |
| 최종수정 | 수정자 / 수정일시 |

※ `type`(대분류)은 데이터 필드로는 존재하지만 목록 테이블 컬럼으로는 노출하지 않는다.

## 섹션 상세 (SectionDetail)

- 헤더: 제목 "섹션 상세 - {sectionName}", 부제 sectionCode + type 배지 + 상태 배지 + 필드 수, 닫기 버튼
- 모달 외부 클릭 시 닫기
- 탭 구성: **기본 정보 / 필드 목록** (각 탭 독립적으로 편집/저장)

## 섹션 등록 (AddSectionModal)

### 입력 필드
| 필드 | 설명 | 비고 |
|------|------|------|
| 타입 ID | sectionCode (영문 대문자 + 언더스코어) | 필수, 중복 불가 |
| 라벨 | 한글 표시명 | 필수 |
| 대분류 | type 선택 (BANNER, PRODUCT_GRID 등) | 필수 |
| 설명 | 섹션 설명 | - |
| 프리뷰 색상 | 컬러피커 | 기본 #f1f5f9 |
| 상태 | 활성/비활성 라디오 | 기본 활성 |

- 저장 시 목록에 추가, 취소 시 모달 닫기

## 기본정보 탭 (BasicInfoTab)

### 읽기 모드 (info-grid)
| 항목 | 설명 |
|------|------|
| 타입 ID | sectionCode |
| 라벨 | sectionName |
| 설명 | description |
| 프리뷰 색상 | 색상 칩 + hex |
| 상태 | 활성/비활성/폐기 배지 |
| 정렬 순서 | sortOrder |
| 최초등록 | 등록자 / 등록일시 |
| 최종수정 | 수정자 / 수정일시 |

### 편집 모드 (add-form)
- 타입 ID: 변경 불가 (disabled)
- 라벨: 텍스트 입력 (필수)
- 설명: 텍스트 입력
- 프리뷰 색상: 컬러피커 + hex 입력
- 정렬 순서: 숫자 입력
- 상태: 라디오 (활성/비활성/폐기)
- 저장/취소 버튼
- 수정 제약: 없음 (자유 편집 가능)

## 필드관리 탭 (FieldsTab)

- 로컬 state 기반 CRUD, 순서변경(↑↓), 최종 저장 시 API 일괄 전송

### 테이블 컬럼
| 컬럼 | 설명 |
|------|------|
| 순서 | ↑↓ 이동 버튼 |
| 필드 키 | code 스타일 표시 |
| 라벨 | 한글명 |
| 타입 | 배지 |
| 입력조건 | 필수(빨간 원) / 선택(—) |
| 기본값 | 값 또는 — |
| 편집/삭제 | 버튼 |

### 섹션 type별 기본 필드 구성
| type | 필드 |
|------|------|
| BANNER | 섹션 제목(텍스트), 이미지 목록(이미지배열), 노출방법(선택), 최대 수(숫자) |
| PRODUCT_GRID | 섹션 제목(텍스트), 상품 목록(상품배열), 노출방법(선택), 열 수(숫자) |
| PRODUCT_CAROUSEL | 섹션 제목(텍스트), 상품 목록(상품배열), 노출방법(선택), 더보기 링크(링크) |
| TEXT | 내용(텍스트), 배경색(색상) |
| IMAGE_LINK | 이미지(이미지) |
| COUNTDOWN | 제목(텍스트), 목표 일시(날짜시간) |
| COUPON_BAND | 버튼 문구(텍스트), 배경색(색상), 글자색(색상) |
| DIVIDER | 높이(숫자), 배경색(색상) |

### 동작
- "+" 필드 추가 → AddFieldModal 팝업
- 편집 → AddFieldModal (initialData 전달)
- 삭제 → 목록에서 제거
- ↑↓ → 순서 변경

## 필드 추가/편집 모달 (AddFieldModal)

### 입력 필드
| 필드 | 설명 | 비고 |
|------|------|------|
| 필드 키 | camelCase 식별자 | 편집 시 변경 불가 |
| 라벨 | 한글 표시명 | 필수 |
| 타입 | 필드 타입 선택 | 필수 |
| 입력조건 | 필수 / 선택 라디오 | - |
| 기본값 | 타입별 UI 분기 | - |
| 플레이스홀더 | 텍스트 타입일 때만 표시 | - |

### 배치 순서
1. 필드 키 + 라벨
2. 타입 + 입력조건
3. 기본값 + 플레이스홀더(텍스트만)
4. 취소 / 저장(수정) 버튼

## 필드 타입 체계 (11종)

이미지, 상품, 텍스트, 링크, 색상, 숫자, 날짜시간, **선택**(원본엔 "노출선택"으로 오기), 이미지배열, 상품배열, 텍스트배열

| 타입 | 설명 | 기본값 UI |
|------|------|-----------|
| 이미지 | imageUrl + linkUrl + altText + linkTarget | 4개 입력 |
| 상품 | 상품 ID 선택 | 상품 피커 |
| 텍스트 | 단문/장문 | 텍스트 입력 + 플레이스홀더 |
| 링크 | URL | URL 입력 |
| 색상 | HEX 색상 | 컬러피커 |
| 숫자 | 정수/소수 | 숫자 입력 |
| 날짜시간 | datetime | datetime picker |
| 선택 | **공통코드 그룹 선택**(`common/commonCode.getGroupOptions()`) — 이 화면 도메인의 데이터가 아니라 시스템 > 공통코드 도메인 데이터를 그대로 가져다 쓴다 | 셀렉트 (그룹코드 목록) |
| 이미지배열 | N개 이미지 아이템 | 그리드 카드 + 팝업 추가 |
| 상품배열 | N개 상품 | 그리드 카드 + 검색 추가 |
| 텍스트배열 | N개 텍스트 | 리스트 + 추가 버튼 |

← [수정] 원본은 "선택" 타입의 기본값 UI를 "Layered/Carousel/Tiled 셀렉트"로 기술했으나 이는
실제 구현과 무관한 내용이었음(Layered/Carousel/Tile은 SectionType 자체의 `layoutType` 속성이고,
필드 타입과는 별개).

### 이미지 필드 속성
| 속성 | 설명 |
|------|------|
| imageUrl | 이미지 소스 URL |
| linkUrl | 클릭 시 이동 경로 |
| altText | 접근성 대체 텍스트 |
| linkTarget | _self / _blank |

### 이미지배열 아이템 속성
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

## 크로스 도메인 의존성
- `common/commonCode.getGroupOptions()` (system > 공통코드 도메인 데이터 직접 참조) — "선택" 타입의
  기본값 드롭다운을 채우는 데 사용. 전용 헬퍼 함수는 없고 화면 코드에서 직접 참조한다.
  ← [신규] 원본에 명시 없었음
