import type { ReactNode } from "react";
import { SHEET } from "./sheetData";
import { cardNo, dash, ltoTone, odds, signed, type LtoCell, type SheetRace, type SheetRunner } from "./lto";

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

function PickNum({ n, className }: { n: number; className: string }) {
  return (
    <span className={`inline-flex h-7 min-w-8 items-center justify-center border border-black/20 px-2 text-base font-bold ${className}`}>
      {n}
    </span>
  );
}

function RaceGrid({ race }: { race: SheetRace }) {
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
              <tr key={runner.cloth} className="odd:bg-white even:bg-[#fafafa]">
                <Td className="bg-[#fff3cc] font-bold">{runner.cloth}</Td>
                <Td className={`max-w-[14rem] truncate text-left font-bold ${nameClass(runner)}`} title={runner.name}>
                  {runner.filly ? `@ ${runner.name}` : runner.name}
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
                <Td className={`bg-[#c6efda] ${typeof runner.hcp === "number" && runner.hcp < 0 ? "text-[#006400] font-bold" : ""}`}>
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
                RESULTS
              </Td>
              <td className="border border-[#8f8f8f] bg-white" colSpan={13} />
            </tr>
            <tr>
              <Td className="bg-[#70ad47] py-2">
                <PickNum n={race.picks.win} className="bg-white" />
              </Td>
              <Td className="bg-[#ffd966]">
                <PickNum n={race.picks.plc} className="bg-white" />
              </Td>
              <Td className="bg-[#f4b183]">
                <PickNum n={race.picks.upset} className="bg-white" />
              </Td>
              <Td className="bg-[#c6efce] text-left" colSpan={3}>
                <span className="mr-3 font-bold">LTO RTG</span>
                {race.picks.lto.map((n) => (
                  <PickNum key={`lto-${n}`} n={n} className="mr-1 bg-[#70ad47] text-white" />
                ))}
              </Td>
              <Td className="bg-[#fff2cc] text-left" colSpan={3}>
                <span className="mr-3 font-bold">HCP RTG</span>
                {race.picks.hcpRtg.map((n) => (
                  <PickNum key={`hcp-${n}`} n={n} className="mr-1 bg-[#ffd966]" />
                ))}
              </Td>
              <Td className="bg-[#deebf7] text-left" colSpan={6}>
                <span className="mr-3 font-bold">SPEED RTG</span>
                {race.picks.speed.map((n) => (
                  <PickNum key={`spd-${n}`} n={n} className="mr-1 bg-[#5b9bd5] text-white" />
                ))}
              </Td>
              <td className="border border-[#8f8f8f] bg-[#ffff99]" colSpan={13} />
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-1 px-1 text-[11px] text-[#555]">
        {race.no}. {race.name} · {race.dist} · {race.time} · {race.class}
      </p>
    </section>
  );
}

export default function Sheet() {
  return (
    <div className="lto-sheet min-h-[100dvh] bg-[#e8e8e8] text-[#111]">
      <header className="bg-[#9c1c1c] px-3 py-3 text-center text-white md:px-6">
        <p className="text-sm font-bold tracking-[0.2em]">{SHEET.banner}</p>
        <h1 className="mt-1 text-xl font-bold tracking-wide text-[#ffe566] md:text-3xl">{SHEET.title}</h1>
        <p className="mt-1 font-mono text-sm">{SHEET.when}</p>
        <nav className="mt-3 flex flex-wrap justify-center gap-1">
          {SHEET.races.map((race) => (
            <a
              key={race.no}
              href={`#lto-${race.no}`}
              className="bg-white/10 px-2 py-1 font-mono text-[11px] hover:bg-white hover:text-[#9c1c1c]"
            >
              R{race.no} {race.code}
            </a>
          ))}
        </nav>
      </header>

      <div className="px-2 py-4 md:px-4">
        {SHEET.races.map((race) => (
          <RaceGrid key={race.no} race={race} />
        ))}
        <p className="max-w-[110ch] px-1 pb-8 text-[11px] leading-relaxed text-[#444]">
          {SHEET.source} {SHEET.note} Green names are the win / place / upset. Red names are long absences. @ marks
          fillies and mares. This is a form sheet, not betting advice.
        </p>
      </div>
    </div>
  );
}
