'use client';

interface CartItem {
  cart_item_id: number;
  product_id: number;
  product_name: string;
  image_url: string;
  color: string;
  size: string;
  price_original: number;
  price_sale: number;
  quantity: number;
  stock: number;
  status: string;
}

interface VendorData {
  vendor_id: number;
  vendor_name: string;
  shipping_fee: number;
  free_threshold: number;
  items: CartItem[];
}

export function VendorGroup({ vendor }: { vendor: VendorData }) {
  const vendorTotal = vendor.items.reduce((sum, item) => sum + item.price_sale * item.quantity, 0);
  const isFreeShipping = vendorTotal >= vendor.free_threshold;

  const handleQuantityChange = () => {
    alert('프로토타입에서는 지원하지 않는 기능입니다.');
  };

  const handleDelete = () => {
    alert('프로토타입에서는 지원하지 않는 기능입니다.');
  };

  return (
    <div className="mt-3 mx-4 bg-white rounded-lg shadow-sm overflow-hidden">
      {/* 입점사 헤더 */}
      <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-900">{vendor.vendor_name}</span>
        <span className="text-xs text-gray-500">
          {isFreeShipping
            ? '무료배송'
            : `배송비 ${vendor.shipping_fee.toLocaleString()}원 (${vendor.free_threshold.toLocaleString()}원 이상 무료)`}
        </span>
      </div>

      {/* 상품 목록 */}
      {vendor.items.map((item) => (
        <div key={item.cart_item_id} className="px-4 py-3 border-b border-gray-50 last:border-b-0">
          <div className="flex gap-3">
            <img
              src={item.image_url}
              alt={item.product_name}
              className="w-20 h-20 rounded-md object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 font-medium line-clamp-2">{item.product_name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{item.color} / {item.size}</p>
              <div className="flex items-center justify-between mt-2">
                <div>
                  {item.price_original !== item.price_sale && (
                    <span className="text-xs text-gray-400 line-through mr-1">
                      {item.price_original.toLocaleString()}원
                    </span>
                  )}
                  <span className="text-sm font-bold text-gray-900">
                    {item.price_sale.toLocaleString()}원
                  </span>
                </div>
              </div>
              {/* 수량 조절 */}
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={handleQuantityChange}
                  className="w-7 h-7 border border-gray-200 rounded text-gray-500 text-sm"
                >
                  −
                </button>
                <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                <button
                  onClick={handleQuantityChange}
                  className="w-7 h-7 border border-gray-200 rounded text-gray-500 text-sm"
                >
                  +
                </button>
                <button
                  onClick={handleDelete}
                  className="ml-auto text-xs text-gray-400"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
