import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useTranslation } from '../context/I18nContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import ImageWithFallback from '../components/shared/ImageWithFallback.jsx';
import Button from '../components/shared/Button.jsx';
import Card from '../components/shared/Card.jsx';
import EmptyState from '../components/shared/EmptyState.jsx';

export default function Cart() {
  const { t } = useTranslation();
  const { items, setQuantity, removeItem, subtotal } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="py-8">
        <h1 className="mb-6 text-2xl font-extrabold text-text">{t('cart.title')}</h1>
        <EmptyState
          icon={ShoppingBag}
          description={t('cart.empty')}
          action={
            <Link to="/store">
              <Button variant="primary" size="sm" className="mt-2">
                {t('cart.browseStore')}
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  const handleCheckout = () => {
    navigate(isAuthenticated ? '/checkout' : '/login', {
      state: isAuthenticated ? undefined : { from: '/checkout' },
    });
  };

  return (
    <div className="flex flex-col gap-6 py-8">
      <h1 className="text-2xl font-extrabold text-text">{t('cart.title')}</h1>
      <p className="text-xs font-semibold text-text-muted">{t('cart.itemsCount', { count: items.length })}</p>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <Card key={item.productId} className="flex items-center gap-4">
              <ImageWithFallback src={item.image} alt={item.name} className="h-20 w-20 shrink-0 rounded-lg" />
              <div className="min-w-0 flex-1">
                <Link
                  to={`/store/${item.productId}`}
                  className="line-clamp-1 text-sm font-bold text-text hover:text-primary"
                >
                  {item.name}
                </Link>
                <p className="mt-1 text-sm font-extrabold text-text">${item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-border-strong px-2 py-1">
                <button
                  type="button"
                  onClick={() => setQuantity(item.productId, item.quantity - 1)}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-text-secondary hover:bg-hover"
                  aria-label="-"
                >
                  <Minus size={13} />
                </button>
                <span className="w-5 text-center text-sm font-bold text-text">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(item.productId, item.quantity + 1)}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-text-secondary hover:bg-hover"
                  aria-label="+"
                >
                  <Plus size={13} />
                </button>
              </div>
              <button
                type="button"
                onClick={() => removeItem(item.productId)}
                aria-label={t('cart.remove')}
                className="text-text-muted hover:text-danger"
              >
                <Trash2 size={16} />
              </button>
            </Card>
          ))}
        </div>

        <Card className="flex h-fit flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-text-secondary">{t('cart.subtotal')}</span>
            <span className="text-xl font-extrabold text-text">${subtotal.toFixed(2)}</span>
          </div>
          <Button variant="primary" size="lg" className="w-full" onClick={handleCheckout}>
            {t('cart.checkout')}
          </Button>
        </Card>
      </div>
    </div>
  );
}
