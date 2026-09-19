import type { Race } from "../data.ts";
import type { SheetMeeting } from "../lto.ts";
import type { RaceResult } from "../results.ts";
import type { SwimEntry } from "../swim.ts";
import { dateTab, labelForCenter } from "../pipeline.ts";
import { MEETING as pun20260920Meta, races as pun20260920Races, SHEET as pun20260920Sheet, NIGHT as pun20260920Night } from "./pun_2026_09_20.ts";
import { MEETING as hyd20260921Meta, races as hyd20260921Races, SHEET as hyd20260921Sheet, NIGHT as hyd20260921Night } from "./hyd_2026_09_21.ts";

export const GENERATED_MEETINGS = [
  {
    id: "pun-2026-09-20",
    date: "2026-09-20",
    dateTab: dateTab("2026-09-20"),
    center: "pun",
    centerLabel: labelForCenter("pun"),
    short: "PUN",
    hasNight: Boolean(pun20260920Night),
    extraCopy: false,
    meta: pun20260920Meta,
    races: pun20260920Races as unknown as Race[],
    sheet: pun20260920Sheet as unknown as SheetMeeting,
    results: [] as RaceResult[],
    resultSource: "",
    swim: [] as SwimEntry[],
    night: pun20260920Night ?? undefined,
  },
  {
    id: "hyd-2026-09-21",
    date: "2026-09-21",
    dateTab: dateTab("2026-09-21"),
    center: "hyd",
    centerLabel: labelForCenter("hyd"),
    short: "HYD",
    hasNight: Boolean(hyd20260921Night),
    extraCopy: false,
    meta: hyd20260921Meta,
    races: hyd20260921Races as unknown as Race[],
    sheet: hyd20260921Sheet as unknown as SheetMeeting,
    results: [] as RaceResult[],
    resultSource: "",
    swim: [] as SwimEntry[],
    night: hyd20260921Night ?? undefined,
  }
];
