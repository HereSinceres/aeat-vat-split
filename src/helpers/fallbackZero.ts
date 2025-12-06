
import { LineInput } from "../aeatSplit";

export function fallbackToZeroVat(lines: LineInput[]): LineInput[] {
  const total = lines.reduce((s, l) => s + l.gross, 0);
  return [{ gross: total, vatPercent: 0 }];
}
