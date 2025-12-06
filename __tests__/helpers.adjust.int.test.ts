import { canAdjustPenny } from "../src/helpers/adjust";

describe("canAdjustPenny (integer version)", () => {
  test("disallow when net would go negative", () => {
    expect(canAdjustPenny(0, 21, -1)).toBe(false);
  });

  test("allow +1 when VAT does not change", () => {
    const net = 1000; // 10.00
    const rate = 10; // 10%

    const oldVat = Math.round((net * rate) / 100);
    const newVat = Math.round(((net + 1) * rate) / 100);

    // 确认 VAT 确实不变
    expect(oldVat).toBe(newVat);
    expect(canAdjustPenny(net, rate, 1)).toBe(true);
  });

  test("disallow when VAT would change (jump boundary)", () => {
    const net = 2; // 2 cents
    const rate = 21;

    const oldVat = Math.round((net * rate) / 100); // 0
    const newVat = Math.round(((net + 1) * rate) / 100); // 1

    expect(oldVat).not.toBe(newVat);
    expect(canAdjustPenny(net, rate, 1)).toBe(false);
  });
});
