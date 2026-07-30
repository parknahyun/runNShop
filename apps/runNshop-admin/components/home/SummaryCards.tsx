interface Card {
  key: string;
  label: string;
  value: number;
  change: number;
  unit: string;
}

export function SummaryCards({ cards }: { cards: Card[] }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {cards.map((card) => (
        <div key={card.key} className="bg-white rounded-lg shadow-sm p-5">
          <p className="text-sm text-gray-500">{card.label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {card.value.toLocaleString()}
            <span className="text-sm font-normal text-gray-500 ml-1">{card.unit}</span>
          </p>
          <p className={`text-sm mt-1 ${card.change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            {card.change >= 0 ? '▲' : '▼'} {Math.abs(card.change)} (전일 대비)
          </p>
        </div>
      ))}
    </div>
  );
}
