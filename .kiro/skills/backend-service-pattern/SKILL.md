---
name: backend-service-pattern
description: runNshop 백엔드(Kotlin/Spring Boot) Controller·Service를 구현하거나 리팩토링할 때 사용. 레이어 경계(Controller→Service→MockLoader/Repository), Service 내부 4단계 구조(validation→mapper execute→dto convert), 코멘트·섹션 규칙, 공용 예외 처리를 다룬다. screen-to-fe-code(FE 쪽)의 백엔드 짝.
---

# 백엔드 Controller/Service 구현 패턴

## 레이어 경계 — Controller는 요청/응답만

```
Controller (요청 파싱 + 응답 반환만, 가공 로직 없음)
    → Service (validation + 데이터 접근 + 가공, 도메인당 단일 클래스)
        → MockLoader (프로토타입: JSON 로딩) / Repository·Mapper (DB 전환 후)
```

- **Controller는 `MockLoader`를 직접 주입받지 않는다.** Controller 생성자는 Service(들)만 주입받는다. Controller가 `mockLoader.load(...)`를 직접 호출하는 코드를 발견하면 Service로 옮기는 리팩토링 대상이다.
- 이렇게 분리해두면 DB 전환 시 Service 내부(`MockLoader` 호출부)만 `Repository`/Mapper 호출로 바뀌고 Controller는 전혀 바뀌지 않는다.
- Mock JSON은 "Repository/Mapper가 쿼리했다면 돌려줬을 전체 데이터셋"으로 간주한다. 그 데이터를 가공(필터/정렬/페이징/집계)하는 책임은 Service에 있다.
- Controller/Service 클래스를 앱(mobile/admin/partner)별로 나눌지, 서브도메인 단위로 통합할지는 **AI가 단독으로 결정하지 않는다** — `.kiro/steering/api-design-rules.md` "Controller/Service 분리 단위" 절의 절차(분리안/통합안을 제시하고 휴먼이 확정)를 따른다. 이미 결정된 서브도메인(예: Order)이 있으면 `docs/deliverables/S3-상세설계/DP-클래스설계/{domain}.md`에 적힌 클래스/메서드 네이밍을 그대로 따른다 — 임의로 새 이름을 짓지 않는다.

## Service 메서드 내부 — 4단계 구조

목록 조회처럼 "필터+페이징+집계"가 섞이는 메서드는 아래 4단계로 명확히 나눈다. 프로토타입이라고 이 구조를 생략하지 않는다 — DB 전환 시 그대로 쿼리 구조에 대응되어야 한다.

```kotlin
fun getAdminOrders(filter: AdminOrderFilter): OrderListResponse {
    // ① validation — 형식/범위를 명시적으로 검증. 조용히 보정(coerceAtLeast 등)하지 않고 예외로 거부.
    val page = validatePage(filter.page)
    val size = validateSize(filter.size)
    validateDateRange(filter.from, filter.to)

    // ② mapper execute — list/count/summary가 섞여 있으면 쿼리 단위로 메서드를 분리한다.
    //    공유 조건(모든 쿼리가 쓰는 WHERE)과 쿼리별 전용 조건을 구분해서 섞지 않는다.
    val allOrders = loadAdminOrderDataset()                       // 조회 (DB: SELECT ... FROM ...)
    val sharedFiltered = applySharedFilters(allOrders, ...)        // 공유 조건 (keyword, dateRange)
    val summary = aggregateAdminSummary(sharedFiltered)           // summary 쿼리: 공유조건만, GROUP BY
    val listFiltered = sharedFiltered.filter { matchesStatus(...) } // list/count 쿼리 전용 조건 (status)
    val sorted = sortByOrderDateDesc(listFiltered)                  // list 쿼리의 ORDER BY
    val pageOrders = selectPage(sorted, page, size)                 // list 쿼리의 LIMIT/OFFSET
    val totalCount = countFiltered(sorted)                         // count 쿼리 (list와 동일 WHERE, LIMIT 없음)

    // ③ dto convert — Map<String, Any> 대신 명시적 DTO로 변환해서 반환한다.
    return OrderListResponse(orders = pageOrders, summary = summary, pagination = buildPagination(page, size, totalCount))
}
```

- **① validation**: `require()`는 쓰지 않는다(아래 "예외 처리" 참조 — `IllegalArgumentException`은 전역 핸들러가 400으로 받아주지만, 메시지를 코드화하려면 `BadRequestException`을 명시적으로 던지는 게 낫다).
- **② mapper execute**: list(목록)와 summary(집계)가 "검색조건은 같지만 상태 필터만 다르게" 적용돼야 하는 경우가 흔하다 (예: "요약 카드는 전체 상태 분포, 목록은 선택한 상태로 좁힘"). 이런 설계 의도가 있으면 반드시 코멘트로 명시한다 — 그냥 보면 버그처럼 보이기 쉽다. count는 메모리 리스트의 `.size`로 임시 대체해도 되지만, 메서드 이름과 코멘트에 "이건 나중에 별도 COUNT 쿼리가 된다"를 남긴다.
- **③ dto convert**: 응답 DTO는 해당 도메인의 `dto/` 패키지에 둔다. `DP-클래스설계/{domain}.md`에 이미 타입명이 정의돼 있으면(예: `OrderListResponse`) 그 이름을 그대로 쓴다.

가공 로직 없이 단순히 데이터를 그대로 반환하는 메서드(예: 상세 조회, 고정 응답)는 4단계를 전부 쓰지 않아도 된다 — 다만 Service를 거치는 것(레이어 경계)은 예외 없이 지킨다.

## 코멘트 규칙

- **모든 Controller/Service 메서드(public이든 private이든)는 KDoc(`/** ... */`)을 반드시 작성한다** — 무엇을 하는지 한 줄 이상. 관련 DL-인터페이스명세 섹션 번호(`(DL §15)` 등)가 있으면 같이 적는다.
- 섹션 구분 주석(`// ── ... ──`)은 메서드별 KDoc을 대체하지 않는다. 둘 다 쓴다 — 섹션 주석은 "이 블록이 어떤 채널/목적인지"의 목차 역할, KDoc은 메서드 하나하나의 상세 설명.
- 서브도메인 통합 Controller/Service에서 섹션 주석은 **최소 회원(mobile)/관리자(admin)/파트너(partner) 3개 채널**로 나눈다. 같은 채널인데 섹션이 쪼개져 있으면 하나로 합친다. 채널 섹션 안에서 더 세분화(예: `my` 하위 섹션)는 허용된다.
- **메서드를 추가할 때는 그 메서드가 속하는 섹션 블록 안의 위치에 삽입한다.** 파일 끝에 아무렇게나 붙이지 않는다.
- Controller/Service 하나당 메서드는 최대 30개. 넘으면 앱 기준이 아니라 하위 업무 기준으로 패키지를 더 쪼갠다(`order/`→`shipping/`,`claim/` 분리 전례 참고).

## 공용 예외 처리

`com.runnshop.common.exception`에 공용 예외 유형과 전역 핸들러가 있다 — 전 도메인이 공유한다.

```kotlin
BadRequestException(code, message, detail)       // 400 — 파라미터/Body 형식 오류
UnauthorizedException(code, message, detail)      // 401 — 인증 필요
ForbiddenException(code, message, detail)         // 403 — 권한 없음
NotFoundException(code, message, detail)          // 404 — 리소스 없음
ConflictException(code, message, detail)          // 409 — 상태머신 위반(예: CANCEL_NOT_ALLOWED)
UnprocessableException(code, message, detail)     // 422 — 기한초과/만료 등
```

- Service의 validation/비즈니스 규칙 위반은 이 예외들을 `throw`한다 — `require()`나 직접 `ResponseEntity`를 만들어 반환하지 않는다.
- `code` 값은 DL-인터페이스명세의 "Error Responses" 표에 이미 정의된 code를 그대로 쓴다 (예: `ADDRESS_REQUIRED`, `STOCK_NOT_AVAILABLE`). 문서에 없는 새 케이스를 추가할 때만 신규 code를 짓는다.
- `GlobalExceptionHandler`(`@RestControllerAdvice`)가 이 예외들과 `IllegalArgumentException`, 그 외 모든 `Exception`을 `{code, message, detail}` 표준 응답(`KIRO_START.md` 에러 처리 표준)으로 변환한다 — Controller에서 try/catch로 직접 처리하지 않는다.

## 적용 절차

1. 대상 Controller/Service 파일을 읽고, 위 규칙(레이어 경계·4단계·코멘트·예외) 중 어긋나는 지점을 찾는다.
2. `docs/deliverables/S3-상세설계/DP-클래스설계/{domain}.md`에서 클래스/메서드 네이밍이 이미 정의돼 있는지 먼저 확인한다(`work-scope.md` 1차 근거 우선 원칙).
3. 수정 후 `./gradlew compileKotlin`(또는 `clean compileKotlin`)으로 컴파일 확인.
4. `./gradlew bootRun`으로 서버 기동 후 curl로 정상 케이스 + validation 실패 케이스(400 응답 확인) 둘 다 검증. 서버 종료.
5. 이 패턴은 Order 도메인에서 처음 정립됐고 다른 도메인(member/catalog/promotion/vendor/config)에는 아직 전체 적용되지 않았다 — 그 도메인 코드를 다음에 건드릴 때 이 skill을 적용해 점진적으로 맞춘다. 기존 코드가 이 패턴에서 벗어나 있다는 사실만으로 지금 작업 범위 밖에서 먼저 나서서 고치지 않는다(범위 확인 후 진행).

## 참고 steering
- `.kiro/steering/kotlin-guide.md` — 패키지 구조, 코멘트/섹션/분리 기준 (이 skill의 steering측 근거)
- `.kiro/steering/api-design-rules.md` — URL Prefix, Controller 분리 단위 휴먼결정 절차
- `.kiro/steering/mock-data-rules.md` — Mock 파일 위치/네이밍
- `.kiro/steering/work-scope.md` — 1차 근거 우선 원칙, 도메인 작업 범위
