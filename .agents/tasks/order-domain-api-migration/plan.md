# Implementation Plan — Order 도메인 Mock→API 전환

> 이 작업은 FEAT 아티팩트(task.json, context.json, features/FEAT-00{1..4}.json, 같은 디렉터리)로도 분해되어
> 있다. 워크플로우가 FEAT 기반 코더 루프로 교체되면 이 plan.md는 참고용이며, 교체되지 않으면 이 체크리스트를
> 그대로 순서대로 수행한다. 각 항목의 상세 근거/와이어프레임 참조는 FEAT JSON의 `steps`에 더 촘촘히 적혀 있다.

## 0. 사전 확인 (완료, 기록용)
- 1차 근거: `docs/deliverables/S3-상세설계/DL-인터페이스명세/order.md` §11/§15/§16/§22/§23/§30, `DP-클래스설계/order.md`(OrderService 메서드 네이밍), `DN-화면레이아웃/admin/order-history/*.md`, `partner.md` §13, `mobile.md` §8/§8-1.
- 레이어 경계(사용자 확정): Controller(요청/응답만) → `com.runnshop.order.service.OrderService`(단일 클래스, 메서드로 앱별 분리: `getMyOrders`/`getAdminOrders`/`getPartnerOrders` + detail 메서드, 필터/정렬/페이징/집계 전부 이 안에서 수행, MockLoader 주입) → `MockLoader`(JSON 로딩, 변경 없음). `AdminOrderService`/`PartnerOrderService`처럼 앱별로 Service를 쪼개지 않는다.
- Mock 파일 위치/네이밍(mock-data-rules.md)은 변경하지 않는다.
- FE 필드는 전체 camelCase로 통일하되, DL 스펙상 의미가 다른 필드(admin `customer` vs partner `customerName`)는 통일하지 않고 각 DL 그대로 유지한다.
- 목록→상세는 orderId만 전달, 상세 컴포넌트가 자체적으로 상세 API를 호출한다.

## 1. 백엔드 — OrderService 레이어 추가 + Controller 리팩터링/신규 (체크포인트: `./gradlew build -x test`)

- [ ] 1.1 `api/runNshop-api/src/main/kotlin/com/runnshop/order/service/OrderService.kt` 신규 생성.
      `@Service` 클래스, 생성자로 `MockLoader` 주입. 메서드: `getAdminOrders(filter: AdminOrderFilter)`,
      `getAdminOrderDetail(orderId: String)`, `getPartnerOrders(vendorId: String, filter: PartnerOrderFilter)`,
      `getPartnerOrderDetail(orderId: String)`, `getMyOrders(memberId, page, size, status)`(최소 구현),
      `getMyOrderDetail(orderId: String)`. 필터 data class(`AdminOrderFilter`, `PartnerOrderFilter`)는 같은
      파일 또는 `com.runnshop.order.dto`에 둔다.
      `getAdminOrders`: `mockLoader.load("admin","order__GET_admin_v1_orders.json")`의 `data.orders`를
      keyword(platformOrderNo/productName/customer 부분일치)→status(ALL이면 통과)→from~to(orderDate
      앞 10자 비교) 순으로 필터링, size 단위로 page 슬라이싱. summary는 keyword/from/to만 적용한(status 필터
      적용 전) 결과 기준 상태별 집계. pagination은 {page,size,totalCount,totalPages} 재계산.
      `getPartnerOrders`: `mockLoader.load("partner","order__GET_partner_v1_orders.json")`에 동일 패턴 적용
      (summary는 DL §22에 없으므로 만들지 않음). `get*OrderDetail`: 기존 상세 mock을 그대로 반환(orderId
      매칭은 필수 아님, 지시사항).
      Files: `api/runNshop-api/src/main/kotlin/com/runnshop/order/service/OrderService.kt`
      Verify: `cd api/runNshop-api && ./gradlew build -x test` → BUILD SUCCESSFUL.

- [ ] 1.2 `AdminOrderController.kt` 수정: 생성자 주입을 `MockLoader`→`OrderService`로 교체,
      `searchOrders`/`getOrderDetail`이 Service 메서드만 호출하고 가공 로직 없음.
      Files: `api/runNshop-api/src/main/kotlin/com/runnshop/order/controller/AdminOrderController.kt`
      Verify: 위와 동일 build.

- [ ] 1.3 `PartnerOrderController.kt` 신규 생성 (`@RequestMapping("/api/partner/v1/orders")`,
      `OrderService` 주입, GET 목록(쿼리 status/from/to/keyword/page/size) + GET /{orderId}).
      API-024(`/ship`)는 범위 밖, 추가하지 않음.
      Files: `api/runNshop-api/src/main/kotlin/com/runnshop/order/controller/PartnerOrderController.kt`
      Verify: build.

- [ ] 1.4 `CustomerOrderController.kt`에 `GET /api/v1/members/me/orders/{orderId}` 추가 (OrderService 경유).
      기존 메서드는 변경하지 않음.
      Files: `api/runNshop-api/src/main/kotlin/com/runnshop/order/controller/CustomerOrderController.kt`
      Verify: build.

- [ ] 1.5 Mock JSON 신규 생성 3건 (기존 admin JSON은 그대로 유지, 수정 안 함):
      `mock/partner/order__GET_partner_v1_orders.json`(DL §22 스키마, 8~10건, 7종 status),
      `mock/partner/order__GET_partner_v1_orders_{order_id}.json`(DL §23 스키마),
      `mock/v1/order__GET_members_me_orders_{order_id}.json`(mobile.md §8-1 필드: orderId,
      platformOrderNo, status, orderDate, items[](vendorName 그룹핑→products[]), payment{...},
      shipping{...}, history[](at,event)).
      Files: 위 3개 경로(`api/runNshop-api/src/main/resources/mock/partner/...`,
      `api/runNshop-api/src/main/resources/mock/v1/...`)
      Verify: `./gradlew build -x test` 성공 + 아래 1.6 curl로 내용 확인.

- [ ] 1.6 런타임 검증 (체크포인트): 서버 기동(`./gradlew bootRun`, 포트 8080) 후
      `curl 'localhost:8080/api/admin/v1/orders?status=CANCELLED'`,
      `curl 'localhost:8080/api/admin/v1/orders?page=2&size=3'`,
      `curl 'localhost:8080/api/admin/v1/orders/ord-001'`,
      `curl 'localhost:8080/api/partner/v1/orders?status=PREPARING'` vs 무필터,
      `curl 'localhost:8080/api/partner/v1/orders/ord-001'`,
      `curl 'localhost:8080/api/v1/members/me/orders/ord-001'`
      으로 쿼리별 응답이 실제로 달라지는지 확인 후 서버 종료.
      Verify: 각 curl이 `code":"SUCCESS"` + 쿼리에 따라 다른 `orders`/`pagination` 반환.

## 2. admin FE (`apps/runNshop-admin/src/order/order-history/`)

- [ ] 2.1 `mockData.ts`: `OrderStatus`에 `ORDER_RECEIVED` 추가(+라벨 '접수'), `MOCK_ORDERS`/`filterOrders()`
      삭제. 타입(`Order`,`OrderFilter`)과 `ORDER_STATUS_LABEL`만 남김. 파일명 유지.
      Files: `apps/runNshop-admin/src/order/order-history/mockData.ts`

- [ ] 2.2 `OrderHistory.tsx`: `MOCK_ORDERS`/`filterOrders` 제거, `lib/api.ts`의 `api()`로 교체. 필터조회/
      페이지변경/페이지크기변경 3곳 모두 `fetchOrders(filter,page,size)`→`api('/orders?'+qs)` 호출. `summary`,
      `pagination`은 서버 응답을 그대로 state에 반영(클라 재계산 제거). `SummaryBar`는 `orders` 대신 `summary`
      객체를 받도록 변경. 행 클릭 시 `OrderDetail`에 `orderId`만 전달.
      Files: `apps/runNshop-admin/src/order/order-history/OrderHistory.tsx`

- [ ] 2.3 `OrderDetail.tsx`: props `{order,onClose}`→`{orderId,onClose}`, `useEffect`로 상세 API 호출,
      로딩 처리. `ClaimTab`은 `order.claims[]`, `ChangeLogTab`은 `order.logs[]`로 하드코딩 더미 교체.
      `InquiryTab`(신규, `order.inquiries[]` 목록만 표시)을 InnerTabs에 추가.
      Files: `apps/runNshop-admin/src/order/order-history/OrderDetail.tsx`

- [ ] 2.4 `tabs/OrderItemsTab.tsx`, `tabs/PaymentInfoTab.tsx`, `tabs/ShippingInfoTab.tsx`: 각각
      `order.items[]`/`order.payment`/`order.shipping` 실데이터로 하드코딩 교체(옵션명, 할인계산,
      결제수단/PG/거래ID, 연락처/주소/배송사/운송장 등 전부 제거).
      Files: `apps/runNshop-admin/src/order/order-history/tabs/OrderItemsTab.tsx`,
      `.../tabs/PaymentInfoTab.tsx`, `.../tabs/ShippingInfoTab.tsx`
      Verify (2.1~2.4): `cd apps/runNshop-admin && npm run build` 성공, 그리고
      `grep -rn 'MOCK_ORDERS\|filterOrders' apps/runNshop-admin/src/order/order-history/` 결과 없음.

## 3. partner FE (`apps/runNshop-partner/src/order/order-list/`)

- [ ] 3.1 `mockData.ts`: 전체 필드 snake_case→camelCase(`orderId`,`platformOrderNo`,`productName`,
      `customerName`,`orderDate`), `ORDER_RECEIVED` 상태 추가, `MOCK_ORDERS` 삭제. 파일명 유지.
      Files: `apps/runNshop-partner/src/order/order-list/mockData.ts`

- [ ] 3.2 `OrderListPage.tsx`: `MOCK_ORDERS` 제거, `lib/api.ts`의 `api()`로 교체(DL §22 쿼리 순서
      status/from/to/keyword/page/size). admin과 동일하게 필터조회/페이지/페이지크기 전부 서버 재요청,
      `.slice()` 클라 페이징 제거. 모든 `o.order_id` 등 snake_case 참조를 camelCase로. `useDetailOpener`에
      전달하는 아이템을 `order` 객체 대신 `orderId`(string)로 변경, `OrderDetail`에 `orderId`만 전달.
      Files: `apps/runNshop-partner/src/order/order-list/OrderListPage.tsx`

- [ ] 3.3 `OrderDetail.tsx`: props `{order,...}`→`{orderId,mode,onClose,onUpdate,readOnly}`로 변경,
      `useEffect`로 `/orders/${orderId}` 호출. 모든 snake_case 필드 참조를 camelCase로.
      Files: `apps/runNshop-partner/src/order/order-list/OrderDetail.tsx`

- [ ] 3.4 `src/guide/tabs/NewScreenGuide.tsx`: "필드명은 snake_case를 쓴다(admin은 camelCase)" 문장을
      "partner도 admin과 동일하게 camelCase를 쓴다"로 교정.
      Files: `apps/runNshop-partner/src/guide/tabs/NewScreenGuide.tsx`
      Verify (3.1~3.4): `cd apps/runNshop-partner && npm run build` 성공, 그리고
      `grep -rn 'order_id\|platform_order_no\|product_name\|customer_name\|order_date\|MOCK_ORDERS' apps/runNshop-partner/src/order/order-list/` 결과 없음.

## 4. mobile FE

- [ ] 4.1 `components/my/OrderListItem.tsx`: 카드 전체를 `<Link href={`/my/orders/${order.orderId}`}>`로
      감싸고, 내부 `ActionButton` 클릭 시 `e.stopPropagation()`으로 상세 이동을 막은 채 alert만 발생.
      Files: `apps/runNshop-mobile/components/my/OrderListItem.tsx`

- [ ] 4.2 `app/my/orders/[orderId]/page.tsx` 신규 생성. 템플릿:
      `app/my/claims/[claimId]/page.tsx`(async Server Component + `params: Promise<{orderId}>` await +
      `api<T>()` try/catch + Header/BottomNav). mobile.md §8-1대로 상태뱃지, 주문 기본정보, 입점사별 그룹
      상품목록(아이템 액션버튼은 alert만), 결제정보, 배송정보, Timeline(`history`, `ClaimStatusTimeline`
      재사용 가능), 하단 고정 주문취소 버튼(`status==='PAYMENT_COMPLETED'`일 때만).
      Files: `apps/runNshop-mobile/app/my/orders/[orderId]/page.tsx`

- [ ] 4.3 `app/my/orders/page.tsx`는 이미 서버 fetch로 구현되어 있어 수정하지 않음(확인만).
      Verify (4.1~4.2): `cd apps/runNshop-mobile && npm run build` 성공, 그리고
      `grep -n 'params: Promise' apps/runNshop-mobile/app/my/orders/[orderId]/page.tsx` 로 비동기
      params 패턴 적용 확인.

## 5. 최종 통합 검증
- [ ] 5.1 백엔드 재빌드(`./gradlew build -x test`) + 전체 curl 재검증(1.6 반복, admin/partner/mobile 상세
      엔드포인트 포함).
- [ ] 5.2 admin/partner/mobile 3개 앱 `npm run build` 전부 성공.
- [ ] 5.3 사용자가 `npm run dev`로 수동 화면 확인(조회/필터/페이지이동/상세진입)할 수 있도록 결과 요약 기록.
