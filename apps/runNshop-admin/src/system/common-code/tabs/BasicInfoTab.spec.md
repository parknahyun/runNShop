# BasicInfoTab — UI 정의

## Overview
| 항목 | 내용 |
|------|------|
| 목적 | 선택된 그룹코드의 기본 속성을 조회하고 인라인 폼으로 편집한다 |
| 대상 | 운영자 (어드민) |
| 진입 경로 | CodeGroupDetail 모달 > 기본정보 탭 |
| URL | (CodeGroupDetail 오버레이 내부 탭 — URL 변경 없음) |
| 관련 컴포넌트 | CodeGroupDetail, CodeStatusBadge |

---

## Layout

```
─ 조회 모드 ─────────────────────────────────────────── [편집] ─
┌──────────────────────────────────────────────────────────────┐
│  [info-grid]                                                 │
│  ┌─────────────────────────┬────────────────────────────┐   │
│  │ 그룹코드ID   : {groupId}  │ 상세코드 수 : {N}건         │   │
│  │ 그룹코드명   : {groupName}│ 최초등록    : by / at      │   │
│  │ 설명        : {desc|—}  │ 최종수정    : by / at      │   │
│  │ 상태        : [뱃지]     │                            │   │
│  └─────────────────────────┴────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘

─ 편집 모드 ──────────────────────────────────────────────────
┌──────────────────────────────────────────────────────────────┐
│  [add-form]                                                  │
│  상태  ( ● 활성 ) ( ○ 비활성 )                               │
│  그룹코드명 *  [________________________]                     │
│  설명         [________________________] (full width)        │
│                                       [취소] [저장]          │
└──────────────────────────────────────────────────────────────┘
```

---

## Components

| 컴포넌트 | 역할 |
|----------|------|
| CodeStatusBadge | `ACTIVE`(활성) / `INACTIVE`(비활성) 뱃지. `data-code-status` 속성으로 스타일 구분 |
| info-grid / info-dl | 조회 모드 2컬럼 레이아웃. 좌측: groupId·groupName·description·status, 우측: codesCount·createdBy/At·updatedBy/At |
| add-form | 편집 모드 폼 레이아웃. 상태 라디오 → 그룹코드명 → 설명 → 하단 버튼 순 |

---

## States

| 상태 | 처리 |
|------|------|
| 조회 모드 (editing = false) | info-grid 표시. 우측 상단에 [편집] 버튼(btn-tool--toggle, height 28, padding 0 10px, font-size 12) |
| 편집 모드 (editing = true) | add-form 표시. 상태 라디오, 그룹코드명 input, 설명 input, [취소][저장] 버튼 |
| group prop 변경 | useEffect로 draft를 toDraft(group)으로 재초기화 |

---

## Interactions

| 액션 | 동작 |
|------|------|
| [편집] 클릭 | setEditing(true). draft는 toDraft(group)으로 이미 초기화되어 있음 |
| 상태 라디오 변경 | draft.status 업데이트 (ACTIVE / INACTIVE) |
| 그룹코드명 input 변경 | draft.groupName 업데이트 |
| 설명 input 변경 | draft.description 업데이트 |
| [저장] 클릭 | onSave(draft) 호출. setEditing(false). 조회 모드 복귀 |
| [취소] 클릭 | setDraft(toDraft(group)). setEditing(false). 조회 모드 복귀 |

---

## API

```typescript
// EditGroupDraft 타입 (BasicInfoTab.tsx에서 export)
export interface EditGroupDraft {
  groupName: string
  description: string
  status: CodeGroupStatus  // 'ACTIVE' | 'INACTIVE'
}

// Props
interface BasicInfoTabProps {
  group: CodeGroup        // 현재 그룹코드 데이터
  codesCount: number      // 현재 상세코드 수 (codes.length)
  onSave: (draft: EditGroupDraft) => void
}

// 내부 헬퍼
function toDraft(g: CodeGroup): EditGroupDraft {
  return { groupName: g.groupName, description: g.description, status: g.status }
}
```

---

## UX Rules

- 조회 모드: [편집] 버튼은 `btn-tool btn-tool--toggle` 클래스, `height: 28px`, `padding: 0 10px`, `font-size: 12px` 스타일 적용.
- 조회 모드 info-grid: 좌측 info-dl에 그룹코드ID·그룹코드명·설명·상태, 우측 info-dl에 상세코드 수·최초등록·최종수정 배치.
- 설명 값이 없으면 "—"을 표시한다.
- 편집 모드 진입 시 `toDraft(group)`으로 draft를 초기화한다. group prop이 변경될 때마다 useEffect로 draft를 재초기화한다.
- 편집 모드 add-form은 `padding: '14px 0 0'` 스타일 적용.
- 그룹코드ID는 편집 모드에서 폼 필드로 표시하지 않는다. 읽기 전용 값이므로 조회 모드 info-grid에서만 표시된다.
- 필수 필드(그룹코드명)에 `add-form__req` 스팬(asterisk)을 표시한다. 유효성 검사 없이 단순 저장 처리.
- 폼 필드 id는 `useId()`로 생성한 uid와 필드 키를 조합(`${uid}-${key}`)하여 중복을 방지한다.
- 상태 라디오 항목은 `pgm-status-radio__item` 클래스. 선택된 항목에 `pgm-status-radio__item--on` 클래스 추가.
