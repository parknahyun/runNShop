'use client'
import { useState } from 'react'
import { InnerTabs } from '@/shell/shared/InnerTabs'
import { DetailShell, type DetailMode } from '@/shell/shared/DetailShell'
import {
  type Exhibition, type ExhibitionProduct, type ExhibitionPromotion,
  EXHIBITION_STATUS_LABEL,
} from './mockData'
import { ExhibitionStatusBadge } from './ExhibitionStatusBadge'
import BasicInfoTab from './tabs/BasicInfoTab'
import ProductsTab from './tabs/ProductsTab'
import PromotionsTab from './tabs/PromotionsTab'

// ---------------------------------------------------------------------------
// BannerPreview
// ---------------------------------------------------------------------------

function BannerPreview({ exhibition }: { exhibition: Exhibition }) {
  return (
    <div className="mobile-preview-wrap">
      <div className="mobile-frame">
        <div className="mobile-frame__bar">
          <div className="mobile-frame__dot" />
        </div>
        <div className="mobile-frame__screen">
          {exhibition.bannerImageUrl ? (
            <img src={exhibition.bannerImageUrl} alt={exhibition.title}
              style={{ width: '100%', display: 'block' }} />
          ) : (
            <div style={{ padding: 32, textAlign: 'center', color: '#94a3b8', fontSize: 12 }}>
              배너 이미지가 없습니다.
            </div>
          )}
          <div style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600 }}>{exhibition.title}</div>
          {exhibition.products.length === 0 ? (
            <div style={{ padding: '0 12px 16px', color: '#94a3b8', fontSize: 12 }}>등록된 상품이 없습니다.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, padding: '0 12px 16px' }}>
              {exhibition.products.map((p: ExhibitionProduct) => (
                <div key={p.productId} style={{ border: '1px solid #f1f5f9', borderRadius: 6, overflow: 'hidden' }}>
                  <div style={{ height: 60, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 22 }}>🛍</span>
                  </div>
                  <div style={{ padding: '6px 8px' }}>
                    <div style={{ fontSize: 11, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.productName}</div>
                    <div style={{ fontSize: 10, color: '#64748b' }}>{p.price.toLocaleString()}원</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// ChangeLog
// ---------------------------------------------------------------------------

interface ExhibitionChangeLog {
  logId: string
  changedAt: string
  changedBy: string
  description: string
}

// ---------------------------------------------------------------------------
// ExhibitionDetail
// ---------------------------------------------------------------------------

export default function ExhibitionDetail({ exhibition: initialExhibition, currentUser, mode = 'tab', onClose, onUpdate, readOnly = false }: {
  exhibition: Exhibition
  currentUser: string
  mode?: DetailMode
  onClose?: () => void
  onUpdate: (updated: Exhibition) => void
  readOnly?: boolean
}) {
  const [exhibition, setExhibition] = useState<Exhibition>(initialExhibition)
  const [changeLogs, setChangeLogs] = useState<ExhibitionChangeLog[]>([])

  function appendLog(description: string) {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    setChangeLogs((prev) => [{
      logId: `EXHLOG-${String(prev.length + 1).padStart(3, '0')}`,
      changedAt: now,
      changedBy: currentUser,
      description,
    }, ...prev])
  }

  function handleBasicUpdate(updated: Exhibition) {
    setExhibition(updated)
    onUpdate(updated)
    appendLog(`기본 정보 수정 (상태: ${EXHIBITION_STATUS_LABEL[updated.status]})`)
  }

  function handleProductsUpdate(products: ExhibitionProduct[]) {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const updated: Exhibition = { ...exhibition, products, updatedBy: currentUser, updatedAt: now }
    setExhibition(updated)
    onUpdate(updated)
    appendLog(`상품 구성 변경 (총 ${products.length}건)`)
  }

  function handlePromotionsUpdate(promotions: ExhibitionPromotion[]) {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const updated: Exhibition = { ...exhibition, promotions, updatedBy: currentUser, updatedAt: now }
    setExhibition(updated)
    onUpdate(updated)
    appendLog(`소속 프로모션 변경 (총 ${promotions.length}건)`)
  }

  return (
    <DetailShell mode={mode} title={exhibition.title}
      meta={<>
        <span style={{ fontSize: 12, color: '#64748b' }}>{exhibition.exhibitionId}</span>
        <ExhibitionStatusBadge status={exhibition.status} />
        <span style={{ fontSize: 12, color: '#64748b' }}>
          {exhibition.startAt} ~ {exhibition.endAt}
        </span>
      </>}
      onClose={onClose}>
        <InnerTabs tabs={[
          {
            key: 'basic',
            label: '기본정보',
            content: (
              <div className="tab-panel-content">
                <BasicInfoTab
                  exhibition={exhibition}
                  currentUser={currentUser}
                  onUpdate={handleBasicUpdate}
                  readOnly={readOnly}
                />
              </div>
            ),
          },
          {
            key: 'products',
            label: '상품관리',
            content: (
              <div className="tab-panel-content">
                <ProductsTab
                  exhibition={exhibition}
                  onSave={handleProductsUpdate}
                  readOnly={readOnly}
                />
              </div>
            ),
          },
          {
            key: 'promotions',
            label: `소속 프로모션 (${exhibition.promotions.length})`,
            content: (
              <div className="tab-panel-content">
                <PromotionsTab
                  exhibition={exhibition}
                  onSave={handlePromotionsUpdate}
                  readOnly={readOnly}
                />
              </div>
            ),
          },
          {
            key: 'preview',
            label: '미리보기',
            content: (
              <div className="tab-panel-content">
                <BannerPreview exhibition={exhibition} />
              </div>
            ),
          },
          {
            key: 'logs',
            label: `변경이력 (${changeLogs.length})`,
            content: (
              <div className="tab-panel-content">
                {changeLogs.length === 0 ? (
                  <p className="state-msg" style={{ padding: '20px 0', fontSize: 13 }}>변경 이력이 없습니다.</p>
                ) : (
                  <div className="table-wrap" style={{ marginBottom: 0 }}>
                    <table>
                      <thead>
                        <tr>
                          <th>변경일시</th>
                          <th>변경자</th>
                          <th>변경 내용</th>
                        </tr>
                      </thead>
                      <tbody>
                        {changeLogs.map((log) => (
                          <tr key={log.logId}>
                            <td style={{ fontSize: 12, color: '#64748b' }}>{log.changedAt}</td>
                            <td style={{ fontSize: 12 }}>{log.changedBy}</td>
                            <td style={{ fontSize: 13 }}>{log.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ),
          },
        ]} />
    </DetailShell>
  )
}
