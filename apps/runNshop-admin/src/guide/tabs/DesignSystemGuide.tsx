'use client'
import { useState } from 'react'

function Swatch({ bg, fg, label, hexBg, hexFg }: { bg: string; fg?: string; label: string; hexBg: string; hexFg?: string }) {
  return (
    <div style={{ width: 128 }}>
      <div style={{ height: 48, borderRadius: 8, background: bg, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {fg && <span style={{ color: fg, fontSize: 11, fontWeight: 700 }}>Aa</span>}
      </div>
      <div style={{ fontSize: 11, color: '#374151', fontWeight: 600, marginTop: 6 }}>{label}</div>
      <div style={{ fontSize: 10, color: '#94a3b8' }}>{hexBg}{hexFg ? ` / ${hexFg}` : ''}</div>
    </div>
  )
}

export default function DesignSystemGuide() {
  const [radioValue, setRadioValue] = useState('ACTIVE')

  return (
    <div>
      <h2 className="section-title">디자인 시스템</h2>
      <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>
        <code>src/app/globals.css</code> 하나에 정의된 순수 CSS 클래스 기반 디자인 시스템(Tailwind 등 프레임워크 없음, BEM 스타일 네이밍).
        여기 정리된 값은 실제 CSS에서 추출한 것이며, 새 화면을 만들 때 임의의 색상·크기를 새로 만들지 않고 아래 값을 재사용한다.
      </p>

      {/* 브랜드 컬러 */}
      <h3 className="section-title" style={{ fontSize: 14, marginBottom: 12 }}>브랜드 컬러</h3>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
        <Swatch bg="#1e293b" fg="#f1f5f9" label="Navy (기본 브랜드)" hexBg="#1e293b" />
        <Swatch bg="#334155" fg="#f1f5f9" label="Navy hover" hexBg="#334155" />
        <Swatch bg="#0f172a" fg="#fff" label="Navy 진한 톤 (제목)" hexBg="#0f172a" />
        <Swatch bg="#3b82f6" fg="#fff" label="Primary Blue (액션)" hexBg="#3b82f6" />
      </div>
      <p style={{ fontSize: 11, color: '#94a3b8', marginBottom: 20 }}>
        Navy는 헤더·주요 버튼(<code>btn-tool--add</code>)·강조 텍스트에, Blue는 링크·검색 버튼·포커스 링·활성 탭 밑줄처럼
        &quot;지금 활성화된 것&quot;을 가리킬 때 쓴다. 파트너 앱은 이 자리에 다크오렌지(#7c2d12)/오렌지(#ea580c)를 쓴다 — 앱마다
        브랜드 컬러 두 개만 교체하고 나머지 팔레트는 공유한다.
      </p>

      <h3 className="section-title" style={{ fontSize: 14, marginBottom: 12 }}>뉴트럴(무채색) 스케일</h3>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
        <Swatch bg="#f5f6fa" label="앱 배경 (body)" hexBg="#f5f6fa" />
        <Swatch bg="#f8fafc" label="테이블 헤더·서브패널" hexBg="#f8fafc" />
        <Swatch bg="#f1f5f9" label="연한 배경·비활성 배지 (최다 사용)" hexBg="#f1f5f9" />
        <Swatch bg="#fff" fg="#e2e8f0" label="카드/모달 배경 + 기본 테두리" hexBg="#fff / #e2e8f0" />
      </div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
        <Swatch bg="#fff" fg="#94a3b8" label="희미한 텍스트 (placeholder·meta)" hexBg="#94a3b8" />
        <Swatch bg="#fff" fg="#64748b" label="보조 텍스트 (label·dt)" hexBg="#64748b" />
        <Swatch bg="#fff" fg="#475569" label="hover 텍스트" hexBg="#475569" />
        <Swatch bg="#fff" fg="#cbd5e1" label="input/select 테두리" hexBg="#cbd5e1" />
      </div>

      {/* 상태 배지 컬러 */}
      <h3 className="section-title" style={{ fontSize: 14, marginBottom: 8 }}>상태 배지 색상 팔레트</h3>
      <p style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>
        도메인마다 <code>data-xxx-status</code> 속성으로 개별 배지 블록을 <code>globals.css</code>에 추가하지만(50개 이상),
        실제로 쓰는 배경/텍스트 색상 쌍은 아래 6가지 의미 카테고리로 수렴한다. 새 상태값을 추가할 때 이 표에서 의미에 맞는 쌍을 그대로 가져다 쓴다.
      </p>
      <div className="table-wrap" style={{ marginBottom: 20 }}>
        <table>
          <thead>
            <tr>
              <th>의미</th>
              <th>예시</th>
              <th>배경</th>
              <th>텍스트</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>성공 / 활성 / 승인 / 완료</td>
              <td><span className="badge" style={{ background: '#dcfce7', color: '#15803d' }}>완료</span></td>
              <td><code>#dcfce7</code></td><td><code>#15803d</code></td>
            </tr>
            <tr>
              <td>위험 / 반려 / 실패 / 폐기</td>
              <td><span className="badge" style={{ background: '#fee2e2', color: '#dc2626' }}>반려</span></td>
              <td><code>#fee2e2</code></td><td><code>#dc2626</code></td>
            </tr>
            <tr>
              <td>경고 / 대기 / 처리중 / 정지</td>
              <td><span className="badge" style={{ background: '#fef9c3', color: '#a16207' }}>처리중</span></td>
              <td><code>#fef9c3</code></td><td><code>#a16207</code></td>
            </tr>
            <tr>
              <td>정보 / 신규 / 접수 / 예정</td>
              <td><span className="badge" style={{ background: '#dbeafe', color: '#1d4ed8' }}>접수</span></td>
              <td><code>#dbeafe</code></td><td><code>#1d4ed8</code></td>
            </tr>
            <tr>
              <td>중립 / 비활성 / 종료 / 임시</td>
              <td><span className="badge" style={{ background: '#f1f5f9', color: '#94a3b8' }}>종료</span></td>
              <td><code>#f1f5f9</code></td><td><code>#94a3b8</code> (또는 <code>#475569</code>)</td>
            </tr>
            <tr>
              <td>특수 등급 / 프리미엄 강조</td>
              <td><span className="badge" style={{ background: '#ede9fe', color: '#7c3aed' }}>Elite</span></td>
              <td><code>#ede9fe</code></td><td><code>#7c3aed</code></td>
            </tr>
          </tbody>
        </table>
      </div>
      <p style={{ fontSize: 11, color: '#94a3b8', marginBottom: 20 }}>
        기본 <code>.badge</code> 클래스는 모양만 정의한다(<code>padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 600;</code>).
        색상은 항상 <code>data-xxx-status=&quot;VALUE&quot;</code> 속성 선택자로 도메인별 CSS 블록을 새로 추가해서 입힌다 — 기존 도메인의 속성 이름을 재사용하지 않는다.
      </p>

      {/* 타이포그래피 */}
      <h3 className="section-title" style={{ fontSize: 14, marginBottom: 12 }}>타이포그래피</h3>
      <div className="table-wrap" style={{ marginBottom: 20 }}>
        <table>
          <thead>
            <tr><th>용도</th><th>클래스</th><th>크기 / 굵기</th><th>예시</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>페이지 제목</td><td><code>.page-title</code></td><td>22px / 700</td>
              <td><span style={{ fontSize: 22, fontWeight: 700 }}>페이지 제목</span></td>
            </tr>
            <tr>
              <td>섹션/모달 제목</td><td><code>.section-title</code></td><td>15px / 700</td>
              <td><span style={{ fontSize: 15, fontWeight: 700, color: '#1e293b' }}>섹션 제목</span></td>
            </tr>
            <tr>
              <td>강조 수치(카드 카운트)</td><td><code>.summary-card__count</code></td><td>24px / 700</td>
              <td><span style={{ fontSize: 24, fontWeight: 700 }}>128</span></td>
            </tr>
            <tr>
              <td>본문(표·폼·설명)</td><td>기본 body</td><td>13px / 400</td>
              <td><span style={{ fontSize: 13 }}>본문 텍스트입니다</span></td>
            </tr>
            <tr>
              <td>표 헤더</td><td><code>th</code></td><td>12px / 600</td>
              <td><span style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>컬럼명</span></td>
            </tr>
            <tr>
              <td>메타/캡션/배지</td><td>인라인 11px</td><td>11px / 400~600</td>
              <td><span style={{ fontSize: 11, color: '#94a3b8' }}>2026.07.07 10:00</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 버튼 */}
      <h3 className="section-title" style={{ fontSize: 14, marginBottom: 12 }}>버튼</h3>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
        <button className="btn-tool btn-tool--add">btn-tool--add</button>
        <button className="btn-tool btn-tool--edit">btn-tool--edit</button>
        <button className="btn-tool btn-tool--toggle">btn-tool--toggle</button>
        <button className="btn-tool btn-tool--cancel">btn-tool--cancel</button>
        <button className="btn-tool btn-tool--delete">btn-tool--delete</button>
        <button className="btn-tool" disabled>btn-tool (disabled)</button>
        <button className="btn-search">btn-search</button>
      </div>
      <ul style={{ fontSize: 12, color: '#64748b', lineHeight: 1.9, paddingLeft: 20, marginBottom: 20 }}>
        <li><code>--add</code>: 등록·저장·승인처럼 긍정적 확정 액션 (Navy 채움)</li>
        <li><code>--edit</code>: 하위 목록 행의 &quot;편집&quot; (Blue 아웃라인)</li>
        <li><code>--toggle</code> / <code>--cancel</code>: 편집모드 전환·취소 (동일 스타일, 회색 아웃라인)</li>
        <li><code>--delete</code>: 삭제·반려처럼 되돌릴 수 없는 부정적 액션 (Red 아웃라인)</li>
        <li><code>btn-search</code>: FilterBar의 조회 버튼 전용 (Blue 채움)</li>
      </ul>

      {/* 폼 요소 */}
      <h3 className="section-title" style={{ fontSize: 14, marginBottom: 12 }}>폼 요소</h3>
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: 10 }}>
        <div className="add-form__field" style={{ width: 200 }}>
          <label>텍스트 입력 <span className="add-form__req">*</span></label>
          <input type="text" placeholder="placeholder" />
        </div>
        <div className="add-form__field" style={{ width: 160 }}>
          <label>select</label>
          <select><option>옵션 4개 이상</option></select>
        </div>
        <div className="add-form__field">
          <label>라디오 (4개 미만)</label>
          <div className="pgm-status-radio">
            {[{ v: 'ACTIVE', l: '활성' }, { v: 'INACTIVE', l: '비활성' }].map((o) => (
              <label key={o.v} className={`pgm-status-radio__item${radioValue === o.v ? ' pgm-status-radio__item--on' : ''}`} onClick={() => setRadioValue(o.v)}>
                <input type="radio" name="ds-radio" checked={radioValue === o.v} onChange={() => setRadioValue(o.v)} />{o.l}
              </label>
            ))}
          </div>
        </div>
      </div>
      <p style={{ fontSize: 11, color: '#94a3b8', marginBottom: 20 }}>
        모든 입력 요소 높이는 <strong>36px</strong>, 테두리 <code>#cbd5e1</code>, 포커스 시 테두리 Blue + <code>box-shadow: 0 0 0 3px rgba(59,130,246,.12)</code>.
        필수 표시는 빨간 <code>*</code>(<code>.add-form__req</code>), 에러 메시지는 11px 빨간 텍스트(<code>.add-form__err</code>).
      </p>

      <h4 style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8 }}>표(table) 안에서의 select / radio / toggle</h4>
      <ul style={{ fontSize: 12, color: '#64748b', lineHeight: 1.9, paddingLeft: 20, marginBottom: 20 }}>
        <li><strong>select</strong>: 행 단위로 값을 바로 바꿀 때는 전용 클래스 없이 기본 <code>&lt;select&gt;</code>를 <code>&lt;td&gt;</code>에 그대로 넣는다.
          실제 예: <code>product/product-list/tabs/OptionsTab.tsx</code>의 SKU별 상태 select.</li>
        <li><strong>radio</strong>: 표 안에서는 쓰지 않는다. <code>.pgm-status-radio</code>는 상세/등록 폼 전용이며,
          표의 행 단위 상태 변경은 위 select 방식을 따른다.</li>
        <li><strong>toggle(스위치)</strong>: 별도 토글 스위치 컴포넌트는 존재하지 않는다(<code>globals.css</code>에 <code>.toggle</code>/<code>.switch</code> 없음).
          boolean 값의 인라인 편집은 스타일 없는 <code>&lt;input type=&quot;checkbox&quot;&gt;</code>를 <code>&lt;td&gt;</code>에 그대로 쓴다.
          실제 예: <code>system/role-status/tabs/PermissionsTab.tsx</code>의 메뉴별 읽기/쓰기 체크박스.
          단, 같은 체크박스라도 &quot;행 선택(다중 삭제용)&quot; 체크박스와 &quot;상태값 boolean 편집&quot; 체크박스는 용도가 다르므로 섞어 쓰지 않는다.</li>
      </ul>

      {/* 레이아웃 토큰 */}
      <h3 className="section-title" style={{ fontSize: 14, marginBottom: 12 }}>레이아웃 토큰</h3>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8 }}>모서리 반경 (border-radius)</div>
          <div style={{ display: 'flex', gap: 12 }}>
            {[{ r: 6, l: '표준(버튼·인풋·탭)' }, { r: 8, l: '카드(요약카드·테이블랩)' }, { r: 12, l: '모달' }, { r: 999, l: '배지(pill)' }].map((x) => (
              <div key={x.r} style={{ textAlign: 'center' }}>
                <div style={{ width: 48, height: 48, background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: x.r }} />
                <div style={{ fontSize: 10, color: '#64748b', marginTop: 4 }}>{x.r}px</div>
                <div style={{ fontSize: 10, color: '#94a3b8', maxWidth: 70 }}>{x.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <p style={{ fontSize: 11, color: '#94a3b8', marginBottom: 20 }}>
        여백/간격은 <strong>8 / 12 / 16 / 20 / 24px</strong> 단위로만 쓴다 (예: 카드 내부 패딩 16~20px, 페이지 패딩 32px 24px, 폼 필드 간격 12~14px).
        임의의 홀수 px 값(예: 13px, 17px)은 새로 만들지 않는다.
      </p>

      {/* 핵심 구조 클래스 */}
      <h3 className="section-title" style={{ fontSize: 14, marginBottom: 12 }}>핵심 구조 클래스</h3>
      <div className="table-wrap" style={{ marginBottom: 20 }}>
        <table>
          <thead><tr><th>클래스</th><th>용도</th></tr></thead>
          <tbody>
            <tr><td><code>.table-wrap</code> + <code>table</code></td><td>흰 카드로 감싼 표준 표 (헤더 <code>#f8fafc</code>, 행 hover 강조)</td></tr>
            <tr><td><code>.detail-modal-overlay</code> / <code>.detail-modal</code></td><td>상세·등록 팝업의 오버레이 + 카드 (헤더/바디/푸터 구조)</td></tr>
            <tr><td><code>.summary-bar</code> / <code>.summary-card</code></td><td>목록 상단 통계 카드 행. <code>--warn</code>/<code>--info</code>/<code>--muted</code> 변형 지원</td></tr>
            <tr><td><code>.filter-bar</code></td><td>검색/필터 입력 + 조회 버튼을 담는 흰 툴바</td></tr>
            <tr><td><code>.info-grid</code> / <code>.info-dl</code> / <code>.info-row</code></td><td>라벨-값 2열 정의형 리스트 (상세화면 읽기 모드)</td></tr>
            <tr><td><code>.timeline</code> / <code>.timeline-item</code></td><td>세로 타임라인 (처리이력·변경이력). <code>data-variant=&quot;success&quot;</code> 등으로 강조</td></tr>
            <tr><td><code>.inner-tabs__bar</code> / <code>.inner-tabs__btn</code></td><td>상세 모달·가이드 페이지 내부의 2차 탭 (최상단 MDI 탭바와는 별개)</td></tr>
          </tbody>
        </table>
      </div>

      {/* 아이콘 컨벤션 */}
      <h3 className="section-title" style={{ fontSize: 14 }}>아이콘 · 이모지 컨벤션</h3>
      <ul style={{ fontSize: 13, color: '#374151', lineHeight: 2, paddingLeft: 20 }}>
        <li>별도 아이콘 폰트/SVG 세트 없이 <strong>이모지를 컴포넌트 코드에 직접</strong> 사용한다 (globals.css에는 아이콘이 없음)</li>
        <li>🛍 어드민 브랜드 로고 (파트너는 🏪)</li>
        <li>📌 고정된 탭(대시보드), ✕ 닫기 버튼, ⚠ 경고/품절/위험 강조, ● 구현 완료 메뉴 표시</li>
        <li>순서이동(↑/↓)·표시전환(👁) 같은 비파괴적 토글은 아이콘 버튼 유지, 삭제·편집처럼 되돌릴 수 없는 액션은 반드시 글자 버튼(<code>btn-tool--edit</code>/<code>--delete</code>) 사용</li>
      </ul>
    </div>
  )
}
