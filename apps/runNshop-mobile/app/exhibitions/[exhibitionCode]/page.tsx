import { api } from '@/lib/api';

interface ExhibitionDetail {
  exhibition_code: string;
  title: string;
  banner_url: string;
  description: string;
  status: string;
  start_date: string;
  end_date: string;
  products: Product[];
}

interface Product {
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

export default async function ExhibitionDetailPage({
  params,
}: {
  params: { exhibitionCode: string };
}) {
  let exhibition: ExhibitionDetail | null = null;

  try {
    exhibition = await api<ExhibitionDetail>(`/display/pages/exhibition/${params.exhibitionCode}`);
  } catch (e) {}

  if (!exhibition) {
    return <main className="p-4"><p className="text-sm text-gray-500">기획전 정보를 불러올 수 없습니다.</p></main>;
  }

  return (
    <main className="pb-16">
      {/* 배너 */}
      <img src={exhibition.banner_url} alt={exhibition.title} className="w-full h-[200px] object-cover" />

      {/* 기획전 정보 */}
      <div className="px-4 pt-4">
        <span className="inline-block bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded">진행중</span>
        <h1 className="text-lg font-bold text-gray-900 mt-2">{exhibition.title}</h1>
        <p className="text-sm text-gray-600 mt-1">{exhibition.description}</p>
        <p className="text-xs text-gray-400 mt-1">{exhibition.start_date} ~ {exhibition.end_date}</p>
      </div>

      {/* 상품 그리드 */}
      <div className="px-4 mt-6">
        <h2 className="text-sm font-bold text-gray-900 mb-3">기획전 상품 ({exhibition.products.length})</h2>
        <div className="grid grid-cols-2 gap-3">
          {exhibition.products.map((item) => (
            <a key={item.product_id} href={`/products/${item.product_id}`} className="bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="relative">
                <img src={item.image_url} alt={item.product_name} className="w-full aspect-square object-cover" />
                {item.discount_rate > 0 && (
                  <span className="absolute bottom-2 left-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                    SALE {item.discount_rate}%
                  </span>
                )}
              </div>
              <div className="p-2.5">
                <p className="text-xs text-gray-500">{item.brand}</p>
                <p className="text-sm text-gray-900 font-medium mt-0.5 line-clamp-2">{item.product_name}</p>
                <div className="mt-1.5">
                  {item.discount_rate > 0 && (
                    <span className="text-xs text-gray-400 line-through mr-1">{item.price_original.toLocaleString()}원</span>
                  )}
                  <span className="text-sm font-bold text-gray-900">{item.price_sale.toLocaleString()}원</span>
                </div>
                {item.rating > 0 && (
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-0.5">{item.rating}</span>
                    <span className="ml-1">({item.review_count})</span>
                  </div>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
