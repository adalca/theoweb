(function () {
  "use strict";

  var view = document.body.getAttribute("data-f1-view");
  var content = document.getElementById("f1-content");

  function make(tag, className, text) {
    var element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined && text !== null) element.textContent = text;
    return element;
  }

  function append(parent) {
    Array.prototype.slice.call(arguments, 1).forEach(function (child) {
      if (child) parent.appendChild(child);
    });
    return parent;
  }

  function queryNumber(name) {
    var value = new URLSearchParams(window.location.search).get(name);
    return /^\d+$/.test(value || "") ? Number(value) : null;
  }

  function formatDate(value) {
    if (!value) return "Date to be announced";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    }).format(new Date(value + "T12:00:00"));
  }

  function points(value) {
    return Number(value || 0).toLocaleString("en-US", { maximumFractionDigits: 2 });
  }

  function ordinal(position) {
    var labels = { 1: "1st", 2: "2nd", 3: "3rd" };
    return labels[position] || String(position);
  }

  function sourceNote(season) {
    var note = make("p", "f1-source");
    note.appendChild(document.createTextNode("Race data from "));
    var source = make("a", "", "F1DB");
    source.href = "https://github.com/f1db/f1db";
    source.target = "_blank";
    source.rel = "noreferrer";
    note.appendChild(source);
    note.appendChild(document.createTextNode(" (CC BY 4.0) · " + season.dataVersion + " · published " + formatDate(season.dataPublished)));
    return note;
  }

  function showError(title, detail) {
    content.textContent = "";
    var box = make("section", "f1-empty");
    append(box, make("span", "", "🏁"), make("h1", "", title), make("p", "", detail));
    var link = make("a", "f1-button", "See every year");
    link.href = "index.html";
    box.appendChild(link);
    content.appendChild(box);
  }

  function championshipMark() {
    var mark = make("span", "f1-champion-mark", "Champion");
    mark.setAttribute("aria-label", "Champion");
    return mark;
  }

  function pageHeading(kicker, title, intro) {
    var header = make("header", "f1-subheading");
    append(header, make("p", "f1-eyebrow", kicker), make("h1", "", title), make("p", "intro", intro));
    return header;
  }

  function renderYears() {
    if (!Array.isArray(window.F1_SEASONS)) {
      showError("The archive did not load", "Please refresh the page and try again.");
      return;
    }

    window.F1_SEASONS.forEach(function (season) {
      var row = make("article", "f1-year-row");
      var badge = make("span", "f1-year-badge", String(season.year));
      var copy = make("div", "f1-year-copy");
      var status = season.complete
        ? season.raceCount + " races"
        : season.completedRaceCount + " of " + season.raceCount + " races complete";
      append(copy, make("strong", "", season.complete ? "World Championship" : "Season in progress"), make("small", "", status));

      var actions = make("div", "f1-year-actions");
      var races = make("a", "f1-action f1-action-primary", "Races");
      races.href = "races.html?year=" + season.year;
      var standings = make("a", "f1-action", "Standing");
      standings.href = "standings.html?year=" + season.year;
      append(actions, races, standings);
      append(row, badge, copy, actions);
      content.appendChild(row);
    });

    var source = document.getElementById("f1-source");
    source.textContent = "Every championship season from 1950 to today · Data: F1DB (CC BY 4.0) · " + window.F1_DATA_VERSION;
  }

  function resultGroups(results) {
    var groups = [];
    [1, 2, 3].forEach(function (position) {
      var atPosition = results.filter(function (result) { return result.positionNumber === position; });
      if (atPosition.length) groups.push({ position: position, results: atPosition });
    });
    return groups;
  }

  function renderPodium(race) {
    var podium = make("div", "f1-podium");
    var groups = resultGroups(race.results);

    if (!groups.length) {
      podium.appendChild(make("p", "f1-upcoming", "Upcoming"));
      return podium;
    }

    groups.forEach(function (group) {
      var row = make("div", "f1-podium-row");
      var place = make("span", "f1-podium-place f1-place-" + group.position, ordinal(group.position));
      var names = group.results.map(function (result) { return result.driver; }).join(" / ");
      var teams = group.results.map(function (result) { return result.team; }).filter(function (team, index, all) {
        return all.indexOf(team) === index;
      }).join(" / ");
      var copy = make("span", "f1-podium-copy");
      append(copy, make("strong", "", names), make("small", "", teams));
      append(row, place, copy);
      podium.appendChild(row);
    });
    return podium;
  }

  function renderRaces(season) {
    content.textContent = "";
    document.title = season.year + " Formula 1 races";
    var summary = season.complete
      ? season.raceCount + " rounds, shown in race order. Pick a Grand Prix for every classified driver and car team."
      : season.completedRaceCount + " completed rounds and " + (season.raceCount - season.completedRaceCount) + " upcoming races.";
    append(content, pageHeading("Season " + season.year, season.year + " races", summary));

    var switcher = make("nav", "f1-view-switcher");
    switcher.setAttribute("aria-label", "Season views");
    var active = make("a", "is-active", "Races");
    active.href = "races.html?year=" + season.year;
    active.setAttribute("aria-current", "page");
    var standing = make("a", "", "Standing");
    standing.href = "standings.html?year=" + season.year;
    append(switcher, active, standing);
    content.appendChild(switcher);

    var list = make("div", "f1-race-list");
    season.races.forEach(function (race) {
      var card = make(race.results.length ? "a" : "article", "f1-race-card" + (race.results.length ? "" : " is-upcoming"));
      if (race.results.length) card.href = "race.html?year=" + season.year + "&round=" + race.round;
      var meta = make("div", "f1-race-meta");
      append(meta, make("span", "f1-round", "Round " + race.round), make("time", "", formatDate(race.date)));
      var details = make("div", "f1-race-details");
      append(details, make("h2", "", race.name), make("p", "", race.location || race.circuit), make("small", "", race.circuit));
      append(card, meta, details, renderPodium(race));
      if (race.results.length) card.appendChild(make("span", "f1-card-arrow", "›"));
      list.appendChild(card);
    });
    append(content, list, sourceNote(season));
  }

  function resultStatus(result) {
    if (result.reason) return result.reason;
    if (result.positionNumber === 1 && result.time) return result.time;
    return result.gap || result.time || (result.laps ? "Finished" : "—");
  }

  function renderRace(season) {
    var round = queryNumber("round");
    var race = season.races.find(function (item) { return item.round === round; });
    var back = document.getElementById("f1-back-link");
    back.href = "races.html?year=" + season.year;
    back.textContent = "← " + season.year + " races";

    if (!race) {
      showError("Race not found", "That round is not part of the " + season.year + " season.");
      return;
    }
    if (!race.results.length) {
      showError("This race has not finished", race.name + " is scheduled for " + formatDate(race.date) + ".");
      return;
    }

    content.textContent = "";
    document.title = race.name + " " + season.year + " result";
    var heading = pageHeading("Round " + race.round + " · " + formatDate(race.date), race.name, race.circuit + (race.location ? " · " + race.location : ""));
    content.appendChild(heading);
    content.appendChild(renderPodium(race));

    var wrap = make("div", "f1-table-wrap f1-results-wrap");
    var table = make("table", "f1-table");
    var thead = make("thead");
    var headRow = make("tr");
    ["Pos", "Driver", "Car team", "Laps", "Time / status"].forEach(function (label) {
      headRow.appendChild(make("th", "", label));
    });
    thead.appendChild(headRow);
    var tbody = make("tbody");
    race.results.forEach(function (result) {
      var row = make("tr");
      row.appendChild(make("td", "f1-position", result.position));
      var driver = make("td", "f1-driver");
      append(driver, make("strong", "", result.driver), result.number ? make("small", "", "Car " + result.number + (result.sharedCar ? " · shared" : "")) : null);
      row.appendChild(driver);
      row.appendChild(make("td", "", result.team));
      row.appendChild(make("td", "f1-number", result.laps === null ? "—" : String(result.laps)));
      row.appendChild(make("td", "f1-status", resultStatus(result)));
      tbody.appendChild(row);
    });
    append(table, thead, tbody);
    wrap.appendChild(table);
    append(content, wrap, sourceNote(season));
  }

  function standingTable(kind, rows) {
    var isDrivers = kind === "drivers";
    var wrap = make("div", "f1-table-wrap f1-standing-table");
    var table = make("table", "f1-table");
    var thead = make("thead");
    var headRow = make("tr");
    (isDrivers ? ["Pos", "Driver", "Car team", "Wins", "Points"] : ["Pos", "Car team", "Wins", "Points"]).forEach(function (label) {
      headRow.appendChild(make("th", "", label));
    });
    thead.appendChild(headRow);
    var tbody = make("tbody");
    rows.forEach(function (standing) {
      var row = make("tr", standing.champion ? "is-champion" : "");
      row.appendChild(make("td", "f1-position", standing.position));
      var name = make("td", isDrivers ? "f1-driver" : "f1-team");
      var label = make("strong", "", isDrivers ? standing.driver : standing.team);
      append(name, label, standing.champion ? championshipMark() : null);
      row.appendChild(name);
      if (isDrivers) row.appendChild(make("td", "", standing.teams.length ? standing.teams.join(" / ") : "—"));
      row.appendChild(make("td", "f1-number", String(standing.wins)));
      row.appendChild(make("td", "f1-points", points(standing.points)));
      tbody.appendChild(row);
    });
    append(table, thead, tbody);
    wrap.appendChild(table);
    return wrap;
  }

  function renderStandings(season) {
    content.textContent = "";
    document.title = season.year + " Formula 1 standings";
    var tense = season.complete ? "Final championship order" : "Current championship order after " + season.completedRaceCount + " rounds";
    append(content, pageHeading("Season " + season.year, season.year + " standings", tense + " for drivers and car teams."));

    var switcher = make("nav", "f1-view-switcher");
    switcher.setAttribute("aria-label", "Season views");
    var races = make("a", "", "Races");
    races.href = "races.html?year=" + season.year;
    var active = make("a", "is-active", "Standing");
    active.href = "standings.html?year=" + season.year;
    active.setAttribute("aria-current", "page");
    append(switcher, races, active);
    content.appendChild(switcher);

    var tabs = make("div", "f1-standing-tabs");
    tabs.setAttribute("role", "tablist");
    var driverButton = make("button", "is-active", "Drivers");
    var teamButton = make("button", "", "Car teams");
    driverButton.type = "button";
    teamButton.type = "button";
    driverButton.setAttribute("role", "tab");
    teamButton.setAttribute("role", "tab");
    driverButton.setAttribute("aria-selected", "true");
    teamButton.setAttribute("aria-selected", "false");
    append(tabs, driverButton, teamButton);
    content.appendChild(tabs);

    var driverPanel = make("section", "f1-standing-panel");
    var teamPanel = make("section", "f1-standing-panel");
    driverPanel.setAttribute("role", "tabpanel");
    teamPanel.setAttribute("role", "tabpanel");
    teamPanel.hidden = true;

    if (season.driverStandings.length) {
      driverPanel.appendChild(standingTable("drivers", season.driverStandings));
    } else {
      driverPanel.appendChild(make("p", "f1-inline-empty", "Driver standings are not available for this season."));
    }
    if (season.constructorStandings.length) {
      teamPanel.appendChild(standingTable("teams", season.constructorStandings));
    } else {
      teamPanel.appendChild(make("p", "f1-inline-empty", "The constructors’ championship began in 1958, so there is no car-team standing for this season."));
    }

    function selectTab(showDrivers) {
      driverButton.classList.toggle("is-active", showDrivers);
      teamButton.classList.toggle("is-active", !showDrivers);
      driverButton.setAttribute("aria-selected", String(showDrivers));
      teamButton.setAttribute("aria-selected", String(!showDrivers));
      driverPanel.hidden = !showDrivers;
      teamPanel.hidden = showDrivers;
    }
    driverButton.addEventListener("click", function () { selectTab(true); });
    teamButton.addEventListener("click", function () { selectTab(false); });

    append(content, driverPanel, teamPanel, sourceNote(season));
  }

  function loadSeason(year, callback) {
    if (!year || year < 1950 || year > 2100) {
      showError("Choose a Formula 1 year", "The year in this link is missing or invalid.");
      return;
    }
    var script = document.createElement("script");
    script.src = "data/" + year + ".js";
    script.onload = function () {
      if (!window.F1_SEASON || window.F1_SEASON.year !== year) {
        showError("Season not found", "There is no Formula 1 archive for " + year + ".");
        return;
      }
      callback(window.F1_SEASON);
    };
    script.onerror = function () {
      showError("Season not found", "There is no Formula 1 archive for " + year + ".");
    };
    document.head.appendChild(script);
  }

  if (view === "years") {
    renderYears();
    return;
  }

  var year = queryNumber("year");
  if (view === "races") loadSeason(year, renderRaces);
  if (view === "race") loadSeason(year, renderRace);
  if (view === "standings") loadSeason(year, renderStandings);
}());
