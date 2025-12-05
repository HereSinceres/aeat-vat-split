import { aeatSplit } from "../../src/aeatSplit";

describe("AEAT Split — 500 random cases must always succeed", () => {
  test("random inputs always solvable", () => {
    for (let i = 0; i < 500; i++) {
      const lines = [
        { gross: +(Math.random() * 10).toFixed(2), vatPercent: 0.21 },
        { gross: +(Math.random() * 10).toFixed(2), vatPercent: 0.1 },
        { gross: +(Math.random() * 10).toFixed(2), vatPercent: 0.04 },
      ];

      const output = aeatSplit(lines);

      const sumOut = Number(
        output.reduce((s, r) => s + r.net + r.vat, 0).toFixed(2)
      );
      const sumIn = Number(lines.reduce((s, r) => s + r.gross, 0).toFixed(2));

      expect(sumOut).toBe(sumIn);
      output.forEach((r) =>
        expect(r.vat).toBe(Math.round(r.net * r.vatPercent))
      );
    }
  });
});
