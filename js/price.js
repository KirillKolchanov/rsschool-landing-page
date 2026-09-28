/**
 * Prices come from the data as strings like "7.00".
 */
export function formatPrice(price) {
  return `$${Number(price).toFixed(2)}`;
}
