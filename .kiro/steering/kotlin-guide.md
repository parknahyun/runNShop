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

## 코멘트 규칙
- 모든 Controller/Service 메서드는 KDoc(`/** ... */`) 코멘트를 반드시 작성한다 — 어떤 API(URL/용도)를 처리하는지 한 줄 이상 설명한다.
- 섹션 구분 주석(`// ── ... ──`)은 메서드별 코멘트를 대체하지 않는다. 둘 다 쓴다.

## 섹션 구분 — 서브도메인 통합 Controller/Service
여러 앱(채널)을 하나의 Controller/Service로 통합한 경우(`api-design-rules.md`의 "Controller/Service 분리 단위" 참조), 섹션 주석(`// ── ... ──`)으로 메서드를 채널별로 묶는다.
- **최소 단위는 회원(mobile) / 관리자(admin) / 파트너(partner) 3개 채널**이다. 채널이 섞이지 않도록 각 채널의 메서드를 한 블록에 모은다 (예: "고객 주문서"와 "고객 주문 목록"처럼 같은 채널인데 섹션이 쪼개져 있으면 하나로 합친다).
- 채널 섹션 안에서 더 세분화(예: `my`/마이페이지 전용 하위 섹션)해도 된다 — 다만 상위 채널 섹션 구조를 깨지 않아야 한다.
- **메서드를 추가할 때는 그 메서드가 속하는 섹션 블록 안의 위치에 넣는다.** 파일 맨 끝에 아무 섹션에나 붙이지 않는다 — 어느 채널(및 하위 섹션)에 속하는지 먼저 판단하고 그 블록 안에 삽입한다.

## Controller/Service 분리 기준
- 하나의 Controller(또는 Service) 클래스가 보유하는 메서드는 **최대 30개**까지 허용한다.
- 30개를 넘어가면 앱 기준이 아니라 **하위 업무 기준**으로 패키지를 추가 분리한다 (예: `order/` 안에 `shipping/`, `claim/`을 별도 패키지로 뺀 전례와 동일한 방식 — `DP-클래스설계/order.md` §1 패키지 구조 참고).
- 이 기준에 도달하기 전까지는 섣불리 쪼개지 않는다 — 분리는 실제로 메서드 수가 넘칠 때 그 시점에 검토한다.

## 도메인 설계 참조
#[[file:docs/3. 도메인/runNshop_bounded_context_v1_0.md]]
