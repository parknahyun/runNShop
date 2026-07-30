# ScreenHistoryTab — 탭 정의

## Overview
| 항목 | 내용 |
|------|------|
| 상위 화면 | OperatorDetail |
| 편집 가능 | N |
| 페이지 크기 | 3행 |

---

## Layout

```
┌──────────────────────────────────────────────────────────┐
│  table-wrap                                              │
│  ┌──────────┬──────────┬──────────┬────────┬──────────┐  │
│  │ 일시     │ 메뉴     │ 화면     │ 액션   │ IP       │  │
│  ├──────────┼──────────┼──────────┼────────┼──────────┤  │
│  │ accessAt │ menu     │ screen   │ badge  │ ip       │  │
│  │ ...      │ ...      │ ...      │ ...    │ ...      │  │
│  └──────────┴──────────┴──────────┴────────┴──────────┘  │
│  (이력 없음 → colSpan=5 "이력이 없습니다.")               │
├──────────────────────────────────────────────────────────┤
│  MiniPager  ← 1 / N →                                   │
└──────────────────────────────────────────────────────────┘
```

---

## 표시 항목

| 컬럼 | 데이터 | 설명 |
|------|--------|------|
| 일시 | `screenHistory[n].accessAt` | 화면 접근 일시 (`'YYYY-MM-DD HH:mm:ss'`) |
| 메뉴 | `screenHistory[n].menu` | 접근한 메뉴명 (예: 주문 관리) |
| 화면 | `screenHistory[n].screen` | 접근한 화면명 (예: 주문 현황) |
| 액션 | `screenHistory[n].action` | 수행한 액션, 뱃지로 표시 |
| IP | `screenHistory[n].ip` | 접속 IP 주소 |

테이블 컬럼 순서: 일시 → 메뉴 → 화면 → 액션 → IP

---

## States

| 상태 | 처리 |
|------|------|
| 이력 있음 | `pager.slice`의 항목을 행으로 렌더링, MiniPager 표시 |
| 이력 없음 (`pager.slice.length === 0`) | `<td colSpan={5} className="state-msg">이력이 없습니다.</td>` 메시지 표시 |

---

## Interactions

| 액션 | 동작 |
|------|------|
| MiniPager 페이지 이동 | `pager.setPage` 호출, 3행 단위로 이력 페이지 전환 |

---

## Props

| prop | 타입 | 설명 |
|------|------|------|
| history | ScreenAccessHistory[] | 표시할 화면 접근 이력 배열 |

```typescript
interface ScreenAccessHistory {
  accessAt: string  // 'YYYY-MM-DD HH:mm:ss'
  menu: string
  screen: string
  action: string
  ip: string
}
```

---

## UX Rules
- `usePager(history, 3)`을 사용하여 3행 단위로 페이징한다.
- 이력 데이터가 없을 경우 테이블 내 `colSpan={5}`로 "이력이 없습니다." 메시지를 표시한다. MiniPager는 데이터 유무와 관계없이 항상 렌더링된다.
- 액션 뱃지는 `.badge` 클래스를 기본으로 하며, 액션 값이 `'수정'`이면 `op-action--write` 클래스를, 그 외(`'조회'` 등)이면 `op-action--read` 클래스를 추가 적용한다. 클래스 표현: `` `badge ${h.action === '수정' ? 'op-action--write' : 'op-action--read'}` ``
- 탭은 읽기 전용이며 편집 기능이 없다.
