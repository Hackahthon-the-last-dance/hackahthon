import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { useTranslation } from '../context/I18nContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import Card from '../components/shared/Card.jsx';
import Input from '../components/shared/Input.jsx';
import Button from '../components/shared/Button.jsx';
import EmptyState from '../components/shared/EmptyState.jsx';

function generateOrderId() {
  return Math.floor(100000 + Math.random() * 900000);
}

export default function Checkout() {
  const { t } = useTranslation();
  const { items, subtotal, clearCart } = useCart();
  const { currentUser } = useAuth();

  const [form, setForm] = useState({
    name: currentUser?.name ?? '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    paymentMethod: 'card',
  });
  const [orderId, setOrderId] = useState(null);
  const [placedItems, setPlacedItems] = useState([]);
  const [placedSubtotal, setPlacedSubtotal] = useState(0);

  const handleSubmit = (event) => {
    event.preventDefault();
    setPlacedItems(items);
    setPlacedSubtotal(subtotal);
    setOrderId(generateOrderId());
    clearCart();
  };

  if (orderId) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success-soft text-success-strong">
          <CheckCircle2 size={30} />
        </div>
        <h1 className="text-2xl font-bold text-text">{t('checkout.successTitle')}</h1>
        <p className="text-sm text-text-secondary">{t('checkout.successDescription', { orderId })}</p>

        <Card className="w-full text-left">
          <h2 className="mb-2 text-sm font-bold text-text">{t('checkout.orderSummary')}</h2>
          <div className="flex flex-col gap-1.5 text-sm">
            {placedItems.map((item) => (
              <div key={item.productId} className="flex justify-between text-text-secondary">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="mt-2 flex justify-between border-t border-border pt-2 font-bold text-text">
              <span>{t('cart.subtotal')}</span>
              <span>${placedSubtotal.toFixed(2)}</span>
            </div>
          </div>
        </Card>

        <Link to="/store">
          <Button variant="primary">{t('checkout.continueShopping')}</Button>
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-8">
        <EmptyState description={t('checkout.emptyCart')} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 py-8 lg:grid-cols-[1fr_340px]">
      <div>
        <h1 className="mb-6 text-2xl font-extrabold text-text">{t('checkout.title')}</h1>
        <Card>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label={t('checkout.form.name')}
              name="name"
              required
              value={form.name}
              onChange={(event) => setForm((f) => ({ ...f, name: event.target.value }))}
            />
            <Input
              label={t('checkout.form.address')}
              name="address"
              required
              value={form.address}
              onChange={(event) => setForm((f) => ({ ...f, address: event.target.value }))}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label={t('checkout.form.city')}
                name="city"
                required
                value={form.city}
                onChange={(event) => setForm((f) => ({ ...f, city: event.target.value }))}
              />
              <Input
                label={t('checkout.form.postalCode')}
                name="postalCode"
                required
                value={form.postalCode}
                onChange={(event) => setForm((f) => ({ ...f, postalCode: event.target.value }))}
              />
            </div>
            <Input
              label={t('checkout.form.phone')}
              name="phone"
              type="tel"
              required
              value={form.phone}
              onChange={(event) => setForm((f) => ({ ...f, phone: event.target.value }))}
            />
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-text">
                {t('checkout.form.paymentMethod')}
              </label>
              <select
                value={form.paymentMethod}
                onChange={(event) => setForm((f) => ({ ...f, paymentMethod: event.target.value }))}
                className="h-11 w-full rounded-lg border border-border-strong bg-input px-3 text-sm text-text focus:border-primary focus:outline-none"
              >
                <option value="card">{t('checkout.form.paymentOptions.card')}</option>
                <option value="cash">{t('checkout.form.paymentOptions.cash')}</option>
              </select>
            </div>
            <Button type="submit" variant="primary" size="lg" className="w-full">
              {t('checkout.form.submit')}
            </Button>
          </form>
        </Card>
      </div>

      <Card className="h-fit">
        <h2 className="mb-3 text-sm font-bold text-text">{t('checkout.orderSummary')}</h2>
        <div className="flex flex-col gap-1.5 text-sm">
          {items.map((item) => (
            <div key={item.productId} className="flex justify-between text-text-secondary">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="mt-2 flex justify-between border-t border-border pt-2 font-bold text-text">
            <span>{t('cart.subtotal')}</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
