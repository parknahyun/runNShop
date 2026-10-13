# ProgramDetail — UI 정의

## Overview
| 항목 | 내용 |
|------|------|
| 목적 | 선택한 프로그램의 기본 정보·운영 지표를 조회·수정하고, 최근 호출 로그를 확인한다 |
| 진입 경로 | ProgramStatus 목록 행 클릭 |
| 탭 구성 | 기본정보 / 최근 호출 로그 (N) |
| 관련 컴포넌트 | InnerTabs, BasicInfoTab, CallLogTab |

---

## Layout

```
┌─────────────────────────────────────────────────────────────┐
│ {program.name}  프로그램 상세                          [✕]  │
├─────────────────────────────────────────────────────────────┤
│ [기본정보] [최근 호출 로그 (N)]   (InnerTabs sticky)        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   (활성 탭 콘텐츠 영역)                                     │
│   기본정보 탭 → BasicInfoTab                                │
│   최근 호출 로그 탭 → CallLogTab                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 탭 목록
| 탭 레이블 | 컴포넌트 | 편집 가능 | 설명 |
|-----------|----------|-----------|------|
| 기본정보 | BasicInfoTab | Y | 프로그램 기본 속성 및 운영 지표 조회·수정 |
| 최근 호출 로그 (N) | CallLogTab | N | 프로그램 호출 로그 목록. N은 `program.logs.length` |

---

## 공통 인터랙션
| 액션 | 동작 |
|------|------|
| 헤더 [✕] 클릭 | `onClose` 호출, 모달 닫힘 |
| 기본정보 저장 | `onUpdate`에 변경된 program(updatedBy/updatedAt 갱신 포함) 전달 |

---

## UX Rules
- 모달은 `detail-modal-overlay` 위에 `detail-modal`(`role="dialog"`, `aria-modal="true"`)로 렌더링한다.
- 헤더에 프로그램명(`detail-modal__title`)과 고정 부제목 "프로그램 상세"(`detail-modal__subtitle`)를 함께 표시한다.
- InnerTabs는 `sticky` 모드로 렌더링한다.
- 최근 호출 로그 탭 레이블은 `program.logs.length`를 반영하여 "최근 호출 로그 (N)" 형태로 표시한다.
- props: `program`, `currentUser`, `onClose`, `onUpdate`를 수신한다.
- `onUpdate`는 BasicInfoTab에서 저장 시 호출된다. 변경된 Program 객체를 상위(ProgramStatus)로 전달한다.
