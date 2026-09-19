export type Finish = {
  cloth: number;
  pos: number | null;
  dnf: boolean;
  beaten: string;
  sp: string;
  time: string;
};

export type RaceResult = {
  no: number;
  winTime: string;
  first: number;
  second: number;
  third: number;
  note: string;
  runners: Finish[];
};

export const RESULT_SOURCE = "IndiaRace official results, Hyderabad 19 Sep 2026.";

export const RESULTS: RaceResult[] = [
  {
    no: 1,
    winTime: "1:13.40",
    first: 3,
    second: 8,
    third: 6,
    note: "Night 0.90 on French Lieutenant was the race. WIN on My Touch ran 2nd, 4.25L behind a horse who had never won. Bella's Touch shortened into 4s and still finished 6th, beaten 15L. Gacchanmanasvin 3rd at 20s was the one we had as exposed.",
    runners: [
      { cloth: 3, pos: 1, dnf: false, beaten: "", sp: "1 1/4", time: "1:13.40" },
      { cloth: 8, pos: 2, dnf: false, beaten: "4.25", sp: "2", time: "1:14.10" },
      { cloth: 6, pos: 3, dnf: false, beaten: "7.5", sp: "20", time: "1:14.64" },
      { cloth: 5, pos: 4, dnf: false, beaten: "7.5", sp: "20", time: "1:14.67" },
      { cloth: 7, pos: 5, dnf: false, beaten: "11.5", sp: "20", time: "1:15.32" },
      { cloth: 1, pos: 6, dnf: false, beaten: "15", sp: "4", time: "1:15.88" },
      { cloth: 4, pos: 7, dnf: false, beaten: "15", sp: "20", time: "1:15.90" },
      { cloth: 2, pos: 8, dnf: false, beaten: "27.25", sp: "20", time: "1:17.92" },
    ],
  },
  {
    no: 2,
    winTime: "1:07.12",
    first: 1,
    second: 3,
    third: 5,
    note: "Materiality DNF. Cosmic Gift 45/100 bolted 4L. Night was positive Cosmic and negative Materiality — the WIN column inverted that. Upset My Way My Rules did run 2nd. Beverley 3rd at 20s.",
    runners: [
      { cloth: 1, pos: 1, dnf: false, beaten: "", sp: "45/100", time: "1:07.12" },
      { cloth: 3, pos: 2, dnf: false, beaten: "4", sp: "7", time: "1:07.79" },
      { cloth: 5, pos: 3, dnf: false, beaten: "5.5", sp: "20", time: "1:08.04" },
      { cloth: 9, pos: 4, dnf: false, beaten: "9", sp: "20", time: "1:08.63" },
      { cloth: 7, pos: 5, dnf: false, beaten: "17", sp: "20", time: "1:09.93" },
      { cloth: 2, pos: 6, dnf: false, beaten: "20.75", sp: "20", time: "1:10.57" },
      { cloth: 8, pos: 7, dnf: false, beaten: "23", sp: "20", time: "1:10.96" },
      { cloth: 6, pos: 8, dnf: false, beaten: "28", sp: "20", time: "1:11.78" },
      { cloth: 4, pos: 9, dnf: true, beaten: "DNF", sp: "8", time: "DNF" },
    ],
  },
  {
    no: 3,
    winTime: "1:06.76",
    first: 2,
    second: 4,
    third: 3,
    note: "Nap landed. She's A Bomb 7/10 won 1.5L. La Quinta (upset) 2nd, American Affair (PLC) 3rd. The 5kg claim vs exposed Class 4 was the right read. Flare DNF.",
    runners: [
      { cloth: 2, pos: 1, dnf: false, beaten: "", sp: "7/10", time: "1:06.76" },
      { cloth: 4, pos: 2, dnf: false, beaten: "1.5", sp: "5", time: "1:08.02" },
      { cloth: 3, pos: 3, dnf: false, beaten: "2.75", sp: "6", time: "1:08.21" },
      { cloth: 1, pos: 4, dnf: false, beaten: "6.5", sp: "30", time: "1:08.84" },
      { cloth: 8, pos: 5, dnf: false, beaten: "11.75", sp: "30", time: "1:09.72" },
      { cloth: 10, pos: 6, dnf: false, beaten: "15.25", sp: "30", time: "1:10.27" },
      { cloth: 6, pos: 7, dnf: false, beaten: "16", sp: "30", time: "1:10.43" },
      { cloth: 7, pos: 8, dnf: false, beaten: "16.75", sp: "30", time: "1:10.55" },
      { cloth: 9, pos: 9, dnf: false, beaten: "16.75", sp: "30", time: "1:10.56" },
      { cloth: 5, pos: 10, dnf: true, beaten: "DNF", sp: "", time: "DNF" },
    ],
  },
  {
    no: 4,
    winTime: "1:12.52",
    first: 2,
    second: 8,
    third: 5,
    note: "Clean 1-2-3 of the sheet: One N Only, Emerald Touch, Black Onyx. Swim fades held (Detective 9th, Calista Girl 7th). Celestial 6th as the night negative said.",
    runners: [
      { cloth: 2, pos: 1, dnf: false, beaten: "", sp: "9/10", time: "1:12.52" },
      { cloth: 8, pos: 2, dnf: false, beaten: "1", sp: "10", time: "1:12.68" },
      { cloth: 5, pos: 3, dnf: false, beaten: "3", sp: "4", time: "1:13.03" },
      { cloth: 4, pos: 4, dnf: false, beaten: "3", sp: "6", time: "1:13.04" },
      { cloth: 9, pos: 5, dnf: false, beaten: "5", sp: "20", time: "1:13.37" },
      { cloth: 1, pos: 6, dnf: false, beaten: "6", sp: "20", time: "1:13.55" },
      { cloth: 7, pos: 7, dnf: false, beaten: "9.5", sp: "20", time: "1:14.14" },
      { cloth: 3, pos: 8, dnf: false, beaten: "10", sp: "20", time: "1:14.25" },
      { cloth: 6, pos: 9, dnf: false, beaten: "12", sp: "20", time: "1:14.55" },
    ],
  },
  {
    no: 5,
    winTime: "2:28.88",
    first: 4,
    second: 3,
    third: 7,
    note: "Zuccaro 5/10 won 2.5L. Duke of Tuscany (PLC) 5th beaten 25.5L — the topweight tax was real, the night positive was not. Dyf (upset) 2nd. Vyasa 3rd at 20s. Ramiel 6th as faded. IndiaRace clocked High Command 2:26.24, faster than the winner — treat that time as a source error.",
    runners: [
      { cloth: 4, pos: 1, dnf: false, beaten: "", sp: "5/10", time: "2:28.88" },
      { cloth: 3, pos: 2, dnf: false, beaten: "2.5", sp: "8", time: "2:29.29" },
      { cloth: 7, pos: 3, dnf: false, beaten: "6.5", sp: "20", time: "2:29.96" },
      { cloth: 5, pos: 4, dnf: false, beaten: "7.75", sp: "15", time: "2:30.18" },
      { cloth: 1, pos: 5, dnf: false, beaten: "25.5", sp: "12", time: "2:33.10" },
      { cloth: 2, pos: 6, dnf: false, beaten: "26.5", sp: "20", time: "2:33.27" },
      { cloth: 6, pos: 7, dnf: false, beaten: "44.5", sp: "70", time: "2:26.24" },
    ],
  },
  {
    no: 6,
    winTime: "1:43.10",
    first: 1,
    second: 6,
    third: 2,
    note: "Onslaught (PLC) won a neck. Quintessential (WIN) 5th, beaten 9.75L. Valledonna (upset) 2nd. The Gangster 5kg-swing finished last. Photograph (night positive) 7th. Hoping High, the night fade, ran 3rd.",
    runners: [
      { cloth: 1, pos: 1, dnf: false, beaten: "", sp: "1 1/2", time: "1:43.10" },
      { cloth: 6, pos: 2, dnf: false, beaten: "Neck", sp: "3", time: "1:43.15" },
      { cloth: 2, pos: 3, dnf: false, beaten: "4", sp: "12", time: "1:43.79" },
      { cloth: 9, pos: 4, dnf: false, beaten: "7.75", sp: "20", time: "1:44.42" },
      { cloth: 4, pos: 5, dnf: false, beaten: "9.75", sp: "4", time: "1:44.73" },
      { cloth: 3, pos: 6, dnf: false, beaten: "11", sp: "20", time: "1:44.93" },
      { cloth: 5, pos: 7, dnf: false, beaten: "14", sp: "10", time: "1:45.42" },
      { cloth: 10, pos: 8, dnf: false, beaten: "16", sp: "20", time: "1:45.71" },
      { cloth: 7, pos: 9, dnf: false, beaten: "18.25", sp: "20", time: "1:46.09" },
      { cloth: 8, pos: 10, dnf: false, beaten: "22", sp: "8", time: "1:46.71" },
    ],
  },
];

export function clubOddsToNight(raw: string): number | null {
  const s = raw.trim();
  if (!s) return null;
  const mixed = s.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixed) return Number(mixed[1]) + Number(mixed[2]) / Number(mixed[3]);
  const frac = s.match(/^(\d+)\/(\d+)$/);
  if (frac) return Number(frac[1]) / Number(frac[2]);
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

export function spAsNight(raceNo: number, cloth: number, bag: RaceResult[] = RESULTS): number | null {
  const finish = finishFor(raceNo, cloth, bag);
  if (!finish?.sp) return null;
  return clubOddsToNight(finish.sp);
}

export function raceResult(no: number, bag: RaceResult[] = RESULTS): RaceResult | undefined {
  return bag.find((race) => race.no === no);
}

export function finishFor(raceNo: number, cloth: number, bag: RaceResult[] = RESULTS): Finish | undefined {
  return raceResult(raceNo, bag)?.runners.find((row) => row.cloth === cloth);
}

export function placed(finish: Finish | undefined, n = 3): boolean {
  return Boolean(finish && !finish.dnf && finish.pos != null && finish.pos <= n);
}

export function pickHit(
  kind: "win" | "plc" | "upset",
  cloth: number,
  raceNo: number,
  bag: RaceResult[] = RESULTS,
): boolean {
  const finish = finishFor(raceNo, cloth, bag);
  if (kind === "win") return finish?.pos === 1 && !finish.dnf;
  return placed(finish, 3);
}

export function cardScore(picks: { win: number; plc: number; upset: number }[], bag: RaceResult[] = RESULTS) {
  let win = 0;
  let plc = 0;
  let upset = 0;
  picks.forEach((pick, i) => {
    const no = i + 1;
    if (pickHit("win", pick.win, no, bag)) win += 1;
    if (pickHit("plc", pick.plc, no, bag)) plc += 1;
    if (pickHit("upset", pick.upset, no, bag)) upset += 1;
  });
  return { win, plc, upset, n: picks.length };
}

export function posLabel(finish: Finish | undefined): string {
  if (!finish) return "-";
  if (finish.dnf) return "DNF";
  return finish.pos == null ? "-" : String(finish.pos);
}

export function posTone(finish: Finish | undefined): string {
  if (!finish) return "";
  if (finish.dnf) return "text-[#c00000] font-bold";
  if (finish.pos === 1) return "text-[#006400] font-bold";
  if (finish.pos === 2 || finish.pos === 3) return "text-[#1f4e79] font-bold";
  return "text-[#666]";
}
