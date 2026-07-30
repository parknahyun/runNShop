# CodeGroupDetail — UI 정의

## Overview
| 항목 | 내용 |
|------|------|
| 목적 | 선택한 그룹코드의 기본 정보를 조회·수정하고, 하위 상세코드 목록을 관리한다 |
| 대상 | 운영자 (어드민) |
| 진입 경로 | CommonCodes 목록 행 클릭 |
| URL | (오버레이 모달 — URL 변경 없음) |
| 관련 컴포넌트 | BasicInfoTab, DetailCodeTab, InnerTabs |

---

## Layout

```
┌─────────────────────────────────────────────────────────────┐
│ {group.groupName}  그룹코드 상세                      [✕]   │
│ (detail-modal__title) (detail-modal__subtitle)              │
├─────────────────────────────────────────────────────────────┤
│ [기본정보] [상세코드 목록 (N)]   (InnerTabs — sticky)        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [기본정보 탭 내용 — BasicInfoTab]                           │
│  또는                                                       │
│  [상세코드 목록 탭 내용 — DetailCodeTab]                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Components

| 컴포넌트 | 역할 |
|----------|------|
| InnerTabs | sticky 모드 탭 UI. "기본정보" / "상세코드 목록 (N)" 탭 두 개 |
| BasicInfoTab | 그룹코드 기본 속성 조회·편집. `group` prop과 `codesCount` 수신 |
| DetailCodeTab | 상세코드 목록 조회·추가·수정. `codes` 상태와 `onCodesChange` 콜백 수신 |

---

## States

| 상태 | 처리 |
|------|------|
| 기본정보 탭 활성 | BasicInfoTab 렌더링. codesCount는 codes.length 실시간 반영 |
| 상세코드 목록 탭 활성 | DetailCodeTab 렌더링. codes 상태 전달 |
| 상세코드 저장 후 | codes 상태 갱신. 탭 레이블의 N 값 자동 업데이트 |

---

## Interactions

| 액션 | 동작 |
|------|------|
| 헤더 [✕] 클릭 | onClose 호출. 모달 닫힘 |
| BasicInfoTab onSave(draft) | handleBasicSave 실행. onUpdate에 `{ ...group, ...draft, codes, updatedBy: currentUser, updatedAt: now }` 전달 |
| DetailCodeTab onCodesChange(updated) | handleCodesChange 실행. setCodes(updated). onUpdate에 `{ ...group, codes: updated, updatedBy: currentUser, updatedAt: now }` 전달 |
| 탭 전환 | InnerTabs 탭 전환. sticky 모드로 스크롤 상단 이동 |

---

## API

```typescript
// 상위 CommonCodes에서 group prop으로 데이터를 받으며, 변경 시 onUpdate 콜백으로 전달한다.

interface CodeGroupDetailProps {
  group: CodeGroup       // 선택된 그룹코드 데이터
  currentUser: string    // 저장 시 updatedBy에 사용
  onClose: () => void
  onUpdate: (updated: CodeGroup) => void
}

// 내부 상태
// codes: DetailCode[]  — group.codes 초기값. 상세코드 저장 시 갱신
```

---

## UX Rules

- 모달은 `detail-modal-overlay` 위에 `detail-modal`(role="dialog", aria-modal="true")로 렌더링한다.
- 헤더에 그룹코드명(`detail-modal__title`)과 "그룹코드 상세"(`detail-modal__subtitle`)를 함께 표시한다.
- InnerTabs는 sticky 모드로 렌더링한다.
- 상세코드 탭 레이블은 내부 `codes` 상태의 배열 길이를 실시간 반영하여 `상세코드 목록 (N)` 형태로 표시한다.
- 기본정보 저장 시 현재 `codes` 상태를 함께 포함하여 onUpdate를 호출한다. 두 탭의 편집은 독립적으로 처리된다.
- updatedBy / updatedAt은 저장 시 currentUser와 현재 시각(ISO 초 단위, `YYYY-MM-DD HH:mm:ss` 형식)으로 자동 갱신한다.
- DetailCodeFormModal은 DetailCodeTab 내에서 zIndex 200으로 렌더링하여 상위 detail-modal 위에 표시된다.
