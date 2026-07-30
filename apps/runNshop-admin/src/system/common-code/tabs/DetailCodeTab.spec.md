# DetailCodeTab — UI 정의

## Overview
| 항목 | 내용 |
|------|------|
| 목적 | 그룹코드에 속한 상세코드 목록을 조회하고 추가·수정한다 |
| 대상 | 운영자 (어드민) |
| 진입 경로 | CodeGroupDetail 모달 > 상세코드 목록 탭 |
| URL | (CodeGroupDetail 오버레이 내부 탭 — URL 변경 없음) |
| 관련 컴포넌트 | CodeGroupDetail, DetailCodeFormModal, MiniPager, DetailCodeStatusBadge |

---

## Layout

```
─ 조회 모드 ─────────────────────────────────────────── [편집] ─
┌──────────────────────────────────────────────────────────────┐
│ [table-wrap]                                                 │
│  코드ID │ 코드명 │ 코드값 │ 설명 │ 정렬순서 │      상태       │
│  ─────  │ ─────  │ ─────  │ ──── │ ──────  │ ─────────────  │
│  xxx    │ yyy    │ <zzz>  │ ...  │    1    │ [활성 뱃지]    │
│  ...                                                         │
│                                     (코드 없으면 안내 메시지) │
└──────────────────────────────────────────────────────────────┘
│ ‹ 1/N ›  (MiniPager — totalPages > 1 일 때만)               │

─ 편집 모드 ──────────────────────────────────────────────────
[+ 코드 추가]                                    [취소] [저장]
┌──────────────────────────────────────────────────────────────┐
│  코드ID(링크) │ 코드명 │ 코드값 │ 설명 │ [정렬순서 input] │ 상태 │
└──────────────────────────────────────────────────────────────┘
│ ‹ 1/N ›  (MiniPager)                                        │

[DetailCodeFormModal — + 코드 추가 또는 편집 모드에서 코드ID 클릭]
┌─────────────────────────────────────────┐
│ 상세코드 등록 / 상세코드 수정        [✕] │
│  코드ID*  (수정 시 disabled + 회색배경)  │
│  코드명*  │  코드값*                     │
│  설명 (full width)                      │
│  정렬순서*  │  상태* ( 활성 / 중지 / 폐기 ) │
│                          [취소] [등록/저장] │
└─────────────────────────────────────────┘
```

---

## Components

| 컴포넌트 | 역할 |
|----------|------|
| DetailCodeStatusBadge | `ACTIVE`(활성) / `SUSPENDED`(중지) / `DEPRECATED`(폐기) 뱃지. `data-detail-status` 속성으로 스타일 구분 |
| MiniPager | 상세코드 목록 내부 페이징. `usePager` 훅으로 5건/페이지 고정. totalPages가 1이면 렌더링하지 않음 |
| DetailCodeFormModal | 상세코드 등록(mode=add) / 수정(mode=edit) 소형 모달. zIndex 200으로 상위 모달 위에 렌더링 |
| pgm-toolbar | 편집 모드: 좌측 [+ 코드 추가], 우측 [취소][저장]. 조회 모드: 우측 [편집]만 |

---

## States

| 상태 | 처리 |
|------|------|
| 조회 모드 (editing = false) | `codes` prop 표시. 코드ID 셀 일반 td. 정렬순서 텍스트 표시. 우측에 [편집] 버튼 |
| 편집 모드 (editing = true) | `editCodes` 표시. 코드ID 셀 `link-cell` 클래스 + onClick. 정렬순서 number input 활성화. 툴바 버튼 변경 |
| 상세코드 없음 | tbody에 `colSpan=6` "등록된 상세코드가 없습니다." 안내 메시지 |
| DetailCodeFormModal 열림 | `codeModal` 상태에 `{ mode, code? }` 저장. 모달 렌더링 |
| DetailCodeFormModal 유효성 오류 | 등록: codeId·codeName·codeValue·sortOrder 미입력 시 "필수". 수정: codeName·codeValue·sortOrder 미입력 시 "필수". 제출 차단 |

---

## Interactions

| 액션 | 동작 |
|------|------|
| [편집] 클릭 | `codes.map((c) => ({ ...c }))` 얕은 복사 → editCodes. setEditing(true) |
| [+ 코드 추가] 클릭 | setCodeModal({ mode: 'add' }). DetailCodeFormModal 오픈 |
| 편집 모드 코드ID 셀 클릭 | setCodeModal({ mode: 'edit', code: c }). DetailCodeFormModal 오픈 |
| DetailCodeFormModal [등록] (add) | 유효성 통과 시 editCodes 배열 끝에 submitted 추가. setCodeModal(null) |
| DetailCodeFormModal [저장] (edit) | 유효성 통과 시 editCodes에서 codeId 일치 항목을 submitted로 교체. setCodeModal(null) |
| DetailCodeFormModal [✕] / [취소] | setCodeModal(null). 모달 닫힘. editCodes 변경 없음 |
| 정렬순서 인라인 input 변경 | `updateCode(globalIdx, { sortOrder: Number(value) })`. editCodes 즉시 갱신 |
| [저장] 클릭 | onCodesChange(editCodes) 호출. setEditing(false). setEditCodes([]) |
| [취소] 클릭 | setEditing(false). setEditCodes([]). 조회 모드 복귀. editCodes 버림 |
| MiniPager 페이지 변경 | pager.setPage(n). 5건씩 슬라이스 재계산 |

---

## API

```typescript
// DetailCodeTab Props
interface DetailCodeTabProps {
  codes: DetailCode[]
  onCodesChange: (codes: DetailCode[]) => void
}

// DetailCodeFormModal Props
interface DetailCodeFormModalProps {
  mode: 'add' | 'edit'
  code?: DetailCode          // edit 모드에서 초기값으로 사용
  existingCodes: DetailCode[] // nextCodeId 계산에 사용 (editCodes 전달)
  onClose: () => void
  onSubmit: (code: DetailCode) => void
}

// DetailCodeForm (내부 폼 상태)
interface DetailCodeForm {
  codeId: string
  codeName: string
  codeValue: string
  description: string
  sortOrder: string   // number input이지만 string으로 관리, 제출 시 parseInt
  codeStatus: DetailCodeStatus
}

// 유효성 검사
// add 모드: codeId, codeName, codeValue, sortOrder 필수
// edit 모드: codeName, codeValue, sortOrder 필수 (codeId는 disabled)

// nextCodeId 로직: existingCodes 기준 최대 숫자 + 1을 3자리 zero-padding
// 예) ['CODE-001', 'CODE-002'] → '003'

// globalIdx 계산: (pager.page - 1) * 5 + sliceIdx
```

---

## UX Rules

- 편집 모드 진입 시 `codes` prop을 얕은 복사(`codes.map((c) => ({ ...c }))`)하여 editCodes로 초기화한다. 원본 codes는 [취소] 시 복원된다.
- 테이블에 표시되는 데이터는 편집 모드에서 `editCodes`, 조회 모드에서 `codes` prop을 사용한다.
- 코드ID 셀은 편집 모드에서만 `link-cell` 클래스와 onClick 핸들러가 적용된다. 조회 모드에서는 일반 td.
- 코드값은 `<code>` 태그로 감싸며 `font-size: 12px` 스타일 적용.
- 정렬순서 컬럼과 상태 컬럼의 셀은 `textAlign: 'center'` 정렬.
- globalIdx는 `(pager.page - 1) * 5 + sliceIdx`로 계산하여 editCodes 배열의 실제 인덱스를 참조한다.
- DetailCodeFormModal은 `detail-modal-overlay`에 `zIndex: 200` 인라인 스타일을 적용하여 상위 모달 위에 표시된다.
- 상세코드 수정 시 코드ID는 변경할 수 없다. disabled 처리 및 `background: '#f8fafc'; color: '#64748b'` 인라인 스타일로 시각화한다.
- nextCodeId는 existingCodes(editCodes) 기준으로 기존 최대 번호 + 1을 3자리 zero-padding한 값을 반환한다.
- MiniPager는 totalPages가 1이면 렌더링하지 않는다.
- 페이지 크기는 5건 고정이다.
- 툴바 레이아웃: 편집 모드에서 좌측에 [+ 코드 추가], 우측에 [취소][저장]. 조회 모드에서 좌측 `<span />`(빈 공간), 우측에 [편집](`btn-tool--toggle`, height 28, padding 0 10px, font-size 12).
- DetailCodeFormModal 타이틀은 add 모드: "상세코드 등록", edit 모드: "상세코드 수정".
- 하단 제출 버튼은 add 모드: "등록", edit 모드: "저장".
- 상태 라디오 항목은 ACTIVE(활성) / SUSPENDED(중지) / DEPRECATED(폐기) 세 가지.
- 폼 필드 id는 `useId()`로 생성한 uid와 필드 키를 조합(`${uid}-${key}`)하여 중복을 방지한다.
