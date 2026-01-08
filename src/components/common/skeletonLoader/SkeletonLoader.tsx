interface SkeletonLoaderProps {
  count?: number
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ count = 3 }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-slate-700/50 rounded-lg p-3 border border-slate-600 animate-pulse">
        <div className="h-4 bg-slate-600 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-slate-600 rounded w-1/2"></div>
      </div>
    ))}
  </div>
)