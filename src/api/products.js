const BASE_URL = 'https://6a815106400f94b23c6f51be.mockapi.io/cards/cards';

async function request(path = '') {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`);
  } catch {
    throw new Error('network');
  }
  if (!response.ok) throw new Error(`http_${response.status}`);
  return response.json();
}

export function getProducts() {
  return request('');
}

export function getProduct(id) {
  return request(`/${id}`);
}

// Product schema isn't fixed by the spec beyond "name/description/category/price/
// characteristics/rating" — normalize defensively so the UI survives whatever
// field names the live MockAPI project ends up using.
export function normalizeProduct(raw) {
  const id = String(raw.id ?? raw._id ?? '');
  return {
    id,
    name: raw.name ?? raw.title ?? raw.productName ?? 'Untitled product',
    description: raw.description ?? raw.details ?? '',
    category: raw.category ?? raw.type ?? raw.group ?? 'general',
    price: Number(raw.price ?? raw.cost ?? 0),
    oldPrice: Number(raw.oldPrice ?? raw.compareAtPrice ?? raw.mrp ?? 0) || 0,
    image: raw.image ?? raw.thumbnail ?? raw.photo ?? raw.avatar ?? null,
    rating: Number(raw.rating ?? raw.avgRating ?? raw.stars ?? 0),
    ratingCount: Number(raw.ratingCount ?? raw.reviewsCount ?? (Array.isArray(raw.reviews) ? raw.reviews.length : 0)),
    popularity: Number(raw.popularity ?? raw.sales ?? raw.orders ?? raw.ratingCount ?? 0),
    store: raw.store ?? raw.seller ?? raw.brand ?? 'HealthFlow Store',
    brand: raw.brand ?? raw.store ?? raw.seller ?? null,
    stock: raw.stock ?? raw.inStock ?? raw.quantity ?? null,
    specifications: raw.specifications ?? raw.specs ?? null,
    reviews: Array.isArray(raw.reviews) ? raw.reviews : [],
  };
}
