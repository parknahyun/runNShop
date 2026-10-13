interface OrderItem {
  product_id: number;
  product_name: string;
  image_url: string;
  color: string;
  size: string;
  price_sale: number;
  quantity: number;
}

interface OrderGroup {
  vendor_id: number;
  vendor_name: string;
  items: OrderItem[];
}

export function OrderItemList({ orders }: { orders: OrderGroup[] }) {
  return (
    <div className="bg-white mt-2 px-4 py-4">
      <h2 className="text-sm font-bold text-gray-900 mb-3">주문 상품</h2>
      {orders.map((group) => (
        <div key={group.vendor_id} className="mb-3 last:mb-0">
          <p className="text-xs text-gray-500 mb-2">{group.vendor_name}</p>
          {group.items.map((item) => (
            <div key={item.product_id} className="flex gap-3 mb-2 last:mb-0">
              <img
                src={item.image_url}
                alt={item.product_name}
                className="w-16 h-16 rounded object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 line-clamp-1">{item.product_name}</p>
                <p className="text-xs text-gray-500">{item.color} / {item.size}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm font-bold">{item.price_sale.toLocaleString()}원</span>
                  <span className="text-xs text-gray-500">{item.quantity}개</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
