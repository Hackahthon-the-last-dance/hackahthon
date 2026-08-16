import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Minus, Plus, Store as StoreIcon } from 'lucide-react';
import { useTranslation } from '../context/I18nContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { getProduct, normalizeProduct } from '../api/products.js';
import { getLocalReviews, addLocalReview, computeAverageRating } from '../api/reviews.js';
import ImageWithFallback from '../components/shared/ImageWithFallback.jsx';
import Rating from '../components/shared/Rating.jsx';
import Button from '../components/shared/Button.jsx';
import Card from '../components/shared/Card.jsx';
import ErrorState from '../components/shared/ErrorState.jsx';
import EmptyState from '../components/shared/EmptyState.jsx';
import ReviewCard from '../components/shared/ReviewCard.jsx';
import SkeletonCard from '../components/shared/SkeletonCard.jsx';

export default function Product() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { addItem } = useCart();
  const navigate = useNavigate();

  const [status, setStatus] = useState('loading'); // loading | error | notfound | ready
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [localReviews, setLocalReviews] = useState(() => getLocalReviews(id));
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

  const load = () => {
    setStatus('loading');
    getProduct(id)
      .then((data) => {
        if (!data || !data.id) {
          setStatus('notfound');
          return;
        }
        setProduct(normalizeProduct(data));
        setStatus('ready');
      })
      .catch((err) => {
        setStatus(err.message === 'http_404' ? 'notfound' : 'error');
      });
  };

  useEffect(() => {
    load();
    setLocalReviews(getLocalReviews(id));
    setQuantity(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const allReviews = useMemo(
    () => [...localReviews, ...(product?.reviews ?? [])],
    [localReviews, product]
  );
  const avgRating = allReviews.length ? computeAverageRating(allReviews) : product?.rating ?? 0;

  const handleAddToCart = () => {
    addItem(product, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleReviewSubmit = (event) => {
    event.preventDefault();
    if (!reviewForm.comment.trim()) return;
    const entry = addLocalReview(id, { rating: reviewForm.rating, comment: reviewForm.comment.trim() });
    setLocalReviews((list) => [entry, ...list]);
    setReviewForm({ rating: 5, comment: '' });
  };

  if (status === 'loading') {
    return (
      <div className="grid grid-cols-1 gap-8 py-8 lg:grid-cols-2">
        <SkeletonCard lines={0} className="aspect-square" />
        <SkeletonCard lines={5} />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="py-8">
        <ErrorState title={t('product.errorTitle')} onRetry={load} />
      </div>
    );
  }

  if (status === 'notfound') {
    return (
      <div className="py-8">
        <EmptyState title={t('product.notFoundTitle')} description={t('product.notFoundDescription')} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 py-8">
      <button
        type="button"
        onClick={() => navigate('/store')}
        className="flex w-fit items-center gap-1.5 text-sm font-semibold text-text-secondary hover:text-text"
      >
        <ArrowLeft size={15} />
        {t('product.backToStore')}
      </button>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <ImageWithFallback src={product.image} alt={product.name} className="aspect-square w-full rounded-2xl" />

        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-extrabold text-text">{product.name}</h1>
          <Rating value={avgRating} count={allReviews.length} />
          <span className="text-3xl font-extrabold text-text">${product.price.toFixed(2)}</span>

          <Link
            to={`/seller/${encodeURIComponent(product.store)}`}
            className="flex w-fit items-center gap-1.5 text-sm font-semibold text-primary"
          >
            <StoreIcon size={14} />
            {t('product.seller')}: {product.store}
          </Link>

          <div className="flex items-center gap-3 pt-2">
            <div className="flex items-center gap-2 rounded-full border border-border-strong px-2 py-1">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-full text-text-secondary hover:bg-hover"
                aria-label="-"
              >
                <Minus size={14} />
              </button>
              <span className="w-6 text-center text-sm font-bold text-text">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-text-secondary hover:bg-hover"
                aria-label="+"
              >
                <Plus size={14} />
              </button>
            </div>
            <Button variant="primary" icon={ShoppingCart} onClick={handleAddToCart}>
              {justAdded ? t('product.addedToCart') : t('product.addToCart')}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-2 text-lg font-bold text-text">{t('product.description')}</h2>
          <p className="text-sm leading-relaxed text-text-secondary">
            {product.description || t('product.noSpecifications')}
          </p>
        </Card>
        <Card>
          <h2 className="mb-2 text-lg font-bold text-text">{t('product.specifications')}</h2>
          {product.specifications && Object.keys(product.specifications).length > 0 ? (
            <dl className="flex flex-col gap-1.5 text-sm">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b border-border py-1.5 last:border-0">
                  <dt className="text-text-muted">{key}</dt>
                  <dd className="font-semibold text-text">{String(value)}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="text-sm text-text-secondary">{t('product.noSpecifications')}</p>
          )}
        </Card>
      </div>

      <section>
        <h2 className="mb-4 text-lg font-bold text-text">{t('product.reviewsTitle')}</h2>

        <Card className="mb-4">
          <form onSubmit={handleReviewSubmit} className="flex flex-col gap-3">
            <h3 className="text-sm font-bold text-text">{t('reviews.addTitle')}</h3>
            <Rating
              value={reviewForm.rating}
              interactive
              onChange={(value) => setReviewForm((f) => ({ ...f, rating: value }))}
            />
            <textarea
              value={reviewForm.comment}
              onChange={(event) => setReviewForm((f) => ({ ...f, comment: event.target.value }))}
              placeholder={t('reviews.commentPlaceholder')}
              rows={3}
              className="w-full resize-none rounded-lg border border-border-strong bg-input p-3 text-sm text-text focus:border-primary focus:outline-none"
            />
            <Button type="submit" variant="primary" size="sm" className="w-fit">
              {t('reviews.submit')}
            </Button>
          </form>
        </Card>

        {allReviews.length === 0 ? (
          <EmptyState description={t('reviews.empty')} />
        ) : (
          <div className="flex flex-col gap-3">
            {allReviews.map((review) => (
              <ReviewCard key={review.id ?? `${review.author}-${review.createdAt}`} review={review} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
