import type { MeetingBundle } from "./catalog";
import { Jump } from "./Jump";
import { callLabel, fmtOdds, morningMove, openingMove, type NightCall, type NightQuote } from "./oddsBook";
import { go, isFocus, type Location } from "./nav";
import { finishFor, posLabel, posTone, raceResult, spAsNight } from "./results";

function morningOf(meeting: MeetingBundle, raceNo: number, quote: NightQuote): number | null {
  return quote.morning ?? spAsNight(raceNo, quote.cloth, meeting.results);
}

function horseName(meeting: MeetingBundle, raceNo: number, cloth: number): string {
  const race = meeting.races.find((item) => item.no === raceNo);
  return race?.runners.find((runner) => runner.cloth === cloth)?.name ?? `H${cloth}`;
}

function quoteFor(meeting: MeetingBundle, raceNo: number, cloth: number): NightQuote | undefined {
  return meeting.night?.odds[raceNo]?.find((quote) => quote.cloth === cloth);
}

function cellClass(call: NightCall): string {
  if (call === "pos") return "bg-[#548235] text-white";
  if (call === "neg") return "bg-[#c00000] text-white";
  return "bg-[#ffd966] text-[#111]";
}

function moveClass(status: ReturnType<typeof morningMove>["status"] | ReturnType<typeof openingMove>["status"]): string {
  if (status === "positive") return "bg-[#c6efce] text-[#006400] font-bold";
  if (status === "negative") return "bg-[#f4cccc] text-[#c00000] font-bold";
  if (status === "steady") return "bg-[#fff2cc]";
  return "bg-[#f3f3f3] text-[#666]";
}

function GridCell({
  meeting,
  raceNo,
  cloth,
  loc,
}: {
  meeting: MeetingBundle;
  raceNo: number;
  cloth: number;
  loc: Location;
}) {
  const quote = quoteFor(meeting, raceNo, cloth);
  if (!quote) {
    return <td className="h-[4.5rem] border border-[#1f4e79] bg-white" />;
  }
  const focused = isFocus(loc, raceNo, cloth);
  return (
    <td className={`border border-[#1f4e79] px-0 py-0 text-center ${cellClass(quote.call)} ${focused ? "horse-focus" : ""}`}>
      <Jump
        to={{ view: "sheet", race: raceNo, cloth }}
        title="Open LTO sheet"
        className="block h-[4.5rem] px-1.5 py-1 hover:brightness-110"
      >
        <p className="text-lg font-bold leading-none md:text-xl">{fmtOdds(quote.night)}</p>
        <p className="mt-1 max-w-[9rem] truncate text-[10px] font-bold uppercase leading-tight">{horseName(meeting, raceNo, cloth)}</p>
      </Jump>
    </td>
  );
}

function TallyRow({
  meeting,
  raceNo,
  quote,
  loc,
}: {
  meeting: MeetingBundle;
  raceNo: number;
  quote: NightQuote;
  loc: Location;
}) {
  const race = meeting.races.find((item) => item.no === raceNo);
  const runner = race?.runners.find((item) => item.cloth === quote.cloth);
  const sheet = meeting.sheet.races.find((item) => item.no === raceNo);
  const morning = morningOf(meeting, raceNo, quote);
  const opening = quote.opening ?? null;
  const move = morningMove(quote.night, morning);
  const openMove = openingMove(morning ?? quote.night, opening);
  const finish = finishFor(raceNo, quote.cloth, meeting.results);
  const pick =
    sheet?.picks.win === quote.cloth ? "WIN" : sheet?.picks.plc === quote.cloth ? "PLC" : sheet?.picks.upset === quote.cloth ? "UPSET" : "";
  const to = { view: "sheet" as const, race: raceNo, cloth: quote.cloth };
  return (
    <tr
      id={`night-${raceNo}-h${quote.cloth}`}
      className={`scroll-mt-16 cursor-pointer ${isFocus(loc, raceNo, quote.cloth) ? "horse-focus" : ""}`}
      onClick={() => go(to)}
    >
      <td className="border border-[#8f8f8f] bg-[#fff3cc] px-2 py-1.5 text-center font-bold">{quote.cloth}</td>
      <td className="border border-[#8f8f8f] px-2 py-1.5 text-left font-bold">
        <Jump to={to} className="hover:underline">
          {horseName(meeting, raceNo, quote.cloth)}
        </Jump>
        {finish ? <span className={`ml-1 font-mono text-[10px] ${posTone(finish)}`}> {posLabel(finish)}</span> : null}
      </td>
      <td className="border border-[#8f8f8f] px-2 py-1.5 text-left text-[#555]">{runner?.jockey ?? "-"}</td>
      <td className={`border border-[#8f8f8f] px-2 py-1.5 text-center font-bold ${cellClass(quote.call)}`}>{fmtOdds(quote.night)}</td>
      <td className="border border-[#8f8f8f] px-2 py-1.5 text-center" title={finish?.sp ? `Official SP ${finish.sp}` : ""}>
        {fmtOdds(morning)}
      </td>
      <td className={`border border-[#8f8f8f] px-2 py-1.5 text-center ${moveClass(move.status)}`}>{move.label}</td>
      <td className="border border-[#8f8f8f] px-2 py-1.5 text-center font-mono">{fmtOdds(opening)}</td>
      <td className={`border border-[#8f8f8f] px-2 py-1.5 text-center ${moveClass(openMove.status)}`}>{openMove.label}</td>
      <td className={`border border-[#8f8f8f] px-2 py-1.5 text-center font-bold uppercase ${cellClass(quote.call)}`}>
        {callLabel(quote.call)}
      </td>
      <td className="border border-[#8f8f8f] px-2 py-1.5 text-center font-mono">{runner?.tissue ?? "-"}</td>
      <td className="border border-[#8f8f8f] px-2 py-1.5 text-center font-bold text-[#006400]">{pick || "-"}</td>
    </tr>
  );
}

export default function NightOdds({ loc, meeting }: { loc: Location; meeting: MeetingBundle }) {
  const night = meeting.night;
  if (!night) return null;
  const sheet = meeting.sheet;
  const waitingMorning = Object.entries(night.odds).every(([raceNo, quotes]) =>
    quotes.every((quote) => morningOf(meeting, Number(raceNo), quote) === null),
  );
  const waitingOpen = Object.values(night.odds).every((quotes) => quotes.every((quote) => quote.opening == null));

  return (
    <div className="min-h-[100dvh] bg-[#dbe6f1] text-[#111]" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
      <header className="bg-[#1f4e79] px-3 py-4 text-center text-white md:px-6">
        <p className="text-sm font-bold tracking-[0.22em]">{night.banner}</p>
        <h1 className="mt-1 text-xl font-bold tracking-wide text-[#ffe566] md:text-3xl">{night.title}</h1>
        <p className="mt-1 font-mono text-sm">{night.when}</p>
        <p className="mt-1 text-xs tracking-wide text-white/80">
          {night.version} · {meeting.results.length ? "RESULTS IN · morning column is official SP" : "PRE-RACE · NIGHT / MORNING / OPENING"}
        </p>
      </header>

      <div className="px-2 py-4 md:px-4">
        <div className="overflow-x-auto bg-white shadow-sm">
          <table className="w-max min-w-full border-collapse text-[11px]">
            <thead>
              <tr className="bg-[#1f4e79] text-white">
                <th className="border border-[#1f4e79] px-2 py-2">H / R</th>
                {sheet.races.map((race) => (
                  <th key={race.no} className="border border-[#1f4e79] px-3 py-2 text-sm">
                    <Jump to={{ view: "sheet", race: race.no, cloth: null }} className="hover:underline">
                      R{race.no}
                    </Jump>
                    <span className="mt-0.5 block text-[10px] font-normal text-[#ffe566]">{race.code}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {night.gridCloths.map((cloth) => (
                <tr key={cloth}>
                  <th className="border border-[#1f4e79] bg-[#1f4e79] px-3 py-2 text-left text-sm font-bold text-white">H{cloth}</th>
                  {sheet.races.map((race) => (
                    <GridCell key={`${race.no}-${cloth}`} meeting={meeting} raceNo={race.no} cloth={cloth} loc={loc} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-3 px-1 text-center text-sm font-bold uppercase tracking-wide text-[#1f4e79]">
          Early odds do not lie. Those who prepare early, win early.
        </p>
        <p className="mt-2 max-w-[90ch] px-1 text-[12px] leading-relaxed text-[#333]">
          {night.source} {night.note} {meeting.resultSource} Click a price or name to open that horse on the LTO sheet.
          {waitingMorning ? " Morning prices are not in yet — the job will pick them up once IndiaRace posts the Morning Odds column." : ""}
          {waitingOpen ? " Opening prices fill closer to post from the same odds page." : ""}
        </p>

        <div className="mt-6 space-y-6">
          {sheet.races.map((race) => {
            const got = raceResult(race.no, meeting.results);
            return (
              <section key={race.no} id={`night-${race.no}`} className="scroll-mt-16 overflow-x-auto bg-white shadow-sm">
                <header className="flex flex-wrap items-center justify-between gap-2 bg-[#1f4e79] px-3 py-2 text-white">
                  <p className="font-bold">
                    <Jump to={{ view: "sheet", race: race.no, cloth: null }} className="hover:underline">
                      R{race.no} {race.name}
                    </Jump>
                  </p>
                  <p className="font-mono text-xs text-[#ffe566]">
                    {got
                      ? `1st ${got.first} · 2nd ${got.second} · 3rd ${got.third} · ${got.winTime}`
                      : `${race.dist} · ${race.time} · ${race.code}`}
                  </p>
                </header>
                <table className="w-full min-w-[880px] border-collapse text-[12px]">
                  <thead>
                    <tr className="bg-[#d6dce4] text-left">
                      <th className="border border-[#8f8f8f] px-2 py-1.5">No</th>
                      <th className="border border-[#8f8f8f] px-2 py-1.5">Horse</th>
                      <th className="border border-[#8f8f8f] px-2 py-1.5">Jockey</th>
                      <th className="border border-[#8f8f8f] px-2 py-1.5 text-center">Night</th>
                      <th className="border border-[#8f8f8f] px-2 py-1.5 text-center">Morning / SP</th>
                      <th className="border border-[#8f8f8f] px-2 py-1.5 text-center">vs Night</th>
                      <th className="border border-[#8f8f8f] px-2 py-1.5 text-center">Opening</th>
                      <th className="border border-[#8f8f8f] px-2 py-1.5 text-center">vs Morn</th>
                      <th className="border border-[#8f8f8f] px-2 py-1.5 text-center">Night call</th>
                      <th className="border border-[#8f8f8f] px-2 py-1.5 text-center">Tissue</th>
                      <th className="border border-[#8f8f8f] px-2 py-1.5 text-center">Sheet</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(night.odds[race.no] ?? []).map((quote) => (
                      <TallyRow key={quote.cloth} meeting={meeting} raceNo={race.no} quote={quote} loc={loc} />
                    ))}
                  </tbody>
                </table>
                {got ? (
                  <p className="px-3 py-2 text-[12px] leading-relaxed text-[#333]">
                    <span className="font-bold">What went wrong. </span>
                    {got.note}
                  </p>
                ) : null}
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
