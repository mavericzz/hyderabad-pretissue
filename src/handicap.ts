export type HcpHorse = {
  cloth: number;
  wt: number | null;
  al: string;
  bnc: number | null;
};

export type HcpRace = {
  code: string;
  runners: HcpHorse[];
};

export type RatingParts = {
  last: number | null;
  current: number | null;
  ch: number | null;
};

export type HcpResult = {
  hcp: Record<number, number | null>;
  picks: number[];
  effective: Record<number, number | null>;
};

const KG_PER_POINT = 0.5;

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

function roundHalf(n: number): number {
  return Math.round(n * 2) / 2;
}

function effectiveWt(horse: HcpHorse): number | null {
  if (horse.wt == null) return null;
  return horse.wt - parseClaim(horse.al);
}

function rated(runners: HcpHorse[]): HcpHorse[] {
  return runners.filter((r) => r.bnc != null && r.wt != null);
}

/** kg vs a 0.5kg/point scale after apprentice claim. Negative = well in. */
export function analyseHandicap(race: HcpRace): HcpResult {
  const hcp: Record<number, number | null> = {};
  const effective: Record<number, number | null> = {};
  const kind = raceKind(race.code);

  if (kind === "maiden") {
    for (const r of race.runners) {
      hcp[r.cloth] = 0;
      effective[r.cloth] = r.bnc;
    }
    const picks = rated(race.runners)
      .sort((a, b) => (b.bnc ?? 0) - (a.bnc ?? 0) || a.cloth - b.cloth)
      .slice(0, 4)
      .map((r) => r.cloth);
    return { hcp, picks, effective };
  }

  const marks = rated(race.runners);
  if (!marks.length) {
    for (const r of race.runners) {
      hcp[r.cloth] = null;
      effective[r.cloth] = null;
    }
    return { hcp, picks: [], effective };
  }

  const ref = [...marks].sort((a, b) => (b.bnc ?? 0) - (a.bnc ?? 0) || (b.wt ?? 0) - (a.wt ?? 0))[0];

  for (const r of race.runners) {
    const eff = effectiveWt(r);
    if (r.bnc == null || r.wt == null || eff == null) {
      hcp[r.cloth] = null;
      effective[r.cloth] = null;
      continue;
    }
    const expected = (ref.wt as number) - KG_PER_POINT * ((ref.bnc as number) - r.bnc);
    const kg = roundHalf(eff - expected);
    hcp[r.cloth] = kg;
    effective[r.cloth] = roundHalf(r.bnc - 2 * kg);
  }

  const picks = marks
    .sort((a, b) => {
      const ea = effective[a.cloth] ?? -Infinity;
      const eb = effective[b.cloth] ?? -Infinity;
      return eb - ea || (b.bnc ?? 0) - (a.bnc ?? 0) || a.cloth - b.cloth;
    })
    .slice(0, 4)
    .map((r) => r.cloth);

  return { hcp, picks, effective };
}

export function withHandicap<T extends HcpRace & { picks: { hcpRtg: number[] }; runners: Array<HcpHorse & { hcp: number | null }> }>(
  race: T,
): T {
  const { hcp, picks } = analyseHandicap(race);
  return {
    ...race,
    runners: race.runners.map((r) => ({ ...r, hcp: hcp[r.cloth] ?? null })),
    picks: { ...race.picks, hcpRtg: picks },
  };
}
