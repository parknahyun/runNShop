# NotificationTemplatePage — UI 정의

## Overview
| 항목 | 내용 |
|------|------|
| 목적 | 카카오톡·SMS·이메일로 발송되는 알림 문구(템플릿)를 조회·등록·수정·삭제한다 |
| 대상 | 운영자 (어드민) |
| 진입 경로 | 어드민 > 설정 > 알림 템플릿 |
| URL | /admin/settings/notification |
| 관련 컴포넌트 | FilterBar, SummaryBar, Toolbar, TemplateTable, Pagination, AddEditTemplateModal |

---

## Layout

```
┌──────────────────────────────────────────────────────────────┐
│ 알림 템플릿                              [스펙]  (page-title) │
├──────────────────────────────────────────────────────────────┤
│ [코드·명·이벤트유형] [전체 수신자▾] [전체 채널▾] [전체 상태▾] [조회] │
├───────────────────────────────────┬──────────────────────────┤
│ SummaryBar (결과 있을 때만)        │ [+ 알림 템플릿 등록]        │
│  전체 N건 | 활성 N건 | 비활성 N건(0이면 숨김)                  │
├──────────────────────────────────────────────────────────────┤
│ 템플릿코드 │ 템플릿명 │ 이벤트유형 │ 수신자유형 │ 채널 │ 거래알림여부 │ 상태 │
│   ...                                                        │
├──────────────────────────────────────────────────────────────┤
│ [10개▾]  ← 1 / N →                                           │
└──────────────────────────────────────────────────────────────┘

[알림 템플릿 등록/수정 모달]
┌───────────────────────────────────┐
│ 알림 템플릿 등록|수정        [✕]  │
│ 템플릿코드*(수정시 disabled) │ 템플릿명* │
│ 이벤트유형* (full width)          │
│ 수신자유형* │ 채널*                │
│ 제목 (full width)                  │
│ 내용* (textarea, full width)       │
│ 거래 알림(체크박스) │ 상태*         │
│ [삭제](수정시만)   [취소] [등록/저장] │
└───────────────────────────────────┘
```

---

## Components

| 컴포넌트 | 역할 |
|----------|------|
| FilterBar | 키워드(템플릿코드·템플릿명·이벤트유형) / 수신자유형 / 채널 / 상태 선택 및 조회 버튼 |
| SummaryBar | 조회 결과 기준 전체·활성·비활성 건수 카드. 비활성 0건이면 숨김. 결과 있을 때만 렌더링 |
| Toolbar | `+ 알림 템플릿 등록` 버튼만 포함. 로딩 중이 아닐 때 항상 렌더링 |
| TemplateTable | 템플릿 목록 테이블. 행 클릭 시 수정 모달(AddEditTemplateModal mode="edit") 오픈 |
| Pagination | 페이지 크기(10·14·30·50·100 등 공용 옵션) 선택 + 이전/다음 이동 |
| AddEditTemplateModal | 등록/수정 겸용 소형 모달(detail-modal--sm). 수정 모드에서만 [삭제] 버튼 노출 |
| TemplateStatusBadge / RequiredBadge | 상태(활성/비활성), 거래알림여부(필수/선택) 뱃지 |

---

## States

| 상태 | 처리 |
|------|------|
| 초기(미조회) | `displayed` 비어 있음. 테이블 영역에 "조회 버튼을 눌러 알림 템플릿 목록을 불러오세요." 메시지 |
| 로딩 중 | FilterBar 아래 "불러오는 중..." 메시지. 나머지 영역 숨김 |
| 조회 결과 없음 | SummaryBar 숨김. Toolbar 표시. 안내 메시지 표시 |
| 조회 결과 있음 | SummaryBar + Toolbar + TemplateTable + Pagination 표시 |
| 등록 모달 열림 | modal = { mode: 'add' }. 템플릿코드 입력 가능(초기값 빈 문자열) |
| 수정 모달 열림 | modal = { mode: 'edit', template }. 템플릿코드 필드 disabled. [삭제] 버튼 노출 |
| 유효성 오류 | 템플릿코드·템플릿명·이벤트유형·내용 미입력 시 각 필드 하단에 "필수" 오류. 등록/저장 차단 |

---

## Interactions

| 액션 | 반응 |
|------|------|
| 필터 입력 후 [조회] | loading = true → 300ms → filterNotificationTemplates 실행 → displayed 갱신, page = 1 |
| 템플릿 목록 행 클릭 | modal = { mode: 'edit', template } |
| [+ 알림 템플릿 등록] 클릭 | modal = { mode: 'add' } |
| 모달 [등록] 클릭 | 유효성 통과 시 allItems에 추가, templateId는 `nextTemplateId(allItems)`로 자동 채번 |
| 모달 [저장] 클릭 | 유효성 통과 시 해당 templateId 항목을 갱신. updatedAt 현재 시각으로 갱신 |
| 모달 [삭제] 클릭 (수정 모드만) | allItems에서 해당 항목 제거. 모달 닫힘 |
| 모달 [취소] / [✕] | 모달 닫힘, 변경 없음 |
| 페이지 크기/페이지 변경 | pageSize·page 갱신. 크기 변경 시 page = 1 |

---

## API

```typescript
// 현재 목업(mockData)으로 동작. 실제 연동 시 아래 엔드포인트를 사용한다.

GET    /api/admin/notification-templates
  Query: keyword, receiverType(CUSTOMER|VENDOR|OPERATOR|ALL), channel(KAKAO|SMS|EMAIL|ALL), status(ACTIVE|INACTIVE|ALL)
  Response: NotificationTemplate[]

POST   /api/admin/notification-templates
  Body: { templateCode, templateName, eventType, receiverType, channel, title, body, isRequired, status }
  Response: NotificationTemplate

PUT    /api/admin/notification-templates/{templateId}
  Body: { templateName, eventType, receiverType, channel, title, body, isRequired, status }
  Response: NotificationTemplate

DELETE /api/admin/notification-templates/{templateId}
  Response: 204

// 타입 정의 (ntf_template)
type ReceiverType = 'CUSTOMER' | 'VENDOR' | 'OPERATOR'
type NotificationChannel = 'KAKAO' | 'SMS' | 'EMAIL'
type TemplateStatus = 'ACTIVE' | 'INACTIVE'

interface NotificationTemplate {
  templateId: string; templateCode: string; templateName: string; eventType: string
  receiverType: ReceiverType; channel: NotificationChannel
  title: string | null; body: string; isRequired: boolean; status: TemplateStatus
  createdAt: string; updatedAt: string
}
```

---

## UX Rules

- 조회는 [조회] 버튼을 눌러야만 실행된다. 진입 시 자동 조회하지 않는다.
- Toolbar는 로딩 중이 아닌 모든 상태에서 항상 표시된다.
- SummaryBar는 `displayed.length > 0`인 경우에만 렌더링한다.
- 템플릿코드는 등록 후 변경할 수 없다(수정 모달에서 disabled).
- 거래 알림(`isRequired = true`)은 이용약관 동의와 무관하게 발송되는 필수 안내(주문·배송·클레임 등)이며, 목록에서는 "필수" 뱃지로, 마케팅성 알림은 "선택" 뱃지로 표시한다.
- 제목은 채널 특성상 선택 입력이다(카카오톡·SMS는 보통 제목 없음, 이메일은 제목을 주로 사용).
- [삭제]는 수정 모달에서만 노출되며, 클릭 즉시 목록에서 제거된다(확인 팝업 없음, mock 동작).
- `[스펙]` 버튼 클릭 시 SpecModal이 열리며 현재 spec.md 내용을 표시한다.
