'use client';

interface TrendData {
  period: string;
  labels: string[];
  datasets: { label: string; data: number[]; color: string }[];
}

export function TrendChart({ data }: { data: TrendData }) {
  // 프로토타입: Chart.js 없이 간단한 바 차트로 표현
  const maxValue = Math.max(...data.datasets[0].data);

  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <h3 className="text-sm font-bold text-gray-900 mb-1">주문·매출 추이</h3>
      <p className="text-xs text-gray-500 mb-4">최근 7일</p>

      {/* 주문 건수 바 차트 */}
      <div className="space-y-1.5">
        {data.labels.map((label, i) => (
          <div key={label} className="flex items-center gap-3">
            <span className="text-xs text-gray-500 w-10">{label}</span>
            <div className="flex-1 h-6 bg-gray-100 rounded overflow-hidden relative">
              <div
                className="h-full rounded"
                style={{
                  width: `${(data.datasets[0].data[i] / maxValue) * 100}%`,
                  backgroundColor: data.datasets[0].color,
                }}
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-600">
                {data.datasets[0].data[i]}건
              </span>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-3">* Chart.js 연동 후 라인 차트로 전환 예정</p>
    </div>
  );
}
