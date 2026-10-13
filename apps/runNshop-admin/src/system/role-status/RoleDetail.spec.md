# RoleDetail — UI 정의

## Overview
| 항목 | 내용 |
|------|------|
| 목적 | 선택한 역할(Role)의 기본정보·프로그램 접근 권한·소속 운영자를 단일 모달에서 통합 조회·편집한다 |
| 진입 경로 | RoleStatus 카드 클릭 |
| 탭 구성 | 기본정보 / 프로그램 접근 권한 (N) / 소속 운영자 (N) |
| 관련 컴포넌트 | InnerTabs, BasicInfoTab, PermissionsTab, MembersTab |

---

## Layout

```
┌──────────────────────────────────────────────────────────────────┐
│  {role.name}  권한 상세                                      [✕] │
├──────────────────────────────────────────────────────────────────┤
│  [기본정보] [프로그램 접근 권한 (N)] [소속 운영자 (N)]           │  ← sticky InnerTabs
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│   (활성 탭 콘텐츠 영역)                                          │
│   기본정보 탭       → BasicInfoTab                               │
│   프로그램 접근 권한 탭 → PermissionsTab                         │
│   소속 운영자 탭    → MembersTab                                 │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 탭 목록
| 탭 레이블 | 컴포넌트 | 편집 가능 | 설명 |
|-----------|----------|-----------|------|
| 기본정보 | BasicInfoTab | Y | 역할 이름·설명·정렬순서 조회 및 편집 |
| 프로그램 접근 권한 (N) | PermissionsTab | Y | 메뉴별 조회·수정 권한 설정 및 프로그램 추가. N은 `role.permissions.length` |
| 소속 운영자 (N) | MembersTab | Y | 역할에 소속된 운영자 목록 조회 및 추가. N은 `role.memberCount` |

---

## 공통 인터랙션
| 액션 | 동작 |
|------|------|
| 헤더 [✕] 버튼 클릭 | `onClose` 콜백 호출, 모달 닫기 |
| 탭 전환 | InnerTabs(sticky)를 통해 해당 탭 콘텐츠로 전환 |

---

## UX Rules
- 모달은 `detail-modal-overlay` + `detail-modal` 구조로 렌더링된다 (`role="dialog"`, `aria-modal="true"`).
- 헤더에 역할 이름(`detail-modal__title`)과 고정 부제목 "권한 상세"(`detail-modal__subtitle`)를 함께 표시한다.
- InnerTabs는 `sticky` 속성이 적용되어 탭 바가 스크롤 시 상단에 고정된다.
- 탭 순서: 기본정보 → 프로그램 접근 권한 → 소속 운영자.
- props: `role`, `currentUser`, `onSave`, `onClose`를 수신한다.
- 각 탭 컴포넌트는 `role`, `currentUser`, `onSave`를 props로 전달받는다.
- 탭 레이블의 카운트: 프로그램 접근 권한은 `role.permissions.length`, 소속 운영자는 `role.memberCount`를 표시한다.
