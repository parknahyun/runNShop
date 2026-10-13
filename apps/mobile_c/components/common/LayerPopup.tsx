'use client';

interface LayerPopupProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function LayerPopup({ title, onClose, children, footer }: LayerPopupProps) {
  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[360px] mx-auto bg-white rounded-t-2xl z-50 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <span className="text-sm font-bold text-secondary">{title}</span>
          <button onClick={onClose} className="text-lg text-gray-400" aria-label="닫기">✕</button>
        </div>
        {/* Body */}
        <div className="px-4 py-3">
          {children}
        </div>
        {/* Footer */}
        {footer && (
          <div className="px-4 py-3 border-t border-gray-200">
            {footer}
          </div>
        )}
      </div>
    </>
  );
}
