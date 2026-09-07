(function () {
  "use strict";

  var view = document.body.getAttribute("data-golf-view");
  var content = document.getElementById("golf-content");
  var seasons = window.GOLF_SEASONS;
  var query = new URLSearchParams(window.location.search);
  var statusLabels = {
    final: "Final", canceled: "Canceled", scheduled: "Scheduled",
    "in-progress": "In progress at last update"
  };

  function make(tag, className, text) {
    var element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined && text !== null) element.textContent = text;
    return element;
  }

  function formatDate(date, options) {
    return new Intl.DateTimeFormat("en-US", options || {
      month: "short", day: "numeric", year: "numeric"
    }).format(new Date(date + "T12:00:00"));
  }

  function dateRange(tournament) {
    var options = { month: "short", day: "numeric" };
    return formatDate(tournament.startDate, options) + " – "
      + formatDate(tournament.endDate, options);
  }

  function sourceNote(updated, tournament) {
    var note = make("p", "golf-source", "Results: ");
    var link = make("a", "", "ESPN");
    link.href = tournament ? tournament.source : "https://www.espn.com/golf/schedule";
    link.target = "_blank";
    link.rel = "noreferrer";
    note.appendChild(link);
    note.appendChild(document.createTextNode(" · Updated " + formatDate(updated)
      + " · Saved results, not live scoring."));
    return note;
  }

  function showError(title, detail) {
    content.textContent = "";
    var box = make("section", "golf-empty");
    box.appendChild(make("h1", "", title));
    box.appendChild(make("p", "", detail));
    var link = make("a", "golf-button", "See all golf seasons");
    link.href = "index.html";
    box.appendChild(link);
    content.appendChild(box);
  }

  function heading(eyebrow, title, description) {
    var header = make("header", "golf-subheading");
    header.appendChild(make("p", "golf-eyebrow", eyebrow));
    header.appendChild(make("h1", "", title));
    header.appendChild(make("p", "", description));
    return header;
  }

  function renderYears() {
    seasons.forEach(function (season) {
      var row = make("a", "golf-year-row");
      row.href = "season.html?year=" + season.year;
      row.appendChild(make("span", "golf-year-badge", season.year));
      var copy = make("span", "golf-year-copy");
      copy.appendChild(make("strong", "", season.year + " golf season"));
      var summary = season.completedCount + " tournaments complete";
      if (season.canceledCount) summary += " · " + season.canceledCount + " canceled";
      var pending = season.tournamentCount - season.completedCount - season.canceledCount;
      if (pending) summary += " · " + pending + " awaiting final results";
      copy.appendChild(make("small", "", summary));
      row.appendChild(copy);
      var arrow = make("span", "golf-arrow", "→");
      arrow.setAttribute("aria-hidden", "true");
      row.appendChild(arrow);
      content.appendChild(row);
    });
    var oldest = seasons[seasons.length - 1].year;
    var range = "Calendar years " + oldest + "–" + seasons[0].year + ". "
      + "The four men's majors plus THE PLAYERS and the TOUR Championship each year.";
    content.appendChild(make("p", "golf-source", range));
    content.appendChild(sourceNote(seasons[0].updated));
  }

  function seasonSwitcher(season) {
    var controls = make("div", "golf-controls");
    var label = make("label", "", "Season");
    var select = make("select");
    select.id = "golf-season";
    label.htmlFor = select.id;
    seasons.forEach(function (item) {
      var option = make("option", "", item.year);
      option.value = item.year;
      option.selected = item.year === season.year;
      select.appendChild(option);
    });
    select.addEventListener("change", function () {
      window.location.href = "season.html?year=" + select.value;
    });
    controls.appendChild(label);
    controls.appendChild(select);
    return controls;
  }

  function renderLeaders(tournament) {
    var list = make("ol", "golf-leaders golf-card-leaders");
    var leaders = tournament.results.filter(function (player) {
      return /^[T]?[123]$/.test(player.position);
    });
    leaders.forEach(function (player) {
      var row = make("li");
      row.appendChild(make("span", "golf-place", player.position));
      row.appendChild(make("strong", "", player.name));
      row.appendChild(make("span", "golf-score", player.score));
      list.appendChild(row);
    });
    return list;
  }

  function tournamentCard(tournament, year) {
    var card = make("a", "golf-tournament-card");
    card.href = "tournament.html?year=" + year + "&id=" + tournament.id;
    var date = make("div", "golf-date");
    date.appendChild(make("strong", "", formatDate(tournament.startDate, { month: "short" })));
    var sameMonth = tournament.startDate.slice(0, 7) === tournament.endDate.slice(0, 7);
    var endOptions = sameMonth ? { day: "numeric" } : { month: "short", day: "numeric" };
    var days = formatDate(tournament.startDate, { day: "numeric" }) + "–"
      + formatDate(tournament.endDate, endOptions);
    date.appendChild(make("span", "", days));
    card.appendChild(date);

    var copy = make("div", "golf-tournament-copy");
    var tag = tournament.major ? "Major championship" : "PGA TOUR";
    var className = "golf-tag" + (tournament.major ? " golf-tag-major" : "");
    copy.appendChild(make("span", className, tag));
    copy.appendChild(make("h2", "", tournament.name));
    if (tournament.course) copy.appendChild(make("p", "", tournament.course));
    if (tournament.location) copy.appendChild(make("p", "", tournament.location));
    card.appendChild(copy);
    if (tournament.status === "final") {
      card.appendChild(renderLeaders(tournament));
    } else {
      card.appendChild(make("p", "golf-card-leaders golf-status", statusLabels[tournament.status]));
    }
    var arrow = make("span", "golf-arrow", "→");
    arrow.setAttribute("aria-hidden", "true");
    card.appendChild(arrow);
    return card;
  }

  function renderSeason(season) {
    content.textContent = "";
    document.title = season.year + " golf season";
    content.appendChild(heading("Men's professional golf", season.year + " golf season",
      "The biggest tournaments, in date order. Pick one for the full leaderboard."));
    var controls = seasonSwitcher(season);
    var filters = make("div", "golf-filters");
    filters.setAttribute("aria-label", "Tournament filters");
    filters.setAttribute("role", "group");
    var all = make("button", "golf-button", "All tournaments");
    var majors = make("button", "golf-button", "Majors only");
    var majorsOnly = query.get("filter") === "majors";
    all.type = majors.type = "button";
    filters.appendChild(all);
    filters.appendChild(majors);
    controls.appendChild(filters);
    content.appendChild(controls);
    var list = make("div", "golf-tournament-list");
    content.appendChild(list);

    function updateFilter(onlyMajors) {
      all.setAttribute("aria-pressed", String(!onlyMajors));
      majors.setAttribute("aria-pressed", String(onlyMajors));
      list.textContent = "";
      season.tournaments.forEach(function (tournament) {
        if (!onlyMajors || tournament.major) {
          list.appendChild(tournamentCard(tournament, season.year));
        }
      });
    }
    all.addEventListener("click", function () { updateFilter(false); });
    majors.addEventListener("click", function () { updateFilter(true); });
    updateFilter(majorsOnly);
    content.appendChild(sourceNote(season.updated));
  }

  function tableFrame(caption, labels) {
    var wrap = make("div", "golf-table-wrap");
    wrap.tabIndex = 0;
    wrap.setAttribute("role", "region");
    wrap.setAttribute("aria-label", caption + "; scroll horizontally for all columns");
    var table = make("table", "golf-table");
    table.appendChild(make("caption", "", caption));
    var head = make("thead");
    var row = make("tr");
    labels.forEach(function (label) {
      var cell = make("th", "", label);
      cell.scope = "col";
      row.appendChild(cell);
    });
    head.appendChild(row);
    table.appendChild(head);
    var body = make("tbody");
    table.appendChild(body);
    wrap.appendChild(table);
    return { wrap: wrap, body: body };
  }

  function renderPlayoffs(tournament) {
    if (!tournament.playoffs.length) return;
    var section = make("section", "golf-playoff");
    section.appendChild(make("h2", "", "Playoff"));
    tournament.playoffs.forEach(function (playoff, index) {
      var labels = ["Player"].concat(playoff.holes.map(function (hole) {
        return "Hole " + hole;
      }));
      var frame = tableFrame("Playoff " + (index + 1), labels);
      playoff.players.forEach(function (player) {
        var row = make("tr", player.winner ? "is-winner" : "");
        var name = make("th", "", player.name + (player.winner ? " · Winner" : ""));
        name.scope = "row";
        row.appendChild(name);
        player.scores.forEach(function (score) { row.appendChild(make("td", "", score)); });
        frame.body.appendChild(row);
      });
      section.appendChild(frame.wrap);
      if (!playoff.holes.length) {
        section.appendChild(make("p", "golf-note",
          "Hole scores for this playoff are unavailable in the saved source."));
      }
    });
    content.appendChild(section);
  }

  function renderResults(tournament) {
    var search = make("div", "golf-search");
    var label = make("label", "", "Find a golfer");
    label.htmlFor = "golf-player-search";
    var input = make("input");
    input.type = "search";
    input.id = "golf-player-search";
    input.placeholder = "Player name or country";
    search.appendChild(label);
    search.appendChild(input);
    content.appendChild(search);
    var count = make("p", "golf-result-count");
    count.setAttribute("role", "status");
    content.appendChild(count);
    var title = tournament.status === "final" ? "Final leaderboard" : "Leaderboard at last update";
    var frame = tableFrame(title, ["Pos", "Player", "To par", "R1", "R2", "R3", "R4", "Total"]);
    content.appendChild(frame.wrap);
    var empty = make("p", "golf-note", "No golfers match your search.");
    content.appendChild(empty);

    function normalize(value) {
      return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    }

    function updateResults() {
      var term = normalize(input.value.trim());
      var players = tournament.results.filter(function (player) {
        return normalize(player.name + " " + player.country).includes(term);
      });
      frame.body.textContent = "";
      players.forEach(function (player) {
        var winner = tournament.status === "final" && player.position === "1";
        var row = make("tr", winner ? "is-winner" : "");
        row.appendChild(make("td", "golf-place", player.position));
        var name = make("th", "", player.name);
        name.scope = "row";
        if (player.country) name.appendChild(make("small", "golf-player-country", player.country));
        row.appendChild(name);
        row.appendChild(make("td", "golf-score", player.score));
        player.rounds.forEach(function (round) { row.appendChild(make("td", "", round || "—")); });
        row.appendChild(make("td", "", player.total || "—"));
        frame.body.appendChild(row);
      });
      count.textContent = players.length + " of " + tournament.results.length + " golfers";
      empty.hidden = players.length > 0;
      frame.wrap.hidden = !players.length;
    }
    input.addEventListener("input", updateResults);
    updateResults();
    content.appendChild(make("p", "golf-note", "Lower scores are better. E = even par; "
      + "− = under par; + = over par. T = tied position; CUT = missed the cut; "
      + "WD = withdrew; DQ = disqualified; DNS = did not start; "
      + "MDF = missed the later cut; — = no score recorded. "
      + "R1–R4 and Total show strokes; playoff strokes are separate."));
  }

  function renderTournament(season) {
    var tournament = season.tournaments.find(function (item) { return item.id === query.get("id"); });
    var back = document.getElementById("golf-back-link");
    back.href = "season.html?year=" + season.year;
    back.textContent = "← " + season.year + " golf tournaments";
    if (!tournament) {
      showError("Tournament not found", "Choose a tournament from the golf season list.");
      return;
    }
    content.textContent = "";
    document.title = tournament.name + " " + season.year + " results";
    var description = [tournament.course, tournament.location].filter(Boolean).join(" · ");
    content.appendChild(heading(season.year + " · " + dateRange(tournament),
      tournament.name, description));
    content.appendChild(make("span", "golf-tag", statusLabels[tournament.status]));
    var winner = tournament.status === "final" && tournament.results.find(function (player) {
      return player.position === "1";
    });
    if (winner) {
      var banner = make("section", "golf-winner");
      var trophy = make("span", "", "🏆");
      trophy.setAttribute("aria-hidden", "true");
      banner.appendChild(trophy);
      var copy = make("div");
      copy.appendChild(make("p", "golf-eyebrow", "Champion"));
      copy.appendChild(make("h2", "", winner.name));
      copy.appendChild(make("p", "", winner.score + " to par"
        + (winner.total ? " · " + winner.total + " strokes" : "")
        + (tournament.playoffs.length ? " · Won in a playoff" : "")));
      banner.appendChild(copy);
      content.appendChild(banner);
    }
    if (tournament.note) content.appendChild(make("p", "golf-note", tournament.note));
    if (tournament.status === "canceled") {
      content.appendChild(make("p", "golf-note", "This tournament was canceled. No champion was crowned."));
    } else if (!tournament.results.length) {
      content.appendChild(make("p", "golf-note", "Results were not available at the last update."));
    } else {
      renderPlayoffs(tournament);
      renderResults(tournament);
    }
    content.appendChild(sourceNote(season.updated, tournament));
  }

  if (!Array.isArray(seasons) || !seasons.length) {
    showError("The golf archive did not load", "Please refresh the page and try again.");
    return;
  }
  if (view === "years") {
    renderYears();
    return;
  }
  var year = query.get("year");
  if (!/^\d{4}$/.test(year || "") || !seasons.some(function (item) {
    return String(item.year) === year;
  })) {
    showError("Season not found", "Choose an available year from the golf archive.");
    return;
  }
  var script = document.createElement("script");
  script.src = "data/" + year + ".js";
  script.onload = function () {
    var season = window.GOLF_SEASON;
    if (!season || String(season.year) !== year || !Array.isArray(season.tournaments)) {
      showError("The season did not load", "Please refresh the page and try again.");
      return;
    }
    if (view === "tournament") renderTournament(season);
    else renderSeason(season);
  };
  script.onerror = function () {
    showError("The season did not load", "Please refresh the page and try again.");
  };
  document.head.appendChild(script);
}());
