import {
  parseClock,
  parseIsoDate,
  parseLength,
  parseOddsToOne,
  parseResultCell,
  venueFromName,
  type ScrapedMeeting,
  type ScrapedNight,
  type ScrapedRace,
  type ScrapedRun,
  type ScrapedRunner,
  type ScrapedWork,
  type VenueInfo,
} from "./pipeline.ts";

export type Fixture = {
  date: string;
  venueId: number;
};

export function stripHtml(value: string): string {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#\d+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function cells(rowHtml: string): string[] {
  return [...rowHtml.matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi)].map((match) => match[1]);
}

export function parseCardTitle(html: string): { venue: VenueInfo; date: string; dateLabel: string } | null {
  const match = html.match(/Race Card\s*-\s*([A-Z][A-Z ]+?)\s*-\s*(\d{1,2}\s+[A-Za-z]{3}\s+\d{4})/i);
  if (!match) return null;
  const date = parseIsoDate(match[2]);
  if (!date) return null;
  return { venue: venueFromName(match[1]), date, dateLabel: match[2] };
}

export function parseRaceIds(html: string): number[] {
  const ids: number[] = [];
  for (const match of html.matchAll(/previousRunsWithTrack\/(\d+)/g)) {
    const id = Number(match[1]);
    if (!ids.includes(id)) ids.push(id);
  }
  return ids;
}

export function parseHomepageFixtures(html: string): Fixture[] {
  const seen = new Set<string>();
  const out: Fixture[] = [];
  for (const match of html.matchAll(/venueId=(\d+)&event_date=(\d{4}-\d{2}-\d{2})&race_type=RACECARD/g)) {
    const key = `${match[2]}-${match[1]}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ date: match[2], venueId: Number(match[1]) });
  }
  return out;
}

function parseRatingHtml(html: string): string {
  const last = html.match(/<small>(\d+)<\/small>/i)?.[1];
  const current = stripHtml(html).match(/(\d+)\s*$/)?.[1];
  if (last && current) return `${last} / ${current}`;
  return current ?? last ?? "0";
}

function parseLast5(html: string): string {
  const block = html.match(/last-five-runs-lable[\s\S]*?<\/span>/i)?.[0] ?? "";
  const nums = [...block.matchAll(/(\d+|[-.])/g)].map((match) => match[1]).filter((item) => item !== "-");
  return nums.length ? `${nums.join("-").replace(/\.-/g, ".")}` : "-";
}

function parseRunnerRow(rowHtml: string): ScrapedRunner | null {
  const tds = cells(rowHtml);
  if (tds.length < 11) return null;
  const noCell = stripHtml(tds[0] ?? "");
  const cloth = Number(noCell.match(/^\d+/)?.[0]);
  const draw = Number(noCell.match(/\((\d+)\)/)?.[1] ?? 0);
  if (!cloth) return null;
  const horseHtml = tds[2] ?? "";
  const name =
    horseHtml.match(/horseStatistics\/\d+\/([^"<]+)/)?.[1]?.replace(/-/g, " ").trim().toUpperCase() ??
    stripHtml(horseHtml.match(/<h5[\s\S]*?<\/h5>/i)?.[0] ?? "").toUpperCase();
  if (!name) return null;
  const sire = stripHtml(horseHtml.match(/allSireDetails\/\d+">([^<]+)/i)?.[1] ?? "");
  const dam = stripHtml(horseHtml.match(/allDamDetails\/\d+">([^<]+)/i)?.[1] ?? "");
  const alRaw = stripHtml(tds[8] ?? "").replace(/^-/, "");
  const shoesRaw = stripHtml(tds[9] ?? "").toUpperCase();
  return {
    cloth,
    draw,
    name: name.replace(/\s+/g, " ").trim(),
    age: stripHtml(tds[3] ?? ""),
    pedigree: sire && dam ? `${sire} - ${dam}` : stripHtml(horseHtml.match(/<h6[\s\S]*?<\/h6>/i)?.[0] ?? ""),
    trainer: stripHtml(tds[5] ?? ""),
    jockey: stripHtml(tds[6] ?? ""),
    wt: stripHtml(tds[7] ?? ""),
    al: alRaw,
    shoes: shoesRaw.startsWith("S") ? "S" : "A",
    eq: stripHtml(tds[10] ?? ""),
    rtg: parseRatingHtml(tds[11] ?? tds[10] ?? ""),
    last5: parseLast5(horseHtml),
    form: [],
    work: [],
  };
}

function parseRaceBlock(no: number, block: string): ScrapedRace | null {
  const official = Number(block.match(/<h5>\s*\((\d+)\)/)?.[1] ?? no);
  const name = stripHtml(block.match(/<h2>([\s\S]*?)<\/h2>/i)?.[1] ?? `Race ${no}`);
  const cls = stripHtml(block.match(/<h3>([\s\S]*?)<\/h3>/i)?.[1] ?? "");
  const distRaw = stripHtml(block.match(/<h4>(\d+\s*M)<\/h4>/i)?.[1] ?? "");
  const time = stripHtml(block.match(/<h4>(\d{1,2}:\d{2}\s*[AP]M)<\/h4>/i)?.[1] ?? "");
  const distM = Number.parseInt(distRaw.replace(/\D/g, ""), 10) || 0;
  const purse = block.match(/Total:₹\.?\s*([\d,]+)/i)?.[1] ? `₹${block.match(/Total:₹\.?\s*([\d,]+)/i)![1]}` : "";
  const recordSpan = stripHtml(block.match(/Record Time[\s\S]*?<\/p>/i)?.[0] ?? "").replace(/^Record Time\s*:?\s*/i, "");
  const irPick = stripHtml(block.match(/INDIARACE SELECTIONS\s*:([\s\S]*?)<\/p>/i)?.[1] ?? "")
    .replace(/\s+/g, " ")
    .trim();
  const runners: ScrapedRunner[] = [];
  for (const row of block.matchAll(/<tr class="dividend_tr"[\s\S]*?<\/tr>/gi)) {
    const runner = parseRunnerRow(row[0]);
    if (runner) runners.push(runner);
  }
  if (!runners.length) return null;
  return {
    no,
    official,
    name,
    class: cls,
    dist: distM ? `${distM}m` : distRaw,
    distM,
    time,
    purse,
    record: recordSpan || "-",
    irPick,
    runners,
  };
}

export function parseRacecard(html: string, venueId?: number): { venue: VenueInfo; date: string; races: ScrapedRace[] } | null {
  const title = parseCardTitle(html);
  if (!title) return null;
  const venue = venueFromName(title.venue.label, venueId ?? title.venue.id);
  const parts = html.split(/<div id="race-(\d+)">/i);
  const races: ScrapedRace[] = [];
  for (let i = 1; i < parts.length; i += 2) {
    const race = parseRaceBlock(Number(parts[i]), parts[i + 1] ?? "");
    if (race) races.push(race);
  }
  if (!races.length) return null;
  return { venue, date: title.date, races };
}

function parseFormRows(tableHtml: string): ScrapedRun[] {
  const rows = [...tableHtml.matchAll(/<tr[\s\S]*?<\/tr>/gi)].slice(1);
  const runs: ScrapedRun[] = [];
  for (const row of rows) {
    const cols = cells(row[0]).map(stripHtml);
    if (cols.length < 14) continue;
    const date = parseIsoDate(cols[1] ?? "");
    if (!date) continue;
    const distM = Number.parseInt((cols[3] ?? "").replace(/\D/g, ""), 10) || 0;
    const result = parseResultCell(cols[9] ?? "");
    const rtg = Number.parseInt((cols[14] ?? "").replace(/\D/g, ""), 10);
    runs.push({
      date,
      dateLabel: `${date.slice(8, 10)} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][Number(date.slice(5, 7)) - 1]} ${date.slice(2, 4)}`,
      venue: (cols[0] ?? "").toUpperCase(),
      distM,
      cls: cols[4] ?? "",
      pos: result.pos,
      field: result.field,
      beaten: result.pos === 1 ? 0 : parseLength(cols[12] ?? cols[11]),
      wt: Number.parseFloat(cols[7] ?? "") || null,
      odds: cols[15] ?? "",
      winner: cols[10] ?? "",
      card: cols[2] ?? "",
      rtg: Number.isFinite(rtg) && rtg > 0 ? rtg : null,
      timeS: parseClock(cols[13] ?? ""),
    });
  }
  return runs;
}

export function parsePreviousRuns(html: string): Record<string, ScrapedRun[]> {
  const out: Record<string, ScrapedRun[]> = {};
  const parts = html.split(/<h3[^>]*>\s*\d+\.\s+/i);
  for (const part of parts.slice(1)) {
    const name = stripHtml(part.match(/^([^<]+)/)?.[1] ?? "").toUpperCase().replace(/\s+/g, " ").trim();
    if (!name) continue;
    const tables = [...part.matchAll(/<table[\s\S]*?<\/table>/gi)].map((match) => match[0]);
    const formTable = tables.find((table) => /Dist\. to Win/i.test(table) || /Winner\/RunnerUp/i.test(table));
    if (formTable) out[name] = parseFormRows(formTable);
  }
  return out;
}

export function parseTrackwork(html: string): Record<string, ScrapedWork[]> {
  const out: Record<string, ScrapedWork[]> = {};
  const parts = html.split(/<h3[^>]*>\s*\d+\.\s+/i);
  for (const part of parts.slice(1)) {
    const name = stripHtml(part.match(/^([^<]+)/)?.[1] ?? "").toUpperCase().replace(/\s+/g, " ").trim();
    if (!name) continue;
    const works: ScrapedWork[] = [];
    const table = part.match(/<table[\s\S]*?<\/table>/i)?.[0] ?? "";
    for (const row of table.matchAll(/<tr[\s\S]*?<\/tr>/gi)) {
      const cols = cells(row[0]).map(stripHtml);
      if (cols.length < 5 || !parseIsoDate(cols[0] ?? "")) continue;
      const iso = parseIsoDate(cols[0] ?? "")!;
      const dist = cols[4] ?? "";
      const surface = cols[5] ?? "";
      const going = cols[3] ?? "";
      works.push({
        date: `${iso.slice(8, 10)} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][Number(iso.slice(5, 7)) - 1]}`,
        venue: (cols[1] ?? "").toUpperCase(),
        clock: `${dist.toLowerCase()} ${surface.toLowerCase()} ${going}`.replace(/\s+/g, " ").trim(),
        note: cols[2] ?? "",
      });
    }
    if (works.length) out[name] = works;
  }
  return out;
}

export function parseDayBest(html: string): string {
  const match = html.match(/Day'?s Best\s*:\s*([^<]+)/i);
  return stripHtml(match?.[1] ?? "").replace(/\s+/g, " ").trim();
}

export function parseOddsTables(html: string, races: ScrapedRace[]): Record<number, ScrapedNight[]> {
  const out: Record<number, ScrapedNight[]> = {};
  const tables = [...html.matchAll(/<table[\s\S]*?<\/table>/gi)].map((match) => match[0]);
  let raceIndex = 0;
  for (const table of tables) {
    if (!/Night Odds/i.test(table)) continue;
    const race = races[raceIndex++];
    if (!race) continue;
    const header = cells([...table.matchAll(/<tr[\s\S]*?<\/tr>/gi)][0]?.[0] ?? "").map(stripHtml);
    const nightIdx = header.findIndex((col) => /night/i.test(col));
    const rows: ScrapedNight[] = [];
    for (const row of [...table.matchAll(/<tr[\s\S]*?<\/tr>/gi)].slice(1)) {
      const cols = cells(row[0]).map(stripHtml);
      if (cols.length < 3) continue;
      const runner = race.runners.find((item) =>
        cols.some((col) => col.toUpperCase().replace(/^\d+\.\s*/, "").trim() === item.name),
      );
      if (!runner) continue;
      const shifted = header.length - cols.length;
      const nightRaw = nightIdx >= 0 ? cols[Math.max(0, nightIdx - Math.max(0, shifted))] : cols.find((col) => /\d+\s*\/\s*\d+/.test(col));
      const mornRaw = cols[cols.indexOf(nightRaw ?? "") + 1] ?? "";
      rows.push({
        cloth: runner.cloth,
        name: runner.name,
        night: parseOddsToOne(nightRaw ?? ""),
        morning: parseOddsToOne(mornRaw),
      });
    }
    if (rows.some((row) => row.night != null)) out[race.no] = rows;
  }
  return out;
}

export function attachForm(
  meeting: { races: ScrapedRace[] },
  formByRace: Record<number, Record<string, ScrapedRun[]>>,
  workByRace: Record<number, Record<string, ScrapedWork[]>>,
): void {
  for (const race of meeting.races) {
    const form = formByRace[race.no] ?? {};
    const work = workByRace[race.no] ?? {};
    for (const runner of race.runners) {
      runner.form = form[runner.name] ?? [];
      runner.work = work[runner.name] ?? [];
    }
  }
}

export function scrapedMeetingOf(
  card: { venue: VenueInfo; date: string; races: ScrapedRace[] },
  extras: { irDayBest?: string; night?: Record<number, ScrapedNight[]> } = {},
): ScrapedMeeting {
  return {
    date: card.date,
    venue: card.venue,
    races: card.races,
    irDayBest: extras.irDayBest ?? "",
    night: extras.night ?? {},
  };
}
