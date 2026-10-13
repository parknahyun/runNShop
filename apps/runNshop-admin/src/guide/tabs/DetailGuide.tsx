'use client'

export default function DetailGuide() {
  return (
    <div>
      <h2 className="section-title">상세화면 (Detail) 구조</h2>
      <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>
        목록 화면에서 행 클릭 시 여는 상세. <strong>팝업(모달)</strong> 또는 <strong>MDI 탭</strong> 두 가지 호출방식을 지원하며,
        내부(InnerTabs·탭 컴포넌트)는 완전히 동일한 소스를 공유합니다 — 아래 &quot;호출방식&quot; 절 참조.
      </p>

      {/* 화면구성 (시각적 레이아웃) — 팝업 모드 / 탭 모드 */}
      <h3 className="section-title" style={{ fontSize: 14, marginBottom: 12 }}>화면구성</h3>
      <div style={{ display: 'flex', gap: 16, marginBottom: 20, alignItems: 'flex-start' }}>

        {/* 팝업 모드 */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>① 팝업 모드 (<code>mode=&apos;modal&apos;</code>)</div>
          <div id="layout-wrapper-modal" style={{ background: '#ffffff', padding: 16, borderRadius: 8, display: 'flex', justifyContent: 'center' }}>
            <div id="layout-inner-modal" style={{ width: '100%', background: 'rgba(15,23,42,0.15)', borderRadius: 8, padding: 16, display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
              <div style={{ width: '100%', background: '#fff', borderRadius: 12, overflow: 'visible', boxShadow: '0 24px 48px rgba(0,0,0,0.18)' }}>
                {/* 헤더 영역 */}
                <div id="area-header" style={{ border: '1px dashed #94a3b8', borderRadius: 0, margin: 0 }}>
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>섹션 상세 - 히어로 배너</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 10, color: '#64748b' }}>HERO_BANNER</span>
                        <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 99, background: '#dcfce7', color: '#15803d', fontWeight: 600 }}>활성</span>
                        <span style={{ fontSize: 10, color: '#64748b' }}>필드 4개</span>
                      </div>
                    </div>
                    <span style={{ fontSize: 15, color: '#94a3b8', cursor: 'pointer' }}>✕</span>
                  </div>
                </div>
                {/* 탭 바 */}
                <div id="area-tabbar" style={{ border: '1px dashed #94a3b8', borderRadius: 0, margin: 0 }}>
                  <div style={{ display: 'flex', gap: 4, borderBottom: '2px solid #e2e8f0', padding: '0 16px' }}>
                    <span style={{ padding: '8px 12px', fontSize: 11, fontWeight: 700, color: '#1e293b', borderBottom: '2px solid #3b82f6', marginBottom: -2 }}>기본 정보</span>
                    <span style={{ padding: '8px 12px', fontSize: 11, color: '#64748b' }}>필드 관리</span>
                  </div>
                </div>
                {/* 탭 콘텐츠 */}
                <div id="area-tab-content" style={{ border: '1px dashed #94a3b8', borderRadius: 0, margin: 0 }}>
                  <div style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>기본 정보</span>
                      <span style={{ fontSize: 10, padding: '3px 8px', border: '1px solid #cbd5e1', borderRadius: 6, color: '#475569' }}>편집</span>
                    </div>
                    {[
                      { dt: '타입 ID', dd: 'HERO_BANNER' },
                      { dt: '상태', dd: '활성' },
                    ].map((row) => (
                      <div key={row.dt} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9', fontSize: 11 }}>
                        <span style={{ color: '#64748b' }}>{row.dt}</span>
                        <span style={{ color: '#1e293b', fontWeight: 600 }}>{row.dd}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* 액션 Footer */}
                <div id="area-footer" style={{ border: '1px dashed #94a3b8', borderRadius: 0, margin: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, padding: '10px 16px', borderTop: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: 10, padding: '5px 12px', border: '1px solid #cbd5e1', borderRadius: 6, color: '#475569' }}>취소</span>
                    <span style={{ fontSize: 10, color: '#fff', padding: '5px 12px', borderRadius: 6, background: '#1e293b', fontWeight: 600 }}>저장</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 8, lineHeight: 1.6 }}>
            화면 위에 오버레이로 뜨는 카드. 자체 닫기(✕) 버튼을 갖는다. 헤더·탭바·탭콘텐츠가 카드 안에 그림자와 함께 떠 있고,
            편집 중인 탭은 하단에 취소/저장 Footer가 붙는다.
          </p>
        </div>

        {/* 탭 모드 */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>② 탭 모드 (<code>mode=&apos;tab&apos;</code>)</div>
          <div style={{ background: '#ffffff', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0' }}>
            {/* MDI 탭바 (컨텍스트 표시용) */}
            <div style={{ height: 28, background: '#f1f5f9', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'flex-end', padding: '0 6px', gap: 2, marginBottom: 12, borderRadius: '4px 4px 0 0' }}>
              <span style={{ fontSize: 10, background: '#fff', border: '1px solid #e2e8f0', borderBottom: 'none', borderRadius: '4px 4px 0 0', padding: '4px 8px', color: '#64748b' }}>📌 대시보드</span>
              <span style={{ fontSize: 10, background: '#fff', border: '1px solid #e2e8f0', borderBottom: 'none', borderRadius: '4px 4px 0 0', padding: '4px 8px', fontWeight: 700, color: '#1e293b' }}>섹션 상세 ×</span>
            </div>
            {/* 헤더 영역 (page-title-row, 닫기 버튼 없음) */}
            <div id="area-header-tab" style={{ border: '1px dashed #94a3b8', borderRadius: 0, margin: 0, marginBottom: 4 }}>
              <div style={{ padding: '4px 4px 14px' }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#1e293b' }}>섹션 상세 - 히어로 배너</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 10, color: '#64748b' }}>HERO_BANNER</span>
                  <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 99, background: '#dcfce7', color: '#15803d', fontWeight: 600 }}>활성</span>
                  <span style={{ fontSize: 10, color: '#64748b' }}>필드 4개</span>
                </div>
              </div>
            </div>
            {/* 탭 바 */}
            <div id="area-tabbar-tab" style={{ border: '1px dashed #94a3b8', borderRadius: 0, margin: 0 }}>
              <div style={{ display: 'flex', gap: 4, borderBottom: '2px solid #e2e8f0', padding: '0 4px' }}>
                <span style={{ padding: '8px 12px', fontSize: 11, fontWeight: 700, color: '#1e293b', borderBottom: '2px solid #3b82f6', marginBottom: -2 }}>기본 정보</span>
                <span style={{ padding: '8px 12px', fontSize: 11, color: '#64748b' }}>필드 관리</span>
              </div>
            </div>
            {/* 탭 콘텐츠 */}
            <div id="area-tab-content-tab" style={{ border: '1px dashed #94a3b8', borderRadius: 0, margin: 0 }}>
              <div style={{ padding: '16px 4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>기본 정보</span>
                  <span style={{ fontSize: 10, padding: '3px 8px', border: '1px solid #cbd5e1', borderRadius: 6, color: '#475569' }}>편집</span>
                </div>
                {[
                  { dt: '타입 ID', dd: 'HERO_BANNER' },
                  { dt: '상태', dd: '활성' },
                ].map((row) => (
                  <div key={row.dt} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9', fontSize: 11 }}>
                    <span style={{ color: '#64748b' }}>{row.dt}</span>
                    <span style={{ color: '#1e293b', fontWeight: 600 }}>{row.dd}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* 액션 Footer */}
            <div id="area-footer-tab" style={{ border: '1px dashed #94a3b8', borderRadius: 0, margin: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, padding: '10px 4px', borderTop: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: 10, padding: '5px 12px', border: '1px solid #cbd5e1', borderRadius: 6, color: '#475569' }}>취소</span>
                <span style={{ fontSize: 10, color: '#fff', padding: '5px 12px', borderRadius: 6, background: '#1e293b', fontWeight: 600 }}>저장</span>
              </div>
            </div>
          </div>
          <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 8, lineHeight: 1.6 }}>
            오버레이 없이 MDI 탭 콘텐츠 영역에 페이지처럼 그려진다. 카드·그림자·✕ 버튼이 없고, 닫기는 상단 탭바의 × 버튼이 담당한다.
            헤더·탭바·탭콘텐츠·Footer 구성은 팝업 모드와 완전히 동일한 소스(<code>DetailShell</code> children)를 그대로 재사용한다.
          </p>
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
              <th>크기</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>1</td><td>헤더 영역</td><td>타이틀({'{화면명} ? - {데이터명}'}) + 부가정보(코드, 배지, 칩) + 닫기(✕, 팝업 모드에서만)</td><td>약 76px (2줄: 타이틀+배지 행)</td></tr>
            <tr><td>2</td><td>탭 바 영역</td><td>InnerTabs 버튼 (기본정보 ? / 필드관리 ?). 활성 탭: 파란 하단선</td><td>약 40px (1줄)</td></tr>
            <tr><td>3</td><td>탭 콘텐츠 영역</td><td>활성 탭의 내용. 읽기(info-grid) ↔ 편집(add-form) 전환. 좌우 여백은 <code>tab-panel-content</code> 클래스로 확보 (아래 규칙 참조)</td><td>가변 (탭 내용에 따라)</td></tr>
            <tr><td>4</td><td>액션 영역</td><td>편집 중인 탭 하단에 취소/저장 버튼(<code>section-editor-footer</code>). 승인/반려 같은 상태 전이 액션도 같은 자리에 붙는다</td><td>약 58px (1줄)</td></tr>
          </tbody>
        </table>
      </div>

      {/* 호출방식 옵션: 팝업 ↔ 탭 */}
      <h3 className="section-title" style={{ fontSize: 14, marginBottom: 12 }}>호출방식 옵션: 팝업 ↔ 탭 (DetailShell)</h3>
      <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.7, marginBottom: 10 }}>
        상세 화면은 <code>src/shell/shared/DetailShell.tsx</code>를 통해 렌더링한다. 내부 콘텐츠(보통 InnerTabs)는
        완전히 동일하게 두고, <code>mode: &apos;modal&apos; | &apos;tab&apos;</code> prop 하나로 팝업(오버레이 + 자체 닫기 버튼)과
        MDI 탭(page-title-row, 닫기는 탭바가 담당) 사이를 전환한다. 목록 화면은 <code>useDetailOpener</code> 훅으로
        호출방식에 맞춰 여는 방법(로컬 state vs <code>openTab()</code>)까지 함께 처리한다.
      </p>
      <div className="table-wrap" style={{ marginBottom: 12 }}>
        <table>
          <thead>
            <tr>
              <th>파일</th>
              <th>역할</th>
            </tr>
          </thead>
          <tbody>
            <tr><td><code>DetailShell.tsx</code></td><td>상세 컴포넌트 내부에서 사용. <code>mode</code>에 따라 팝업/탭 껍데기(header, 닫기 버튼 유무, 크기)만 바꿔 렌더링. <code>children</code>은 그대로 통과</td></tr>
            <tr><td><code>useDetailOpener.ts</code></td><td>목록 화면에서 사용. <code>mode</code>가 <code>tab</code>이면 <code>openTab()</code>으로 등록, <code>modal</code>이면 로컬 state로 표시. <code>open(item)</code>과 렌더링할 <code>modalElement</code>를 반환</td></tr>
          </tbody>
        </table>
      </div>
      <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.7, marginBottom: 10 }}>
        사용법 (예: 수량별 할인):
      </p>
      <ul style={{ fontSize: 13, color: '#374151', lineHeight: 2, paddingLeft: 20, marginBottom: 16 }}>
        <li>상세 컴포넌트: <code>mode?: DetailMode</code>·<code>onClose?</code> prop을 받아 최상위를 <code>&lt;DetailShell mode={'{mode}'} title={'{...}'} meta={'{...}'} onClose={'{onClose}'}&gt;{'{'}InnerTabs 등{'}'}&lt;/DetailShell&gt;</code>으로 감싼다</li>
        <li>목록 화면: 파일 상단에 <code>const DETAIL_MODE: DetailMode = &apos;modal&apos;</code> (또는 <code>&apos;tab&apos;</code>) 상수를 두고, <code>useDetailOpener({'{ mode: DETAIL_MODE, getTabId, getTabLabel, renderDetail }'})</code>로 <code>open</code>/<code>modalElement</code>를 얻어 행 클릭에는 <code>open</code>을, 목록 하단에는 <code>{'{modalElement}'}</code>를 배치한다</li>
        <li>호출방식을 바꿀 땐 이 <code>DETAIL_MODE</code> 한 줄만 수정하면 된다 — 상세 컴포넌트·탭 구성은 그대로 재사용</li>
        <li>
          <strong>실제 사용 예</strong>: <code>promotion/exhibition/ExhibitionPage.tsx</code>는 <code>DETAIL_MODE = &apos;tab&apos;</code>을 쓴다
          (기획전 설정은 다른 화면을 오가며 오래 붙잡고 작업하는 경우가 많아 MDI 탭으로 열어둔 채 전환하는 편이 낫다).
          그 외 대부분의 화면(쿠폰, 수량별 할인, 클레임 등)은 <code>DETAIL_MODE = &apos;modal&apos;</code>을 기본값으로 쓴다
          (빠르게 확인·수정하고 닫는 조회 위주 흐름에 적합). 새 화면을 만들 때는 &quot;이 상세를 열어둔 채 다른 작업을 병행할 필요가 있는가&quot;를
          기준으로 둘 중 하나를 고르면 된다
        </li>
      </ul>

      {/* 권한모드 */}
      <h3 className="section-title" style={{ fontSize: 14, marginBottom: 12 }}>권한모드 옵션: 조회 / 수정 (readOnly)</h3>
      <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.7, marginBottom: 10 }}>
        모든 상세 컴포넌트는 <code>readOnly?: boolean</code> prop을 지원한다 (기본값 <code>false</code> = 수정모드).
        상세 컴포넌트는 이 값을 받아 <strong>모든 하위 탭 컴포넌트에 그대로 전달</strong>하며,
        각 탭은 자신이 가진 <code>readOnly</code> prop으로 기능버튼(편집/추가/삭제/저장/승인·반려 등)의
        <code>disabled</code> 속성을 제어한다.
      </p>
      <ul style={{ fontSize: 13, color: '#374151', lineHeight: 2, paddingLeft: 20, marginBottom: 12 }}>
        <li>
          <strong>숨기지 않고 비활성화한다</strong> — 조회모드에서도 버튼·관리 컬럼은 항상 렌더링되고,
          <code>disabled={'{readOnly}'}</code>만 추가한다. 버튼을 조건부로 렌더링해 사라지게 만들지 않는다
          (레이아웃이 모드에 따라 흔들리지 않게 하기 위함이며, 기능이 존재하지만 지금은 쓸 수 없다는 것을 사용자에게 보여준다)
        </li>
        <li>
          읽기/편집 토글형 탭(<code>BasicInfoTab</code> 계열)은 우상단 &quot;편집&quot; 버튼 자체에
          <code>disabled={'{readOnly}'}</code>를 건다 — 토글이 막히므로 편집 폼 진입 자체가 불가능해지고,
          편집 폼 내부의 저장/취소 버튼까지 따로 막을 필요는 없다
        </li>
        <li>
          하위 목록형 탭(상품/구간/옵션 등)은 &quot;+ 추가&quot; 버튼과 행별 &quot;편집&quot;·&quot;삭제&quot; 버튼 모두에
          <code>disabled={'{readOnly}'}</code>를 건다. 순서이동(↑/↓)·표시전환(👁) 같은 비파괴적 토글도 동일하게 비활성화한다
        </li>
        <li>
          체크박스·셀렉트·인풋으로 즉시 값을 바꾸는 인라인 컨트롤(예: 카테고리 다중선택 체크박스, SKU 상태 셀렉트)도
          <code>disabled={'{readOnly}'}</code>를 적용한다
        </li>
        <li>
          용도: 같은 상세 컴포넌트를 다른 화면에서 <strong>조회 전용으로 재사용</strong>할 때 쓴다
          (예: 상품심사 화면은 상품상세와 동일한 <code>ProductDetail</code>을 <code>readOnly</code>로 열고,
          별도의 <code>footer</code> prop으로 승인/반려 액션 영역만 추가한다). 기존 화면의 기본 호출(행 클릭)은
          계속 <code>readOnly</code> 없이(=수정모드) 여는 것이 기본값이다
        </li>
        <li>
          <strong>실제 사용 예</strong>: <code>product/product-review/ProductReviewDetail.tsx</code>가
          <code>product/product-list/ProductDetail.tsx</code>를 <code>readOnly</code>로 감싸는 유일한 실사용 사례다.
          나머지 상세 컴포넌트는 모두 <code>readOnly?: boolean</code> prop을 지원하도록 만들어두되(하위 탭까지 전달),
          실제로 <code>true</code>를 넘겨 호출하는 곳이 아직 없어도 된다 — &quot;나중에 조회 전용으로 재사용될 수 있다&quot;는
          전제로 미리 배선해두는 것 자체가 이 규칙의 목적이다
        </li>
      </ul>

      {/* 규칙 */}
      <h3 className="section-title" style={{ fontSize: 14 }}>규칙</h3>
      <ul style={{ fontSize: 13, color: '#374151', lineHeight: 2, paddingLeft: 20 }}>
        <li>모든 상세·등록·수정 화면은 <code>DetailShell</code> 기반으로 구현 (팝업/탭 겸용)</li>
        <li>등록 모달은 항상 팝업(모달)로 고정 — <code>DetailShell</code>을 쓰지 않고 기존 <code>.detail-modal</code> 마크업 그대로 사용</li>
        <li>모달 내부는 기본 <strong>InnerTabs (탭 방식)</strong></li>
        <li>명시적으로 단계별(step) UI를 요청한 경우에만 stepper 사용</li>
        <li>등록 모달: 상세 편집 모드와 동일 구조 + 하단 Footer(취소/저장)</li>
        <li>서브 모달(검색/추가 팝업): overlay 클릭 닫기 차단 (데이터 유실 방지)</li>
        <li>overlay 클릭 시 상세/등록 모달은 닫기 허용</li>
        <li>
          <strong>좌우 여백 필수</strong>: <code>DetailShell</code>은 패딩을 추가하지 않는다 — 콘텐츠 쪽이 스스로 책임진다.
          InnerTabs를 쓰는 상세는 각 탭 컴포넌트가 자신의 최상위 요소에 <code>tab-panel-content</code> 클래스를 직접 붙인다.
          InnerTabs 없이 단일 폼인 상세는 그 폼 전체를 감싸는 최상위 요소에 <code>tab-panel-content</code>를 붙인다
          (<code>DetailShell</code>을 쓰지 않는 검색/추가 서브 모달은 예외적으로 <code>.detail-modal__body</code>에
          <code>tab-panel-content</code>를 직접 결합한다 — 예: <code>className=&quot;detail-modal__body tab-panel-content&quot;</code>).
          내부에 <code>.add-form</code>을 다시 쓸 때는 이중 padding을 피하기 위해 그 안쪽 padding은 0으로 지정한다.
        </li>
        <li>
          <strong>탭 콘텐츠 내부 표(하위 목록) 행의 편집·삭제 버튼은 아이콘이 아니라 글자로 표기</strong>한다 —
          <code>btn-tool btn-tool--edit</code> 클래스에 &quot;편집&quot; 텍스트, <code>btn-tool btn-tool--delete</code> 클래스에
          &quot;삭제&quot; 텍스트를 쓴다 (표 행에 맞춰 높이 24px·작은 폰트로 축소해서 사용). <code>×</code> 아이콘 버튼
          (<code>section-item__btn--danger</code>)은 사용하지 않는다. 단, 순서이동(↑/↓)·표시전환(👁) 같은 비파괴적
          토글은 아이콘을 유지해도 된다 — 되돌릴 수 없는 삭제·편집 행위만 글자 버튼으로 명확히 표기한다.
          예외적으로 폭이 매우 좁은 리스트(예: 페이지 관리의 섹션 목록 사이드 패널)는 공간 제약상 아이콘 버튼을 유지한다.
        </li>
      </ul>
    </div>
  )
}
