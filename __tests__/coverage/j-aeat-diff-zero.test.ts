import { aeatSplit } from "../../src/aeatSplit";

describe("AEAT diff === 0 branch coverage", () => {
  test("Case where no difference exists (diff = 0)", () => {
    const result = aeatSplit([
      { gross: 10.00, vatPercent: 0 },
      { gross: 5.00, vatPercent: 0 },
    ]);

    // 覆盖 fixDifference 中 diff===0 分支
    expect(result.length).toBe(2);
    expect(result[0].net).toBe(10.00);
    expect(result[0].vat).toBe(0);
    expect(result[1].net).toBe(5.00);
    expect(result[1].vat).toBe(0);
  });
});
