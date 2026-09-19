import type { ReactNode } from "react";
import type { MeetingBundle } from "./catalog";
import { parseClaim, withHandicap } from "./handicap";
import { Jump } from "./Jump";
import { cardNo, dash, ltoTone, odds, signed, type LtoCell, type SheetRace, type SheetRunner } from "./lto";
import { isFocus, type Location } from "./nav";
import {
  cardScore,
  finishFor,
  pickHit,
  posLabel,
  posTone,
  raceResult,
  type Finish,
  type RaceResult,
} from "./results";
import { swimFor, swimForRace, swimTone, type SwimEntry } from "./swim";

function hcpTone(hcpKg: number | null | undefined): string {
  if (typeof hcpKg !== "number" || hcpKg === 0) return "font-bold";
  if (hcpKg < 0) return "text-[#006400] font-bold";
  return "text-[#c00000] font-bold";
}

function hcpTitle(runner: SheetRunner): string | undefined {
  if (runner.hcp == null) return "No rateable last run (Indian kg: 1L = 1 kg at 1200m, 2 points = 1 kg)";
  const claim = parseClaim(runner.al);
  const last = runner.hcp - 2 * claim;
  const bits = [`Last-start PR ${last} (1 length = 1 kg at 1200m × dist/1200; 2 points = 1 kg)`];
  if (claim) bits.push(`${claim}kg claim = HCP ${runner.hcp}`);
  if (runner.bnc != null) bits.push(`official mark ${runner.bnc}`);
  if (typeof runner.hcpKg === "number" && runner.hcpKg !== 0) {
    bits.push(
      runner.hcpKg < 0
        ? `well-in ${-runner.hcpKg} kg vs official allotted`
        : `well-out ${runner.hcpKg} kg vs official allotted`,
    );
  }
  return bits.join(". ");
}

function Td({
  children,
  className = "",
  title,
  colSpan,
  rowSpan,
}: {
  children?: ReactNode;
  className?: string;
  title?: string;
  colSpan?: number;
  rowSpan?: number;
}) {
  return (
    <td colSpan={colSpan} rowSpan={rowSpan} className={`border border-[#8f8f8f] px-1.5 py-[3px] text-center ${className}`} title={title}>
      {children}
    </td>
  );
}

function Th({ children, className = "", colSpan }: { children?: ReactNode; className?: string; colSpan?: number }) {
  return (
    <th colSpan={colSpan} className={`border border-[#8f8f8f] px-1.5 py-[3px] font-bold ${className}`}>
      {children}
    </th>
  );
}

function LtoBlock({ run, green }: { run: LtoCell; green?: boolean }) {
  const ltoClass = green ? `bg-[#c6efce] ${ltoTone(run.lto)}` : ltoTone(run.lto);
  return (
    <>
      <Td>{dash(run.days)}</Td>
      <Td className="text-[#1f4e79]">{cardNo(run.card)}</Td>
      <Td className={run.pos === "###" ? "text-[#c000c0] font-bold" : ""}>{dash(run.pos)}</Td>
      <Td>{dash(run.odds)}</Td>
      <Td className={typeof run.btl === "number" && run.btl >= 15 ? "text-[#c00000]" : "text-[#2f5496]"}>
        {run.btl === null ? "-" : run.btl}
      </Td>
      <Td className={ltoClass}>{dash(run.lto, "###")}</Td>
    </>
  );
}

function nameClass(runner: SheetRunner): string {
  if (runner.tone === "pick") return "text-[#006400]";
  if (runner.tone === "risk") return "text-[#c00000]";
  if (runner.filly) return "text-[#0b6e4f]";
  return "text-[#1f4e79]";
}

function PickNum({
  n,
  raceNo,
  className,
  hit,
}: {
  n: number;
  raceNo: number;
  className: string;
  hit?: boolean;
}) {
  const mark = hit == null ? "" : hit ? " ✓" : " ✗";
  return (
    <Jump
      to={{ view: "sheet", race: raceNo, cloth: n }}
      title={`Highlight cloth ${n} on this race`}
      className={`inline-flex h-7 min-w-8 items-center justify-center border border-black/20 px-2 text-base font-bold hover:underline ${className} ${
        hit === true ? "ring-2 ring-[#006400]" : hit === false ? "ring-2 ring-[#c00000]" : ""
      }`}
    >
      {n}
      {mark}
    </Jump>
  );
}

function ResultTag({ finish }: { finish: Finish | undefined }) {
  if (!finish) return null;
  const sp = finish.sp ? ` · SP ${finish.sp}` : "";
  return (
    <span
      className={`ml-1 font-mono text-[10px] ${posTone(finish)}`}
      title={
        finish.dnf
          ? `Did not finish${sp}`
          : `Official ${posLabel(finish)}${
              finish.beaten ? (/^\d/.test(finish.beaten) ? `, beaten ${finish.beaten}L` : `, ${finish.beaten}`) : ""
            }${sp}`
      }
    >
      {" "}
      {posLabel(finish)}
      {finish.sp ? ` ${finish.sp}` : ""}
    </span>
  );
}

function resultLine(race: SheetRace, bag: RaceResult[]): string {
  const got = raceResult(race.no, bag);
  if (!got) return "RESULTS";
  const nameOf = (cloth: number) => race.runners.find((runner) => runner.cloth === cloth)?.name ?? String(cloth);
  return `RESULTS 1st ${got.first} ${nameOf(got.first)} · 2nd ${got.second} ${nameOf(got.second)} · 3rd ${got.third} ${nameOf(got.third)} · ${got.winTime}`;
}

function RaceGrid({
  race,
  loc,
  results,
  swimList,
}: {
  race: SheetRace;
  loc: Location;
  results: RaceResult[];
  swimList: SwimEntry[];
}) {
  const label = String(race.no).padStart(2, "0");
  return (
    <section id={`lto-${race.no}`} className="mb-6 scroll-mt-14">
      <div className="overflow-x-auto bg-white shadow-sm">
        <table className="w-max min-w-full border-collapse text-[11px] leading-tight">
          <thead>
            <tr>
              <Th className="bg-[#7a1212] text-lg text-white">{race.official}</Th>
              <Th className="bg-[#9c1c1c] text-left text-sm tracking-wide text-white" colSpan={3}>
                RACE {label}
              </Th>
              <Th className="bg-[#ffe566] text-sm" colSpan={2}>
                {race.code}
              </Th>
              <Th className="bg-[#c6efce]">{race.field}</Th>
              <Th className="bg-[#f7c7d0]">Nty</Th>
              <Th className="bg-[#fff3cc]">Open</Th>
              <Th className="bg-[#b7d7ea]" colSpan={2}>
                TIME {race.timeCode}
              </Th>
              <Th className="bg-white">0</Th>
              <Th className="bg-[#ffff66]">RTG</Th>
              <Th className="bg-[#b7d7ea]">D/P</Th>
              <th className="border border-[#8f8f8f] bg-[#9c1c1c] px-2 text-white">R{race.no}</th>
              <Th className="bg-[#ffe566]" colSpan={2}>
                {race.code}
              </Th>
              <th className="border border-[#8f8f8f] bg-white" colSpan={12} />
            </tr>
            <tr className="bg-[#9c1c1c] text-[10px] uppercase tracking-wide text-white">
              <Th className="bg-[#9c1c1c] text-white">R{race.no}</Th>
              <Th className="bg-[#9c1c1c] text-left text-white">Trade name</Th>
              <Th className="bg-[#9c1c1c] text-white">Trainer</Th>
              <Th className="bg-[#9c1c1c] text-white">Jockey</Th>
              <Th className="bg-[#548235] text-white" colSpan={6}>
                2 LTO
              </Th>
              <Th className="bg-[#375623] text-white" colSpan={6}>
                1 LTO
              </Th>
              <Th className="bg-[#bf8f00] text-white">BNC RTG</Th>
              <Th className="bg-[#c45911] text-white">Nty Aprx Odds</Th>
              <Th className="bg-[#bf8f00] text-white">Open Aprx Odds</Th>
              <Th className="bg-[#2e75b6] text-white">Speed RTG</Th>
              <Th className="bg-[#548235] text-white">TRACK</Th>
              <Th className="bg-[#9c1c1c] text-white">DR</Th>
              <Th className="bg-[#9c1c1c] text-white">AIE</Th>
              <Th className="bg-[#c45911] text-white">RTG +/-</Th>
              <Th className="bg-[#2e75b6] text-white">D/P +/-</Th>
              <Th className="bg-[#548235] text-white">HCP</Th>
              <Th className="bg-[#bf8f00] text-white">DIST</Th>
              <Th className="bg-[#c45911] text-white">WTG</Th>
              <Th className="bg-[#548235] text-white">CLS</Th>
            </tr>
            <tr className="bg-[#f2f2f2] text-[10px] text-[#333]">
              <Th className="bg-[#f2f2f2]" />
              <Th className="bg-[#f2f2f2]" />
              <Th className="bg-[#f2f2f2]" />
              <Th className="bg-[#f2f2f2]" />
              {["Days", "Card", "POS", "ODS", "Btl", "2 LTO", "Days", "Card No", "POS", "ODS", "Btl", "1 LTO"].map((label) => (
                <Th key={label} className={label.includes("LTO") ? "bg-[#c6efce]" : "bg-[#f2f2f2]"}>
                  {label}
                </Th>
              ))}
              <Th className="bg-[#ffff66]" />
              <Th className="bg-[#f7c7d0]" />
              <Th className="bg-[#fff3cc]" />
              <Th className="bg-[#b7d7ea]" />
              <Th className="bg-[#a9d08e]" />
              <Th className="bg-[#f2f2f2]" />
              <Th className="bg-[#fff3cc]" />
              <Th className="bg-[#f7c7d0]" />
              <Th className="bg-[#b7d7ea]" />
              <Th className="bg-[#c6efda]" />
              <Th className="bg-[#ffe699]" />
              <Th className="bg-[#f8cbad]" />
              <Th className="bg-[#e2efda]" />
            </tr>
          </thead>
          <tbody>
            {race.runners.map((runner) => (
              <tr
                key={runner.cloth}
                id={`lto-${race.no}-h${runner.cloth}`}
                className={`scroll-mt-16 odd:bg-white even:bg-[#fafafa] ${isFocus(loc, race.no, runner.cloth) ? "horse-focus" : ""}`}
              >
                <Td className="bg-[#fff3cc] font-bold">{runner.cloth}</Td>
                <Td className={`max-w-[16rem] truncate text-left font-bold ${nameClass(runner)}`} title={runner.name}>
                  <Jump
                    to={{ view: "guide", race: race.no, cloth: runner.cloth }}
                    title="Open pretissue card"
                    className="hover:underline"
                  >
                    {runner.filly ? `@ ${runner.name}` : runner.name}
                  </Jump>
                  <ResultTag finish={finishFor(race.no, runner.cloth, results)} />
                  {(() => {
                    const swim = swimFor(race.no, runner.cloth, swimList);
                    return swim ? (
                      <span className={`ml-1 inline-block px-1 text-[9px] font-bold ${swimTone(swim.kind)}`} title={swim.note}>
                        SW {swim.tag}
                      </span>
                    ) : null;
                  })()}
                </Td>
                <Td className="max-w-[9rem] truncate text-left" title={runner.trainer}>
                  {runner.trainer}
                </Td>
                <Td className="max-w-[8rem] truncate text-left" title={runner.jockey}>
                  {runner.jockey}
                </Td>
                <LtoBlock run={runner.l2} green />
                <LtoBlock run={runner.l1} green />
                <Td className="bg-[#ffff66] font-bold">{dash(runner.bnc)}</Td>
                <Td className="bg-[#f7c7d0]">{odds(runner.nty)}</Td>
                <Td className="bg-[#fff3cc]">{odds(runner.open)}</Td>
                <Td className="bg-[#b7d7ea] font-bold text-[#1f4e79]">{dash(runner.speed)}</Td>
                <Td className="bg-[#a9d08e]">{runner.track || "-"}</Td>
                <Td>{runner.draw}</Td>
                <Td className="bg-[#fff3cc]">{runner.age}</Td>
                <Td className="bg-[#f7c7d0]">{signed(runner.rtgCh)}</Td>
                <Td className="bg-[#b7d7ea]">{signed(runner.dp)}</Td>
                <Td className={`bg-[#c6efda] ${hcpTone(runner.hcpKg)}`} title={hcpTitle(runner)}>
                  {dash(runner.hcp)}
                </Td>
                <Td className="bg-[#ffe699]">{signed(runner.distDelta)}</Td>
                <Td className="bg-[#f8cbad]">{signed(runner.wtDelta)}</Td>
                <Td className="bg-[#e2efda]">{runner.cls}</Td>
              </tr>
            ))}
            <tr>
              <Td className="bg-[#1f4e79] text-[10px] font-bold uppercase tracking-wide text-white" rowSpan={2}>
                Premium
                <br />
                elite
                <br />
                selections
              </Td>
              <Td className="bg-[#70ad47] text-sm font-bold text-white">WIN</Td>
              <Td className="bg-[#ffd966] text-sm font-bold">PLC</Td>
              <Td className="bg-[#f4b183] text-sm font-bold">UPSET</Td>
              <Td className="bg-[#70ad47] text-left font-bold text-white" colSpan={6}>
                LTO RTG
              </Td>
              <Td className="bg-[#fff3cc] text-left font-bold" colSpan={6}>
                {resultLine(race, results)}
              </Td>
              <td className="border border-[#8f8f8f] bg-white" colSpan={13} />
            </tr>
            <tr>
              <Td className="bg-[#70ad47] py-2">
                <PickNum n={race.picks.win} raceNo={race.no} className="bg-white" hit={results.length ? pickHit("win", race.picks.win, race.no, results) : undefined} />
              </Td>
              <Td className="bg-[#ffd966]">
                <PickNum n={race.picks.plc} raceNo={race.no} className="bg-white" hit={results.length ? pickHit("plc", race.picks.plc, race.no, results) : undefined} />
              </Td>
              <Td className="bg-[#f4b183]">
                <PickNum n={race.picks.upset} raceNo={race.no} className="bg-white" hit={results.length ? pickHit("upset", race.picks.upset, race.no, results) : undefined} />
              </Td>
              <Td className="bg-[#c6efce] text-left" colSpan={3}>
                <span className="mr-3 font-bold">LTO RTG</span>
                {race.picks.lto.map((n) => (
                  <PickNum key={`lto-${n}`} n={n} raceNo={race.no} className="mr-1 bg-[#70ad47] text-white" />
                ))}
              </Td>
              <Td className="bg-[#fff2cc] text-left" colSpan={3}>
                <span className="mr-3 font-bold">HCP RTG</span>
                {race.picks.hcpRtg.map((n) => (
                  <PickNum key={`hcp-${n}`} n={n} raceNo={race.no} className="mr-1 bg-[#ffd966]" />
                ))}
              </Td>
              <Td className="bg-[#deebf7] text-left" colSpan={6}>
                <span className="mr-3 font-bold">SPEED RTG</span>
                {race.picks.speed.map((n) => (
                  <PickNum key={`spd-${n}`} n={n} raceNo={race.no} className="mr-1 bg-[#5b9bd5] text-white" />
                ))}
              </Td>
              <td className="border border-[#8f8f8f] bg-[#ffff99]" colSpan={13} />
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-1 px-1 text-[11px] text-[#555]">
        {race.no}. {race.name} · {race.dist} · {race.time} · {race.class}
        {raceResult(race.no, results) ? ` · official ${raceResult(race.no, results)?.winTime}` : ""}
      </p>
      {raceResult(race.no, results) ? (
        <p className="mt-1 max-w-[110ch] px-1 text-[11px] leading-relaxed text-[#333]">
          <span className="font-bold">What went wrong. </span>
          {raceResult(race.no, results)?.note}
        </p>
      ) : null}
      {swimForRace(race.no, swimList).length ? (
        <ul className="mt-1 space-y-0.5 px-1 text-[11px] text-[#444]">
          {swimForRace(race.no, swimList).map((swim) => {
            const name = race.runners.find((runner) => runner.cloth === swim.cloth)?.name ?? `H${swim.cloth}`;
            return (
              <li key={swim.cloth}>
                <span className={`mr-1 inline-block px-1 font-bold ${swimTone(swim.kind)}`}>SW {swim.tag}</span>
                <Jump to={{ view: "sheet", race: race.no, cloth: swim.cloth }} className="font-bold hover:underline">
                  {swim.cloth}. {name}
                </Jump>
                : {swim.note}
              </li>
            );
          })}
        </ul>
      ) : null}
    </section>
  );
}

export default function Sheet({ loc, meeting }: { loc: Location; meeting: MeetingBundle }) {
  const sheet = meeting.sheet;
  const scored = meeting.results.length > 0;
  const score = cardScore(
    sheet.races.map((race) => race.picks),
    meeting.results,
  );
  return (
    <div className="lto-sheet min-h-[100dvh] bg-[#e8e8e8] text-[#111]">
      <header className="bg-[#9c1c1c] px-3 py-3 text-center text-white md:px-6">
        <p className="text-sm font-bold tracking-[0.2em]">{sheet.banner}</p>
        <h1 className="mt-1 text-xl font-bold tracking-wide text-[#ffe566] md:text-3xl">{sheet.title}</h1>
        <p className="mt-1 font-mono text-sm">{sheet.when}</p>
        <p className="mt-2 font-mono text-sm text-[#ffe566]">
          {scored
            ? `RESULTS IN · WIN ${score.win}/${score.n} · PLC ${score.plc}/${score.n} · UPSET ${score.upset}/${score.n}`
            : `PRE-RACE · ${sheet.races.length} CARD · HCP / LTO MODEL`}
        </p>
        <nav className="mt-3 flex flex-wrap justify-center gap-1">
          {sheet.races.map((race) => (
            <Jump
              key={race.no}
              to={{ view: "sheet", race: race.no, cloth: null }}
              className="bg-white/10 px-2 py-1 font-mono text-[11px] hover:bg-white hover:text-[#9c1c1c]"
            >
              R{race.no} {race.code}
            </Jump>
          ))}
        </nav>
      </header>

      <div className="px-2 py-4 md:px-4">
        {sheet.races.map((race) => (
          <RaceGrid
            key={race.no}
            race={withHandicap(race)}
            loc={loc}
            results={meeting.results}
            swimList={meeting.swim}
          />
        ))}
        <p className="max-w-[110ch] px-1 pb-8 text-[11px] leading-relaxed text-[#444]">
          {sheet.source} {sheet.note} {meeting.resultSource} Click a name for the pretissue card. Green names are the
          win / place / upset. Red names are long absences. @ marks fillies and mares. This is a form sheet, not betting
          advice.
        </p>
      </div>
    </div>
  );
}
