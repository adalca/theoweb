import Link from "next/link";

export default function Home() {
  return (
    <main className="home-shell">
      <div className="doodle doodle-one" aria-hidden="true">★</div>
      <div className="doodle doodle-two" aria-hidden="true">●</div>
      <section className="home-card">
        <p className="eyebrow">Welcome to</p>
        <h1>Theo&apos;s Clubhouse</h1>
        <p className="home-intro">What do you want to explore?</p>

        <nav className="big-menu" aria-label="Main menu">
          <Link className="menu-tile soccer-tile" href="/soccer">
            <span className="ball-icon" aria-hidden="true">⚽</span>
            <span className="menu-copy">
              <span className="menu-label">Soccer scores</span>
              <span className="menu-hint">World Cup · EURO · Copa América</span>
            </span>
            <span className="round-arrow" aria-hidden="true">→</span>
          </Link>
        </nav>

        <p className="coming-soon"><span aria-hidden="true">✦</span> More adventures coming soon!</p>
      </section>
    </main>
  );
}
