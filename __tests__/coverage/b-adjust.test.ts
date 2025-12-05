import { canAdjustPenny } from "../../src/helpers/adjust";

describe("Penny Adjustment Logic", () => {
  test("negative net cannot adjust", () => {
    expect(canAdjustPenny(0.0, 0.21, -0.01)).toBe(false);
  });

  test("VAT invariant → allowed", () => {
    expect(canAdjustPenny(10.0, 0.1, 0.01)).toBe(true);
  });

  test("VAT changes → forbidden", () => {
    expect(canAdjustPenny(2.38, 0.21, 0.02)).toBe(false);
  });
});
