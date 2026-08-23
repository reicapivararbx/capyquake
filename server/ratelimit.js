const buckets = new Map();

// Janela fixa por chave (ip+rota). Retorna ms restante se bloqueado, senao 0.
export function hit(key, limit, windowMs) {
  const now = Date.now();
  let b = buckets.get(key);
  if (!b || now >= b.resetAt) {
    b = { count: 0, resetAt: now + windowMs };
    buckets.set(key, b);
    if (buckets.size > 10000) {
      for (const [k, v] of buckets) if (now >= v.resetAt) buckets.delete(k);
    }
  }
  b.count++;
  if (b.count > limit) return b.resetAt - now;
  return 0;
}
