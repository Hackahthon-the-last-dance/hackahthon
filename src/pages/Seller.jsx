import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from '../context/I18nContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useProducts } from '../hooks/useProducts.js';
import StoreCard from '../components/shared/StoreCard.jsx';
import ProductGrid from '../components/shared/ProductGrid.jsx';
import SkeletonCard from '../components/shared/SkeletonCard.jsx';
import ErrorState from '../components/shared/ErrorState.jsx';
import EmptyState from '../components/shared/EmptyState.jsx';

export default function Seller() {
  const { sellerId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { status, products, reload } = useProducts();

  const sellerName = decodeURIComponent(sellerId);
  const sellerProducts = useMemo(
    () => products.filter((p) => p.store === sellerName),
    [products, sellerName]
  );
  const avgRating = useMemo(
    () =>
      sellerProducts.length
        ? sellerProducts.reduce((sum, p) => sum + p.rating, 0) / sellerProducts.length
        : 0,
    [sellerProducts]
  );

  return (
    <div className="flex flex-col gap-6 py-8">
      <button
        type="button"
        onClick={() => navigate('/store')}
        className="flex w-fit items-center gap-1.5 text-sm font-semibold text-text-secondary hover:text-text"
      >
        <ArrowLeft size={15} />
        {t('seller.back')}
      </button>

      <StoreCard
        name={sellerName}
        rating={avgRating}
        productCount={sellerProducts.length}
        productCountLabel={t('seller.productsCount', { count: sellerProducts.length })}
      />

      <h2 className="text-lg font-bold text-text">{t('seller.products')}</h2>

      {status === 'loading' && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {status === 'error' && <ErrorState onRetry={reload} />}

      {status === 'ready' && sellerProducts.length === 0 && <EmptyState description={t('store.empty')} />}

      {status === 'ready' && sellerProducts.length > 0 && (
        <ProductGrid products={sellerProducts} onAddToCart={addItem} />
      )}
    </div>
  );
}
