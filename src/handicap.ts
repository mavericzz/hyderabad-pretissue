import type { LtoCell, SheetRace, SheetRunner } from "./lto";
import { races } from "./data.ts";

export type HcpHorse = {
  cloth: number;
  wt: number | null;
  al: string;
  bnc: number | null;
  l1?: LtoCell;
  l2?: LtoCell;
};

export type HcpRace = {
  code: string;
  distM?: number;
  runners: HcpHorse[];
};

export type RatingParts = {
  last: number | null;
  current: number | null;
  ch: number | null;
};

export type HcpResult = {
  hcp: Record<number, number | null>;
  hcpKg: Record<number, number | null>;
  picks: number[];
  ltoPicks: number[];
  l1: Record<number, number | "###" | null>;
  l2: Record<number, number | "###" | null>;
};

/** 1 length ≈ 0.17 s on Indian turf. */
export const LENGTH_SEC = 0.17;
/** 2 official rating points = 1 kg. */
export const POINTS_PER_KG = 2;
export const KG_PER_POINT = 0.5;
/** Carrying 5 kg extra ≈ 1 s slower (the 1/5th rule). */
export const KG_PER_SEC = 5;
/** 1 length = 1 kg at a 1200m sprint; scale by dist/1200. */
export const SPRINT_M = 1200;
export const MIN_KG = 47;
export const MAX_KG = 62;
/** Typical class-field average; Class 5 is often 53. */
export const AVG_KG = 55;

export function deltaT(lengths: number): number {
  return lengths * LENGTH_SEC;
}

export function distanceScale(distM: number): number {
  if (distM <= 0) return 1;
  return distM / SPRINT_M;
}

/** Lengths behind in kg at this trip. 1L = 1 kg at 1200m. */
export function lengthsToKg(lengths: number, distM: number): number {
  return lengths * distanceScale(distM);
}

export function classAvgKg(cls: string | undefined): number | null {
  const c = (cls || "").toLowerCase();
  if (c.includes("maiden") || c.includes("mdn")) return null;
  if (c.includes("class 5") || c.includes("c5")) return 53;
  return AVG_KG;
}

export function classPar(cls: string | undefined): number {
  const c = (cls || "").toLowerCase();
  if (c.includes("gr.1") || c.includes("g1") || c.includes("24mg2") || c.includes("g2")) return 110;
  if (c.includes("gr.3") || c.includes("g3")) return 100;
  if (c.includes("term") || c.includes("trm") || c.includes("wfa")) return 90;
  if (c.includes("class 1") || c.includes("c1")) return 90;
  if (c.includes("class 2") || c.includes("c2")) return 70;
  if (c.includes("class 3") || c.includes("c3")) return 55;
  if (c.includes("class 4") || c.includes("c4") || c.includes("clas 4")) return 40;
  if (c.includes("class 5") || c.includes("c5")) return 20;
  if (c.includes("maiden") || c.includes("mdn")) return 30;
  return 30;
}

export function parseRating(raw: string | null | undefined): RatingParts {
  const nums = (raw || "").match(/\d+/g)?.map(Number) ?? [];
  if (!nums.length) return { last: null, current: null, ch: null };
  if (nums.length === 1) {
    if (nums[0] === 0) return { last: null, current: null, ch: null };
    return { last: null, current: nums[0], ch: null };
  }
  const last = nums[0] === 0 ? null : nums[0];
  const current = nums[nums.length - 1];
  const ch = last == null ? null : current - last;
  return { last, current, ch };
}

export function raceKind(code: string): "maiden" | "handicap" | "terms" {
  const c = code.toUpperCase();
  if (c.includes("MDN") || c.includes("MAIDEN")) return "maiden";
  if (c.includes("TRM") || c.includes("G1") || c.includes("G2") || c.includes("G3") || c.includes("WFA")) {
    return "terms";
  }
  return "handicap";
}

export function parseClaim(al: string | null | undefined): number {
  const n = Number.parseFloat(String(al || "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function roundInt(n: number): number {
  return Math.round(n);
}

function roundHalf(n: number): number {
  return Math.round(n * 2) / 2;
}

function hadRun(cell: LtoCell | undefined): boolean {
  return typeof cell?.pos === "number" && cell.pos >= 1;
}

/**
 * Official allotted kg: Base + (Rating − Baseline) / 2.
 * Caps at typical Indian top 62 kg and floor 47 kg.
 */
export function officialWeight(rating: number, baselineRating: number, baseWeight: number): number {
  const raw = baseWeight + (rating - baselineRating) / POINTS_PER_KG;
  return roundHalf(Math.min(MAX_KG, Math.max(MIN_KG, raw)));
}

/**
 * Weight-adjusted clock.
 * AdjTime = T_winner + L×0.17 − (W_carried − W_avg) / 5.
 * Extra kg is credited (lower AdjTime); a light weight is devalued.
 */
export function adjustedTime(args: {
  winnerTimeS: number;
  lengths: number;
  carriedKg: number;
  avgKg?: number;
}): number {
  const avg = args.avgKg ?? AVG_KG;
  return args.winnerTimeS + deltaT(args.lengths) - (args.carriedKg - avg) / KG_PER_SEC;
}

/**
 * Lengths (and optional last-run weight vs class average) as kg behind the winner.
 * 1 length = 1 kg at 1200m; both beaten lengths and kg carried scale by dist/1200.
 * The 1/5th-second rule lives on adjustedTime, not on this kg figure.
 */
export function weightEquivalence(args: {
  lengths: number;
  distM: number;
  carriedKg?: number | null;
  avgKg?: number | null;
}): number {
  const sf = distanceScale(args.distM);
  let kg = args.lengths * sf;
  if (args.carriedKg != null && args.avgKg != null) {
    kg -= (args.carriedKg - args.avgKg) * sf;
  }
  return kg;
}

function topWeightAnchor(runners: HcpHorse[]): { rating: number; weight: number } | null {
  const weighted = runners.filter((r) => r.wt != null);
  if (!weighted.length) return null;
  const topW = Math.max(...weighted.map((r) => r.wt as number));
  const tops = weighted.filter((r) => r.wt === topW && r.bnc != null);
  if (!tops.length) return null;
  const best = [...tops].sort((a, b) => (b.bnc ?? 0) - (a.bnc ?? 0))[0];
  return { rating: best.bnc as number, weight: best.wt as number };
}

function allottedWellIn(race: HcpRace, horse: HcpHorse): number | null {
  const claim = parseClaim(horse.al);
  if (horse.bnc == null || horse.wt == null) return claim ? -claim : null;
  const anchor = topWeightAnchor(race.runners);
  if (!anchor) return claim ? -claim : null;
  const allotted = officialWeight(horse.bnc, anchor.rating, anchor.weight);
  const carried = horse.wt - claim;
  return roundHalf(carried - allotted);
}

/**
 * Indian performance rating of one run.
 * Beaten horse: mark they ran off minus (lengths × dist/1200) kg × 2 points/kg.
 * Optional last-run weight vs class average applies the 1/5th-second rule first.
 * Latest winner: official raise is the handicapper's figure for that win.
 */
export function runFigure(args: {
  pos: number | "###" | null;
  beaten: number | null;
  distM: number | null | undefined;
  orRanOff: number | null | undefined;
  currentOr?: number | null;
  latest?: boolean;
  cls?: string;
  carriedKg?: number | null;
  avgKg?: number | null;
}): number | "###" | null {
  const pos = args.pos;
  if (pos === "###" || pos == null || typeof pos !== "number" || pos <= 0) return "###";
  const distM = args.distM;
  if (!distM) return null;
  const beaten = args.beaten ?? (pos === 1 ? 0 : null);
  if (beaten == null) return null;
  if (beaten >= 20) return "###";
  const line = args.orRanOff && args.orRanOff > 0 ? args.orRanOff : classPar(args.cls);
  if (pos === 1) {
    if (args.latest && args.currentOr && args.currentOr > line) return roundInt(args.currentOr);
    return roundInt(line);
  }
  const kg = weightEquivalence({
    lengths: beaten,
    distM,
    carriedKg: args.carriedKg,
    avgKg: args.avgKg,
  });
  return roundInt(line - kg * POINTS_PER_KG);
}

function formWt(raceNo: number, cloth: number, index: 0 | 1): number | null {
  const raw = races.find((race) => race.no === raceNo)?.runners.find((runner) => runner.cloth === cloth)?.form[index]?.wt;
  const n = Number.parseFloat(String(raw ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : null;
}

function withLastRunWt(cell: LtoCell, raceNo: number, cloth: number, index: 0 | 1): LtoCell {
  if (cell.wt != null || !cell.distM) return cell;
  const wt = formWt(raceNo, cloth, index);
  return wt == null ? cell : { ...cell, wt };
}

function cellFigure(cell: LtoCell | undefined, currentOr: number | null, latest: boolean, fallbackCls?: string): number | "###" | null {
  if (!cell) return null;
  const cls = cell.cls || fallbackCls;
  return runFigure({
    pos: cell.pos,
    beaten: cell.btl,
    distM: cell.distM,
    orRanOff: cell.rtg,
    currentOr,
    latest,
    cls,
    carriedKg: cell.wt,
    avgKg: cell.wt != null ? classAvgKg(cls) : null,
  });
}

function numeric(v: number | "###" | null | undefined): number | null {
  return typeof v === "number" ? v : null;
}

function overlayCell(cell: LtoCell, fig: number | "###" | null | undefined): LtoCell {
  if (!cell.distM || fig === undefined) return cell;
  return { ...cell, lto: fig };
}

export function analyseHandicap(race: HcpRace): HcpResult {
  const hcp: Record<number, number | null> = {};
  const hcpKg: Record<number, number | null> = {};
  const l1: Record<number, number | "###" | null> = {};
  const l2: Record<number, number | "###" | null> = {};
  const kind = raceKind(race.code);

  for (const r of race.runners) {
    const fig1 = cellFigure(r.l1, r.bnc, true, race.code);
    const fig2 = cellFigure(r.l2, r.bnc, false, race.code);
    l1[r.cloth] = fig1;
    l2[r.cloth] = fig2;
    const usable = numeric(fig1) ?? numeric(fig2);
    const last = usable ?? (!hadRun(r.l1) && !hadRun(r.l2) ? r.bnc : null);
    const claim = parseClaim(r.al);
    if (last == null) {
      hcp[r.cloth] = null;
      hcpKg[r.cloth] = null;
      continue;
    }
    hcp[r.cloth] = roundInt(last + claim * POINTS_PER_KG);
    if (kind === "maiden") {
      hcpKg[r.cloth] = claim ? -claim : 0;
    } else {
      hcpKg[r.cloth] = allottedWellIn(race, r);
    }
  }

  const picks = [...race.runners]
    .filter((r) => hcp[r.cloth] != null)
    .sort((a, b) => (hcp[b.cloth] ?? -Infinity) - (hcp[a.cloth] ?? -Infinity) || a.cloth - b.cloth)
    .slice(0, 4)
    .map((r) => r.cloth);

  const ltoPicks = [...race.runners]
    .filter((r) => numeric(l1[r.cloth]) != null)
    .sort((a, b) => (numeric(l1[b.cloth]) ?? -Infinity) - (numeric(l1[a.cloth]) ?? -Infinity) || a.cloth - b.cloth)
    .slice(0, 4)
    .map((r) => r.cloth);

  return { hcp, hcpKg, picks, ltoPicks, l1, l2 };
}

export function withHandicap<T extends SheetRace>(race: T): T {
  const runners = race.runners.map((r: SheetRunner) => ({
    ...r,
    l1: withLastRunWt(r.l1, race.no, r.cloth, 0),
    l2: withLastRunWt(r.l2, race.no, r.cloth, 1),
  }));
  const analysed = analyseHandicap({
    code: race.code,
    distM: race.distM,
    runners,
  });
  return {
    ...race,
    runners: runners.map((r: SheetRunner) => ({
      ...r,
      l1: overlayCell(r.l1, analysed.l1[r.cloth]),
      l2: overlayCell(r.l2, analysed.l2[r.cloth]),
      hcp: analysed.hcp[r.cloth] ?? null,
      hcpKg: analysed.hcpKg[r.cloth] ?? null,
    })),
    picks: { ...race.picks, lto: analysed.ltoPicks, hcpRtg: analysed.picks },
  };
}
