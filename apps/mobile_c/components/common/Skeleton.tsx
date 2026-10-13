interface SkeletonProps {
  className?: string;
  count?: number;
}

export function Skeleton({ className = 'h-20', count = 3 }: SkeletonProps) {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`bg-gray-200 rounded-lg animate-pulse ${className}`} />
      ))}
    </div>
  );
}
