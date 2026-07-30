# ParamTab — 탭 정의

## Overview
| 항목 | 내용 |
|------|------|
| 상위 화면 | BatchJobDetail |
| 탭 레이블 | 파라미터 (N) |
| 편집 가능 | Y |

---

## Layout

```
─ 조회 모드 ─
┌──────────────────────────────────────────────┐  [편집]
│ 파라미터 키 │ 설명                             │
│ ────────── │ ──                              │
│  <code>    │ 회색 텍스트                      │
│  없음 → "등록된 파라미터가 없습니다." (colSpan=2)│
└──────────────────────────────────────────────┘

─ 편집 모드 ─
[+ 파라미터 추가]              [취소] [저장]
┌──────────────────────────────────────────────┐
│ 파라미터 키     │ 설명         │              │
│ ────────────── │ ────────── │ (삭제 열 w56) │
│ <cc-inline-input> │ <cc-inline-input> │ [삭제] │
│  없음 → "등록된 파라미터가 없습니다." (colSpan=3)│
└──────────────────────────────────────────────┘
```

---

## 표시 항목 (조회 모드)

| 컬럼 | 설명 |
|------|------|
| 파라미터 키 | `<code>` 태그로 표시 (font-size 12) |
| 설명 | 회색 텍스트 (color #64748b, font-size 12) |

파라미터가 없을 때 "등록된 파라미터가 없습니다." 안내 메시지 표시 (colSpan=2).

---

## 편집 항목 (편집 모드)

테이블 행 단위 인라인 편집. 별도 폼 모달 없음.

| 항목 | 필수 | 편집 방법 |
|------|------|----------|
| 파라미터 키 | N | 인라인 텍스트 input (cc-inline-input) |
| 설명 | N | 인라인 텍스트 input (cc-inline-input) |

편집 모드에서 테이블에 삭제 컬럼(width 56, op-perm-cell 클래스) 추가.
편집 모드 빈 메시지 colSpan = 3, 조회 모드 colSpan = 2.

---

## Interactions

| 액션 | 동작 |
|------|------|
| [편집] 클릭 | job.params 얕은 복사본으로 editParams 초기화. editing true. 편집 모드 전환 |
| [+ 파라미터 추가] 클릭 | editParams에 `{ key: '', description: '' }` 빈 행 추가 |
| 파라미터 키 input 변경 | 해당 인덱스의 editParams.key 즉시 갱신 |
| 설명 input 변경 | 해당 인덱스의 editParams.description 즉시 갱신 |
| [삭제] 클릭 | 해당 인덱스의 파라미터를 editParams에서 제거 |
| [저장] 클릭 | now = `new Date().toISOString().replace('T', ' ').slice(0, 19)`. onUpdate({ ...job, params: editParams, updatedBy: currentUser, updatedAt: now }) 호출. editing false. editParams [] 초기화 |
| [취소] 클릭 | editing false. editParams [] 초기화. 조회 모드 복귀 |

---

## Props

```ts
interface ParamTabProps {
  job         : BatchJob
  currentUser : string
  onUpdate    : (updated: BatchJob) => void
}
```

---

## UX Rules

- 편집 모드 진입 시 job.params를 얕은 복사(`job.params.map((p) => ({ ...p }))`)하여 editParams로 초기화한다. 원본 params는 [취소] 시 복원된다.
- 테이블에 표시되는 데이터는 편집 모드에서는 editParams, 조회 모드에서는 job.params를 사용한다(displayParams 변수).
- 툴바(pgm-toolbar): 편집 모드에서는 좌측에 [+ 파라미터 추가], 우측에 [취소][저장]. 조회 모드에서는 좌측 빈 span, 우측에 [편집]만.
- [편집] 버튼 스타일: btn-tool--toggle (height 28, padding 0 10px, font-size 12).
- [삭제] 버튼 스타일: btn-tool--delete (height 24, padding 0 8px, font-size 11). 삭제 셀 클래스: op-perm-cell.
- 파라미터에 대한 유효성 검사는 없다. 빈 키·설명도 저장 가능하다.
- 저장 시 updatedBy는 currentUser, updatedAt은 현재 시각(ISO 초 단위)으로 자동 갱신한다.
- 파라미터 편집은 행 단위 인라인 편집으로 처리하며, 별도 폼 모달을 사용하지 않는다.
