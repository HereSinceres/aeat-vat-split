import { canAdjustPenny } from "./helpers/adjust";
import { redistributeGross } from "./helpers/redistribute";
import { mergeSameVat } from "./helpers/merge";
import { fallbackToZeroVat } from "./helpers/fallbackZero";

export interface LineInput {
  gross: number;        // 整数（单位：分）
  vatPercent: number;   // 0-100
}

export interface LineOutput {
  net: number;          
  vat: number;
  gross: number;
  vatPercent: number;
}

/**
 * 基础计算：全部整数运算
 */
function basicSplit(lines: LineInput[]) {
  return lines.map(l => {
    const gross = l.gross;
    const rate = l.vatPercent;

    // 理论净额（向下取整）
    const tnet = Math.floor((gross * 100) / (100 + rate));

    // 整数 VAT
    const vat = Math.round((tnet * rate) / 100);

    return {
      ...l,
      net: tnet,
      vat,
      sum: tnet + vat,
    };
  });
}

/**
 * 补差逻辑（整数版）
 */
function fixDifference(rows: any[]) {
  const totalGross = rows.reduce((s, r) => s + r.gross, 0);
  let totalSum = rows.reduce((s, r) => s + r.sum, 0);
  let diff = totalGross - totalSum; // 整数差额（单位：分）

  if (diff === 0) return rows;

  const candidates = [...rows].sort((a, b) => {
    if (a.vatPercent !== b.vatPercent) return b.vatPercent - a.vatPercent;
    if (a.vat !== b.vat) return b.vat - a.vat;
    return b.gross - a.gross;
  });

  // diff 可以是 ±1、±2、±3 ...
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

/**
 * 主入口：整数版
 */
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
