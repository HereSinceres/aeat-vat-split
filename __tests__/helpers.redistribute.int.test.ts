import { redistributeGross } from "../src/helpers/redistribute";
import type { LineInput } from "../src/aeatSplit";

describe("redistributeGross (integer version)", () => {
  test("keeps total sum when ratios are simple", () => {
    const lines: LineInput[] = [
      { gross: 500, vat_percent: 21 },
      { gross: 500, vat_percent: 10 },
    ];

    const redistributed = redistributeGross(lines);

    const originalTotal = lines.reduce((s, l) => s + l.gross, 0);
    const newTotal = redistributed.reduce((s, l) => s + l.gross, 0);

    expect(newTotal).toBe(originalTotal);
  });

  test("handles diff != 0 branch and fixes it", () => {
    const lines: LineInput[] = [
      { gross: 1, vat_percent: 21 },
      { gross: 2, vat_percent: 10 },
      { gross: 3, vat_percent: 4 },
    ];

    const redistributed = redistributeGross(lines);

    const originalTotal = lines.reduce((s, l) => s + l.gross, 0);
    const newTotal = redistributed.reduce((s, l) => s + l.gross, 0);

    // 无论有无浮点误差，最终总额必须被修正为和原始一致
    expect(newTotal).toBe(originalTotal);
  });
});
