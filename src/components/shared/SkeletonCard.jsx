export default function SkeletonCard({ className = '', lines = 3 }) {
  return (
    <div className={`card flex flex-col gap-3 p-5 ${className}`} aria-hidden="true">
      <div className="skeleton-shimmer h-32 w-full rounded-lg" />
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="skeleton-shimmer h-3 rounded-full"
          style={{ width: index === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  );
}
