interface NoticeItem {
  id: number;
  title: string;
  created_at: string;
}

export function Notices({ items }: { items: NoticeItem[] }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <h3 className="text-sm font-bold text-gray-900 mb-3">공지사항</h3>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-b-0">
            <p className="text-sm text-gray-900">{item.title}</p>
            <span className="text-xs text-gray-400 flex-shrink-0 ml-4">{item.created_at}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
