'use client'
import { useState, type ReactNode } from 'react'

interface Tab {
  key?: string
  label: ReactNode
  content: ReactNode
}

export function InnerTabs({ tabs, sticky }: { tabs: Tab[]; sticky?: boolean }) {
  const resolvedTabs = tabs.map((t, i) => ({ ...t, key: t.key ?? `tab-${i}` }))
  const [active, setActive] = useState(resolvedTabs[0]?.key || '')

  return (
    <div className="inner-tabs">
      <div className={`inner-tabs__bar${sticky ? ' inner-tabs__bar--sticky' : ''}`}>
        {resolvedTabs.map((t) => (
          <button key={t.key}
            className={`inner-tabs__btn${active === t.key ? ' inner-tabs__btn--active' : ''}`}
            onClick={() => setActive(t.key)}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="inner-tabs__content">
        {resolvedTabs.map((t) => (
          <div key={t.key} hidden={t.key !== active}>
            {t.content}
          </div>
        ))}
      </div>
    </div>
  )
}
