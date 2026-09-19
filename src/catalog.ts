import { MEETING as hyd19Meta, races as hyd19Races, type MeetingInfo, type Race } from "./data.ts";
import { GRID_CLOTHS, NIGHT_META, NIGHT_ODDS, type NightQuote } from "./oddsBook.ts";
import { RESULTS, RESULT_SOURCE, type RaceResult } from "./results.ts";
import { SHEET as hyd19Sheet } from "./sheetData.ts";
import { SWIM, type SwimEntry } from "./swim.ts";
import type { SheetMeeting } from "./lto.ts";
import { GENERATED_MEETINGS } from "./meetings/index.ts";
import type { CenterId } from "./nav.ts";

export type MeetingBundle = {
  id: string;
  date: string;
  dateTab: string;
  center: CenterId;
  centerLabel: string;
  short: string;
  hasNight: boolean;
  extraCopy: boolean;
  meta: MeetingInfo;
  races: Race[];
  sheet: SheetMeeting;
  results: RaceResult[];
  resultSource: string;
  swim: SwimEntry[];
  night?: {
    banner: string;
    title: string;
    version: string;
    when: string;
    source: string;
    note: string;
    odds: Record<number, NightQuote[]>;
    gridCloths: number[];
  };
};

const HYD19: MeetingBundle = {
  id: "hyd-2026-09-19",
  date: "2026-09-19",
  dateTab: "19 Sep",
  center: "hyd",
  centerLabel: "Hyderabad",
  short: "HYD",
  hasNight: true,
  extraCopy: true,
  meta: hyd19Meta,
  races: hyd19Races,
  sheet: hyd19Sheet,
  results: RESULTS,
  resultSource: RESULT_SOURCE,
  swim: SWIM,
  night: {
    ...NIGHT_META,
    odds: NIGHT_ODDS,
    gridCloths: GRID_CLOTHS,
  },
};

export const MEETINGS: MeetingBundle[] = [HYD19, ...(GENERATED_MEETINGS as MeetingBundle[])];

export function dateTabs(): { date: string; label: string }[] {
  const seen = new Set<string>();
  const tabs: { date: string; label: string }[] = [];
  for (const meeting of MEETINGS) {
    if (seen.has(meeting.date)) continue;
    seen.add(meeting.date);
    tabs.push({ date: meeting.date, label: meeting.dateTab });
  }
  return tabs;
}

export function centersOn(date: string): MeetingBundle[] {
  return MEETINGS.filter((meeting) => meeting.date === date);
}

export function meetingFor(date: string, center: CenterId): MeetingBundle {
  return (
    MEETINGS.find((meeting) => meeting.date === date && meeting.center === center) ??
    centersOn(date)[0] ??
    MEETINGS[0]
  );
}
