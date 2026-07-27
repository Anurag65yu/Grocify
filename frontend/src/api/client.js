// Central API client. Set VITE_API_URL in .env to enable backend mode.
const BASE = import.meta.env.VITE_API_URL ?? '';

export const API_ENABLED = Boolean(import.meta.env.VITE_API_URL);

export function setToken(token) {
  if (token) localStorage.setItem('grocify_token', token);
  else localStorage.removeItem('grocify_token');
}

export function getToken() {
  return localStorage.getItem('grocify_token');
}

export async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  let data;
  try { data = await res.json(); } catch { data = {}; }
  if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
  return data;
}

export function normalizeProduct(p) {
  return {
    ...p,
    id: (p._id || p.id)?.toString(),
    category: p.category && typeof p.category === 'object' ? p.category.name : p.category,
  };
}

export function normalizeOrder(o) {
  return {
    ...o,
    id: (o._id || o.id)?.toString(),
    total: o.totalAmount ?? o.total,
    totalAmount: o.totalAmount ?? o.total,
    items: (o.items || []).map(item => ({
      id: (item.product?._id || item.product || item.id)?.toString(),
      name: item.product?.name || item.name || '',
      price: item.priceAtPurchase ?? item.price ?? 0,
      image: item.product?.image || item.image || '',
      quantity: item.quantity,
    })),
  };
}
