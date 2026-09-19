import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { findByName, formatHash, horseId, parseHash, targetId } from "./nav.ts";
import { centersOn, meetingFor } from "./catalog.ts";

describe("hash location", () => {
  it("defaults empty hash to the Hyderabad 19 Sep night tab", () => {
    assert.deepEqual(parseHash(""), {
      date: "2026-09-19",
      center: "hyd",
      view: "night",
      race: null,
      cloth: null,
    });
    assert.deepEqual(parseHash("#"), {
      date: "2026-09-19",
      center: "hyd",
      view: "night",
      race: null,
      cloth: null,
    });
  });

  it("round-trips view / race / cloth on the Saturday card", () => {
    const loc = { date: "2026-09-19" as const, center: "hyd" as const, view: "sheet" as const, race: 3, cloth: 2 };
    assert.equal(formatHash(loc), "#sheet/r3-h2");
    assert.deepEqual(parseHash("#sheet/r3-h2"), loc);
    assert.deepEqual(parseHash("#guide/r5"), {
      date: "2026-09-19",
      center: "hyd",
      view: "guide",
      race: 5,
      cloth: null,
    });
    assert.deepEqual(parseHash("#night"), {
      date: "2026-09-19",
      center: "hyd",
      view: "night",
      race: null,
      cloth: null,
    });
  });

  it("round-trips a dated center hash", () => {
    const loc = { date: "2026-09-20", center: "pun" as const, view: "sheet" as const, race: 7, cloth: 6 };
    assert.equal(formatHash(loc), "#2026-09-20/pun/sheet/r7-h6");
    assert.deepEqual(parseHash("#2026-09-20/pun/sheet/r7-h6"), loc);
    assert.deepEqual(parseHash("#2026-09-21/hyd/guide"), {
      date: "2026-09-21",
      center: "hyd",
      view: "guide",
      race: null,
      cloth: null,
    });
    assert.deepEqual(parseHash("#2026-09-23/mum/sheet"), {
      date: "2026-09-23",
      center: "mum",
      view: "sheet",
      race: null,
      cloth: null,
    });
  });

  it("keeps legacy in-page anchors working", () => {
    assert.deepEqual(parseHash("#lto-3"), {
      date: "2026-09-19",
      center: "hyd",
      view: "sheet",
      race: 3,
      cloth: null,
    });
    assert.deepEqual(parseHash("#race-5"), {
      date: "2026-09-19",
      center: "hyd",
      view: "guide",
      race: 5,
      cloth: null,
    });
    assert.deepEqual(parseHash("#card"), {
      date: "2026-09-19",
      center: "hyd",
      view: "guide",
      race: null,
      cloth: null,
    });
  });

  it("builds element ids for scroll targets", () => {
    assert.equal(horseId(3, 2), "r3-h2");
    assert.equal(targetId({ date: "2026-09-19", center: "hyd", view: "sheet", race: 3, cloth: 2 }), "lto-3-h2");
    assert.equal(targetId({ date: "2026-09-19", center: "hyd", view: "guide", race: 3, cloth: 2 }), "race-3-h2");
    assert.equal(targetId({ date: "2026-09-19", center: "hyd", view: "night", race: 3, cloth: 2 }), "night-3-h2");
  });
});

describe("findByName", () => {
  it("resolves the day's best and Gold Cup names on this card", () => {
    assert.deepEqual(findByName("SHE'S A BOMB"), { race: 3, cloth: 2 });
    assert.deepEqual(findByName("Zuccaro"), { race: 5, cloth: 4 });
    assert.deepEqual(findByName("EMERALD TOUCH"), { race: 4, cloth: 8 });
    assert.equal(findByName("NO SUCH HORSE"), null);
  });
});

describe("catalog", () => {
  it("lists Pune on 20 Sep and Hyderabad on 21 Sep", () => {
    assert.equal(centersOn("2026-09-20")[0]?.center, "pun");
    assert.equal(centersOn("2026-09-21")[0]?.center, "hyd");
    assert.ok(meetingFor("2026-09-20", "pun").races.some((race) => race.runners.some((runner) => runner.name === "FYNBOS")));
    assert.ok(meetingFor("2026-09-21", "hyd").races.some((race) => race.runners.some((runner) => runner.name === "PRINCE OF WALES")));
    assert.equal(meetingFor("2026-09-19", "hyd").hasNight, true);
  });
});
