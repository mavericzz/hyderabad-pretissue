import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  adjustedTime,
  analyseHandicap,
  deltaT,
  lengthsToKg,
  officialWeight,
  parseRating,
  raceKind,
  runFigure,
  weightEquivalence,
  withHandicap,
  AVG_KG,
  LENGTH_SEC,
  MAX_KG,
  MIN_KG,
  type HcpHorse,
} from "./handicap.ts";
import { SHEET } from "./sheetData.ts";

function horse(cloth: number, wt: number, bnc: number | null, al = ""): HcpHorse {
  return { cloth, wt, al, bnc };
}

describe("parseRating", () => {
  it("treats IndiaRace 'last current' as current = second number", () => {
    assert.deepEqual(parseRating("27 42"), { last: 27, current: 42, ch: 15 });
    assert.deepEqual(parseRating("45 43"), { last: 45, current: 43, ch: -2 });
    assert.deepEqual(parseRating("0 36"), { last: null, current: 36, ch: null });
    assert.deepEqual(parseRating("0"), { last: null, current: null, ch: null });
    assert.deepEqual(parseRating("42"), { last: null, current: 42, ch: null });
    assert.deepEqual(parseRating("34 / 37"), { last: 34, current: 37, ch: 3 });
  });
});

describe("raceKind", () => {
  it("reads the sheet race codes", () => {
    assert.equal(raceKind("12mMDN"), "maiden");
    assert.equal(raceKind("11mC4D2"), "handicap");
    assert.equal(raceKind("11mC4D1"), "handicap");
    assert.equal(raceKind("12mTRM"), "terms");
    assert.equal(raceKind("24mG2"), "terms");
    assert.equal(raceKind("16mC4"), "handicap");
  });
});

describe("Indian kg scale", () => {
  it("is 1 length = 0.17s and 1 length = 1 kg at 1200m", () => {
    assert.equal(deltaT(1), LENGTH_SEC);
    assert.equal(Math.round(deltaT(5) * 100) / 100, 0.85);
    assert.equal(lengthsToKg(1, 1200), 1);
    assert.equal(lengthsToKg(1, 2400), 2);
    assert.equal(weightEquivalence({ lengths: 1, distM: 1200 }), 1);
    assert.equal(weightEquivalence({ lengths: 1, distM: 2400 }), 2);
  });

  it("allots official kg at 2 points = 1 kg, capped 47–62", () => {
    assert.equal(officialWeight(42, 43, 60.5), 60);
    assert.equal(officialWeight(36, 42, 60), 57);
    assert.equal(officialWeight(123, 120, 60), 61.5);
    assert.equal(officialWeight(16, 43, 60.5), MIN_KG);
    assert.equal(officialWeight(160, 120, 60), MAX_KG);
  });

  it("credits extra kg at 5 kg ≈ 1 second", () => {
    assert.equal(adjustedTime({ winnerTimeS: 70, lengths: 0, carriedKg: AVG_KG }), 70);
    assert.equal(adjustedTime({ winnerTimeS: 70, lengths: 5, carriedKg: AVG_KG }), 70 + deltaT(5));
    assert.equal(adjustedTime({ winnerTimeS: 70, lengths: 0, carriedKg: AVG_KG + 5 }), 69);
    assert.equal(weightEquivalence({ lengths: 5, distM: 1200, carriedKg: AVG_KG + 5, avgKg: AVG_KG }), 0);
    assert.equal(weightEquivalence({ lengths: 1, distM: 2400, carriedKg: AVG_KG + 1, avgKg: AVG_KG }), 0);
  });

  it("rates a beaten horse off the mark they ran off", () => {
    assert.equal(runFigure({ pos: 2, beaten: 1.5, distM: 1400, orRanOff: 34 }), 31);
    assert.equal(runFigure({ pos: 2, beaten: 4.5, distM: 1100, orRanOff: null, cls: "Maiden" }), 22);
    assert.equal(runFigure({ pos: 2, beaten: 0.75, distM: 1100, orRanOff: null, cls: "Maiden" }), 29);
    assert.equal(runFigure({ pos: 2, beaten: 1.5, distM: 1200, orRanOff: 34 }), 31);
    assert.equal(runFigure({ pos: 2, beaten: 1.5, distM: 1200, orRanOff: 34, carriedKg: 56, avgKg: 55 }), 33);
  });

  it("uses the official raise as the latest winning figure", () => {
    assert.equal(
      runFigure({ pos: 1, beaten: 0, distM: 1200, orRanOff: 27, currentOr: 42, latest: true, cls: "Maiden" }),
      42,
    );
    assert.equal(runFigure({ pos: 1, beaten: 0, distM: 2400, orRanOff: 120, currentOr: 120, latest: true }), 120);
    assert.equal(runFigure({ pos: 1, beaten: 0, distM: 2200, orRanOff: 117, currentOr: 123, latest: true }), 123);
  });

  it("blows out runs beaten 20 lengths", () => {
    assert.equal(runFigure({ pos: 14, beaten: 37, distM: 1400, orRanOff: 35 }), "###");
    assert.equal(runFigure({ pos: "###", beaten: null, distM: 1200, orRanOff: null }), "###");
  });
});

describe("maiden set-weights", () => {
  const race = {
    code: "12mMDN",
    runners: [
      horse(1, 56, null),
      horse(2, 56, null),
      horse(3, 56, 37),
      horse(4, 56, 29),
      horse(5, 54.5, 28),
      horse(6, 54.5, 29),
      horse(7, 54.5, 28),
      horse(8, 54.5, null),
    ],
  };

  it("does not treat fillies as well-in just because they carry 54.5", () => {
    const { hcpKg } = analyseHandicap(race);
    for (const cloth of [1, 5, 8]) assert.equal(hcpKg[cloth] ?? 0, 0);
  });

  it("ranks unform horses by official mark, never the old 100-based LTO shortcut", () => {
    const { picks, hcp } = analyseHandicap(race);
    assert.equal(hcp[3], 37);
    assert.equal(hcp[1], null);
    assert.deepEqual(picks, [3, 4, 6, 5]);
    assert.ok(!picks.includes(8));
    assert.ok(!picks.includes(1));
  });
});

describe("class 4 handicap with claims (Falaknuma Div-1)", () => {
  const race = {
    code: "11mC4D1",
    runners: [
      horse(1, 60.5, 43),
      horse(2, 60, 42, "-5"),
      horse(3, 57.5, 37),
      horse(4, 57.5, 37),
      horse(5, 55, 32, "-5"),
      horse(6, 54.5, 31),
      horse(7, 53, 28),
      horse(8, 52, 26),
      horse(9, 51.5, 25),
      horse(10, 50, 22),
    ],
  };

  it("adds 2 points per kg claimed and marks the claim well-in vs allotted kg", () => {
    const { hcp, hcpKg } = analyseHandicap(race);
    assert.equal(hcp[1], 43);
    assert.equal(hcp[2], 52);
    assert.equal(hcpKg[2], -5);
    assert.equal(hcp[5], 42);
    assert.equal(hcpKg[5], -5);
    assert.equal(hcp[10], 22);
    assert.equal(hcpKg[6], 0);
    assert.equal(hcpKg[1], 0);
  });

  it("ranks HCP RTG by last figure after the claim", () => {
    const { picks, hcp } = analyseHandicap(race);
    assert.equal(hcp[2], 52);
    assert.equal(hcp[1], 43);
    assert.equal(hcp[5], 42);
    assert.deepEqual(picks, [2, 1, 5, 3]);
  });
});

describe("terms race (Gold Cup)", () => {
  const race = {
    code: "24mG2",
    runners: [
      horse(1, 60, 120),
      horse(2, 58, 121),
      horse(3, 57, 114),
      horse(4, 56.5, 123),
      horse(5, 55.5, 109),
      horse(6, 53, 99),
      horse(7, 52, 90),
    ],
  };

  it("ranks by official mark when last-start figures are not on the horse", () => {
    const { hcp, picks } = analyseHandicap(race);
    assert.equal(hcp[4], 123);
    assert.equal(hcp[2], 121);
    assert.equal(hcp[1], 120);
    assert.deepEqual(picks, [4, 2, 1, 3]);
  });

  it("marks Zuccaro well-in vs the topweight's handicap allotment", () => {
    const { hcpKg } = analyseHandicap(race);
    assert.equal(hcpKg[1], 0);
    assert.equal(hcpKg[4], -5);
    assert.equal(hcpKg[2], -2.5);
  });
});

describe("Hyderabad 19 Sep card", () => {
  it("rates French Lieutenant's 1.5L second off 34 as 31 on the Indian kg scale", () => {
    const race = withHandicap(SHEET.races[0]);
    const french = race.runners.find((r) => r.cloth === 3);
    const bella = race.runners.find((r) => r.cloth === 1);
    const mine = race.runners.find((r) => r.cloth === 8);
    assert.equal(french?.name, "FRENCH LIEUTENANT");
    assert.equal(french?.l1.lto, 31);
    assert.equal(french?.hcp, 31);
    assert.equal(bella?.l1.lto, 22);
    assert.equal(mine?.l1.lto, 29);
    assert.deepEqual(race.picks.hcpRtg.slice(0, 2), [3, 8]);
    assert.equal(race.runners.find((r) => r.cloth === 2)?.hcp, null);
  });

  it("uses She's A Bomb's raised winning figure plus the 5kg claim", () => {
    const race = withHandicap(SHEET.races[2]);
    const bomb = race.runners.find((r) => r.cloth === 2);
    const american = race.runners.find((r) => r.cloth === 3);
    assert.equal(bomb?.name, "SHE'S A BOMB");
    assert.equal(bomb?.l1.lto, 42);
    assert.equal(bomb?.hcp, 52);
    assert.equal(bomb?.hcpKg, -5);
    assert.equal(american?.l1.lto, 33);
    assert.equal(race.picks.hcpRtg[0], 2);
    assert.equal(race.runners.find((r) => r.cloth === 6)?.hcp, null);
    assert.equal(race.runners.find((r) => r.cloth === 9)?.hcp, null);
  });

  it("puts One N Only and Zuccaro on their last winning figures", () => {
    const totaram = withHandicap(SHEET.races[3]);
    const gold = withHandicap(SHEET.races[4]);
    const only = totaram.runners.find((r) => r.cloth === 2);
    const zuccaro = gold.runners.find((r) => r.cloth === 4);
    const duke = gold.runners.find((r) => r.cloth === 1);
    const ramiel = gold.runners.find((r) => r.cloth === 2);
    assert.equal(only?.l1.lto, 107);
    assert.equal(only?.hcp, 107);
    assert.equal(totaram.picks.hcpRtg[0], 2);
    assert.equal(zuccaro?.l1.lto, 123);
    assert.equal(zuccaro?.hcp, 123);
    assert.equal(zuccaro?.hcpKg, -5);
    assert.equal(duke?.l1.lto, 120);
    assert.equal(ramiel?.l1.lto, 121);
    assert.equal(gold.picks.hcpRtg[0], 4);
  });
});
