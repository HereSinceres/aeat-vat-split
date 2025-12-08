import { aeatSplit } from "../src/aeatSplit";

describe("aeatSplit (integer version)", () => {
  test("simple multi-rate split in cents", () => {
    const lines = [
      { gross: 10000, vat_percent: 21 }, // 100.00
      { gross: 5000, vat_percent: 10 }, // 50.00
      { gross: 2000, vat_percent: 0 }, // 20.00
    ];

    const result = aeatSplit(lines);

    // 总金额（含税）必须守恒
    const inputTotal = lines.reduce((s, l) => s + l.gross, 0);
    const outputTotal = result.reduce((s, r) => s + r.net + r.vat, 0);
    expect(outputTotal).toBe(inputTotal);

    // 每行 VAT = round(net * rate / 100)
    result.forEach((r) => {
      expect(r.vat).toBe(Math.round((r.net * r.vat_percent) / 100));
    });
  });

  test("diff === 0 path: all 0% VAT", () => {
    const lines = [
      { gross: 1000, vat_percent: 0 },
      { gross: 2300, vat_percent: 0 },
    ];

    const result = aeatSplit(lines);

    expect(result.length).toBe(2);
    expect(result[0].net).toBe(1000);
    expect(result[0].vat).toBe(0);
    expect(result[1].net).toBe(2300);
    expect(result[1].vat).toBe(0);

    const inputTotal = lines.reduce((s, l) => s + l.gross, 0);
    const outputTotal = result.reduce((s, r) => s + r.net + r.vat, 0);
    expect(outputTotal).toBe(inputTotal);
  });

  test("extreme tricky tiny amounts: fallbackToZeroVat path", () => {
    // 这个组合在整数版算法里会走完整 fallback，并最终 collapse 到 0% VAT
    const lines = [
      { gross: 2, vat_percent: 21 },
      { gross: 3, vat_percent: 21 },
      { gross: 9, vat_percent: 21 },
    ];

    const result = aeatSplit(lines);

    const inputTotal = lines.reduce((s, l) => s + l.gross, 0);
    const outputTotal = result.reduce((s, r) => s + r.net + r.vat, 0);
    expect(outputTotal).toBe(inputTotal);

    // 最终会变成 1 行 0% VAT（fallbackToZeroVat）
    expect(result.length).toBe(1);
    expect(result[0].vat_percent).toBe(0);
    expect(result[0].net + result[0].vat).toBe(inputTotal);
  });
  test("10,10,10,4", () => {
    const lines = [
      { gross: 1, vat_percent: 10 },
      { gross: 1, vat_percent: 4 },
    ];

    const result = aeatSplit(lines);

    expect(result.length).toBe(2);
    expect(result[0].net).toBe(2);
    expect(result[0].vat).toBe(0);
    expect(result[1].net).toBe(0);
    expect(result[1].vat).toBe(0);

    const inputTotal = lines.reduce((s, l) => s + l.gross, 0);
    const outputTotal = result.reduce((s, r) => s + r.net + r.vat, 0);
    expect(outputTotal).toBe(inputTotal);
  });

  test("random property test: always conserves total & VAT formula", () => {
    const rnd = (min: number, max: number) =>
      Math.floor(Math.random() * (max - min + 1)) + min;

    const vatOptions = [0, 4, 10, 21];

    for (let i = 0; i < 200; i++) {
      const lines = Array.from({ length: 3 }, () => ({
        gross: rnd(1, 10000), // 0.01 ~ 100.00
        vat_percent: vatOptions[rnd(0, vatOptions.length - 1)],
      }));

      const result = aeatSplit(lines);

      const inputTotal = lines.reduce((s, l) => s + l.gross, 0);
      const outputTotal = result.reduce((s, r) => s + r.net + r.vat, 0);

      expect(outputTotal).toBe(inputTotal);

      result.forEach((r) => {
        expect(r.net).toBeGreaterThanOrEqual(0);
        expect(r.vat).toBe(Math.round((r.net * r.vat_percent) / 100));
      });
    }
  });
});
