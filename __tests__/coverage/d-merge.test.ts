import { mergeSameVat } from "../../src/helpers/merge";

describe("Merge Same VAT Level", () => {
  test("merge two 21% lines → single", () => {
    const merged = mergeSameVat([
      { gross: 0.1, vatPercent: 0.21 },
      { gross: 0.1, vatPercent: 0.21 },
    ]);

    expect(merged.length).toBe(1);
    expect(merged[0].gross).toBe(0.2);
  });
});
