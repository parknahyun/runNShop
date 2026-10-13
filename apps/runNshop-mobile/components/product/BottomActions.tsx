'use client';

export function BottomActions({ productName }: { productName: string }) {
  const handleAddToCart = () => {
    alert('프로토타입에서는 지원하지 않는 기능입니다.');
  };

  const handleWishlist = () => {
    alert('프로토타입에서는 지원하지 않는 기능입니다.');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-[360px] mx-auto bg-white border-t border-gray-200 px-4 py-3 flex gap-2">
      <button
        onClick={handleWishlist}
        className="w-12 h-12 border border-gray-200 rounded-lg flex items-center justify-center text-gray-500"
        aria-label="찜하기"
      >
        ♡
      </button>
      <button
        onClick={handleAddToCart}
        className="flex-1 h-12 bg-primary text-white font-bold rounded-lg text-sm"
      >
        장바구니 담기
      </button>
    </div>
  );
}
