'use client';

interface PointData {
  balance: number;
  usable: number;
  min_use: number;
}

export function PointSection({ point }: { point: PointData }) {
  const handleUse = () => {
    alert('프로토타입에서는 지원하지 않는 기능입니다.');
  };

  return (
    <div className="bg-white mt-2 px-4 py-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-900">포인트</h2>
        <span className="text-xs text-gray-500">보유 {point.balance.toLocaleString()}P</span>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <input
          type="text"
          placeholder="0"
          disabled
          className="flex-1 h-9 border border-gray-200 rounded px-3 text-sm bg-gray-50"
        />
        <button
          onClick={handleUse}
          className="h-9 px-3 border border-gray-300 rounded text-xs text-gray-700"
        >
          전액 사용
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-1">{point.min_use.toLocaleString()}P 이상 사용 가능</p>
    </div>
  );
}
