# Implementation Plan — API URL / Mock 파일 네이밍 전사 리팩터

> 이 작업은 FEAT 아티팩트(task.json, context.json, features/FEAT-00{1,2}.json, 같은 디렉터리)로
> 분해되어 있다. 워크플로우가 FEAT 기반 코더 루프로 교체되면 이 plan.md는 참고용이며, 교체되지
> 않으면 이 체크리스트를 그대로 순서대로 수행한다.
>
> **범위**: naming/path-only. 비즈니스 로직, 응답 바디 스키마, Controller/Service 클래스 구조,
> Mock JSON 데이터 내용은 변경하지 않는다. admin/partner URL은 변경하지 않는다(mock 폴더 이동만).

## 사전 조사 결과 (grep 검증, plan 작성 시점 기준)

- `/api/v1/` 매칭 소스 파일(스캐폴딩/참고자료 제외): 백엔드 Controller 9개 파일, FE
  `apps/runNshop-mobile` 10개 `page.tsx`, `.kiro/KIRO_START.md`, DL-인터페이스명세
  `order.md`/`payment.md`/`readme.md`. `apps/mobile_c`, `apps/admin_c`는 이전 태스크
  context.json에 "관련없는 스캐폴딩, 건드리지 않음"으로 명시된 중복 디렉터리이므로 제외.
  `apps/runNshop-admin/src/system/program-status/mockData.ts`의 `/api/v1/settlement`는 모니터링
  화면의 샘플 로그 데이터(실제 라우트 아님) — 수정 대상 아님.
- **불일치 발견**: 스펙 E항목은 "catalog/promotion/member 등 다른 도메인 DL 문서가 있으면 동일 규칙
  적용"이라고 했으나, `docs/deliverables/S3-상세설계/DL-인터페이스명세/`에는 `order.md`,
  `payment.md`, `readme.md` 3개만 존재한다(catalog/promotion/member 전용 DL 문서 없음). 즉
  catalog/promotion/member의 `/api/v1/...` Path는 `order.md`/`payment.md`에는 등장하지 않고
  코드(Controller)에만 존재하므로 C항목(코드)만 적용하고 E항목에서 추가로 찾을 문서는 없다.
- Mock 파일 수 확인: `mock/admin/`(6) + `mock/partner/`(8) + `mock/v1/`(11) = 25개, 스펙 B항목
  리스트와 1:1 정확히 일치.
- `OrderController.kt`의 `POST /api/v1/orders/sheet`와 `GET /api/v1/orders/sheet`는 현재도 동일한
  mock 파일(`order__POST_orders_sheet.json`)을 로드한다(기존 동작) — 이 불일치는 그대로 보존하고
  파일명/경로만 이동한다(`mobile__POST_my_orders_sheet.json`로 양쪽 다 로드).

## 1. 백엔드 — Mock 파일 이동 + Controller/Service URL·mockLoader 인자 변경 (체크포인트: `./gradlew build -x test`)

- [ ] 1.1 Mock 파일 25건을 `git mv`로 `mock/{channel}/...` → `mock/{domain}/{channel}__...` 이동
      (아래 B 매핑 표 전체). 이동 후 `mock/admin/`, `mock/partner/`, `mock/v1/`(과 `.gitkeep`) 디렉터리를
      git에서 완전히 제거한다.
      Files: `api/runNshop-api/src/main/resources/mock/**`
      Verify: `find api/runNshop-api/src/main/resources/mock -type d` 결과에 `admin`/`partner`/`v1`이
      없고 `order/catalog/config/vendor/member/promotion` 6개 폴더만 보임.

- [ ] 1.2 `OrderController.kt`: `/api/v1/orders/sheet`(POST/GET) → `/api/mobile/v1/my/orders/sheet`,
      `/api/v1/members/me/orders` → `/api/mobile/v1/my/orders`. mockLoader.load() 2개 호출의 첫 번째
      인자를 "v1"→"order", 파일명을 "mobile__POST_my_orders_sheet.json"/"mobile__GET_my_orders.json"로
      변경. `/api/admin/v1/orders`, `/api/partner/v1/orders` 관련 URL은 변경하지 않음(이미 OrderService
      경유라 mockLoader 직접 호출 없음).
      Files: `api/runNshop-api/src/main/kotlin/com/runnshop/order/controller/OrderController.kt`

- [ ] 1.3 `OrderService.kt`: 6개 `mockLoader.load()` 호출의 두 인자를 각각 변경
      (`admin`→`order`/`admin__GET_orders.json`, `admin`→`order`/`admin__GET_orders_{order_id}.json`,
      `partner`→`order`/`partner__GET_orders.json`, `partner`→`order`/`partner__GET_orders_{order_id}.json`,
      `v1`→`order`/`mobile__GET_my_orders.json`, `v1`→`order`/`mobile__GET_my_orders_{order_id}.json`).
      URL 변경 없음(이 파일엔 URL이 없음).
      Files: `api/runNshop-api/src/main/kotlin/com/runnshop/order/service/OrderService.kt`

- [ ] 1.4 `ClaimController.kt`: `/api/v1/members/me/claims`(+`/{claimId}`) → `/api/mobile/v1/my/claims`
      (+`/{claimId}`). mockLoader 인자를 "v1"→"order", 파일명을 "mobile__GET_my_claims.json" /
      "mobile__GET_my_claims_{claim_id}.json"로 변경.
      Files: `api/runNshop-api/src/main/kotlin/com/runnshop/order/controller/ClaimController.kt`

- [ ] 1.5 `CustomerCartController.kt`: `/api/v1/cart` → `/api/mobile/v1/my/cart`. mockLoader 인자를
      "v1"→"order", 파일명을 "mobile__GET_my_cart.json"로 변경.
      Files: `api/runNshop-api/src/main/kotlin/com/runnshop/order/controller/CustomerCartController.kt`

- [ ] 1.6 `CustomerProductController.kt`(공용 리소스, `/my` 아님): `/api/v1/products/{productId}` →
      `/api/mobile/v1/products/{productId}`. mockLoader 인자를 "v1"→"catalog", 파일명을
      "mobile__GET_products_{product_id}.json"로 변경.
      Files: `api/runNshop-api/src/main/kotlin/com/runnshop/catalog/controller/CustomerProductController.kt`

- [ ] 1.7 `CustomerDisplayController.kt`(공용): `/api/v1/display/pages/home` →
      `/api/mobile/v1/display/pages/home`. mockLoader 인자를 "v1"→"catalog", 파일명을
      "mobile__GET_display_pages_home.json"로 변경.
      Files: `api/runNshop-api/src/main/kotlin/com/runnshop/catalog/controller/CustomerDisplayController.kt`

- [ ] 1.8 `PartnerProductController.kt`: URL(`/api/partner/v1/products`) 변경 없음. mockLoader 인자만
      "partner"→"catalog", 파일명을 "partner__GET_products.json"로 변경.
      Files: `api/runNshop-api/src/main/kotlin/com/runnshop/catalog/controller/PartnerProductController.kt`

- [ ] 1.9 `CustomerMemberController.kt`(본인 소유): `/api/v1/members/me/summary` →
      `/api/mobile/v1/my/summary`. mockLoader 인자를 "v1"→"member", 파일명을
      "mobile__GET_my_summary.json"로 변경.
      Files: `api/runNshop-api/src/main/kotlin/com/runnshop/member/controller/CustomerMemberController.kt`

- [ ] 1.10 `CustomerExhibitionController.kt`(공용, `/my` 아님): `/api/v1/exhibitions` →
      `/api/mobile/v1/exhibitions`, `/api/v1/display/pages/exhibition/{exhibitionCode}` →
      `/api/mobile/v1/display/pages/exhibition/{exhibitionCode}`. mockLoader 인자를 "v1"→"promotion",
      파일명을 "mobile__GET_exhibitions.json" / "mobile__GET_display_pages_exhibition_{exhibition_code}.json"로.
      Files: `api/runNshop-api/src/main/kotlin/com/runnshop/promotion/controller/CustomerExhibitionController.kt`

- [ ] 1.11 `AdminHomeController.kt`: URL(`/api/admin/v1/home/...`) 변경 없음. 4개 mockLoader 호출의
      첫 인자를 각각 "config"(summary/pending/alerts) 또는 "order"(trend)로, 파일명을
      "admin__GET_home_summary.json" / "admin__GET_home_pending.json" / "admin__GET_home_trend.json" /
      "admin__GET_home_alerts.json"로 변경.
      Files: `api/runNshop-api/src/main/kotlin/com/runnshop/config/controller/AdminHomeController.kt`

- [ ] 1.12 `PartnerHomeController.kt`: URL(`/api/partner/v1/home/...`) 변경 없음. 5개 mockLoader
      호출의 첫 인자를 각각 "vendor"(summary/pending/notices) 또는 "order"(trend)/"catalog"
      (products/summary)로, 파일명을 "partner__GET_home_summary.json" / "partner__GET_home_pending.json" /
      "partner__GET_home_trend.json" / "partner__GET_home_products_summary.json" /
      "partner__GET_home_notices.json"로 변경.
      Files: `api/runNshop-api/src/main/kotlin/com/runnshop/vendor/controller/PartnerHomeController.kt`

- [ ] 1.13 `MockLoader.kt`: 로직/시그니처 변경 없음. KDoc 주석의 `@param channel 앱 채널 (v1, admin,
      partner)` 설명만 "이제 첫 번째 인자는 도메인 폴더명(order/catalog/...), 두 번째 인자(filename)에
      채널 접두사(admin__/partner__/mobile__)가 포함된다"로 정정(사실 설명 갱신, 동작 변경 없음).
      Files: `api/runNshop-api/src/main/kotlin/com/runnshop/common/MockLoader.kt`

- [ ] 1.14 백엔드 빌드 + 런타임 검증(체크포인트): `cd api/runNshop-api && ./gradlew clean build -x test`
      성공 후 `./gradlew bootRun`(백그라운드, 포트 8080) 기동. 아래 전부 curl, 전부 `"code":"SUCCESS"`
      확인(이동이 잘못되면 `"code":"NOT_FOUND"`가 뜬다 — 그걸 잡아내는 것이 목적):
      `GET /api/mobile/v1/my/cart`, `GET /api/mobile/v1/my/orders`,
      `GET /api/mobile/v1/my/orders/{orderId}`(임의 id), `POST /api/mobile/v1/my/orders/sheet`,
      `GET /api/mobile/v1/my/orders/sheet`, `GET /api/mobile/v1/my/claims`,
      `GET /api/mobile/v1/my/claims/{claimId}`, `GET /api/mobile/v1/my/summary`,
      `GET /api/mobile/v1/products/{productId}`, `GET /api/mobile/v1/display/pages/home`,
      `GET /api/mobile/v1/exhibitions`, `GET /api/mobile/v1/display/pages/exhibition/{code}`,
      `GET /api/admin/v1/orders`, `GET /api/admin/v1/orders/{orderId}`,
      `GET /api/admin/v1/home/summary`, `GET /api/admin/v1/home/pending`,
      `GET /api/admin/v1/home/trend`, `GET /api/admin/v1/home/alerts`,
      `GET /api/partner/v1/orders`, `GET /api/partner/v1/orders/{orderId}`,
      `GET /api/partner/v1/products`, `GET /api/partner/v1/home/summary`,
      `GET /api/partner/v1/home/pending`, `GET /api/partner/v1/home/trend`,
      `GET /api/partner/v1/home/products/summary`, `GET /api/partner/v1/home/notices`.
      서버 종료.

## 2. Front-end(mobile 콜 경로/PREFIX) + DL 문서 + KIRO_START.md (1단계 완료 후 — 새 URL에 맞춤)

- [ ] 2.1 `apps/runNshop-mobile/lib/api.ts`: `PREFIX = '/api/v1'` → `'/api/mobile/v1'`.
      Files: `apps/runNshop-mobile/lib/api.ts`

- [ ] 2.2 mobile 앱의 "본인 소유" 리소스 호출 경로 7곳 변경(공용 리소스는 변경 없음 — 아래 2.3 확인만):
      `app/cart/page.tsx` `'/cart'`→`'/my/cart'`,
      `app/orders/new/page.tsx` `'/orders/sheet'`→`'/my/orders/sheet'`,
      `app/my/claims/page.tsx` `'/members/me/claims'`→`'/my/claims'`,
      `app/my/claims/[claimId]/page.tsx` `` `/members/me/claims/${claimId}` ``→`` `/my/claims/${claimId}` ``,
      `app/my/page.tsx` `'/members/me/summary'`→`'/my/summary'`,
      `app/my/orders/page.tsx` `'/members/me/orders'`→`'/my/orders'`,
      `app/my/orders/[orderId]/page.tsx` `` `/members/me/orders/${orderId}` ``→`` `/my/orders/${orderId}` ``.
      Files: 위 7개 경로.

- [ ] 2.3 공용(비소유) 리소스 호출부 확인만(변경 없음): `app/page.tsx`(`/display/pages/home`),
      `app/exhibitions/page.tsx`(`/exhibitions`), `app/exhibitions/[exhibitionCode]/page.tsx`
      (`` `/display/pages/exhibition/${...}` ``), `app/products/[productId]/page.tsx`
      (`` `/products/${...}` ``) — PREFIX 변경만으로 올바른 새 URL이 되므로 상대경로는 그대로.
      admin/partner `lib/api.ts`의 PREFIX는 이미 올바르므로 변경 없음; admin/partner 호출부에 변경된
      리소스명 참조가 없음을 확인(grep 결과 없음, 이미 확인됨).

- [ ] 2.4 DL `order.md`: 전체 Path 표기(헤더 라인 포함) + 인라인 prose의 모든 `/api/v1/...`를 아래
      원칙으로 치환 — admin/partner Path는 변경 없음, mobile 소유 리소스(`cart`,`orders`,`claims`)는
      `/api/mobile/v1/my/...`, 공용 리소스는 `/api/mobile/v1/...`. 미구현 API(cart/items,
      orders/{id}/cancel 등)도 포함해 전부 갱신(§1~§44, §10-1/§19-1/§32-1/§32-2/§39-1/§39-2 포함).
      Files: `docs/deliverables/S3-상세설계/DL-인터페이스명세/order.md`

- [ ] 2.5 DL `payment.md`: §12/§13/§14(`/api/v1/payment-methods...`)→`/api/mobile/v1/my/payment-methods...`,
      §41(`/api/v1/members/me/payments`)→`/api/mobile/v1/my/payments`. §42/§43(admin)은 변경 없음.
      Files: `docs/deliverables/S3-상세설계/DL-인터페이스명세/payment.md`

- [ ] 2.6 DL `readme.md`: "API 목록 요약" 표의 mobile 행(#1~#19-2, #41) Path 열과 "Idempotency-Key" 표의
      #5/#6/#31 Path를 2.4/2.5와 동일 규칙으로 갱신. admin/partner 행은 변경 없음.
      Files: `docs/deliverables/S3-상세설계/DL-인터페이스명세/readme.md`

- [ ] 2.7 `.kiro/KIRO_START.md`: 디렉터리 트리의 `mock/v1|admin|partner` → `mock/{domain}` 구조로,
      접근통제 표/규칙 블록의 `/api/v1/**` → `/api/mobile/v1/**`, Controller 예시(CustomerOrderController)
      URL을 `/api/mobile/v1/my/orders`로, 공용 ProductController 다중매핑 예시에 `/api/mobile/v1/...`
      추가, Mock 파일 위치/네이밍 규칙 섹션 예시를 새 규칙(`{channel}__{METHOD}_{PATH}.json`,
      폴더=도메인)으로, 실행방법 섹션의 "고객웹 API: .../api/v1/..." → ".../api/mobile/v1/...", FE 호출
      예제 코드 3블록 중 mobile PREFIX와 사용예시(`/cart`→`/my/cart`), 프로토타입 시작 프롬프트의
      `GET /api/v1/display/pages/home` → `GET /api/mobile/v1/display/pages/home`, 개발규칙 Back-end
      섹션의 prefix 나열에 `mobile` 반영.
      Files: `.kiro/KIRO_START.md`

- [ ] 2.8 최종 검증: `cd apps/runNshop-mobile && npm run build`,
      `cd apps/runNshop-admin && npm run build`, `cd apps/runNshop-partner && npm run build` 3개 전부
      성공. 그리고 `grep -rn "/api/v1/" apps/runNshop-mobile/lib apps/runNshop-mobile/app` 결과가
      없음(모두 `/api/mobile/v1/` 또는 상대경로로 전환 완료) — 보조 확인용, 주 검증은 각 앱의
      `npm run build` 성공 여부.

## B. Mock 파일 이동 매핑 (1.1에서 전부 수행)

```
mock/admin/order__GET_admin_v1_orders.json            -> mock/order/admin__GET_orders.json
mock/admin/order__GET_admin_v1_orders_{order_id}.json -> mock/order/admin__GET_orders_{order_id}.json
mock/admin/order__GET_home_trend.json                 -> mock/order/admin__GET_home_trend.json
mock/admin/config__GET_home_alerts.json               -> mock/config/admin__GET_home_alerts.json
mock/admin/config__GET_home_pending.json              -> mock/config/admin__GET_home_pending.json
mock/admin/config__GET_home_summary.json              -> mock/config/admin__GET_home_summary.json
mock/partner/order__GET_partner_v1_orders.json            -> mock/order/partner__GET_orders.json
mock/partner/order__GET_partner_v1_orders_{order_id}.json -> mock/order/partner__GET_orders_{order_id}.json
mock/partner/order__GET_home_trend.json                   -> mock/order/partner__GET_home_trend.json
mock/partner/catalog__GET_home_products_summary.json      -> mock/catalog/partner__GET_home_products_summary.json
mock/partner/catalog__GET_products.json                   -> mock/catalog/partner__GET_products.json
mock/partner/vendor__GET_home_notices.json                -> mock/vendor/partner__GET_home_notices.json
mock/partner/vendor__GET_home_pending.json                -> mock/vendor/partner__GET_home_pending.json
mock/partner/vendor__GET_home_summary.json                -> mock/vendor/partner__GET_home_summary.json
mock/v1/order__GET_cart.json                             -> mock/order/mobile__GET_my_cart.json
mock/v1/order__GET_members_me_claims.json                -> mock/order/mobile__GET_my_claims.json
mock/v1/order__GET_members_me_claims_{claim_id}.json     -> mock/order/mobile__GET_my_claims_{claim_id}.json
mock/v1/order__GET_members_me_orders.json                -> mock/order/mobile__GET_my_orders.json
mock/v1/order__GET_members_me_orders_{order_id}.json     -> mock/order/mobile__GET_my_orders_{order_id}.json
mock/v1/order__POST_orders_sheet.json                    -> mock/order/mobile__POST_my_orders_sheet.json
mock/v1/catalog__GET_display_pages_home.json             -> mock/catalog/mobile__GET_display_pages_home.json
mock/v1/catalog__GET_products_{product_id}.json          -> mock/catalog/mobile__GET_products_{product_id}.json
mock/v1/member__GET_members_me_summary.json              -> mock/member/mobile__GET_my_summary.json
mock/v1/promotion__GET_display_pages_exhibition_{exhibition_code}.json -> mock/promotion/mobile__GET_display_pages_exhibition_{exhibition_code}.json
mock/v1/promotion__GET_exhibitions.json                  -> mock/promotion/mobile__GET_exhibitions.json
```
