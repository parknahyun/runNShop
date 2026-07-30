---
inclusion: always
---
# Mock 데이터 규칙

## 파일 위치
```
api/runNshop-api/src/main/resources/mock/
├── v1/              ← 플랫폼 고객웹
├── admin/           ← 플랫폼 어드민
└── partner/         ← 플랫폼 입점사
```

## 파일명 규칙
```
{domain}__{HTTP_METHOD}_{API_PATH}.json
```
- 구분자: `__` (이중 언더스코어)로 도메인과 API 분리
- API_PATH: URL의 `/`를 `_`로 치환, path parameter는 `{param_name}` 유지

### 예시
| 파일명 | API |
|--------|-----|
| catalog__GET_products_{product_id}.json | GET /api/v1/products/{product_id} |
| order__GET_members_me_orders.json | GET /api/v1/members/me/orders |
| order__GET_admin_orders.json | GET /api/admin/v1/orders |
| vendor__GET_partner_home_summary.json | GET /api/partner/v1/home/summary |

## 12개 업무도메인
order, catalog, member, payment, promotion, settlement, vendor, notification, community, search, config, audit

## 응답 구조 표준
```json
{ "code": "SUCCESS", "data": { ... } }
```

## 에러 응답
```json
{ "code": "ERROR_CODE", "message": "사용자 메시지", "detail": "디버그 정보" }
```
