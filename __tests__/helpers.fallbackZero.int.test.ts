import { fallbackToZeroVat } from "../src/helpers/fallbackZero";
import type { LineInput } from "../src/aeatSplit";

describe("fallbackToZeroVat (integer version)", () => {
  test("collapse all lines into single 0% VAT line", () => {
    const lines: LineInput[] = [
      { gross: 100, vat_percent: 21 },
      { gross: 200, vat_percent: 10 },
      { gross: 300, vat_percent: 4 },
    ];

    const out = fallbackToZeroVat(lines);

    expect(out.length).toBe(1);
    expect(out[0].vat_percent).toBe(0);

    const originalTotal = lines.reduce((s, l) => s + l.gross, 0);
    expect(out[0].gross).toBe(originalTotal);
  });
});
