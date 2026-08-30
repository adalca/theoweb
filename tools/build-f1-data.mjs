import fs from "node:fs";
import path from "node:path";

const inputPath = process.argv[2];
const version = process.argv[3] || "F1DB";
const published = process.argv[4] || new Date().toISOString().slice(0, 10);

if (!inputPath) {
  console.error("Usage: node tools/build-f1-data.mjs <f1db.json> [version] [published-date]");
  process.exit(1);
}

const root = path.resolve(import.meta.dirname, "..");
const outputDir = path.join(root, "formula-1", "data");
const database = JSON.parse(fs.readFileSync(path.resolve(inputPath), "utf8"));

fs.mkdirSync(outputDir, { recursive: true });

function indexById(items) {
  return new Map(items.map((item) => [item.id, item]));
}

function displayName(item, fallback) {
  return item?.name || item?.fullName || fallback;
}

function readableId(id) {
  return String(id || "Unknown")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const drivers = indexById(database.drivers);
const constructors = indexById(database.constructors);
const circuits = indexById(database.circuits);
const grandsPrix = indexById(database.grandsPrix);
const countries = indexById(database.countries);
const seasonsByYear = new Map(database.seasons.map((season) => [season.year, season]));
const racesByYear = new Map();

database.races.forEach((race) => {
  if (!racesByYear.has(race.year)) racesByYear.set(race.year, []);
  racesByYear.get(race.year).push(race);
});

const years = Array.from(seasonsByYear.keys())
  .filter((year) => year >= 1950)
  .sort((a, b) => b - a);

const seasonIndex = [];

years.forEach((year) => {
  const sourceSeason = seasonsByYear.get(year);
  const sourceRaces = (racesByYear.get(year) || []).sort((a, b) => a.round - b.round);
  const completedRaces = sourceRaces.filter((race) => Array.isArray(race.raceResults) && race.raceResults.length);
  const isComplete = sourceRaces.length > 0 && completedRaces.length === sourceRaces.length;
  const teamsByDriver = new Map();

  completedRaces.forEach((race) => {
    race.raceResults.forEach((result) => {
      if (!teamsByDriver.has(result.driverId)) teamsByDriver.set(result.driverId, []);
      const driverTeams = teamsByDriver.get(result.driverId);
      if (result.constructorId && !driverTeams.includes(result.constructorId)) {
        driverTeams.push(result.constructorId);
      }
    });
  });

  const driverSeasonStats = new Map((sourceSeason.drivers || []).map((driver) => [driver.driverId, driver]));
  const constructorSeasonStats = new Map((sourceSeason.constructors || []).map((team) => [team.constructorId, team]));

  const season = {
    year,
    complete: isComplete,
    raceCount: sourceRaces.length,
    completedRaceCount: completedRaces.length,
    dataVersion: version,
    dataPublished: published,
    races: sourceRaces.map((race) => {
      const circuit = circuits.get(race.circuitId);
      const country = countries.get(circuit?.countryId);
      const place = circuit?.placeName || "";
      const countryName = displayName(country, readableId(circuit?.countryId));
      const location = [place, countryName]
        .filter((part, index, values) => part && values.indexOf(part) === index)
        .join(", ");

      return {
        round: race.round,
        date: race.date,
        name: grandsPrix.get(race.grandPrixId)?.fullName || displayName(grandsPrix.get(race.grandPrixId), race.officialName || readableId(race.grandPrixId)),
        circuit: circuit?.fullName || circuit?.name || readableId(race.circuitId),
        location,
        results: (race.raceResults || []).map((result) => ({
          order: result.positionDisplayOrder,
          position: result.positionText || String(result.positionNumber || "—"),
          positionNumber: result.positionNumber,
          driver: displayName(drivers.get(result.driverId), readableId(result.driverId)),
          team: displayName(constructors.get(result.constructorId), readableId(result.constructorId)),
          number: result.driverNumber,
          laps: result.laps,
          time: result.time,
          gap: result.gap,
          reason: result.reasonRetired,
          sharedCar: Boolean(result.sharedCar)
        }))
      };
    }),
    driverStandings: (sourceSeason.driverStandings || []).map((standing) => ({
      position: standing.positionText || String(standing.positionNumber || "—"),
      driver: displayName(drivers.get(standing.driverId), readableId(standing.driverId)),
      teams: (teamsByDriver.get(standing.driverId) || []).map((constructorId) =>
        displayName(constructors.get(constructorId), readableId(constructorId))
      ),
      points: standing.points,
      wins: driverSeasonStats.get(standing.driverId)?.totalRaceWins || 0,
      champion: Boolean(standing.championshipWon)
    })),
    constructorStandings: (sourceSeason.constructorStandings || []).map((standing) => ({
      position: standing.positionText || String(standing.positionNumber || "—"),
      team: displayName(constructors.get(standing.constructorId), readableId(standing.constructorId)),
      points: standing.points,
      wins: constructorSeasonStats.get(standing.constructorId)?.totalRaceWins || 0,
      champion: Boolean(standing.championshipWon)
    }))
  };

  seasonIndex.push({
    year,
    complete: isComplete,
    raceCount: sourceRaces.length,
    completedRaceCount: completedRaces.length
  });

  fs.writeFileSync(
    path.join(outputDir, `${year}.js`),
    `window.F1_SEASON=${JSON.stringify(season)};\n`,
    "utf8"
  );
});

fs.writeFileSync(
  path.join(outputDir, "seasons.js"),
  `window.F1_SEASONS=${JSON.stringify(seasonIndex)};window.F1_DATA_VERSION=${JSON.stringify(version)};window.F1_DATA_PUBLISHED=${JSON.stringify(published)};\n`,
  "utf8"
);

console.log(`Built ${years.length} Formula 1 seasons with ${database.races.length} races.`);
