import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(import.meta.dirname, "..");

function readData(filename, variable) {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(root, "golf/data", filename), "utf8"), context);
  return context.window[variable];
}

const index = readData("seasons.js", "GOLF_SEASONS");
assert(index.length >= 26, "Expected coverage from 2001 through 2026");
assert.equal(new Set(index.map(season => season.year)).size, index.length);
const seasons = new Map();
let resultCount = 0;
for (const [indexNumber, item] of index.entries()) {
  if (indexNumber) assert.equal(item.year, index[indexNumber - 1].year - 1);
  const season = readData(`${item.year}.js`, "GOLF_SEASON");
  seasons.set(item.year, season);
  assert.equal(season.year, item.year);
  assert.match(season.updated, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(season.tournaments.length, 6);
  assert.equal(new Set(season.tournaments.map(tournament => tournament.key)).size, 6);
  assert.equal(season.tournaments.filter(tournament => tournament.major).length, 4);
  const completed = season.tournaments.filter(tournament => tournament.status === "final");
  const canceled = season.tournaments.filter(tournament => tournament.status === "canceled");
  assert.equal(item.completedCount, completed.length);
  assert.equal(item.canceledCount, canceled.length);

  for (const [tournamentIndex, tournament] of season.tournaments.entries()) {
    const label = `${item.year} ${tournament.name}`;
    assert.match(tournament.id, /^\d+$/, label);
    assert.match(tournament.source, /^https:\/\/www\.espn\.com\/golf\/leaderboard\?tournamentId=\d+$/);
    assert(tournament.startDate.startsWith(String(item.year)), label);
    assert(tournament.endDate >= tournament.startDate, label);
    if (tournamentIndex) {
      assert(tournament.startDate >= season.tournaments[tournamentIndex - 1].startDate, label);
    }
    if (tournament.status === "canceled") assert.equal(tournament.results.length, 0, label);
    if (tournament.status === "final") {
      assert(tournament.results.length >= 25, label);
      assert.equal(tournament.results.filter(player => player.position === "1").length, 1, label);
      assert.equal(tournament.results[0].position, "1", label);
    }
    assert.equal(new Set(tournament.results.map(player => player.id)).size,
      tournament.results.length, label);
    for (const player of tournament.results) {
      assert(player.name, label);
      assert.match(player.position, /^(T?\d+|CUT|WD|DQ|DNS|MDF|—|-)$/, label);
      assert.equal(player.rounds.length, 4, label);
      assert(player.rounds.every(round => round === null || Number.isInteger(round)), label);
      if (player.rounds.every(Boolean)) {
        const sum = player.rounds.reduce((total, round) => total + round, 0);
        assert.equal(player.total, sum, `${label}: ${player.name}`);
      }
    }
    for (const playoff of tournament.playoffs) {
      for (const player of playoff.players) assert.equal(player.scores.length, playoff.holes.length);
    }
    resultCount += tournament.results.length;
  }
}

function tournament(year, key) {
  return seasons.get(year).tournaments.find(item => item.key === key);
}

// Guard against source changes that lose playoff winners or rescheduled/canceled events.
const masters = tournament(2025, "masters");
assert.equal(masters.results[0].name, "Rory McIlroy");
assert.equal(masters.results[1].name, "Justin Rose");
assert.equal(masters.results[0].score, masters.results[1].score);
assert.equal(masters.results[0].total, 277);
assert(masters.playoffs.some(playoff => playoff.players.some(player =>
  player.name === "Rory McIlroy" && player.winner)));
assert.equal(tournament(2020, "players").status, "canceled");
assert.equal(tournament(2020, "open").status, "canceled");
assert.equal(tournament(2020, "masters").startDate, "2020-11-12");
assert.equal(tournament(2008, "us-open").results[0].total, 283);
assert.equal(tournament(2024, "tour").results[0].total, 264);
assert(tournament(2024, "tour").note.includes("starting strokes"));
assert.equal(tournament(2025, "tour").note, "");
const home = fs.readFileSync(path.join(root, "index.html"), "utf8");
assert(home.includes('href="golf/index.html"'));
for (const filename of ["index.html", "season.html", "tournament.html"]) {
  const html = fs.readFileSync(path.join(root, "golf", filename), "utf8");
  for (const match of html.matchAll(/(?:src|href)="([^"?#]+)"/g)) {
    if (/^https?:/.test(match[1])) continue;
    assert(fs.existsSync(path.resolve(root, "golf", match[1])), `${filename}: ${match[1]}`);
  }
}
console.log(`Golf validation passed: ${index.length} seasons, ${index.length * 6} tournaments, `
  + `${resultCount.toLocaleString()} player results.`);
