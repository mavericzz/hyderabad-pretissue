export type LtoCell = {
  days: number | null;
  card: string;
  pos: number | "###" | null;
  odds: string | null;
  btl: number | null;
  lto: number | "###" | null;
  distM?: number | null;
  rtg?: number | null;
  cls?: string;
  /** Last-run carried kg. When set, PR applies the 1/5th weight-to-time rule. */
  wt?: number | null;
};

export type SheetRunner = {
  cloth: number;
  draw: number;
  name: string;
  filly: boolean;
  trainer: string;
  jockey: string;
  age: string;
  wt: number | null;
  al: string;
  bnc: number | null;
  rtgCh: number | null;
  l2: LtoCell;
  l1: LtoCell;
  nty: number | null;
  open: number | null;
  tissue: string;
  rank: number;
  speed: number | null;
  track: number;
  distDelta: number | null;
  wtDelta: number | null;
  cls: string;
  hcp: number | null;
  hcpKg?: number | null;
  dp: number | null;
  days: number | null;
  tone: "pick" | "risk" | "plain";
};

export type SheetPicks = {
  win: number;
  plc: number;
  upset: number;
  lto: number[];
  hcpRtg: number[];
  speed: number[];
};

export type SheetRace = {
  no: number;
  official: number;
  name: string;
  class: string;
  dist: string;
  distM: number;
  time: string;
  timeCode: string;
  code: string;
  field: number;
  runners: SheetRunner[];
  picks: SheetPicks;
};

export type SheetMeeting = {
  banner: string;
  title: string;
  when: string;
  source: string;
  note: string;
  races: SheetRace[];
};

export function dash(value: number | string | null | undefined, empty = "-"): string {
  if (value === null || value === undefined || value === "") return empty;
  return String(value);
}

export function cardNo(value: string): string {
  return value ? `(${value})` : "-";
}

export function signed(value: number | null | undefined): string {
  if (value === null || value === undefined) return "-";
  if (value > 0) return `+${value}`;
  return String(value);
}

export function odds(value: number | null | undefined): string {
  if (value === null || value === undefined) return "-";
  return value.toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
}

export function ltoTone(value: LtoCell["lto"]): string {
  if (value === "###") return "text-[#c000c0] font-bold";
  if (typeof value !== "number") return "";
  if (value < 0) return "text-[#c00000] font-bold";
  if (value >= 100) return "font-bold text-[#006400]";
  if (value >= 80) return "font-bold";
  return "";
}
