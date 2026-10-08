# 검토 보고서 — admin 주문 현황 목록 화면정의서(list.md)의 코드 생성 충분성

대상 문서: `docs/deliverables/S3-상세설계/DN-화면레이아웃/admin/order-history/list.md` (SCR-A-001)
검토일 기준 커밋: `56f7ab6` (docs: DN-화면레이아웃 admin 화면 단위 분리)

---

## 1. 결론

| 영역 | 판정 |
|---|---|
| **FE (Frontend)** | **부분적으로 가능 (보완 필요)** — 와이어프레임·화면구성 표만으로 레이아웃/상태문구는 그대로 재현 가능하지만, "데이터 소스 = GET /api/admin/v1/orders"라는 명세와 달리 실제 FE는 **API를 전혀 호출하지 않고** 하드코딩된 `MOCK_ORDERS` 배열을 그대로 쓰고 있어, 문서만 보고 신규로 만들면 실제 코드와 다른(그러나 더 올바른) 결과물이 나온다. SummaryBar 카드 개수(8개 vs 실제 7개)도 문서-코드가 어긋난다.
- **BE (Backend)** | **불가능 (심각한 누락)** — `GET /api/admin/v1/orders`에 대응하는 Controller와 mock JSON 파일이 모두 존재하지 않는다. 문서(DL §15)에 응답 스키마는 있지만, 그 스키마를 기반으로 한 실제 mock 리소스/엔드포인트 구현이 전무해 "참조"조차 할 코드가 없다.

---

## 2. FE 생성 가능성 — 근거

### 2-1. 레이아웃/상태문구는 문서와 코드가 일치

`list.md`의 상태별 UI 표와 `OrderHistory.tsx`를 대조한 결과, 문구는 정확히 일치한다.

| 문서 (list.md) | 코드 (OrderHistory.tsx) |
|---|---|
| "조회 버튼을 눌러 주문 목록을 불러오세요." | `'조회 버튼을 눌러 주문 목록을 불러오세요.'` (L.207) |
| "조건에 맞는 주문이 없습니다." | `'조건에 맞는 주문이 없습니다.'` (L.206) |
| "불러오는 중..." | `<p className="state-msg">불러오는 중...</p>` (L.189) |

FilterBar(키워드+상태Select+기간+조회버튼), Toolbar(엑셀 다운로드), Pagination(페이지 이동+사이즈 변경), OrderTable 7개 컬럼(주문번호/상품명/주문자/입점사/상태/결제금액/주문일시) 모두 와이어프레임·화면구성 표와 1:1로 대응한다.

### 2-2. 핵심 불일치 — "데이터 소스 (API)"가 실제로는 적용되지 않음

`list.md` 화면구성 표는 SummaryBar·OrderTable의 데이터 소스를 `GET /api/admin/v1/orders`로 명시한다. 하지만 `OrderHistory.tsx`를 읽어본 결과 **fetch/axios 호출이 전혀 없다.** `handleSearch()`는 로컬 `setTimeout` 후 `filterOrders(MOCK_ORDERS, filter)`를 호출해 `mockData.ts`에 하드코딩된 12건의 배열을 그대로 필터링한다 (OrderHistory.tsx L.172-179, mockData.ts L.26-37).

이는 코딩표준(`coding-standards`) 1항 "모든 데이터는 Back-end API를 통해 가져온다 (하드코딩 금지)"를 위반하는 **기존 구현의 결함**이며, 동시에 `list.md`가 "이 화면은 이미 API 연동이 되어 있다"처럼 서술하고 있어 **문서가 실제 코드 상태를 정확히 설명하지 못한다.** 문서만 보고 신규로 코드를 생성하면 (문서를 충실히 따를 경우) 오히려 지금 코드보다 나은, API를 호출하는 버전이 나오는 역설적 상황이다 — 즉 "문서=완성 코드의 설명"이라는 전제가 깨져 있다.

### 2-3. SummaryBar 카드 개수 불일치 (8개 vs 7개)

와이어프레임과 화면구성 표는 **8개** 카드(전체·접수·결제완료·준비중·배송중·배송완료·구매확정·취소)를 명시한다. 그러나 실제 `SummaryBar` 컴포넌트(OrderHistory.tsx L.52-89)는 **7개** 카드만 렌더링하며 "접수" 카드가 없다. 그 이유는 `mockData.ts`의 `OrderStatus` 타입(L.1)에 `PAYMENT_COMPLETED | PREPARING | IN_DELIVERY | DELIVERED | CONFIRMED | CANCELLED` 6개 값만 정의되어 있어 "접수"에 대응하는 상태 값 자체가 없기 때문이다. 문서만 보고 생성하면 개발자는 "접수" 카드를 만들려 하겠지만, 그 카드가 집계할 주문 상태값이 문서 어디에도 정의되어 있지 않아 구현이 막힌다.

### 2-4. 상태값 자체가 상위 상태머신(DH)과 불일치

`mockData.ts`의 `IN_DELIVERY` 상태는 Order 도메인 상태머신(`docs/deliverables/S2-구조설계/DH-상태머신/order.md` §1)에 명시적으로 **존재하지 않는다.** 해당 문서는 "v6: 배송 실행을 `ord_shipment`로 분리 — `IN_DELIVERY` 상태 없음. '배송 중' 표시는 `PREPARING + shipment(OUTBOUND).status=IN_TRANSIT` 조인으로 화면에서 계산한다"고 명시한다. 즉 FE의 `IN_DELIVERY`는 공식 10상태 모델에 없는 임의 값이고, `list.md`도 이를 그대로 "배송중" 카드/배지로 재사용하고 있어 **상위 산출물(DH)과 하위 산출물(DN) 사이에 미해결 불일치가 있다.**

---

## 3. BE 생성 가능성 — 근거

### 3-1. Mock JSON 부재

`api/runNshop-api/src/main/resources/mock/admin/` 디렉토리에는 다음 4개 파일만 존재한다.

```
config__GET_home_alerts.json
config__GET_home_pending.json
config__GET_home_summary.json
order__GET_home_trend.json
```

`GET /api/admin/v1/orders`에 대응하는 파일(명명 규칙상 `order__GET_admin_v1_orders.json` 유형)은 **존재하지 않는다.**

### 3-2. Controller 부재

`api/runNshop-api/src/main/kotlin` 하위에서 admin 주문 관련 Controller는 전혀 없다. 확인된 모든 Controller 목록:

```
order/controller/CustomerOrderController.kt   (/api/v1/... 고객웹 전용)
order/controller/CustomerCartController.kt    (/api/v1/cart)
config/controller/AdminHomeController.kt      (/api/admin/v1/home/...)
vendor/controller/PartnerHomeController.kt    (/api/partner/v1/home/...)
catalog/controller/CustomerProductController.kt, PartnerProductController.kt, CustomerDisplayController.kt
member/controller/CustomerMemberController.kt
```

`AdminHomeController`가 `/api/admin/v1/home/*`만 다루고, `/api/admin/v1/orders`를 다루는 `OrderAdminController` 류의 클래스는 **없다.** 즉 BE는 **미구현**이다.

### 3-3. 응답 포맷 — 문서상으로는 표준 준수, 실물 검증 불가

`DL-인터페이스명세/order.md` §15 (`GET /api/admin/v1/orders — 주문 검색`)에 정의된 응답 스키마는 `{ "code": "SUCCESS", "data": { "orders": [...], "pagination": {...} } }` 형태로, `mock-data-rules`의 표준 구조를 따른다. 다만 이는 **문서상의 설계일 뿐**이고 실제 mock JSON 파일이 없어 코딩표준 준수 여부를 코드로 검증할 수 없다. 참고로 기존 구현된 다른 mock 파일들(`order__GET_members_me_orders.json`, `order__GET_home_trend.json` 등)은 모두 `{code, data}` 포맷을 지키고 있어, 신규 작성 시 동일 패턴을 따르면 될 것으로 보인다.

### 3-4. DL 응답 스키마에 "집계(summary)" 필드 없음

`list.md`는 SummaryBar의 데이터 소스를 "`GET /api/admin/v1/orders` → 응답 집계"로 서술하지만, `DL-인터페이스명세/order.md` §15의 Response 200 예시에는 `orders[]`와 `pagination`만 있고 **상태별 건수를 담는 필드(예: `summary` 또는 `statusCounts`)가 전혀 없다.** 즉 "응답 집계"라는 표현이 실제 API 스키마와 맞지 않는다. (FE의 현재 구현은 이 문제를 "클라이언트가 전체 필터링 결과를 받아서 직접 count"하는 방식으로 우회하고 있는데, 이 또한 문서화되어 있지 않다.)

---

## 4. 문서 자체의 누락·모호 지점

1. **메타블록 "관련 세부UC" 링크 방식** — `[[DK-세부유스케이스/order\|UC-14 (목록)]]`로 표기되어 있으나, `DK-세부유스케이스/order.md` 본문에는 "UC-14"라는 리터럴 라벨이 전혀 없다(`grep "UC-14"` 결과 0건). 섹션 번호 `## 14. [전체 주문 검색] 주문 조회 Bolt (admin — 주문 현황)`과 매칭되는 암묵적 규칙(§N = UC-N)에 의존하고 있는데, 이 규칙이 `list.md`나 DK 문서 어디에도 명시적으로 설명되어 있지 않다. 처음 보는 개발자는 "UC-14"를 그대로 검색해 찾지 못하고 혼란을 겪을 수 있다.
2. **"호출 API: API-022" 역시 리터럴 라벨 없음** — `DL-인터페이스명세/order.md`는 섹션 제목에 `## 15. GET /api/admin/v1/orders — 주문 검색 (어드민)`이라고만 쓰고 "API-022"라는 ID를 본문에 적지 않는다(동일 문서의 API-026 섹션은 `(API-026)`을 제목에 명시해 비교하면 더 눈에 띈다). ID-섹션 매칭은 `DQ-프로그램목록/order.md`를 통해서만 간접 확인 가능하다.
3. **SummaryBar 집계 소스 불명확** — 위 3-4에서 설명한 대로, API-022 응답에 집계 필드가 없는데 문서는 "응답 집계"라고만 쓰고 집계 방식(서버 집계 vs 클라이언트 집계, 전체 결과 기준 vs 페이지 기준)을 명시하지 않는다.
4. **"접수" 카드의 매핑 상태값 미정** — SummaryBar 8개 카드 중 "접수"가 어떤 주문 상태(`ORDER_RECEIVED`? `PAYMENT_PENDING`?)에 대응하는지 `list.md`에 설명이 없다. 상태머신(DH) 10상태 중 admin 목록에 노출되는 상태 집합이 무엇인지(예: `TEMP`/`STOCK_FAILED`/`PAYMENT_FAILED`는 제외?) 명시가 없다.
5. **"배송중" 상태의 집계/표시 근거 누락** — DH 상태머신 v6에 따르면 "배송중"은 `PREPARING + shipment(OUTBOUND).status=IN_TRANSIT`의 조인 결과이지 단독 `order.status` 값이 아니다. `list.md`의 OrderTable 상태 뱃지와 SummaryBar "배송중" 카드가 이 파생 상태를 어떻게 계산하는지(백엔드에서 조인해서 내려주는지, 프런트에서 별도 shipment API를 호출하는지) 설명이 없다.
6. **상태 Select 옵션의 전체 목록 미기재** — 화면구성 표는 "상태 Select"라고만 쓰고 선택 가능한 상태값 목록(접수/결제완료/준비중/배송중/배송완료/구매확정/취소 등)을 표나 목록으로 제공하지 않는다. DL §15의 Query 예시도 `status=ALL`만 보여줄 뿐 허용값 enum을 정의하지 않는다.
7. **날짜 포맷 불일치** — DL §15 응답 예시는 `"orderDate": "2026-06-26 09:15"` (하이픈+시간)인데, `list.md` 와이어프레임은 `2026.06.26` (점, 날짜만)으로 표기한다. 포맷 변환 책임(FE에서 가공? BE에서 가공?)이 문서에 없다.

---

## 5. 보완 제안 (문서 수정 범위 — 코드 수정 제안 아님)

1. **메타블록에 ID-섹션 매칭 규칙을 각주로 명시** — `list.md` 메타블록 하단에 "UC-14 / API-022는 각각 DK §14, DL §15의 섹션 번호 기준 암묵적 대응이며 리터럴 라벨은 DQ-프로그램목록에서만 확인 가능" 같은 안내를 추가하거나, 더 근본적으로는 `DK-세부유스케이스/order.md`·`DL-인터페이스명세/order.md`의 각 섹션 제목에 `(UC-14)`/`(API-022)`를 명시적으로 병기하는 편이 좋다(이는 두 상위 산출물 수정이 필요하므로 Order 도메인 담당자 확인 필요 — work-scope 규칙상 Promotion 영역 밖).
2. **"화면 구성" 표의 SummaryBar 행에 집계 산출 방식을 명시** — "GET /api/admin/v1/orders → 응답 집계" 대신 "GET /api/admin/v1/orders 응답의 전체(필터 적용, 페이지네이션 미적용) `orders[]`를 클라이언트에서 상태별 count" 등으로 구체화하거나, 서버가 `summary` 필드를 내려주도록 할지 결정한 뒤 그 결과를 반영한다. 이 결정에 따라 `DL-인터페이스명세/order.md` §15의 Response 스키마에 `summary`/`statusCounts` 필드 추가가 필요할 수 있다(DL 수정은 Order 도메인 소관이므로 사용자 확인 필요).
3. **"접수" 카드가 집계할 상태값을 메타블록 또는 화면구성 표 하단에 명시** — 예: "접수 = ORDER_RECEIVED + PAYMENT_PENDING 합산" 또는 해당 상태를 노출하지 않기로 한다면 와이어프레임에서 "접수" 카드를 제거하고 7개로 통일.
4. **"배송중" 뱃지/카드의 파생 로직을 화면구성 표 또는 각주에 명시** — "PREPARING + shipment(OUTBOUND).status=IN_TRANSIT 조인 결과"라는 DH v6 정의를 그대로 인용하여, API-022 응답이 이 조인을 서버에서 미리 계산해 내려주는지(권장) 명시한다.
5. **상태 Select의 허용값 목록을 표로 추가** — 화면구성 표 아래에 "상태 Select 옵션: 전체/접수/결제완료/준비중/배송중/배송완료/구매확정/취소" 식의 enum 표를 추가하고, DL §15 Query 설명에도 `status` 허용값 enum을 기재한다.
6. **날짜 포맷 표기를 통일** — 와이어프레임의 `2026.06.26`과 DL 응답 예시의 `2026-06-26 09:15` 중 하나로 통일하거나, "API는 `yyyy-MM-dd HH:mm`로 내려주고 화면은 `yyyy.MM.dd`로 가공해 표시한다"처럼 가공 책임을 명시한다.

> 참고: 위 제안 중 2·3·4·5·6은 `DL-인터페이스명세/order.md`(Order 도메인 1차 근거 문서) 수정을 수반할 수 있다. work-scope 규칙상 본 작업 범위는 Promotion 도메인이며 Order 문서는 열람·대조 목적으로만 사용했으므로, 실제 DL/DK 수정이 필요하다면 Order 도메인 담당자(사용자) 확인 후 진행해야 한다.

---

## 부록 — 확인한 파일 목록

- `docs/deliverables/S3-상세설계/DN-화면레이아웃/admin/order-history/list.md` (검토 대상)
- `docs/deliverables/S3-상세설계/DN-화면레이아웃/admin/order-history/detail.md`, `admin/index.md`
- `docs/deliverables/S3-상세설계/DL-인터페이스명세/order.md` §15~17 (API-022~024)
- `docs/deliverables/S3-상세설계/DK-세부유스케이스/order.md` §14 (UC-14)
- `docs/deliverables/S3-상세설계/DQ-프로그램목록/order.md` (SCR-A-001, API-022~024)
- `docs/deliverables/S2-구조설계/DH-상태머신/order.md` (ord_order.status v6, 10상태)
- `apps/runNshop-admin/src/order/order-history/OrderHistory.tsx`
- `apps/runNshop-admin/src/order/order-history/mockData.ts`
- `apps/runNshop-admin/src/shell/shared/Pagination.tsx`
- `api/runNshop-api/src/main/resources/mock/admin/*.json` (4개 파일, 대상 mock 없음 확인)
- `api/runNshop-api/src/main/kotlin/com/runnshop/**/controller/*.kt` (전체 Controller 목록, admin 주문 Controller 없음 확인)
- `api/runNshop-api/src/main/kotlin/com/runnshop/common/MockLoader.kt`
