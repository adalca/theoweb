import type { Metadata } from "next";
import Link from "next/link";
import { competitionName, tournaments } from "./data";

export const metadata: Metadata = {
  title: "Soccer scores",
  description: "Every FIFA World Cup, UEFA EURO, and Copa América, newest first.",
};

export default function SoccerArchive() {
  return (
    <main className="archive-shell">
      <header className="archive-header">
        <Link className="back-link" href="/" aria-label="Back to Theo's Clubhouse">← Home</Link>
        <div className="archive-title-row">
          <span className="header-ball" aria-hidden="true">⚽</span>
          <div>
            <p className="eyebrow">Theo&apos;s match book</p>
            <h1>Soccer scores</h1>
          </div>
        </div>
        <p className="archive-intro">Pick a tournament to see every match. Newest tournaments are at the top!</p>
        <div className="legend" aria-label="Tournament colors">
          <span><i className="dot yellow" /> World Cup</span>
          <span><i className="dot blue" /> EURO</span>
          <span><i className="dot coral" /> Copa América</span>
        </div>
      </header>

      <section className="tournament-list" aria-label="Tournaments, newest first">
        {tournaments.map((tournament) => (
          <Link className={`tournament-row ${tournament.color}`} href={`/soccer/${tournament.slug}`} key={tournament.slug}>
            <span className="tournament-badge" aria-hidden="true">
              <span className="tiny-star">★</span>
              <b>{tournament.short}</b>
            </span>
            <span className="tournament-copy">
              <span className="tournament-name">{tournament.title}</span>
              <span className="tournament-meta">{competitionName(tournament.competition)} · {tournament.matches.length} matches</span>
            </span>
            <span className="year-pill">{tournament.year}</span>
            <span className="row-arrow" aria-hidden="true">›</span>
          </Link>
        ))}
      </section>

      <p className="source-note">Scores and stages are compiled from the public-domain Open Football archive. 2026 results are cross-checked against FIFA&apos;s tournament record.</p>
    </main>
  );
}
