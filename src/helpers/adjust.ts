export function canAdjustPenny(net: number, vatPercent: number, delta: number) {
  const newNet = Number((net + delta).toFixed(2));
  if (newNet < 0) return false;

  const vatBefore = Math.round(net * vatPercent);
  const vatAfter = Math.round(newNet * vatPercent);

  return vatBefore === vatAfter;
}
