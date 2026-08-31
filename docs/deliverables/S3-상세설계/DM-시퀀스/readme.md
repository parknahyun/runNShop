# 시퀀스 — 주문·결제 도메인

> **단계**: 상세설계 (S3)  
> **문서범위**: Bolt (Order + Payment)  
> **문서종류**: Design  
>
> **작성 목적**: 인터페이스 명세(DL)의 API를 호출 순서·참여 객체·트랜잭션 경계로 구체화한다.  
> "이 API가 호출되면 내부에서 어떤 순서로 어떤 객체가 상호작용하는가"를 확정한다.
>
> **흐름 내 위치**:
> ```
> DL 인터페이스 명세 → DM 시퀀스 → DN 화면 레이아웃 / DP 클래스 설계
> ```

---

## 공통 규칙 (C3 아키텍처컨벤션 / C5 이벤트설계컨벤션 준수)

### 1. Controller 네이밍 (C3 §4.2)

> 모든 시퀀스의 Controller participant는 **앱별로 분리된 이름**을 사용한다 (Service는 공유).
> `{App}{Domain}Controller` 형식 — 예: `CustomerOrderController`(고객웹), `AdminOrderController`(어드민), `PartnerOrderController`(입점사).
> 이하 다이어그램의 `CustomerCartController`, `CustomerOrderController`, `CustomerClaimController`, `CustomerClaimPaymentController`, `PartnerOrderController`, `PartnerShippingController`, `PartnerClaimController`, `AdminOrderController`, `AdminClaimController`가 이 규칙을 따른다.

### 2. EventPublisher = Outbox 패턴 표현 (C5 §5.1)

> 본 문서의 시퀀스에서 `Service -> EventPublisher : publish(EVENT_NAME)` 호출은
> **"비즈니스 데이터 변경과 동일 트랜잭션 내에서 Outbox 테이블에 이벤트를 저장하는 행위"**를 축약 표현한 것이다.
> 즉 `EventPublisher.publish(...)`는 `outboxRepository.save(OutboxEvent(...))`와 동일 트랜잭션에서 실행되며,
> 실제 Broker(또는 프로토타입의 in-process ApplicationEventPublisher) 발행은 별도의 **Outbox Publisher**가
> Outbox 테이블을 polling(1초 주기)하여 비동기로 수행한다(C5 §5.1~§5.3).
>
> ```
> [Service 트랜잭션]                    [Outbox Publisher (비동기, 별도 프로세스)]
> 1. 비즈니스 데이터 변경                  Outbox 테이블 polling
> 2. EventPublisher.publish(...)   ──▶   → Broker 발행 (프로토타입: ApplicationEvent)
>    = Outbox 테이블 INSERT               → 발행 완료 시 Outbox row 삭제
> 3. COMMIT (1·2 원자적)
> ```
>
> 프로토타입 단계에서는 C5 §5.3에 따라 Outbox 테이블 대신 in-process `ApplicationEventPublisher`를 사용하므로,
> 아래 다이어그램의 `EventPublisher` 참여자는 실 프로젝트 전환 시 `OutboxEventPublisher`(Outbox INSERT) + `OutboxPublisher`(polling·발행) 2단계로 분리된다.
> 컨슈머 측 멱등 처리(`processed_event` 테이블, eventId UNIQUE)는 C5 §6.1을 따른다.

---

## 도메인별 파일

도메인별 파일로 분리되어 있습니다.

| 구분 | 파일 | 시퀀스 수 |
|---|---|---|
| Order 도메인 | [order.md](order.md) | 25개 (§1~3, §4, §5~7, §7-1, §7-2, §8~15, §16~18, §18-1, §19~22) |
| Payment 도메인 | [payment.md](payment.md) | 1개 (§4-1) |

---

## 작성 규칙

| 규칙 | 설명 |
|---|---|
| 1 시퀀스 = 1 트리거 | API endpoint, 이벤트 수신, 스케줄 배치 각각 1개 시퀀스 |
| 태그로 유형 구분 | `[API]` 사용자 요청, `[컨슈머]` 이벤트 수신, `[배치]` 스케줄러 |
| 참여자 = 클래스 후보 | Controller/Listener/Scheduler, Service, Repository, PublicApi, EventPublisher |
| 트랜잭션 경계 표시 | Service 레벨에서 @Transactional |
| 에러 분기 포함 | 인터페이스 명세의 에러 응답과 대응 |
| 도메인 경계 명시 | 타 도메인 호출은 PublicApi(동기) 또는 EventPublisher(비동기)로 표현 |
| Controller 네이밍 | 앱별 분리 — `{App}{Domain}Controller` (C3 §4.2, 상단 공통 규칙 §1 참조) |
| EventPublisher 표현 | Outbox 패턴 축약 표현 — 비즈니스 변경과 동일 트랜잭션 (C5 §5.1, 상단 공통 규칙 §2 참조) |

---

## 근거

| 항목 | 출처 |
|---|---|
| API endpoint | 인터페이스 명세(DL) 50개 API 중 19개 API 시퀀스 상세화 (+ 컨슈머 2건, 배치 5건 — 총 26개 섹션. 2026-08-24 정정: 종전 "27개 중 15개"는 실제 건수와 불일치했음) |
| 컨슈머 시퀀스 | 이벤트 플로우(DI) PAYMENT_APPROVED 수신 액션 |
| 배치 시퀀스 | EARS(DE) REQ-ORD-006(D+7 자동확정), REQ-ORD-041(24시간 만료) |
| 에러 분기 | GWT(DJ) 예외 시나리오 |
| HTTP Status 코드 정합 | 인터페이스 명세(DL) 공통 규칙 §2 C6 §7 기준 — 2026-08-24 재고/상태충돌류(409)·기한초과류(422) 20건 및 INVALID_STATUS(신규, 409) 6건 정정 |
| 도메인 간 호출 | 이벤트 플로우(DI) 동기/비동기 판단 |
| 참여 객체 | ERD(DF) 엔티티 + 컴포넌트(D9) 모듈 구조 |
| 상태 전이 | 상태머신(DG) 전이 규칙 |
| Controller 네이밍 | C3 아키텍처컨벤션 §4.2 (앱별 Controller 분리) |
| Outbox 패턴 | C5 이벤트설계컨벤션 §5.1 (비즈니스 변경 + Outbox 저장 = 동일 트랜잭션) |

