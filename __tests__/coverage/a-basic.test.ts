import { aeatSplit } from "../../src/aeatSplit";
import { canAdjustPenny } from "../../src/helpers/adjust";

describe("AEAT Basic Split Flow", () => {
  test("21% + 10% standard split", () => {
    const result = aeatSplit([
      { gross: 60, vatPercent: 0.21 },
      { gross: 40, vatPercent: 0.10 },
    ]);

    const total = Number(
      result.reduce((x, r) => x + r.net + r.vat, 0).toFixed(2)
    );
    expect(total).toBe(100.0);

    result.forEach(r =>
      expect(r.vat).toBe(Math.round(r.net * r.vatPercent))
    );
  });

  test("VAT jump boundary 21% must not adjust", () => {
    const nearJump = 2.38;  // VAT 0→1 jump
    expect(canAdjustPenny(nearJump, 0.21, 0.01)).toBe(false);
  });

  test("21% low values always safe for penny", () => {
    expect(canAdjustPenny(1.00, 0.21, 0.01)).toBe(true);
  });
});
