import { redistributeGross } from "../../src/helpers/redistribute";

describe("RedistributeGross — branch coverage", () => {
  test("Triggers diff != 0 correction path", () => {
    const lines = [
      { gross: 0.10, vatPercent: 0.21 },
      { gross: 0.10, vatPercent: 0.10 },
      { gross: 0.10, vatPercent: 0.04 },
    ];

    const redistributed = redistributeGross(lines);

    const total = Number(lines.reduce((s, x) => s + x.gross, 0).toFixed(2));
    const sum = Number(redistributed.reduce((s, x) => s + x.gross, 0).toFixed(2));

    expect(sum).toBe(total);
  });
});
