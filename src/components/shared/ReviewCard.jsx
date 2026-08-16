import { useTranslation } from '../../context/I18nContext.jsx';
import Rating from './Rating.jsx';

export default function ReviewCard({ review }) {
  const { t, locale } = useTranslation();
  const date = review.createdAt ? new Date(review.createdAt).toLocaleDateString(locale) : null;

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-bold text-text">{review.author || t('reviews.authorFallback')}</span>
        {date && <span className="text-xs text-text-muted">{date}</span>}
      </div>
      <Rating value={review.rating} size={13} className="mt-1" />
      {review.comment && <p className="mt-2 text-sm leading-relaxed text-text-secondary">{review.comment}</p>}
    </div>
  );
}
