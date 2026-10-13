# BasicInfoTab (ProgramStatus) — 탭 정의

## 개요
| 항목 | 내용 |
|------|------|
| 상위 화면 | ProgramDetail |
| 탭 레이블 | 기본정보 |
| 편집 가능 | Y |
| 편집 진입 | 기본 정보 섹션 우상단 [편집] 버튼 클릭 |

---

## 표시 항목 (조회 모드)

**기본 정보 섹션** (`detail-section`, `marginTop: 0`)

섹션 헤더(`detail-section__head`): 좌측 "기본 정보" 제목, 우측 [편집] 버튼(`btn-tool--toggle`, height 28, padding 0 10px, font-size 12)

좌우 2컬럼 `info-grid` (각 컬럼은 `info-dl`):

**좌측 컬럼**
| 항목 | 설명 |
|------|------|
| 프로그램 ID | `program.programId` |
| 프로그램명 | `program.name` |
| 유형 | TypeBadge (`data-pgm-type` 속성) |
| 도메인 | `program.domain` |
| URI | `pgm-uri` 클래스. `program.method`가 있으면 `[{method}] {uri}` 형식으로 표시 |

**우측 컬럼**
| 항목 | 설명 |
|------|------|
| 버전 | `program.version` |
| 담당팀 | `program.owner` |
| 상태 | StatusBadge (`data-pgm-status` 속성) |
| 최초등록 | `{program.createdBy} / {program.createdAt}` |
| 최종수정 | `{program.updatedBy} / {program.updatedAt}` |

`info-grid` 아래: `program.description`이 있을 때 `<p className="pgm-desc">`로 설명 단락 표시.

**운영 지표 섹션** (`detail-section`)

제목: "운영 지표 (최근 30일)"

`pgm-metrics` 컨테이너 안에 3개의 `pgm-metric-card`:

| 카드 | 값 | 라벨 |
|------|-----|------|
| 총 호출 수 | `program.callCount30d.toLocaleString()` | 총 호출 수 |
| 평균 응답 시간 | `program.avgDurationMs.toLocaleString() + "ms"` | 평균 응답 시간 |
| 오류율 | `program.errorRate.toFixed(1) + "%"` | 오류율 |

오류율 카드: `errorRate > 1`이면 `pgm-metric-card--warn` 클래스 추가.

---

## 편집 항목 (편집 모드)

기본 정보 섹션만 편집 모드로 전환. 운영 지표 섹션은 항상 조회 전용.

편집 폼 필드 렌더링 순서:

| 순서 | 항목 | 필수 | 설명 |
|------|------|------|------|
| 1 | 상태 | N | 라디오 버튼 — ACTIVE(운영) / INACTIVE(비활성) / DEPRECATED(폐기예정). `pgm-status-radio` 컨테이너 |
| 2 | 프로그램명 | Y | 텍스트 입력 (`add-form__field--full`) |
| 3 | 유형 | N | select — PAGE / API / BATCH / EVENT |
| 3 | HTTP 메서드 | N | select — GET / POST / PUT / PATCH / DELETE. 유형이 API일 때만 렌더링 |
| 3 | 버전 | Y | 텍스트 입력 |
| 3 | 담당팀 | Y | 텍스트 입력 |
| 4 | URI | Y | 텍스트 입력 (`add-form__field--full`) |
| 5 | 도메인 | Y | 텍스트 입력 |
| 6 | 설명 | N | textarea (`rows=2`, `add-form__field--full`) |

폼 하단: [취소] / [저장] 버튼 (`add-form__footer`)

---

## 인터랙션

| 액션 | 동작 |
|------|------|
| [편집] 클릭 | `editing = true`. `toDraft(program)`으로 `draft` 초기화, 편집 폼으로 전환 |
| 상태 라디오 변경 | `draft.status` 업데이트 |
| 프로그램명 입력 | `draft.name` 업데이트 |
| 유형 select 변경 | `draft.type` 업데이트, `draft.method = ''` 초기화 |
| HTTP 메서드 select 변경 | `draft.method` 업데이트 (API 유형일 때만 표시) |
| 버전 입력 | `draft.version` 업데이트 |
| 담당팀 입력 | `draft.owner` 업데이트 |
| URI 입력 | `draft.uri` 업데이트 |
| 도메인 입력 | `draft.domain` 업데이트 |
| 설명 textarea 변경 | `draft.description` 업데이트 |
| [저장] 클릭 | `validate()` 실행. 오류 있으면 제출 차단. 통과 시 `onUpdate` 호출, `editing = false`, `errors` 초기화 |
| [취소] 클릭 | `toDraft(program)`으로 `draft` 복구, `errors` 초기화, `editing = false` |

---

## 유효성 검사

| 필드 | 오류 조건 | 메시지 |
|------|-----------|--------|
| 프로그램명 | 빈 문자열 | 필수 |
| URI | 빈 문자열 | 필수 |
| 도메인 | 빈 문자열 | 필수 |
| 버전 | 빈 문자열 | 필수 |
| 담당팀 | 빈 문자열 | 필수 |

오류 메시지는 각 필드 하단에 `add-form__err` 스팬으로 표시. 모든 오류를 동시에 표시.

---

## UX Rules
- 조회 모드에서 기본 정보 섹션 헤더(`detail-section__head`) 우측에 [편집] 버튼을 표시한다.
- 편집 모드에서는 [편집] 버튼을 숨기고 폼 하단에 [취소][저장] 버튼을 표시한다.
- 유형이 API일 때만(`needsMethod = draft.type === 'API'`) HTTP 메서드 select를 렌더링한다. 유형 변경 시 `draft.method`를 `''`로 초기화한다.
- 운영 지표 섹션은 편집 모드에서도 항상 표시된다. 편집 전환은 기본 정보 섹션에만 적용된다.
- `EditDraft` 타입: `{ name, description, type, method: ProgramMethod | '', uri, domain, version, owner, status }`.
- 폼 필드 id는 `useId()`로 생성한 `uid`와 필드 키를 조합(`${uid}-${key}`)하여 중복을 방지한다.
- 저장 시 `updatedBy`는 `currentUser`, `updatedAt`은 현재 시각(ISO 초 단위, `'YYYY-MM-DD HH:mm:ss'`)으로 자동 갱신한다.
- `draft.method`가 빈 문자열(`''`)이면 `onUpdate` 시 `undefined`로 변환하여 전달한다.
- 오류율 카드는 `errorRate > 1`이면 `pgm-metric-card--warn` 클래스로 시각적 경고를 표시한다.
