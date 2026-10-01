/**
 * Prices come from the data as strings like "7.00". They are summed in cents
 * so that adding 0.50 several times never gives 7.499999.
 */
export function toCents(price) {
  return Math.round(Number(price) * 100);
}

export function formatPrice(price) {
  return `$${Number(price).toFixed(2)}`;
}

export function formatCents(cents) {
  return formatPrice(cents / 100);
}
