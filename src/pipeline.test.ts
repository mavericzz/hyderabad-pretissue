import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  addDaysIso,
  dateTab,
  daysBetween,
  parseClock,
  parseIsoDate,
  parseLength,
  parseOddsToOne,
  parseResultCell,
  raceCode,
  tissueBook,
  toFraction,
  venueFromName,
} from "./pipeline.ts";
import { parseCardTitle, parseDayBest, parseHomepageFixtures, parseOddsTables, parseRaceIds, parseRacecard } from "./scrapeHtml.ts";

describe("daily parsers", () => {
  it("reads beaten lengths from the dist-to-win cell, not the verdict", () => {
    assert.equal(parseLength("3 1/4"), 3.25);
    assert.equal(parseLength("6 3/4"), 6.75);
    assert.equal(parseLength("1/2"), 0.5);
    assert.equal(parseLength("Lnk"), 0.3);
    assert.equal(parseLength(""), 0);
    assert.deepEqual(parseResultCell("10 5"), { field: "10", pos: 5 });
  });

  it("parses Indian clocks and night odds onto the to-1 scale", () => {
    assert.equal(parseClock("1:00:23"), 60.23);
    assert.equal(parseClock("0:58:94"), 58.94);
    assert.equal(parseOddsToOne("11/4"), 2.75);
    assert.equal(parseOddsToOne("80/100"), 0.8);
    assert.equal(parseOddsToOne("2/1"), 2);
    assert.equal(toFraction(0.25), "1/4");
    assert.equal(toFraction(2), "2/1");
  });

  it("builds a 120% tissue book with a 24/1 floor", () => {
    const book = tissueBook([
      { cloth: 6, hcp: 103 },
      { cloth: 7, hcp: 96 },
      { cloth: 2, hcp: 40 },
    ]);
    assert.equal(book[6], "1/4");
    assert.match(book[2], /\/1$/);
  });

  it("stamps race codes and dates the same way as the sheet", () => {
    assert.equal(raceCode(1000, "Class 5 / Horses Rated 1 to 26"), "10mC5");
    assert.equal(raceCode(2800, "The Indian St. Leger (Gr.1)"), "28mG1");
    assert.equal(raceCode(1200, "Maiden / 3 year olds only"), "12mMDN");
    assert.equal(raceCode(1200, "Class 4 / Div-1"), "12mC4D1");
    assert.equal(parseIsoDate("06-09-2026"), "2026-09-06");
    assert.equal(parseIsoDate("20 Sep 2026"), "2026-09-20");
    assert.equal(dateTab("2026-09-20"), "20 Sep");
    assert.equal(daysBetween("2026-09-06", "2026-09-20"), 14);
    assert.equal(addDaysIso("2026-09-19", 1), "2026-09-20");
    assert.equal(venueFromName("Pune").code, "pun");
    assert.equal(venueFromName("Hyderabad", 11).short, "HYD");
  });
});

describe("IndiaRace HTML", () => {
  it("reads the card title, race ids, day's best and homepage fixtures", () => {
    const title = parseCardTitle(`<h3>Race Card - PUNE - 20 Sep 2026</h3>`);
    assert.equal(title?.venue.code, "pun");
    assert.equal(title?.date, "2026-09-20");
    assert.deepEqual(parseRaceIds(`<a href="/Home/previousRunsWithTrack/168044/racecard"></a><a href="/Home/previousRunsWithTrack/168045/racecard"></a>`), [
      168044,
      168045,
    ]);
    assert.equal(parseDayBest(`<p>Day's Best : Rizz 8 (1)</p>`), "Rizz 8 (1)");
    assert.deepEqual(
      parseHomepageFixtures(`<a href="racingCenterEvent?venueId=10&event_date=2026-09-20&race_type=RACECARD">x</a>`),
      [{ date: "2026-09-20", venueId: 10 }],
    );
  });

  it("parses a one-runner racecard block", () => {
    const html = `
      <h3 class="border_bottom">Race Card - PUNE - 20 Sep 2026</h3>
      <div id="race-1">
        <h1>1</h1><h5>(90)</h5>
        <h2>The Janardhan Salver </h2>
        <h3>Class 5 / Horses Rated 1 to 26</h3>
        <h4>1000 M</h4><h4>01:00 PM</h4>
        <span>Total:₹.500000</span>
        <p class="race_btm_cont">INDIARACE SELECTIONS : <span>1. HOUSE OF LORDS (3)</span></p>
        <tr class="dividend_tr">
          <td>3<br><span>(7)</span></td>
          <td></td>
          <td class="race_card_td"><h5><a href="https://www.indiarace.com/Home/horseStatistics/61117/HOUSE OF LORDS">HOUSE OF LORDS</a></h5>
            <h6><a href="/Home/allSireDetails/1">Excellent Art(GB)</a>-<a href="/Home/allDamDetails/1">Mufradat(IRE)</a>
            <span class="last-five-runs-lable">5 - 5.</span></h6>
          </td>
          <td>7y b g</td><td>Owner</td><td>Narendra Lagad</td><td>Ramswarup</td>
          <td>59</td><td>-2.5</td><td>A</td><td>TS</td>
          <td><sup><small>23</small></sup>21</td>
        </tr>
      </div>`;
    const card = parseRacecard(html, 10);
    assert.equal(card?.date, "2026-09-20");
    assert.equal(card?.races[0]?.name, "The Janardhan Salver");
    assert.equal(card?.races[0]?.runners[0]?.name, "HOUSE OF LORDS");
    assert.equal(card?.races[0]?.runners[0]?.al, "2.5");
    assert.equal(card?.races[0]?.runners[0]?.rtg, "23 / 21");
    assert.equal(card?.races[0]?.irPick.includes("HOUSE OF LORDS"), true);
  });

  it("matches night odds when the S.No column is missing from body rows", () => {
    const html = `
      <h3>Race Card - PUNE - 20 Sep 2026</h3>
      <div id="race-1">
        <h2>The Janardhan Salver</h2><h3>Class 5</h3><h4>1000 M</h4><h4>01:00 PM</h4>
        <tr class="dividend_tr">
          <td>3<br><span>(7)</span></td><td></td>
          <td><h5><a href="/Home/horseStatistics/1/HOUSE OF LORDS">HOUSE OF LORDS</a></h5></td>
          <td>7y b g</td><td>o</td><td>t</td><td>j</td><td>59</td><td></td><td>A</td><td></td><td>21</td>
        </tr>
      </div>`;
    const card = parseRacecard(html, 10)!;
    const odds = `
      <table>
        <tr><th>S No</th><th>Horse Name</th><th>Jockey</th><th>Night Odds</th><th>Morning Odds</th><th>Opening Odds</th></tr>
        <tr><td>1. HOUSE OF LORDS</td><td>Ramswarup</td><td>2/1</td><td></td><td></td></tr>
      </table>`;
    const parsed = parseOddsTables(odds, card.races);
    assert.equal(parsed[1]?.[0]?.cloth, 3);
    assert.equal(parsed[1]?.[0]?.night, 2);
    assert.equal(parsed[1]?.[0]?.morning, null);
    assert.equal(parsed[1]?.[0]?.opening, null);
  });

  it("maps morning and opening from the same odds table headers", () => {
    const html = `
      <h3>Race Card - PUNE - 20 Sep 2026</h3>
      <div id="race-1">
        <h2>The Janardhan Salver</h2><h3>Class 5</h3><h4>1000 M</h4><h4>01:00 PM</h4>
        <tr class="dividend_tr">
          <td>3<br><span>(7)</span></td><td></td>
          <td><h5><a href="/Home/horseStatistics/1/HOUSE OF LORDS">HOUSE OF LORDS</a></h5></td>
          <td>7y b g</td><td>o</td><td>t</td><td>j</td><td>59</td><td></td><td>A</td><td></td><td>21</td>
        </tr>
      </div>`;
    const card = parseRacecard(html, 10)!;
    const odds = `
      <table>
        <tr><th>S No</th><th>Horse Name</th><th>Jockey</th><th>Night Odds</th><th>Morning Odds</th><th>Opening Odds</th></tr>
        <tr><td>1. HOUSE OF LORDS</td><td>Ramswarup</td><td>2/1</td><td>9/4</td><td>3/1</td></tr>
      </table>`;
    const parsed = parseOddsTables(odds, card.races);
    assert.equal(parsed[1]?.[0]?.night, 2);
    assert.equal(parsed[1]?.[0]?.morning, 2.25);
    assert.equal(parsed[1]?.[0]?.opening, 3);
  });
});
