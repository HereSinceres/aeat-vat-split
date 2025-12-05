import { aeatSplit } from "../../src/aeatSplit";

describe("AEAT dead-corner paths", () => {
  test("Very large VAT values still split correctly", () => {
    const result = aeatSplit([
      { gross: 999.99, vatPercent: 0.21 },
      { gross: 0.01, vatPercent: 0.10 }
    ]);

    const sum = Number(result.reduce((s, r) => s + r.net + r.vat, 0).toFixed(2));
    expect(sum).toBe(1000.00);
  });

  test("Single-line input", () => {
    const result = aeatSplit([{ gross: 10, vatPercent: 0.21 }]);
    expect(result.length).toBe(1);
    expect(result[0].vat).toBe(Math.round(result[0].net * 0.21));
  });
});
