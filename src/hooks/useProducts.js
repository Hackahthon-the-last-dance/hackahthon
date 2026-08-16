import { useCallback, useEffect, useState } from 'react';
import { getProducts, normalizeProduct } from '../api/products.js';

export function useProducts() {
  const [status, setStatus] = useState('loading'); // loading | error | ready
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    setStatus('loading');
    setError(null);
    getProducts()
      .then((data) => {
        const list = Array.isArray(data) ? data.map(normalizeProduct) : [];
        setProducts(list);
        setStatus('ready');
      })
      .catch((err) => {
        setError(err);
        setStatus('error');
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { status, products, error, reload: load };
}
