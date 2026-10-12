# runNshop 프로토타입 개발 가이드

## 프로젝트 개요

러닝 전문 쇼핑몰 **runNshop**의 화면 프로토타입 프로젝트.
Front-end 3개 앱 + Back-end API 1개(업무도메인 기반) 모노레포.

| 앱 | URL | 해상도 | 화면수 | 프레임워크 |
|----|-----|--------|--------|-----------|
| 플랫폼 고객웹 (runNshop-mobile) | www.runNshop.com | 모바일 360px | 38개 | Next.js (React) |
| 플랫폼 어드민 (runNshop-admin) | admin.runNshop.com | PC 1280px+ | 80개 | Next.js (React) |
| 플랫폼 입점사 (runNshop-partner) | partners.runNshop.com | PC 1280px+ | 40개 | Next.js (React) |
| 플랫폼 backend API (runNshop-api) | api.runNshop.com | - | - | Spring Boot (Kotlin) |

---

## 폴더 구조

```
runNshop/
├── apps/
│   ├── runNshop-mobile/         ← 플랫폼 고객웹 (Next.js 14, Tailwind, App Router)
│   │   ├── app/                 ← 페이지 (SSR)
│   │   ├── components/          ← UI 컴포넌트
│   │   └── lib/                 ← api.ts, constants.ts
│   ├── runNshop-admin/          ← 플랫폼 어드민 (Next.js 15, CSR SPA)
│   │   └── src/
│   │       ├── app/             ← layout + page + globals.css
│   │       ├── shell/           ← AppShell, Dashboard, TabContext, shared/
│   │       └── {domain}/        ← 도메인별 화면 (order/, product/ 등)
│   └── runNshop-partner/        ← 플랫폼 입점사 (Next.js 15, CSR SPA)
│       └── src/
│           ├── app/             ← layout + page + globals.css
│           ├── shell/           ← AppShell, Dashboard, TabContext, shared/
│           └── {domain}/        ← 도메인별 화면 (product/ 등)
├── api/
│   └── runNshop-api/            ← Back-end API (Kotlin + Spring Boot, 단일 실행 모듈)
│       └── src/main/
│           ├── kotlin/com/runnshop/
│           │   ├── {domain}/controller/  ← 12개 도메인 Controller
│           │   ├── {domain}/service/
│           │   ├── {domain}/dto/
│           │   └── common/              ← MockLoader, CorsConfig
│           └── resources/
│               ├── mock/{domain}/       ← 12개 업무도메인별 폴더(admin/partner/mobile 공용)
│               └── application.yml
├── docs/                        ← 설계 문서
│   ├── 1. 요구사항/
│   ├── 2. 정책서/
│   ├── 3. 도메인/
│   ├── 4. 업무플로우/
│   ├── 5. 엔티티정의/
│   ├── 6. 화면정의/
│   └── sample-apps/admin-ui/    ← 화면 샘플소스 참조
└── .kiro/
    ├── KIRO_START.md            ← 이 파일
    └── steering/                ← AI 작업 지시 규칙 (7개 .md)
```

---

## 기술 스택

### Front-end — 고객웹 (runNshop-mobile)

| 항목 | 기술 |
|------|------|
| 프레임워크 | Next.js 14+ (App Router) |
| 언어 | TypeScript |
| 스타일링 | Tailwind CSS |
| 구조 | SSR + BFF (Server Component + Route Handler 프록시) |
| 인증 | httpOnly 쿠키 (본개발), bypass (프로토타입) |
| 원칙 | API 키 서버 은닉, 브라우저→BFF→백엔드, 백엔드 외부 차단 |

### Front-end — 어드민/입점사 (runNshop-admin, runNshop-partner)

| 항목 | 기술 |
|------|------|
| 프레임워크 | Next.js 15 (SPA, 단일 페이지) |
| 언어 | TypeScript |
| 스타일링 | 순수 CSS 클래스 (globals.css, BEM 스타일) |
| 구조 | CSR (SPA) — NavBar + TabBar + TabContent (MDI 탭 방식) |
| 접근 통제 | VPN/IP 제한 (어드민), 2FA + 세션 (입점사) |
| 색상 | Admin: 슬레이트+블루 / Partner: 다크오렌지+오렌지 |

### Back-end API (단일 실행 모듈)

| 항목 | 기술 |
|------|------|
| 언어 | Kotlin |
| 프레임워크 | Spring Boot 3.3 |
| 빌드 | Gradle (Kotlin DSL) |
| JDK | 21 |
| 아키텍처 | Modular Monolith (12개 업무도메인 패키지) |

---

## API 설계

### 업무도메인 기반 패키지 구조

Back-end는 하나의 Spring Boot 애플리케이션이며, 12개 업무도메인으로 패키지를 분리합니다.

| # | 도메인 | 패키지 | 핵심 책임 |
|---|--------|--------|----------|
| 1 | Order | `com.runnshop.order` | 주문 생명주기 오케스트레이션 |
| 2 | Catalog | `com.runnshop.catalog` | 상품·재고·카테고리·가격 관리 |
| 3 | Member | `com.runnshop.member` | 회원·등급·포인트·쿠폰 관리 |
| 4 | Payment | `com.runnshop.payment` | 결제 트랜잭션 처리 |
| 5 | Promotion | `com.runnshop.promotion` | 쿠폰·행사가·수량할인·기획전 |
| 6 | Settlement | `com.runnshop.settlement` | 정산 계산·확정·지급 |
| 7 | Vendor | `com.runnshop.vendor` | 입점사 계약·등급·배송사 |
| 8 | Notification | `com.runnshop.notification` | 알림 발송·이력 |
| 9 | Community | `com.runnshop.community` | 리뷰·QnA·크루·챌린지 |
| 10 | Search | `com.runnshop.search` | 통합검색·인덱스 |
| 11 | Config | `com.runnshop.config` | 권한·코드·공지·약관 |
| 12 | Audit | `com.runnshop.audit` | 로그·감사·Trace |

### 각 도메인 내부 구조

```
com.runnshop.{domain}/
├── controller/     ← REST Controller (URL path로 앱 구분)
├── service/        ← 비즈니스 로직 (프로토타입: Mock 반환)
└── dto/            ← 요청/응답 DTO
```

---

## 접근 통제: URL Path 기반 앱 구분

앱별 API 접근은 URL path prefix로 구분합니다. 하나의 Back-end에서 3개 앱의 API를 모두 서비스하되, path prefix로 접근 권한을 통제합니다.

| 앱 | API Path Prefix | 인증 방식 |
|----|----------------|----------|
| 플랫폼 고객웹 | `/api/mobile/v1/**` | JWT + Redis |
| 플랫폼 어드민 | `/api/admin/v1/**` | JWT + 세션 8시간 |
| 플랫폼 입점사 | `/api/partner/v1/**` | JWT + 2단계 인증 + 세션 3시간 |

### 접근 통제 규칙

```
/api/mobile/v1/**   → 플랫폼 고객웹(runNshop-mobile, mobile 채널 전용)만 접근 가능
/api/admin/v1/**    → 플랫폼 어드민(runNshop-admin)만 접근 가능
/api/partner/v1/**  → 플랫폼 입점사(runNshop-partner)만 접근 가능
```

### Controller 예시 (업무도메인 + path prefix)

```kotlin
// 앱 전용 API — 해당 앱에서만 사용하는 경우
// com.runnshop.order.controller.CustomerOrderController
@RestController
@RequestMapping("/api/mobile/v1/my/orders")       // 플랫폼 고객웹 전용
class CustomerOrderController { ... }

// com.runnshop.order.controller.AdminOrderController
@RestController
@RequestMapping("/api/admin/v1/orders") // 플랫폼 어드민 전용
class AdminOrderController { ... }

// com.runnshop.order.controller.PartnerOrderController
@RestController
@RequestMapping("/api/partner/v1/orders") // 플랫폼 입점사 전용
class PartnerOrderController { ... }
```

```kotlin
// 공용 API — 여러 앱에서 동일 로직을 사용하는 경우
// 하나의 Controller에 다중 path prefix를 매핑한다.
// com.runnshop.catalog.controller.ProductController
@RestController
class ProductController(private val productService: ProductService) {

    @GetMapping(
        "/api/mobile/v1/products/{productId}",  // 플랫폼 고객웹
        "/api/admin/v1/products/{productId}",   // 플랫폼 어드민
        "/api/partner/v1/products/{productId}"  // 플랫폼 입점사
    )
    fun getProduct(@PathVariable productId: Long) = productService.getProduct(productId)
}
```

> **규칙**: 동일 비즈니스 로직을 3개 앱에서 모두 사용하면 하나의 메서드에 3개 URL을 매핑한다.
> 앱별로 응답이 다르거나 권한 체크가 다르면 별도 Controller로 분리한다.

---

## Mock 데이터 서비스

프로토타입 단계에서 API는 Mock JSON을 반환합니다.

### Mock 파일 위치

폴더는 **도메인(업무영역) 기준**으로 나눈다 (12개 업무도메인). 채널(admin/partner/mobile)로는 폴더를 나누지 않는다 — 하나의 도메인 폴더 안에 모든 채널의 Mock 파일이 함께 들어간다.

```
api/runNshop-api/src/main/resources/mock/
├── order/           ← Order 도메인 (admin/partner/mobile 공용)
├── catalog/         ← Catalog 도메인
├── member/          ← Member 도메인
├── payment/         ← Payment 도메인
├── promotion/       ← Promotion 도메인
├── settlement/      ← Settlement 도메인
├── vendor/          ← Vendor 도메인
├── notification/    ← Notification 도메인
├── community/       ← Community 도메인
├── search/          ← Search 도메인
├── config/          ← Config 도메인
└── audit/           ← Audit 도메인
```

### Mock 파일 네이밍 규칙

```
{channel}__{HTTP_METHOD}_{API_PATH}.json

예시 (폴더: mock/{domain}/):
catalog/mobile__GET_products_{product_id}.json   → GET /api/mobile/v1/products/{product_id}
order/mobile__GET_my_orders.json                 → GET /api/mobile/v1/my/orders
order/admin__GET_orders.json                     → GET /api/admin/v1/orders
order/partner__GET_orders.json                   → GET /api/partner/v1/orders
vendor/partner__GET_home_summary.json            → GET /api/partner/v1/home/summary
member/mobile__GET_my_summary.json               → GET /api/mobile/v1/my/summary
promotion/mobile__GET_exhibitions.json           → GET /api/mobile/v1/exhibitions
```

> **구분자**: `__` (이중 언더스코어)로 **채널**과 API를 분리한다 (도메인은 폴더가 담당하므로 파일명에서는 뺀다).
> `{channel}`: `admin` | `partner` | `mobile` 중 하나. API_PATH는 URL의 `/`를 `_`로 치환하고 Path Prefix(`/api/{channel}/v1`)는 생략하되 `/my`는 그대로 포함한다. path parameter는 `{param_name}` 형태의 snake_case로 표기한다.

### 응답 구조 표준

```json
{
  "code": "SUCCESS",
  "data": { ... }
}

// 목록 응답
{
  "code": "SUCCESS",
  "data": {
    "total_count": 100,
    "page": 1,
    "page_size": 20,
    "items": [ ... ]
  }
}
```

---

## 실행 방법

### Back-end API 서버 (포트 8080)

```bash
cd api/runNshop-api
./gradlew bootRun
# → http://localhost:8080
# 플랫폼 고객웹 API: http://localhost:8080/api/mobile/v1/...
# 플랫폼 어드민 API: http://localhost:8080/api/admin/v1/...
# 플랫폼 입점사 API: http://localhost:8080/api/partner/v1/...
```

### Front-end 앱

```bash
# 플랫폼 고객웹
cd apps/runNshop-mobile
npm run dev
# → http://localhost:3000

# 플랫폼 어드민
cd apps/runNshop-admin
npm run dev
# → http://localhost:3001

# 플랫폼 입점사
cd apps/runNshop-partner
npm run dev
# → http://localhost:3002
```

---

## Front-end에서 API 호출

```typescript
// apps/runNshop-mobile/lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080';
const PREFIX = '/api/mobile/v1';

export async function api<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${PREFIX}${path}`);
  const json = await res.json();
  return json.data;
}

// 사용 예시
const home = await api('/display/pages/home');
const cart = await api('/my/cart');
```

```typescript
// apps/runNshop-admin/lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080';
const PREFIX = '/api/admin/v1';

export async function api<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${PREFIX}${path}`);
  const json = await res.json();
  return json.data;
}

// 사용 예시
const summary = await api('/home/summary');
const orders = await api('/orders');
```

```typescript
// apps/runNshop-partner/lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080';
const PREFIX = '/api/partner/v1';

export async function api<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${PREFIX}${path}`);
  const json = await res.json();
  return json.data;
}

// 사용 예시
const summary = await api('/home/summary');
const settlements = await api('/settlements');
```

---

## 설계 문서 참조

| 문서 | 경로 | 용도 |
|------|------|------|
| 요구사항 정의서 | `docs/1. 요구사항/runNshop_requirements_v1_0.md` | 기능 범위 확인 |
| 정책서 | `docs/2. 정책서/runNshop_policy_v1_0.md` | 비즈니스 룰 |
| 도메인 설계 | `docs/3. 도메인/runNshop_bounded_context_v1_0.md` | 12개 업무도메인 정의 |
| 모듈러 모놀리스 | `docs/3. 도메인/runNshop_modular_monolith_v1_0.md` | 아키텍처 |
| 이벤트 플로우 | `docs/3. 도메인/runNshop_event_flow_v1_0.mmd` | 도메인 간 이벤트 |
| 업무 플로우 | `docs/4. 업무플로우/runNshop_business_process_v1_0.md` | 프로세스 흐름 |
| ERD | `docs/5. 엔티티정의/runNshop_erd_v1_0.md` | 데이터 모델 |
| 화면 정의서 | `docs/6. 화면정의/runNshop_screen_definition_v1_0.md` | 화면 스펙·API 목록 |
| 화면 구조 가이드 | `docs/6. 화면정의/runNshop_admin_screen_guide_v1_0.md` | 어드민/파트너 재사용 지침 |
| 스타일 가이드 | 각 앱 `/guide` 페이지 (실행 중 확인) | UI 레이아웃·컴포넌트 참조 |

---

## 프로토타입 시작 프롬프트

### 플랫폼 고객웹 (runNshop-mobile)

```
docs/6. 화면정의/의 화면 정의서를 참고해서
CUS-001 메인 홈을 모바일 360px Next.js 프로토타입으로 만들어줘.
데이터는 Back-end API(http://localhost:8080)에서 fetch로 가져와:
  - GET /api/mobile/v1/display/pages/home
스타일 가이드(http://localhost:3000/guide)를 참고해.
```

### 플랫폼 어드민 (runNshop-admin)

```
docs/6. 화면정의/의 화면 정의서를 참고해서
공통 GNB+탭 레이아웃과 ADM-HOME 홈 탭을 PC 웹 Next.js 프로토타입으로 만들어줘.
데이터는 Back-end API(http://localhost:8080)에서 fetch로 가져와:
  - GET /api/admin/v1/home/summary
  - GET /api/admin/v1/home/trend
차트는 Chart.js를 사용해.
```

### 플랫폼 입점사 (runNshop-partner)

```
docs/6. 화면정의/의 화면 정의서를 참고해서
VND-000-001 로그인 + VND-HOME 홈 탭을 PC 웹 Next.js 프로토타입으로 만들어줘.
데이터는 Back-end API(http://localhost:8080)에서 fetch로 가져와:
  - GET /api/partner/v1/home/summary
  - GET /api/partner/v1/home/trend
```

---

## 개발 규칙

### 공통
- 모든 데이터는 Back-end API를 통해 가져온다 (하드코딩 금지)
- 프로토타입 단계에서 API Controller는 Mock JSON을 반환한다
- 설계 문서(`docs/`)를 우선 참조하여 구현한다
- 도메인 간 의존은 최소화하고, 필요 시 이벤트 기반 연동

### Front-end
- App Router 기반 (`app/` 디렉토리)
- Server Component 우선, 인터랙션 필요 시 Client Component
- 앱별 `lib/api.ts` 유틸로 API 호출 (path prefix 내장)
- 반응형은 각 앱 타겟 해상도에 맞춰 구현

### Back-end
- 단일 실행 모듈, 12개 업무도메인 패키지로 분리
- URL path prefix로 앱별 접근 통제 (`/api/mobile/v1/`, `/api/admin/v1/`, `/api/partner/v1/`)
- 프로토타입 단계: Controller → MockLoader → JSON 반환
- 이후 단계: Controller → Service → Repository 레이어 확장
- MSA 전환 시: 도메인 패키지 = 독립 서비스 분리 단위

---

## 프로토타입 구현 우선순위

| 단계 | 대상 | 범위 | 이유 |
|------|------|------|------|
| 1단계 | API | 공통 MockLoader + Catalog·Order Mock API | 모든 프론트의 기반 데이터 |
| 2단계 | 플랫폼 고객웹 | CUS-001 홈 → CUS-011 상품상세 → CUS-040 장바구니 → CUS-041 주문서 | 핵심 구매 플로우 |
| 3단계 | 플랫폼 어드민 | ADM-HOME → ADM-020 상품심사 → ADM-040 주문관리 | 운영 핵심 |
| 4단계 | 플랫폼 입점사 | VND-HOME → VND-010 상품관리 → VND-020 주문관리 | 파트너 핵심 |

> **원칙**: API 먼저 → 고객웹 구매 플로우 → 어드민/입점사 순

---

## 공통 UI 컴포넌트 컨벤션

### 디렉토리 구조 (각 앱 공통)

```
apps/runNshop-{app}/
├── components/
│   ├── common/          ← Button, Input, Modal, Toast, Badge
│   ├── layout/          ← Header, BottomNav, GNB, Sidebar
│   └── product/         ← ProductCard (TypeA~D), PriceDisplay
├── styles/
│   └── globals.css      ← Tailwind + 디자인 토큰
└── lib/
    ├── api.ts           ← API 호출 유틸
    └── constants.ts     ← 색상, 폰트, 간격 토큰
```

### 디자인 토큰

```typescript
// lib/constants.ts
export const COLORS = {
  primary: '#FF4D00',      // runNshop 메인 (러닝 오렌지)
  secondary: '#1A1A1A',
  success: '#00C853',
  warning: '#FF9800',
  error: '#F44336',
  gray: { 100: '#F5F5F5', 300: '#E0E0E0', 500: '#9E9E9E', 700: '#616161', 900: '#212121' },
};

export const FONT_SIZE = {
  xs: '11px', sm: '13px', md: '15px', lg: '18px', xl: '22px', '2xl': '28px',
};
```

### 네이밍 규칙

| 대상 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 | PascalCase | `ProductCard.tsx` |
| 유틸/훅 | camelCase | `useProductList.ts` |
| 상수 | UPPER_SNAKE_CASE | `MAX_CART_ITEMS` |
| CSS 클래스 | Tailwind 유틸리티 우선 | `className="text-sm font-bold"` |

---

## 환경변수 정의

각 앱 루트에 `.env.local` 파일을 생성합니다.

```bash
# apps/runNshop-mobile/.env.local
NEXT_PUBLIC_API_BASE=http://localhost:8080
NEXT_PUBLIC_APP_NAME=runNshop-mobile
NEXT_PUBLIC_APP_ENV=development

# apps/runNshop-admin/.env.local
NEXT_PUBLIC_API_BASE=http://localhost:8080
NEXT_PUBLIC_APP_NAME=runNshop-admin
NEXT_PUBLIC_APP_ENV=development

# apps/runNshop-partner/.env.local
NEXT_PUBLIC_API_BASE=http://localhost:8080
NEXT_PUBLIC_APP_NAME=runNshop-partner
NEXT_PUBLIC_APP_ENV=development
```

> 각 앱에 `.env.example` 파일을 두어 필요 환경변수를 문서화한다.

---

## 에러 처리 표준

### API 에러 응답 형식

```json
{
  "code": "ERROR_CODE",
  "message": "사용자에게 보여줄 메시지",
  "detail": "개발자용 디버그 정보 (운영 환경에서는 생략)"
}
```

### 주요 에러 코드

| code | HTTP Status | 의미 |
|------|------------|------|
| `SUCCESS` | 200 | 정상 |
| `BAD_REQUEST` | 400 | 파라미터 오류 |
| `UNAUTHORIZED` | 401 | 인증 필요 |
| `FORBIDDEN` | 403 | 권한 없음 |
| `NOT_FOUND` | 404 | 리소스 없음 |
| `INTERNAL_ERROR` | 500 | 서버 오류 |

### 프론트 에러 처리 패턴

```typescript
// lib/api.ts
class ApiError extends Error {
  constructor(public code: string, message: string) {
    super(message);
  }
}

export async function api<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${PREFIX}${path}`);
  const json = await res.json();

  if (json.code !== 'SUCCESS') {
    throw new ApiError(json.code, json.message);
  }
  return json.data;
}
```

---

## Git 브랜치 전략

```
main                          ← 항상 배포 가능 상태
├── feat/mobile-cus-001       ← 고객웹 홈 화면
├── feat/mobile-cus-011       ← 고객웹 상품상세
├── feat/admin-home           ← 어드민 홈
├── feat/partner-home         ← 입점사 홈
├── feat/api-catalog-mock     ← API Catalog Mock 구현
└── fix/mobile-cart-layout    ← 버그 수정
```

**네이밍 규칙**: `{type}/{app}-{설명}`

| type | 용도 |
|------|------|
| `feat` | 새 기능/화면 |
| `fix` | 버그 수정 |
| `refactor` | 구조 개선 |
| `chore` | 설정/도구 변경 |

| app | 대상 |
|-----|------|
| `mobile` | 플랫폼 고객웹 |
| `admin` | 플랫폼 어드민 |
| `partner` | 플랫폼 입점사 |
| `api` | Back-end API |
| `common` | 공통 |

---

## 프로토타입 제약사항 (의도적 생략)

프로토타입 단계에서는 UI 흐름 검증에 집중하며, 아래 항목은 의도적으로 생략합니다.

| 항목 | 프로토타입 처리 | 이후 구현 |
|------|--------------|----------|
| 인증/로그인 | 항상 로그인된 상태로 간주 (JWT bypass) | Spring Security + Redis 세션 |
| 결제 | 주문 완료 화면으로 바로 이동 | PG 연동 (토스페이먼츠) |
| 이미지 업로드 | 로컬 placeholder 이미지 사용 | AWS S3 + Rekognition |
| 알림 | 미구현 | FCM + 카카오 알림톡 |
| 검색 | Mock 고정 결과 반환 | Elasticsearch |
| 배송 추적 | Mock 상태 고정 | 배송사 API 연동 |
| 포인트/쿠폰 계산 | Mock 고정 금액 | 실시간 계산 로직 |
| 동시성 제어 | 미구현 | Redis 분산 락 + Outbox |
| 데이터베이스 | Mock JSON 파일 | PostgreSQL + JPA |
| 외부 API 연동 | 미구현 | PG, 배송사, SNS 로그인 |

> **원칙**: UI 흐름 검증에 필요한 것만 구현. 외부 연동·보안·동시성은 이후 단계에서 처리.

### 데이터 수정/등록 처리 방침

프로토타입에서는 데이터의 실제 수정·등록(POST/PUT/DELETE)을 수행하지 않습니다.
단, 해당 기능을 사용자가 수행할 때 **예외사항 안내 UI는 구현**합니다.

| 상황 | 프로토타입 처리 |
|------|--------------|
| 등록/수정 버튼 클릭 | Toast 또는 Alert로 "프로토타입에서는 지원하지 않는 기능입니다" 안내 |
| 유효성 검증 실패 | 실제 검증 로직 그대로 구현 (에러 메시지 표시) |
| 필수값 미입력 | 실제와 동일하게 안내 |
| 권한 없는 접근 | "권한이 없습니다" 안내 |
| 품절 상품 주문 시도 | "품절된 상품입니다" 안내 |
| 금지어 입력 | 금지어 검증 후 차단 메시지 표시 |

> **원칙**: 데이터를 실제로 저장하지는 않지만, 사용자에게 보여줄 예외 안내·검증 피드백은 실제와 동일하게 구현하여 UX 흐름을 검증한다.
