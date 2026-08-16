import { createContext, useCallback, useContext, useMemo } from 'react';
import { useLocalStorageState } from '../hooks/useLocalStorageState.js';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useLocalStorageState('hf_cart', []);

  const addItem = useCallback(
    (product, quantity = 1) => {
      setItems((list) => {
        const existing = list.find((i) => i.productId === product.id);
        if (existing) {
          return list.map((i) =>
            i.productId === product.id ? { ...i, quantity: i.quantity + quantity } : i
          );
        }
        return [
          ...list,
          {
            productId: product.id,
            quantity,
            name: product.name,
            price: product.price,
            image: product.image,
          },
        ];
      });
    },
    [setItems]
  );

  const removeItem = useCallback(
    (productId) => setItems((list) => list.filter((i) => i.productId !== productId)),
    [setItems]
  );

  const setQuantity = useCallback(
    (productId, quantity) => {
      if (quantity <= 0) {
        removeItem(productId);
        return;
      }
      setItems((list) => list.map((i) => (i.productId === productId ? { ...i, quantity } : i)));
    },
    [setItems, removeItem]
  );

  const clearCart = useCallback(() => setItems([]), [setItems]);

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items]);
  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

  const value = useMemo(
    () => ({ items, addItem, removeItem, setQuantity, clearCart, subtotal, itemCount }),
    [items, addItem, removeItem, setQuantity, clearCart, subtotal, itemCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
