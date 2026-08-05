(function () {
  var seasonId = new URLSearchParams(window.location.search).get("id");
  var gamesElement = document.getElementById("games");

  if (!/^\d{8}$/.test(seasonId || "")) {
    showError("Season not found.");
    return;
  }

  var dataScript = document.createElement("script");
  dataScript.src = "data/" + seasonId + ".js";
  dataScript.onload = renderSeason;
  dataScript.onerror = function () { showError("Season not found."); };
  document.body.appendChild(dataScript);

  function showError(message) {
    document.getElementById("summary").textContent = "";
    gamesElement.className = "error";
    gamesElement.textContent = message;
  }

  function formatDate(dateText) {
    var parts = dateText.split("-");
    var date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  }

  function monthKey(game) {
    return game.date.slice(0, 7);
  }

  function monthTitle(key) {
    var parts = key.split("-");
    return new Date(Number(parts[0]), Number(parts[1]) - 1, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }

  function buildGameRow(game, season) {
    var row = document.createElement("div");
    row.className = "match hockey-match";
    row.dataset.teams = (game.home + " " + game.away).toLowerCase();

    var home = document.createElement("span");
    home.className = "team team-home";
    home.textContent = game.home;

    var score = document.createElement("span");
    score.className = "score";
    var homeScore = document.createElement("b");
    homeScore.textContent = game.homeScore;
    var dash = document.createElement("span");
    dash.textContent = "–";
    var awayScore = document.createElement("b");
    awayScore.textContent = game.awayScore;
    if (game.homeScore > game.awayScore) homeScore.className = "winner";
    if (game.awayScore > game.homeScore) awayScore.className = "winner";
    score.appendChild(homeScore);
    score.appendChild(dash);
    score.appendChild(awayScore);

    var away = document.createElement("span");
    away.className = "team team-away";
    away.textContent = game.away;

    var details = document.createElement("div");
    details.className = "match-details";
    details.appendChild(document.createTextNode(formatDate(game.date)));
    var highlights = document.createElement("a");
    highlights.className = "highlight-link";
    highlights.href = "https://www.youtube.com/results?search_query=" + encodeURIComponent(season.label + " NHL " + game.away + " " + game.home + " highlights");
    highlights.target = "_blank";
    highlights.rel = "noreferrer";
    highlights.textContent = "Highlights";
    details.appendChild(highlights);

    row.appendChild(home);
    row.appendChild(score);
    row.appendChild(away);
    row.appendChild(details);
    return row;
  }

  function renderSeason() {
    var season = window.NHL_SEASON;
    if (!season) {
      showError("Season not found.");
      return;
    }

    document.title = season.label + " NHL hockey";
    document.getElementById("title").textContent = season.label + " NHL season";
    document.getElementById("summary").textContent = season.gameCount.toLocaleString() + " games: " + season.regularSeasonCount.toLocaleString() + " regular season and " + season.playoffCount + " Stanley Cup playoff games.";

    var grouped = {};
    season.games.forEach(function (game) {
      var key = game.type + "|" + monthKey(game);
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(game);
    });

    Object.keys(grouped).forEach(function (key) {
      var pieces = key.split("|");
      var section = document.createElement("section");
      section.className = "stage hockey-month";
      section.dataset.gameType = pieces[0];
      var heading = document.createElement("h2");
      heading.innerHTML = "<span>" + monthTitle(pieces[1]) + "</span><small>" + pieces[0] + " · " + grouped[key].length + " games</small>";
      section.appendChild(heading);
      grouped[key].forEach(function (game) {
        section.appendChild(buildGameRow(game, season));
      });
      gamesElement.appendChild(section);
    });

    var filterPanel = document.getElementById("game-filter");
    var filterInput = document.getElementById("team-filter");
    filterPanel.hidden = false;
    filterInput.addEventListener("input", function () {
      var query = filterInput.value.trim().toLowerCase();
      var visibleGames = 0;
      gamesElement.querySelectorAll(".hockey-month").forEach(function (section) {
        var sectionGames = 0;
        section.querySelectorAll(".hockey-match").forEach(function (row) {
          var matches = !query || row.dataset.teams.indexOf(query) !== -1;
          row.hidden = !matches;
          if (matches) sectionGames += 1;
        });
        section.hidden = sectionGames === 0;
        visibleGames += sectionGames;
      });
      document.getElementById("filter-count").textContent = query ? visibleGames.toLocaleString() + " games found" : "";
    });
  }
}());
