import { aeatSplit } from "../src/aeatSplit";
import { canAdjustPenny } from "../src/helpers/adjust";
import { redistributeGross } from "../src/helpers/redistribute";
import { mergeSameVat } from "../src/helpers/merge";
import { fallbackToZeroVat } from "../src/helpers/fallbackZero";

describe("AEAT VAT split — normal", () => {
  test("21% + 10% 正常分摊", () => {
    const result = aeatSplit([
      { gross: 60, vatPercent: 0.21 },
      { gross: 40, vatPercent: 0.1 },
    ]);

    const total = Number(
      result.reduce((s, r) => s + r.net + r.vat, 0).toFixed(2)
    );

    expect(total).toBe(100.0);
    result.forEach((r) => {
      expect(r.vat).toBe(Math.round(r.net * r.vatPercent));
    });
  });
});

describe("AEAT VAT split — penny adjustment", () => {
  test("can adjust +0.01", () => {
    expect(canAdjustPenny(10.0, 0.21, 0.01)).toBe(true);
  });

  test("VAT 跳变区间不能补差", () => {
    expect(canAdjustPenny(1.57, 0.21, 0.01)).toBe(true);
  });
  test("VAT 跳变区间不能补差", () => {
    const jump = 2.38; // 接近 VAT=0→1 跳变区间
    expect(canAdjustPenny(jump, 0.21, 0.01)).toBe(false);
  });
});

describe("AEAT VAT split — fallback redistribution", () => {
  test("不可分摊时自动重新分配 gross", () => {
    const result = aeatSplit([
      { gross: 0.1, vatPercent: 0.21 },
      { gross: 0.1, vatPercent: 0.1 },
    ]);

    const total = Number(
      result.reduce((s, r) => s + r.net + r.vat, 0).toFixed(2)
    );

    expect(total).toBe(0.2);
  });
});

describe("AEAT VAT split — merge same VAT", () => {
  test("两行21%合并为一行", () => {
    const merged = mergeSameVat([
      { gross: 0.1, vatPercent: 0.21 },
      { gross: 0.1, vatPercent: 0.21 },
    ]);

    expect(merged.length).toBe(1);
    expect(merged[0].gross).toBe(0.2);
  });
});

describe("AEAT VAT split — fallback to 0%", () => {
  test("极限小额 → AEAT 允许归为 0%", () => {
    const result = fallbackToZeroVat([
      { gross: 0.01, vatPercent: 0.21 },
      { gross: 0.01, vatPercent: 0.1 },
      { gross: 0.01, vatPercent: 0.04 },
    ]);

    expect(result.length).toBe(1);
    expect(result[0].vatPercent).toBe(0);
    expect(result[0].gross).toBe(0.03);
  });
});

describe("AEAT VAT split — stress test", () => {
  test("随机 1000 次必须永远可解", () => {
    for (let i = 0; i < 1000; i++) {
      const lines = [
        { gross: +(Math.random() * 5).toFixed(2), vatPercent: 0.21 },
        { gross: +(Math.random() * 5).toFixed(2), vatPercent: 0.1 },
        { gross: +(Math.random() * 5).toFixed(2), vatPercent: 0.04 },
      ];

      const result = aeatSplit(lines);

      const totalOutput = Number(
        result.reduce((s, r) => s + r.net + r.vat, 0).toFixed(2)
      );
      const totalInput = Number(
        lines.reduce((s, r) => s + r.gross, 0).toFixed(2)
      );

      expect(totalOutput).toBe(totalInput);

      result.forEach((r) => {
        expect(r.vat).toBe(Math.round(r.net * r.vatPercent));
      });
    }
  });
});
