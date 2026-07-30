# PermissionsTab (Operator) — 탭 정의

## Overview
| 항목 | 내용 |
|------|------|
| 상위 화면 | OperatorDetail |
| 편집 가능 | N |
| 페이지 크기 | 5행 |

---

## Layout

```
┌──────────────────────────────────────────────────┐
│  table-wrap                                      │
│  ┌───────────────────┬────────────┬────────────┐ │
│  │ 프로그램          │   조회     │   수정     │ │
│  ├───────────────────┼────────────┼────────────┤ │
│  │ menu명            │  ✓ or —   │  ✓ or —   │ │
│  │ ...               │ ...        │ ...        │ │
│  └───────────────────┴────────────┴────────────┘ │
├──────────────────────────────────────────────────┤
│  MiniPager  ← 1 / N →                           │
└──────────────────────────────────────────────────┘
```

---

## 표시 항목

| 컬럼 | 데이터 | 설명 |
|------|--------|------|
| 프로그램 | `permissions[n].menu` | 메뉴명 (예: 주문 관리, 재고 관리 등) |
| 조회 | `permissions[n].read` | true: `✓`(`.op-perm.op-perm--on`) / false: `—`(`.op-perm.op-perm--off`) |
| 수정 | `permissions[n].write` | true: `✓`(`.op-perm.op-perm--on`) / false: `—`(`.op-perm.op-perm--off`) |

테이블 컬럼 순서: 프로그램 → 조회 → 수정. 조회·수정 컬럼은 `textAlign: center` 인라인 스타일 적용.

권한 셀은 `.op-perm-cell` 클래스를 사용하며, 값 표시 span에 `.op-perm.op-perm--on` 또는 `.op-perm.op-perm--off` 클래스를 적용한다.

---

## States

| 상태 | 처리 |
|------|------|
| 권한 데이터 있음 | `pager.slice`의 항목을 행으로 렌더링, MiniPager 표시 |
| 권한 데이터 없음 | 빈 `<tbody>` 렌더링 (별도 빈 상태 메시지 없음) |

---

## Interactions

| 액션 | 동작 |
|------|------|
| MiniPager 페이지 이동 | `pager.setPage` 호출, 5행 단위로 권한 목록 페이지 전환 |

---

## Props

| prop | 타입 | 설명 |
|------|------|------|
| permissions | OperatorPermission[] | 표시할 권한 목록 배열 |

```typescript
interface OperatorPermission {
  menu: string
  read: boolean
  write: boolean
}
```

---

## UX Rules
- `usePager(permissions, 5)`를 사용하여 5행 단위로 페이징한다.
- 이 탭은 읽기 전용이다. 권한 데이터가 없을 경우 별도 안내 메시지 없이 빈 테이블을 표시한다.
- 운영자 개별 권한 편집은 이 화면에서 지원하지 않는다. 권한 수정은 역할 현황(RoleStatus) 화면에서 역할(Role) 단위로 관리한다.
- 기본 메뉴 목록: 주문 관리 / 재고 관리 / 상품 관리 / 회원 관리 / 정산 관리 / 시스템 관리 (6개, `DEFAULT_PERMISSIONS` 기준).
