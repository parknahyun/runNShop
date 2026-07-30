import { Header } from '@/components/layout/Header';
import { GNB } from '@/components/layout/GNB';
import { BottomNav } from '@/components/layout/BottomNav';

export default function CategoryPage({ params }: { params: { categoryCode: string } }) {
  return (
    <main className="pb-16">
      <Header />
      <GNB />
      <div className="p-4">
        <p className="text-sm text-gray-500">
          &apos;{params.categoryCode}&apos; 카테고리 화면은 아직 구현되지 않았습니다.
        </p>
      </div>
      <BottomNav />
    </main>
  );
}
