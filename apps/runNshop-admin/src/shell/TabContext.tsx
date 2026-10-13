'use client'
import { createContext, useContext, useState, type ReactElement } from 'react'

// 원본 §3.1: "최대 탭 수 9개 (홈 탭 제외)" — pinned(홈) 탭은 이 상한에서 제외한다.
export const MAX_NON_PINNED_TABS = 9

export interface TabItem {
  id: string
  label: string
  element: ReactElement
  pinned?: boolean
}

interface TabContextValue {
  tabs: TabItem[]
  activeTabId: string | null
  openTab: (tab: TabItem) => void
  closeTab: (id: string) => void
  activateTab: (id: string) => void
}

const Ctx = createContext<TabContextValue>(null!)

export function TabProvider({ children, initialTabs }: { children: React.ReactNode; initialTabs?: TabItem[] }) {
  const [tabs, setTabs] = useState<TabItem[]>(initialTabs || [])
  const [activeTabId, setActiveTabId] = useState<string | null>(initialTabs?.[0]?.id || null)

  function openTab(tab: TabItem) {
    const exists = tabs.find((t) => t.id === tab.id)
    if (exists) {
      setActiveTabId(tab.id)
      return
    }
    setTabs((prev) => {
      const nonPinned = prev.filter((t) => !t.pinned)
      if (nonPinned.length < MAX_NON_PINNED_TABS) return [...prev, tab]
      // 최대 탭 수 초과 시 가장 오래 전에 연(= 배열에서 가장 앞쪽) 비고정 탭을 자동으로 닫는다.
      const oldest = nonPinned[0]
      return [...prev.filter((t) => t.id !== oldest.id), tab]
    })
    setActiveTabId(tab.id)
  }

  function closeTab(id: string) {
    setTabs((prev) => {
      const target = prev.find((t) => t.id === id)
      if (target?.pinned) return prev // pinned 탭은 닫기 불가
      const next = prev.filter((t) => t.id !== id)
      if (activeTabId === id) {
        setActiveTabId(next.length > 0 ? next[next.length - 1].id : null)
      }
      return next
    })
  }

  function activateTab(id: string) {
    setActiveTabId(id)
  }

  return (
    <Ctx.Provider value={{ tabs, activeTabId, openTab, closeTab, activateTab }}>
      {children}
    </Ctx.Provider>
  )
}

export function useTabContext() {
  return useContext(Ctx)
}
