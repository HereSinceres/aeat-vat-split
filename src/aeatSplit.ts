export interface LineInput {
  gross: number;
  vatPercent: number;
}

export interface LineOutput {
  net: number;
  vat: number;
  gross: number;
  vatPercent: number;
}

import { canAdjustPenny } from "./helpers/adjust";
import { redistributeGross } from "./helpers/redistribute";
import { mergeSameVat } from "./helpers/merge";
import { fallbackToZeroVat } from "./helpers/fallbackZero";

function basicSplit(lines: LineInput[]) {
  return lines.map((l) => {
    const gross = l.gross;
    const rate = l.vatPercent;

    const tnet = Math.floor((gross * 100) / (100 + rate));
    const vat = Math.round((tnet * rate) / 100);

    return { ...l, net: tnet, vat, sum: tnet + vat };
  });
}

function fixDifference(rows: any[]) {
  const totalGross = rows.reduce((s, r) => s + r.gross, 0);
  let totalSum = rows.reduce((s, r) => s + r.sum, 0);
  let diff = totalGross - totalSum;

  if (diff === 0) return rows;

  const candidates = [...rows].sort((a, b) => {
    if (a.vatPercent !== b.vatPercent) return b.vatPercent - a.vatPercent;
    if (a.vat !== b.vat) return b.vat - a.vat;
    return b.gross - a.gross;
  });

  const delta = diff > 0 ? 1 : -1;

  while (diff !== 0) {
    let patched = false;

    for (const row of candidates) {
      if (canAdjustPenny(row.net, row.vatPercent, delta)) {
        row.net += delta;
        row.vat = Math.round((row.net * row.vatPercent) / 100);
        row.sum = row.net + row.vat;
        patched = true;
        break;
      }
    }

    if (!patched) return null;

    totalSum = candidates.reduce((s, r) => s + r.sum, 0);
    diff = totalGross - totalSum;
  }

  return candidates;
}

export function aeatSplit(lines: LineInput[]): LineOutput[] {
  const s1 = basicSplit(lines);
  const r1 = fixDifference(s1);
  if (r1) return r1;

  const redistributed = redistributeGross(lines);
  const s2 = basicSplit(redistributed);
  const r2 = fixDifference(s2);
  if (r2) return r2;

  const merged = mergeSameVat(lines);
  const s3 = basicSplit(merged);
  const r3 = fixDifference(s3);
  if (r3) return r3;

  const zero = fallbackToZeroVat(lines);
  const s4 = basicSplit(zero);
  return s4;
}
