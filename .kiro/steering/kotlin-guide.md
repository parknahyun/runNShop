---
inclusion: fileMatch
fileMatchPattern: "**/*.kt"
---
# Kotlin 개발 가이드

## 기술 스택
- Kotlin + Spring Boot 3.3
- JDK 21
- Gradle (Kotlin DSL)

## 패키지 구조
```
com.runnshop.{domain}/
├── controller/     ← REST Controller (URL path로 앱 구분)
├── service/        ← 비즈니스 로직 (프로토타입: Mock 반환)
├── dto/            ← 요청/응답 DTO
└── mock/           ← Mock JSON 로딩
```

## 12개 업무도메인
order, catalog, member, payment, promotion, settlement, vendor, notification, community, search, config, audit

## 프로토타입 단계 Controller 패턴
```kotlin
@RestController
@RequestMapping("/api/v1/products")
class CustomerProductController(private val mockLoader: MockLoader) {

    @GetMapping("/{productId}")
    fun getProduct(@PathVariable productId: Long): ResponseEntity<Any> {
        val data = mockLoader.load("v1", "catalog__GET_products_\${productId}.json")
        return ResponseEntity.ok(data)
    }
}
```

## Controller/Service 분리 기준
- 하나의 Controller(또는 Service) 클래스가 보유하는 메서드는 **최대 30개**까지 허용한다.
- 30개를 넘어가면 앱 기준이 아니라 **하위 업무 기준**으로 패키지를 추가 분리한다 (예: `order/` 안에 `shipping/`, `claim/`을 별도 패키지로 뺀 전례와 동일한 방식 — `DP-클래스설계/order.md` §1 패키지 구조 참고).
- 이 기준에 도달하기 전까지는 섣불리 쪼개지 않는다 — 분리는 실제로 메서드 수가 넘칠 때 그 시점에 검토한다.

## 도메인 설계 참조
#[[file:docs/3. 도메인/runNshop_bounded_context_v1_0.md]]
