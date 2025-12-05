import { LineInput } from "../aeatSplit";

export function redistributeGross(lines: LineInput[]): LineInput[] {
  const total = lines.reduce((s, l) => s + l.gross, 0);

  const redistributed = lines.map((l) => {
    const ratio = l.gross / total;
    const gross = Number((ratio * total).toFixed(2));
    return { gross, vatPercent: l.vatPercent };
  });

  const sum = redistributed.reduce((s, l) => s + l.gross, 0);
  const diff = Number((total - sum).toFixed(2));

  if (diff !== 0) {
    redistributed.sort((a, b) => b.vatPercent - a.vatPercent);
    redistributed[0].gross = Number((redistributed[0].gross + diff).toFixed(2));
  }

  return redistributed;
}
