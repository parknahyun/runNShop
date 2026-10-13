interface TimelineItem {
  at: string;
  event: string;
  description: string;
}

export function ClaimStatusTimeline({ timeline }: { timeline: TimelineItem[] }) {
  return (
    <div className="bg-white mt-2 px-4 py-4">
      <h2 className="text-sm font-bold text-gray-900 mb-3">처리 현황</h2>
      <div className="relative pl-4 border-l-2 border-gray-100">
        {timeline.map((item, idx) => (
          <div key={idx} className="relative pb-4 last:pb-0">
            {/* 원형 마커 */}
            <div className={`absolute -left-[21px] w-3 h-3 rounded-full border-2 ${
              idx === timeline.length - 1
                ? 'bg-primary border-primary'
                : 'bg-white border-gray-300'
            }`} />
            <div className="ml-2">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium ${idx === timeline.length - 1 ? 'text-primary' : 'text-gray-700'}`}>
                  {item.event}
                </span>
                <span className="text-xs text-gray-400">{item.at}</span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
