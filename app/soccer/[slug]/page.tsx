import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { competitionName, tournamentBySlug, tournaments } from "../data";

export function generateStaticParams() {
  return tournaments.map((tournament) => ({ slug: tournament.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const tournament = tournamentBySlug((await params).slug);
  return tournament ? { title: tournament.title, description: `Every match and final score from ${tournament.title}.` } : {};
}

export default async function TournamentPage({ params }: { params: Promise<{ slug: string }> }) {
  const tournament = tournamentBySlug((await params).slug);
  if (!tournament) notFound();

  const stages = Array.from(new Set(tournament.matches.map((match) => match.stage)));

  return (
    <main className={`matches-shell theme-${tournament.color}`}>
      <header className="matches-header">
        <Link className="back-link" href="/soccer">← All tournaments</Link>
        <div className="match-title-block">
          <span className="big-badge" aria-hidden="true"><small>★</small>{tournament.short}</span>
          <div>
            <p className="eyebrow">{competitionName(tournament.competition)}</p>
            <h1>{tournament.title}</h1>
            <p>{tournament.matches.length} matches · {stages.length} stages</p>
          </div>
        </div>
        <div className="score-key" aria-label="Symbols key">
          <span><i className="red-card" aria-hidden="true" /> Red card in this match</span>
        </div>
      </header>

      <div className="stages">
        {stages.map((stage, stageIndex) => (
          <section className="stage-card" key={`${stage}-${stageIndex}`}>
            <h2><span>{stageIndex + 1}</span>{stage}</h2>
            <div className="match-list">
              {tournament.matches.filter((match) => match.stage === stage).map((match, index) => {
                const highlightQuery = encodeURIComponent(`${tournament.title} ${match.home} ${match.away} highlights`);
                return (
                  <article className="match-row" key={`${match.date}-${match.home}-${match.away}-${index}`}>
                    <div className="match-info">
                      <span>{match.date}</span>
                      {match.location && <small>{match.location}</small>}
                    </div>
                    <div className="scoreboard" aria-label={`${match.home} ${match.homeScore}, ${match.away} ${match.awayScore}`}>
                      <span className="team home-team">{match.home}</span>
                      <strong>{match.homeScore}</strong>
                      <span className="score-dash">–</span>
                      <strong>{match.awayScore}</strong>
                      <span className="team away-team">{match.away}</span>
                      {match.redCard && <i className="red-card match-card" title="Red card in this match" aria-label="Red card in this match" />}
                    </div>
                    <div className="match-extras">
                      {match.note && <span className="match-note">{match.note}</span>}
                      <a href={`https://www.youtube.com/results?search_query=${highlightQuery}`} target="_blank" rel="noreferrer" aria-label={`Find highlights for ${match.home} against ${match.away}`}>Find highlights ↗</a>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <Link className="bottom-back" href="/soccer">← Pick another tournament</Link>
    </main>
  );
}
