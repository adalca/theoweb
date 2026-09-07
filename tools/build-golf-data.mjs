import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

// Import public ESPN results once; the website reads only the generated local files.
const firstYear = Number(process.argv[2] || 2001);
const lastYear = Number(process.argv[3] || new Date().getFullYear());
const root = path.resolve(import.meta.dirname, "..");
const output = path.join(root, "golf", "data");
const cache = path.join(os.tmpdir(), "theoweb-golf-source");
const updated = new Date().toISOString().slice(0, 10);
const definitions = [
  { key: "masters", name: "Masters Tournament", match: /masters tournament|^the masters$/i,
    major: true },
  { key: "pga", name: "PGA Championship", match: /^pga championship/i, major: true },
  { key: "us-open", name: "U.S. Open", match: /^u\.?s\.? open/i, major: true },
  { key: "open", name: "The Open Championship", match: /^(the open|british open)/i,
    major: true },
  { key: "players", name: "THE PLAYERS Championship", match: /players championship/i,
    major: false },
  { key: "tour", name: "TOUR Championship", match: /tour championship/i, major: false }
];

if (!Number.isInteger(firstYear) || !Number.isInteger(lastYear) || firstYear < 2001
    || firstYear > lastYear || lastYear > new Date().getFullYear()) {
  throw new Error("Usage: node tools/build-golf-data.mjs [first-year >= 2001] [last-year]");
}
await fs.mkdir(output, { recursive: true });
await fs.mkdir(cache, { recursive: true });

async function readSource(url, filename) {
  const destination = path.join(cache, filename);
  try {
    return await fs.readFile(destination, "utf8");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`${response.status}: ${url}`);
  const text = await response.text();
  await fs.writeFile(destination, text);
  return text;
}

function positiveNumber(value) {
  return Number.isFinite(Number(value)) && Number(value) > 0 ? Number(value) : null;
}

function normalizePlayer(player) {
  const rounds = [player.r1, player.r2, player.r3, player.r4].map(positiveNumber);
  // Older U.S. Opens sometimes include an 18-hole playoff in the source total.
  const total = rounds.every(Boolean)
    ? rounds.reduce((sum, strokes) => sum + strokes, 0) : positiveNumber(player.tot);
  const position = player.detail || (player.cut ? "CUT" : player.pos) || "—";
  return {
    id: String(player.id),
    name: player.name,
    country: player.flagCountry || "",
    position: String(position).toUpperCase(),
    order: player.order,
    score: player.toPar || "—",
    rounds,
    total
  };
}

async function importTournament(event, definition, year) {
  const source = `https://www.espn.com/golf/leaderboard?tournamentId=${event.id}`;
  const canceled = event.status?.type?.name === "STATUS_CANCELED";
  let board;
  if (!canceled) {
    const html = await readSource(source, `${updated}-event-${event.id}.html`);
    const expression = /window\['__espnfitt__'\]\s*=\s*({.*?});\s*<\/script>/s;
    const match = html.match(expression);
    if (!match) throw new Error(`Missing leaderboard: ${source}`);
    board = JSON.parse(match[1]).page.content.leaderboard;
    if (String(board?.id) !== String(event.id)) {
      throw new Error(`Unexpected tournament returned: ${source}`);
    }
  }
  const course = board?.hdr?.evnt?.crse?.[0];
  const address = course?.addr;
  const location = [address?.city, address?.st, address?.ctry].filter(Boolean).join(", ");
  const results = (board?.competitors || []).map(normalizePlayer);
  results.sort((a, b) => a.order - b.order);
  const status = canceled || board?.canc ? "canceled"
    : event.status?.type?.completed || board?.roundStatusDetail === "Final" ? "final"
    : event.status?.type?.state === "in" || board?.status === "in" ? "in-progress"
    : "scheduled";
  if (status === "final" && !results.some(player => player.position === "1")) {
    throw new Error(`Completed tournament has no winner: ${year} ${definition.name}`);
  }

  return {
    id: String(event.id),
    key: definition.key,
    name: definition.name,
    major: definition.major,
    startDate: event.date.slice(0, 10),
    endDate: event.endDate.slice(0, 10),
    course: course?.name || "",
    location,
    status,
    source,
    note: definition.key === "tour" && year >= 2019 && year <= 2024
      ? "This edition used FedExCup starting strokes. The score to par includes that head start; "
        + "the round scores show strokes actually played."
      : "",
    playoffs: (board?.playoffs || []).map(playoff => ({
      holes: playoff.holes || [],
      players: playoff.competitors.map(player => ({
        name: player.name,
        winner: Boolean(player.winner),
        scores: (playoff.holes || []).map((hole, index) =>
          player.round?.scores?.[index]?.val || "—")
      }))
    })),
    results
  };
}

for (let year = lastYear; year >= firstYear; year -= 1) {
  const dates = `${year}0101-${year}1231`;
  const endpoint = "https://site.api.espn.com/apis/site/v2/sports/golf/pga/scoreboard";
  const raw = await readSource(`${endpoint}?dates=${dates}&limit=1000`,
    `${updated}-calendar-${year}.json`);
  const calendar = JSON.parse(raw);
  const sourceEvents = (calendar.events || []).filter(event => event.id);
  // Some older scoreboard entries are empty even though the calendar lists the event.
  for (const item of calendar.leagues?.[0]?.calendar || []) {
    if (!item.startDate.startsWith(String(year))) continue;
    if (!sourceEvents.some(event => event.id === item.id)) {
      sourceEvents.push({ id: item.id, name: item.label,
        date: item.startDate, endDate: item.endDate });
    }
  }
  const events = sourceEvents.filter(event =>
    definitions.some(definition => definition.match.test(event.name)));
  const tournaments = [];
  for (const event of events) {
    const definition = definitions.find(item => item.match.test(event.name));
    if (tournaments.some(item => item.key === definition.key)) {
      throw new Error(`Duplicate ${definition.key} in ${year}`);
    }
    tournaments.push(await importTournament(event, definition, year));
  }
  if (tournaments.length !== definitions.length) {
    throw new Error(`Expected six tournaments for ${year}; found ${tournaments.length}`);
  }
  tournaments.sort((a, b) => a.startDate.localeCompare(b.startDate));
  const season = { year, updated, tournaments };
  await fs.writeFile(path.join(output, `${year}.js`),
    `window.GOLF_SEASON=${JSON.stringify(season)};\n`);
  console.log(`${year}: ${tournaments.length} tournaments, `
    + `${tournaments.reduce((total, item) => total + item.results.length, 0)} player results`);
}

// Rebuild the index from all available seasons, including when refreshing just one year.
const seasons = [];
for (const filename of await fs.readdir(output)) {
  if (!/^\d{4}\.js$/.test(filename)) continue;
  const text = await fs.readFile(path.join(output, filename), "utf8");
  const season = JSON.parse(text.slice("window.GOLF_SEASON=".length).trim().replace(/;$/, ""));
  const tournaments = season.tournaments;
  seasons.push({
    year: season.year,
    updated: season.updated,
    tournamentCount: tournaments.length,
    completedCount: tournaments.filter(item => item.status === "final").length,
    canceledCount: tournaments.filter(item => item.status === "canceled").length
  });
}
seasons.sort((a, b) => b.year - a.year);
await fs.writeFile(path.join(output, "seasons.js"),
  `window.GOLF_SEASONS=${JSON.stringify(seasons)};\n`);
console.log(`Built golf archive: ${seasons.length} seasons.`);
