# CallLogTab — 탭 정의

## 개요
| 항목 | 내용 |
|------|------|
| 상위 화면 | ProgramDetail |
| 탭 레이블 | 최근 호출 로그 (N) |
| 편집 가능 | N |
| 페이지 크기 | 5건 고정 (MiniPager) |

---

## 표시 항목

| 컬럼 | 정렬 | 설명 |
|------|------|------|
| 호출 일시 | 좌측 | `ProgramLog.calledAt` |
| 운영자 | 좌측 | `ProgramLog.operatorName` |
| 권한 그룹 | 좌측 | RoleGroupBadge — SUPER_ADMIN(최고 관리자) / ADMIN(관리자) / OPERATOR(운영자) / VIEWER(조회자) / SYSTEM(시스템) |
| 요청 URI | 좌측 | `ProgramLog.requestUri` (`pgm-uri pgm-uri--sm` 클래스) |
| 상태코드 | 가운데 (`op-perm-cell`) | 뱃지(`data-http-status`) — `statusCode >= 400`이면 `"error"`, 미만이면 `"ok"` |
| 응답시간 | 우측 | `ProgramLog.durationMs.toLocaleString() + "ms"` (`amount-cell` 클래스) |

로그가 없을 때(`pager.slice.length === 0`): `colSpan={6}` 셀에 `"호출 로그가 없습니다."` 안내 메시지 표시.

오류 행(`statusCode >= 400`): `<tr data-pgm-log-error={true}>` 속성 부여.

---

## RoleGroupBadge 속성 규칙

| roleGroup | data 속성 |
|-----------|-----------|
| SYSTEM | `data-log-role="SYSTEM"` |
| 그 외 | `data-op-role={roleGroup}` |

---

## 인터랙션

| 액션 | 동작 |
|------|------|
| MiniPager 페이지 변경 | `pager.setPage` 호출, 5건 단위로 슬라이스 전환 |

---

## UX Rules
- 이 탭은 읽기 전용이다. 편집, 필터, 정렬 기능이 없다.
- `program.logs` 배열을 `usePager(program.logs, 5)`에 전달하여 5건씩 페이징한다.
- `statusCode >= 400`인 행에는 `data-pgm-log-error={true}` 속성을 부여하여 CSS 스타일링을 지원한다.
- `MiniPager`는 항상 렌더링된다 (숨김 여부는 공유 컴포넌트 내부 로직에 따름).
- 페이지 크기는 5건 고정이다.
- 응답시간은 `amount-cell` 클래스로 우측 정렬하여 표시한다.
