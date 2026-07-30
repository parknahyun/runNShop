'use client'
import { useState } from 'react'
import { type PageItem, getSectionLabel, getSectionColor } from '../mockData'

// ---------------------------------------------------------------------------
// 섹션 타입별 필드 정의
// ---------------------------------------------------------------------------

const SECTION_FIELDS: Record<string, Array<{ key: string; label: string; type: string }>> = {
  BANNER: [
    { key: 'imageUrl', label: '이미지 URL', type: 'URL' },
    { key: 'link', label: '링크 URL', type: 'URL' },
    { key: 'altText', label: '대체 텍스트', type: '텍스트' },
    { key: 'heightType', label: '높이', type: '라디오' },
  ],
  PRODUCT_GRID: [
    { key: 'title', label: '섹션 제목', type: '텍스트' },
    { key: 'productIds', label: '상품 ID 목록', type: '상품 선택' },
    { key: 'columns', label: '컬럼 수', type: '숫자' },
  ],
  PRODUCT_CAROUSEL: [
    { key: 'title', label: '섹션 제목', type: '텍스트' },
    { key: 'productIds', label: '상품 ID 목록', type: '상품 선택' },
    { key: 'viewMoreLink', label: '더보기 링크', type: 'URL' },
  ],
  TEXT: [
    { key: 'content', label: '내용 (HTML)', type: '텍스트' },
    { key: 'bgColor', label: '배경색', type: '색상' },
    { key: 'padding', label: '내부 여백 (px)', type: '숫자' },
  ],
  IMAGE_LINK: [
    { key: 'imageUrl', label: '이미지 URL', type: 'URL' },
    { key: 'link', label: '링크 URL', type: 'URL' },
    { key: 'altText', label: '대체 텍스트', type: '텍스트' },
  ],
  COUPON: [
    { key: 'title', label: '버튼 문구', type: '텍스트' },
    { key: 'bgColor', label: '배경색', type: '색상' },
    { key: 'textColor', label: '글자색', type: '색상' },
  ],
  COUNTDOWN: [
    { key: 'title', label: '제목', type: '텍스트' },
    { key: 'subTitle', label: '부제목', type: '텍스트' },
    { key: 'targetAt', label: '목표 일시', type: '날짜/시간' },
  ],
  DIVIDER: [
    { key: 'height', label: '높이 (px)', type: '숫자' },
    { key: 'color', label: '배경색', type: '색상' },
  ],
}

// ---------------------------------------------------------------------------
// DataMappingTab
// ---------------------------------------------------------------------------

export default function DataMappingTab({ eventPage }: { eventPage: PageItem }) {
  const [saving, setSaving] = useState(false)

  function handleSave() {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      alert('저장되었습니다.')
    }, 300)
  }

  return (
    <section className="detail-section" style={{ marginTop: 0 }}>
      <h2 className="section-title" style={{ marginBottom: 16 }}>데이터 맵핑</h2>
      <p style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>
        각 영역의 필드에 실제 데이터를 입력합니다. 저장 시 페이지에 반영됩니다.
      </p>

      {eventPage.sections.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {eventPage.sections.filter(s => s.visible).map((sec) => {
            const fields = SECTION_FIELDS[sec.sectionType] || [{ key: 'data', label: '데이터', type: '텍스트' }]
            return (
              <div key={sec.sectionId} style={{ border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
                {/* 영역 헤더 */}
                <div style={{ background: '#f8fafc', padding: '10px 16px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>{sec.sortOrder}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{sec.sectionName}</span>
                    <span className="badge" style={{ background: getSectionColor(sec.sectionType), color: '#475569' }}>
                      {getSectionLabel(sec.sectionType)}
                    </span>
                  </div>
                </div>
                {/* 필드 폼 */}
                <div style={{ padding: '12px 16px' }}>
                  <div className="add-form" style={{ padding: 0, gap: 10 }}>
                    {fields.map((f) => (
                      <div className="add-form__row" key={f.key}>
                        <div className="add-form__field add-form__field--full">
                          <label>{f.label} <span style={{ fontSize: 10, color: '#94a3b8' }}>({f.type})</span></label>
                          <input type="text" placeholder={`${f.label} 입력`} defaultValue="" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <p className="state-msg">영역이 없습니다. 영역 구성 탭에서 영역을 추가해주세요.</p>
      )}

      {eventPage.sections.filter(s => s.visible).length > 0 && (
        <div className="add-form__footer" style={{ marginTop: 20 }}>
          <button className="btn-tool btn-tool--add" onClick={handleSave} disabled={saving}>
            {saving ? '저장 중...' : '저장'}
          </button>
        </div>
      )}
    </section>
  )
}
