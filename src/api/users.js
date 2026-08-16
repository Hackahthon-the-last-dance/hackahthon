const BASE_URL = 'https://6a814bd0400f94b23c6f4feb.mockapi.io/Users/Users';

async function request(path, options) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new Error('network');
  }

  if (!response.ok) {
    throw new Error(`http_${response.status}`);
  }

  return response.json();
}

// This project's MockAPI resource uses "ID" (uppercase) as its primary key field
// instead of the default "id" — normalize so the rest of the app can rely on `.id`.
function normalizeUser(raw) {
  if (!raw || typeof raw !== 'object') return raw;
  return { ...raw, id: raw.id ?? raw.ID };
}

export async function fetchUsersByEmail(email) {
  const users = await request(`?email=${encodeURIComponent(email)}`);
  return Array.isArray(users) ? users.map(normalizeUser) : users;
}

export async function fetchUserById(id) {
  return normalizeUser(await request(`/${id}`));
}

export async function createUser(payload) {
  return normalizeUser(await request('', { method: 'POST', body: JSON.stringify(payload) }));
}

export async function updateUser(id, payload) {
  return normalizeUser(await request(`/${id}`, { method: 'PUT', body: JSON.stringify(payload) }));
}
