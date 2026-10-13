'use client'
import { useState, type ReactNode } from 'react'
import {
  type Product, type ProductImage, type ProductOptionGroup, type ProductSku, type StockMovementType,
} from './mockData'
import { InnerTabs } from '@/shell/shared/InnerTabs'
import { DetailShell, type DetailMode } from '@/shell/shared/DetailShell'
import BasicInfoTab from './tabs/BasicInfoTab'
import ImagesTab from './tabs/ImagesTab'
import OptionsTab from './tabs/OptionsTab'
import StockHistoryTab from './tabs/StockHistoryTab'
import InquiriesTab from './tabs/InquiriesTab'
import ReviewsTab from './tabs/ReviewsTab'

export default function ProductDetail({ product, currentUser, mode = 'modal', onClose, onUpdate = () => {}, readOnly = false, footer }: {
  product: Product
  currentUser: string
  mode?: DetailMode
  onClose?: () => void
  onUpdate?: (updated: Product) => void
  /** true면 모든 탭이 조회 전용으로 렌더링된다 (상품 심사 화면 등에서 재사용) */
  readOnly?: boolean
  /** 탭 영역 아래에 고정으로 노출되는 영역 (예: 심사 승인/반려 액션) */
  footer?: ReactNode
}) {
  const [current, setCurrent] = useState<Product>(product)

  function touch(patch: Partial<Product>) {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const updated: Product = { ...current, ...patch, updatedBy: currentUser, updatedAt: now }
    setCurrent(updated)
    onUpdate(updated)
  }

  function handleBasicUpdate(updated: Product) {
    setCurrent(updated)
    onUpdate(updated)
  }

  function handleImagesUpdate(images: ProductImage[]) {
    touch({ images })
  }

  function handleOptionsUpdate(options: ProductOptionGroup[], skus: ProductSku[]) {
    touch({ options, skus })
  }

  function handleAddHistory(historyId: string, skuKey: string, type: StockMovementType, quantity: number, memo: string) {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const stockHistories = [...current.stockHistories, { historyId, skuKey, type, quantity, memo, createdBy: currentUser, createdAt: now }]
    touch({ stockHistories })
  }

  function handleAnswer(inquiryId: string, answer: string) {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const inquiries = current.inquiries.map((inq) => inq.inquiryId === inquiryId
      ? { ...inq, status: 'ANSWERED' as const, answer, answeredAt: now }
      : inq)
    touch({ inquiries })
  }

  function handleToggleReviewHidden(reviewId: string) {
    const reviews = current.reviews.map((r) => r.reviewId === reviewId ? { ...r, hidden: !r.hidden } : r)
    touch({ reviews })
  }

  return (
    <DetailShell mode={mode} title={current.productName}
      meta={<span className="detail-modal__subtitle">{current.productId}</span>}
      onClose={onClose}>
      <InnerTabs sticky tabs={[
        {
          label: '기본정보',
          content: <BasicInfoTab product={current} currentUser={currentUser} onUpdate={handleBasicUpdate} readOnly={readOnly} />,
        },
        {
          label: `이미지 (${current.images.length})`,
          content: <ImagesTab product={current} onSave={handleImagesUpdate} readOnly={readOnly} />,
        },
        {
          label: `옵션 (${current.options.length})`,
          content: <OptionsTab product={current} onSave={handleOptionsUpdate} readOnly={readOnly} />,
        },
        {
          label: `재고이력 (${current.stockHistories.length})`,
          content: <StockHistoryTab product={current} onAddHistory={handleAddHistory} readOnly={readOnly} />,
        },
        {
          label: `문의 (${current.inquiries.length})`,
          content: <InquiriesTab product={current} onAnswer={handleAnswer} readOnly={readOnly} />,
        },
        {
          label: `상품평 (${current.reviews.length})`,
          content: <ReviewsTab product={current} onToggleHidden={handleToggleReviewHidden} readOnly={readOnly} />,
        },
      ]} />
      {footer}
    </DetailShell>
  )
}
