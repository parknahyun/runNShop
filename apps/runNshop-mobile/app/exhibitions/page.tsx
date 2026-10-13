import { api } from '@/lib/api';
import { Header } from '@/components/layout/Header';
import { GNB } from '@/components/layout/GNB';
import { BottomNav } from '@/components/layout/BottomNav';

interface Exhibition {
  exhibition_code: string;
  title: string;
  thumbnail_url: string;
  status: string;
  start_date: string;
  end_date: string;
  product_count: number;
}

const STATUS_STYLE: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  SCHEDULED: 'bg-blue-100 text-blue-700',
  ENDED: 'bg-gray-100 text-gray-500',
};

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: '진행중',
  SCHEDULED: '예정',
  ENDED: '종료',
};

export default async function ExhibitionsPage() {
  let exhibitions: Exhibition[] = [];

  try {
    const data = await api<{ items: Exhibition[] }>('/exhibitions');
    exhibitions = data.items;
  } catch (e) {}

  if (exhibitions.length === 0) {
    return (
      <main className="pb-16">
        <Header />
        <GNB />
        <p className="p-4 text-sm text-gray-500">기획전 정보를 불러올 수 없습니다.</p>
        <BottomNav />
      </main>
    );
  }

  const active = exhibitions.filter(e => e.status === 'ACTIVE');
  const scheduled = exhibitions.filter(e => e.status === 'SCHEDULED');
  const ended = exhibitions.filter(e => e.status === 'ENDED');

  return (
    <main className="pb-16">
      <Header />
      <GNB />

      <div className="px-4 pt-4 pb-2">
        <h1 className="text-lg font-bold text-gray-900">기획전</h1>
      </div>

      {active.length > 0 && (
        <Section title="진행중" exhibitions={active} />
      )}
      {scheduled.length > 0 && (
        <Section title="예정" exhibitions={scheduled} />
      )}
      {ended.length > 0 && (
        <Section title="종료" exhibitions={ended} />
      )}

      <BottomNav />
    </main>
  );
}

function Section({ title, exhibitions }: { title: string; exhibitions: Exhibition[] }) {
  return (
    <section className="mt-4 px-4">
      <h2 className="text-sm font-bold text-gray-700 mb-2">{title}</h2>
      <div className="space-y-3">
        {exhibitions.map((ex) => (
          <a key={ex.exhibition_code} href={`/exhibitions/${ex.exhibition_code}`} className="block">
            <div className="rounded-lg overflow-hidden shadow-sm bg-white">
              <div className="relative">
                <img src={ex.thumbnail_url} alt={ex.title} className="w-full h-[160px] object-cover" />
                {ex.status === 'ENDED' && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">종료</span>
                  </div>
                )}
              </div>
              <div className="p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${STATUS_STYLE[ex.status]}`}>
                    {STATUS_LABEL[ex.status]}
                  </span>
                  <span className="text-xs text-gray-400">{ex.product_count}개 상품</span>
                </div>
                <p className="text-sm font-medium text-gray-900 line-clamp-1">{ex.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{ex.start_date} ~ {ex.end_date}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
