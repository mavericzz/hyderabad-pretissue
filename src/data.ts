export type FormRun = {
  date: string;
  venue: string;
  dist: string;
  cls: string;
  pos: string;
  field: string;
  beaten: string;
  wt: string;
  odds: string;
  winner: string;
  note?: string;
};

export type Work = {
  date: string;
  venue: string;
  clock: string;
  note: string;
};

export type Runner = {
  cloth: number;
  draw: number;
  name: string;
  exName?: string;
  age: string;
  pedigree: string;
  trainer: string;
  jockey: string;
  wt: string;
  al: string;
  shoes: "A" | "S";
  eq: string;
  rtg: string;
  last5: string;
  tissue: string;
  rank: number;
  verdict: string;
  similar: string;
  form: FormRun[];
  work: Work[];
};

export type Race = {
  no: number;
  official: number;
  name: string;
  class: string;
  dist: string;
  time: string;
  purse: string;
  record: string;
  shape: string;
  similarRace: string;
  tissueNote: string;
  nap?: boolean;
  irPick: string;
  ourPick: string;
  runners: Runner[];
};

export type MeetingInfo = {
  venue: string;
  date: string;
  first: string;
  source: string;
  going: string;
  dayBest: string;
  dayBestRace: number;
  nextBest: string;
  longshot: string;
  irDayBest: string;
  feature?: string;
};

export const MEETING: MeetingInfo = {
  venue: "Hyderabad Race Club",
  date: "Saturday 19 September 2026",
  first: "01:55 PM",
  source: "IndiaRace racecard, previous runs, relative performance and trackwork as of 18 Sep 2026",
  going: "Monsoon turf. Recent meetings have been on a sound-to-good Hyderabad surface. 1100-1200m races are being run close to record-range times.",
  dayBest: "SHE'S A BOMB",
  dayBestRace: 3,
  nextBest: "ZUCCARO",
  longshot: "EMERALD TOUCH",
  irDayBest: "SHE'S A BOMB 3 (2)",
  feature: "President of India Gold Cup (Gr.2)",
};

export const EQ: Record<string, string> = {
  TS: "tongue strap",
  BLK: "blinkers",
  XNB: "cross noseband",
  SCP: "scuppers",
  PF: "pacifiers",
  HOOD: "hood",
  RDB: "rubber bit",
  DRB: "dropped bit",
  BB: "brow band",
  RB: "ring bit",
};

export const races: Race[] = [
  {
    no: 1,
    official: 101,
    name: "The Rock Of Gibraltar Plate",
    class: "Maiden / 3 year olds only. No allowance can be claimed.",
    dist: "1200m",
    time: "01:55 PM",
    purse: "₹12,25,000",
    record: "Dancing Phoenix 54kg, 1:11.31 (21 Aug 2016)",
    shape: "Even-speed maiden. Inside draw matters into the first turn. Colts 56kg, fillies 54.5kg.",
    similarRace:
      "Last Sunday's 1100m maiden (race 96) is the key map. Modin (55/100) beat My Touch 3/4L and Costa Mesa 5.25L. Jockey Shivam on My Touch was fined Rs.3000 for failing to ride out in the last 100m after his whip stuck. That run is better than the beaten margin. French Lieutenant's 1400m 2nd to Classy Touch (1.5L, 07 Sep) is the strongest exposed maiden form. Bella's Touch was 2nd of 13 to Yali on debut (4.5L, 05 Sep).",
    tissueNote:
      "My Touch gets Akshay Kumar after a luckless 3/4L second. French Lieutenant is the form horse. Bella's Touch is the danger if the debut 2nd was genuine.",
    irPick: "French Lieutenant / My Touch / Costa Mesa",
    ourPick: "My Touch",
    runners: [
      {
        cloth: 1, draw: 3, name: "BELLA'S TOUCH", age: "3y b c",
        pedigree: "Sanus Per Aquam (IRE) - Senora Bella",
        trainer: "Neelesh Rawal", jockey: "M S Deora", wt: "56", al: "", shoes: "A", eq: "", rtg: "0",
        last5: "2", tissue: "5/1", rank: 3,
        verdict: "Debut 2nd of 13 over 1100m, beaten 4.5L by Yali at 20s. Steps to 1200m with the same rider. Draw 3 is usable. Half to Areca Legend / Louboutin. Needs to find the 2-3 lengths the winner put into him, but this is a weaker field than that debut.",
        similar: "Same-yard Sporting Touch was 5th in that Yali maiden, 2.5L behind Bella's Touch. The form is holding in this field.",
        form: [
          { date: "05 Sep 26", venue: "HYD", dist: "1100m", cls: "Maiden", pos: "2", field: "13", beaten: "4.5L", wt: "56", odds: "20", winner: "Yali" },
        ],
        work: [
          { date: "03 Sep", venue: "HYD", clock: "800m sand (-2)", note: "With She Can (app), 600/44. Pair looks well." },
          { date: "18 Aug", venue: "HYD", clock: "1000m grass (-6)", note: "Trio with Paththku and Sporting Touch, 600/40, handy." },
        ],
      },
      {
        cloth: 2, draw: 7, name: "CHANCED ONE", age: "3y b c",
        pedigree: "Sporting Chance (GB) - Ashka Ashka Ashka",
        trainer: "Magan Singh", jockey: "D S Deora", wt: "56", al: "", shoes: "A", eq: "", rtg: "0",
        last5: "-", tissue: "16/1", rank: 7,
        verdict: "Unraced. Works are easy sand 800s (+1 to +3) with 'moved easy / handy'. Wide draw 7. Watch-only unless the market collapses. D S Deora is a solid booking for a newcomer.",
        similar: "No race form. Yard's other 3yo in race 2 (My Way My Rules) has already won a maiden, so this one is not the stable's first string.",
        form: [],
        work: [
          { date: "28 Aug", venue: "HYD", clock: "800m sand (+3)", note: "600/47 moved easy." },
          { date: "08 Aug", venue: "HYD", clock: "1000m sand (+3)", note: "800/1:01, 600/45, handy." },
        ],
      },
      {
        cloth: 3, draw: 4, name: "FRENCH LIEUTENANT", age: "3y b g",
        pedigree: "French Navy (GB) - Turf Dancer",
        trainer: "L V R Deshmukh", jockey: "Antony Raj S", wt: "56", al: "", shoes: "A", eq: "TS", rtg: "34 / 37",
        last5: "2-3-2", tissue: "3/1", rank: 2,
        verdict: "The form standard. 2nd, 3rd, 2nd in three maidens, never beaten more than 2.5L. Last: 2nd to Classy Touch over 1400m (1.5L, 4s) with Antony Raj. Previous 3rd as 9/10 fav to You Tuber. First-up 2nd over 1100m beaten a short-head plus 2L. Drops back to 1200m, which sits between his two trips. Tongue strap on. Draw 4. Rating already 37, so the handicapper has him in front of this field.",
        similar: "He finished miles in front of Costa Mesa (11th) and Khamagani (9th) in the Classy Touch maiden. That line kills those two if it is taken at face value.",
        form: [
          { date: "07 Sep 26", venue: "HYD", dist: "1400m", cls: "Maiden", pos: "2", field: "11", beaten: "1.5L", wt: "56", odds: "4", winner: "Classy Touch" },
          { date: "23 Aug 26", venue: "HYD", dist: "1400m", cls: "Maiden", pos: "3", field: "12", beaten: "2.5L", wt: "56", odds: "9/10", winner: "You Tuber" },
          { date: "09 Aug 26", venue: "HYD", dist: "1100m", cls: "Maiden", pos: "2", field: "10", beaten: "2L", wt: "56", odds: "4", winner: "N R I Crypto Power" },
        ],
        work: [
          { date: "15 Sep", venue: "HYD", clock: "800m sand (-3)", note: "57kg, 600/43, strode out well." },
          { date: "20 Aug", venue: "HYD", clock: "800m sand (-4)", note: "56kg, 600/43, note." },
        ],
      },
      {
        cloth: 4, draw: 8, name: "SPORTING TOUCH", age: "3y b c",
        pedigree: "Sporting Chance (GB) - Circus Ring",
        trainer: "Neelesh Rawal", jockey: "Ajay Kumar", wt: "56", al: "", shoes: "A", eq: "TS", rtg: "30 / 29",
        last5: "9-8-11-5", tissue: "25/1", rank: 8,
        verdict: "Four runs, never nearer than 5th, beaten 7L+ every time. Wide draw. Same yard as Bella's Touch and was 3.5L behind that one in the Yali maiden. Needs a new trip or a miracle.",
        similar: "Confirmed 7L inferior to Bella's Touch on 05 Sep.",
        form: [
          { date: "05 Sep 26", venue: "HYD", dist: "1100m", cls: "Maiden", pos: "5", field: "13", beaten: "7L", wt: "56", odds: "20", winner: "Yali" },
          { date: "23 Aug 26", venue: "HYD", dist: "1100m", cls: "Maiden", pos: "11", field: "14", beaten: "9L", wt: "56", odds: "20", winner: "Zorba" },
          { date: "03 Aug 26", venue: "HYD", dist: "1200m", cls: "Maiden", pos: "8", field: "10", beaten: "10.5L", wt: "56", odds: "20", winner: "Excalibur" },
        ],
        work: [
          { date: "03 Sep", venue: "HYD", clock: "800m sand (even)", note: "With Veera's Lakshmi, 600/45, pair moved well." },
        ],
      },
      {
        cloth: 5, draw: 1, name: "COSTA MESA", age: "3y b f",
        pedigree: "Dreamfield (GB) - Ohyouprettything",
        trainer: "K S V Prasad Raju", jockey: "P Sai Kumar", wt: "54.5", al: "", shoes: "A", eq: "", rtg: "27 / 28",
        last5: "8-11-3", tissue: "8/1", rank: 4,
        verdict: "3rd last Sunday behind Modin and My Touch, beaten 5.25L with Akshay up. That is her best run. Previous two 1400m maidens were no shows (8th, 11th, 11-21L). Back to a sprint, rail draw 1, Sai Kumar replaces Akshay (who jumps to My Touch). Place chance if the 1100m race is the real her.",
        similar: "Directly 4.5L behind My Touch last Sunday. Hard to reverse that with a jockey downgrade.",
        form: [
          { date: "14 Sep 26", venue: "HYD", dist: "1100m", cls: "Maiden", pos: "3", field: "10", beaten: "5.25L", wt: "54.5", odds: "12", winner: "Modin" },
          { date: "07 Sep 26", venue: "HYD", dist: "1400m", cls: "Maiden", pos: "11", field: "11", beaten: "21L", wt: "54.5", odds: "20", winner: "Classy Touch" },
          { date: "23 Aug 26", venue: "HYD", dist: "1400m", cls: "Maiden", pos: "8", field: "12", beaten: "11.75L", wt: "54.5", odds: "20", winner: "You Tuber" },
        ],
        work: [
          { date: "01 Sep", venue: "HYD", clock: "800m sand (+2)", note: "600/46 handy." },
          { date: "18 Aug", venue: "HYD", clock: "1000m grass (-6)", note: "With Equine Power, 600/39, pair handy." },
        ],
      },
      {
        cloth: 6, draw: 6, name: "GACCHANMANASVIN", age: "3y b f",
        pedigree: "Sporting Chance (GB) - Vittoria",
        trainer: "Neelesh Rawal", jockey: "Md Ismail", wt: "54.5", al: "", shoes: "A", eq: "TS", rtg: "29 / 29",
        last5: "5-3-4-4-5", tissue: "10/1", rank: 5,
        verdict: "Most exposed filly. Seven maidens, always around 3rd-5th, never wins. Best: 3rd to Materiality over 1100m beaten 2.25L as 5/2. Last two at 1200/1600 she was beaten 11-13L. Honest, no kick. Draw 6.",
        similar: "Materiality, who beat her 2.25L, runs in race 2. That line says she is a Class 4 horse already, not a maiden winner in waiting.",
        form: [
          { date: "13 Sep 26", venue: "HYD", dist: "1600m", cls: "Maiden", pos: "5", field: "8", beaten: "11L", wt: "54.5", odds: "10", winner: "Teak" },
          { date: "31 Aug 26", venue: "HYD", dist: "1200m", cls: "Maiden", pos: "4", field: "8", beaten: "13L", wt: "54.5", odds: "9", winner: "She's A Bomb" },
          { date: "09 Aug 26", venue: "HYD", dist: "1100m", cls: "Maiden", pos: "3", field: "11", beaten: "2.25L", wt: "54.5", odds: "5/2", winner: "Materiality" },
        ],
        work: [
          { date: "11 Sep", venue: "HYD", clock: "800m sand (-2)", note: "58kg, 600/44, fit and well." },
        ],
      },
      {
        cloth: 7, draw: 2, name: "KHAMAGANI", age: "3y b f",
        pedigree: "French Navy (GB) - Exclusive Stevia",
        trainer: "N Ravinder Singh", jockey: "Gaurav Singh", wt: "54.5", al: "", shoes: "A", eq: "TS-XNB", rtg: "28 / 28",
        last5: "7-7-7-3-9", tissue: "12/1", rank: 6,
        verdict: "Flash: 3rd of 14 to Zorba over 1100m, beaten a nose plus 0.5L at 20s (23 Aug). Everything else is 7th-9th, beaten 11-20L. Cross noseband and tongue strap. Draw 2. Could hit the frame if that Zorba run is the real one. Treat as a place only.",
        similar: "Was 9th, 18L behind French Lieutenant in the Classy Touch maiden. That line is brutal unless she is a pure sprinter.",
        form: [
          { date: "07 Sep 26", venue: "HYD", dist: "1400m", cls: "Maiden", pos: "9", field: "11", beaten: "19.75L", wt: "54.5", odds: "20", winner: "Classy Touch" },
          { date: "23 Aug 26", venue: "HYD", dist: "1100m", cls: "Maiden", pos: "3", field: "14", beaten: "0.5L", wt: "54.5", odds: "20", winner: "Zorba" },
          { date: "27 Jul 26", venue: "HYD", dist: "1100m", cls: "Maiden", pos: "7", field: "12", beaten: "11L", wt: "54.5", odds: "20", winner: "My Way My Rules" },
        ],
        work: [
          { date: "02 Sep", venue: "HYD", clock: "800m sand (-1)", note: "59kg, 600/45, well in hand." },
        ],
      },
      {
        cloth: 8, draw: 5, name: "MY TOUCH", age: "3y b f",
        pedigree: "Akeed Champion (GB) - Scagliola (GB)",
        trainer: "D Netto", jockey: "Akshay Kumar", wt: "54.5", al: "", shoes: "A", eq: "", rtg: "0",
        last5: "2", tissue: "5/2", rank: 1,
        verdict: "The bet. Debut 2nd of 10 last Sunday, beaten 3/4L by odds-on Modin. Jockey Shivam fined for not riding her out after the whip jammed. She was still only 3/4L down, and Costa Mesa was 4.5L behind her. Akshay Kumar takes over. Draw 5. Untouched rating. Trackwork unextended, so there is more in the tank. Filly allowance vs the colts is 1.5kg.",
        similar: "Last Sunday's maiden is the most recent and cleanest line in this race. Upgrade for the ride and for 100 extra metres.",
        form: [
          { date: "14 Sep 26", venue: "HYD", dist: "1100m", cls: "Maiden", pos: "2", field: "10", beaten: "0.75L", wt: "54.5", odds: "20", winner: "Modin", note: "Whip stuck. Jockey fined Rs.3000 for failing to ride out." },
        ],
        work: [
          { date: "05 Sep", venue: "HYD", clock: "800m sand (even)", note: "600/45, unextended." },
        ],
      },
    ],
  },
  {
    no: 2,
    official: 102,
    name: "The Falaknuma Trophy Div-2",
    class: "Class 4 handicap, rated 20 to 45, 3yo and upward",
    dist: "1100m",
    time: "02:30 PM",
    purse: "₹6,50,000",
    record: "Versallies 61kg, 1:05.61 (30 Sep 2019)",
    shape: "Sprint handicap. Topweight Cosmic Gift 60kg from stall 9. Two last-start maiden winners (Materiality, My Way My Rules) coming out of maidens into a 20-45 band. Barbarossa unraced.",
    similarRace:
      "Materiality won the 09 Aug 1100m maiden, beating Gacchanmanasvin 2.25L. Cosmic Gift won an 1100m maiden then was 2nd over 1400m and 6th when stretched again. My Way My Rules won the 27 Jul 1100m maiden (Khamagani 7th) then flopped at 1400m. This is a 1100m race, so throw out the 1400m runs.",
    tissueNote: "Unexposed 3yo fillies/colts off maiden wins beat exposed Class 4 older horses here. Materiality from stall 2 is the shape.",
    irPick: "Cosmic Gift / Materiality / My Way My Rules",
    ourPick: "Materiality",
    runners: [
      {
        cloth: 1, draw: 9, name: "COSMIC GIFT", age: "3y b c",
        pedigree: "Chinese Whisper (IRE) - Diamonite",
        trainer: "A Imran Khan", jockey: "P Trevor", wt: "60", al: "", shoes: "A", eq: "TS", rtg: "42 / 42",
        last5: "5-1-2-6", tissue: "3/1", rank: 2,
        verdict: "Won 1100m maiden, 2nd next, then 6th over 1400m (wrong trip). Back to 1100m with Trevor. 60kg and stall 9 are the taxes. Highest rated. If he breaks and crosses, he wins. If he sits four-wide, Materiality beats him.",
        similar: "Direct 1100m winner. The 1400m 6th to Bulletproof is ignore.",
        form: [
          { date: "05 Sep 26", venue: "HYD", dist: "1400m", cls: "C4", pos: "6", field: "10", beaten: "5.75L", wt: "56", odds: "20", winner: "Bulletproof" },
          { date: "10 Aug 26", venue: "HYD", dist: "1400m", cls: "C4", pos: "2", field: "10", beaten: "11.5L", wt: "56.5", odds: "5", winner: "Madante" },
          { date: "05 Apr 26", venue: "HYD", dist: "1100m", cls: "Maiden", pos: "1", field: "9", beaten: "0", wt: "56", odds: "11/10", winner: "Cosmic Gift" },
        ],
        work: [
          { date: "15 Sep", venue: "HYD", clock: "800m sand (-2)", note: "With Secret Option, 600/44, 1L in front." },
        ],
      },
      {
        cloth: 2, draw: 8, name: "VICTORIA DHORA", exName: "Bartolino", age: "3y b g",
        pedigree: "Ampere (FR) - Fundamental Right",
        trainer: "M Srinivas Reddy", jockey: "Imran Chisty", wt: "58.5", al: "", shoes: "A", eq: "TS-XNB", rtg: "39 / 39",
        last5: "6-1-7-6-4", tissue: "8/1", rank: 4,
        verdict: "Won a Bangalore 1600m then 4th over 1600m here, beaten 13.5L. Sprint is a query. Chisty is a plus. Wide draw. Place if they go too hard in front.",
        similar: "Milers dropping to 1100m at Hyderabad usually flatten. Treat as each-way only if the market is 10s+.",
        form: [
          { date: "13 Sep 26", venue: "HYD", dist: "1600m", cls: "C4", pos: "4", field: "7", beaten: "13.5L", wt: "59", odds: "3", winner: "Pride Aside" },
          { date: "Jul 26", venue: "BAN", dist: "1600m", cls: "C4", pos: "1", field: "6", beaten: "0", wt: "56", odds: "20", winner: "Victoria Dhora" },
        ],
        work: [],
      },
      {
        cloth: 3, draw: 7, name: "MY WAY MY RULES", age: "3y b c",
        pedigree: "Knotty Ash - Memorable",
        trainer: "Magan Singh", jockey: "Vivek G", wt: "58", al: "", shoes: "A", eq: "TS", rtg: "38 / 38",
        last5: "8-7-1-9", tissue: "4/1", rank: 3,
        verdict: "Won 1100m maiden 27 Jul (Khamagani 7th). Subsequent 1400m was a flop (9th, 17L). Vivek G booked. Fresh 1000m grass work (-8) on 15 Sep is the best piece of work in this race. Draw 7 is not ideal. Respect.",
        similar: "Same pattern as Cosmic Gift: 1100m win, 1400m fail, back to 1100m.",
        form: [
          { date: "05 Sep 26", venue: "HYD", dist: "1400m", cls: "C4", pos: "9", field: "10", beaten: "17L", wt: "56", odds: "20", winner: "Bulletproof" },
          { date: "27 Jul 26", venue: "HYD", dist: "1100m", cls: "Maiden", pos: "1", field: "12", beaten: "0", wt: "56", odds: "8", winner: "My Way My Rules" },
        ],
        work: [
          { date: "17 Sep", venue: "HYD", clock: "800m sand (-1)", note: "600/44, good." },
          { date: "15 Sep", venue: "HYD", clock: "1000m grass (-8)", note: "With Shoolin, 600/40, former moved well." },
        ],
      },
      {
        cloth: 4, draw: 2, name: "MATERIALITY", age: "3y b f",
        pedigree: "French Navy (GB) - Mykonos",
        trainer: "L V R Deshmukh", jockey: "P Ajeeth Kumar", wt: "57", al: "", shoes: "A", eq: "BLK-PF", rtg: "0 / 36",
        last5: "1", tissue: "5/2", rank: 1,
        verdict: "Won her only start, 1100m maiden 09 Aug, beating Gacchanmanasvin 2.25L. First handicap, 57kg, stall 2. Blinkers and pacifiers go on, which often sharpens a French Navy. Ajeeth keeps the ride. Rating 36 in a 20-45, so she is mid-band with scope. The one they have to beat.",
        similar: "Gacchanmanasvin has run four more times since and still cannot win a maiden. Materiality already put 2.25L on her.",
        form: [
          { date: "09 Aug 26", venue: "HYD", dist: "1100m", cls: "Maiden", pos: "1", field: "11", beaten: "0", wt: "54.5", odds: "9/2", winner: "Materiality" },
        ],
        work: [
          { date: "15 Sep", venue: "HYD", clock: "800m sand (-2)", note: "58kg, 600/43, maintains form." },
        ],
      },
      {
        cloth: 5, draw: 6, name: "BEVERLEY", age: "4y b f",
        pedigree: "Oiseau De Feu (USA) - Straightforward",
        trainer: "Ananta Vatsalya", jockey: "Arjun", wt: "55.5", al: "", shoes: "A", eq: "BLK-XNB", rtg: "35 / 33",
        last5: "8-7-4-7-14", tissue: "20/1", rank: 7,
        verdict: "Erratic. One 4th beaten 1.5L, then tailed-off 14th. Blinkers and cross noseband. Pass.",
        similar: "No recent 1100m line that stands up.",
        form: [
          { date: "10 Aug 26", venue: "HYD", dist: "1400m", cls: "C4", pos: "14", field: "14", beaten: "37L", wt: "56.5", odds: "20", winner: "Love All" },
        ],
        work: [
          { date: "10 Sep", venue: "HYD", clock: "800m sand (-1)", note: "600/44, looks well." },
        ],
      },
      {
        cloth: 6, draw: 3, name: "CELESTIAL POWER", exName: "Durado", age: "4y b g",
        pedigree: "Arazan (IRE) - Quilting (USA)",
        trainer: "Raza Shehzad", jockey: "P Uday Kiran", wt: "54", al: "", shoes: "S", eq: "BLK-RDB", rtg: "30 / 30",
        last5: "11", tissue: "33/1", rank: 9,
        verdict: "Steel-shod, tailed off 45L last start. No.",
        similar: "One run this season, nothing.",
        form: [
          { date: "03 Aug 26", venue: "HYD", dist: "1200m", cls: "C4", pos: "11", field: "11", beaten: "45.25L", wt: "54.5", odds: "20", winner: "Stars Envied" },
        ],
        work: [
          { date: "07 Sep", venue: "HYD", clock: "800m sand (+2)", note: "600/46, moved easy." },
        ],
      },
      {
        cloth: 7, draw: 5, name: "ANEMOI", age: "5y b g",
        pedigree: "Air Support (USA) - Jezzabelle",
        trainer: "M F Ali Khan", jockey: "Surya Prakash", wt: "53", al: "", shoes: "S", eq: "TS", rtg: "30 / 28",
        last5: "2-8-8-5-10", tissue: "12/1", rank: 5,
        verdict: "Best recent: 2nd over 1600m beaten 2L. Sprint form is 5th-10th. Steel shoes. 53kg is a help. Outsider for a slice.",
        similar: "Staying type in a dash.",
        form: [
          { date: "10 Aug 26", venue: "HYD", dist: "1400m", cls: "C4", pos: "10", field: "14", beaten: "30.75L", wt: "54", odds: "20", winner: "Love All" },
          { date: "23 Mar 26", venue: "HYD", dist: "1600m", cls: "C4", pos: "2", field: "11", beaten: "2L", wt: "54", odds: "4", winner: "Genie" },
        ],
        work: [],
      },
      {
        cloth: 8, draw: 4, name: "BARBAROSSA", age: "4y ch f",
        pedigree: "Sanus Per Aquam (IRE) - Belladee (IRE)",
        trainer: "K S V Prasad Raju", jockey: "Ajay Kumar", wt: "52.5", al: "", shoes: "S", eq: "", rtg: "0 / 27",
        last5: "-", tissue: "16/1", rank: 6,
        verdict: "Unraced 4yo in a handicap. Steel. Easy pair work. Dangerous if the market talks, otherwise let her run.",
        similar: "No form. Rating 27 is a guess.",
        form: [],
        work: [
          { date: "29 Aug", venue: "HYD", clock: "1000m sand (+3)", note: "With Gilroy, pair well in hand." },
        ],
      },
      {
        cloth: 9, draw: 1, name: "TIMELESS ELEGANCE", age: "4y b f",
        pedigree: "Akeed Champion (GB) - Times Time",
        trainer: "Robin R Kondakalla", jockey: "G Naresh", wt: "51", al: "", shoes: "A", eq: "TS-XNB", rtg: "24 / 24",
        last5: "7-7-10-6-5", tissue: "20/1", rank: 8,
        verdict: "Bottomweight, rail. Beaten 19-23L in most of her sprints. 5th last was still 21L. Needs a collapse.",
        similar: "Bottom of a 20-45 band for a reason.",
        form: [
          { date: "30 Aug 26", venue: "HYD", dist: "1100m", cls: "C4", pos: "5", field: "13", beaten: "21L", wt: "57", odds: "15", winner: "Win Me Over" },
        ],
        work: [
          { date: "15 Sep", venue: "HYD", clock: "800m sand (-1)", note: "600/44, good." },
        ],
      },
    ],
  },
  {
    no: 3,
    official: 103,
    name: "The Falaknuma Trophy Div-1",
    class: "Class 4 handicap, rated 20 to 45, 3yo and upward",
    dist: "1100m",
    time: "03:05 PM",
    purse: "₹6,50,000",
    record: "Versallies 61kg, 1:05.61 (30 Sep 2019)",
    shape: "The better Falaknuma division. She's A Bomb (3yo) is 60kg but Surendra Singh claims 5, so she races at 55kg. American Affair is 1-2-2 at 1200m from stall 1. Two 5kg claims in the field.",
    similarRace:
      "She's A Bomb won the 31 Aug 1200m maiden (Gacchanmanasvin 4th, 13L). American Affair is 1-2-2 at Hyderabad 1200m, including a 1.5L 2nd to My Honey. Last year's Gold Cup lesson does not apply here. This is a sharp 1100m: the 3yo with the claim and the in-form 1200m filly.",
    tissueNote: "Day's best. The 5kg claim turns a 60kg topweight into a 55kg 3yo with a recent win. American Affair is the danger from the fence.",
    nap: true,
    irPick: "She's A Bomb / La Quinta / American Affair",
    ourPick: "She's A Bomb",
    runners: [
      {
        cloth: 1, draw: 3, name: "COMING HOME", age: "8y dkb m",
        pedigree: "Stardan (IRE) - Super Sonic",
        trainer: "Magan Singh", jockey: "B Nikhil", wt: "60.5", al: "", shoes: "S", eq: "TS", rtg: "45 / 43",
        last5: "8-7-6-9-5", tissue: "20/1", rank: 7,
        verdict: "Highest official rating, 8yo, steel, 60.5kg, no recent placing closer than 7L. Last good run was a 2nd in Oct 2025. Out of form.",
        similar: "Exposed and regressing.",
        form: [
          { date: "13 Sep 26", venue: "HYD", dist: "1400m", cls: "C3", pos: "5", field: "9", beaten: "15.5L", wt: "60", odds: "20", winner: "Divine Tiger" },
          { date: "13 Oct 25", venue: "HYD", dist: "1100m", cls: "C4", pos: "2", field: "10", beaten: "3.5L", wt: "53.5", odds: "2", winner: "Federer" },
        ],
        work: [
          { date: "28 Jul", venue: "HYD", clock: "800m sand (+1)", note: "With Dhanadeepa, 600/45." },
        ],
      },
      {
        cloth: 2, draw: 2, name: "SHE'S A BOMB", age: "3y b f",
        pedigree: "Knotty Ash - Hit It A Bomb",
        trainer: "D Netto", jockey: "Surendra Singh", wt: "60", al: "-5", shoes: "A", eq: "TS-BLK", rtg: "27 / 42",
        last5: "11-4-4-5-1", tissue: "2/1", rank: 1,
        verdict: "Nap. Won 1200m maiden 31 Aug (Gacchanmanasvin 13L back). Rating jumped 27 to 42. 60kg on the card, 5kg claim, races at 55kg. Stall 2. Blinkers stay on. 17 Sep work with Double Bubble was even and tidy. IndiaRace day's best. The 3yo vs exposed Class 4 older horses at 1100m is the angle.",
        similar: "Netto also saddles My Touch in race 1. This is the yard's handicap filly. 1200m win into 1100m is a slight drop, not a concern with the claim.",
        form: [
          { date: "31 Aug 26", venue: "HYD", dist: "1200m", cls: "Maiden", pos: "1", field: "8", beaten: "0", wt: "54.5", odds: "7", winner: "She's A Bomb" },
          { date: "10 Aug 26", venue: "HYD", dist: "1400m", cls: "Maiden", pos: "5", field: "11", beaten: "13L", wt: "54.5", odds: "15", winner: "Love All" },
          { date: "05 Apr 26", venue: "HYD", dist: "1100m", cls: "Maiden", pos: "4", field: "9", beaten: "5L", wt: "54.5", odds: "8", winner: "Cosmic Gift" },
        ],
        work: [
          { date: "17 Sep", venue: "HYD", clock: "800m sand (-1)", note: "With Double Bubble, 600/44, pair moved well." },
        ],
      },
      {
        cloth: 3, draw: 1, name: "AMERICAN AFFAIR", age: "4y b f",
        pedigree: "Air Support (USA) - Aunt Dottie (GB)",
        trainer: "Ananta Vatsalya", jockey: "A Ashhad Asbar", wt: "57.5", al: "", shoes: "A", eq: "TS-XNB", rtg: "34 / 37",
        last5: "6-7-1-2-2", tissue: "3/1", rank: 2,
        verdict: "The danger. Won 1200m in April under 61kg, then 2nd and 2nd again at 1200m (1.5L and 2.75L). Stall 1. Ashhad. 15 Sep monsoon grass 1000m (-7), 600/39, is a serious piece. 1100m is sharp enough. If She's A Bomb misses the kick, this filly nicks it on the fence.",
        similar: "Current 1200m form is the best exposed handicap form in the division.",
        form: [
          { date: "09 Aug 26", venue: "HYD", dist: "1200m", cls: "C4", pos: "2", field: "11", beaten: "1.5L", wt: "56", odds: "6/4", winner: "My Honey" },
          { date: "03 Aug 26", venue: "HYD", dist: "1200m", cls: "C4", pos: "2", field: "11", beaten: "2.75L", wt: "55", odds: "4", winner: "Fox Worth" },
          { date: "04 Apr 26", venue: "HYD", dist: "1200m", cls: "C4", pos: "1", field: "12", beaten: "0", wt: "61", odds: "6", winner: "American Affair" },
        ],
        work: [
          { date: "15 Sep", venue: "HYD", clock: "1000m grass (-7)", note: "800/52, 600/39, good." },
        ],
      },
      {
        cloth: 4, draw: 4, name: "LA QUINTA", age: "4y b g",
        pedigree: "Well Done Fox (GB) - Xtreme",
        trainer: "K S V Prasad Raju", jockey: "Akshay Kumar", wt: "57.5", al: "", shoes: "A", eq: "TS-BLK-XNB", rtg: "37 / 37",
        last5: "2-4-2-4-12", tissue: "5/1", rank: 3,
        verdict: "Akshay's other ride. 2nd over 1200m beaten 5L, then a shocker 12th beaten 40L at 1400m. Blinkers/cross noseband. 1100m should suit more than 1400m. Draw 4. IndiaRace have him 2nd. I have him 3rd: the 40L run is a red flag, even if it was the wrong trip.",
        similar: "When kept at 1100-1200m he is 2nd/4th. When stretched, he bombs.",
        form: [
          { date: "23 Aug 26", venue: "HYD", dist: "1400m", cls: "C3", pos: "12", field: "12", beaten: "40.75L", wt: "60", odds: "12", winner: "Dino" },
          { date: "10 Aug 26", venue: "HYD", dist: "1200m", cls: "C3", pos: "4", field: "11", beaten: "5L", wt: "57.5", odds: "10", winner: "Basilica" },
          { date: "28 Jul 26", venue: "HYD", dist: "1200m", cls: "C3", pos: "2", field: "9", beaten: "5L", wt: "59", odds: "5", winner: "Ek" },
        ],
        work: [
          { date: "24 Jul", venue: "HYD", clock: "800m sand (+2)", note: "600/46, moved easy. Stale work." },
        ],
      },
      {
        cloth: 5, draw: 8, name: "FLARE", exName: "N R I Star", age: "5y b m",
        pedigree: "Saamidd (GB) - Fabulousday (USA)",
        trainer: "Ananta Vatsalya", jockey: "V S Shekhawat", wt: "55", al: "-5", shoes: "A", eq: "TS-SCP", rtg: "32 / 32",
        last5: "1-9-3-6-10", tissue: "8/1", rank: 4,
        verdict: "Second 5kg claim. Won 1400m in Oct 2025. Recent 1600/1800m runs are poor. Back to a sprint with scuppers. Wide draw. Each-way if they overbet the top 2.",
        similar: "Same trainer as American Affair. Shekhawat's claim is the only reason she is in the tissue.",
        form: [
          { date: "16 Aug 26", venue: "HYD", dist: "1600m", cls: "C4", pos: "10", field: "11", beaten: "33L", wt: "54.5", odds: "12", winner: "Mountain Touch" },
          { date: "05 Oct 25", venue: "HYD", dist: "1400m", cls: "C4", pos: "1", field: "10", beaten: "0", wt: "58.5", odds: "5", winner: "Flare" },
        ],
        work: [],
      },
      {
        cloth: 6, draw: 10, name: "LEGO", age: "5y b m",
        pedigree: "Declaration Of War (IRE) - Royal Princess",
        trainer: "G Sandeep", jockey: "Kuldeep Singh", wt: "54.5", al: "", shoes: "S", eq: "TS-RDB", rtg: "34 / 31",
        last5: "9-5-9-5-9", tissue: "20/1", rank: 8,
        verdict: "Steel, wide, beaten 10-31L. Out.",
        similar: "No.",
        form: [
          { date: "05 Sep 26", venue: "HYD", dist: "1400m", cls: "C4", pos: "9", field: "10", beaten: "26L", wt: "56", odds: "20", winner: "Love All" },
        ],
        work: [],
      },
      {
        cloth: 7, draw: 7, name: "COMMANDING WARRIOR", age: "4y b g",
        pedigree: "Arazan (IRE) - Commelina",
        trainer: "Raza Shehzad", jockey: "Surya Prakash", wt: "53", al: "", shoes: "S", eq: "BLK-DRB", rtg: "0 / 28",
        last5: "6", tissue: "25/1", rank: 9,
        verdict: "One run, 6th beaten 14L last September. Steel. First run in a year. Pass.",
        similar: "Needs a run.",
        form: [
          { date: "30 Sep 25", venue: "HYD", dist: "1400m", cls: "Maiden", pos: "6", field: "10", beaten: "14.25L", wt: "56", odds: "20", winner: "State Man" },
        ],
        work: [],
      },
      {
        cloth: 8, draw: 9, name: "GOLDEN AURA", age: "4y ch g",
        pedigree: "Desert God - Admire Aura",
        trainer: "M Srinivas Reddy", jockey: "G Naresh", wt: "52", al: "", shoes: "A", eq: "TS-XNB", rtg: "26 / 26",
        last5: "5-6-2-6-4", tissue: "12/1", rank: 5,
        verdict: "2nd over 1800m in April. Recent 1200m 4th beaten 14.5L. Light weight. Small each-way if the race falls apart.",
        similar: "Staying type.",
        form: [
          { date: "05 Sep 26", venue: "HYD", dist: "1200m", cls: "C4", pos: "4", field: "12", beaten: "14.5L", wt: "57", odds: "20", winner: "Equine Power" },
          { date: "04 Apr 26", venue: "HYD", dist: "1800m", cls: "C4", pos: "2", field: "7", beaten: "4.75L", wt: "55", odds: "5", winner: "Yuvraj" },
        ],
        work: [],
      },
      {
        cloth: 9, draw: 5, name: "SANTORINI SKY", exName: "Indubhrit", age: "4y b f",
        pedigree: "Basem (GB) - Jetaway",
        trainer: "Magan Singh", jockey: "D S Deora", wt: "51.5", al: "", shoes: "A", eq: "TS-SCP", rtg: "27 / 25",
        last5: "15", tissue: "33/1", rank: 10,
        verdict: "15th beaten 38L. Scuppers. No.",
        similar: "No.",
        form: [
          { date: "05 Oct 25", venue: "HYD", dist: "1200m", cls: "C4", pos: "15", field: "16", beaten: "38.5L", wt: "51", odds: "20", winner: "Safala" },
        ],
        work: [],
      },
      {
        cloth: 10, draw: 6, name: "RATE OF INTEREST", age: "4y ch f",
        pedigree: "Desert God - Starynessey",
        trainer: "Robin R Kondakalla", jockey: "Arjun", wt: "50", al: "", shoes: "A", eq: "TS", rtg: "22 / 22",
        last5: "9-10-7-8-8", tissue: "25/1", rank: 6,
        verdict: "Bottomweight. Always 7th-10th, beaten 12-25L. Makes up the numbers.",
        similar: "No.",
        form: [
          { date: "30 Aug 26", venue: "HYD", dist: "1100m", cls: "C4", pos: "8", field: "13", beaten: "25L", wt: "56", odds: "20", winner: "Win Me Over" },
        ],
        work: [],
      },
    ],
  },
  {
    no: 4,
    official: 104,
    name: "The Totaram's Cup",
    class: "Terms race, 3 year olds and upward",
    dist: "1200m",
    time: "03:40 PM",
    purse: "₹12,25,000",
    record: "Dancing Phoenix 54kg, 1:11.31 (21 Aug 2016)",
    shape: "Terms sprint, not a handicap. Rating-to-weight is the whole race. One N Only (99/107) carries 54.5kg. Celestial (81) carries 58kg. Emerald Touch is a 4yo filly at 50.5kg off a 1200m win.",
    similarRace:
      "Last year's Totaram's Cup: Noble Heart came from the rear and won easily. Pattern: do not overbet the on-speed favourite if the terms horse is well in. One N Only won the 23 Aug 1200m under 60kg. He drops 5.5kg. Black Onyx has been 2nd in four of his last five at 1200-1600m. Emerald Touch won the 17 Aug 1200m at 6/10.",
    tissueNote: "One N Only is stone well-in at the weights. Emerald Touch is the 4yo improving filly at a feather. Black Onyx is the reliable each-way.",
    irPick: "One N Only / Uchchaihshravas / Black Onyx",
    ourPick: "One N Only",
    runners: [
      {
        cloth: 1, draw: 7, name: "CELESTIAL", age: "5y b g",
        pedigree: "Roderic O'Connor (IRE) - Sweeping Star",
        trainer: "Laxman Singh", jockey: "Gaurav Singh", wt: "58", al: "", shoes: "A", eq: "TS-BB", rtg: "81 / 81",
        last5: "1-3-11-6-8", tissue: "12/1", rank: 6,
        verdict: "Topweight 58kg off 81. Last 1200m was an 11th in April. Recent 1400/1600m 6th and 8th. Won a Pune 1400m a year ago. 15 Sep grass work (-8) is a plus, but the weight is all wrong against a 107-rated sprinter.",
        similar: "Terms crush him versus One N Only.",
        form: [
          { date: "30 Aug 26", venue: "HYD", dist: "1400m", cls: "Terms", pos: "8", field: "9", beaten: "8.25L", wt: "50", odds: "20", winner: "Echoes Of Time" },
          { date: "13 Sep 25", venue: "PUN", dist: "1400m", cls: "Terms", pos: "1", field: "10", beaten: "0", wt: "55", odds: "11/4", winner: "Celestial" },
        ],
        work: [
          { date: "15 Sep", venue: "HYD", clock: "1000m grass (-8)", note: "With Diligence, 600/40, pair level." },
        ],
      },
      {
        cloth: 2, draw: 9, name: "ONE N ONLY", age: "5y b g",
        pedigree: "Akeed Champion (GB) - Magical Night (GB)",
        trainer: "D Netto", jockey: "Akshay Kumar", wt: "54.5", al: "", shoes: "A", eq: "TS", rtg: "99 / 107",
        last5: "12-4-2-5-1", tissue: "9/4", rank: 1,
        verdict: "The well-in horse. Won 1200m 23 Aug under 60kg. Drops to 54.5kg, Akshay stays. Rating 107 vs several in the 60-90 band. Draw 9 is the only knock: he will need to be handy or get a split. 17 Sep work 'maintains form'. Netto's third runner of the day, and this is the class one.",
        similar: "Beat Diablo's field over 1200m in July (5th, 2.5L under 58kg) then won next time up. This is a weaker terms bunch than those Class 1/2 sprints.",
        form: [
          { date: "23 Aug 26", venue: "HYD", dist: "1200m", cls: "Terms", pos: "1", field: "12", beaten: "0", wt: "60", odds: "7/4", winner: "One N Only" },
          { date: "27 Jul 26", venue: "HYD", dist: "1200m", cls: "Terms", pos: "5", field: "10", beaten: "2.5L", wt: "58", odds: "3", winner: "Diablo" },
          { date: "04 Apr 26", venue: "HYD", dist: "1200m", cls: "Terms", pos: "2", field: "12", beaten: "4.25L", wt: "59", odds: "3", winner: "Northern Waves" },
        ],
        work: [
          { date: "17 Sep", venue: "HYD", clock: "800m sand (-2)", note: "58kg, 600/44, maintains form." },
        ],
      },
      {
        cloth: 3, draw: 6, name: "SHADOW OF THE MOON", age: "6y gr h",
        pedigree: "Sir Cecil - Avarua",
        trainer: "A Imran Khan", jockey: "S Saqlain", wt: "53.5", al: "", shoes: "A", eq: "TS-BLK", rtg: "73 / 70",
        last5: "12-7-8-8-8", tissue: "33/1", rank: 9,
        verdict: "Beaten 18-66L in six straight. Out.",
        similar: "No.",
        form: [
          { date: "07 Sep 26", venue: "HYD", dist: "1800m", cls: "Terms", pos: "8", field: "10", beaten: "18.75L", wt: "53.5", odds: "20", winner: "Nonpariel" },
        ],
        work: [],
      },
      {
        cloth: 4, draw: 8, name: "UCHCHAIHSHRAVAS", age: "5y b h",
        pedigree: "Excellent Art (GB) - Chase The Sun",
        trainer: "Neelesh Rawal", jockey: "Neeraj Rawal", wt: "53.5", al: "", shoes: "A", eq: "TS", rtg: "90 / 90",
        last5: "3-10-8-5-5", tissue: "8/1", rank: 5,
        verdict: "IndiaRace's 2nd pick. Neeraj. Honest 5ths beaten 3-3.5L at 1400m. 90 rated, 53.5kg is fair. Draw 8. Place chance, win needs the top two to miss.",
        similar: "Always thereabouts, rarely wins. Bangalore 1200m win last July is the sprint ticket.",
        form: [
          { date: "30 Aug 26", venue: "HYD", dist: "1400m", cls: "Terms", pos: "5", field: "9", beaten: "3.5L", wt: "50", odds: "9/2", winner: "Echoes Of Time" },
          { date: "17 Aug 26", venue: "HYD", dist: "1400m", cls: "Terms", pos: "5", field: "11", beaten: "3L", wt: "54", odds: "20", winner: "Ashoka" },
        ],
        work: [
          { date: "25 Aug", venue: "HYD", clock: "1000m sand (+3)", note: "Handy. Not a wow piece." },
        ],
      },
      {
        cloth: 5, draw: 2, name: "BLACK ONYX", age: "8y dkb g",
        pedigree: "Stardan (IRE) - Dancing Dame",
        trainer: "Magan Singh", jockey: "D S Deora", wt: "52", al: "", shoes: "A", eq: "TS", rtg: "97 / 100",
        last5: "9-2-4-2-2", tissue: "4/1", rank: 3,
        verdict: "The each-way machine. 2nd, 2nd, 4th, 2nd in his last four, including 2nd on 13 Sep beaten 2.75L by Corinthian (Reigning Beauty also 2nd in that photo). 52kg, stall 2, 100 rated. 8yo but he has not stopped. Grass work -8 with Feel The Magic. Will be running at them late.",
        similar: "Direct line with Reigning Beauty (same 13 Sep race). He is 3kg worse off at the weights here but 10 rating points better.",
        form: [
          { date: "13 Sep 26", venue: "HYD", dist: "1400m", cls: "Terms", pos: "2", field: "9", beaten: "2.75L", wt: "58.5", odds: "12", winner: "Corinthian" },
          { date: "17 Aug 26", venue: "HYD", dist: "1400m", cls: "Terms", pos: "2", field: "11", beaten: "2L", wt: "52", odds: "7", winner: "Ashoka" },
          { date: "27 Jul 26", venue: "HYD", dist: "1200m", cls: "Terms", pos: "2", field: "10", beaten: "1L", wt: "55", odds: "9/2", winner: "Diablo" },
        ],
        work: [
          { date: "08 Sep", venue: "HYD", clock: "1200m grass (-8)", note: "With Feel The Magic, 600/43, pair level." },
        ],
      },
      {
        cloth: 6, draw: 1, name: "DETECTIVE", age: "6y b h",
        pedigree: "Sedgefield (USA) - Translation (GB)",
        trainer: "N Ravinder Singh", jockey: "Vikram Singh", wt: "52", al: "", shoes: "S", eq: "TS-XNB", rtg: "69 / 67",
        last5: "4-9-8-7-9", tissue: "25/1", rank: 8,
        verdict: "Steel, last win Jul 2025. Recent 9ths. Stall 1 is wasted.",
        similar: "Class short.",
        form: [
          { date: "07 Sep 26", venue: "HYD", dist: "1200m", cls: "C3", pos: "9", field: "12", beaten: "9.5L", wt: "54", odds: "20", winner: "Annhilator" },
        ],
        work: [
          { date: "04 Sep", venue: "HYD", clock: "800m sand (-4)", note: "56kg, 600/43, note." },
        ],
      },
      {
        cloth: 7, draw: 3, name: "CALISTA GIRL", age: "6y ch m",
        pedigree: "Cougar Mountain (IRE) - Incandescent",
        trainer: "N Ravinder Singh", jockey: "Bhawani Singh", wt: "50.5", al: "", shoes: "A", eq: "TS-XNB", rtg: "71 / 69",
        last5: "10-4-6-8-10", tissue: "20/1", rank: 7,
        verdict: "Beaten 8-16L lately. 50.5kg is the only plus.",
        similar: "No.",
        form: [
          { date: "07 Sep 26", venue: "HYD", dist: "1200m", cls: "C3", pos: "10", field: "12", beaten: "16.5L", wt: "55.5", odds: "20", winner: "High Speed Dive" },
        ],
        work: [],
      },
      {
        cloth: 8, draw: 4, name: "EMERALD TOUCH", age: "4y b f",
        pedigree: "Smuggler's Cove (IRE) - Carved Emerald (GB)",
        trainer: "Neelesh Rawal", jockey: "M S Deora", wt: "50.5", al: "", shoes: "A", eq: "RB-XNB", rtg: "60 / 69",
        last5: "1-5-2-2-1", tissue: "3/1", rank: 2,
        verdict: "Longshot of the day at a price, 2nd on the tissue. 4yo filly, 50.5kg. Won 1200m 17 Aug at 6/10, 2nd the start before (head). Rating climbing 60 to 69. Draw 4. This is a class rise into 90-107 horses, but the terms give her 4kg from One N Only and 1.5kg from Black Onyx. If she brings the maiden/Class 3 sprint form, she runs a huge race.",
        similar: "Improving 4yo vs exposed older sprinters is the Gold Cup 2025 pattern, just at a lower level.",
        form: [
          { date: "17 Aug 26", venue: "HYD", dist: "1200m", cls: "C3", pos: "1", field: "9", beaten: "0", wt: "58.5", odds: "6/10", winner: "Emerald Touch" },
          { date: "27 Jul 26", venue: "HYD", dist: "1200m", cls: "C3", pos: "2", field: "11", beaten: "hd", wt: "58", odds: "8", winner: "Catch The Worm" },
          { date: "24 Mar 26", venue: "HYD", dist: "1200m", cls: "C3", pos: "2", field: "12", beaten: "0.5L", wt: "60", odds: "6", winner: "Ayushman" },
        ],
        work: [
          { date: "25 Aug", venue: "HYD", clock: "800m sand (-1)", note: "With Classy Touch, 600/44, pair moved well." },
        ],
      },
      {
        cloth: 9, draw: 5, name: "REIGNING BEAUTY", age: "6y gr m",
        pedigree: "Pinson (IRE) - Beau Ideal",
        trainer: "Neelesh Rawal", jockey: "Santosh Raj N R", wt: "50.5", al: "", shoes: "A", eq: "TS", rtg: "87 / 90",
        last5: "2-10-3-7-2", tissue: "6/1", rank: 4,
        verdict: "2nd on 13 Sep beaten 2.75L (same race as Black Onyx). 50.5kg is a lovely weight. Draw 5. Yard also has Emerald Touch. She stays 1400-1600m better, but 3.25L 3rd over 1600m and a 2nd last week keep her in the frame.",
        similar: "Direct 13 Sep line with Black Onyx. 6.5kg better off at the weights for a 2.75L beating. Live each-way.",
        form: [
          { date: "13 Sep 26", venue: "HYD", dist: "1400m", cls: "Terms", pos: "2", field: "9", beaten: "2.75L", wt: "53.5", odds: "9/2", winner: "Corinthian" },
          { date: "03 Aug 26", venue: "HYD", dist: "1600m", cls: "Terms", pos: "3", field: "7", beaten: "3.25L", wt: "50.5", odds: "20", winner: "N R I Superpower" },
        ],
        work: [
          { date: "10 Sep", venue: "HYD", clock: "1000m sand (+1)", note: "With Vinfast, former moved well." },
        ],
      },
    ],
  },
  {
    no: 5,
    official: 105,
    name: "The President Of India Gold Cup (Gr.2)",
    class: "Terms, 4 year olds and upward. Feature of the card.",
    dist: "2400m",
    time: "04:15 PM",
    purse: "₹31,43,251",
    record: "Adjudicate 55.5kg, 2:27.20 (03 Mar 2019)",
    shape: "Seven runners. Set-weight terms. Zuccaro 56.5kg (123) is 3.5kg better off with Duke of Tuscany 60kg (120). Miracle Star is the 4yo filly at 55.5kg with Trevor. Hoods on Zuccaro and Ramiel.",
    similarRace:
      "2025 Gold Cup (14 Sep, 2:32.60): Star Of Night (4yo, light weight, 4/1) beat Pyrite and Dyf (8/13 fav, 60kg) by 1L, head, 0.5L. Ramiel was 7th beaten 6.75L. Pattern: the older topweight favourite is vulnerable to a well-weighted 4yo, and 60kg is a real tax at this trip. Dyf runs back in this race 3kg lighter than last year. Duke of Tuscany has since won the Pune 2400m (29 Aug) and was 2nd to Ramiel over 2800m at Bangalore.",
    tissueNote: "Zuccaro is 5-from-5 this term and the terms favour him. The only question is 2400m. Duke is the proven stayer. Dyf is the course horse. Do not dismiss Miracle Star off the 2025 4yo template.",
    irPick: "Zuccaro / Duke of Tuscany / Dyf",
    ourPick: "Zuccaro",
    runners: [
      {
        cloth: 1, draw: 7, name: "DUKE OF TUSCANY", age: "5y b g",
        pedigree: "Cougar Mountain (IRE) - Nicollini",
        trainer: "P Shroff", jockey: "R Ajinkya", wt: "60", al: "", shoes: "A", eq: "TS", rtg: "120 / 120",
        last5: "7-6-1-2-1", tissue: "5/2", rank: 2,
        verdict: "Proven 2400/2800m horse. Won Pune 2400m 29 Aug (Fynbos), 2nd to Ramiel in the Bangalore St Leger 2800m, won Bangalore 2400m. Topweight 60kg is the Gold Cup curse (Dyf 60kg, 8/13, 3rd last year). Stall 7 widest. Same Shroff yard as Zuccaro: they have the quinella. Ajinkya, not Vivek, which tells you Zuccaro is the first string. Pune inner-sand 2000m (-6) with Fynbos is proper staying work.",
        similar: "Last year's 60kg favourite got beaten. Duke is the 2026 version of that profile: stays, classy, wrong weight.",
        form: [
          { date: "29 Aug 26", venue: "PUN", dist: "2400m", cls: "Terms", pos: "1", field: "6", beaten: "0", wt: "60", odds: "15", winner: "Duke Of Tuscany" },
          { date: "31 Jul 26", venue: "BAN", dist: "2800m", cls: "Terms", pos: "2", field: "10", beaten: "1L", wt: "58.5", odds: "5/2", winner: "Ramiel" },
          { date: "19 Jul 26", venue: "BAN", dist: "2400m", cls: "Terms", pos: "1", field: "4", beaten: "0", wt: "60", odds: "1/2", winner: "Duke Of Tuscany" },
          { date: "24 May 26", venue: "BAN", dist: "1400m", cls: "Terms", pos: "7", field: "8", beaten: "7.75L", wt: "60", odds: "12", winner: "Zuccaro" },
        ],
        work: [
          { date: "11 Sep", venue: "PUN", clock: "2000m inner (-6)", note: "With Fynbos. Former started 3L behind, finished together." },
          { date: "26 Aug", venue: "PUN", clock: "1400m inner (-8)", note: "With Fynbos, pair worked well." },
        ],
      },
      {
        cloth: 2, draw: 1, name: "RAMIEL", age: "6y ch g",
        pedigree: "Win Legend (JPN) - Angelique",
        trainer: "Bharath Singh", jockey: "Antony Raj S", wt: "58", al: "", shoes: "A", eq: "TS-HOOD", rtg: "110 / 121",
        last5: "7-2-7-9-1", tissue: "6/1", rank: 4,
        verdict: "Won the Bangalore 2800m on 31 Jul, beating Duke 1L and Dyf 2.25L as a 12/1. 7th in this race last year (6.75L). Stall 1, hood. 15 Sep Hyderabad grass 1000m (-7), 600/41, is a good local pipe-opener. 58kg is fair. The 2200m 9th to Zuccaro (15.5L) says he does not want a sprint-finish 10f, but 2400m is his trip. Each-way.",
        similar: "2025 Gold Cup: 7th. 2026 St Leger: 1st. Better horse now, still not the terms winner.",
        form: [
          { date: "31 Jul 26", venue: "BAN", dist: "2800m", cls: "Terms", pos: "1", field: "10", beaten: "0", wt: "58.5", odds: "12", winner: "Ramiel" },
          { date: "05 Jul 26", venue: "BAN", dist: "2200m", cls: "Terms", pos: "9", field: "13", beaten: "15.5L", wt: "58.5", odds: "20", winner: "Zuccaro" },
          { date: "23 Mar 26", venue: "HYD", dist: "2800m", cls: "Terms", pos: "2", field: "6", beaten: "0.75L", wt: "57", odds: "20", winner: "Dyf" },
          { date: "14 Sep 25", venue: "HYD", dist: "2400m", cls: "Gr.2", pos: "7", field: "10", beaten: "6.75L", wt: "57", odds: "15", winner: "Star Of Night" },
        ],
        work: [
          { date: "15 Sep", venue: "HYD", clock: "1000m grass (-7)", note: "800/54, 600/41, moved well." },
        ],
      },
      {
        cloth: 3, draw: 5, name: "DYF", age: "7y gr h",
        pedigree: "Cougar Mountain (IRE) - Soak (IRE)",
        trainer: "Adhiraj S Jodha", jockey: "Yash Narredu", wt: "57", al: "", shoes: "A", eq: "XNB", rtg: "114 / 114",
        last5: "3-2-3-1-3", tissue: "4/1", rank: 3,
        verdict: "Course specialist. 3rd in this race last year under 60kg (9/10 fav), beaten 1L. Won the Hyderabad 2800m in March. 3rd to Ramiel/Duke in the Bangalore 2800m. 57kg is 3kg less than last year. Yash Narredu. Draw 5. Trackwork is the worry: last listed piece is 27 Aug at Pune. He usually needs a recent hit-out. Still the one who knows this race.",
        similar: "Last year's Gold Cup is his race map. He was just not good enough under 60kg. 57kg gives him a chance to reverse with the younger speed horses if it becomes a true stay.",
        form: [
          { date: "31 Jul 26", venue: "BAN", dist: "2800m", cls: "Terms", pos: "3", field: "10", beaten: "2.25L", wt: "58.5", odds: "9/4", winner: "Ramiel" },
          { date: "23 Mar 26", venue: "HYD", dist: "2800m", cls: "Terms", pos: "1", field: "6", beaten: "0", wt: "57", odds: "9/5", winner: "Dyf" },
          { date: "14 Sep 25", venue: "HYD", dist: "2400m", cls: "Gr.2", pos: "3", field: "10", beaten: "1L", wt: "60", odds: "9/10", winner: "Star Of Night" },
        ],
        work: [
          { date: "27 Aug", venue: "PUN", clock: "1200m inner (-8)", note: "With Avener, 600/39, pair fluent. Stale by 3 weeks." },
        ],
      },
      {
        cloth: 4, draw: 6, name: "ZUCCARO", age: "6y ch g",
        pedigree: "Kingda Ka (AUS) - Mahali",
        trainer: "P Shroff", jockey: "Vivek G", wt: "56.5", al: "", shoes: "A", eq: "TS-HOOD", rtg: "117 / 123",
        last5: "1-1-1-1-1", tissue: "7/4", rank: 1,
        verdict: "Selection. Unbeaten in five this term: 1400, 1600, 1600, 2200 (4L). Vivek G sticks. Hood. 56.5kg is a gift against Duke's 60kg. 15 Sep Pune 1600m inner (-8), started 3L behind Red Bishop and finished level, 600/38. That is Group horses' work. The doubt is 2400m: he has not raced beyond 2200m. The 2200m win was visual and dominant, so the extra 200m is a calculated risk, not a stab. IndiaRace make him favourite. So do I.",
        similar: "Terms in his favour, as IndiaRace wrote. Last year the 4yo beat the 60kg favourite. This year the well-weighted in-form horse is Zuccaro himself.",
        form: [
          { date: "05 Jul 26", venue: "BAN", dist: "2200m", cls: "Terms", pos: "1", field: "13", beaten: "0", wt: "57", odds: "85/100", winner: "Zuccaro" },
          { date: "07 Jun 26", venue: "BAN", dist: "1600m", cls: "Terms", pos: "1", field: "5", beaten: "0", wt: "56.5", odds: "3/5", winner: "Zuccaro" },
          { date: "24 May 26", venue: "BAN", dist: "1400m", cls: "Terms", pos: "1", field: "8", beaten: "0", wt: "55.5", odds: "2", winner: "Zuccaro" },
          { date: "15 Mar 26", venue: "MUM", dist: "1600m", cls: "Terms", pos: "1", field: "7", beaten: "0", wt: "53.5", odds: "6", winner: "Zuccaro" },
        ],
        work: [
          { date: "15 Sep", venue: "PUN", clock: "1600m inner (-8)", note: "With Red Bishop. Started 3L behind, finished together, 600/38." },
          { date: "22 Aug", venue: "PUN", clock: "1600m inner (-10)", note: "With Chagall, pair moved attractively, 600/38." },
        ],
      },
      {
        cloth: 5, draw: 3, name: "MIRACLE STAR", age: "4y b f",
        pedigree: "Excellent Art (GB) - Romantic Star",
        trainer: "James Mckeown", jockey: "P Trevor", wt: "55.5", al: "", shoes: "A", eq: "TS", rtg: "109 / 109",
        last5: "3-1-1-3-5", tissue: "8/1", rank: 5,
        verdict: "The 2025 template. 4yo filly, Trevor, 55.5kg. 5th to Zuccaro over 2200m beaten 9.25L, so she has a length to find. 3rd in the Bangalore Stayers over 1800m. Won Mysore 2000m. McKeown. Draw 3. If they crawl and she stays 2400m, she is the bomb. If Zuccaro kicks at the 600m, she is 5th again.",
        similar: "Star Of Night last year: 4yo, light, 4/1, won. Miracle Star is that profile with worse 2200m form.",
        form: [
          { date: "05 Jul 26", venue: "BAN", dist: "2200m", cls: "Terms", pos: "5", field: "13", beaten: "9.25L", wt: "56", odds: "7", winner: "Zuccaro" },
          { date: "20 Jun 26", venue: "BAN", dist: "1800m", cls: "Terms", pos: "3", field: "12", beaten: "3.75L", wt: "55.5", odds: "2", winner: "Alfonsine" },
          { date: "30 May 26", venue: "BAN", dist: "1600m", cls: "C1", pos: "1", field: "5", beaten: "0", wt: "53", odds: "32/100", winner: "Miracle Star" },
        ],
        work: [
          { date: "14 Sep", venue: "BAN", clock: "1600m outer (-4)", note: "600/43, worked well." },
          { date: "07 Sep", venue: "BAN", clock: "1400m outer (-4)", note: "Trevor up, 600/43, moved well." },
        ],
      },
      {
        cloth: 6, draw: 4, name: "HIGH COMMAND", age: "6y b h",
        pedigree: "Leitir Mor (IRE) - Heiress",
        trainer: "L V R Deshmukh", jockey: "P Ajeeth Kumar", wt: "53", al: "", shoes: "A", eq: "TS-XNB", rtg: "99 / 99",
        last5: "4-6-4-4-10", tissue: "25/1", rank: 7,
        verdict: "4th to Duke at Kolkata 2400m, beaten 10L. Recent Hyderabad 1400m 10th. 53kg is light because he is 20-24 points inferior. No.",
        similar: "Already beaten by Duke at the trip.",
        form: [
          { date: "17 Aug 26", venue: "HYD", dist: "1400m", cls: "Terms", pos: "10", field: "11", beaten: "11.5L", wt: "59", odds: "12", winner: "Ashoka" },
          { date: "07 Feb 26", venue: "KOL", dist: "2400m", cls: "Terms", pos: "4", field: "4", beaten: "10.25L", wt: "59", odds: "20", winner: "Duke Of Tuscany" },
        ],
        work: [
          { date: "17 Sep", venue: "HYD", clock: "800m sand (-2)", note: "With Champion Reef, former moved well." },
        ],
      },
      {
        cloth: 7, draw: 2, name: "VYASA", age: "6y ch g",
        pedigree: "Speaking Of Which (IRE) - Prussian Blue",
        trainer: "G Sandeep", jockey: "A Ashhad Asbar", wt: "52", al: "", shoes: "A", eq: "TS-BLK-XNB", rtg: "82 / 90",
        last5: "1-6-1-1-2", tissue: "20/1", rank: 6,
        verdict: "Local 2nd over 2000m (Prokofiev, 0.75L) at 15s. Class 2 winner here in March. 52kg. Group 2 is a huge rise, but he is fit, local, and the lightest colt. 20s is about right. Small saver if you want a crazy Gold Cup.",
        similar: "Class gap is the story. Star Of Night last year was a Group horse already. Vyasa is not.",
        form: [
          { date: "17 Aug 26", venue: "HYD", dist: "2000m", cls: "Terms", pos: "2", field: "12", beaten: "0.75L", wt: "53.5", odds: "15", winner: "Prokofiev" },
          { date: "17 Mar 26", venue: "HYD", dist: "1400m", cls: "C2", pos: "1", field: "14", beaten: "0", wt: "54.5", odds: "9/10", winner: "Vyasa" },
        ],
        work: [
          { date: "11 Sep", venue: "HYD", clock: "800m sand (-3)", note: "57kg, 600/43, pleased." },
        ],
      },
    ],
  },
  {
    no: 6,
    official: 106,
    name: "The Nelston Plate",
    class: "Class 4 handicap, rated 20 to 45, 4 year olds and upward",
    dist: "1600m",
    time: "04:50 PM",
    purse: "₹6,50,000",
    record: "Machiavellianism 62kg, 1:37.43 (21 Sep 2014)",
    shape: "Mile handicap to close. Onslaught 61kg from stall 2 is the form horse. Quintessential has already won a 1600m under 62kg. Hoping High just won a 1600m and is up 5kg. American Gangster is 2nd to Quintessential and 5kg better off.",
    similarRace:
      "Quintessential won a 1600m under 62kg then 3rd to Pride Aside beaten 4.25L. Hoping High won 1600m from Silver Arrow (6th, 8.75L). American Gangster was 2nd to Quintessential over 1600m, beaten 4L, and is 5kg better off today. Valledonna is the consistent filly (2-3-4-5-3).",
    tissueNote: "Quintessential already packed 62kg and won at the trip. Onslaught is the in-form gelding. American Gangster is the weight-turnaround bet.",
    irPick: "Onslaught / Quintessential / Valledonna",
    ourPick: "Quintessential",
    runners: [
      {
        cloth: 1, draw: 2, name: "ONSLAUGHT", age: "4y b g",
        pedigree: "Air Support (USA) - Jezzabelle",
        trainer: "Raza Shehzad", jockey: "Imran Chisty", wt: "61", al: "", shoes: "A", eq: "TS", rtg: "42 / 43",
        last5: "1-2-3-6-3", tissue: "3/1", rank: 2,
        verdict: "Topweight, stall 2, Chisty. 3rd last time over 1400m. Won a 1600m last year. Consistent 1-2-3 profile. 61kg in a 20-45 is the limit. IndiaRace 1st. I have him 2nd: Quintessential has already beaten this band under more weight.",
        similar: "Half to Anemoi (race 2). The family stays.",
        form: [
          { date: "05 Sep 26", venue: "HYD", dist: "1400m", cls: "C4", pos: "3", field: "12", beaten: "6.75L", wt: "60", odds: "8", winner: "Super Splash" },
          { date: "2025", venue: "HYD", dist: "1600m", cls: "C4", pos: "1", field: "11", beaten: "0", wt: "56", odds: "12", winner: "Onslaught" },
        ],
        work: [
          { date: "17 Sep", venue: "HYD", clock: "800m sand (-1)", note: "Chisty up, 600/44, handy." },
        ],
      },
      {
        cloth: 2, draw: 8, name: "HOPING HIGH", age: "5y b h",
        pedigree: "Saamidd (GB) - Christmas Fever (USA)",
        trainer: "Jasbir Singh", jockey: "Mohit Singh", wt: "58.5", al: "", shoes: "A", eq: "TS", rtg: "29 / 38",
        last5: "4-2-2-6-1", tissue: "5/1", rank: 4,
        verdict: "Won 1600m last start under 53.5kg. Up 5kg after a 9-point rating jump. Draw 8. Form 1-2-2 is real. The rise in the weights is the knock. Include in exotics.",
        similar: "Beat Silver Arrow 8.75L last time. That line stands up.",
        form: [
          { date: "recent", venue: "HYD", dist: "1600m", cls: "C4", pos: "1", field: "8", beaten: "0", wt: "53.5", odds: "5", winner: "Hoping High" },
          { date: "recent", venue: "HYD", dist: "1600m", cls: "C4", pos: "2", field: "7", beaten: "3L", wt: "52.5", odds: "12", winner: "Pride Aside" },
        ],
        work: [
          { date: "24 Jul", venue: "HYD", clock: "800m sand (-2)", note: "600/44, good. Stale." },
        ],
      },
      {
        cloth: 3, draw: 9, name: "SILVER ARROW", age: "7y gr m",
        pedigree: "Royal Gladiator - Cuix One (GB)",
        trainer: "A Imran Khan", jockey: "A A Vikrant", wt: "58.5", al: "", shoes: "A", eq: "TS", rtg: "38 / 38",
        last5: "1-9-1-5-6", tissue: "10/1", rank: 6,
        verdict: "Won 1800m, then 6th to Hoping High over 1600m beaten 8.75L. 58.5kg. Draw 9. Needs them to overdo it in front.",
        similar: "8.75L behind Hoping High. 0kg better off. Hard to reverse.",
        form: [
          { date: "recent", venue: "HYD", dist: "1600m", cls: "C4", pos: "6", field: "8", beaten: "8.75L", wt: "58", odds: "15", winner: "Hoping High" },
          { date: "09 Aug 26", venue: "HYD", dist: "1800m", cls: "C4", pos: "1", field: "6", beaten: "0", wt: "53.5", odds: "10", winner: "Silver Arrow" },
        ],
        work: [
          { date: "15 Sep", venue: "HYD", clock: "1000m sand (+2)", note: "Unextended." },
        ],
      },
      {
        cloth: 4, draw: 1, name: "QUINTESSENTIAL", age: "4y b f",
        pedigree: "Lucifer Sam (USA) - Queen Of Windsor",
        trainer: "L V R Deshmukh", jockey: "P Ajeeth Kumar", wt: "57", al: "", shoes: "A", eq: "TS", rtg: "34 / 35",
        last5: "4-6-4-1-3", tissue: "5/2", rank: 1,
        verdict: "Selection. Won 1600m under 62kg. Last start 3rd to Pride Aside beaten 4.25L over 1600m as 5/2. Drops to 57kg, stall 1, Ajeeth. Already carried more than Onslaught's 61kg and won. 15 Sep 600/44 'shaped well'. The mile is her trip.",
        similar: "American Gangster was 2nd to her over 1600m, beaten 4L, and is 5kg better off. That is the only live turnaround.",
        form: [
          { date: "recent", venue: "HYD", dist: "1600m", cls: "C4", pos: "3", field: "7", beaten: "4.25L", wt: "56.5", odds: "5/2", winner: "Pride Aside" },
          { date: "recent", venue: "HYD", dist: "1600m", cls: "C4", pos: "1", field: "12", beaten: "0", wt: "62", odds: "9/4", winner: "Quintessential" },
        ],
        work: [
          { date: "15 Sep", venue: "HYD", clock: "800m sand (-2)", note: "600/44, shaped well." },
          { date: "10 Sep", venue: "HYD", clock: "800m sand (-1)", note: "600/43, strode out well." },
        ],
      },
      {
        cloth: 5, draw: 10, name: "PHOTOGRAPH", age: "4y gr g",
        pedigree: "Desert God - Cuix One (GB)",
        trainer: "Robin R Kondakalla", jockey: "G Naresh", wt: "55", al: "", shoes: "S", eq: "TS-BLK", rtg: "33 / 31",
        last5: "3-1-3-5-5", tissue: "12/1", rank: 7,
        verdict: "Won 1400m. 3rd over 1800m. Steel, blinkers, stall 10. Half to Silver Arrow. Wide trip kills him.",
        similar: "Same dam as Silver Arrow. Neither wants stall 9/10.",
        form: [
          { date: "10 Aug 26", venue: "HYD", dist: "1400m", cls: "C4", pos: "5", field: "14", beaten: "19.25L", wt: "55.5", odds: "20", winner: "Love All" },
          { date: "earlier", venue: "HYD", dist: "1400m", cls: "C4", pos: "1", field: "10", beaten: "0", wt: "61", odds: "6", winner: "Photograph" },
        ],
        work: [
          { date: "15 Sep", venue: "HYD", clock: "800m sand (-3)", note: "600/43, note." },
        ],
      },
      {
        cloth: 6, draw: 6, name: "VALLEDONNA", exName: "Whistledown", age: "4y b f",
        pedigree: "Deauville (IRE) - La Dona",
        trainer: "L V R Deshmukh", jockey: "Antony Raj S", wt: "55", al: "", shoes: "A", eq: "TS-SCP", rtg: "30 / 31",
        last5: "3-2-5-4-3", tissue: "4/1", rank: 3,
        verdict: "The consistent one. 2nd over 1600m, 3rd last time at 1400m. Antony Raj. Scuppers. Draw 6. Same trainer as Quintessential: she is the second string but the more reliable each-way. Grass 1200m (-8) on 08 Sep.",
        similar: "Never wins by far, never runs a stinker. Exacta filler.",
        form: [
          { date: "23 Aug 26", venue: "HYD", dist: "1400m", cls: "C4", pos: "3", field: "12", beaten: "6.5L", wt: "56.5", odds: "15", winner: "Dino" },
          { date: "earlier", venue: "HYD", dist: "1600m", cls: "C4", pos: "2", field: "9", beaten: "3L", wt: "52", odds: "6", winner: "Real Thalaivaa" },
        ],
        work: [
          { date: "08 Sep", venue: "HYD", clock: "1200m grass (-8)", note: "Trio, 1000m section strong." },
        ],
      },
      {
        cloth: 7, draw: 3, name: "SHUBHRAK", age: "7y b g",
        pedigree: "Top Class (USA) - Scuderia",
        trainer: "M F Ali Khan", jockey: "Rafique Sk", wt: "52.5", al: "", shoes: "A", eq: "TS-XNB", rtg: "26 / 26",
        last5: "10-5-9-7-8", tissue: "33/1", rank: 9,
        verdict: "8th to Hoping High last time, 13.5L. Out.",
        similar: "No.",
        form: [
          { date: "recent", venue: "HYD", dist: "1600m", cls: "C4", pos: "8", field: "8", beaten: "13.5L", wt: "52", odds: "20", winner: "Hoping High" },
        ],
        work: [],
      },
      {
        cloth: 8, draw: 5, name: "AMERICAN GANGSTER", age: "4y b g",
        pedigree: "Arazan (IRE) - Smoky Opal (USA)",
        trainer: "Laxman Singh", jockey: "D S Deora", wt: "52", al: "", shoes: "A", eq: "TS", rtg: "25 / 25",
        last5: "6-7-6-2-4", tissue: "6/1", rank: 5,
        verdict: "2nd to Quintessential over 1600m, beaten 4L, under 60.5kg. Today 52kg vs her 57kg: 5kg better off for a 4L beating. That is the turnaround. Draw 5. Grass work -9 on 15 Sep. Live at a price.",
        similar: "Weight swing of 9.5kg at the weights vs Quintessential from that 1600m. Biggest handicap move on the card.",
        form: [
          { date: "recent", venue: "HYD", dist: "1400m", cls: "C4", pos: "4", field: "14", beaten: "8.25L", wt: "62", odds: "7/4", winner: "December Caspian" },
          { date: "recent", venue: "HYD", dist: "1600m", cls: "C4", pos: "2", field: "12", beaten: "4L", wt: "60.5", odds: "2", winner: "Quintessential" },
        ],
        work: [
          { date: "15 Sep", venue: "HYD", clock: "1000m grass (-9)", note: "With Windcastle, 600/39, pair worked well." },
        ],
      },
      {
        cloth: 9, draw: 7, name: "DECEMBER RAIN", age: "5y b m",
        pedigree: "Total Gallery (IRE) - Silsila",
        trainer: "Jasbir Singh", jockey: "Arjun", wt: "52", al: "", shoes: "S", eq: "", rtg: "25 / 25",
        last5: "5-7-4", tissue: "20/1", rank: 8,
        verdict: "Steel. Sprint form only. First proper mile? Yard also has Hoping High.",
        similar: "Wrong trip.",
        form: [
          { date: "recent", venue: "HYD", dist: "1100m", cls: "C4", pos: "4", field: "8", beaten: "9.25L", wt: "52.5", odds: "15", winner: "Feel The Magic" },
        ],
        work: [
          { date: "05 Sep", venue: "HYD", clock: "800m sand (+3)", note: "Moved freely." },
        ],
      },
      {
        cloth: 10, draw: 4, name: "SEE MY ATTITUDE", age: "7y b m",
        pedigree: "Royal Gladiator - Rainbow Fog",
        trainer: "M F Ali Khan", jockey: "Surya Prakash", wt: "50", al: "", shoes: "S", eq: "TS-XNB", rtg: "22 / 21",
        last5: "8-8-8-8-7", tissue: "40/1", rank: 10,
        verdict: "Five 7ths and 8ths. Bottomweight because she is slow.",
        similar: "No.",
        form: [
          { date: "recent", venue: "HYD", dist: "1200m", cls: "C4", pos: "7", field: "13", beaten: "17.5L", wt: "55", odds: "20", winner: "Equine Power" },
        ],
        work: [
          { date: "15 Sep", venue: "HYD", clock: "1000m sand (+3)", note: "Handy." },
        ],
      },
    ],
  },
];
