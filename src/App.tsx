import { useEffect, useMemo, useState } from "react";
import {
  CaretDown,
  Flag,
  Hash,
  Lightning,
  MapPin,
  Scales,
  Timer,
  Trophy,
  Waves,
} from "@phosphor-icons/react";
import { EQ, type Race, type Runner } from "./data";
import { Jump } from "./Jump";
import NightOdds from "./NightOdds.tsx";
import Sheet from "./Sheet";
import { centersOn, dateTabs, meetingFor, type MeetingBundle } from "./catalog";
import { findByName, formatHash, go, isFocus, parseHash, scrollToLocation, type Location, type View } from "./nav";
import { cardScore, finishFor, posLabel, raceResult, type Finish, type RaceResult } from "./results";
import { swimFor, swimTone, type SwimEntry } from "./swim";

function useHashLocation(): Location {
  const [loc, setLoc] = useState(() => parseHash(window.location.hash));
  useEffect(() => {
    const onHash = () => setLoc(parseHash(window.location.hash));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  useEffect(() => {
    const timer = window.setTimeout(() => scrollToLocation(loc), 50);
    return () => window.clearTimeout(timer);
  }, [loc.view, loc.race, loc.cloth]);
  return loc;
}

function MeetingBar({ loc, meeting }: { loc: Location; meeting: MeetingBundle }) {
  const dates = dateTabs();
  const centers = centersOn(loc.date);
  const view: View = loc.view === "night" && !meeting.hasNight ? "sheet" : loc.view;
  const btn = (id: View, label: string) => (
    <button
      type="button"
      onClick={() => go({ view: id, race: loc.race, cloth: loc.cloth })}
      className={`px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide ${
        view === id ? "bg-[#ffe566] text-[#111]" : "bg-white/10 text-white hover:bg-white/20"
      }`}
    >
      {label}
    </button>
  );
  return (
    <div className="no-print sticky top-0 z-30 space-y-2 bg-[#1a1212] px-3 py-2 md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex overflow-hidden border border-white/20">
          {dates.map((tab) => {
            const active = loc.date === tab.date;
            return (
              <button
                key={tab.date}
                type="button"
                onClick={() => {
                  const next = centersOn(tab.date)[0];
                  go({
                    date: tab.date,
                    center: next.center,
                    view: next.hasNight ? "night" : "sheet",
                    race: null,
                    cloth: null,
                  });
                }}
                className={`px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide ${
                  active ? "bg-[#ffe566] text-[#111]" : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
        <label className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wide text-[#ffe566]">
          Center
          <select
            value={meeting.center}
            onChange={(event) => {
              const center = event.target.value as MeetingBundle["center"];
              const next = meetingFor(loc.date, center);
              go({
                center: next.center,
                view: next.hasNight ? view : view === "night" ? "sheet" : view,
                race: null,
                cloth: null,
              });
            }}
            className="border border-white/20 bg-[#1a1212] px-2 py-1 text-white"
          >
            {centers.map((item) => (
              <option key={item.id} value={item.center}>
                {item.centerLabel}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[11px] uppercase tracking-wide text-[#ffe566]">
          {meeting.short} {meeting.meta.date}
          {meeting.results.length ? " · results" : " · pretissue"}
        </p>
        <div className="flex overflow-hidden border border-white/20">
          {meeting.hasNight ? btn("night", "Odds") : null}
          {btn("sheet", "LTO sheet")}
          {btn("guide", "Pretissue")}
        </div>
      </div>
    </div>
  );
}

function eqLabel(code: string) {
  if (!code) return "none";
  return code
    .split("-")
    .map((part) => EQ[part] ?? part)
    .join(", ");
}

function rankTone(rank: number) {
  if (rank === 1) return "text-gold-2";
  if (rank === 2) return "text-paper";
  if (rank === 3) return "text-win";
  return "text-mute";
}

function finishTone(finish: Finish | undefined): string {
  if (!finish) return "text-mute";
  if (finish.dnf) return "text-warn";
  if (finish.pos === 1) return "text-gold";
  if (finish.pos === 2 || finish.pos === 3) return "text-paper";
  return "text-mute";
}

function RunnerCard({
  runner,
  raceNo,
  open,
  focused,
  onToggle,
  results,
  swimList,
}: {
  runner: Runner;
  raceNo: number;
  open: boolean;
  focused: boolean;
  onToggle: () => void;
  results: RaceResult[];
  swimList: SwimEntry[];
}) {
  const swim = swimFor(raceNo, runner.cloth, swimList);
  const finish = finishFor(raceNo, runner.cloth, results);
  return (
    <article
      id={`race-${raceNo}-h${runner.cloth}`}
      className={`scroll-mt-24 border-t border-line ${focused ? "horse-focus" : ""}`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="grid w-full grid-cols-[2.25rem_2.25rem_minmax(0,1fr)_auto] items-center gap-3 px-3 py-3 text-left md:grid-cols-[2.5rem_2.5rem_minmax(0,1.6fr)_4.5rem_7rem_4.5rem_3.5rem_4rem_auto] md:px-4"
        aria-expanded={open}
      >
        <span className="font-mono text-lg font-medium text-gold-2">{runner.cloth}</span>
        <span className="font-mono text-sm text-mute" title="Barrier">
          {runner.draw}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-[15px] font-medium tracking-tight text-paper">
            {runner.name}
            {finish ? (
              <span className={`ml-2 font-mono text-xs ${finishTone(finish)}`}>
                {" "}
                {posLabel(finish)}
                {finish.sp ? ` ${finish.sp}` : ""}
              </span>
            ) : null}
            {runner.al ? <span className="ml-2 font-mono text-xs text-warn">app {runner.al}</span> : null}
            {swim ? <span className="ml-2 font-mono text-xs text-warn">swim {swim.tag}</span> : null}
          </span>
          <span className="block truncate text-xs text-mute">
            {runner.age} · {runner.trainer} · {runner.jockey}
          </span>
        </span>
        <span className="hidden font-mono text-sm md:block">{runner.wt}kg</span>
        <span className="hidden truncate text-xs text-mute md:block">{runner.eq || "plain"}</span>
        <span className="hidden font-mono text-xs text-mute md:block">{runner.rtg}</span>
        <span className={`hidden font-mono text-sm md:block ${rankTone(runner.rank)}`}>{runner.rank}</span>
        <span className="font-mono text-sm text-gold">{runner.tissue}</span>
        <CaretDown size={16} className={`text-mute transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? (
        <div className="space-y-4 bg-panel-2 px-3 py-4 md:px-5">
          <p className="flex flex-wrap gap-3 font-mono text-xs uppercase tracking-wide">
            <Jump to={{ view: "night", race: raceNo, cloth: runner.cloth }} className="text-gold hover:underline">
              Night odds
            </Jump>
            <Jump to={{ view: "sheet", race: raceNo, cloth: runner.cloth }} className="text-gold hover:underline">
              LTO sheet
            </Jump>
          </p>
          <p className="max-w-[72ch] text-sm leading-relaxed text-paper/90">{runner.verdict}</p>
          <div className="grid gap-3 text-xs text-mute md:grid-cols-3">
            <p>
              <span className="text-paper">Pedigree.</span> {runner.pedigree}
            </p>
            <p>
              <span className="text-paper">Gear.</span> {runner.shoes === "A" ? "aluminium" : "steel"} · {eqLabel(runner.eq)}
            </p>
            <p>
              <span className="text-paper">Last 5.</span> {runner.last5}
            </p>
            {swim ? (
              <p>
                <span className="text-paper">HYD pool.</span> {swim.days.join(", ")} Sep. {swim.note}
              </p>
            ) : null}
          </div>
          <p className="max-w-[72ch] text-sm leading-relaxed text-mute">
            <span className="text-paper">Similar-race line. </span>
            {runner.similar}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-xs">
              <thead className="text-mute">
                <tr className="border-b border-line">
                  <th className="py-2 font-medium">Date</th>
                  <th className="font-medium">Track</th>
                  <th className="font-medium">Trip</th>
                  <th className="font-medium">Pos</th>
                  <th className="font-medium">Btn</th>
                  <th className="font-medium">Wt</th>
                  <th className="font-medium">SP</th>
                  <th className="font-medium">Winner</th>
                </tr>
              </thead>
              <tbody>
                {runner.form.length ? (
                  runner.form.map((run) => (
                    <tr key={`${runner.name}-${run.date}-${run.dist}`} className="border-b border-line/70">
                      <td className="py-2 font-mono">{run.date}</td>
                      <td>{run.venue}</td>
                      <td className="font-mono">
                        {run.dist} {run.cls}
                      </td>
                      <td className="font-mono">
                        {run.pos}/{run.field}
                      </td>
                      <td className="font-mono">{run.beaten}</td>
                      <td className="font-mono">{run.wt}</td>
                      <td className="font-mono">{run.odds}</td>
                      <td>{run.winner}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-3 text-mute">
                      No race form. Trackwork only.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {runner.form.some((run) => run.note) ? (
            <ul className="space-y-1 text-xs text-warn">
              {runner.form
                .filter((run) => run.note)
                .map((run) => (
                  <li key={run.note}>{run.note}</li>
                ))}
            </ul>
          ) : null}
          {runner.work.length ? (
            <div>
              <p className="mb-2 text-xs font-medium text-paper">Trackwork</p>
              <ul className="space-y-2">
                {runner.work.map((work) => (
                  <li key={`${runner.name}-${work.date}-${work.clock}`} className="text-xs leading-relaxed text-mute">
                    <span className="font-mono text-paper">{work.date}</span> · {work.venue} · {work.clock}. {work.note}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-xs text-mute">No recent published work of note.</p>
          )}
        </div>
      ) : null}
    </article>
  );
}

function RaceSection({ race, loc, meeting }: { race: Race; loc: Location; meeting: MeetingBundle }) {
  const ranked = useMemo(() => [...race.runners].sort((a, b) => a.rank - b.rank), [race.runners]);
  const top = ranked.slice(0, 3);
  const rank1 = ranked[0]?.cloth ?? null;
  const focusedHere = loc.view === "guide" && loc.race === race.no;
  const openId = focusedHere ? (loc.cloth ?? rank1) : rank1;
  const got = raceResult(race.no, meeting.results);

  return (
    <section id={`race-${race.no}`} className="scroll-mt-24 border-t border-line">
      <header className="grid gap-6 px-4 py-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:px-8">
        <div>
          <p className="font-mono text-xs text-gold">
            Race {race.no} · ({race.official}) · {race.time}
            {got ? ` · official ${got.winTime}` : ""}
          </p>
          <h2 className="mt-2 max-w-[18ch] text-3xl font-medium leading-[1.1] tracking-tight md:text-4xl">
            {race.name}
          </h2>
          <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-mute">{race.class}</p>
          <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2 text-sm md:grid-cols-3">
            <div>
              <dt className="text-mute">Distance</dt>
              <dd className="font-mono">{race.dist}</dd>
            </div>
            <div>
              <dt className="text-mute">Purse</dt>
              <dd className="font-mono">{race.purse}</dd>
            </div>
            <div className="col-span-2 md:col-span-1">
              <dt className="text-mute">Record</dt>
              <dd className="text-sm">{race.record}</dd>
            </div>
          </dl>
        </div>
        <div className="space-y-4 bg-panel p-4">
          <p className="text-sm leading-relaxed text-paper/90">{race.shape}</p>
          <p className="text-sm leading-relaxed text-mute">
            <span className="text-paper">What similar races said. </span>
            {race.similarRace}
          </p>
          {race.nap ? (
            <p className="font-mono text-xs uppercase tracking-wide text-gold">Day's nap</p>
          ) : null}
          {got ? (
            <p className="text-sm leading-relaxed text-mute">
              <span className="text-paper">Official. </span>
              1st {got.first} · 2nd {got.second} · 3rd {got.third} · {got.winTime}
            </p>
          ) : null}
        </div>
      </header>

      <div className="px-4 md:px-8">
        <div className="grid gap-px bg-line md:grid-cols-3">
          {top.map((runner, i) => (
            <div key={runner.cloth} className="bg-panel p-4">
              <p className="font-mono text-xs text-mute">{i === 0 ? "Win" : i === 1 ? "Danger" : "Place"}</p>
              <p className="mt-1 text-lg font-medium tracking-tight">
                <Jump to={{ view: "sheet", race: race.no, cloth: runner.cloth }} className="hover:text-gold">
                  {runner.cloth}. {runner.name}
                </Jump>
                {(() => {
                  const finish = finishFor(race.no, runner.cloth, meeting.results);
                  return finish ? (
                    <span className={`ml-2 font-mono text-xs ${finishTone(finish)}`}>{posLabel(finish)}</span>
                  ) : null;
                })()}
              </p>
              <p className="mt-1 font-mono text-gold">{runner.tissue}</p>
              <p className="mt-2 text-xs text-mute">
                bar {runner.draw} · {runner.wt}kg {runner.al ? `· claim ${runner.al}` : ""} · {runner.jockey}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-mute">
          <span className="text-paper">Tissue. </span>
          {race.tissueNote} IndiaRace: {race.irPick}. This sheet: {race.ourPick}. Original WIN pick is unchanged.
        </p>
        {got ? (
          <p className="mt-2 max-w-[72ch] text-sm leading-relaxed text-mute">
            <span className="text-paper">What went wrong. </span>
            {got.note}
          </p>
        ) : null}
      </div>

      <div className="mt-6 border-y border-line">
        <div className="hidden grid-cols-[2.5rem_2.5rem_minmax(0,1.6fr)_4.5rem_7rem_4.5rem_3.5rem_4rem_auto] gap-3 px-4 py-2 text-[11px] uppercase tracking-wide text-mute md:grid">
          <span>No</span>
          <span>Bar</span>
          <span>Horse</span>
          <span>Wt</span>
          <span>Gear</span>
          <span>Rtg</span>
          <span>Rk</span>
          <span>Tissue</span>
          <span />
        </div>
        {race.runners.map((runner) => (
          <RunnerCard
            key={runner.cloth}
            raceNo={race.no}
            runner={runner}
            open={openId === runner.cloth}
            focused={isFocus(loc, race.no, runner.cloth)}
            results={meeting.results}
            swimList={meeting.swim}
            onToggle={() =>
              go({
                view: "guide",
                race: race.no,
                cloth: openId === runner.cloth ? null : runner.cloth,
              })
            }
          />
        ))}
      </div>
    </section>
  );
}

function GearNotes({ meeting }: { meeting: MeetingBundle }) {
  const claims = meeting.races.flatMap((race) =>
    race.runners.filter((runner) => runner.al).map((runner) => `${runner.name} R${race.no} (${runner.al})`),
  );
  const steel = meeting.races.flatMap((race) =>
    race.runners.filter((runner) => runner.shoes === "S").map((runner) => runner.name),
  );
  return (
    <section className="border-t border-line px-4 py-10 md:px-8">
      <h2 className="text-2xl font-medium tracking-tight">Apprentice, steel, gear</h2>
      <div className="mt-5 grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-medium">
            <Hash size={16} /> Claims
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-mute">
            {claims.length ? claims.join(" · ") : "No published apprentice claims on this card."}
          </p>
        </div>
        <div>
          <h3 className="flex items-center gap-2 text-sm font-medium">
            <Timer size={16} /> Steel shoes
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-mute">
            {steel.length ? `${steel.join(", ")}. Treat steel as a negative unless the horse is a wet specialist.` : "No steel shoes listed."}
          </p>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const loc = useHashLocation();
  const meeting = meetingFor(loc.date, loc.center);
  const view: View = loc.view === "night" && !meeting.hasNight ? "sheet" : loc.view;
  const races = meeting.races;
  const meta = meeting.meta;
  const dayBest = findByName(meta.dayBest, races);
  const nextBest = findByName(meta.nextBest, races);
  const longshot = findByName(meta.longshot, races);

  if (view === "night" && meeting.hasNight) {
    return (
      <>
        <MeetingBar loc={loc} meeting={meeting} />
        <NightOdds loc={loc} meeting={meeting} />
      </>
    );
  }

  if (view === "sheet") {
    return (
      <>
        <MeetingBar loc={loc} meeting={meeting} />
        <Sheet loc={loc} meeting={meeting} />
      </>
    );
  }

  const scored = meeting.results.length > 0;
  const score = cardScore(
    meeting.sheet.races.map((race) => race.picks),
    meeting.results,
  );

  return (
    <div className="min-h-[100dvh] bg-ink text-paper">
      <MeetingBar loc={loc} meeting={meeting} />
      <header className="border-b border-line">
        <div className="flex items-center justify-between gap-4 px-4 py-4 md:px-8">
          <p className="font-mono text-xs uppercase tracking-wide text-gold">{meeting.short} pretissue</p>
          <p className="hidden text-xs text-mute md:block">{meta.date}</p>
          <Jump to={{ view: "guide", race: null, cloth: null }} className="text-sm text-paper underline decoration-gold/50 underline-offset-4">
            Open card
          </Jump>
        </div>
        <div className="grid gap-8 px-4 pb-10 pt-6 md:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)] md:px-8">
          <div>
            <p className="text-sm text-mute">
              {meta.venue} · first {meta.first}
            </p>
            <h1 className="mt-3 max-w-[16ch] text-4xl font-medium leading-[1.05] tracking-tight md:text-6xl">{meta.date}</h1>
            <p className="mt-4 max-w-[42ch] text-sm leading-relaxed text-mute">
              {scored
                ? `Results in from IndiaRace. Original WIN / PLC / UPSET cloths are unchanged. Score: WIN ${score.win}/${score.n} · PLC ${score.plc}/${score.n} · UPSET ${score.upset}/${score.n}. ${meeting.resultSource}`
                : `Same HCP / LTO model as the Hyderabad Saturday sheet. Tissue is a 120% book. IndiaRace selections are quoted where published.`}
            </p>
          </div>
          <dl className="grid grid-cols-1 gap-4 self-end">
            <div className="border-t border-line pt-3">
              <dt className="flex items-center gap-2 text-xs text-mute">
                <Lightning size={14} /> Day's best
              </dt>
              <dd className="mt-1 text-xl font-medium">
                {dayBest ? (
                  <Jump to={{ view: "sheet", race: dayBest.race, cloth: dayBest.cloth }} className="hover:text-gold">
                    {meta.dayBest} <span className="font-mono text-sm text-gold">R{meta.dayBestRace}</span>
                  </Jump>
                ) : (
                  <>
                    {meta.dayBest} <span className="font-mono text-sm text-gold">R{meta.dayBestRace}</span>
                  </>
                )}
              </dd>
            </div>
            <div className="border-t border-line pt-3">
              <dt className="text-xs text-mute">Next best / price</dt>
              <dd className="mt-1">
                {nextBest ? (
                  <Jump to={{ view: "sheet", race: nextBest.race, cloth: nextBest.cloth }} className="hover:text-gold">
                    {meta.nextBest}
                  </Jump>
                ) : (
                  meta.nextBest
                )}
                {" · "}
                {longshot ? (
                  <Jump to={{ view: "sheet", race: longshot.race, cloth: longshot.cloth }} className="hover:text-gold">
                    {meta.longshot}
                  </Jump>
                ) : (
                  meta.longshot
                )}
              </dd>
            </div>
            <div className="border-t border-line pt-3">
              <dt className="text-xs text-mute">IndiaRace day's best</dt>
              <dd className="mt-1 font-mono text-sm">{meta.irDayBest}</dd>
            </div>
          </dl>
        </div>
      </header>

      <nav className="sticky top-[6.5rem] z-20 border-b border-line bg-ink/95 backdrop-blur">
        <ul className="flex gap-1 overflow-x-auto px-2 py-2 md:px-8">
          {races.map((race) => (
            <li key={race.no}>
              <a
                href={formatHash({ ...loc, view: "guide", race: race.no, cloth: null })}
                onClick={(event) => {
                  event.preventDefault();
                  go({ view: "guide", race: race.no, cloth: null });
                }}
                className={`block whitespace-nowrap px-3 py-2 font-mono text-xs ${
                  loc.race === race.no ? "bg-panel text-gold" : "text-mute hover:text-paper"
                }`}
              >
                R{race.no} {race.dist}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <section id="card" className="grid gap-px bg-line md:grid-cols-3">
        <div className="bg-ink p-5 md:p-8">
          <p className="flex items-center gap-2 text-xs text-mute">
            <MapPin size={14} /> Venue
          </p>
          <p className="mt-2 text-lg">{meta.venue}</p>
          <p className="mt-3 text-sm leading-relaxed text-mute">{meta.going}</p>
        </div>
        <div className="bg-ink p-5 md:p-8">
          <p className="flex items-center gap-2 text-xs text-mute">
            <Scales size={14} /> How this sheet is built
          </p>
          <p className="mt-3 text-sm leading-relaxed text-mute">
            IndiaRace card plus previous-runs-with-track, relative performance, and published trackwork. Tissue prices
            are a 120% book, not official odds. Claims, steel shoes, and terms-vs-rating swings are weighted as heavily
            as last-start position.
          </p>
        </div>
        <div className="bg-ink p-5 md:p-8">
          <p className="flex items-center gap-2 text-xs text-mute">
            <Trophy size={14} /> Feature
          </p>
          <p className="mt-2 text-lg">{meta.feature ?? meeting.sheet.races[0]?.name}</p>
          <p className="mt-3 text-sm leading-relaxed text-mute">
            {meeting.extraCopy
              ? "2400m, 04:15 PM. Last year Star Of Night (4yo, light) beat Dyf (8/13, 60kg). Same tax sits on Duke of Tuscany this year. Zuccaro gets the terms."
              : races.find((race) => race.nap)?.class ?? meeting.sheet.races.find((race) => race.no === meta.dayBestRace)?.class}
          </p>
        </div>
      </section>

      <section className="px-4 py-8 md:px-8">
        <h2 className="text-2xl font-medium tracking-tight">Tissue strip</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-xs text-mute">
              <tr className="border-b border-line">
                <th className="py-2 font-medium">Race</th>
                <th className="font-medium">Win</th>
                <th className="font-medium">2</th>
                <th className="font-medium">3</th>
                <th className="font-medium">IndiaRace</th>
              </tr>
            </thead>
            <tbody>
              {races.map((race) => {
                const ranked = [...race.runners].sort((a, b) => a.rank - b.rank);
                return (
                  <tr key={race.no} className="border-b border-line/80">
                    <td className="py-3">
                      <Jump to={{ view: "guide", race: race.no, cloth: null }} className="hover:text-gold">
                        <span className="font-mono text-gold">R{race.no}</span> {race.name}
                      </Jump>
                    </td>
                    <td className="font-medium">
                      {ranked[0] ? (
                        <Jump to={{ view: "sheet", race: race.no, cloth: ranked[0].cloth }} className="hover:text-gold">
                          {ranked[0].name} <span className="font-mono text-gold">{ranked[0].tissue}</span>
                        </Jump>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      {ranked[1] ? (
                        <Jump to={{ view: "sheet", race: race.no, cloth: ranked[1].cloth }} className="hover:text-gold">
                          {ranked[1].name} <span className="font-mono text-mute">{ranked[1].tissue}</span>
                        </Jump>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      {ranked[2] ? (
                        <Jump to={{ view: "sheet", race: race.no, cloth: ranked[2].cloth }} className="hover:text-gold">
                          {ranked[2].name} <span className="font-mono text-mute">{ranked[2].tissue}</span>
                        </Jump>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="text-xs text-mute">{race.irPick}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {races.map((race) => (
        <RaceSection key={race.no} race={race} loc={loc} meeting={meeting} />
      ))}

      {meeting.extraCopy ? (
        <>
          <section className="border-t border-line px-4 py-10 md:px-8">
            <h2 className="text-2xl font-medium tracking-tight">Apprentice, steel, gear</h2>
            <div className="mt-5 grid gap-6 md:grid-cols-3">
              <div>
                <h3 className="flex items-center gap-2 text-sm font-medium">
                  <Hash size={16} /> Claims
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-mute">
                  Only two 5kg claims on the card: Surendra Singh on She's A Bomb (races off 55kg, not 60kg) and V S
                  Shekhawat on Flare. No maiden in race 1 can claim.
                </p>
              </div>
              <div>
                <h3 className="flex items-center gap-2 text-sm font-medium">
                  <Timer size={16} /> Steel shoes
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-mute">
                  Celestial Power, Anemoi, Barbarossa, Coming Home, Lego, Commanding Warrior, Detective, Photograph,
                  December Rain, See My Attitude. Treat steel as a negative on this turf unless the horse is a known wet
                  specialist.
                </p>
              </div>
              <div>
                <h3 className="flex items-center gap-2 text-sm font-medium">
                  <Flag size={16} /> First-time gear
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-mute">
                  Materiality: blinkers and pacifiers for the handicap debut. She's A Bomb: tongue strap and blinkers kept
                  on after the maiden win. Zuccaro and Ramiel: hoods for the Gold Cup.
                </p>
              </div>
            </div>
          </section>

          <section className="border-t border-line px-4 py-10 md:px-8">
            <h2 className="flex items-center gap-2 text-2xl font-medium tracking-tight">
              <Waves size={22} /> Hyderabad pool 08-17 Sep
            </h2>
            <p className="mt-3 max-w-[72ch] text-sm leading-relaxed text-mute">
              X is a pool visit. This list is HYD string only, so Gold Cup visitors will not show. Late (15/16 Sep) means
              they were still in the water three or four days from the race. None of the win picks swam. The value is in
              confirming fades.
            </p>
            <div className="mt-5 grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-lose">Late / heavy. Confirm the fade.</h3>
                <ul className="mt-2 space-y-2 text-sm leading-relaxed text-mute">
                  {meeting.swim
                    .filter((row) => row.kind === "late" || row.kind === "heavy")
                    .map((row) => {
                      const name = races.find((race) => race.no === row.race)?.runners.find((r) => r.cloth === row.cloth)?.name;
                      return (
                        <li key={`${row.race}-${row.cloth}`}>
                          <span className={`mr-2 inline-block px-1 font-mono text-[11px] ${swimTone(row.kind)}`}>
                            R{row.race} {row.cloth} SW {row.tag}
                          </span>
                          <Jump to={{ view: "sheet", race: row.race, cloth: row.cloth }} className="hover:text-paper">
                            {name}
                          </Jump>
                          . {row.note}
                        </li>
                      );
                    })}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-medium">Tapered. Milder.</h3>
                <ul className="mt-2 space-y-2 text-sm leading-relaxed text-mute">
                  {meeting.swim
                    .filter((row) => row.kind === "taper")
                    .map((row) => {
                      const name = races.find((race) => race.no === row.race)?.runners.find((r) => r.cloth === row.cloth)?.name;
                      return (
                        <li key={`${row.race}-${row.cloth}`}>
                          <span className={`mr-2 inline-block px-1 font-mono text-[11px] ${swimTone(row.kind)}`}>
                            R{row.race} {row.cloth} SW {row.tag}
                          </span>
                          <Jump to={{ view: "sheet", race: row.race, cloth: row.cloth }} className="hover:text-paper">
                            {name}
                          </Jump>
                          . {row.note}
                        </li>
                      );
                    })}
                </ul>
              </div>
            </div>
          </section>
        </>
      ) : (
        <GearNotes meeting={meeting} />
      )}

      <footer className="border-t border-line px-4 py-8 text-xs leading-relaxed text-mute md:px-8">
        <p>{meta.source}.</p>
        <p className="mt-2 max-w-[70ch]">
          This is a form-guide pretissue, not betting advice and not official club odds. IndiaRace selections are quoted
          for comparison. Times, ratings and trackwork can be revised by the club after final scratching.
        </p>
      </footer>
    </div>
  );
}
