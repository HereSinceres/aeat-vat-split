
import { LineInput } from "../aeatSplit";

export function mergeSameVat(lines: LineInput[]): LineInput[] {
  const map = new Map<number, number>();

  lines.forEach(l => {
    map.set(l.vat_percent, (map.get(l.vat_percent) || 0) + l.gross);
  });

  return [...map.entries()].map(([vat_percent, gross]) => ({ vat_percent, gross }));
}
