import rawTournaments from "./tournaments.json";

export type Match = {
  stage: string;
  date: string;
  home: string;
  away: string;
  homeScore: number;
  awayScore: number;
  location: string;
  note: string;
  redCard: boolean;
};

export type Tournament = {
  slug: string;
  competition: "world-cup" | "euro" | "copa-america";
  year: number;
  title: string;
  short: string;
  color: "yellow" | "blue" | "coral";
  matches: Match[];
};

export const tournaments = rawTournaments as Tournament[];

export function tournamentBySlug(slug: string) {
  return tournaments.find((tournament) => tournament.slug === slug);
}

export function competitionName(competition: Tournament["competition"]) {
  if (competition === "world-cup") return "World Cup";
  if (competition === "euro") return "EURO";
  return "Copa América";
}
