'use client'
import { useState, type ReactElement } from 'react'
import { useTabContext } from '@/shell/TabContext'
import type { DetailMode } from './DetailShell'

interface UseDetailOpenerOptions<T> {
  mode: DetailMode
  getTabId: (item: T) => string
  getTabLabel: (item: T) => string
  renderDetail: (item: T, onClose: () => void) => ReactElement
}

/**
 * 호출방식(mode)에 따라 동일한 상세 컴포넌트를 팝업 또는 MDI 탭으로 연다.
 * - mode: 'modal' → 로컬 state로 표시/숨김, modalElement를 목록 화면에 렌더링
 * - mode: 'tab'   → TabContext.openTab()으로 등록, modalElement는 항상 null
 */
export function useDetailOpener<T>({ mode, getTabId, getTabLabel, renderDetail }: UseDetailOpenerOptions<T>) {
  const { openTab } = useTabContext()
  const [modalItem, setModalItem] = useState<T | null>(null)

  function open(item: T) {
    if (mode === 'tab') {
      openTab({
        id: getTabId(item),
        label: getTabLabel(item),
        element: renderDetail(item, () => {}),
      })
    } else {
      setModalItem(item)
    }
  }

  const modalElement = mode === 'modal' && modalItem
    ? renderDetail(modalItem, () => setModalItem(null))
    : null

  return { open, modalElement, modalItem, setModalItem }
}
