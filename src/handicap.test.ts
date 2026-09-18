import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { analyseHandicap, parseRating, raceKind, withHandicap, type HcpHorse } from "./handicap.ts";
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
    const { hcp } = analyseHandicap(race);
    for (const cloth of [1, 5, 8]) assert.equal(hcp[cloth], 0);
  });

  it("picks HCP RTG from official marks only, never LTO figures", () => {
    const { picks } = analyseHandicap(race);
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

  it("is 0kg on the 0.5kg/point scale, and -5kg only for the 5kg claims", () => {
    const { hcp } = analyseHandicap(race);
    assert.equal(hcp[1], 0);
    assert.equal(hcp[2], -5);
    assert.equal(hcp[5], -5);
    assert.equal(hcp[10], 0);
    assert.equal(hcp[6], 0);
  });

  it("ranks HCP RTG by official rating after the claim, not by kg below topweight", () => {
    const { picks, effective } = analyseHandicap(race);
    assert.equal(effective[2], 52);
    assert.equal(effective[1], 43);
    assert.equal(effective[5], 42);
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

  it("marks the highest-rated light weight as the well-in horse", () => {
    const { hcp, picks } = analyseHandicap(race);
    assert.equal(hcp[4], 0);
    assert.equal(hcp[2], 2.5);
    assert.equal(hcp[1], 5);
    assert.deepEqual(picks, [4, 2, 1, 3]);
  });
});

describe("Hyderabad 19 Sep card", () => {
  it("stops using LTO figures as maiden handicap ratings", () => {
    const race = withHandicap(SHEET.races[0]);
    assert.deepEqual(race.picks.hcpRtg, [3, 4, 6, 5]);
    assert.equal(race.runners.find((r) => r.cloth === 8)?.hcp, null);
    assert.equal(race.runners.find((r) => r.cloth === 3)?.hcp, 37);
  });

  it("shows today's handicap rating, not 0kg vs topweight", () => {
    const race = withHandicap(SHEET.races[2]);
    const bomb = race.runners.find((r) => r.cloth === 2);
    const flare = race.runners.find((r) => r.cloth === 5);
    const last = race.runners.find((r) => r.cloth === 10);
    const top = race.runners.find((r) => r.cloth === 1);
    assert.equal(bomb?.name, "SHE'S A BOMB");
    assert.equal(bomb?.hcp, 52);
    assert.equal(bomb?.hcpKg, -5);
    assert.equal(flare?.hcp, 42);
    assert.equal(flare?.hcpKg, -5);
    assert.equal(last?.hcp, 22);
    assert.equal(last?.hcpKg, 0);
    assert.equal(top?.hcp, 43);
    assert.ok(race.runners.every((r) => r.hcp !== 0));
    assert.deepEqual(race.picks.hcpRtg, [2, 1, 5, 3]);
  });

  it("puts One N Only and Zuccaro top of the terms races", () => {
    const totaram = withHandicap(SHEET.races[3]);
    const gold = withHandicap(SHEET.races[4]);
    assert.equal(totaram.picks.hcpRtg[0], 2);
    assert.equal(totaram.runners.find((r) => r.cloth === 2)?.hcp, 107);
    assert.equal(gold.picks.hcpRtg[0], 4);
    assert.equal(gold.runners.find((r) => r.cloth === 4)?.hcp, 123);
    assert.equal(gold.runners.find((r) => r.cloth === 1)?.hcp, 110);
  });
});
