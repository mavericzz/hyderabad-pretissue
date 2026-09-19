import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { cardScore, clubOddsToNight, finishFor, pickHit, raceResult, spAsNight } from "./results.ts";
import { SHEET } from "./sheetData.ts";

describe("clubOddsToNight", () => {
  it("reads Indian mixed, fractional, and whole-number SP", () => {
    assert.equal(clubOddsToNight("1 1/4"), 1.25);
    assert.equal(clubOddsToNight("1 1/2"), 1.5);
    assert.equal(clubOddsToNight("45/100"), 0.45);
    assert.equal(clubOddsToNight("7/10"), 0.7);
    assert.equal(clubOddsToNight("9/10"), 0.9);
    assert.equal(clubOddsToNight("2"), 2);
    assert.equal(clubOddsToNight(""), null);
  });
});

describe("Hyderabad 19 Sep results vs the sheet", () => {
  it("has the official 1-2-3 for every race", () => {
    assert.deepEqual(
      RESULTS_123(),
      [
        [3, 8, 6],
        [1, 3, 5],
        [2, 4, 3],
        [2, 8, 5],
        [4, 3, 7],
        [1, 6, 2],
      ],
    );
  });

  it("scores WIN 3/6, PLC 5/6, UPSET 5/6 without changing the original picks", () => {
    const picks = SHEET.races.map((race) => race.picks);
    assert.deepEqual(
      picks.map((p) => [p.win, p.plc, p.upset]),
      [
        [8, 3, 1],
        [4, 1, 3],
        [2, 3, 4],
        [2, 8, 5],
        [4, 1, 3],
        [4, 1, 6],
      ],
    );
    assert.deepEqual(cardScore(picks), { win: 3, plc: 5, upset: 5, n: 6 });
    assert.equal(pickHit("win", 8, 1), false);
    assert.equal(pickHit("plc", 3, 1), true);
    assert.equal(pickHit("win", 4, 2), false);
    assert.equal(finishFor(2, 4)?.dnf, true);
    assert.equal(pickHit("win", 2, 3), true);
    assert.equal(pickHit("win", 4, 6), false);
    assert.equal(raceResult(5)?.first, 4);
  });

  it("maps official SP onto the Indian night scale", () => {
    assert.equal(spAsNight(1, 3), 1.25);
    assert.equal(spAsNight(2, 1), 0.45);
    assert.equal(spAsNight(3, 2), 0.7);
    assert.equal(spAsNight(3, 5), null);
    assert.equal(spAsNight(6, 1), 1.5);
  });
});

function RESULTS_123() {
  return [1, 2, 3, 4, 5, 6].map((no) => {
    const race = raceResult(no);
    return [race?.first, race?.second, race?.third];
  });
}
