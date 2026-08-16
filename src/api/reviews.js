// The Products MockAPI schema isn't guaranteed to model reviews, so user-submitted
// reviews are kept as real local state (clearly first-party, never dressed up as
// pre-existing marketplace data) and merged with whatever the product payload embeds.
const STORAGE_KEY = 'hf_local_reviews';

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {};
  } catch {
    return {};
  }
}

function writeAll(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getLocalReviews(productId) {
  return readAll()[productId] ?? [];
}

export function addLocalReview(productId, review) {
  const all = readAll();
  const entry = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, createdAt: new Date().toISOString(), ...review };
  all[productId] = [entry, ...(all[productId] ?? [])];
  writeAll(all);
  return entry;
}

export function computeAverageRating(reviews) {
  if (!reviews.length) return 0;
  return reviews.reduce((sum, r) => sum + Number(r.rating ?? 0), 0) / reviews.length;
}
