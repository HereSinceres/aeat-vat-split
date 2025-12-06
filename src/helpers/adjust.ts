
export function canAdjustPenny(net: number, vatPercent: number, delta: number) {
  const newNet = net + delta;
  if (newNet < 0) return false;

  const oldVat = Math.round((net * vatPercent) / 100);
  const newVat = Math.round((newNet * vatPercent) / 100);

  return oldVat === newVat;
}
