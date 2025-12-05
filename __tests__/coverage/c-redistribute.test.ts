import { redistributeGross } from "../../src/helpers/redistribute";
import { aeatSplit } from "../../src/aeatSplit";

describe("Redistribute Gross Fallback", () => {
  test("redistribute keeps total", () => {
    const res = redistributeGross([
      { gross: 0.1, vatPercent: 0.21 },
      { gross: 0.1, vatPercent: 0.1 },
    ]);

    const sum = Number(res.reduce((s, l) => s + l.gross, 0).toFixed(2));
    expect(sum).toBe(0.2);
  });

  test("redistribution allows final split", () => {
    const out = aeatSplit([
      { gross: 0.1, vatPercent: 0.21 },
      { gross: 0.1, vatPercent: 0.1 },
    ]);

    const sum = Number(out.reduce((s, r) => s + r.net + r.vat, 0).toFixed(2));
    expect(sum).toBe(0.2);
  });
});
