import { useMemo, useState } from 'react';
import { useTranslation } from '../context/I18nContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useProducts } from '../hooks/useProducts.js';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll.js';
import SearchBar from '../components/shared/SearchBar.jsx';
import FilterBar from '../components/shared/FilterBar.jsx';
import ProductGrid from '../components/shared/ProductGrid.jsx';
import SkeletonCard from '../components/shared/SkeletonCard.jsx';
import ErrorState from '../components/shared/ErrorState.jsx';
import EmptyState from '../components/shared/EmptyState.jsx';

const PAGE_SIZE = 12;

export default function Store() {
  const { t } = useTranslation();
  const { addItem } = useCart();
  const { status, products, reload } = useProducts();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('popularity');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category).filter(Boolean))],
    [products]
  );

  const filteredSorted = useMemo(() => {
    let list = products;
    if (search.trim()) {
      const query = search.trim().toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(query));
    }
    if (category) {
      list = list.filter((p) => p.category === category);
    }

    const sorted = [...list];
    if (sort === 'priceAsc') sorted.sort((a, b) => a.price - b.price);
    else if (sort === 'priceDesc') sorted.sort((a, b) => b.price - a.price);
    else if (sort === 'ratingDesc') sorted.sort((a, b) => b.rating - a.rating);
    else sorted.sort((a, b) => b.popularity - a.popularity);

    return sorted;
  }, [products, search, category, sort]);

  const visibleProducts = filteredSorted.slice(0, visibleCount);
  const hasMore = visibleCount < filteredSorted.length;

  const sentinelRef = useInfiniteScroll({
    hasMore,
    onLoadMore: () => setVisibleCount((c) => c + PAGE_SIZE),
  });

  return (
    <div className="flex flex-col gap-6 py-8">
      <div>
        <h1 className="text-2xl font-extrabold text-text">{t('store.title')}</h1>
        <p className="mt-1 text-sm text-text-secondary">{t('store.subtitle')}</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar
          value={search}
          onChange={(value) => {
            setSearch(value);
            setVisibleCount(PAGE_SIZE);
          }}
          placeholder={t('store.searchPlaceholder')}
          className="sm:max-w-xs"
        />
        <FilterBar
          groups={[
            {
              key: 'category',
              label: t('store.filters.category'),
              options: categories.map((c) => ({ value: c, label: c })),
            },
          ]}
          active={{ category }}
          onChange={(key, value) => {
            if (key === 'category') setCategory(value);
            setVisibleCount(PAGE_SIZE);
          }}
          sortOptions={[
            { value: 'popularity', label: t('store.sort.popularity') },
            { value: 'priceAsc', label: t('store.sort.priceAsc') },
            { value: 'priceDesc', label: t('store.sort.priceDesc') },
            { value: 'ratingDesc', label: t('store.sort.ratingDesc') },
          ]}
          sortValue={sort}
          onSortChange={setSort}
        />
      </div>

      {status === 'loading' && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {status === 'error' && (
        <ErrorState title={t('store.errorTitle')} description={t('store.errorDescription')} onRetry={reload} />
      )}

      {status === 'ready' && filteredSorted.length === 0 && <EmptyState description={t('store.empty')} />}

      {status === 'ready' && filteredSorted.length > 0 && (
        <>
          <p className="text-xs font-semibold text-text-muted">
            {t('store.resultsCount', { count: filteredSorted.length })}
          </p>
          <ProductGrid products={visibleProducts} onAddToCart={addItem} />
          {hasMore && <div ref={sentinelRef} className="h-1" />}
        </>
      )}
    </div>
  );
}
