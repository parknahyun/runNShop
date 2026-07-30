'use client'
import { createContext, useContext, useState, type ReactElement } from 'react'

export const MAX_TABS = 8

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
    if (tabs.length >= MAX_TABS) return
    setTabs((prev) => [...prev, tab])
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
