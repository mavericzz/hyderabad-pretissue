export type NightCall = "pos" | "neg" | "watch";

export type NightQuote = {
  cloth: number;
  night: number | null;
  morning: number | null;
  opening?: number | null;
  call: NightCall;
};

export const NIGHT_META = {
  banner: "HRC HYDERABAD",
  title: "APPROX EARLIER NIGHT ODDS",
  version: "VERSION -1R",
  when: "19-09-2026 - HYD - 16TH DAY - 6 CARD",
  source: "Night quotes as provided, version 1R. Cloth numbers match the Hyderabad racecard.",
  note: "Green is a positive night call, red is a fade, yellow is a watch. No separate morning card was sent. The Morning column is official SP on the same Indian scale (0.90 = 9/10). Shortened vs night reads positive; drifted reads negative.",
};

export const NIGHT_ODDS: Record<number, NightQuote[]> = {
  1: [
    { cloth: 1, night: 5.5, morning: null, call: "neg" },
    { cloth: 3, night: 0.9, morning: null, call: "pos" },
    { cloth: 8, night: 2.25, morning: null, call: "watch" },
  ],
  2: [
    { cloth: 1, night: 1.0, morning: null, call: "pos" },
    { cloth: 3, night: 2.5, morning: null, call: "pos" },
    { cloth: 4, night: 3.75, morning: null, call: "neg" },
  ],
  3: [
    { cloth: 2, night: 1.2, morning: null, call: "pos" },
    { cloth: 3, night: 4.0, morning: null, call: "neg" },
    { cloth: 4, night: 2.0, morning: null, call: "pos" },
  ],
  4: [
    { cloth: 1, night: 5.0, morning: null, call: "neg" },
    { cloth: 2, night: 0.8, morning: null, call: "pos" },
    { cloth: 4, night: 3.75, morning: null, call: "watch" },
    { cloth: 5, night: 4.0, morning: null, call: "watch" },
  ],
  5: [
    { cloth: 1, night: 2.0, morning: null, call: "pos" },
    { cloth: 2, night: 6.0, morning: null, call: "neg" },
    { cloth: 3, night: 6.0, morning: null, call: "neg" },
    { cloth: 4, night: 1.1, morning: null, call: "watch" },
  ],
  6: [
    { cloth: 1, night: 1.2, morning: null, call: "pos" },
    { cloth: 2, night: 7.0, morning: null, call: "neg" },
    { cloth: 4, night: 3.25, morning: null, call: "watch" },
    { cloth: 5, night: 3.5, morning: null, call: "pos" },
  ],
};

export const GRID_CLOTHS = [1, 2, 3, 4, 5, 8];

export function fmtOdds(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return "-";
  return value.toFixed(2);
}

export function quoteFor(raceNo: number, cloth: number): NightQuote | undefined {
  return NIGHT_ODDS[raceNo]?.find((q) => q.cloth === cloth);
}

export function priceMove(from: number | null | undefined, to: number | null | undefined, pending: string) {
  if (from == null || to == null || !from) {
    return { status: "pending" as const, label: pending, pct: null };
  }
  const pct = (from - to) / from;
  if (pct > 0.03) return { status: "positive" as const, label: "shortened", pct };
  if (pct < -0.03) return { status: "negative" as const, label: "drifted", pct };
  return { status: "steady" as const, label: "steady", pct };
}

export function morningMove(night: number | null, morning: number | null) {
  return priceMove(night, morning, "awaiting morning");
}

export function openingMove(prior: number | null, opening: number | null) {
  return priceMove(prior, opening, "awaiting opening");
}

export function callLabel(call: NightCall): string {
  if (call === "pos") return "positive";
  if (call === "neg") return "negative";
  return "watch";
}
