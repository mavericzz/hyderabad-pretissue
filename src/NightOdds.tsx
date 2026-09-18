import { races } from "./data";
import {
  GRID_CLOTHS,
  NIGHT_META,
  NIGHT_ODDS,
  callLabel,
  fmtOdds,
  morningMove,
  quoteFor,
  type NightCall,
  type NightQuote,
} from "./oddsBook";
import { SHEET } from "./sheetData";

function horseName(raceNo: number, cloth: number): string {
  const race = races.find((item) => item.no === raceNo);
  return race?.runners.find((runner) => runner.cloth === cloth)?.name ?? `H${cloth}`;
}

function cellClass(call: NightCall): string {
  if (call === "pos") return "bg-[#548235] text-white";
  if (call === "neg") return "bg-[#c00000] text-white";
  return "bg-[#ffd966] text-[#111]";
}

function moveClass(status: ReturnType<typeof morningMove>["status"]): string {
  if (status === "positive") return "bg-[#c6efce] text-[#006400] font-bold";
  if (status === "negative") return "bg-[#f4cccc] text-[#c00000] font-bold";
  if (status === "steady") return "bg-[#fff2cc]";
  return "bg-[#f3f3f3] text-[#666]";
}

function GridCell({ raceNo, cloth }: { raceNo: number; cloth: number }) {
  const quote = quoteFor(raceNo, cloth);
  if (!quote) {
    return <td className="h-[4.5rem] border border-[#1f4e79] bg-white" />;
  }
  return (
    <td className={`border border-[#1f4e79] px-1.5 py-1 text-center ${cellClass(quote.call)}`}>
      <p className="text-lg font-bold leading-none md:text-xl">{fmtOdds(quote.night)}</p>
      <p className="mt-1 max-w-[9rem] truncate text-[10px] font-bold uppercase leading-tight">{horseName(raceNo, cloth)}</p>
    </td>
  );
}

function TallyRow({ raceNo, quote }: { raceNo: number; quote: NightQuote }) {
  const race = races.find((item) => item.no === raceNo);
  const runner = race?.runners.find((item) => item.cloth === quote.cloth);
  const sheet = SHEET.races.find((item) => item.no === raceNo);
  const move = morningMove(quote.night, quote.morning);
  const pick =
    sheet?.picks.win === quote.cloth ? "WIN" : sheet?.picks.plc === quote.cloth ? "PLC" : sheet?.picks.upset === quote.cloth ? "UPSET" : "";
  return (
    <tr>
      <td className="border border-[#8f8f8f] bg-[#fff3cc] px-2 py-1.5 text-center font-bold">{quote.cloth}</td>
      <td className="border border-[#8f8f8f] px-2 py-1.5 text-left font-bold">{horseName(raceNo, quote.cloth)}</td>
      <td className="border border-[#8f8f8f] px-2 py-1.5 text-left text-[#555]">{runner?.jockey ?? "-"}</td>
      <td className={`border border-[#8f8f8f] px-2 py-1.5 text-center font-bold ${cellClass(quote.call)}`}>{fmtOdds(quote.night)}</td>
      <td className="border border-[#8f8f8f] px-2 py-1.5 text-center">{quote.morning === null ? "-" : fmtOdds(quote.morning)}</td>
      <td className={`border border-[#8f8f8f] px-2 py-1.5 text-center ${moveClass(move.status)}`}>{move.label}</td>
      <td className={`border border-[#8f8f8f] px-2 py-1.5 text-center font-bold uppercase ${cellClass(quote.call)}`}>
        {callLabel(quote.call)}
      </td>
      <td className="border border-[#8f8f8f] px-2 py-1.5 text-center font-mono">{runner?.tissue ?? "-"}</td>
      <td className="border border-[#8f8f8f] px-2 py-1.5 text-center font-bold text-[#006400]">{pick || "-"}</td>
    </tr>
  );
}

export default function NightOdds() {
  const pending = Object.values(NIGHT_ODDS)
    .flat()
    .every((quote) => quote.morning === null);

  return (
    <div className="min-h-[100dvh] bg-[#dbe6f1] text-[#111]" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
      <header className="bg-[#1f4e79] px-3 py-4 text-center text-white md:px-6">
        <p className="text-sm font-bold tracking-[0.22em]">{NIGHT_META.banner}</p>
        <h1 className="mt-1 text-xl font-bold tracking-wide text-[#ffe566] md:text-3xl">{NIGHT_META.title}</h1>
        <p className="mt-1 font-mono text-sm">{NIGHT_META.when}</p>
        <p className="mt-1 text-xs tracking-wide text-white/80">{NIGHT_META.version}</p>
      </header>

      <div className="px-2 py-4 md:px-4">
        <div className="overflow-x-auto bg-white shadow-sm">
          <table className="w-max min-w-full border-collapse text-[11px]">
            <thead>
              <tr className="bg-[#1f4e79] text-white">
                <th className="border border-[#1f4e79] px-2 py-2">H / R</th>
                {SHEET.races.map((race) => (
                  <th key={race.no} className="border border-[#1f4e79] px-3 py-2 text-sm">
                    R{race.no}
                    <span className="mt-0.5 block text-[10px] font-normal text-[#ffe566]">{race.code}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {GRID_CLOTHS.map((cloth) => (
                <tr key={cloth}>
                  <th className="border border-[#1f4e79] bg-[#1f4e79] px-3 py-2 text-left text-sm font-bold text-white">H{cloth}</th>
                  {SHEET.races.map((race) => (
                    <GridCell key={`${race.no}-${cloth}`} raceNo={race.no} cloth={cloth} />
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
          {NIGHT_META.source} {NIGHT_META.note}
          {pending ? " Morning prices are not in yet. Send the morning card and this tab will tally the move on each cloth." : ""}
        </p>

        <div className="mt-6 space-y-6">
          {SHEET.races.map((race) => (
            <section key={race.no} className="overflow-x-auto bg-white shadow-sm">
              <header className="flex flex-wrap items-center justify-between gap-2 bg-[#1f4e79] px-3 py-2 text-white">
                <p className="font-bold">
                  R{race.no} {race.name}
                </p>
                <p className="font-mono text-xs text-[#ffe566]">
                  {race.dist} · {race.time} · {race.code}
                </p>
              </header>
              <table className="w-full min-w-[720px] border-collapse text-[12px]">
                <thead>
                  <tr className="bg-[#d6dce4] text-left">
                    <th className="border border-[#8f8f8f] px-2 py-1.5">No</th>
                    <th className="border border-[#8f8f8f] px-2 py-1.5">Horse</th>
                    <th className="border border-[#8f8f8f] px-2 py-1.5">Jockey</th>
                    <th className="border border-[#8f8f8f] px-2 py-1.5 text-center">Night</th>
                    <th className="border border-[#8f8f8f] px-2 py-1.5 text-center">Morning</th>
                    <th className="border border-[#8f8f8f] px-2 py-1.5 text-center">Move</th>
                    <th className="border border-[#8f8f8f] px-2 py-1.5 text-center">Night call</th>
                    <th className="border border-[#8f8f8f] px-2 py-1.5 text-center">Tissue</th>
                    <th className="border border-[#8f8f8f] px-2 py-1.5 text-center">Sheet</th>
                  </tr>
                </thead>
                <tbody>
                  {(NIGHT_ODDS[race.no] ?? []).map((quote) => (
                    <TallyRow key={quote.cloth} raceNo={race.no} quote={quote} />
                  ))}
                </tbody>
              </table>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
