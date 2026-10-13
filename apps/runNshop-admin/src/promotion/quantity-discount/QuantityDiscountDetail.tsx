'use client'
import { useState } from 'react'
import { InnerTabs } from '@/shell/shared/InnerTabs'
import { DetailShell, type DetailMode } from '@/shell/shared/DetailShell'
import { type QuantityDiscount, type QuantityDiscountProduct, type QuantityDiscountTier } from './mockData'
import BasicInfoTab from './tabs/BasicInfoTab'
import ProductsTab from './tabs/ProductsTab'
import TiersTab from './tabs/TiersTab'

export default function QuantityDiscountDetail({ quantityDiscount, currentUser, mode = 'modal', onClose, onUpdate, readOnly = false }: {
  quantityDiscount: QuantityDiscount
  currentUser: string
  mode?: DetailMode
  onClose?: () => void
  onUpdate: (updated: QuantityDiscount) => void
  readOnly?: boolean
}) {
  const [current, setCurrent] = useState<QuantityDiscount>(quantityDiscount)

  function handleBasicUpdate(updated: QuantityDiscount) {
    setCurrent(updated)
    onUpdate(updated)
  }

  function handleProductsUpdate(products: QuantityDiscountProduct[]) {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const updated: QuantityDiscount = { ...current, products, updatedBy: currentUser, updatedAt: now }
    setCurrent(updated)
    onUpdate(updated)
  }

  function handleTiersUpdate(tiers: QuantityDiscountTier[]) {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const updated: QuantityDiscount = { ...current, tiers, updatedBy: currentUser, updatedAt: now }
    setCurrent(updated)
    onUpdate(updated)
  }

  return (
    <DetailShell mode={mode} title={current.eventName}
      meta={<span className="detail-modal__subtitle">{current.quantityDiscountId} · {current.vendorName}</span>}
      onClose={onClose}>
      <InnerTabs sticky tabs={[
        {
          label: '기본정보',
          content: <BasicInfoTab quantityDiscount={current} currentUser={currentUser} onUpdate={handleBasicUpdate} readOnly={readOnly} />,
        },
        {
          label: `적용상품 (${current.products.length})`,
          content: <ProductsTab quantityDiscount={current} onSave={handleProductsUpdate} readOnly={readOnly} />,
        },
        {
          label: `구간설정 (${current.tiers.length})`,
          content: <TiersTab quantityDiscount={current} onSave={handleTiersUpdate} readOnly={readOnly} />,
        },
      ]} />
    </DetailShell>
  )
}
