'use client'
import { useState } from 'react'
import { InnerTabs } from '@/shell/shared/InnerTabs'
import { Pagination } from '@/shell/shared/Pagination'

export default function ComponentGuide() {
  const [page, setPage] = useState(3)
  const [pageSize, setPageSize] = useState(20)

  return (
    <div>
      <h2 className="section-title">컴포넌트 가이드</h2>
      <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>
        여러 화면에서 실제로 재사용하는 <strong>공유 컴포넌트</strong>만 다룬다. 라디오/select 같은 기본 폼 요소 규칙,
        배지 색상 팔레트, 핵심 CSS 클래스(<code>.summary-bar</code>/<code>.filter-bar</code>/<code>.table-wrap</code> 등)는
        <strong> 디자인 시스템</strong> 탭을 참고한다.
      </p>

      {/* InnerTabs */}
      <h3 className="section-title" style={{ fontSize: 14, marginBottom: 8 }}>InnerTabs — 2차 탭</h3>
      <p style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>
        <code>shell/shared/InnerTabs.tsx</code>. 상세화면·가이드 페이지처럼 화면 내부에 탭을 하나 더 둘 때 쓴다
        (최상단 MDI 탭바와는 별개의 2차 탭).
      </p>
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 16, marginBottom: 8, maxWidth: 420 }}>
        <InnerTabs tabs={[
          { key: 'basic', label: '기본정보', content: <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>탭 1 내용 영역</p> },
          { key: 'history', label: '이력', content: <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>탭 2 내용 영역</p> },
        ]} />
      </div>
      <ul style={{ fontSize: 12, color: '#64748b', lineHeight: 1.9, paddingLeft: 20, marginBottom: 20 }}>
        <li><code>{'tabs: { key: string, label: string, content }[]'}</code> — <code>key</code>는 문자열 필수, <code>label</code>도 string만 허용</li>
        <li><code>sticky</code> prop 없이 탭바가 항상 상단 고정(<code>inner-tabs__bar--sticky</code>)</li>
        <li>admin 앱은 API가 다르다: <code>key</code> 생략 시 자동 생성, <code>label</code>은 ReactNode 허용, <code>sticky?: boolean</code> prop으로 선택 가능</li>
      </ul>

      {/* Pagination */}
      <h3 className="section-title" style={{ fontSize: 14, marginBottom: 8 }}>Pagination — 목록 페이지네이션</h3>
      <p style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>
        <code>shell/shared/Pagination.tsx</code>. 현황목록 하단의 페이지 이동 + 페이지당 건수 선택.
      </p>
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 16, marginBottom: 8 }}>
        <Pagination page={page} totalPages={8} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={setPageSize} />
      </div>
      <ul style={{ fontSize: 12, color: '#64748b', lineHeight: 1.9, paddingLeft: 20, marginBottom: 20 }}>
        <li>페이지당 건수 옵션: <strong>10 / 20 / 50개</strong> 고정 (마크업에 직접 하드코딩)</li>
        <li><code>usePager</code> 훅이나 건수 선택 없는 <code>MiniPager</code>는 없다 — 필요하면 admin의 <code>shell/shared/Pagination.tsx</code>를 참고해 이식</li>
        <li>admin 앱은 더 많은 기능을 가진 버전: <code>PAGE_SIZE_OPTIONS</code>(7/14/30/50/100) + <code>usePager</code> 훅 + 중첩 리스트용 <code>MiniPager</code></li>
      </ul>

      {/* StatusBadge 컨벤션 */}
      <h3 className="section-title" style={{ fontSize: 14, marginBottom: 8 }}>StatusBadge — 공유 컴포넌트가 아닌 컨벤션</h3>
      <p style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>
        공용 <code>&lt;Badge&gt;</code> 컴포넌트는 없다. 대신 도메인마다 <code>XxxStatusBadge.tsx</code> 파일을 하나씩 만들어
        <code>{'<span className="badge" data-xxx-status={status}>'}</code>로 감싸는 패턴을 반복한다(파트너는 클레임 도메인에 2개 파일).
        색상은 배지 자체가 아니라 <code>globals.css</code>의 <code>[data-xxx-status=&quot;VALUE&quot;]</code> 선택자가 입힌다.
      </p>
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 16, marginBottom: 8 }}>
        <span className="badge" data-exchange-status="PICKUP_DONE">수거 완료</span>
      </div>
      <ul style={{ fontSize: 12, color: '#64748b', lineHeight: 1.9, paddingLeft: 20, marginBottom: 20 }}>
        <li>실제 예: <code>claim/exchange/ExchangeStatusBadge.tsx</code>, <code>claim/return/ReturnStatusBadge.tsx</code> (partner), <code>order/claim/ClaimStatusBadge.tsx</code> (admin)</li>
        <li>새 도메인 상태값을 추가할 때: 기존 <code>data-*-status</code> 속성 이름을 재사용하지 않고 새 파일 + 새 속성 이름으로 만든다</li>
        <li>배경/텍스트 색상 쌍은 디자인 시스템 탭의 &quot;상태 배지 색상 팔레트&quot; 6가지 중 의미에 맞는 것을 그대로 가져다 쓴다</li>
      </ul>

      {/* 컴포넌트화하지 않는 패턴 */}
      <h3 className="section-title" style={{ fontSize: 14, marginBottom: 8 }}>컴포넌트화하지 않는 패턴</h3>
      <p style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>
        아래는 여러 화면에서 반복되지만 의도적으로 공유 컴포넌트를 만들지 않았다. 화면마다 컬럼·필드·구성이 달라
        공통 컴포넌트로 묶어도 코드가 크게 줄지 않기 때문 — 목록에 없다고 컴포넌트가 빠진 게 아니라 원래 이렇게 쓴다는 뜻이다.
      </p>
      <div className="table-wrap" style={{ marginBottom: 20 }}>
        <table>
          <thead><tr><th>패턴</th><th>실제 구현</th></tr></thead>
          <tbody>
            <tr><td>SummaryBar / SummaryCard</td><td>공유 컴포넌트 없음. <code>.summary-bar</code>/<code>.summary-card</code> 클래스만 재사용, 카드 구성은 화면마다 직접 작성</td></tr>
            <tr><td>FilterBar</td><td>공유 컴포넌트 없음. <code>.filter-bar</code> 클래스만 재사용, 필터 항목은 화면마다 직접 작성</td></tr>
            <tr><td>Table</td><td>공유 컴포넌트 없음. <code>.table-wrap</code> + <code>&lt;table&gt;</code>만 재사용, 컬럼은 화면마다 직접 작성</td></tr>
            <tr><td>Timeline</td><td>클레임 도메인에 한해 <code>claim/shared/HistoryTimeline.tsx</code> 공유 컴포넌트가 있다. 그 외 화면에 필요하면 이 파일을 참고해 확장 — admin은 아직 공유 컴포넌트 없이 화면마다 <code>.timeline</code> 마크업을 직접 작성</td></tr>
            <tr><td>확인창 / 알림</td><td>공용 Modal 없음. <code>window.confirm</code>/<code>window.alert</code> 직접 호출</td></tr>
            <tr><td>로딩 / 빈 상태</td><td>별도 컴포넌트 없음</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
