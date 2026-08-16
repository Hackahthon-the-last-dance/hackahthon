import { Star } from 'lucide-react';

export default function Rating({ value = 0, count, size = 15, interactive = false, onChange, className = '' }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      <div className="flex items-center gap-0.5" role={interactive ? 'radiogroup' : undefined}>
        {stars.map((star) => {
          const filled = star <= Math.round(value);
          const StarButton = interactive ? 'button' : 'span';
          return (
            <StarButton
              key={star}
              type={interactive ? 'button' : undefined}
              role={interactive ? 'radio' : undefined}
              aria-checked={interactive ? star === Math.round(value) : undefined}
              aria-label={interactive ? `${star}` : undefined}
              onClick={interactive ? () => onChange?.(star) : undefined}
              className={interactive ? 'cursor-pointer' : undefined}
            >
              <Star
                size={size}
                strokeWidth={1.5}
                className={filled ? 'fill-warning text-warning' : 'fill-transparent text-border-strong'}
              />
            </StarButton>
          );
        })}
      </div>
      {typeof count === 'number' && (
        <span className="text-xs font-medium text-text-muted">({count})</span>
      )}
    </div>
  );
}
