interface PendingItem {
  type: string;
  label: string;
  count: number;
  link: string;
}

export function PendingItems({ items }: { items: PendingItem[] }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <h3 className="text-sm font-bold text-gray-900 mb-3">처리 필요 항목</h3>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.type} className="flex items-center justify-between py-1.5">
            <span className="text-sm text-gray-600">{item.label}</span>
            <span className="text-sm font-bold text-primary">{item.count}건</span>
          </div>
        ))}
      </div>
    </div>
  );
}
