
export function canAdjustPenny(net: number, vat_percent: number, delta: number) {
  const newNet = net + delta;
  if (newNet < 0) return false;

  const oldVat = Math.round((net * vat_percent) / 100);
  const newVat = Math.round((newNet * vat_percent) / 100);

  return oldVat === newVat;
}
