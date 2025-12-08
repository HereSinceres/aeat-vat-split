import { aeatSplit } from "../src/aeatSplit";

const VAT_OPTIONS = [0, 4, 10, 21];

// 随机整数区间
const rnd = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// 生成随机行
function randomLines(): { gross: number; vatPercent: number }[] {
  const count = rnd(1, 6); // 1～6行，模拟真实 POS/Kitchen 分摊情况
  const lines: { gross: number; vatPercent: number }[] = [];

  for (let i = 0; i < count; i++) {
    lines.push({
      gross: rnd(1, 100000), // 0.01～1000欧元
      vatPercent: VAT_OPTIONS[rnd(0, VAT_OPTIONS.length - 1)],
    });
  }

  const map = new Map();

  for (const l of lines) {
    if (!map.has(l.vatPercent)) {
      map.set(l.vatPercent, {
        vatPercent: l.vatPercent,
        gross: 0,
        net: 0,
        vat: 0,
        sum: 0,
      });
    }
    const m = map.get(l.vatPercent);
    m.gross += l.gross;
  }

  return [...map.values()];
}

function aggregateByVatPercent(
  lines: {
    net: number;
    vat: number;
    gross: number;
    vatPercent: number;
  }[]
) {
  const map = new Map();

  for (const l of lines) {
    if (!map.has(l.vatPercent)) {
      map.set(l.vatPercent, {
        vatPercent: l.vatPercent,
        gross: 0,
        net: 0,
        vat: 0,
        sum: 0,
      });
    }
    const m = map.get(l.vatPercent);
    m.gross += l.gross;
    m.net += l.net;
    m.vat += l.vat;
  }

  return [...map.values()];
}

describe("Randomized Stress Test (integer AEAT VAT split)", () => {
  const ROUNDS = 2000; // 可改为 5000 或更高

  test(`run ${ROUNDS} rounds of random VAT-split tests`, () => {
    for (let i = 0; i < ROUNDS; i++) {
      const lines = randomLines();
      const inputTotal = lines.reduce((s, l) => s + l.gross, 0);

      const result = aggregateByVatPercent(aeatSplit(lines));
      console.table(result);
      // 输出总额必须等于输入总额（守恒）
      const outputTotal = result.reduce((s, r) => s + r.net + r.vat, 0);
      expect(outputTotal).toBe(inputTotal);

      // 所有值必须是整数且 >=0
      result.forEach((r) => {
        expect(Number.isInteger(r.net)).toBe(true);
        expect(Number.isInteger(r.vat)).toBe(true);
        expect(r.net).toBeGreaterThanOrEqual(0);
        expect(r.vat).toBeGreaterThanOrEqual(0);
      });

      // VAT 必须始终符合公式
      result.forEach((r) => {
        const recomputedVat = Math.round((r.net * r.vatPercent) / 100);
        expect(r.vat).toBe(recomputedVat);
      });

      // fallback 之后 VAT 百分比必须合法
      result.forEach((r) => {
        expect(VAT_OPTIONS.includes(r.vatPercent) || r.vatPercent === 0).toBe(
          true
        );
      });
    }
  });
});
