interface VendorData {
  vendor_id: number;
  vendor_name: string;
  grade: string;
  grade_score: number;
}

export function VendorInfo({ vendor }: { vendor: VendorData }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{vendor.vendor_name}</h1>
        <p className="text-sm text-gray-500 mt-1">오늘의 운영 현황</p>
      </div>
      <div className="text-right">
        <span className="inline-block bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full">
          {vendor.grade}
        </span>
        <p className="text-xs text-gray-500 mt-1">평가 점수 {vendor.grade_score}점</p>
      </div>
    </div>
  );
}
