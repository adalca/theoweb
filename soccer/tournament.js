(function () {
  var id = new URLSearchParams(window.location.search).get("id");
  var tournament = window.TOURNAMENTS.find(function (item) { return item.slug === id; });
  var stagesElement = document.getElementById("stages");

  if (!tournament) {
    stagesElement.className = "error";
    stagesElement.textContent = "Tournament not found.";
    return;
  }

  document.title = tournament.title;
  document.getElementById("title").textContent = tournament.title;
  document.getElementById("summary").textContent = tournament.matches.length + " matches";

  var stageNames = [];
  tournament.matches.forEach(function (match) {
    if (stageNames.indexOf(match.stage) === -1) stageNames.push(match.stage);
  });

  stageNames.forEach(function (stageName) {
    var section = document.createElement("section");
    section.className = "stage";

    var heading = document.createElement("h2");
    heading.textContent = stageName;
    section.appendChild(heading);

    tournament.matches.filter(function (match) {
      return match.stage === stageName;
    }).forEach(function (match) {
      var row = document.createElement("div");
      row.className = "match";

      var home = document.createElement("span");
      home.className = "team team-home";
      home.textContent = match.home;

      var score = document.createElement("span");
      score.className = "score";
      score.innerHTML = "<b>" + match.homeScore + "</b><span>–</span><b>" + match.awayScore + "</b>";
      if (match.redCard) {
        var card = document.createElement("span");
        card.className = "red-card";
        card.title = "Red card in this match";
        score.appendChild(card);
      }

      var away = document.createElement("span");
      away.className = "team team-away";
      away.textContent = match.away;

      var details = document.createElement("div");
      details.className = "match-details";
      var detailText = [match.date, match.location, match.note].filter(Boolean).join(" · ");
      details.appendChild(document.createTextNode(detailText));

      var highlights = document.createElement("a");
      highlights.className = "highlight-link";
      highlights.href = "https://www.youtube.com/results?search_query=" + encodeURIComponent(tournament.title + " " + match.home + " " + match.away + " highlights");
      highlights.target = "_blank";
      highlights.rel = "noreferrer";
      highlights.textContent = "Highlights";
      details.appendChild(highlights);

      row.appendChild(home);
      row.appendChild(score);
      row.appendChild(away);
      row.appendChild(details);
      section.appendChild(row);
    });

    stagesElement.appendChild(section);
  });
}());
