import Link from 'next/link';

interface ExhibitionItem {
  exhibition_code: string;
  title: string;
  thumbnail_url: string;
  status: string;
  start_date: string;
  end_date: string;
}

export function ExhibitionSection({ title, items }: { title: string; items: ExhibitionItem[] }) {
  return (
    <section className="mt-6 px-4">
      <Link href="/exhibitions" className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        <span className="text-xs text-gray-400">더보기 &gt;</span>
      </Link>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {items.map((item) => (
          <div
            key={item.exhibition_code}
            className="flex-shrink-0 w-[280px] rounded-lg overflow-hidden shadow-sm"
          >
            <img
              src={item.thumbnail_url}
              alt={item.title}
              className="w-full h-[160px] object-cover"
            />
            <div className="bg-white p-3">
              <span className="inline-block bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded">
                진행중
              </span>
              <p className="text-sm font-medium text-gray-900 mt-1.5 line-clamp-2">
                {item.title}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {item.start_date} ~ {item.end_date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
