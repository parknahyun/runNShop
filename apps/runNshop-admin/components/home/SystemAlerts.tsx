interface AlertItem {
  id: number;
  level: string;
  message: string;
  created_at: string;
}

const LEVEL_STYLES: Record<string, string> = {
  ERROR: 'bg-red-100 text-red-700',
  WARN: 'bg-yellow-100 text-yellow-700',
  INFO: 'bg-blue-100 text-blue-700',
};

export function SystemAlerts({ items }: { items: AlertItem[] }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <h3 className="text-sm font-bold text-gray-900 mb-3">시스템 알림</h3>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-b-0">
            <span className={`text-xs font-medium px-2 py-0.5 rounded ${LEVEL_STYLES[item.level] || 'bg-gray-100 text-gray-600'}`}>
              {item.level}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">{item.message}</p>
              <p className="text-xs text-gray-400 mt-0.5">{item.created_at}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
