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

## 도메인 설계 참조
#[[file:docs/3. 도메인/runNshop_bounded_context_v1_0.md]]
