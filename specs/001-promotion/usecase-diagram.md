# 유스케이스 다이어그램: 프로모션 (쿠폰·할인 정책)

> 기준: `spec.md` (Clarifications 2026-10-13 반영). 원본 DC 상위 유스케이스에서 아래를 반영·조정했다.
> - 프로모션 운영은 단일 "관리자" 역할 (역할 세분화 없음), 입점사는 자기 쿠폰 등록·비활성화만 수행
> - 배송비 할인·배송비 쿠폰 포함
> - 입점사(partner) 쿠폰·직매입 쿠폰 포함 (도메인정의서 partner 채널 추가, 이슈 #5·#7)
> - 제외: 이벤트·기획전, 포인트 적립·사은품, 정책 시작·종료 자동 전환(FR-013)

![프로모션 유스케이스 다이어그램](usecase-diagram.png)

> 위 이미지는 아래 PlantUML 소스를 렌더링한 결과이며, 소스를 수정하면 이미지를 다시 생성해야 한다.

```plantuml
@startuml
left to right direction
skinparam backgroundColor transparent
skinparam packageStyle rectangle

actor "관리자" as Admin
actor "고객" as Customer
actor "주문 시스템\n(Order)" as Order
actor "상품·검색 시스템\n(Catalog, Search)" as Catalog
actor "입점사\n(Partner)" as Partner
actor "배치" as Batch
actor "알림·정산 시스템\n(Notification, Settlement)" as Consumer

rectangle "프로모션 (Promotion)" {

  package "쿠폰 관리" {
    usecase "쿠폰 등록\n(상품·장바구니·배송비)" as UC01
    usecase "쿠폰 대상(타겟) 설정" as UC02
    usecase "쿠폰 발급\n(일괄·임의 발행)" as UC03
    usecase "쿠폰 다운로드" as UC04
    usecase "쿠폰 만료 처리" as UC05
    usecase "쿠폰 사용 확정" as UC06
    usecase "쿠폰 복원\n(취소·환불)" as UC07
    usecase "입점사 쿠폰 등록·비활성화" as UC08
    usecase "입점사 쿠폰 승인·반려" as UC09
  }

  package "할인 정책 관리" {
    usecase "할인 정책 등록·예약\n(행사가·수량구간·장바구니·배송비)" as UC10
    usecase "예약 정책 수정·취소" as UC11
    usecase "중복·택1 규칙 검증" as UC12
  }

  package "할인·쿠폰 계산 (주문 연동)" {
    usecase "상품 할인 계산" as UC20
    usecase "장바구니 할인 평가" as UC21
    usecase "배송비 할인 계산" as UC22
    usecase "적용 가능 쿠폰 조회" as UC23
    usecase "쿠폰 사용 검증" as UC24
  }

  package "상품 노출가 연동" {
    usecase "노출 할인가 전달" as UC30
    usecase "실시간 할인가·\n예상 최저가 조회" as UC31
  }

  usecase "프로모션 이벤트 발행\n(발급·사용·복원·노출가 변경)" as UC40
}

' 관리자
Admin --> UC01
Admin --> UC03
Admin --> UC10
Admin --> UC11
Admin --> UC09

' 입점사
Partner --> UC08

' 고객
Customer --> UC04
Customer --> UC31

' 주문 시스템
Order --> UC20
Order --> UC21
Order --> UC22
Order --> UC23
Order --> UC24
Order --> UC06
Order --> UC07

' 상품·검색 시스템
Catalog --> UC31
UC30 --> Catalog

' 배치
Batch --> UC05

' 알림·정산
UC40 --> Consumer

' 포함·확장 관계
UC01 ..> UC02 : <<include>>
UC08 ..> UC09 : <<extend>>
UC10 ..> UC12 : <<include>>
UC11 ..> UC12 : <<include>>
UC23 ..> UC24 : <<include>>
UC21 ..> UC20 : <<include>>
UC03 ..> UC40 : <<include>>
UC06 ..> UC40 : <<include>>
UC07 ..> UC40 : <<include>>
UC30 ..> UC40 : <<include>>
UC31 ..> UC20 : <<include>>
UC31 ..> UC23 : <<include>>

note right of UC10
  모든 정책은 시작일 1영업일 전까지
  등록·확정하며 즉시 활성화하지 않고
  예약 상태로 둔다.
  (시작·종료 자동 전환은 범위 제외)
end note

note bottom of UC22
  정률만 지원 (무료배송 = 100%)
  입점사 단위 배송비 1건 기준
end note

note right of UC01
  직매입 쿠폰: MD가 직접 등록하면
  승인 없이 즉시 사용 가능
end note

note bottom of UC09
  입점형 쿠폰만 승인 게이트 적용
  (승인 대기 → 사용 가능 / 반려)
end note

note bottom of UC07
  유효기간 내에서만 복원.
  구매 확정 후에는 복원 불가.
end note
@enduml
```

## 유스케이스 ↔ spec 매핑

| 유스케이스 | spec 근거 |
|---|---|
| UC01 쿠폰 등록 (직매입 포함) | FR-020, FR-009(배송비 쿠폰) |
| UC02 쿠폰 대상 설정 | FR-020 (REQ-PRM-043) |
| UC03 쿠폰 발급 | FR-021 (REQ-PRM-044) |
| UC04 쿠폰 다운로드 | FR-022 (REQ-PRM-046), US3 |
| UC05 쿠폰 만료 처리 | FR-023 (REQ-PRM-047) |
| UC06 쿠폰 사용 확정 | FR-024 |
| UC07 쿠폰 복원 | FR-024, FR-040 |
| UC08 입점사 쿠폰 등록·비활성화 | FR-026, FR-028 (REQ-PRM-040, 045) |
| UC09 입점사 쿠폰 승인·반려 | FR-027 (REQ-PRM-041, 042) |
| UC10 할인 정책 등록·예약 | FR-010, FR-011, FR-012, FR-009 |
| UC11 예약 정책 수정·취소 | FR-017 (US2 시나리오 5) |
| UC12 중복·택1 규칙 검증 | FR-014, FR-015 |
| UC20 상품 할인 계산 | FR-001, FR-005, FR-006 |
| UC21 장바구니 할인 평가 | FR-002 |
| UC22 배송비 할인 계산 | FR-009 (REQ-PRM-070, 073) |
| UC23 적용 가능 쿠폰 조회 | FR-004 |
| UC24 쿠폰 사용 검증 | FR-003, FR-008 |
| UC30 노출 할인가 전달 | FR-030 |
| UC31 실시간 할인가 조회 | FR-031 |
| UC40 이벤트 발행 | FR-040 |

## 원본(DC) 대비 차이

- 원본의 **이벤트 생성·운영, 이벤트 참여, 기획전 생성·운영** 유스케이스는 부록 A(정책 미확정)이므로 그리지 않았다.
- 원본 DC 본문의 **입점사 쿠폰 유스케이스**(등록·비활성화, 승인·반려)는 DB·D9에 partner 채널이 추가되어 포함했다(UC08, UC09).
- **배송비 할인 계산(UC22)**은 원본 DC에 없고 이번 clarify로 추가됐다.
- **쿠폰 만료 처리(UC05)**는 배치 액터로 분리했다. 정책 시작·종료 자동 전환(원본 REQ-PRM-010-1, 011, 012, 020-1)은 이번 spec에서 제외되어 배치 유스케이스에 없다.
