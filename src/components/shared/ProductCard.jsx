import { Link } from 'react-router-dom';
import { ShoppingCart, PackageCheck } from 'lucide-react';
import { useTranslation } from '../../context/I18nContext.jsx';
import ImageWithFallback from './ImageWithFallback.jsx';
import Rating from './Rating.jsx';
import Button from './Button.jsx';

function discountPercent(product) {
  if (!product.oldPrice || product.oldPrice <= product.price) return 0;
  return Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
}

export default function ProductCard({ product, onAddToCart }) {
  const { t } = useTranslation();
  const discount = discountPercent(product);
  const outOfStock = typeof product.stock === 'number' && product.stock <= 0;

  const handleAdd = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!outOfStock) onAddToCart(product);
  };

  return (
    <div className="card card-hoverable group relative flex flex-col overflow-hidden">
      <Link to={`/store/${product.id}`} className="relative block">
        <ImageWithFallback src={product.image} alt={product.name} className="aspect-square w-full" />

        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {discount > 0 && (
            <span className="rounded-full bg-danger px-2 py-1 text-[11px] font-extrabold text-white shadow-sm">
              -{discount}%
            </span>
          )}
          {outOfStock && (
            <span className="rounded-full bg-text/70 px-2 py-1 text-[11px] font-extrabold text-text-inverse shadow-sm">
              {t('store.outOfStock')}
            </span>
          )}
        </div>

        {product.brand && (
          <span className="absolute right-2 top-2 rounded-full bg-surface/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-text-secondary shadow-sm backdrop-blur">
            {product.brand}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        {product.category && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
            {product.category}
          </span>
        )}
        <Link to={`/store/${product.id}`} className="line-clamp-2 text-sm font-bold text-text hover:text-primary">
          {product.name}
        </Link>
        <Rating value={product.rating} count={product.ratingCount} size={13} />

        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div className="flex flex-col">
            <span className="flex items-baseline gap-1.5">
              <span className="text-lg font-extrabold text-text">${product.price.toFixed(2)}</span>
              {discount > 0 && (
                <span className="text-xs font-semibold text-text-muted line-through">
                  ${product.oldPrice.toFixed(2)}
                </span>
              )}
            </span>
            {typeof product.stock === 'number' && !outOfStock && (
              <span className="mt-0.5 flex items-center gap-1 text-[10px] font-semibold text-success-strong">
                <PackageCheck size={11} />
                {product.stock} {t('store.inStock')}
              </span>
            )}
          </div>
          <Button variant={outOfStock ? 'secondary' : 'primary'} size="sm" icon={outOfStock ? null : ShoppingCart} onClick={handleAdd}>
            {outOfStock ? t('store.unavailable') : t('store.addToCart')}
          </Button>
        </div>
      </div>
    </div>
  );
}
