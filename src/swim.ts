export type SwimKind = "late" | "heavy" | "taper";

export type SwimEntry = {
  race: number;
  cloth: number;
  days: string[];
  kind: SwimKind;
  tag: string;
  note: string;
};

function entry(
  race: number,
  cloth: number,
  days: string[],
  note: string,
): SwimEntry {
  const late = days.some((d) => d === "15" || d === "16" || d === "17");
  const kind: SwimKind = late ? "late" : days.length >= 4 ? "heavy" : "taper";
  const tag = `${days.length}${late ? "L" : kind === "taper" ? "t" : ""}`;
  return { race, cloth, days, kind, tag, note };
}

export const SWIM: SwimEntry[] = [
  entry(1, 2, ["09", "16"], "Debutant in the pool 3 days out. Not a gallop-into-the-race prep."),
  entry(1, 7, ["09", "10", "11"], "Three days then a full taper. Form already cooked by French Lieutenant."),
  entry(2, 6, ["09", "10", "11"], "Taper after three pool days. Steel, tailed off 45L. Pool is maintenance, not fitness."),
  entry(2, 9, ["10", "11", "12"], "Midweek block then dry. Light 51kg is the only angle."),
  entry(3, 6, ["08", "10", "11", "12"], "Four visits, then tapered. Steel and out of form."),
  entry(3, 7, ["09", "10", "11"], "Pool to get a 354-day layoff going, then tapered. Still too long away."),
  entry(3, 9, ["09", "16"], "Long absence and back in the pool 3 days out. Soundness, not fitness."),
  entry(3, 10, ["11", "12"], "Two days then dry. Mild. Form is still poor."),
  entry(4, 3, ["09", "16"], "Late swim on a horse beaten 8-18L. Fade."),
  entry(4, 6, ["09", "10", "11", "15", "16"], "Five visits including T-4 and T-3. Pool-dependent. Confirm the fade."),
  entry(4, 7, ["09", "10", "11", "15", "16"], "Same yard, same pattern as Detective. Heavy late swim. Confirm the fade."),
  entry(5, 6, ["08", "09", "11", "12", "16"], "Five visits and still in the pool 3 days out. Not a Gold Cup work pattern."),
  entry(6, 3, ["08", "09", "12", "16"], "Four visits, last on the 16th. 7yo mare keeping legs quiet."),
];

export function swimFor(race: number, cloth: number, list: SwimEntry[] = SWIM): SwimEntry | undefined {
  return list.find((row) => row.race === race && row.cloth === cloth);
}

export function swimForRace(race: number, list: SwimEntry[] = SWIM): SwimEntry[] {
  return list.filter((row) => row.race === race);
}

export function swimTone(kind: SwimKind): string {
  if (kind === "late") return "bg-[#c00000] text-white";
  if (kind === "heavy") return "bg-[#c45911] text-white";
  return "bg-[#fff2cc] text-[#7f6000]";
}
