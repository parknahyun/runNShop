'use client'

export default function ListGuide() {
  return (
    <div>
      <h2 className="section-title">현황목록 (Table) 구조</h2>
      <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>검색·필터·요약·테이블·페이지네이션으로 구성된 현황 화면. MDI 탭으로 열립니다.</p>

      {/* 화면구성 (시각적 레이아웃) */}
      <h3 className="section-title" style={{ fontSize: 14, marginBottom: 12 }}>화면구성</h3>
      <div id="layout-wrapper" style={{ width: 1000, background: '#ffffff', padding: 20, borderRadius: 8, marginBottom: 20, display: 'flex', gap: 16 }}>
        <div id="layout-inner" style={{ width: 900, border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'visible' }}>
          {/* TitleBar */}
          <div id="area-title" style={{ padding: '16px 20px 8px', background: '#fff', border: '1px dashed #94a3b8' }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#1e293b' }}>섹션 관리</span>
          </div>
          {/* FilterBar */}
          <div id="area-filter" style={{ padding: '8px 20px', background: '#fff', border: '1px dashed #94a3b8' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: 8, padding: '6px 10px' }}>
              <span style={{ fontSize: 11, color: '#94a3b8', padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: 6, background: '#fff' }}>타입ID / 라벨명</span>
              <span style={{ fontSize: 11, color: '#94a3b8', padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: 6, background: '#fff' }}>전체 상태 ▾</span>
              <span style={{ fontSize: 11, color: '#fff', padding: '6px 14px', borderRadius: 6, background: '#3b82f6', fontWeight: 600 }}>조회</span>
            </div>
          </div>
          {/* SummaryBar + Toolbar */}
          <div id="area-summary" style={{ padding: '12px 20px', border: '1px dashed #94a3b8' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ fontSize: 11, padding: '4px 10px', border: '1px solid #e2e8f0', borderRadius: 6, background: '#fff' }}>전체 <b>9개</b></span>
                <span style={{ fontSize: 11, padding: '4px 10px', border: '1px solid #60a5fa', borderRadius: 6, background: '#eff6ff', color: '#1d4ed8', fontWeight: 600 }}>활성 <b>8개</b></span>
                <span style={{ fontSize: 11, padding: '4px 10px', border: '1px solid #e2e8f0', borderRadius: 6, background: '#f8fafc', color: '#94a3b8' }}>비활성 <b>1개</b></span>
              </div>
              <span style={{ fontSize: 11, color: '#fff', padding: '6px 12px', borderRadius: 6, background: '#1e293b', fontWeight: 600 }}>+ 섹션 추가</span>
            </div>
          </div>
          {/* Table */}
          <div id="area-table" style={{ border: '1px dashed #94a3b8', padding: '8px 20px 16px' }}>
            <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    {['순서', '타입 ID', '라벨', '설명', '필드수', '상태', '최종수정'].map((col) => (
                      <th key={col} style={{ padding: '8px 10px', textAlign: 'left', color: '#64748b', fontWeight: 600 }}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { order: 1, id: 'HERO_BANNER', label: '히어로 배너', desc: '전체폭 대형 이미지/영상 배너.', active: true, fields: 4 },
                    { order: 2, id: 'BANNER_SLIDE', label: '슬라이드 배너', desc: '좌우 스와이프 멀티 이미지.', active: true, fields: 1 },
                    { order: 3, id: 'PRODUCT_GRID', label: '상품 그리드', desc: '2열 또는 3열 격자 상품 목록.', active: true, fields: 3 },
                  ].map((row) => (
                    <tr key={row.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px', color: '#374151' }}>{row.order}</td>
                      <td style={{ padding: '10px', color: '#3b82f6', fontWeight: 500 }}>{row.id}</td>
                      <td style={{ padding: '10px', fontWeight: 500, color: '#1e293b' }}>{row.label}</td>
                      <td style={{ padding: '10px', color: '#64748b', fontSize: 10 }}>{row.desc}</td>
                      <td style={{ padding: '10px', fontWeight: 600 }}>{row.fields}개</td>
                      <td style={{ padding: '10px' }}><span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 99, background: row.active ? '#dcfce7' : '#f1f5f9', color: row.active ? '#15803d' : '#64748b', fontWeight: 600 }}>{row.active ? '활성' : '비활성'}</span></td>
                      <td style={{ padding: '10px', color: '#94a3b8', fontSize: 10 }}>admin / 2026-01-01</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Pagination */}
          <div id="area-pagination" style={{ padding: '8px 20px 16px', border: '1px dashed #94a3b8' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
              <span style={{ width: 24, height: 24, border: '1px solid #e2e8f0', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#94a3b8' }}>‹</span>
              <span style={{ width: 24, height: 24, background: '#1e293b', color: '#fff', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>1</span>
              <span style={{ width: 24, height: 24, border: '1px solid #e2e8f0', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#64748b' }}>2</span>
              <span style={{ width: 24, height: 24, border: '1px solid #e2e8f0', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#94a3b8' }}>›</span>
            </div>
          </div>
        </div>
        {/* 영역명 */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', fontSize: 11, color: '#64748b', gap: 0, minWidth: 90 }}>
          <div style={{ height: 40, display: 'flex', alignItems: 'center' }}>← 타이틀 영역</div>
          <div style={{ height: 52, display: 'flex', alignItems: 'center' }}>← 필터 영역</div>
          <div style={{ height: 44, display: 'flex', alignItems: 'center' }}>← 요약 영역</div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>← 테이블 영역</div>
          <div style={{ height: 40, display: 'flex', alignItems: 'center' }}>← 페이지네이션 영역</div>
        </div>
      </div>

      {/* 영역 정의 */}
      <h3 className="section-title" style={{ fontSize: 14, marginBottom: 12 }}>영역 정의</h3>
      <div className="table-wrap" style={{ marginBottom: 20 }}>
        <table>
          <thead>
            <tr>
              <th>순서</th>
              <th>영역</th>
              <th>설명</th>
              <th>노출 조건</th>
              <th>크기</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>1</td><td>타이틀 영역</td><td>메뉴(화면)명만 표시</td><td>항상</td><td>약 30px (1줄)</td></tr>
            <tr><td>2</td><td>필터 영역</td><td>키워드 검색 + 상태 드롭다운 + 조회 버튼</td><td>항상</td><td>약 64px (1줄)</td></tr>
            <tr><td>3</td><td>요약 영역</td><td>전체 / 활성 / 비활성 카운트 + 등록 버튼</td><td>조회 후</td><td>약 84px (2줄: 라벨+카운트)</td></tr>
            <tr><td>4</td><td>테이블 영역</td><td>순서·타입ID·라벨·설명·필드수·상태·최종수정</td><td>조회 후</td><td>가변 (행 수에 따라, 행당 약 40px)</td></tr>
            <tr><td></td><td></td><td style={{ paddingLeft: 16 }}>• 행 클릭 → 상세 모달 오픈</td><td></td><td></td></tr>
            <tr><td>5</td><td>페이지네이션 영역</td><td>공통 컴포넌트 (페이지 + 사이즈 변경)</td><td>조회 후</td><td>약 32px (1줄)</td></tr>
          </tbody>
        </table>
      </div>

      {/* 규칙 */}
      <h3 className="section-title" style={{ fontSize: 14 }}>규칙</h3>
      <ul style={{ fontSize: 13, color: '#374151', lineHeight: 2, paddingLeft: 20 }}>
        <li>진입 시 타이틀 영역 + 필터 영역만 표시. 데이터 미노출</li>
        <li>조회 버튼 클릭 후 요약 영역 + 테이블 영역 + 페이지네이션 영역 동시 노출</li>
        <li>Enter 키로도 조회 가능</li>
        <li>행 클릭 → 상세 모달 오픈 (탭으로 열지 않음)</li>
        <li>등록 버튼 → 등록 모달 오픈</li>
        <li>페이지 사이즈 변경 시 1페이지로 리셋</li>
      </ul>
    </div>
  )
}
