interface ProductItem {
  product_id: number;
  product_name: string;
  brand: string;
  image_url: string;
  price_original: number;
  price_sale: number;
  discount_rate: number;
  rating: number;
  review_count: number;
}

export function ProductSection({ title, items }: { title: string; items: ProductItem[] }) {
  return (
    <section className="mt-6 px-4">
      <h2 className="text-lg font-bold text-gray-900 mb-3">{title}</h2>
      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <div key={item.product_id} className="bg-white rounded-lg overflow-hidden shadow-sm">
            <div className="relative">
              <img
                src={item.image_url}
                alt={item.product_name}
                className="w-full aspect-square object-cover"
              />
              {item.discount_rate > 0 && (
                <span className="absolute bottom-2 left-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                  SALE {item.discount_rate}%
                </span>
              )}
            </div>
            <div className="p-2.5">
              <p className="text-xs text-gray-500">{item.brand}</p>
              <p className="text-sm text-gray-900 font-medium mt-0.5 line-clamp-2">
                {item.product_name}
              </p>
              <div className="mt-1.5">
                {item.discount_rate > 0 && (
                  <span className="text-xs text-gray-400 line-through mr-1">
                    {item.price_original.toLocaleString()}원
                  </span>
                )}
                <span className="text-sm font-bold text-gray-900">
                  {item.price_sale.toLocaleString()}원
                </span>
              </div>
              {item.rating > 0 && (
                <div className="flex items-center mt-1 text-xs text-gray-500">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-0.5">{item.rating}</span>
                  <span className="ml-1">({item.review_count})</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
