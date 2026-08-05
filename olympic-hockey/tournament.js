(function () {
  var year = Number(new URLSearchParams(window.location.search).get("id"));
  var olympics = window.OLYMPIC_HOCKEY.find(function (item) { return item.year === year; });
  var matchesElement = document.getElementById("olympic-matches");

  if (!olympics) {
    document.getElementById("summary").textContent = "";
    matchesElement.className = "error";
    matchesElement.textContent = "Olympic tournament not found.";
    return;
  }

  document.title = olympics.year + " Olympic hockey";
  document.getElementById("title").textContent = olympics.year + " Olympic hockey";
  document.getElementById("summary").textContent = olympics.host + " · " + olympics.tournaments.length + (olympics.tournaments.length === 1 ? " tournament" : " tournaments") + " · " + olympics.matchCount + " country matches";

  function formatDate(dateText) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateText)) return dateText;
    var parts = dateText.split("-");
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  }

  function createMatch(match, gender) {
    var row = document.createElement("div");
    row.className = "match olympic-match";
    row.dataset.countries = (match.team1 + " " + match.team2).toLowerCase();

    var team1 = document.createElement("span");
    team1.className = "team team-home";
    team1.textContent = match.team1;

    var score = document.createElement("span");
    score.className = "score";
    var score1 = document.createElement("b");
    score1.textContent = match.score1;
    var dash = document.createElement("span");
    dash.textContent = "–";
    var score2 = document.createElement("b");
    score2.textContent = match.score2;
    if (match.score1 > match.score2) score1.className = "winner";
    if (match.score2 > match.score1) score2.className = "winner";
    score.appendChild(score1);
    score.appendChild(dash);
    score.appendChild(score2);

    var team2 = document.createElement("span");
    team2.className = "team team-away";
    team2.textContent = match.team2;

    var details = document.createElement("div");
    details.className = "match-details";
    details.appendChild(document.createTextNode([formatDate(match.date), match.note].filter(Boolean).join(" · ")));
    var highlights = document.createElement("a");
    highlights.className = "highlight-link";
    highlights.href = "https://www.youtube.com/results?search_query=" + encodeURIComponent(olympics.year + " Olympic hockey " + gender + " " + match.team1 + " " + match.team2);
    highlights.target = "_blank";
    highlights.rel = "noreferrer";
    highlights.textContent = "Highlights";
    details.appendChild(highlights);

    row.appendChild(team1);
    row.appendChild(score);
    row.appendChild(team2);
    row.appendChild(details);
    return row;
  }

  olympics.tournaments.forEach(function (tournament) {
    var eventHeading = document.createElement("h2");
    eventHeading.className = "olympic-event-title";
    eventHeading.textContent = tournament.gender + "'s tournament";
    matchesElement.appendChild(eventHeading);

    var stages = [];
    tournament.matches.forEach(function (match) {
      if (stages.indexOf(match.stage) === -1) stages.push(match.stage);
    });

    stages.forEach(function (stageName) {
      var stageMatches = tournament.matches.filter(function (match) { return match.stage === stageName; });
      var section = document.createElement("section");
      section.className = "stage olympic-stage";
      var heading = document.createElement("h2");
      heading.innerHTML = "<span>" + stageName + "</span><small>" + stageMatches.length + (stageMatches.length === 1 ? " game" : " games") + "</small>";
      section.appendChild(heading);
      stageMatches.forEach(function (match) {
        section.appendChild(createMatch(match, tournament.gender));
      });
      matchesElement.appendChild(section);
    });
  });

  var filterPanel = document.getElementById("country-filter-panel");
  var filterInput = document.getElementById("country-filter");
  filterPanel.hidden = false;
  filterInput.addEventListener("input", function () {
    var query = filterInput.value.trim().toLowerCase();
    var visibleMatches = 0;
    matchesElement.querySelectorAll(".olympic-stage").forEach(function (section) {
      var stageMatches = 0;
      section.querySelectorAll(".olympic-match").forEach(function (row) {
        var matches = !query || row.dataset.countries.indexOf(query) !== -1;
        row.hidden = !matches;
        if (matches) stageMatches += 1;
      });
      section.hidden = stageMatches === 0;
      visibleMatches += stageMatches;
    });
    matchesElement.querySelectorAll(".olympic-event-title").forEach(function (heading) {
      var next = heading.nextElementSibling;
      var hasVisibleStage = false;
      while (next && !next.classList.contains("olympic-event-title")) {
        if (next.classList.contains("olympic-stage") && !next.hidden) hasVisibleStage = true;
        next = next.nextElementSibling;
      }
      heading.hidden = !hasVisibleStage;
    });
    document.getElementById("filter-count").textContent = query ? visibleMatches + (visibleMatches === 1 ? " game found" : " games found") : "";
  });
}());
