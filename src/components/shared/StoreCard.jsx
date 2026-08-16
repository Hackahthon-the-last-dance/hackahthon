import { Store as StoreIcon } from 'lucide-react';
import Rating from './Rating.jsx';

export default function StoreCard({ name, rating, productCount, productCountLabel, className = '' }) {
  return (
    <div className={`card flex items-center gap-4 p-5 ${className}`}>
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
        <StoreIcon size={24} strokeWidth={2} />
      </div>
      <div>
        <h3 className="text-lg font-bold text-text">{name}</h3>
        <div className="mt-1 flex items-center gap-2">
          <Rating value={rating} size={14} />
        </div>
        {typeof productCount === 'number' && (
          <p className="mt-1 text-xs text-text-muted">{productCountLabel}</p>
        )}
      </div>
    </div>
  );
}
