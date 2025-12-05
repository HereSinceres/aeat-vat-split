import { LineInput } from "../aeatSplit";

export function mergeSameVat(lines: LineInput[]): LineInput[] {
  const map = new Map<number, number>();

  lines.forEach((l) => {
    map.set(l.vatPercent, (map.get(l.vatPercent) || 0) + l.gross);
  });

  return [...map.entries()].map(([vatPercent, gross]) => ({
    vatPercent,
    gross,
  }));
}
