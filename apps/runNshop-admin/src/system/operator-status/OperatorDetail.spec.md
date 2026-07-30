# OperatorDetail — UI 정의

## Overview
| 항목 | 내용 |
|------|------|
| 목적 | 선택한 운영자의 기본정보·권한·로그인이력·화면접근이력을 단일 모달에서 통합 조회·편집한다 |
| 대상 | 운영자 (어드민) |
| 진입 경로 | OperatorStatus 목록 행 클릭 |
| 관련 컴포넌트 | BasicInfoTab, PermissionsTab, LoginHistoryTab, ScreenHistoryTab, InnerTabs |

---

## Layout

```
┌──────────────────────────────────────────────────────────────────┐
│  {operator.name}  운영자 상세                                [✕] │
├──────────────────────────────────────────────────────────────────┤
│  [기본정보] [프로그램 접근 권한] [로그인 이력] [화면 접근 이력]  │  ← sticky InnerTabs
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│   (활성 탭 콘텐츠 영역)                                          │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 탭 목록
| 탭 레이블 | 컴포넌트 | 편집 가능 | 설명 |
|-----------|----------|-----------|------|
| 기본정보 | BasicInfoTab | Y | 운영자 신원·역할·상태 조회 및 편집 |
| 프로그램 접근 권한 | PermissionsTab | N | 메뉴별 조회·수정 권한을 읽기 전용으로 표시 |
| 로그인 이력 | LoginHistoryTab | N | 로그인 일시·IP·기기·결과 이력 |
| 화면 접근 이력 | ScreenHistoryTab | N | 화면 접근 일시·메뉴·화면·액션·IP 이력 |

---

## States

| 상태 | 처리 |
|------|------|
| 초기 (기본정보 탭) | `BasicInfoTab`이 조회 모드로 렌더링된다 |
| 편집 모드 | `BasicInfoTab` 내부에서 `editing` 상태를 관리하며, 편집 폼으로 전환된다 |

---

## Interactions

| 액션 | 동작 |
|------|------|
| 헤더 [✕] 버튼 클릭 | `onClose` 콜백 호출, 모달 닫기 |
| 탭 전환 | InnerTabs(sticky)를 통해 해당 탭 콘텐츠로 전환 |
| BasicInfoTab [저장] 클릭 | `onUpdate(updated)` 콜백으로 변경사항을 상위(OperatorStatus)에 전달 |

---

## Props

| prop | 타입 | 설명 |
|------|------|------|
| operator | Operator | 표시할 운영자 데이터 |
| currentUser | string | 편집 저장 시 `updatedBy`에 기록할 현재 사용자 ID |
| onClose | () => void | 모달 닫기 콜백 |
| onUpdate | (updated: Operator) => void | 편집 저장 후 상위에 변경된 운영자 데이터를 전달하는 콜백 |

---

## UX Rules
- 모달은 `detail-modal-overlay` + `detail-modal` 구조로 렌더링된다 (`role="dialog"`, `aria-modal="true"`).
- 헤더에 운영자 이름(`detail-modal__title`)과 고정 부제목 "운영자 상세"(`detail-modal__subtitle`)를 함께 표시한다.
- InnerTabs는 `sticky` 속성이 적용되어 탭 바가 스크롤 시 상단에 고정된다.
- 탭 순서는 기본정보 → 프로그램 접근 권한 → 로그인 이력 → 화면 접근 이력이다.
- OperatorDetail 자체는 탭 상태를 관리하지 않는다. 탭 전환은 InnerTabs 컴포넌트 내부에서 처리된다.
- 편집 상태(`editing`)는 BasicInfoTab 내부에서 독립적으로 관리된다. OperatorDetail은 편집 여부를 알지 못한다.
- 편집 후 저장 시 `onUpdate(updated)` 콜백으로 변경사항을 상위에 전달한다.
