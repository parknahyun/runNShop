'use client';

export function OrderBottomBar({ totalPayment }: { totalPayment: number }) {
  const handlePayment = () => {
    alert('프로토타입에서는 지원하지 않는 기능입니다.');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-[360px] mx-auto bg-white border-t border-gray-200 px-4 py-3">
      <button
        onClick={handlePayment}
        className="w-full h-12 bg-primary text-white font-bold rounded-lg text-sm"
      >
        {totalPayment.toLocaleString()}원 결제하기
      </button>
    </div>
  );
}
