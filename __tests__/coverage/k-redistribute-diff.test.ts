import { redistributeGross } from "../../src/helpers/redistribute";

describe("redistributeGross diff != 0 branch coverage", () => {
  test("Triggers diff correction path", () => {
    const lines = [
      { gross: 0.10, vatPercent: 0.21 },
      { gross: 0.10, vatPercent: 0.10 },
      { gross: 0.10, vatPercent: 0.04 },
    ];

    const redistributed = redistributeGross(lines);

    const originalTotal = Number(lines.reduce((s, x) => s + x.gross, 0).toFixed(2));
    const redistributedTotal = Number(
      redistributed.reduce((s, x) => s + x.gross, 0).toFixed(2)
    );

    // 如果 diff 分支触发，sum 被修正为 originalTotal
    expect(redistributedTotal).toBe(originalTotal);
  });
});
