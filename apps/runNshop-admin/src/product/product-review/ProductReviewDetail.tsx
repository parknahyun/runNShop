'use client'
import { useState } from 'react'
import { type Product } from '@/product/product-list/mockData'
import ProductDetail from '@/product/product-list/ProductDetail'
import { type DetailMode } from '@/shell/shared/DetailShell'

export default function ProductReviewDetail({ product, currentUser, mode = 'modal', onClose, onReview }: {
  product: Product
  currentUser: string
  mode?: DetailMode
  onClose?: () => void
  onReview: (updated: Product) => void
}) {
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  function handleApprove() {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    onReview({ ...product, approvalStatus: 'APPROVED', rejectReason: '', updatedBy: currentUser, updatedAt: now })
  }

  function handleReject() {
    if (!rejectReason.trim()) return
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    onReview({ ...product, approvalStatus: 'REJECTED', rejectReason: rejectReason.trim(), updatedBy: currentUser, updatedAt: now })
    setShowRejectForm(false)
    setRejectReason('')
  }

  const reviewFooter = product.approvalStatus === 'PENDING' && (
    <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', flexShrink: 0 }}>
      {!showRejectForm ? (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button className="btn-tool btn-tool--delete" onClick={() => setShowRejectForm(true)}>반려</button>
          <button className="btn-tool btn-tool--add" onClick={handleApprove}>승인</button>
        </div>
      ) : (
        <div className="add-form" style={{ padding: 0 }}>
          <div className="add-form__row">
            <div className="add-form__field add-form__field--full">
              <label>반려사유 <span className="add-form__req">*</span></label>
              <textarea rows={3} value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="반려사유를 입력하세요 (입점사에게 전달됩니다)" />
            </div>
          </div>
          <div className="add-form__footer">
            <button className="btn-tool btn-tool--cancel" onClick={() => { setShowRejectForm(false); setRejectReason('') }}>취소</button>
            <button className="btn-tool btn-tool--delete" disabled={!rejectReason.trim()} onClick={handleReject}>반려 확정</button>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <ProductDetail
      product={product}
      currentUser={currentUser}
      mode={mode}
      onClose={onClose}
      readOnly
      footer={reviewFooter}
    />
  )
}
