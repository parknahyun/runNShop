---
inclusion: always
---
# API 설계 규칙

## URL Path Prefix 접근 통제
| 앱 | Path Prefix |
|----|------------|
| 플랫폼 고객웹 | `/api/v1/**` |
| 플랫폼 어드민 | `/api/admin/v1/**` |
| 플랫폼 입점사 | `/api/partner/v1/**` |

## Controller 분리 기준

### 앱 전용 — 별도 Controller
```kotlin
@RequestMapping("/api/v1/orders")         // 고객웹 전용
@RequestMapping("/api/admin/v1/orders")   // 어드민 전용
@RequestMapping("/api/partner/v1/orders") // 입점사 전용
```

### 공용 — 하나의 메서드에 다중 매핑
```kotlin
@GetMapping("/api/v1/products/{id}", "/api/admin/v1/products/{id}", "/api/partner/v1/products/{id}")
```

## 규칙
- 동일 로직 3개 앱 사용 → 하나의 메서드에 3개 URL 매핑
- 앱별 응답/권한 다르면 → 별도 Controller 분리
- 프로토타입: Controller → MockLoader → JSON 반환
