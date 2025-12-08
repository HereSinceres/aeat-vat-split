
import { LineInput } from "../aeatSplit";

export function redistributeGross(lines: LineInput[]): LineInput[] {
  const total = lines.reduce((s, l) => s + l.gross, 0);

  const redistributed = lines.map(l => {
    const ratio = l.gross / total;
    const gross = Math.floor(total * ratio);
    return { gross, vat_percent: l.vat_percent };
  });

  let sum = redistributed.reduce((s, l) => s + l.gross, 0);
  const diff = total - sum;

  if (diff !== 0) {
    redistributed[0].gross += diff;
  }

  return redistributed;
}
