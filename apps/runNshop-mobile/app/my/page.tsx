import { Header } from '@/components/layout/Header';
import { GNB } from '@/components/layout/GNB';
import { BottomNav } from '@/components/layout/BottomNav';

export default function MyPage() {
  return (
    <main className="pb-16">
      <Header />
      <GNB />
      <div className="p-4">
        <p className="text-sm text-gray-500">마이페이지는 아직 구현되지 않았습니다.</p>
      </div>
      <BottomNav />
    </main>
  );
}
