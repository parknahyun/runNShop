import Link from 'next/link';
import { api } from '@/lib/api';
import { Header } from '@/components/layout/Header';
import { GNB } from '@/components/layout/GNB';
import { BottomNav } from '@/components/layout/BottomNav';
import { MainBanner } from '@/components/home/MainBanner';
import { ProductSection } from '@/components/home/ProductSection';
import { ExhibitionSection } from '@/components/home/ExhibitionSection';
import { BrandBanner } from '@/components/home/BrandBanner';

interface HomeData {
  page_code: string;
  areas: Area[];
}

interface Area {
  area_type: string;
  title: string;
  items: any[];
}

export default async function Home() {
  let homeData: HomeData | null = null;

  try {
    homeData = await api<HomeData>('/display/pages/home');
  } catch (e) {
    // Mock API 미실행 시 fallback
  }

  if (!homeData) {
    return (
      <main className="pb-16">
        <Header />
        <GNB />
        <p className="p-4 text-sm text-gray-500">API 서버에 연결할 수 없습니다. Back-end를 실행해주세요.</p>
        <BottomNav />
      </main>
    );
  }

  const bannerArea = homeData.areas.find(a => a.area_type === 'MAIN_BANNER');
  const mdArea = homeData.areas.find(a => a.area_type === 'MD_RECOMMEND');
  const exhibitionArea = homeData.areas.find(a => a.area_type === 'EXHIBITION');
  const newProductArea = homeData.areas.find(a => a.area_type === 'NEW_PRODUCT');
  const brandArea = homeData.areas.find(a => a.area_type === 'BRAND_BANNER');

  return (
    <main className="pb-16">
      <Header />
      <GNB />

      {/* 메인 배너 */}
      {bannerArea && <MainBanner items={bannerArea.items} />}

      {/* MD 추천 상품 */}
      {mdArea && <ProductSection title={mdArea.title} items={mdArea.items} />}

      {/* 진행중 기획전 */}
      {exhibitionArea && <ExhibitionSection title={exhibitionArea.title} items={exhibitionArea.items} />}

      {/* 신상품 */}
      {newProductArea && <ProductSection title={newProductArea.title} items={newProductArea.items} />}

      {/* 브랜드 배너 */}
      {brandArea && <BrandBanner items={brandArea.items} />}

      {/* 스타일 가이드 (개발용) */}
      <div className="mt-8 px-4 text-center">
        <Link href="/guide" className="text-xs text-gray-300">
          스타일 가이드
        </Link>
      </div>

      <BottomNav />
    </main>
  );
}
