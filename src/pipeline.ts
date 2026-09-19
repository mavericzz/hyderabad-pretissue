import { analyseHandicap, parseClaim, parseRating, type HcpHorse } from "./handicap.ts";
import type { FormRun, MeetingInfo, Race, Runner, Work } from "./data.ts";
import type { LtoCell, SheetMeeting, SheetRace, SheetRunner } from "./lto.ts";
import type { NightCall, NightQuote } from "./oddsBook.ts";
import type { CenterId } from "./nav.ts";

export type VenueInfo = {
  id?: number;
  code: CenterId;
  label: string;
  short: string;
  banner: string;
};

export type ScrapedRun = {
  date: string;
  dateLabel: string;
  venue: string;
  distM: number;
  cls: string;
  pos: number | null;
  field: string;
  beaten: number | null;
  wt: number | null;
  odds: string;
  winner: string;
  card: string;
  rtg: number | null;
  timeS: number | null;
};

export type ScrapedWork = {
  date: string;
  venue: string;
  clock: string;
  note: string;
};

export type ScrapedRunner = {
  cloth: number;
  draw: number;
  name: string;
  age: string;
  pedigree: string;
  trainer: string;
  jockey: string;
  wt: string;
  al: string;
  shoes: "A" | "S";
  eq: string;
  rtg: string;
  last5: string;
  form: ScrapedRun[];
  work: ScrapedWork[];
};

export type ScrapedRace = {
  no: number;
  official: number;
  name: string;
  class: string;
  dist: string;
  distM: number;
  time: string;
  purse: string;
  record: string;
  irPick: string;
  runners: ScrapedRunner[];
};

export type ScrapedNight = {
  cloth: number;
  name: string;
  night: number | null;
  morning: number | null;
  opening: number | null;
};

export type ScrapedMeeting = {
  date: string;
  venue: VenueInfo;
  races: ScrapedRace[];
  irDayBest: string;
  night: Record<number, ScrapedNight[]>;
};

export type BuiltNight = {
  banner: string;
  title: string;
  version: string;
  when: string;
  source: string;
  note: string;
  odds: Record<number, NightQuote[]>;
  gridCloths: number[];
};

export type BuiltMeeting = {
  id: string;
  date: string;
  dateTab: string;
  center: CenterId;
  centerLabel: string;
  short: string;
  hasNight: boolean;
  meta: MeetingInfo;
  races: Race[];
  sheet: SheetMeeting;
  night?: BuiltNight;
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const VENUE_BY_NAME: Record<string, VenueInfo> = {
  KOLKATA: { id: 1, code: "kol", label: "Kolkata", short: "KOL", banner: "RCTC KOLKATA" },
  CALCUTTA: { id: 1, code: "kol", label: "Kolkata", short: "KOL", banner: "RCTC KOLKATA" },
  MUMBAI: { id: 2, code: "mum", label: "Mumbai", short: "MUM", banner: "RWITC MUMBAI" },
  BANGALORE: { id: 3, code: "ban", label: "Bangalore", short: "BAN", banner: "BTC BANGALORE" },
  BENGALURU: { id: 3, code: "ban", label: "Bangalore", short: "BAN", banner: "BTC BANGALORE" },
  DELHI: { id: 7, code: "del", label: "Delhi", short: "DEL", banner: "DRC DELHI" },
  MYSORE: { id: 8, code: "mys", label: "Mysore", short: "MYS", banner: "MTC MYSORE" },
  MYSURU: { id: 8, code: "mys", label: "Mysore", short: "MYS", banner: "MTC MYSORE" },
  PUNE: { id: 10, code: "pun", label: "Pune", short: "PUN", banner: "RWITC PUNE" },
  HYDERABAD: { id: 11, code: "hyd", label: "Hyderabad", short: "HYD", banner: "HRC HYDERABAD" },
  CHENNAI: { code: "che", label: "Chennai", short: "CHE", banner: "MRC CHENNAI" },
  MADRAS: { code: "che", label: "Chennai", short: "CHE", banner: "MRC CHENNAI" },
  OOTY: { code: "oot", label: "Ooty", short: "OOT", banner: "OTC OOTY" },
};

export const VENUE_BY_ID: Record<number, VenueInfo> = {
  1: VENUE_BY_NAME.KOLKATA,
  2: VENUE_BY_NAME.MUMBAI,
  3: VENUE_BY_NAME.BANGALORE,
  7: VENUE_BY_NAME.DELHI,
  8: VENUE_BY_NAME.MYSORE,
  10: VENUE_BY_NAME.PUNE,
  11: VENUE_BY_NAME.HYDERABAD,
};

const SHEET_NOTE =
  "BNC RTG is the last published official mark. LTO and HCP use the Indian kg scale: 2 rating points = 1 kg, 1 length ≈ 0.17s, and 1 length = 1 kg at 1200m (scale factor = dist/1200). A beaten horse is mark-ran-off minus that kg-behind times 2. Last-run kg vs the class average (55 kg, or 53 kg in Class 5) is also scaled by dist/1200; maidens skip that so 56 vs 54.5 set-weights are not mixed in. HCP is that last-start figure plus 2 points per kg apprentice claim. Official allotted kg is Base + (Rating − topweight Rating)/2, capped 47–62 kg. Green HCP is well-in versus that allotted weight, red is well-out. First starters and runs beaten 20L+ show ###. Speed RTG is last winning time plus beaten lengths, per 200m (lower is faster). Tissue is a 120% book, not official odds.";

export function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

export function parseLength(raw: string | null | undefined): number | null {
  const text = String(raw ?? "").trim().toLowerCase();
  if (!text || text === "-" || text === "w" || text === "won") return 0;
  if (text === "dnf" || text === "dist" || text === "distanced") return 20;
  if (text === "nose" || text === "ns") return 0.05;
  if (text === "shd" || text === "short head" || text === "s.h") return 0.1;
  if (text === "hd" || text === "head") return 0.2;
  if (text === "nk" || text === "neck") return 0.3;
  if (text === "lnk" || text === "link") return 0.3;
  const mixed = text.match(/^(\d+)\s+(\d+)\s*\/\s*(\d+)/);
  if (mixed) return Number(mixed[1]) + Number(mixed[2]) / Number(mixed[3]);
  const frac = text.match(/^(\d+)\s*\/\s*(\d+)/);
  if (frac) return Number(frac[1]) / Number(frac[2]);
  const num = text.match(/(\d+(?:\.\d+)?)/);
  return num ? Number(num[1]) : null;
}

export function parseResultCell(raw: string): { pos: number | null; field: string } {
  const nums = String(raw ?? "").match(/\d+/g)?.map(Number) ?? [];
  if (nums.length >= 2) return { field: String(nums[0]), pos: nums[1] };
  if (nums.length === 1) return { field: "", pos: nums[0] };
  return { pos: null, field: "" };
}

export function parseClock(raw: string | null | undefined): number | null {
  const text = String(raw ?? "").trim();
  if (!text) return null;
  const parts = text.split(/[:.]/).map((part) => part.replace(/\D/g, "")).filter(Boolean);
  if (parts.length === 3) {
    const [m, s, cs] = parts.map(Number);
    return m * 60 + s + cs / 100;
  }
  if (parts.length === 2) {
    const [m, s] = parts.map(Number);
    return m * 60 + s;
  }
  const n = Number.parseFloat(text);
  return Number.isFinite(n) ? n : null;
}

export function parseOddsToOne(raw: string | null | undefined): number | null {
  const text = String(raw ?? "").trim();
  if (!text || text === "-" || text === "n/s") return null;
  const frac = text.match(/^(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/);
  if (frac) {
    const den = Number(frac[2]);
    if (!den) return null;
    return Number(frac[1]) / den;
  }
  const n = Number.parseFloat(text);
  return Number.isFinite(n) ? n : null;
}

export function toFraction(oddsToOne: number): string {
  if (!Number.isFinite(oddsToOne) || oddsToOne >= 24) return "24/1";
  if (oddsToOne <= 0.05) return "1/20";
  let best = { n: Math.max(1, Math.round(oddsToOne)), d: 1, err: Math.abs(oddsToOne - Math.max(1, Math.round(oddsToOne))) };
  for (const d of [1, 2, 4, 5, 8, 10]) {
    const n = Math.max(1, Math.round(oddsToOne * d));
    const err = Math.abs(oddsToOne - n / d);
    if (err < best.err - 1e-9 || (Math.abs(err - best.err) < 1e-9 && d <= best.d)) best = { n, d, err };
  }
  const g = gcd(best.n, best.d);
  return `${best.n / g}/${best.d / g}`;
}

export function tissueBook(scores: { cloth: number; hcp: number | null }[], overround = 1.2): Record<number, string> {
  const usable = scores.filter((row) => row.hcp != null);
  const out: Record<number, string> = {};
  for (const row of scores) out[row.cloth] = "24/1";
  if (!usable.length) return out;
  const max = Math.max(...usable.map((row) => row.hcp as number));
  const weights = usable.map((row) => ({
    cloth: row.cloth,
    w: Math.exp(((row.hcp as number) - max) / 10),
  }));
  const total = weights.reduce((sum, row) => sum + row.w, 0) || 1;
  for (const row of weights) {
    const p = Math.min(0.8, Math.max(0.04, (row.w / total) * overround));
    out[row.cloth] = toFraction(1 / p - 1);
  }
  return out;
}

export function isoFromParts(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function parseIsoDate(raw: string): string | null {
  const dmy = raw.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (dmy) return isoFromParts(Number(dmy[3]), Number(dmy[2]), Number(dmy[1]));
  const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) return iso[0];
  const named = raw.match(/^(\d{1,2})\s+([A-Za-z]{3,})(?:[a-z]*)\s+(\d{2,4})$/);
  if (named) {
    const month = MONTHS.findIndex((item) => named[2].slice(0, 3).toLowerCase() === item.toLowerCase());
    if (month >= 0) {
      const year = named[3].length === 2 ? 2000 + Number(named[3]) : Number(named[3]);
      return isoFromParts(year, month + 1, Number(named[1]));
    }
  }
  return null;
}

export function formatDateLabel(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return `${String(day).padStart(2, "0")} ${MONTHS[month - 1]} ${String(year).slice(2)}`;
}

export function dateTab(iso: string): string {
  const [, month, day] = iso.split("-").map(Number);
  return `${day} ${MONTHS[month - 1]}`;
}

export function weekdayLong(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-GB", {
    weekday: "long",
    timeZone: "UTC",
  });
}

export function daysBetween(fromIso: string, toIso: string): number {
  const a = Date.parse(`${fromIso}T00:00:00Z`);
  const b = Date.parse(`${toIso}T00:00:00Z`);
  return Math.round((b - a) / 86400000);
}

export function addDaysIso(iso: string, days: number): string {
  const [year, month, day] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(year, month - 1, day + days));
  return isoFromParts(dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate());
}

export function istToday(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const pick = (type: string) => parts.find((part) => part.type === type)?.value ?? "01";
  return `${pick("year")}-${pick("month")}-${pick("day")}`;
}

export function labelForCenter(code: string): string {
  return Object.values(VENUE_BY_NAME).find((item) => item.code === code)?.label ?? code.toUpperCase();
}

export function venueFromName(raw: string, id?: number): VenueInfo {
  const key = raw.trim().toUpperCase();
  if (VENUE_BY_NAME[key]) return { ...VENUE_BY_NAME[key], id: id ?? VENUE_BY_NAME[key].id };
  if (id != null && VENUE_BY_ID[id]) return VENUE_BY_ID[id];
  const code = key.replace(/[^A-Z]/g, "").slice(0, 3).toLowerCase() || "unk";
  const label = raw.trim().replace(/\w\S*/g, (word) => word[0].toUpperCase() + word.slice(1).toLowerCase());
  return { id, code, label, short: code.toUpperCase(), banner: `${code.toUpperCase()} ${label.toUpperCase()}` };
}

export function parseDistM(raw: string): number {
  const n = Number.parseInt(String(raw).replace(/[^\d]/g, ""), 10);
  return Number.isFinite(n) ? n : 0;
}

export function raceCode(distM: number, cls: string): string {
  const dm = Math.max(1, Math.round(distM / 100));
  const text = cls.toLowerCase();
  let tag = "C4";
  if (text.includes("maiden") || text.includes("mdn")) tag = "MDN";
  else if (text.includes("gr.1") || text.includes("g1")) tag = "G1";
  else if (text.includes("gr.2") || text.includes("g2")) tag = "G2";
  else if (text.includes("gr.3") || text.includes("g3")) tag = "G3";
  else if (text.includes("term") || text.includes("wfa")) tag = "TRM";
  else if (text.includes("class 5") || text.includes("c5")) tag = "C5";
  else if (text.includes("class 1") || text.includes("c1")) tag = "C1";
  else if (text.includes("class 2") || text.includes("c2")) tag = "C2";
  else if (text.includes("class 3") || text.includes("c3")) tag = "C3";
  else if (text.includes("class 4") || text.includes("c4")) tag = "C4";
  const div = text.includes("div-1") || text.includes("div 1") ? "D1" : text.includes("div-2") || text.includes("div 2") ? "D2" : "";
  return `${dm}m${tag}${div}`;
}

export function timeCode(time: string): string {
  const m = time.match(/(\d{1,2}):(\d{2})/);
  return m ? `${Number(m[1])}.${m[2]}` : time;
}

export function isFilly(age: string): boolean {
  return /\b([fm]|filly|mare)\b/i.test(age);
}

export function emptyCell(): LtoCell {
  return { days: null, card: "", pos: "###", odds: null, btl: null, lto: "###" };
}

function runToCell(run: ScrapedRun | undefined, meetingDate: string): LtoCell {
  if (!run || run.pos == null) return emptyCell();
  return {
    days: daysBetween(run.date, meetingDate),
    card: run.card,
    pos: run.pos,
    odds: run.odds || null,
    btl: run.beaten,
    lto: null,
    distM: run.distM,
    rtg: run.rtg,
    cls: run.cls,
    wt: run.wt,
  };
}

function speedFig(run: ScrapedRun | undefined): number | null {
  if (!run?.timeS || !run.distM) return null;
  const beaten = run.pos === 1 ? 0 : (run.beaten ?? 0);
  const adj = run.timeS + beaten * 0.17;
  return Math.round((adj / (run.distM / 200)) * 100) / 100;
}

function trackScore(form: ScrapedRun[], venueShort: string): number {
  if (!form.length) return 40;
  const same = form.filter((run) => run.venue.toUpperCase() === venueShort).length;
  if (form[0]?.venue.toUpperCase() === venueShort) return 85;
  if (same) return 70;
  return 50;
}

function nightCall(quotes: NightQuote[], cloth: number): NightCall {
  const priced = [...quotes].sort(
    (a, b) => (a.night ?? a.morning ?? a.opening ?? 99) - (b.night ?? b.morning ?? b.opening ?? 99),
  );
  const i = priced.findIndex((row) => row.cloth === cloth);
  if (i === 0 || i === 1) return "pos";
  if (i >= priced.length - 2) return "neg";
  return "watch";
}

export function buildMeeting(scraped: ScrapedMeeting, scrapedOn = istToday()): BuiltMeeting {
  const { date, venue } = scraped;
  const sheetRaces: SheetRace[] = [];
  const races: Race[] = [];
  const hcpLeaders: { race: number; cloth: number; name: string; hcp: number; rank: number }[] = [];

  for (const race of scraped.races) {
    const code = raceCode(race.distM, race.class);
    const draft: SheetRunner[] = race.runners.map((runner) => {
      const rating = parseRating(runner.rtg);
      const last = runner.form[0];
      const prev = runner.form[1];
      const wt = Number.parseFloat(runner.wt) || null;
      const lastWt = last?.wt ?? null;
      return {
        cloth: runner.cloth,
        draw: runner.draw,
        name: runner.name,
        filly: isFilly(runner.age),
        trainer: runner.trainer,
        jockey: runner.jockey,
        age: runner.age,
        wt,
        al: runner.al,
        bnc: rating.current,
        rtgCh: rating.ch,
        l2: runToCell(prev, date),
        l1: runToCell(last, date),
        nty: scraped.night[race.no]?.find((row) => row.cloth === runner.cloth)?.night ?? null,
        open: scraped.night[race.no]?.find((row) => row.cloth === runner.cloth)?.opening ?? null,
        tissue: "24/1",
        rank: 99,
        speed: speedFig(last),
        track: trackScore(runner.form, venue.short),
        distDelta: last?.distM ? last.distM - race.distM : null,
        wtDelta: wt != null && lastWt != null ? Math.round((wt - lastWt) * 10) / 10 : null,
        cls: last?.cls ?? (race.class.includes("Maiden") ? "Maiden" : race.class.split("/")[0].trim()),
        hcp: null,
        dp: last ? Math.round(daysBetween(last.date, date) / 7) : null,
        days: last ? daysBetween(last.date, date) : null,
        tone: "plain",
      };
    });

    const analysed = analyseHandicap({
      code,
      distM: race.distM,
      runners: draft.map(
        (runner): HcpHorse => ({
          cloth: runner.cloth,
          wt: runner.wt,
          al: runner.al,
          bnc: runner.bnc,
          l1: runner.l1,
          l2: runner.l2,
        }),
      ),
    });

    for (const runner of draft) {
      runner.hcp = analysed.hcp[runner.cloth] ?? null;
      runner.hcpKg = analysed.hcpKg[runner.cloth] ?? null;
      if (typeof analysed.l1[runner.cloth] !== "undefined") runner.l1 = { ...runner.l1, lto: analysed.l1[runner.cloth] };
      if (typeof analysed.l2[runner.cloth] !== "undefined") runner.l2 = { ...runner.l2, lto: analysed.l2[runner.cloth] };
    }

    const ranked = [...draft].sort(
      (a, b) => (b.hcp ?? -Infinity) - (a.hcp ?? -Infinity) || a.cloth - b.cloth,
    );
    ranked.forEach((runner, index) => {
      runner.rank = index + 1;
    });
    const tissues = tissueBook(draft.map((runner) => ({ cloth: runner.cloth, hcp: runner.hcp })));
    const win = ranked[0]?.cloth ?? 1;
    const plc = ranked[1]?.cloth ?? win;
    const upset = ranked[2]?.cloth ?? plc;
    for (const runner of draft) {
      runner.tissue = tissues[runner.cloth] ?? "24/1";
      runner.tone = runner.cloth === win || runner.cloth === plc || runner.cloth === upset ? "pick" : (runner.days ?? 0) >= 90 ? "risk" : "plain";
    }

    const winRunner = draft.find((runner) => runner.cloth === win);
    if (winRunner?.hcp != null) {
      hcpLeaders.push({ race: race.no, cloth: win, name: winRunner.name, hcp: winRunner.hcp, rank: 1 });
    }

    const speedPicks = [...draft]
      .filter((runner) => runner.speed != null)
      .sort((a, b) => (a.speed ?? Infinity) - (b.speed ?? Infinity) || a.cloth - b.cloth)
      .slice(0, 4)
      .map((runner) => runner.cloth);
    const picks = { win, plc, upset, lto: analysed.ltoPicks, hcpRtg: analysed.picks, speed: speedPicks };
    sheetRaces.push({
      no: race.no,
      official: race.official,
      name: race.name,
      class: race.class,
      dist: race.dist,
      distM: race.distM,
      time: race.time,
      timeCode: timeCode(race.time),
      code,
      field: race.runners.length,
      runners: draft,
      picks,
    });

    races.push({
      no: race.no,
      official: race.official,
      name: race.name,
      class: race.class,
      dist: race.dist,
      time: race.time,
      purse: race.purse,
      record: race.record,
      shape: `${race.runners.length}-runner. ${race.class}`,
      similarRace: `IndiaRace: ${race.irPick || "unpublished"}. This sheet uses last-start PR on the Indian kg scale (1L = 1 kg at 1200m) plus claim and well-in vs allotted weight.`,
      tissueNote: `120% book from HCP ranks. Win ${winRunner?.name ?? ""} (${win}).`,
      irPick: race.irPick || "unpublished",
      ourPick: winRunner ? `${winRunner.name} (${win})` : "",
      nap: false,
      runners: race.runners.map((runner) => {
        const sheet = draft.find((item) => item.cloth === runner.cloth)!;
        const last = runner.form[0];
        const nearest = runner.form.find((run) => Math.abs(run.distM - race.distM) <= 200) ?? last;
        const claim = parseClaim(runner.al);
        const verdictBits = last
          ? [
              `Last: ${last.dateLabel} ${last.venue} ${last.distM}M ${last.pos}/${last.field || "?"} beaten ${last.pos === 1 ? "won" : last.beaten ?? "?"} at ${last.odds || "?"} off ${last.rtg ?? "?"}, ${last.wt ?? "?"}kg.`,
              `${sheet.days ?? "?"} days out.`,
              claim ? `${claim}kg claim.` : "",
              sheet.hcp != null ? `HCP ${sheet.hcp}.` : "",
              runner.work[0] ? `Latest work ${runner.work[0].date} ${runner.work[0].venue}: ${runner.work[0].note}` : "",
            ]
          : ["No published form. First starter or unraced on the IndiaRace card.", sheet.hcp != null ? `HCP ${sheet.hcp}.` : ""];
        const similar = nearest
          ? `Nearest trip: ${nearest.dateLabel} ${nearest.venue} ${nearest.distM}M ${nearest.cls}, ${nearest.pos}/${nearest.field || "?"} beaten ${nearest.beaten ?? "?"} vs ${nearest.winner}.`
          : "No race form.";
        const form: FormRun[] = runner.form.slice(0, 4).map((run) => ({
          date: run.dateLabel,
          venue: run.venue,
          dist: `${run.distM}m`,
          cls: run.cls,
          pos: run.pos == null ? "-" : String(run.pos),
          field: run.field,
          beaten: run.pos === 1 ? "won" : run.beaten == null ? "-" : `${run.beaten}L`.replace(/L$/, "L"),
          wt: run.wt == null ? "" : String(run.wt),
          odds: run.odds,
          winner: run.winner,
        }));
        const work: Work[] = runner.work.slice(0, 4);
        const built: Runner = {
          cloth: runner.cloth,
          draw: runner.draw,
          name: runner.name,
          age: runner.age,
          pedigree: runner.pedigree,
          trainer: runner.trainer,
          jockey: runner.jockey,
          wt: runner.wt,
          al: runner.al,
          shoes: runner.shoes,
          eq: runner.eq,
          rtg: runner.rtg,
          last5: runner.last5,
          tissue: sheet.tissue,
          rank: sheet.rank,
          verdict: verdictBits.filter(Boolean).join(" "),
          similar,
          form,
          work,
        };
        return built;
      }),
    });
  }

  hcpLeaders.sort((a, b) => b.hcp - a.hcp || a.race - b.race);
  const maxHcp = hcpLeaders[0]?.hcp ?? 0;
  const featureBest = hcpLeaders.find((row) => {
    if (row.hcp < maxHcp - 2) return false;
    const race = scraped.races.find((item) => item.no === row.race);
    return /gr\.[123]|st\.?\s*leger|derby|guineas|gold cup|memorial/i.test(`${race?.name ?? ""} ${race?.class ?? ""}`);
  });
  const dayBest = featureBest ?? hcpLeaders[0];
  const nextBest = hcpLeaders.find((row) => row.name !== dayBest?.name);
  const longshot =
    [...sheetRaces.flatMap((race) => race.runners.map((runner) => ({ race: race.no, runner })))]
      .filter((row) => row.runner.rank >= 3 && row.runner.hcp != null)
      .sort((a, b) => (b.runner.hcp ?? 0) - (a.runner.hcp ?? 0))[0] ?? null;
  if (dayBest) {
    const napRace = races.find((race) => race.no === dayBest.race);
    if (napRace) napRace.nap = true;
  }

  const feature =
    scraped.races.find((race) => /gr\.[123]|st\.?\s*leger|derby|guineas|gold cup/i.test(`${race.name} ${race.class}`))?.name ??
    scraped.races.slice().sort((a, b) => b.distM - a.distM)[0]?.name;

  const when = `${date.slice(8, 10)}-${date.slice(5, 7)}-${date.slice(0, 4)} - ${venue.short} - ${weekdayLong(date).toUpperCase()} - ${scraped.races.length} CARD`;
  const nightOdds: Record<number, NightQuote[]> = {};
  const grid = new Set<number>();
  for (const [raceNo, rows] of Object.entries(scraped.night)) {
    const quotes: NightQuote[] = rows
      .filter((row) => row.night != null || row.morning != null || row.opening != null)
      .map((row) => ({
        cloth: row.cloth,
        night: row.night,
        morning: row.morning,
        opening: row.opening,
        call: "watch" as NightCall,
      }));
    for (const quote of quotes) quote.call = nightCall(quotes, quote.cloth);
    if (quotes.length) {
      nightOdds[Number(raceNo)] = quotes;
      quotes.forEach((quote) => grid.add(quote.cloth));
    }
  }
  const hasNight = Object.values(nightOdds).some((rows) => rows.length > 0);

  return {
    id: `${venue.code}-${date}`,
    date,
    dateTab: dateTab(date),
    center: venue.code,
    centerLabel: venue.label,
    short: venue.short,
    hasNight,
    meta: {
      venue: `${venue.banner.replace(/^[A-Z]+ /, "")} (${venue.short})`,
      date: `${weekdayLong(date)} ${Number(date.slice(8, 10))} ${MONTHS_LONG[Number(date.slice(5, 7)) - 1]} ${date.slice(0, 4)}`,
      first: scraped.races[0]?.time ?? "",
      source: `IndiaRace racecard, previous runs with track, and published trackwork as of ${formatDateLabel(scrapedOn)}.`,
      going: `${venue.label} turf. Auto-built from the IndiaRace card; going is not independently verified.`,
      dayBest: dayBest?.name ?? "",
      dayBestRace: dayBest?.race ?? 1,
      nextBest: nextBest?.name ?? "",
      longshot: longshot?.runner.name ?? "",
      irDayBest: scraped.irDayBest || "unpublished",
      feature,
    },
    races,
    sheet: {
      banner: venue.banner,
      title: "HANDICAP ANALYSIS & FORM RATING (LTO)",
      when,
      source: `IndiaRace racecard, previous runs with track, and published trackwork as of ${formatDateLabel(scrapedOn)}.`,
      note: SHEET_NOTE,
      races: sheetRaces,
    },
    night: hasNight
      ? {
          banner: venue.banner,
          title: "NIGHT / MORNING / OPENING ODDS",
          version: "AUTO",
          when,
          source: "IndiaRace odds page: Night Odds, Morning Odds and Opening Odds, converted to the same to-1 scale.",
          note: "Green is a positive night call (two shortest), red is a fade (two longest), yellow is a watch. Morning and opening fill when IndiaRace posts them. After the race, Morning falls back to official SP.",
          odds: nightOdds,
          gridCloths: [...grid].sort((a, b) => a - b),
        }
      : undefined,
  };
}

export function meetingFileName(meeting: Pick<BuiltMeeting, "center" | "date">): string {
  return `${meeting.center}_${meeting.date.replace(/-/g, "_")}.ts`;
}

export const LOCKED_MEETING_IDS = new Set(["hyd-2026-09-19"]);
