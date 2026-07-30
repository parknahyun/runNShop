interface ReviewSummaryProps {
  averageRating: number;
  totalCount: number;
  distribution: Record<string, number>;
}

export function ReviewSummary({ averageRating, totalCount, distribution }: ReviewSummaryProps) {
  return (
    <div className="px-4 mt-6 py-4 border-t border-gray-100">
      <div className="flex items-center gap-4">
        <div className="text-center">
          <p className="text-3xl font-bold text-gray-900">{averageRating}</p>
          <div className="flex text-yellow-400 text-sm mt-0.5">
            {[1, 2, 3, 4, 5].map(star => (
              <span key={star}>{star <= Math.round(averageRating) ? '★' : '☆'}</span>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-0.5">{totalCount}개 리뷰</p>
        </div>
        <div className="flex-1 space-y-1">
          {['5', '4', '3', '2', '1'].map(star => {
            const count = distribution[star] || 0;
            const percentage = totalCount > 0 ? (count / totalCount) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-2 text-xs">
                <span className="text-gray-500 w-3">{star}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-gray-400 w-6 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
