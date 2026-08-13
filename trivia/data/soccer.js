(function () {
  "use strict";
  const FIFA_2022 = "https://www.fifa.com/tournaments/mens/worldcup/qatar2022";
  const FIFA_2026 = "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/match-schedule-fixtures-results-teams-stadiums";
  const matches = [
    [2022, "Round of 16", "Netherlands", "United States", "3–1", "in regulation time"],
    [2022, "Round of 16", "Argentina", "Australia", "2–1", "in regulation time"],
    [2022, "Round of 16", "France", "Poland", "3–1", "in regulation time"],
    [2022, "Round of 16", "England", "Senegal", "3–0", "in regulation time"],
    [2022, "Round of 16", "Croatia", "Japan", "1–1", "in a penalty shootout"],
    [2022, "Round of 16", "Brazil", "South Korea", "4–1", "in regulation time"],
    [2022, "Round of 16", "Morocco", "Spain", "0–0", "in a penalty shootout"],
    [2022, "Round of 16", "Portugal", "Switzerland", "6–1", "in regulation time"],
    [2022, "quarter-final", "Croatia", "Brazil", "1–1", "in a penalty shootout"],
    [2022, "quarter-final", "Argentina", "Netherlands", "2–2", "in a penalty shootout"],
    [2022, "quarter-final", "Morocco", "Portugal", "1–0", "in regulation time"],
    [2022, "quarter-final", "France", "England", "2–1", "in regulation time"],
    [2022, "semi-final", "Argentina", "Croatia", "3–0", "in regulation time"],
    [2022, "semi-final", "France", "Morocco", "2–0", "in regulation time"],
    [2022, "third-place match", "Croatia", "Morocco", "2–1", "in regulation time"],
    [2022, "final", "Argentina", "France", "3–3", "in a penalty shootout"],
    [2022, "group stage", "Saudi Arabia", "Argentina", "2–1", "in regulation time"],
    [2022, "group stage", "Japan", "Germany", "2–1", "in regulation time"],
    [2026, "Round of 32", "Canada", "South Africa", "1–0", "in regulation time"],
    [2026, "Round of 32", "Paraguay", "Germany", "1–1", "in a penalty shootout"],
    [2026, "Round of 32", "Morocco", "Netherlands", "1–1", "in a penalty shootout"],
    [2026, "Round of 32", "Brazil", "Japan", "2–1", "in regulation time"],
    [2026, "Round of 32", "France", "Sweden", "3–0", "in regulation time"],
    [2026, "Round of 32", "Mexico", "Ecuador", "2–0", "in regulation time"],
    [2026, "Round of 32", "United States", "Bosnia and Herzegovina", "2–0", "in regulation time"],
    [2026, "Round of 32", "Argentina", "Cabo Verde", "3–2", "after extra time"],
    [2026, "Round of 16", "France", "Paraguay", "1–0", "in regulation time"],
    [2026, "Round of 16", "Morocco", "Canada", "3–0", "in regulation time"],
    [2026, "Round of 16", "Norway", "Brazil", "2–1", "in regulation time"],
    [2026, "Round of 16", "England", "Mexico", "3–2", "in regulation time"],
    [2026, "Round of 16", "Spain", "Portugal", "1–0", "in regulation time"],
    [2026, "Round of 16", "Belgium", "United States", "4–1", "in regulation time"],
    [2026, "quarter-final", "France", "Morocco", "2–0", "in regulation time"],
    [2026, "quarter-final", "England", "Norway", "2–1", "after extra time"],
    [2026, "semi-final", "Spain", "France", "2–0", "in regulation time"],
    [2026, "final", "Spain", "Argentina", "1–0", "after extra time"]
  ];
  const teams = Array.from(new Set(matches.flatMap((match) => [match[2], match[3]])));
  const raw = [];
  matches.forEach(([year, round, winner, loser, score, method]) => {
    const distractors = teams.filter((team) => team !== winner && team !== loser);
    const sourceUrl = year === 2022 ? FIFA_2022 : FIFA_2026;
    const explanation = `${winner} advanced past ${loser} ${method}; the match score was ${score} before any shootout.`;
    raw.push(
      { question: `Who got past ${loser} in the ${year} World Cup ${round}?`, answer: winner, distractors, explanation, sourceLabel: `FIFA World Cup ${year}`, sourceUrl },
      { question: `In the ${year} World Cup ${round}, ${winner} advanced after playing which team?`, answer: loser, distractors: teams.filter((team) => team !== loser && team !== winner), explanation, sourceLabel: `FIFA World Cup ${year}`, sourceUrl },
      { question: `${winner} played ${loser} in a ${year} World Cup ${round} match that finished ${score} before any shootout. Which team advanced?`, answer: winner, distractors, explanation, sourceLabel: `FIFA World Cup ${year}`, sourceUrl },
      { question: `${winner} faced ${loser} in the ${year} World Cup ${round}. How did ${winner} advance?`, answer: method, distractors: ["in regulation time", "after extra time", "in a penalty shootout", "by a coin toss", "because the other team withdrew"].filter((choice) => choice !== method), explanation, sourceLabel: `FIFA World Cup ${year}`, sourceUrl }
    );
  });
  window.TRIVIA_BUILDER.addTopic("soccer", 143, raw);
}());
