import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  addDaysIso,
  buildMeeting,
  istToday,
  LOCKED_MEETING_IDS,
  meetingFileName,
  VENUE_BY_ID,
  type BuiltMeeting,
} from "../../src/pipeline.ts";
import {
  attachForm,
  parseDayBest,
  parseHomepageFixtures,
  parseOddsTables,
  parsePreviousRuns,
  parseRaceIds,
  parseRacecard,
  parseTrackwork,
  scrapedMeetingOf,
  type Fixture,
} from "../../src/scrapeHtml.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const MEETINGS_DIR = path.join(ROOT, "src/meetings");
const CACHE_DIR = path.join(ROOT, ".cache/indiarace");
const BASE = "https://www.indiarace.com";
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) IndiaRaceDaily/1.0";
const PROBE_IDS = Object.keys(VENUE_BY_ID).map(Number);

type Args = {
  from: string;
  days: number;
  delayMs: number;
  fresh: boolean;
};

function parseArgs(argv: string[]): Args {
  const today = istToday();
  const args: Args = { from: today, days: 3, delayMs: 250, fresh: false };
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i];
    const val = argv[i + 1];
    if (key === "--from" && val) args.from = val;
    if (key === "--days" && val) args.days = Number(val);
    if (key === "--delay" && val) args.delayMs = Number(val);
    if (key === "--fresh") args.fresh = true;
  }
  return args;
}

function cacheTtlMs(url: string): number {
  if (/race_type=ODDS/i.test(url) || /indiarace\.com\/?$/i.test(url)) return 8 * 60 * 1000;
  if (/race_type=RACECARD|race_type=SELECTIONS/i.test(url)) return 2 * 60 * 60 * 1000;
  return 12 * 60 * 60 * 1000;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchText(url: string, delayMs: number, fresh: boolean): Promise<string> {
  const key = url.replace(/[^\w.-]+/g, "_").slice(0, 180);
  const cachePath = path.join(CACHE_DIR, `${key}.html`);
  if (!fresh) {
    try {
      const info = await stat(cachePath);
      const cached = await readFile(cachePath, "utf8");
      if (cached.length > 500 && Date.now() - info.mtimeMs < cacheTtlMs(url)) return cached;
    } catch {
      // network fetch below
    }
  }
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "text/html" } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const html = await res.text();
  await mkdir(CACHE_DIR, { recursive: true });
  await writeFile(cachePath, html);
  await sleep(delayMs);
  return html;
}

function datesOn(from: string, days: number): string[] {
  return Array.from({ length: days }, (_, i) => addDaysIso(from, i));
}

function mergeFixtures(home: Fixture[], window: string[]): Fixture[] {
  const wanted = new Set(window);
  const seen = new Set<string>();
  const out: Fixture[] = [];
  const add = (item: Fixture) => {
    const key = `${item.date}:${item.venueId}`;
    if (!wanted.has(item.date) || seen.has(key)) return;
    seen.add(key);
    out.push(item);
  };
  home.forEach(add);
  for (const date of window) {
    for (const venueId of PROBE_IDS) add({ date, venueId });
  }
  return out;
}

function tsModule(meeting: BuiltMeeting): string {
  const night = meeting.night
    ? `\nexport const NIGHT = ${JSON.stringify(meeting.night, null, 2)};\n`
    : `\nexport const NIGHT = null;\n`;
  return `import type { Race } from "../data.ts";
import type { SheetMeeting } from "../lto.ts";

export const MEETING = ${JSON.stringify(meeting.meta, null, 2)};

export const races: Race[] = ${JSON.stringify(meeting.races, null, 2)};

export const SHEET: SheetMeeting = ${JSON.stringify(meeting.sheet, null, 2)};
${night}`;
}

function catalogModule(files: { id: string; file: string; varName: string }[]): string {
  const imports = files
    .map(
      (item) =>
        `import { MEETING as ${item.varName}Meta, races as ${item.varName}Races, SHEET as ${item.varName}Sheet, NIGHT as ${item.varName}Night } from "./${item.file}";`,
    )
    .join("\n");
  const entries = files
    .map((item) => {
      const center = item.id.slice(0, 3);
      const date = item.id.slice(4);
      return `  {
    id: ${JSON.stringify(item.id)},
    date: ${JSON.stringify(date)},
    dateTab: dateTab(${JSON.stringify(date)}),
    center: ${JSON.stringify(center)},
    centerLabel: labelForCenter(${JSON.stringify(center)}),
    short: ${JSON.stringify(center.toUpperCase())},
    hasNight: Boolean(${item.varName}Night),
    extraCopy: false,
    meta: ${item.varName}Meta,
    races: ${item.varName}Races as unknown as Race[],
    sheet: ${item.varName}Sheet as unknown as SheetMeeting,
    results: [] as RaceResult[],
    resultSource: "",
    swim: [] as SwimEntry[],
    night: ${item.varName}Night ?? undefined,
  }`;
    })
    .join(",\n");
  return `import type { Race } from "../data.ts";
import type { SheetMeeting } from "../lto.ts";
import type { RaceResult } from "../results.ts";
import type { SwimEntry } from "../swim.ts";
import { dateTab, labelForCenter } from "../pipeline.ts";
${imports}

export const GENERATED_MEETINGS = [
${entries}
];
`;
}

async function writeCatalog(): Promise<string[]> {
  const names = (await readdir(MEETINGS_DIR))
    .filter((name) => /^\w{3}_\d{4}_\d{2}_\d{2}\.ts$/.test(name))
    .sort((a, b) => {
      const da = a.match(/(\d{4}_\d{2}_\d{2})/)?.[1] ?? a;
      const db = b.match(/(\d{4}_\d{2}_\d{2})/)?.[1] ?? b;
      return da.localeCompare(db) || a.localeCompare(b);
    });
  const files = names.map((file) => {
    const m = file.match(/^(\w{3})_(\d{4})_(\d{2})_(\d{2})\.ts$/)!;
    const center = m[1];
    const date = `${m[2]}-${m[3]}-${m[4]}`;
    return { id: `${center}-${date}`, file, varName: `${center}${m[2]}${m[3]}${m[4]}` };
  });
  await writeFile(path.join(MEETINGS_DIR, "index.ts"), catalogModule(files));
  return files.map((item) => item.id);
}

async function scrapeFixture(fix: Fixture, delayMs: number, fresh: boolean): Promise<BuiltMeeting | null> {
  const cardUrl = `${BASE}/Home/racingCenterEvent?event_date=${fix.date}&race_type=RACECARD&venueId=${fix.venueId}`;
  const html = await fetchText(cardUrl, delayMs, fresh);
  if (!parseRaceIds(html).length) return null;
  const card = parseRacecard(html, fix.venueId);
  if (!card || card.date !== fix.date) return null;
  const id = `${card.venue.code}-${card.date}`;
  if (LOCKED_MEETING_IDS.has(id)) {
    console.log(`skip locked ${id}`);
    return null;
  }
  const ids = parseRaceIds(html);
  const formByRace: Record<number, Record<string, ReturnType<typeof parsePreviousRuns>>> = {};
  const workByRace: Record<number, Record<string, ReturnType<typeof parseTrackwork>>> = {};
  for (let i = 0; i < card.races.length; i++) {
    const race = card.races[i];
    const raceId = ids[i];
    if (!raceId) continue;
    const formHtml = await fetchText(`${BASE}/Home/previousRunsWithTrack/${raceId}/racecard`, delayMs, fresh);
    const workHtml = await fetchText(`${BASE}/Home/trackworkHistoryByRace/${raceId}/racecard`, delayMs, fresh);
    formByRace[race.no] = parsePreviousRuns(formHtml);
    workByRace[race.no] = parseTrackwork(workHtml);
  }
  attachForm(card, formByRace, workByRace);
  let irDayBest = "";
  try {
    const sel = await fetchText(`${BASE}/Home/racingCenterEvent?event_date=${fix.date}&race_type=SELECTIONS&venueId=${fix.venueId}`, delayMs, fresh);
    irDayBest = parseDayBest(sel);
  } catch (err) {
    console.warn(`selections failed ${id}:`, err);
  }
  let night: ReturnType<typeof parseOddsTables> = {};
  try {
    const oddsHtml = await fetchText(`${BASE}/Home/racingCenterEvent?event_date=${fix.date}&race_type=ODDS&venueId=${fix.venueId}`, delayMs, fresh);
    night = parseOddsTables(oddsHtml, card.races);
  } catch (err) {
    console.warn(`odds failed ${id}:`, err);
  }
  return buildMeeting(scrapedMeetingOf(card, { irDayBest, night }));
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const window = datesOn(args.from, args.days);
  console.log(`IndiaRace daily ${args.from} +${args.days - 1}d${args.fresh ? " --fresh" : ""}`);
  await mkdir(MEETINGS_DIR, { recursive: true });
  const home = parseHomepageFixtures(await fetchText(`${BASE}/`, args.delayMs, args.fresh));
  const fixtures = mergeFixtures(home, window);
  const built: string[] = [];
  for (const fix of fixtures) {
    try {
      const meeting = await scrapeFixture(fix, args.delayMs, args.fresh);
      if (!meeting) continue;
      const file = path.join(MEETINGS_DIR, meetingFileName(meeting));
      await writeFile(file, tsModule(meeting));
      built.push(meeting.id);
      console.log(`wrote ${meeting.id} ${meeting.races.length} races dayBest=${meeting.meta.dayBest} night=${meeting.hasNight}`);
    } catch (err) {
      console.warn(`fixture ${fix.date} venue ${fix.venueId} failed:`, err);
    }
  }
  const ids = await writeCatalog();
  console.log(`catalog ${ids.join(", ") || "(empty)"}`);
  if (!built.length) console.log("no new cards in window");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
