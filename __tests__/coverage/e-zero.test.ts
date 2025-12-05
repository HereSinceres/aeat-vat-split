import { fallbackToZeroVat } from "../../src/helpers/fallbackZero";

describe("Zero-VAT Final Fallback", () => {
  test("extreme low values collapse to 0% VAT", () => {
    const out = fallbackToZeroVat([
      { gross: 0.01, vatPercent: 0.21 },
      { gross: 0.01, vatPercent: 0.10 },
      { gross: 0.01, vatPercent: 0.04 },
    ]);

    expect(out.length).toBe(1);
    expect(out[0].vatPercent).toBe(0);
    expect(out[0].gross).toBe(0.03);
  });
});
