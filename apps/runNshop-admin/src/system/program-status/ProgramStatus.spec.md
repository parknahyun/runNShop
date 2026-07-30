# ProgramStatus — UI 정의

## Overview
| 항목 | 내용 |
|------|------|
| 목적 | 시스템에 등록된 프로그램(화면·API·배치·이벤트)을 조회·추가·수정하고, 운영 지표 및 호출 로그를 모니터링한다 |
| 대상 | 운영자 (어드민) |
| 진입 경로 | 어드민 > 시스템 관리 > 프로그램 현황 |
| URL | /system/program-status |
| 관련 컴포넌트 | FilterBar, SummaryBar, Toolbar, ProgramTable, Pagination, ProgramDetail, AddProgramModal |

---

## Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  프로그램 현황                                                    [스펙]      │
├─────────────────────────────────────────────────────────────────────────────┤
│  [프로그램명] [도메인] [전체 유형 ▾] [전체 상태 ▾]  [조회]                  │
├─────────────────────────────────────────────────────────────────────────────┤
│  로딩 중: "불러오는 중..." 메시지 (loading=true일 때)                        │
├──────────────────────────────────────┬──────────────────────────────────────┤
│  SummaryBar (displayed.length > 0)   │  [+ 프로그램 추가]                   │
│  전체 N개 | 운영 N개                  │                                      │
│  (비활성 N개) (⚠ 폐기예정 N개)        │                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│  프로그램ID │ 프로그램명 │ 유형 │ 도메인 │ URI │ 버전 │ 상태 │ 30일 호출 │ 평균 응답 │ 오류율 │
│  (행 클릭 → ProgramDetail 모달)                                              │
│  (displayed.length === 0) "조회 버튼을 눌러 프로그램 목록을 불러오세요."      │
├─────────────────────────────────────────────────────────────────────────────┤
│  [7개 ▾]  ← 1 / N →                                                         │
└─────────────────────────────────────────────────────────────────────────────┘

[ProgramDetail 모달]
┌──────────────────────────────────────────────────────┐
│  {프로그램명}  프로그램 상세                      [✕] │
├──────────────────────────────────────────────────────┤
│  [기본정보] [최근 호출 로그 (N)]    (InnerTabs sticky)│
├──────────────────────────────────────────────────────┤
│  (기본정보 탭 → BasicInfoTab)                         │
│  (최근 호출 로그 탭 → CallLogTab)                     │
└──────────────────────────────────────────────────────┘

[프로그램 추가 모달 (small)]
┌──────────────────────────────────────┐
│  프로그램 추가                    [✕] │
├──────────────────────────────────────┤
│  프로그램명*  (full width)            │
│  유형* │ HTTP 메서드(API만) │ 상태*   │
│  URI*  (full width)                   │
│  도메인* │ 버전* │ 담당팀*            │
│  설명 (textarea, rows=2, full width)  │
│                       [취소]  [등록]  │
└──────────────────────────────────────┘
```

---

## Components

| 컴포넌트 | 역할 |
|----------|------|
| FilterBar | 프로그램명·도메인 텍스트 검색 + 유형·상태 셀렉트 필터 + 조회 버튼 |
| SummaryBar | 조회 결과 기준 전체·운영·(비활성)·(폐기예정) 개수 카드 표시. `displayed.length > 0`일 때만 렌더링 |
| Toolbar | `+ 프로그램 추가` 버튼. SummaryBar 유무와 관계없이 항상 표시 |
| ProgramTable | 프로그램 목록 테이블. 행 클릭 시 ProgramDetail 모달 오픈. 오류율 > 1%이면 셀에 경고 스타일 |
| TypeBadge | 유형 뱃지 (PAGE / API / BATCH / EVENT). `data-pgm-type` 속성 |
| StatusBadge | 상태 뱃지 (ACTIVE / INACTIVE / DEPRECATED). `data-pgm-status` 속성 |
| Pagination | 페이지 크기 선택(7/14/30/50/100) + 페이지 이동 |
| ProgramDetail | 선택 프로그램의 기본 정보·호출 로그를 표시하는 모달 컴포넌트 |
| AddProgramModal | 프로그램 신규 등록 소형 모달 |

---

## States

| 상태 | 처리 |
|------|------|
| 초기 / 조회 결과 없음 | `displayed.length === 0`이면 "조회 버튼을 눌러 프로그램 목록을 불러오세요." 메시지 표시. SummaryBar·테이블·페이지네이션 비표시 |
| 로딩 중 | `loading=true`이면 "불러오는 중..." 메시지 표시. SummaryBar·테이블 영역 전체 숨김 |
| 조회 결과 있음 | SummaryBar + 테이블 + 페이지네이션 표시 |
| 비활성(INACTIVE) 프로그램 존재 | SummaryBar에 "비활성 N개" 카드 추가 표시 |
| 폐기예정(DEPRECATED) 프로그램 존재 | SummaryBar에 경고색 "⚠ 폐기예정 N개" 카드 추가 표시 |
| 폐기예정 행 | 테이블 행에 `data-pgm-deprecated=true` 속성 적용 |
| 오류율 > 1% | 해당 셀에 `pgm-error-rate--warn` 클래스로 경고 스타일 적용 |
| 유형이 API일 때 (추가 모달) | HTTP 메서드 선택 필드 표시. 다른 유형 선택 시 메서드 필드 숨기고 method 값 초기화 |
| 유효성 오류 (추가 모달) | 프로그램명·URI·도메인·버전·담당팀 미입력 시 필드 하단 `add-form__err` 오류 메시지 표시 |

---

## Interactions

| 액션 | 반응 |
|------|------|
| 필터 입력 후 [조회] 클릭 | 300ms 로딩 후 필터 결과를 `displayed`에 반영, 페이지 1로 리셋 |
| 테이블 행 클릭 | `allPrograms`에서 해당 programId를 찾아 `detailProgram`에 설정, ProgramDetail 모달 오픈 |
| ProgramDetail 내 저장 | `onUpdate` 콜백으로 변경된 program 전달. `allPrograms` 갱신 후 현재 필터로 `displayed` 재계산. `detailProgram`도 갱신 |
| ProgramDetail [✕] 클릭 | `detailProgram` null로 초기화, 모달 닫기 |
| [+ 프로그램 추가] 클릭 | `showAdd=true`, AddProgramModal 오픈 |
| 추가 모달 [등록] 클릭 | 유효성 검사 통과 시 신규 프로그램을 `allPrograms`에 추가, 현재 필터로 `displayed` 재계산, 모달 닫기 |
| 추가 모달 유형 변경 | API 선택 시 HTTP 메서드 필드 표시, 다른 유형 선택 시 필드 숨기고 method 빈 문자열로 초기화 |
| 추가 모달 [취소] / [✕] 클릭 | 모달 닫기 |
| 페이지 크기 변경 | `pageSize` 갱신, 페이지 1로 리셋 |
| 페이지 이동 버튼 | 이전/다음 페이지로 이동 |

---

## API

```typescript
// 현재 구현은 목(mock) 데이터 기반. 실제 API 연동 시 아래 엔드포인트 사용 예정.

// 프로그램 목록 조회
GET /api/system/programs
  Query: name?, domain?, type?: PAGE|API|BATCH|EVENT|ALL
         status?: ACTIVE|INACTIVE|DEPRECATED|ALL
         page, pageSize
  Response: { data: Program[], total: number }

// 프로그램 상세 조회
GET /api/system/programs/:programId
  Response: Program (logs 포함)

// 프로그램 등록
POST /api/system/programs
  Body: { name, description?, type, method?, uri, domain, version, owner, status }
  Response: Program

// 프로그램 수정
PUT /api/system/programs/:programId
  Body: { name, description?, type, method?, uri, domain, version, owner, status }
  Response: Program

// Program 타입
interface Program {
  programId: string            // 예: PGM-001
  name: string
  description: string
  type: 'PAGE' | 'API' | 'BATCH' | 'EVENT'
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'  // type === 'API'일 때만
  uri: string
  domain: string
  version: string
  owner: string                // 담당팀
  status: 'ACTIVE' | 'INACTIVE' | 'DEPRECATED'
  callCount30d: number         // 최근 30일 호출 수
  avgDurationMs: number        // 평균 응답 시간 (ms)
  errorRate: number            // 오류율 (%)
  logs: Array<{
    calledAt: string
    operatorName: string
    roleGroup: 'SUPER_ADMIN' | 'ADMIN' | 'OPERATOR' | 'VIEWER' | 'SYSTEM'
    requestUri: string
    statusCode: number
    durationMs: number
  }>
  createdBy: string
  createdAt: string            // 'YYYY-MM-DD HH:mm:ss'
  updatedBy: string
  updatedAt: string
}

type ProgramType   = 'PAGE' | 'API' | 'BATCH' | 'EVENT'
type ProgramStatus = 'ACTIVE' | 'INACTIVE' | 'DEPRECATED'
type ProgramMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface ProgramFilter {
  name: string
  domain: string
  type: ProgramType | 'ALL'
  status: ProgramStatus | 'ALL'
}
```

---

## UX Rules

- 조회 버튼을 명시적으로 눌러야만 목록을 불러온다. 페이지 진입 시 자동 조회하지 않는다.
- `displayed.length === 0`이면 초기 상태와 조회 결과 없음을 구분하지 않고 동일 메시지("조회 버튼을 눌러 프로그램 목록을 불러오세요.")를 표시한다.
- SummaryBar는 `displayed.length > 0`일 때만 표시한다. 비활성·폐기예정 카드는 해당 건이 1개 이상일 때만 추가로 표시한다.
- Toolbar(`+ 프로그램 추가` 버튼)는 SummaryBar와 같은 `op-summary-row` 행에 항상 표시된다.
- 오류율이 1%를 초과하면 목록 테이블 해당 셀에 `pgm-error-rate--warn` 클래스 경고 스타일을 적용한다.
- 폐기예정(DEPRECATED) 행은 `data-pgm-deprecated=true` 속성으로 CSS 스타일링을 지원한다.
- 유형이 API일 때만 HTTP 메서드 선택 필드가 표시된다. 다른 유형으로 변경하면 method가 빈 문자열('')로 초기화된다.
- URI는 목록 테이블에서 `pgm-uri` 클래스로 모노스페이스 표시된다.
- 30일 호출 수·평균 응답 시간·오류율 컬럼은 `amount-cell` 클래스로 우측 정렬 표시한다.
- 신규 프로그램 추가 시 `callCount30d`, `avgDurationMs`, `errorRate`는 0, `logs`는 빈 배열로 초기화된다.
- 프로그램 ID는 기존 allPrograms 중 최대 숫자 + 1로 자동 채번한다 ('PGM-NNN' 형식, 3자리 0 패딩).
- 추가 모달에서 상태 선택지는 운영(ACTIVE) / 비활성(INACTIVE)만 제공한다. 폐기예정은 편집 모드에서만 설정 가능하다.
- 페이지 크기 선택지: 7 / 14 / 30 / 50 / 100. 기본값 7.
- 페이지 크기 변경 시 페이지는 1로 리셋된다.
