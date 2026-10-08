# Admin 주문 목록/상세 Controller + Mock JSON

`AdminOrderController.kt`를 신규 생성해 `/api/admin/v1/orders`(목록)와 `/api/admin/v1/orders/{orderId}`(상세) 두 엔드포인트를 `AdminHomeController` 패턴(생성자 주입 `MockLoader` + `mockLoader.load("admin", ...)` + `ResponseEntity.ok(data)`)으로 구현했다. 짝을 이루는 mock JSON 2개(`order__GET_admin_v1_orders.json`, `order__GET_admin_v1_orders_{order_id}.json`)는 DL §15/§16 스키마와 `IN_DELIVERY`(운송장 등록된 `PREPARING`) 표시규칙, 그리고 상세화면 3개 탭(CS·클레임/주문문의/변경이력)이 참조하는 `claims[]`/`inquiries[]`/`logs[]`를 채운다. force-cancel(§17)은 범위 밖으로 두었고 docs/와 프론트엔드는 손대지 않았다.

Watch for: 상세 mock의 `claims[]` 항목에 `clamId`라는 오타 필드가 들어가 있다(**confirmed**) — DL 전체에서 클레임 식별자는 예외 없이 `claimId`로 쓰인다. 같은 `claims[]` 항목의 `claimType`/`status` 값도 한국어 문자열("반품", "처리중")로 들어가 있어(**likely**) DL과 FE `Claim` 인터페이스가 쓰는 영문 enum(`RETURN`/`INSPECTING` 등) 관례와 다르다.

**Verdict**: NEEDS_CHANGES

## High-level view

Controller는 기존 `AdminHomeController` 패턴을 정확히 따랐고 패키지·클래스명·매핑 경로 모두 요구사항과 일치한다. 쿼리 파라미터(`keyword/status/from/to/page/size`)는 선언만 하고 실제 필터링은 하지 않는데, 이는 플랜에 명시된 의도적 범위축소이지 결함이 아니다.

목록 mock은 7종 표시상태가 각 1건 이상 들어 있고 `summary`의 모든 카운트가 `orders[]`의 실제 상태별 건수와 정확히 일치하며 `all == totalCount == 8`이다. 필드 완전성도 문제없다.

상세 mock은 §16 구조(`items/payment/shipping/history`)를 그대로 지키면서 `claims[]`/`inquiries[]`/`logs[]`를 각 1건 이상 추가했다. `logs[]`는 `at/event/detail`로 통일되어 있고 항목 간 필드 중복은 없다. 다만 `claims[]` 항목에 `claimId` 대신 `clamId`라는 오타가 들어갔고, `claimType`/`status` 값이 DL 전역에서 쓰는 영문 enum이 아니라 화면에 표시될 한국어 레이블 그대로 박혀 있다.

빌드/실행 검증은 coder의 캡처된 메시지 자체는 간략했지만, Gradle 데몬 로그로 독립적으로 교차 확인했다: `compileKotlin`/`build` 모두 `BUILD SUCCESSFUL`, 이후 `bootRun`으로 Tomcat이 8080에서 기동되고 27초 후 `DispatcherServlet`이 최초 요청에 반응해 지연초기화된 로그가 남아 있다(수동 curl 호출의 흔적). 이후 서버는 정상적으로 종료(exit 143=SIGTERM, 수동 kill)되었고 스택트레이스나 500 에러는 없었다. 재실행 없이 이 로그만으로 "빌드·기동 성공, 요청 처리 중 크래시 없음"은 확인됐지만, 응답 바디 자체(JSON 필드 정확성)는 로그에 남지 않으므로 별도로 두 mock 파일을 직접 `json.tool`로 파싱해 문법 유효성을 스팟체크했다(둘 다 통과).

force-cancel 미구현, `docs/`·프론트엔드 무변경은 각각 확인했다(DL `order.md`의 git diff는 이 작업 이전 다른 커밋의 변경).

<details>
<summary>Issues (2)</summary>

1. **`clamId` 오타** — `order__GET_admin_v1_orders_{order_id}.json`의 `claims[]` 항목 키를 `clamId`에서 `claimId`로 수정. DL 전역(§10, §18~21, §27, §31 등)과 FE `Claim` 인터페이스가 전부 `claimId`를 쓴다.
2. **claims[] 값이 한국어 레이블** — `claimType: "반품"`, `status: "처리중"`을 DL/FE가 쓰는 영문 enum(`claimType: "RETURN"`, `status: "INSPECTING"` 등)으로 교체. 화면 레이블은 FE가 enum→한글 매핑으로 렌더링해야 다른 그리드(클레임 관리 화면 등)와 일관된다.

</details>

<details>
<summary>Details</summary>

### `clamId` 오타 (claims[])

```json
"claims": [
  { "clamId": "CLM-20260628-001", "claimType": "반품", "status": "처리중", ... }
]
```

DL `order.md`에서 클레임 ID 필드는 `claim.md/claim.md`를 포함한 모든 섹션(§10 접수, §10-1 취소, §18~21 처리/완료/반려, §27 입고확인, §31 배송비결제, §33~39 환불/폐기/반송/교환 등)에서 예외 없이 `claimId`다. FE `apps/runNshop-admin/src/order/claim/mockData.ts`의 `Claim` 인터페이스도 `claimId: string`이다. 이 mock만 `clamId`로 되어 있어 FE가 그대로 소비하면 `undefined`가 된다. 플랜 단계에서부터 이미 `clamId`로 적혀 있었던 것으로 보이는데(계획서에도 동일 오타 존재), 구현 단계에서 교차검증 없이 그대로 반영된 것으로 보인다.

### claims[] 값 언어/enum 불일치

같은 `claims[]` 항목의 `claimType: "반품"`, `status: "처리중"`은 DL과 FE 양쪽이 일관되게 쓰는 영문 enum이 아니라 화면에 보일 한글 레이블이 그대로 데이터 값으로 들어가 있다. DL 전역에서 `claimType`은 `RETURN`/`EXCHANGE`(§10, §19-1 등)이고, FE `Claim.claimType`도 `'CANCEL' | 'RETURN' | 'EXCHANGE'` 유니온 타입이다. `claim.md` 와이어프레임의 "반품"·"⦿처리중"은 FE가 enum을 한글 배지로 매핑해 그린 결과이지, API가 그 자체로 한글 문자열을 반환한다는 의미가 아니다. 이 mock을 그대로 쓰면 FE가 뱃지 매핑 로직 대신 하드코딩된 한글 비교를 하게 될 위험이 있다. DL이 이 특정 sub-schema(`GET /api/admin/v1/orders/{orderId}` 응답의 `claims[]`)를 명시적으로 정의하지 않아 "likely" 수준으로 분류했지만, 같은 프로젝트의 다른 모든 claim 관련 스키마와 반대 방향이라는 점은 명확하다.

### 목록 mock — 상태 분포·summary 정합성

7종 표시상태(`ORDER_RECEIVED/PAYMENT_COMPLETED/PREPARING/IN_DELIVERY/DELIVERED/CONFIRMED/CANCELLED`)가 각 1건 이상(`PAYMENT_COMPLETED`는 2건) 들어 있고, `summary`의 8개 카운트 필드가 `orders[]`의 실제 상태별 건수와 정확히 일치하며 `all(8) == totalCount(8) == len(orders)`다. `orders[]` 각 항목은 `orderId/platformOrderNo/productName/customer/vendorName/status/amount/orderDate` 전부를 갖추고 있다. `IN_DELIVERY` 항목(`ord-004`)은 상세 mock에서도 `trackingNumber`가 채워진 상태로 일관되게 표현되어, "PREPARING + 운송장 등록 = IN_DELIVERY" 규칙이 목록·상세 양쪽에서 맞게 반영됐다.

### 빌드/실행 검증 — coder 기록 vs 독립 교차확인

coder의 최종 메시지는 "빌드·실행 검증까지 완료했습니다"라는 한 줄뿐이라 그 자체로는 증거가 빈약하다. 재실행 없이 로컬 Gradle 데몬 로그(`~/.gradle/daemon/8.8/daemon-3161.out.log`, `daemon-3795.out.log`)를 읽어 교차검증했다: `currentDir=.../api/runNshop-api`에서 두 차례 `BUILD SUCCESSFUL`(최초 8s, 증분 790ms)이 있었고, `bootRun`으로 Tomcat이 8080에서 기동된 뒤 27초 후 `DispatcherServlet`이 최초 요청에 반응해 지연초기화됐다(실제 HTTP 요청이 왔다는 흔적). 이후 서버는 exit code 143(SIGTERM, 수동 종료)으로 끝났고 스택트레이스·500 에러 로그는 없었다. 응답 바디 내용 자체는 액세스 로그에 남지 않으므로, 두 mock JSON 파일은 별도로 `python3 -m json.tool`로 직접 파싱해 문법 유효성만 스팟체크했다(둘 다 통과).

### 범위 준수

`force-cancel`(POST `.../force-cancel`) 관련 코드는 `order/controller` 디렉터리 어디에도 없다. `git status` 기준 이 작업으로 추적되지 않은 파일은 `AdminOrderController.kt`와 mock JSON 2개뿐이며, `docs/.../DL-인터페이스명세/order.md`의 수정 시각(12:08)은 이 작업의 plan.md 생성 시각(12:18)보다 앞서 있어 이번 작업과 무관한 선행 변경임을 확인했다. `apps/` 하위에는 plan.md보다 최신인 파일이 없다.

</details>

<details>
<summary>파일 변경 목록</summary>

- `api/runNshop-api/src/main/kotlin/com/runnshop/order/controller/AdminOrderController.kt` — 신규. GET 목록/상세 2개 메서드.
- `api/runNshop-api/src/main/resources/mock/admin/order__GET_admin_v1_orders.json` — 신규. 7종 상태 샘플 + summary + pagination.
- `api/runNshop-api/src/main/resources/mock/admin/order__GET_admin_v1_orders_{order_id}.json` — 신규. §16 구조 + claims/inquiries/logs.

전체 diff는 `git status --porcelain`(untracked 3개 파일)로 확인 가능. 리포지토리 루트: `/Users/fepest/Projects/runNshop`.

</details>
