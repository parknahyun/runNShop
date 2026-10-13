# LoginHistoryTab — 탭 정의

## Overview
| 항목 | 내용 |
|------|------|
| 상위 화면 | OperatorDetail |
| 편집 가능 | N |
| 페이지 크기 | 3행 |

---

## Layout

```
┌──────────────────────────────────────────────────┐
│  table-wrap                                      │
│  ┌──────────┬──────────────┬──────────┬────────┐ │
│  │ 일시     │ IP           │ 기기     │ 결과   │ │
│  ├──────────┼──────────────┼──────────┼────────┤ │
│  │ loginAt  │ ip           │ device   │ badge  │ │
│  │ ...      │ ...          │ ...      │ ...    │ │
│  └──────────┴──────────────┴──────────┴────────┘ │
│  (이력 없음 → colSpan=4 "이력이 없습니다.")       │
├──────────────────────────────────────────────────┤
│  MiniPager  ← 1 / N →                           │
└──────────────────────────────────────────────────┘
```

---

## 표시 항목

| 컬럼 | 데이터 | 설명 |
|------|--------|------|
| 일시 | `loginHistory[n].loginAt` | 로그인 일시 (`'YYYY-MM-DD HH:mm:ss'`) |
| IP | `loginHistory[n].ip` | 접속 IP 주소 |
| 기기 | `loginHistory[n].device` | 브라우저 / OS 정보 (예: `Chrome / macOS`) |
| 결과 | `loginHistory[n].result` | SUCCESS → '성공' 뱃지 / FAIL → '실패' 뱃지 |

테이블 컬럼 순서: 일시 → IP → 기기 → 결과

---

## States

| 상태 | 처리 |
|------|------|
| 이력 있음 | `pager.slice`의 항목을 행으로 렌더링, MiniPager 표시 |
| 이력 없음 (`pager.slice.length === 0`) | `<td colSpan={4} className="state-msg">이력이 없습니다.</td>` 메시지 표시 |

---

## Interactions

| 액션 | 동작 |
|------|------|
| MiniPager 페이지 이동 | `pager.setPage` 호출, 3행 단위로 이력 페이지 전환 |

---

## Props

| prop | 타입 | 설명 |
|------|------|------|
| history | LoginHistory[] | 표시할 로그인 이력 배열 |

```typescript
interface LoginHistory {
  loginAt: string           // 'YYYY-MM-DD HH:mm:ss'
  ip: string
  device: string
  result: 'SUCCESS' | 'FAIL'
}
```

---

## UX Rules
- `usePager(history, 3)`을 사용하여 3행 단위로 페이징한다.
- 이력 데이터가 없을 경우 테이블 내 `colSpan={4}`로 "이력이 없습니다." 메시지를 표시한다. MiniPager는 데이터 유무와 관계없이 항상 렌더링된다.
- 결과 뱃지는 `.badge` 클래스에 `data-login-result="SUCCESS"` 또는 `data-login-result="FAIL"` 속성을 부여하여 스타일을 분기한다.
- 탭은 읽기 전용이며 편집 기능이 없다.
