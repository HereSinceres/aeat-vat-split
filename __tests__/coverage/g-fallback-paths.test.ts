import { aeatSplit } from "../../src/aeatSplit";

describe("AEAT Fallback Path Coverage", () => {

  test("Fallback1: Redistribution invoked, but keeps original number of lines", () => {
    const result = aeatSplit([
      { gross: 0.10, vatPercent: 0.21 },
      { gross: 0.10, vatPercent: 0.10 }
    ]);

    // 仍保留两行
    expect(result.length).toBe(2);

    const total = Number(result.reduce((s, r) => s + r.net + r.vat, 0).toFixed(2));
    expect(total).toBe(0.20);
  });

  test("Fallback2 should NOT trigger under realistic cases", () => {
    const result = aeatSplit([
      { gross: 0.01, vatPercent: 0.21 },
      { gross: 0.01, vatPercent: 0.21 },
      { gross: 0.01, vatPercent: 0.21 }
    ]);

    // 仍然 3 行，因为 fixDifference 可调整成功
    expect(result.length).toBe(3);
  });

  test("Fallback3 collapse-to-zero should NOT trigger automatically", () => {
    const result = aeatSplit([
      { gross: 0.01, vatPercent: 0.21 },
      { gross: 0.01, vatPercent: 0.10 },
      { gross: 0.01, vatPercent: 0.04 }
    ]);

    // 仍然多行（因为 basicSplit + fixDifference 已能成功）
    expect(result.length).toBe(3);
  });

});
