/**
 * Check if a 0.01 adjustment is AEAT-legal.
 *
 * Conditions:
 *  - net stays >= 0
 *  - VAT does not change (no rounding jump)
 *
 * @param net - Original net amount
 * @param vatPercent - VAT rate (0.21 / 0.10 ...)
 * @param delta - +0.01 or -0.01
 * @returns boolean
 */
export function canAdjustPenny(net: number, vatPercent: number, delta: number) {
  const newNet = Number((net + delta).toFixed(2));
  if (newNet < 0) return false;

  const vatBefore = Math.round(net * vatPercent);
  const vatAfter = Math.round(newNet * vatPercent);

  return vatBefore === vatAfter;
}
