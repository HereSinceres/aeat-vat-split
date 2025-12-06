import { mergeSameVat } from "../src/helpers/merge";
import type { LineInput } from "../src/aeatSplit";

describe("mergeSameVat (integer version)", () => {
  test("merge multiple lines with same VAT into one", () => {
    const lines: LineInput[] = [
      { gross: 100, vatPercent: 21 },
      { gross: 200, vatPercent: 21 },
      { gross: 300, vatPercent: 10 },
    ];

    const merged = mergeSameVat(lines);

    // 结果中应有两种 VAT：21% 和 10%
    expect(merged.length).toBe(2);

    const map = new Map<number, number>();
    merged.forEach(l => map.set(l.vatPercent, l.gross));

    expect(map.get(21)).toBe(300);
    expect(map.get(10)).toBe(300);
  });
});
