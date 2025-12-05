import { canAdjustPenny } from "./helpers/adjust";
import { redistributeGross } from "./helpers/redistribute";
import { mergeSameVat } from "./helpers/merge";
import { fallbackToZeroVat } from "./helpers/fallbackZero";

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

function basicSplit(lines: LineInput[]) {
  return lines.map((l) => {
    const tnet = l.gross / (1 + l.vatPercent);
    const net = Number(tnet.toFixed(2));
    const vat = Math.round(net * l.vatPercent);
    return { ...l, net, vat, sum: net + vat };
  });
}

function fixDifference(rows: any[]) {
  const total = rows.reduce((s, r) => s + r.gross, 0);

  let sum = rows.reduce((s, r) => s + r.sum, 0);
  let diff = Number((total - sum).toFixed(2));

  if (diff === 0) return rows;

  const candidates = [...rows].sort((a, b) => {
    if (a.vatPercent !== b.vatPercent) return b.vatPercent - a.vatPercent;
    if (a.vat !== b.vat) return b.vat - a.vat;
    return b.gross - a.gross;
  });

  while (Math.abs(diff) >= 0.01) {
    let patched = false;

    for (let r of candidates) {
      const delta = diff > 0 ? 0.01 : -0.01;
      if (canAdjustPenny(r.net, r.vatPercent, delta)) {
        r.net = Number((r.net + delta).toFixed(2));
        r.vat = Math.round(r.net * r.vatPercent);
        r.sum = r.net + r.vat;
        patched = true;
        break;
      }
    }

    if (!patched) return null;

    sum = candidates.reduce((s, r) => s + r.sum, 0);
    diff = Number((total - sum).toFixed(2));
  }

  return candidates;
}

export function aeatSplit(lines: LineInput[]): LineOutput[] {
  // Step 1: Normal AEAT split
  const s1 = basicSplit(lines);
  const fixed1 = fixDifference(s1);
  if (fixed1) return fixed1;

  // Step 2: Fallback 1 — 行级 gross 重新分配
  const redistributed = redistributeGross(lines);
  const s2 = basicSplit(redistributed);
  const fixed2 = fixDifference(s2);
  if (fixed2) return fixed2;

  // Step 3: Fallback 2 — 合并同税率行
  const merged = mergeSameVat(lines);
  const s3 = basicSplit(merged);
  const fixed3 = fixDifference(s3);
  if (fixed3) return fixed3;

  // Step 4: Fallback 3 — 归 0% 税率（最终兜底）
  const zero = fallbackToZeroVat(lines);
  const s4 = basicSplit(zero);
  return s4;
}
