interface BrandItem {
  brand_id: number;
  brand_name: string;
  image_url: string;
  link: string;
}

export function BrandBanner({ items }: { items: BrandItem[] }) {
  return (
    <section className="mt-6 px-4 pb-4">
      <h2 className="text-lg font-bold text-gray-900 mb-3">브랜드</h2>
      <div className="grid grid-cols-4 gap-2">
        {items.map((item) => (
          <div
            key={item.brand_id}
            className="bg-white rounded-lg overflow-hidden shadow-sm flex items-center justify-center h-[60px]"
          >
            <img
              src={item.image_url}
              alt={item.brand_name}
              className="w-full h-full object-contain p-1"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
