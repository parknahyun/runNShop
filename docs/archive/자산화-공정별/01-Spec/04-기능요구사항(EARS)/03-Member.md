# Member 도메인 기능요구사항 (EARS)

| 항목 | 내용 |
|---|---|
| 산출물 ID | SPEC-EARS-MEMBER-001 |
| Scope | Bolt (Member 도메인) |
| 상태 | DRAFT-v1 |
| 작성일 | 2026-07-30 |
| 입력 자산 | 도메인기능표(03-Member.md), runNshop_policy_v1_2.md §4/§15, 용어집, 도메인간-우선업무-의존관계.md |

> **Member 도메인 핵심 책임**: 고객 계정·등급·포인트·배송지를 관리한다.
>
> **1차 본개발 관계**: Order·Payment가 1차 본개발 대상이며, Member는 PublicApi(포인트·배송지·인증)를
> 정의하고 Mock 구현으로 제공한다.

---

## PublicApi — Order 연동 (Phase 0 최우선)

| ID | 패턴 | 채널 | 요구사항 | 출처 | 우선순위 |
|---|---|---|---|---|---|
| REQ-MEM-001 | Event-driven | C | WHEN Order 도메인이 포인트 잔액 조회를 요청하면(memberId), THE 회원시스템 SHALL 해당 회원의 현재 사용 가능 포인트 잔액을 반환한다 | Order REQ-ORD-073/074 | P1 |
| REQ-MEM-002 | Event-driven | C | WHEN Order 도메인이 포인트 사용을 요청하면(memberId, amount, orderId), THE 회원시스템 SHALL 잔액을 확인하고 요청 금액만큼 차감하여 사용 처리한다 | Order REQ-ORD-093 | P1 |
| REQ-MEM-003 | Unwanted | C | IF 포인트 사용 요청 금액이 보유 잔액을 초과하면, THEN THE 회원시스템 SHALL 사용을 거부하고 현재 잔액을 반환한다 | Order REQ-ORD-074 | P1 |
| REQ-MEM-004 | Event-driven | C | WHEN Order 도메인이 포인트 복원을 요청하면(memberId, amount, orderId, reason), THE 회원시스템 SHALL 해당 금액을 포인트에 복원(환급)한다 | Order REQ-ORD-006(취소), REQ-PAY-009(복합결제 실패) | P1 |
| REQ-MEM-005 | Event-driven | C | WHEN Order 도메인이 포인트 적립을 요청하면(memberId, orderAmount, orderId), THE 회원시스템 SHALL 해당 회원의 등급별 적립률을 적용하여 포인트를 적립한다 | Order REQ-ORD-017/054(구매확정) | P1 |
| REQ-MEM-006 | Event-driven | C | WHEN Order 도메인이 배송지 목록 조회를 요청하면(memberId), THE 회원시스템 SHALL 해당 회원의 등록된 배송지 목록(기본 배송지 표시 포함)을 반환한다 | Order REQ-ORD-072 | P1 |
| REQ-MEM-007 | Event-driven | C | WHEN Order 도메인이 회원 등급 조회를 요청하면(memberId), THE 회원시스템 SHALL 해당 회원의 현재 등급과 등급별 혜택 정보(적립률 등)를 반환한다 | Order 주문서 등급 표시 | P2 |
| REQ-MEM-008 | Ubiquitous | C | THE 회원시스템 SHALL 인증 토큰(Bearer {userId})에서 memberId를 추출하여 요청 주체를 식별한다 | Order 전 API 인증 전제 | P1 |

---

## 회원계정관리

| ID | 패턴 | 채널 | 요구사항 | 출처 | 우선순위 |
|---|---|---|---|---|---|
| REQ-MEM-010 | Event-driven | M | WHEN 고객이 회원가입 폼을 작성하여 제출하면, THE 회원시스템 SHALL 계정을 생성하고 상태를 ACTIVE로 설정한다 | 정책서 §4.1 | P1 |
| REQ-MEM-011 | Event-driven | M | WHEN 고객이 로그인(ID/PW 또는 SNS)을 요청하면, THE 회원시스템 SHALL 인증을 수행하고 인증 토큰을 발급한다 | 정책서 §4.1/§4.2 | P1 |
| REQ-MEM-012 | Unwanted | M | IF 로그인 시 5회 연속 실패하면, THEN THE 회원시스템 SHALL 계정을 30분간 잠금 처리한다 | 정책서 §15.5 | P1 |
| REQ-MEM-013 | Event-driven | M | WHEN 고객이 회원탈퇴를 요청하면, THE 회원시스템 SHALL 계정 상태를 WITHDRAWN으로 전환한다 | 정책서 §4.1 | P2 |
| REQ-MEM-014 | Event-driven | A | WHEN 관리자가 회원 상태를 변경(정상/잠금/정지/탈퇴)하면, THE 회원시스템 SHALL 상태를 전환하고 변경 이력을 기록한다 | 정책서 §4 | P2 |

---

## 배송지 관리

| ID | 패턴 | 채널 | 요구사항 | 출처 | 우선순위 |
|---|---|---|---|---|---|
| REQ-MEM-020 | Event-driven | M | WHEN 고객이 배송지를 등록(수령인·연락처·주소·우편번호)하면, THE 회원시스템 SHALL 배송지를 저장한다 | 정책서 §4 | P1 |
| REQ-MEM-021 | Event-driven | M | WHEN 고객이 배송지를 수정하면, THE 회원시스템 SHALL 변경 사항을 저장한다 | 정책서 §4 | P1 |
| REQ-MEM-022 | Event-driven | M | WHEN 고객이 배송지를 삭제하면, THE 회원시스템 SHALL 해당 배송지를 제거한다 | 정책서 §4 | P2 |
| REQ-MEM-023 | Ubiquitous | M | THE 회원시스템 SHALL 기본 배송지를 1개만 허용하며, 신규 기본 배송지 지정 시 기존 기본 배송지를 해제한다 | 정책서 §4 | P1 |

---

## 등급·혜택

| ID | 패턴 | 채널 | 요구사항 | 출처 | 우선순위 |
|---|---|---|---|---|---|
| REQ-MEM-030 | Event-driven | A | WHEN 관리자가 등급 산정 기준(구매금액·활동지수 기준선)을 설정하여 저장하면, THE 회원시스템 SHALL 등급 기준을 갱신한다 | 정책서 §4.3 | P1 |
| REQ-MEM-031 | Event-driven | B | WHEN 등급 산정 배치(월 1회)가 실행되면, THE 회원시스템 SHALL 전 회원의 등급을 재계산하고 승급/유지/강등을 적용한다 | 정책서 §4.3 | P2 |
| REQ-MEM-032 | Ubiquitous | B | THE 회원시스템 SHALL 등급 하향 시 1개월 유예 기간을 적용한 후 강등한다 | 정책서 §4.3 | P2 |
| REQ-MEM-033 | Ubiquitous | C | THE 회원시스템 SHALL 등급별 포인트 적립률을 적용한다: New 0.5%, Runner 1.0%, Pacer 1.5%, Elite 2.0% (확정 시 변경 예정) | 정책서 §4.4 | P1 |

---

## 포인트

| ID | 패턴 | 채널 | 요구사항 | 출처 | 우선순위 |
|---|---|---|---|---|---|
| REQ-MEM-040 | Event-driven | M | WHEN 고객이 포인트 내역을 조회하면, THE 회원시스템 SHALL 포인트 잔액과 적립/사용/소멸 이력을 반환한다 | 정책서 §4.4 | P2 |
| REQ-MEM-041 | Event-driven | A | WHEN 관리자가 포인트 수동 지급(금액+사유)을 실행하면, THE 회원시스템 SHALL 해당 회원에게 포인트를 지급하고 이력을 기록한다 | 정책서 §4.4 | P2 |
| REQ-MEM-042 | Event-driven | B | WHEN 포인트 소멸 배치가 실행되면, THE 회원시스템 SHALL 유효기간(3년) 경과 포인트를 선적립 선소멸(FIFO)로 소멸 처리한다 | 정책서 §4.4 | P2 |
| REQ-MEM-043 | Ubiquitous | C | THE 회원시스템 SHALL 포인트 최소 사용 금액을 Config 도메인 설정값으로 관리한다(기본값: 1,000원) | 정책서 §4.4, Order REQ-ORD-105 | P1 |

---

## 쿠폰 보유

| ID | 패턴 | 채널 | 요구사항 | 출처 | 우선순위 |
|---|---|---|---|---|---|
| REQ-MEM-050 | Event-driven | M | WHEN 고객이 쿠폰함을 조회하면, THE 회원시스템 SHALL 보유 쿠폰 목록(사용가능/사용완료/만료)을 반환한다 | 정책서 §9.3 | P2 |
| REQ-MEM-051 | Event-driven | C | WHEN Promotion 도메인으로부터 쿠폰 발급 이벤트를 수신하면, THE 회원시스템 SHALL 해당 회원의 쿠폰함에 쿠폰을 추가한다 | 정책서 §9.3 | P2 |

---

## 요약

| 영역 | ID 범위 | 수량 | P1 | P2 | P3 |
|---|---|---|---|---|---|
| PublicApi (Order 연동) | REQ-MEM-001~008 | 8 | 7 | 1 | 0 |
| 회원계정관리 | REQ-MEM-010~014 | 5 | 3 | 2 | 0 |
| 배송지 관리 | REQ-MEM-020~023 | 4 | 3 | 1 | 0 |
| 등급·혜택 | REQ-MEM-030~033 | 4 | 2 | 2 | 0 |
| 포인트 | REQ-MEM-040~043 | 4 | 1 | 3 | 0 |
| 쿠폰 보유 | REQ-MEM-050~051 | 2 | 0 | 2 | 0 |
| **합계** | | **27** | **16** | **11** | **0** |

---

## Human Review

| # | 항목 | 사유 | 우선순위 |
|---|---|---|---|
| 1 | 등급 기준 수치 | REQ-MEM-030 — 승급 기준(구매금액 N만원) 미확정 | 중 |
| 2 | 적립률 수치 | REQ-MEM-033 — 0.5~2.0% 임시값, 확정 시 변경 예정 | 중 |
| 3 | 포인트 최소 사용 금액 | REQ-MEM-043 — 1,000원 기본값, Config 연동 확정 필요 | 낮음 |

---

## 변경 이력

| 버전 | 일자 | 변경 내용 |
|---|---|---|
| DRAFT-v1 | 2026-07-30 | 초판 — 도메인기능표 48개 소분류 중 Order 연동 + 핵심 관리 기준 27개 EARS 도출 |
| REQ-MEM-003 | Unwanted | C | IF 포인트 사용 요청 금액이 보유 잔액을 초과하면, THEN THE 회원시스템 SHALL 사용을 거부하고 현재 잔액을 반환한다 | Order REQ-ORD-074 | P1 |
| REQ-MEM-004 | Event-driven | C | WHEN Order 도메인이 포인트 복원을 요청하면(memberId, amount, orderId, reason), THE 회원시스템 SHALL 해당 금액을 포인트에 복원(환급)한다 | Order REQ-ORD-006(취소), REQ-PAY-009 | P1 |
| REQ-MEM-005 | Event-driven | C | WHEN Order 도메인이 포인트 적립을 요청하면(memberId, orderAmount, orderId), THE 회원시스템 SHALL 해당 회원의 등급별 적립률을 적용하여 포인트를 적립한다 | Order REQ-ORD-017/054(구매확정) | P1 |
| REQ-MEM-006 | Event-driven | C | WHEN Order 도메인이 배송지 목록 조회를 요청하면(memberId), THE 회원시스템 SHALL 등록된 배송지 목록(기본 배송지 표시 포함)을 반환한다 | Order REQ-ORD-072 | P1 |
| REQ-MEM-007 | Event-driven | C | WHEN Order 도메인이 회원 등급 조회를 요청하면(memberId), THE 회원시스템 SHALL 현재 등급과 혜택 정보(적립률 등)를 반환한다 | Order 주문서 등급 표시 | P2 |
| REQ-MEM-008 | Ubiquitous | C | THE 회원시스템 SHALL 인증 토큰(Bearer {userId})에서 memberId를 추출하여 요청 주체를 식별한다 | Order 전 API 인증 전제 | P1 |

---

## 회원계정관리

| ID | 패턴 | 채널 | 요구사항 | 출처 | 우선순위 |
|---|---|---|---|---|---|
| REQ-MEM-010 | Event-driven | M | WHEN 고객이 회원가입 폼을 제출하면, THE 회원시스템 SHALL 계정을 생성하고 ACTIVE로 설정한다 | 정책서 §4.1 | P1 |
| REQ-MEM-011 | Event-driven | M | WHEN 고객이 로그인(ID/PW 또는 SNS)을 요청하면, THE 회원시스템 SHALL 인증 후 토큰을 발급한다 | 정책서 §4.1/§4.2 | P1 |
| REQ-MEM-012 | Unwanted | M | IF 로그인 5회 연속 실패하면, THEN THE 회원시스템 SHALL 30분간 잠금한다 | 정책서 §15.5 | P1 |
| REQ-MEM-013 | Event-driven | M | WHEN 고객이 회원탈퇴를 요청하면, THE 회원시스템 SHALL WITHDRAWN으로 전환한다 | 정책서 §4.1 | P2 |
| REQ-MEM-014 | Event-driven | A | WHEN 관리자가 회원 상태를 변경하면, THE 회원시스템 SHALL 상태 전환 + 이력 기록한다 | 정책서 §4 | P2 |

---

## 배송지 관리

| ID | 패턴 | 채널 | 요구사항 | 출처 | 우선순위 |
|---|---|---|---|---|---|
| REQ-MEM-020 | Event-driven | M | WHEN 고객이 배송지를 등록하면, THE 회원시스템 SHALL 저장한다 | 정책서 §4 | P1 |
| REQ-MEM-021 | Event-driven | M | WHEN 고객이 배송지를 수정하면, THE 회원시스템 SHALL 저장한다 | 정책서 §4 | P1 |
| REQ-MEM-022 | Event-driven | M | WHEN 고객이 배송지를 삭제하면, THE 회원시스템 SHALL 제거한다 | 정책서 §4 | P2 |
| REQ-MEM-023 | Ubiquitous | M | THE 회원시스템 SHALL 기본 배송지를 1개만 허용한다 | 정책서 §4 | P1 |

---

## 등급·혜택

| ID | 패턴 | 채널 | 요구사항 | 출처 | 우선순위 |
|---|---|---|---|---|---|
| REQ-MEM-030 | Event-driven | A | WHEN 관리자가 등급 기준을 설정하면, THE 회원시스템 SHALL 기준을 갱신한다 | 정책서 §4.3 | P1 |
| REQ-MEM-031 | Event-driven | B | WHEN 등급 배치(월 1회)가 실행되면, THE 회원시스템 SHALL 전 회원 등급을 재계산한다 | 정책서 §4.3 | P2 |
| REQ-MEM-032 | Ubiquitous | B | THE 회원시스템 SHALL 등급 하향 시 1개월 유예 후 강등한다 | 정책서 §4.3 | P2 |
| REQ-MEM-033 | Ubiquitous | C | THE 회원시스템 SHALL 등급별 적립률: New 0.5%, Runner 1.0%, Pacer 1.5%, Elite 2.0% (확정 시 변경 예정) | 정책서 §4.4 | P1 |

---

## 포인트

| ID | 패턴 | 채널 | 요구사항 | 출처 | 우선순위 |
|---|---|---|---|---|---|
| REQ-MEM-040 | Event-driven | M | WHEN 고객이 포인트 내역을 조회하면, THE 회원시스템 SHALL 잔액+이력을 반환한다 | 정책서 §4.4 | P2 |
| REQ-MEM-041 | Event-driven | A | WHEN 관리자가 포인트 수동 지급하면, THE 회원시스템 SHALL 지급+이력 기록한다 | 정책서 §4.4 | P2 |
| REQ-MEM-042 | Event-driven | B | WHEN 소멸 배치가 실행되면, THE 회원시스템 SHALL 3년 경과 포인트를 FIFO 소멸한다 | 정책서 §4.4 | P2 |
| REQ-MEM-043 | Ubiquitous | C | THE 회원시스템 SHALL 포인트 최소 사용 금액을 Config에서 관리한다(기본: 1,000원) | 정책서 §4.4 | P1 |

---

## 쿠폰 보유

| ID | 패턴 | 채널 | 요구사항 | 출처 | 우선순위 |
|---|---|---|---|---|---|
| REQ-MEM-050 | Event-driven | M | WHEN 고객이 쿠폰함을 조회하면, THE 회원시스템 SHALL 보유 쿠폰 목록을 반환한다 | 정책서 §9.3 | P2 |
| REQ-MEM-051 | Event-driven | C | WHEN Promotion으로부터 쿠폰 발급 이벤트를 수신하면, THE 회원시스템 SHALL 쿠폰함에 추가한다 | 정책서 §9.3 | P2 |

---

## 요약

| 영역 | 수량 | P1 | P2 |
|---|---|---|---|
| PublicApi (Order 연동) | 8 | 7 | 1 |
| 회원계정관리 | 5 | 3 | 2 |
| 배송지 관리 | 4 | 3 | 1 |
| 등급·혜택 | 4 | 2 | 2 |
| 포인트 | 4 | 1 | 3 |
| 쿠폰 보유 | 2 | 0 | 2 |
| **합계** | **27** | **16** | **11** |

---

## Human Review

| # | 항목 | 사유 | 우선순위 |
|---|---|---|---|
| 1 | 등급 기준 수치 | REQ-MEM-030 — 구매금액 N만원 미확정 | 중 |
| 2 | 적립률 수치 | REQ-MEM-033 — 임시값, 확정 시 변경 | 중 |
| 3 | 포인트 최소 사용 금액 | REQ-MEM-043 — 1,000원 기본값 | 낮음 |

---

## 변경 이력

| 버전 | 일자 | 변경 내용 |
|---|---|---|
| DRAFT-v1 | 2026-07-30 | 초판 — 27개 EARS 도출 |
