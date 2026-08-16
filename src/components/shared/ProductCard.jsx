import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useTranslation } from '../../context/I18nContext.jsx';
import ImageWithFallback from './ImageWithFallback.jsx';
import Rating from './Rating.jsx';
import Button from './Button.jsx';

export default function ProductCard({ product, onAddToCart }) {
  const { t } = useTranslation();

  return (
    <div className="card flex flex-col overflow-hidden">
      <Link to={`/store/${product.id}`}>
        <ImageWithFallback src={product.image} alt={product.name} className="aspect-square w-full" />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link to={`/store/${product.id}`} className="line-clamp-2 text-sm font-bold text-text hover:text-primary">
          {product.name}
        </Link>
        <Rating value={product.rating} count={product.ratingCount} size={13} />
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-lg font-extrabold text-text">${product.price.toFixed(2)}</span>
          <Button variant="primary" size="sm" icon={ShoppingCart} onClick={() => onAddToCart(product)}>
            {t('store.addToCart')}
          </Button>
        </div>
      </div>
    </div>
  );
}
