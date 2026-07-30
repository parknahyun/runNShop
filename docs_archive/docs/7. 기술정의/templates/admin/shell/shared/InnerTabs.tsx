'use client'
import { useState, type ReactNode } from 'react'

interface Tab {
  key: string
  label: string
  content: ReactNode
}

export function InnerTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0]?.key || '')

  return (
    <div className="inner-tabs">
      <div className="inner-tabs__bar inner-tabs__bar--sticky">
        {tabs.map((t) => (
          <button key={t.key}
            className={`inner-tabs__btn${active === t.key ? ' inner-tabs__btn--active' : ''}`}
            onClick={() => setActive(t.key)}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="inner-tabs__content">
        {tabs.map((t) => (
          <div key={t.key} hidden={t.key !== active}>
            {t.content}
          </div>
        ))}
      </div>
    </div>
  )
}
