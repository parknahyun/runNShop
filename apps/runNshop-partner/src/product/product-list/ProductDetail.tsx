'use client'
import { useState } from 'react'
import { type Product, PRODUCT_STATUS_LABEL } from './mockData'
import { InnerTabs } from '@/shell/shared/InnerTabs'

interface Props {
  product: Product
  onClose: () => void
}

function ProductStatusBadge({ status }: { status: string }) {
  return <span className="badge" data-product-status={status}>{PRODUCT_STATUS_LABEL[status as keyof typeof PRODUCT_STATUS_LABEL]}</span>
}

export default function ProductDetail({ product, onClose }: Props) {
  const discountRate = Math.round((1 - product.price_sale / (product.price_sale * 1.18)) * 100)

  return (
    <div className="detail-modal-overlay" onClick={onClose}>
      <div className="detail-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        {/* Header — 샘플 스타일 */}
        <div className="detail-modal__header">
          <div style={{ minWidth: 0, flex: 1 }}>
            <span className="detail-modal__title">{product.name}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>#{product.product_id}</span>
              <ProductStatusBadge status={product.status} />
              <span style={{ fontSize: 12, color: '#64748b' }}>{product.category}</span>
              <span style={{ fontSize: 12, color: '#1e293b', fontWeight: 600 }}>
                {product.price_sale.toLocaleString()}원
              </span>
              {discountRate > 0 && (
                <span style={{ fontSize: 12, color: '#dc2626', fontWeight: 600 }}>{discountRate}%</span>
              )}
            </div>
          </div>
          <button className="detail-modal__close" onClick={onClose} aria-label="닫기">✕</button>
        </div>

        {/* Body — InnerTabs */}
        <div className="detail-modal__body">
          <InnerTabs tabs={[
            { key: 'basic', label: '기본정보', content: <BasicInfoTab product={product} /> },
            { key: 'price', label: '가격', content: <PriceTab product={product} /> },
            { key: 'sku', label: '옵션·SKU', content: <OptionSkuTab product={product} /> },
            { key: 'display', label: '전시정보', content: <DisplayTab product={product} /> },
            { key: 'review', label: '구매평가', content: <StatsTab product={product} /> },
            { key: 'log', label: '변경이력', content: <ChangeLogTab /> },
          ]} />
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------

function BasicInfoTab({ product }: { product: Product }) {
  const [editing, setEditing] = useState(false)

  function handleSave() {
    alert('저장되었습니다.')
    setEditing(false)
  }

  return (
    <div className="tab-panel-content">
      <section className="detail-section" style={{ marginTop: 0 }}>
        <div className="detail-section__head">
          <h2 className="section-title" style={{ marginBottom: 0 }}>기본 정보</h2>
          {!editing && (
            <button className="btn-tool btn-tool--toggle" style={{ height: 28, padding: '0 10px', fontSize: 12 }} onClick={() => setEditing(true)}>편집</button>
          )}
        </div>

        {editing ? (
          <div className="add-form" style={{ padding: '14px 0 0' }}>
            <div className="add-form__row">
              <div className="add-form__field add-form__field--full">
                <label>상품명 <span className="add-form__req">*</span></label>
                <input type="text" defaultValue={product.name} />
              </div>
            </div>
            <div className="add-form__row">
              <div className="add-form__field">
                <label>카테고리</label>
                <select defaultValue={product.category}>
                  <option>러닝화</option><option>러닝 의류</option><option>러닝 기어·액세서리</option>
                </select>
              </div>
              <div className="add-form__field">
                <label>브랜드</label>
                <input type="text" defaultValue="Nike" />
              </div>
            </div>
            <div className="add-form__row">
              <div className="add-form__field">
                <label>상태</label>
                <div className="pgm-status-radio">
                  {(['ON_SALE', 'SOLD_OUT', 'DRAFT'] as const).map((s) => (
                    <label key={s} className={`pgm-status-radio__item${product.status === s ? ' pgm-status-radio__item--on' : ''}`} data-value={s}>
                      <input type="radio" name="status" value={s} defaultChecked={product.status === s} />
                      {PRODUCT_STATUS_LABEL[s]}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="add-form__footer">
              <button className="btn-tool btn-tool--cancel" onClick={() => setEditing(false)}>취소</button>
              <button className="btn-tool btn-tool--add" onClick={handleSave}>저장</button>
            </div>
          </div>
        ) : (
          <div className="info-grid" style={{ marginTop: 12 }}>
            <dl className="info-dl">
              <div className="info-row"><dt>상품ID</dt><dd>{product.product_id}</dd></div>
              <div className="info-row"><dt>상품명</dt><dd>{product.name}</dd></div>
              <div className="info-row"><dt>카테고리</dt><dd>{product.category}</dd></div>
              <div className="info-row"><dt>브랜드</dt><dd>Nike</dd></div>
            </dl>
            <dl className="info-dl">
              <div className="info-row"><dt>상태</dt><dd><ProductStatusBadge status={product.status} /></dd></div>
              <div className="info-row"><dt>최종수정</dt><dd>{product.updated_at}</dd></div>
              <div className="info-row"><dt>평점</dt><dd>{product.rating > 0 ? `★ ${product.rating} (${product.review_count})` : '—'}</dd></div>
              <div className="info-row"><dt>출시일</dt><dd>2026-03-15</dd></div>
            </dl>
          </div>
        )}
      </section>
    </div>
  )
}

function PriceTab({ product }: { product: Product }) {
  const [editing, setEditing] = useState(false)

  return (
    <div className="tab-panel-content">
      <section className="detail-section" style={{ marginTop: 0 }}>
        <div className="detail-section__head">
          <h2 className="section-title" style={{ marginBottom: 0 }}>가격 정보</h2>
          {!editing && <button className="btn-tool btn-tool--toggle" style={{ height: 28, padding: '0 10px', fontSize: 12 }} onClick={() => setEditing(true)}>편집</button>}
        </div>

        {editing ? (
          <div className="add-form" style={{ padding: '14px 0 0' }}>
            <div className="add-form__row">
              <div className="add-form__field"><label>정가</label><input type="text" defaultValue={Math.round(product.price_sale * 1.18).toLocaleString()} style={{ textAlign: 'right' }} /></div>
              <div className="add-form__field"><label>판매가</label><input type="text" defaultValue={product.price_sale.toLocaleString()} style={{ textAlign: 'right' }} /></div>
              <div className="add-form__field"><label>공급가</label><input type="text" defaultValue={Math.round(product.price_sale * 0.7).toLocaleString()} style={{ textAlign: 'right' }} /></div>
            </div>
            <div className="add-form__footer">
              <button className="btn-tool btn-tool--cancel" onClick={() => setEditing(false)}>취소</button>
              <button className="btn-tool btn-tool--add" onClick={() => { alert('저장되었습니다.'); setEditing(false) }}>저장</button>
            </div>
          </div>
        ) : (
          <div className="info-grid" style={{ marginTop: 12 }}>
            <dl className="info-dl">
              <div className="info-row"><dt>정가</dt><dd>{Math.round(product.price_sale * 1.18).toLocaleString()}원</dd></div>
              <div className="info-row"><dt>판매가</dt><dd style={{ fontWeight: 600 }}>{product.price_sale.toLocaleString()}원</dd></div>
              <div className="info-row"><dt>공급가</dt><dd>{Math.round(product.price_sale * 0.7).toLocaleString()}원</dd></div>
            </dl>
            <dl className="info-dl">
              <div className="info-row"><dt>수수료율</dt><dd>8%</dd></div>
              <div className="info-row"><dt>할인율</dt><dd style={{ color: '#dc2626' }}>15%</dd></div>
            </dl>
          </div>
        )}
      </section>
    </div>
  )
}

function OptionSkuTab({ product }: { product: Product }) {
  return (
    <div className="tab-panel-content">
      <section className="detail-section" style={{ marginTop: 0 }}>
        <div className="section-title-row">
          <h2 className="section-title">SKU 목록</h2>
          <span style={{ fontSize: 12, color: '#64748b' }}>전체 {product.sku_count}SKU · 재고 {product.total_stock}개 · 품절 {product.soldout_sku}SKU</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>SKU ID</th><th>색상</th><th>사이즈</th><th>재고</th><th>상태</th></tr></thead>
            <tbody>
              <tr><td>SKU-001</td><td>블랙</td><td>250</td><td>5</td><td><span className="badge" data-product-status="ON_SALE">판매중</span></td></tr>
              <tr><td>SKU-002</td><td>블랙</td><td>255</td><td>3</td><td><span className="badge" data-product-status="ON_SALE">판매중</span></td></tr>
              <tr><td>SKU-003</td><td>블랙</td><td>260</td><td>0</td><td><span className="badge" data-product-status="SOLD_OUT">품절</span></td></tr>
              <tr><td>SKU-004</td><td>화이트</td><td>255</td><td>6</td><td><span className="badge" data-product-status="ON_SALE">판매중</span></td></tr>
              <tr><td>SKU-005</td><td>화이트</td><td>265</td><td>0</td><td><span className="badge" data-product-status="SOLD_OUT">품절</span></td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function DisplayTab({ product }: { product: Product }) {
  return (
    <div className="tab-panel-content">
      <section className="detail-section" style={{ marginTop: 0 }}>
        <h2 className="section-title">전시 정보</h2>
        <div className="info-grid">
          <dl className="info-dl">
            <div className="info-row"><dt>전시 카테고리</dt><dd>{product.category}</dd></div>
            <div className="info-row"><dt>노출 상태</dt><dd>노출중</dd></div>
          </dl>
          <dl className="info-dl">
            <div className="info-row"><dt>MD 추천</dt><dd>미설정</dd></div>
            <div className="info-row"><dt>검색 키워드</dt><dd>러닝화, 쿠셔닝, 페가수스</dd></div>
          </dl>
        </div>
      </section>
    </div>
  )
}

function StatsTab({ product }: { product: Product }) {
  return (
    <div className="tab-panel-content">
      <section className="detail-section" style={{ marginTop: 0 }}>
        <h2 className="section-title">구매평가</h2>
        <div className="info-grid">
          <dl className="info-dl">
            <div className="info-row"><dt>평균 평점</dt><dd>{product.rating > 0 ? `★ ${product.rating}` : '—'}</dd></div>
            <div className="info-row"><dt>리뷰 수</dt><dd>{product.review_count}건</dd></div>
          </dl>
          <dl className="info-dl">
            <div className="info-row"><dt>총 판매량</dt><dd>1,247개</dd></div>
            <div className="info-row"><dt>총 매출</dt><dd>{(product.price_sale * 1247).toLocaleString()}원</dd></div>
          </dl>
        </div>
      </section>
    </div>
  )
}

function ChangeLogTab() {
  return (
    <div className="tab-panel-content">
      <section className="detail-section" style={{ marginTop: 0 }}>
        <h2 className="section-title">변경 이력</h2>
        <div className="timeline-wrap">
          <div className="timeline">
            <div className="timeline-item" data-variant="success">
              <span className="timeline-item__time">06.25 14:30</span>
              <span className="timeline-item__body">
                <span className="timeline-item__event">가격 변경</span>
                <span className="timeline-item__meta">152,000원 → 152,000원</span>
              </span>
            </div>
            <div className="timeline-item">
              <span className="timeline-item__time">06.20 10:00</span>
              <span className="timeline-item__body">
                <span className="timeline-item__event">심사 승인</span>
                <span className="timeline-item__meta">MD 승인 완료</span>
              </span>
            </div>
            <div className="timeline-item">
              <span className="timeline-item__time">06.18 09:15</span>
              <span className="timeline-item__body">
                <span className="timeline-item__event">상품 등록</span>
                <span className="timeline-item__meta">최초 등록</span>
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
