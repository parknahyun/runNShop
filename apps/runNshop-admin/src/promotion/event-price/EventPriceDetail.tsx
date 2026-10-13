'use client'
import { useState } from 'react'
import { InnerTabs } from '@/shell/shared/InnerTabs'
import { DetailShell, type DetailMode } from '@/shell/shared/DetailShell'
import { type EventPrice, type EventPriceProduct } from './mockData'
import BasicInfoTab from './tabs/BasicInfoTab'
import ProductsTab from './tabs/ProductsTab'

export default function EventPriceDetail({ eventPrice, currentUser, mode = 'modal', onClose, onUpdate, readOnly = false }: {
  eventPrice: EventPrice
  currentUser: string
  mode?: DetailMode
  onClose?: () => void
  onUpdate: (updated: EventPrice) => void
  readOnly?: boolean
}) {
  const [current, setCurrent] = useState<EventPrice>(eventPrice)

  function handleBasicUpdate(updated: EventPrice) {
    setCurrent(updated)
    onUpdate(updated)
  }

  function handleProductsUpdate(products: EventPriceProduct[]) {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const updated: EventPrice = { ...current, products, updatedBy: currentUser, updatedAt: now }
    setCurrent(updated)
    onUpdate(updated)
  }

  return (
    <DetailShell mode={mode} title={current.eventName}
      meta={<span className="detail-modal__subtitle">{current.eventPriceId}</span>}
      onClose={onClose}>
      <InnerTabs sticky tabs={[
        {
          label: '기본정보',
          content: <BasicInfoTab eventPrice={current} currentUser={currentUser} onUpdate={handleBasicUpdate} readOnly={readOnly} />,
        },
        {
          label: `적용상품 (${current.products.length})`,
          content: <ProductsTab eventPrice={current} onSave={handleProductsUpdate} readOnly={readOnly} />,
        },
      ]} />
    </DetailShell>
  )
}
