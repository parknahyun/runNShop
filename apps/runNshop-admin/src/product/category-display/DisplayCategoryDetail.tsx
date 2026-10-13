'use client'
import { useState } from 'react'
import { type DisplayCategory } from './mockData'
import { InnerTabs } from '@/shell/shared/InnerTabs'
import { DetailShell, type DetailMode } from '@/shell/shared/DetailShell'
import BasicInfoTab from './tabs/BasicInfoTab'
import StandardCategoriesTab from './tabs/StandardCategoriesTab'

export default function DisplayCategoryDetail({ category, categories, currentUser, mode = 'modal', onClose, onUpdate, readOnly = false }: {
  category: DisplayCategory
  categories: DisplayCategory[]
  currentUser: string
  mode?: DetailMode
  onClose?: () => void
  onUpdate: (updated: DisplayCategory) => void
  readOnly?: boolean
}) {
  const [current, setCurrent] = useState<DisplayCategory>(category)

  function handleBasicUpdate(updated: DisplayCategory) {
    setCurrent(updated)
    onUpdate(updated)
  }

  function handleStandardCategoriesUpdate(standardCategoryIds: string[]) {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const updated: DisplayCategory = { ...current, standardCategoryIds, updatedBy: currentUser, updatedAt: now }
    setCurrent(updated)
    onUpdate(updated)
  }

  return (
    <DetailShell mode={mode} title={current.categoryName}
      meta={<span className="detail-modal__subtitle">{current.categoryId}</span>}
      onClose={onClose}>
      <InnerTabs sticky tabs={[
        {
          label: '기본정보',
          content: <BasicInfoTab category={current} categories={categories} currentUser={currentUser} onUpdate={handleBasicUpdate} readOnly={readOnly} />,
        },
        {
          label: `표준카테고리 (${current.standardCategoryIds.length})`,
          content: <StandardCategoriesTab category={current} onSave={handleStandardCategoriesUpdate} readOnly={readOnly} />,
        },
      ]} />
    </DetailShell>
  )
}
