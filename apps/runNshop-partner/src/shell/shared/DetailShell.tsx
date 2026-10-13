'use client'
import { type ReactNode } from 'react'

export type DetailMode = 'modal' | 'tab'

interface DetailShellProps {
  mode: DetailMode
  title: string
  /** 제목 옆(탭 모드)/아래(팝업 모드)에 노출되는 배지·기간 등 부가정보 */
  meta?: ReactNode
  /** 팝업 모드에서만 사용되는 닫기 콜백. 탭 모드는 MDI 탭바가 닫기를 담당하므로 무시된다 */
  onClose?: () => void
  /** 팝업 모드 전용 크기. 필드가 적은 단일 폼 상세는 'sm'(600px, auto height) 권장 */
  size?: 'default' | 'sm'
  children: ReactNode
}

/**
 * 상세화면 공통 셸. 동일한 내부 콘텐츠(children, 보통 InnerTabs)를
 * 팝업(모달)과 MDI 탭 두 가지 호출 방식으로 그대로 재사용할 수 있게 해준다.
 * 콘텐츠 자체의 좌우 여백(tab-panel-content)은 이 컴포넌트가 아니라
 * children 쪽(각 탭 컴포넌트 root)에서 책임진다 — 셸은 패딩을 추가하지 않는다.
 */
export function DetailShell({ mode, title, meta, onClose, size = 'default', children }: DetailShellProps) {
  if (mode === 'modal') {
    return (
      <div className="detail-modal-overlay">
        <div className={`detail-modal${size === 'sm' ? ' detail-modal--sm' : ''}`} role="dialog" aria-modal="true">
          <div className="detail-modal__header">
            <div>
              <span className="detail-modal__title">{title}</span>
              {meta && <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginTop: 5 }}>{meta}</div>}
            </div>
            <button className="detail-modal__close" onClick={onClose} aria-label="닫기">✕</button>
          </div>
          <div className="detail-modal__body">{children}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">{title}</h1>
        {meta && <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>{meta}</div>}
      </div>
      <div className="detail-content" style={{ padding: 0, height: 'calc(100vh - 150px)' }}>
        {children}
      </div>
    </div>
  )
}
