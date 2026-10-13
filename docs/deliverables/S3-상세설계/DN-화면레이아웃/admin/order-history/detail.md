# 화면 레이아웃 — admin 주문 상세 (컨테이너)

> 상위 문서: [index.md](index.md) · [../index.md](../index.md) · [../../readme.md](../../readme.md)
> **단계**: 상세설계 (S3) | **문서범위**: Bolt (Order + Payment, admin 채널) | **문서종류**: Design
> 화면 섹션 표준 구조·유효성 검증 규칙은 [../../readme.md](../../readme.md) §0 참조

---

## 11. admin — 주문 상세 (OrderDetail MDI 탭 — 컨테이너)

> 목록 화면은 [list.md](list.md) (SCR-A-001) 참조. 이 문서는 탭을 감싸는 컨테이너(헤더+탭바)만 다루며,
> 각 탭의 상세 내용은 [tabs/](tabs/) 하위 파일로 분리되어 있다.

### 메타블록

| 항목 | 내용 |
|---|---|
| 화면 ID | SCR-A-002 (감싸는 화면, 호출 API 없음) |
| 앱 | admin |
| 접근 권한 | CS 담당자 (권한 체크 미적용 — 프로토타입) |
| 관련 세부UC | UC-6 (예외취소), UC-14 (조회) ([DK-세부유스케이스/order.md](../../../DK-세부유스케이스/order.md)) |
| 호출 API | — (탭별 호출 API는 각 탭 문서 참조) |

### 와이어프레임 — 탭 헤더 + InnerTabs

```
┌──────────────────────────────────────────────────────────────────────┐
│ ORD-20260626-001        ⦿결제완료  나이키코리아  152,000원           │ ← 탭 헤더
├──────────────────────────────────────────────────────────────────────┤
│ [●주문상품] [결제정보] [배송정보] [CS·클레임] [주문문의] [변경이력]    │ ← InnerTabs
├──────────────────────────────────────────────────────────────────────┤
│ (활성 탭 콘텐츠 — 탭별 상세는 tabs/ 하위 파일 참조)                  │
└──────────────────────────────────────────────────────────────────────┘
```

### 화면 구성

| 영역 | 데이터 소스 (API) | 표시 내용 |
|---|---|---|
| 탭 헤더 | GET /api/admin/v1/orders/{orderId} | 주문번호, 상태 뱃지, 입점사명, 결제금액, 주문일시 |
| InnerTabs (R0) | — (FE 상태) | 탭 전환, 현재 활성 탭 |

### 탭 목록 (R0-F1 탭 전환 → R0-S1 활성 탭)

| 탭 | 화면 ID | 데이터 소스 (API) | 파일 |
|---|---|---|---|
| 주문상품 (OrderItemsTab) | SCR-A-002-T1 | GET /api/admin/v1/orders/{orderId} | [tabs/items.md](tabs/items.md) |
| 결제정보 (PaymentInfoTab) | SCR-A-002-T2 | GET /api/admin/v1/orders/{orderId}/payment | [tabs/payment.md](tabs/payment.md) |
| 배송정보 (ShippingInfoTab) | SCR-A-002-T3 | GET /api/admin/v1/orders/{orderId}/shipping | [tabs/shipping.md](tabs/shipping.md) |
| CS·클레임 (ClaimTab) | SCR-A-002-T4 | GET /api/admin/v1/orders/{orderId}/claims | [tabs/claim.md](tabs/claim.md) |
| 주문문의 (InquiryTab) | SCR-A-002-T5 | GET /api/admin/v1/orders/{orderId}/inquiries | [tabs/inquiry.md](tabs/inquiry.md) |
| 변경이력 (ChangeLogTab) | SCR-A-002-T6 | GET /api/admin/v1/orders/{orderId}/logs | [tabs/log.md](tabs/log.md) |

### 화면 전환

| 트리거 | 이동 화면 (SCR-ID) |
|---|---|
| [list.md](list.md) 목록 행 클릭 → 진입 | SCR-A-002 (이 화면, 같은 화면 내 탭 오픈) |
| CS·클레임 탭 → 클레임번호 클릭 | [SCR-A-004 (클레임상세 MDI 탭, 같은 화면 내 탭 오픈)](../claim.md) |
| 주문문의 탭 → 문의번호 클릭 | 문의 상세/답변 모달 (화면 전환 아님, [tabs/inquiry.md](tabs/inquiry.md) 참조) |

### 유효성 검증

> [DJ-GWT수용기준/order.md](../../../DJ-GWT수용기준/order.md) GWT §6 CS 예외취소 Bolt · 에러코드는 DL 참조 (예외취소는 CS·클레임 탭 소관, [tabs/claim.md](tabs/claim.md) 참조)

### 상태별 UI

| 상태 | 화면 표현 |
|---|---|
| 로딩 중 | "불러오는 중..." 메시지 |

---

*공통 작성 규칙·채널별 패턴 요약·근거는 [../../readme.md](../../readme.md)에 있습니다.*
