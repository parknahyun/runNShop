---
name: screen-to-fe-code
description: DN-화면레이아웃 설계 문서를 읽고 runNshop admin/partner/mobile 프론트엔드 Next.js 코드로 변환한다. 화면 구현, 화면 코드 생성, 또는 기존 화면의 하드코딩된 mock 데이터를 백엔드 API 연동 구조로 전환할 때 사용.
---

# 화면설계 → FE 코드 변환

## 입력
- DN 문서 경로: `docs/deliverables/S3-상세설계/DN-화면레이아웃/{app}/{domain}/{screen}.md`
- 문서 섹션: 메타블록(화면ID·앱·호출API) / 와이어프레임 / 화면 구성(영역별 데이터소스) / 화면 전환 / 유효성 검증 / 상태별 UI
- 1차 근거: DL-인터페이스명세(API 스키마), 도메인정의서/정책서. 후행 산출물(화면 내 안내 UI 텍스트, 비공식 참고자료)은 역참조하지 않는다 — DL/도메인정의서와 충돌하면 DL/도메인정의서가 우선.

## 데이터 흐름 원칙 (반드시 지킬 것)

```
FE 컴포넌트 → lib/api.ts (fetch) → Controller (Spring Boot) → MockLoader → mock/{channel}/*.json → 응답
```

- **하드코딩 전면 금지**: 화면 폴더에 `MOCK_XXX` 같은 데이터 배열을 두고 `useState(MOCK_XXX)`로 초기화하는 패턴은 금지. 모든 목록/상세 데이터는 `lib/api.ts`의 `api()`로 fetch한 결과만 쓴다.
- **조회 트리거는 전부 서버 재요청**: 필터 조회 버튼 클릭, 페이지 번호 변경, 페이지 크기 변경 — 이 3가지 전부 서버에 새 쿼리로 fetch한다. "전체 목록을 한 번에 받아서 클라이언트가 `.filter()`/`.slice()`로 재가공"하는 방식은 쓰지 않는다. 쿼리 파라미터(`keyword`, `status`, `from`, `to`, `page`, `size`)는 서버(Controller)가 실제로 처리해 필터링+페이징된 결과와 `pagination`(page/size/totalCount/totalPages)을 응답으로 돌려주고, FE는 그 응답을 그대로 상태에 반영한다.
- **집계(SummaryBar 등)도 서버 응답 기준**: 상태별 건수 같은 집계는 서버가 응답에 `summary` 블록으로 내려주고, FE가 로컬에서 `.filter().length`로 재계산하지 않는다.
- **목록→상세 이동 시 ID만 조건으로 전달**: 목록 row 객체 전체를 상세 컴포넌트에 넘기지 않는다. 상세 컴포넌트는 `{domain}Id`를 props(또는 라우트 파라미터)로 받아 자체적으로 `GET /{resource}/{id}` API를 호출해 최신 데이터를 가져온다. 필터가 바뀌어도, 상세로 들어갔다 나와도 항상 서버의 최신 데이터를 보게 하기 위함.
- **상세 화면 내 하드코딩 금지**: 상세 탭/섹션 안에 적힌 옵션명·PG사명·주소·운송장번호 같은 더미 값은 전부 상세 API 응답 필드로 교체한다.

## 절차

### 1. 문서 파싱
- 메타블록에서 화면ID, 앱(admin/partner/mobile), 호출 API 목록 추출
- "호출 API"가 가리키는 DL-인터페이스명세 문서를 열어 요청/응답 스키마, 쿼리 파라미터, 응답 필드명(대소문자 표기 그대로) 확인
- 화면 구성 표에서 영역별 데이터 소스(API vs FE 상태) 구분
- 같은 리소스를 가리키는 여러 API 문서(예: admin용/partner용)의 필드명이 다르면(예: `customer` vs `customerName`) **각 DL 스펙 그대로 유지**한다 — 억지로 통일하지 않는다. 통일하는 건 "FE 코드가 camelCase를 쓴다"는 네이밍 컨벤션 수준이지, 서로 다른 API의 필드 의미까지 맞추는 게 아니다.

### 2. 네이밍 컨벤션 — FE는 camelCase로 통일
- admin/partner/mobile 전체 FE 타입·컴포넌트 필드 참조는 **camelCase**로 통일한다. (과거 일부 화면이 snake_case를 쓴 사례가 있었으나 이는 DL-인터페이스명세와 불일치하는 임의 관례였음 — 발견 시 교정 대상)
- DB 컬럼(snake_case) ↔ Kotlin Entity 필드(camelCase) ↔ Response DTO(camelCase) ↔ JSON(camelCase) ↔ FE(camelCase) 매핑은 Spring의 `SpringPhysicalNamingStrategy`(JPA 기본값) 또는 MyBatis `resultMap`이 표준적으로 처리하는 영역이라, FE가 camelCase로 통일되어도 추후 실 DB/Mapper 연동 단계에서 문제가 없다. 이 부분은 재검토 불필요(확정 사항).

### 3. 화면 유형 판별 (admin/partner인 경우)
`.kiro/steering/admin-guide.md` 기준으로 분류:
- 현황 화면(table): `.filter-bar → .summary-bar → .table-wrap → .pagination`
- 상세/등록/수정: 반드시 모달(`.detail-modal-overlay` + `.detail-modal`, InnerTabs) 또는 MDI 탭
- 메인 대시보드: `.dashboard__head` + `.dashboard__grid`

mobile인 경우 `.kiro/steering/nextjs-guide.md`의 App Router + Tailwind 패턴을 따른다. 동적 라우트가 필요한 상세 화면은 기존에 올바르게 구현된 화면(예: `app/my/claims/[claimId]/page.tsx` — async Server Component + `params: Promise<{id}>` await + `api<T>()` try/catch)을 템플릿으로 삼는다.

### 4. API/Mock 존재 확인

**Controller 분리 전 병합 가능성 먼저 확인** (`.kiro/steering/api-design-rules.md`): 여러 앱(admin/partner/mobile)에 "같은 기능"을 제공해야 한다고 해서 자동으로 Controller를 앱 수만큼 쪼개지 않는다. FE 개수가 아니라 **업무(응답 스키마·권한)가 같은지**가 기준이다.
- 먼저 DL-인터페이스명세에서 각 앱의 요청/응답 스키마를 나란히 비교한다.
- 응답 필드와 권한(노출 범위)이 완전히 동일하면 → 하나의 메서드에 여러 URL을 매핑한다 (`@GetMapping("/api/v1/x", "/api/admin/v1/x", "/api/partner/v1/x")`).
- 하나라도 다르면(필드 추가/제외, 민감정보 노출 차이 등) → 앱별 Controller로 분리한다. 이때도 Service는 가능하면 공유한다(도메인당 단일 Service + 앱별 메서드 — 절차 4의 Service 네이밍 참고).
- 임의로 "FE가 여러 개니 Controller도 여러 개"라고 가정하지 말고, 이 비교를 먼저 거친 뒤 결정한다.

**레이어 경계 — mock.json은 Mapper/Store 응답으로 간주한다**:
```
Controller (요청/응답만, 얇게 유지) → Service (필터/정렬/페이징/집계 — Mapper SQL의 대체물) → MockLoader (JSON 로딩 — DB 접근의 대체물)
```
`mock/{channel}/*.json`에 담긴 데이터는 "Repository/Mapper가 쿼리했다면 돌려줬을 데이터"로 취급한다. 따라서 그 데이터를 가공(필터링, 정렬, 페이징, summary 집계)하는 로직은 **Controller에 직접 넣지 않고 Service 클래스로 분리**한다 (`kotlin-guide.md`가 정의한 `service/` 레이어 책임과 일치). Controller가 `MockLoader`를 직접 주입받아 바로 호출하는 패턴(과거 일부 Controller가 이렇게 돼 있었음)은 발견 시 Service 레이어를 끼워 넣는 리팩터링 대상이다. 이렇게 분리해두면 추후 실제 DB 연동 시 Service 내부만 `MockLoader → Repository/Mapper` 호출로 교체하면 되고 Controller는 변경이 없다.

- `api/runNshop-api/src/main/kotlin/com/runnshop/{domain}/controller/`에 해당 Controller·엔드포인트 존재 확인
- `docs/deliverables/S3-상세설계/DP-클래스설계/{domain}.md`에 Service 클래스명·메서드 시그니처가 이미 정의돼 있는지 먼저 확인한다 — **있으면 그 네이밍을 그대로 따른다** (임의로 새 Service 클래스명을 만들지 않는다). 보통 **도메인당 단일 `{Domain}Service`** 안에 앱별 메서드(`getAdminOrders(filter)`, `getPartnerOrders(vendorId, filter)`, `getMyOrders(memberId, page, size, status)` 등)로 나뉘는 패턴이다 — Controller는 앱별로 분리하되(`api-design-rules.md`) Service는 도메인당 하나로 모으는 게 기본값이다. DP-클래스설계에 해당 메서드가 없으면(신규 화면) 기존 메서드 네이밍 패턴과 일관되게 새 메서드를 추가한다.
- `api/runNshop-api/src/main/kotlin/com/runnshop/{domain}/service/`에 해당 Service 클래스 존재 확인. 없으면 DP-클래스설계 문서 그대로 신규 생성. Service가 `MockLoader`를 주입받아 데이터를 읽고 가공, Controller는 Service를 호출만 한다.
- `api/runNshop-api/src/main/resources/mock/{v1|admin|partner}/`에 `{domain}__{METHOD}_{PATH}.json` 존재 확인 — **이 위치/네이밍은 workspace steering(`mock-data-rules.md`)에 고정된 규칙이므로 변경하지 않는다.**
- 없으면 DL-인터페이스명세 문서의 응답 스키마대로 Mock JSON 생성 (`{"code":"SUCCESS","data":{...}}` 표준 구조)
- 목록 API라면 Mock JSON에 전체 데이터셋(여러 건, 다양한 status)을 담아두고, **Service 메서드가 쿼리 파라미터로 이 데이터셋을 필터링+페이징해서 응답**하도록 구현한다 (Mock JSON 자체를 쿼리별로 여러 개 만들지 않는다). `AdminOrderController.kt` 스타일(클래스 레벨 `@RequestMapping`)을 참고하되, 필터/페이징 로직은 Controller가 아니라 주입받은 Service의 메서드에 위임하도록 구현한다.
- 상세 API는 하드코딩 제거 대상 필드(옵션/결제수단/주소 등)를 전부 응답에 포함시킨다.

### 5. FE 파일 생성/수정
admin/partner 파일 구조 (`.kiro/steering/admin-guide.md` 참조):
```
src/{domain}/{screen-name}/
  {ScreenName}.tsx          ← 현황 화면
  {ScreenName}Detail.tsx    ← 상세 모달/탭
  types.ts                  ← 타입 + 상태→라벨 매핑 (구 mockData.ts — 하드코딩 데이터 제거 후 리네임)
  tabs/
```
mobile 파일 구조: `app/{path}/page.tsx` (+ 상세는 `app/{path}/[id]/page.tsx`) + `components/{domain}/`

**`types.ts`로 명명** — 과거 `mockData.ts`라는 이름으로 하드코딩 데이터 배열과 타입을 함께 두던 관례가 있었으나, 이번부터는 신규 화면 생성 시 처음부터 `types.ts`로 만든다. 내용은 다음 두 가지로 한정:
1. 타입 정의 (`interface Order`, `type OrderStatus` 등) — API 응답의 FE측 계약
2. 상태값→표시 라벨 매핑 (`ORDER_STATUS_LABEL` 등) — 순수 UI 표시 변환 로직, 서버가 안 내려줘도 되는 영역이라 FE에 남아도 됨

**`types.ts`에 두지 않는 것**:
- 하드코딩된 데이터 배열(`MOCK_XXX`) — 두지 않음
- 클라이언트 필터 함수(`filterXxx()`) — 서버 책임이므로 Controller로 이전, FE에서 제거

**기존 화면을 전환할 때**: `mockData.ts`가 남아있는 화면을 이 패턴으로 옮길 경우, 데이터 배열/필터 함수를 제거한 뒤 파일을 `types.ts`로 리네임하고 import 구문도 전부 갱신한다 (단, 이미 별도 작업 지시로 "파일명 유지"가 명시된 범위가 있다면 그 지시를 우선한다).

**백엔드는 해당 없음** — 백엔드에는 `mockData`류의 TS/Kotlin 파일이 존재하지 않는다. Mock 데이터는 `resources/mock/{channel}/*.json` 순수 JSON 파일로 두고 `common/MockLoader.kt`(공용 컴포넌트)가 로딩한다 — 이 구조는 그대로 유지, 변경하지 않는다. 응답 타입을 Kotlin DTO로 명시하고 싶다면(`Map<String,Any>` 대신) `com.runnshop.{domain}/dto/`에 `{Domain}ListResponse.kt` 등으로 추가한다 — Service(`service/`)에는 비즈니스 로직만 두고 요청/응답 데이터 구조는 DTO 패키지 책임으로 분리한다.

**컴포넌트 작성 규칙**:
- 데이터는 전부 `lib/api.ts`를 통해 fetch (하드코딩 금지)
- 필터 변경/페이지 변경/페이지크기 변경 시마다 서버 재요청, 응답을 그대로 state에 반영 (재가공 없음)
- 등록/수정/삭제 버튼: 실제 API 호출하되 결과는 Mock 성공 응답 → Toast로 "저장되었습니다" 안내, 또는 범위 밖 기능이면 "프로토타입에서는 지원하지 않는 기능입니다" 안내
- 유효성 검증은 문서의 "유효성 검증" 섹션 그대로 구현
- "상태별 UI" 섹션(로딩/빈 결과/에러)을 조건 분기로 구현
- "화면 전환" 섹션의 트리거 → 이동 화면을 실제 네비게이션/탭 오픈으로 연결 (목록 row 클릭 시 상세로는 ID만 전달)

### 6. 검증
```bash
cd api/runNshop-api && ./gradlew build -x test   # API 변경 시
cd apps/runNshop-{app} && npm run build           # FE 빌드 확인
```
- 서버 기동 후 `curl`로 신규/수정 엔드포인트가 쿼리 파라미터에 따라 실제로 다른 결과를 돌려주는지 확인 (고정 JSON 그대로 반환하는 회귀가 없는지)
- 개발 서버는 사용자가 직접 실행 (`npm run dev`), 수동으로 화면 진입·조회·필터·페이지 이동·상세 진입 동작 확인 요청

## 프레임워크 독립성 참고
`lib/api.ts`(순수 fetch 함수)와 `mockData.ts`(타입+라벨맵, 순수 TS)는 React 전용 문법이 없어 Vue 등으로 포팅해도 그대로 재사용 가능하다. React 전용 부분(`useState`/`useEffect` 등 hooks, JSX)만 해당 프레임워크 문법으로 치환되고, "필터/페이지 변경 → API 호출 → 상태 갱신 → 서버 응답 그대로 렌더"라는 데이터 흐름 패턴 자체는 유지된다. 이 원칙(절차 1~5)을 지키면 FE 프레임워크 교체에도 뼈대가 보존된다.

## 참고 steering
- `.kiro/steering/admin-guide.md` — admin/partner 화면 패턴
- `.kiro/steering/nextjs-guide.md` — Next.js 공통 규칙
- `.kiro/steering/mock-data-rules.md` — Mock 파일 네이밍
- `.kiro/steering/api-design-rules.md` — Controller 분리 기준
- `.kiro/steering/kotlin-guide.md` — Controller/Service/dto 패키지 구조
- `.kiro/steering/coding-standards.md` — 공통 코딩 규칙
- `.kiro/steering/work-scope.md` — 도메인 작업 범위, 1차 근거 우선 원칙
