# C6 API설계컨벤션
> 수립 데드라인: S3 인터페이스명세 전 | 참고 대상: 인터페이스명세, 시퀀스
---

## 1. 목적
RESTful API의 URL 설계, 요청/응답 구조, Mock 데이터 관리 규칙을 통일하여 Front-end와 Back-end 간 원활한 협업을 보장한다.

## 2. 규칙

### 2.1 URL Path Prefix

| 앱 | Prefix | 예시 |
|----|--------|------|
| 플랫폼 고객웹 | `/api/v1/` | /api/v1/orders |
| 플랫폼 어드민 | `/api/admin/v1/` | /api/admin/v1/orders |
| 플랫폼 입점사 | `/api/partner/v1/` | /api/partner/v1/orders |

### 2.2 URL 설계 규칙

| 규칙 | 예시 |
|------|------|
| 리소스는 복수형 명사 | /products, /orders |
| 계층 관계는 중첩 | /orders/{orderId}/items |
| 행위는 HTTP Method로 표현 | POST /orders (주문 생성) |
| 검색·필터는 Query Parameter | /products?category=shoes&sort=price |
| 내 리소스 접근 | /members/me/orders |

### 2.3 HTTP Method

| Method | 용도 | 멱등성 |
|--------|------|--------|
| GET | 조회 | ✓ |
| POST | 생성 | ✗ |
| PUT | 전체 수정 | ✓ |
| PATCH | 부분 수정 | ✓ |
| DELETE | 삭제 | ✓ |

### 2.4 응답 구조 표준

#### 성공 응답
```json
{
  "code": "SUCCESS",
  "data": { ... }
}
```

#### 목록 응답 (페이징)
```json
{
  "code": "SUCCESS",
  "data": {
    "items": [ ... ],
    "pagination": {
      "page": 1,
      "size": 20,
      "totalCount": 150,
      "totalPages": 8
    }
  }
}
```

#### 에러 응답
```json
{
  "code": "ERROR_CODE",
  "message": "사용자에게 표시할 메시지",
  "detail": "디버그용 상세 정보 (개발 환경만)"
}
```

### 2.5 Mock 데이터 파일 규칙

| 항목 | 규칙 |
|------|------|
| 위치 | `api/runNshop-api/src/main/resources/mock/{app}/` |
| 앱 디렉토리 | v1/ (고객), admin/ (어드민), partner/ (입점사) |
| 파일명 | `{domain}__{HTTP_METHOD}_{API_PATH}.json` |
| 구분자 | `__` (이중 언더스코어)로 도메인과 API 분리 |
| Path 치환 | URL `/`를 `_`로, path parameter는 `{param_name}` 유지 |

### 2.6 Mock 파일명 예시

| 파일명 | API |
|--------|-----|
| catalog__GET_products_{product_id}.json | GET /api/v1/products/{product_id} |
| order__GET_members_me_orders.json | GET /api/v1/members/me/orders |
| order__GET_admin_orders.json | GET /api/admin/v1/orders |
| vendor__GET_partner_home_summary.json | GET /api/partner/v1/home/summary |

### 2.7 프로토타입 API 동작

| HTTP Method | 동작 |
|-------------|------|
| GET | MockLoader로 JSON 파일 로딩 후 반환 |
| POST | 요청 유효성 검증 → 성공 응답 반환 (저장 없음) |
| PUT / PATCH | 요청 유효성 검증 → 성공 응답 반환 (저장 없음) |
| DELETE | 성공 응답 반환 (삭제 없음) |

### 2.8 Controller → MockLoader 패턴

```kotlin
@RestController
@RequestMapping("/api/v1/products")
class ProductController(private val mockLoader: MockLoader) {

    @GetMapping("/{productId}")
    fun getProduct(@PathVariable productId: String): ResponseEntity<String> {
        return mockLoader.load("v1", "catalog__GET_products_{product_id}.json")
    }
}
```

## 3. 예시

### 주문 API 설계

| Method | Path | 설명 |
|--------|------|------|
| GET | /api/v1/members/me/orders | 내 주문 목록 |
| GET | /api/v1/members/me/orders/{orderId} | 주문 상세 |
| POST | /api/v1/orders | 주문 생성 |
| POST | /api/v1/orders/{orderId}/cancel | 주문 취소 |
| GET | /api/admin/v1/orders | 전체 주문 목록 (어드민) |
| PATCH | /api/admin/v1/orders/{orderId}/status | 주문 상태 변경 (어드민) |

### 유효성 검증 (프로토타입에서도 동일 적용)
```kotlin
data class CreateOrderRequest(
    @field:NotBlank val productId: String,
    @field:Min(1) val quantity: Int,
    @field:NotBlank val shippingAddressId: String
)
```

## 근거
- Path Prefix로 앱 간 접근 통제 기반 마련 (프로토타입에서는 미적용, 향후 Gateway 레벨 적용)
- Mock 파일 네이밍 규칙으로 API와 파일 간 추적성 확보
- 응답 구조 표준화로 Front-end의 공통 API 처리 로직 재사용
- 프로토타입에서도 유효성 검증을 적용하여 실 프로젝트 전환 비용 최소화
