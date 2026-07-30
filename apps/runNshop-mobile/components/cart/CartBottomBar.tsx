'use client';

export function CartBottomBar({ totalPayment }: { totalPayment: number }) {
  const handleOrder = () => {
    alert('프로토타입에서는 지원하지 않는 기능입니다.');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-[360px] mx-auto bg-white border-t border-gray-200 px-4 py-3">
      <button
        onClick={handleOrder}
        className="w-full h-12 bg-primary text-white font-bold rounded-lg text-sm"
      >
        선택상품 주문하기 · {totalPayment.toLocaleString()}원
      </button>
    </div>
  );
}
