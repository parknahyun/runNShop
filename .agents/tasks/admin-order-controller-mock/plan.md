# Implementation Plan — Admin Order Controller & Mock JSON

## 사전 조사 결과 요약

- **서버 포트**: `api/runNshop-api/src/main/resources/application.yml`에 `server.port: 8080` 확인. 추가 조치 불필요.
- **기존 패턴**: `AdminHomeController.kt`(`com.runnshop.config.controller`)는 `@RequestMapping("/api/admin/v1/home")` 클래스 레벨 매핑 + 생성자 주입 `MockLoader` + 각 메서드가 `mockLoader.load("admin", "파일명.json")` 호출 후 `ResponseEntity.ok(data)` 반환. `CustomerOrderController.kt`(`com.runnshop.order.controller`)는 클래스 레벨 매핑 없이 메서드별 전체 경로를 쓰는 다른 스타일이지만, admin 전용 신규 Controller는 API 설계 규칙(admin 별도 Controller)과 기존 admin 패턴(AdminHomeController)을 따르는 것이 더 적합 → **클래스 레벨 `@RequestMapping("/api/admin/v1/orders")` 방식 채택**.
- **MockLoader**: `load(channel: String, filename: String): Map<String, Any>`. 리소스 경로는 `mock/$channel/$filename`. 수정 불필요, 그대로 재사용.
- **Order(주문) 도메인 폴더**: `api/runNshop-api/src/main/kotlin/com/runnshop/order/controller/`에 이미 `CustomerOrderController.kt`, `CustomerCartController.kt` 존재. 새 파일 `AdminOrderController.kt`를 같은 폴더에 추가.
- **Mock 디렉터리**: `api/runNshop-api/src/main/resources/mock/admin/`에 기존 파일 4개(`config__GET_home_alerts.json`, `config__GET_home_pending.json`, `config__GET_home_summary.json`, `order__GET_home_trend.json`) 확인. 응답 포맷은 전부 `{ "code": "SUCCESS", "data": {...} }` 준수.
- **스펙 문서**: `docs/.../DL-인터페이스명세/order.md` §15(목록), §16(상세) 확인. §15는 7종 "표시 status" 매핑표(`ORDER_RECEIVED`/`PAYMENT_COMPLETED`/`PREPARING`/`IN_DELIVERY`/`DELIVERED`/`CONFIRMED`/`CANCELLED`)와 응답 예시(orders[] + pagination, summary는 §15 JSON 예시엔 없고 list.md 와이어프레임에 SummaryBar로 존재)를 명시. §16은 상세 응답 예시(orderId~history)를 제공.
- **list.md**(화면 레이아웃)에 SummaryBar가 전체/접수/결제완료/준비중/배송중/배송완료/구매확정/취소 8개 카드로 명시되어 있어, 목록 API 응답에 `summary` 블록이 필요함을 재확인(사용자 지시 원문에도 포함).
- **claim.md/inquiry.md/log.md**: 상세 화면의 3개 탭이 각각 `claims[]`(clamId, claimType, status, refundAmount, extraShippingFee, extraShippingFeeStatus, receivedAt), `inquiries[]`(inquiryId, type, status, writer, createdAt), `logs[]`(일시/이벤트/상세 — §16의 `history[]`를 재사용, 필드명은 화면 요구에 맞춰 `at`/`event`/`detail`로 통일) 데이터를 `GET /api/admin/v1/orders/{orderId}` 응답에서 가져옴.
- **FE 참고 샘플**(`mockData.ts`): `OrderStatus` 타입에 `ORDER_RECEIVED`가 빠져 있고 6종만 존재(최신 7종 규칙 반영 전 버전) → 그대로 베끼지 않고 7종 규칙에 맞게 새로 구성.
- **스코프 보완 지침(사용자 추가 지시, 워크플로 알림)**: mock JSON은 **구조/스키마만** 정확하면 되고, 세부 데이터 값의 완성도(실제 분포, summary 숫자 정합성 등)는 이번 범위에서 과도하게 다듬지 않는다. 단, 7종 status 중 최소 1건씩 샘플에 넣는 것과 summary 필드 자체를 포함하는 것은 "구조"에 해당하므로 유지한다(숫자가 정확히 일치하지 않아도 무방).

---

- [ ] 1. `AdminOrderController.kt` 신규 생성 — admin 주문 목록/상세 Controller.
      패키지: `com.runnshop.order.controller`. 클래스 레벨 `@RequestMapping("/api/admin/v1/orders")`, 생성자로 `MockLoader` 주입(AdminHomeController 패턴).
      메서드 2개:
      - `@GetMapping fun searchOrders(): ResponseEntity<Any>` → `mockLoader.load("admin", "order__GET_admin_v1_orders.json")` 반환. (쿼리 파라미터 `keyword/status/from/to/page/size`는 요청에서 받되 실제 필터링 없이 무시 — 사용자 지시 "mock은 정적 JSON 하나를 그대로 반환"을 따름. 파라미터는 `@RequestParam(required = false)`로 선언해 Swagger/문서화 목적만 충족하거나, 완전히 생략해도 되지만 API 스펙과의 가시적 일치를 위해 선언형으로 받는다.)
      - `@GetMapping("/{orderId}") fun getOrderDetail(@PathVariable orderId: String): ResponseEntity<Any>` → `mockLoader.load("admin", "order__GET_admin_v1_orders_{order_id}.json")` 반환(orderId 값 무관하게 항상 동일 응답).
      force-cancel(API-024)은 만들지 않음(범위 밖, 사용자 지시 "하지 않을 것" 준수).
      Files: `api/runNshop-api/src/main/kotlin/com/runnshop/order/controller/AdminOrderController.kt`
      Verify: `./gradlew compileKotlin` (cwd: `api/runNshop-api`) — 컴파일 성공.

- [ ] 2. `order__GET_admin_v1_orders.json` 신규 생성 — 목록 mock.
      구조: `{ "code": "SUCCESS", "data": { "orders": [...], "summary": {...}, "pagination": {...} } }`.
      `orders[]` 각 항목 필드: `orderId, platformOrderNo, productName, customer, vendorName, status, amount, orderDate`. 7종 status(`ORDER_RECEIVED, PAYMENT_COMPLETED, PREPARING, IN_DELIVERY, DELIVERED, CONFIRMED, CANCELLED`) 각 최소 1건씩 포함(총 7~8건 정도, `mockData.ts`의 샘플 상품명/고객명/입점사명을 참고해 자연스러운 값으로 구성하되 그대로 복붙하지 않음).
      `summary`: `{ "all": N, "orderReceived": N, "paymentCompleted": N, "preparing": N, "inDelivery": N, "delivered": N, "confirmed": N, "cancelled": N }` — orders[] 건수와 대략 맞춰 작성(사용자 보완 지시에 따라 완벽한 정합성은 필수 아님, 구조만 맞으면 됨).
      `pagination`: `{ "page": 1, "size": 10, "totalCount": N, "totalPages": 1 }`.
      Files: `api/runNshop-api/src/main/resources/mock/admin/order__GET_admin_v1_orders.json`
      Verify: `python3 -m json.tool order__GET_admin_v1_orders.json > /dev/null` (cwd: mock/admin 디렉터리) — JSON 문법 오류 없이 통과.

- [ ] 3. `order__GET_admin_v1_orders_{order_id}.json` 신규 생성 — 상세 mock.
      구조는 §16 예시를 기준으로: `{ "code": "SUCCESS", "data": { "orderId", "platformOrderNo", "status", "customer", "vendorName", "amount", "orderDate", "items": [...], "payment": {...}, "shipping": {...}, "history": [...], "claims": [...], "inquiries": [...], "logs": [...] } }`.
      - `items[]`: §16 예시대로 `productName, optionName, quantity, unitPrice, subtotal`.
      - `payment`: `method, pgProvider, transactionId, paidAt`.
      - `shipping`: `recipientName, phone, address, carrier, trackingNumber` (trackingNumber 값을 채워서 status가 `IN_DELIVERY`인 샘플로 구성 — "IN_DELIVERY는 PREPARING 상태에서 송장번호가 있는 상태"라는 사용자 확정 규칙을 상세 응답에도 반영).
      - `history[]`: §16 예시대로 `fromStatus, toStatus, changedBy, createdAt` 유지(기존 필드명 그대로, 중복 생성 안 함).
      - `claims[]`(claim.md 근거): 1건 이상, 필드 `clamId, claimType, status, refundAmount, extraShippingFee, extraShippingFeeStatus, receivedAt`.
      - `inquiries[]`(inquiry.md 근거): 1건 이상, 필드 `inquiryId, type, status, writer, createdAt`.
      - `logs[]`(log.md 근거, "일시/이벤트/상세" 요구): 1건 이상, 필드 `at, event, detail` — `history[]`와는 별개 배열로 둔다(§16 JSON의 `history`는 상태 전이 로그이고 화면 log.md가 요구하는 타임라인 포맷(`at/event/detail`)과 필드명이 다르므로, 사용자 지시의 "history를 logs로 간주해도 됨, 다만 필드명을 화면 요구에 맞출 것"에 따라 `logs[]`를 `at/event/detail` 필드로 새로 작성하고 `history[]`는 §16 원래 필드명 그대로 유지 — 두 배열이 공존하되 중복 의미의 필드를 억지로 통일하지 않음).
      Files: `api/runNshop-api/src/main/resources/mock/admin/order__GET_admin_v1_orders_{order_id}.json`
      Verify: `python3 -m json.tool "order__GET_admin_v1_orders_{order_id}.json" > /dev/null` (cwd: mock/admin 디렉터리) — JSON 문법 오류 없이 통과.

- [ ] 4. 전체 빌드 및 기동 확인.
      `AdminOrderController`가 Spring 컨텍스트에 정상 등록되고 두 mock 파일을 올바르게 로드하는지 확인.
      Files: 없음(검증 전용 단계)
      Verify: `./gradlew build` (cwd: `api/runNshop-api`) 성공 후, 서버 기동(`./gradlew bootRun` 백그라운드) → `curl -s http://localhost:8080/api/admin/v1/orders`와 `curl -s http://localhost:8080/api/admin/v1/orders/ord-001` 호출해 각각 `"code":"SUCCESS"`와 기대 필드가 포함된 JSON이 반환되는지 확인 후 서버 종료.
