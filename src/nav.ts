import { races } from "./data.ts";
import type { Race } from "./data.ts";

export type View = "night" | "sheet" | "guide";
export type CenterId = string;

export type Location = {
  date: string;
  center: CenterId;
  view: View;
  race: number | null;
  cloth: number | null;
};

export const DEFAULT_LOCATION: Location = {
  date: "2026-09-19",
  center: "hyd",
  view: "night",
  race: null,
  cloth: null,
};

const DATE_RE = /^(\d{4}-\d{2}-\d{2})$/;

export function horseId(race: number, cloth: number): string {
  return `r${race}-h${cloth}`;
}

function isHyd19(loc: Pick<Location, "date" | "center">): boolean {
  return loc.date === "2026-09-19" && loc.center === "hyd";
}

function centerOf(raw: string): CenterId {
  const code = raw.toLowerCase();
  return /^[a-z]{3}$/.test(code) ? code : "hyd";
}

export function completeLocation(patch: Partial<Location>): Location {
  const current = typeof window === "undefined" ? DEFAULT_LOCATION : parseHash(window.location.hash);
  return { ...current, ...patch };
}

export function formatHash(loc: Location): string {
  const tail = loc.race && loc.cloth ? `/${horseId(loc.race, loc.cloth)}` : loc.race ? `/r${loc.race}` : "";
  if (isHyd19(loc)) {
    if (loc.race && loc.cloth) return `#${loc.view}/${horseId(loc.race, loc.cloth)}`;
    if (loc.race) return `#${loc.view}/r${loc.race}`;
    return `#${loc.view}`;
  }
  return `#${loc.date}/${loc.center}/${loc.view}${tail}`;
}

function viewOf(raw: string): View {
  if (raw === "sheet" || raw === "lto") return "sheet";
  if (raw === "guide" || raw === "pretissue") return "guide";
  return "night";
}

function parseRest(view: View, rest: string, base: Pick<Location, "date" | "center">): Location {
  const full = rest.match(/^r(\d+)-h(\d+)$/i);
  if (full) return { ...base, view, race: Number(full[1]), cloth: Number(full[2]) };
  const race = rest.match(/^r(\d+)$/i);
  if (race) return { ...base, view, race: Number(race[1]), cloth: null };
  return { ...base, view, race: null, cloth: null };
}

export function parseHash(hash: string): Location {
  const raw = hash.replace(/^#/, "").trim();
  if (!raw) return { ...DEFAULT_LOCATION };

  const dated = raw.match(/^(\d{4}-\d{2}-\d{2})\/([a-z]{3})(?:\/(.*))?$/i);
  if (dated) {
    const date = dated[1];
    const center = centerOf(dated[2]);
    const restRaw = dated[3] ?? "";
    const parts = restRaw.split("/").filter(Boolean);
    const view = parts[0] ? viewOf(parts[0]) : "sheet";
    return parseRest(view, parts[1] ?? "", { date, center });
  }

  const lto = raw.match(/^lto-(\d+)$/i);
  if (lto) return { ...DEFAULT_LOCATION, view: "sheet", race: Number(lto[1]), cloth: null };

  const raceOnly = raw.match(/^race-(\d+)$/i);
  if (raceOnly) return { ...DEFAULT_LOCATION, view: "guide", race: Number(raceOnly[1]), cloth: null };

  if (raw === "card") return { ...DEFAULT_LOCATION, view: "guide", race: null, cloth: null };

  const parts = raw.split("/");
  const maybeDate = parts[0] ?? "";
  if (DATE_RE.test(maybeDate) && parts[1]) {
    const center = centerOf(parts[1]);
    const view = parts[2] ? viewOf(parts[2]) : "sheet";
    return parseRest(view, parts[3] ?? "", { date: maybeDate, center });
  }

  const view = viewOf(parts[0] ?? "night");
  return parseRest(view, parts[1] ?? "", { date: DEFAULT_LOCATION.date, center: DEFAULT_LOCATION.center });
}

export function targetId(loc: Location): string {
  if (loc.view === "sheet") {
    if (loc.race && loc.cloth) return `lto-${loc.race}-h${loc.cloth}`;
    if (loc.race) return `lto-${loc.race}`;
  }
  if (loc.view === "guide") {
    if (loc.race && loc.cloth) return `race-${loc.race}-h${loc.cloth}`;
    if (loc.race) return `race-${loc.race}`;
    return "card";
  }
  if (loc.race && loc.cloth) return `night-${loc.race}-h${loc.cloth}`;
  if (loc.race) return `night-${loc.race}`;
  return "";
}

export function isFocus(loc: Location, race: number, cloth?: number): boolean {
  if (loc.race !== race) return false;
  if (cloth == null) return true;
  return loc.cloth === cloth;
}

export function findByName(name: string, list: Race[] = races): { race: number; cloth: number } | null {
  const needle = name.trim().toUpperCase();
  for (const race of list) {
    const runner = race.runners.find((item) => item.name.toUpperCase() === needle);
    if (runner) return { race: race.no, cloth: runner.cloth };
  }
  return null;
}

export function go(patch: Partial<Location>): void {
  const loc: Location = { ...parseHash(typeof window === "undefined" ? "" : window.location.hash), ...patch };
  const hash = formatHash(loc);
  if (typeof window === "undefined") return;
  if (window.location.hash === hash) {
    scrollToLocation(loc);
    return;
  }
  window.location.hash = hash;
}

export function scrollToLocation(loc: Location): void {
  const exact = targetId(loc);
  const exactEl = exact ? document.getElementById(exact) : null;
  if (exactEl) {
    exactEl.scrollIntoView({ block: "center", behavior: "smooth" });
    return;
  }
  const raceId = targetId({ ...loc, cloth: null });
  document.getElementById(raceId)?.scrollIntoView({ block: "center", behavior: "smooth" });
}
