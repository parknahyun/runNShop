'use client';

interface Coupon {
  coupon_id: string;
  name: string;
  discount_type: string;
  discount_value: number;
  max_discount: number;
  min_order: number;
}

export function CouponSection({ coupons }: { coupons: { available_count: number; items: Coupon[] } }) {
  const handleApply = () => {
    alert('프로토타입에서는 지원하지 않는 기능입니다.');
  };

  return (
    <div className="bg-white mt-2 px-4 py-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-900">쿠폰</h2>
        <button onClick={handleApply} className="text-xs text-primary">
          사용 가능 {coupons.available_count}장 &gt;
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-1">적용된 쿠폰이 없습니다.</p>
    </div>
  );
}
