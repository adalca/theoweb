(function () {
  var list = document.getElementById("olympic-list");
  var olympics = window.OLYMPIC_HOCKEY.slice().reverse();
  var tournamentCount = window.OLYMPIC_HOCKEY.reduce(function (total, games) {
    return total + games.tournaments.length;
  }, 0);
  var matchCount = window.OLYMPIC_HOCKEY.reduce(function (total, games) {
    return total + games.matchCount;
  }, 0);

  document.getElementById("olympic-summary").textContent = window.OLYMPIC_HOCKEY.length + " Olympic Games, " + tournamentCount + " tournaments, and " + matchCount.toLocaleString() + " country match scores.";

  olympics.forEach(function (games) {
    var link = document.createElement("a");
    link.className = "olympic-row";
    link.href = "tournament.html?id=" + games.year;

    var badge = document.createElement("span");
    badge.className = "olympic-year-badge";
    badge.textContent = games.year;

    var copy = document.createElement("span");
    var name = document.createElement("span");
    name.className = "season-name";
    name.textContent = games.year + " Olympic hockey";
    var host = document.createElement("span");
    host.className = "olympic-host";
    host.textContent = games.host;
    var details = document.createElement("span");
    details.className = "season-details";
    details.textContent = games.tournaments.map(function (tournament) { return tournament.gender + "'s"; }).join(" & ") + " · " + games.matchCount + " games";
    copy.appendChild(name);
    copy.appendChild(host);
    copy.appendChild(details);

    var arrow = document.createElement("span");
    arrow.className = "olympic-arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "→";

    link.appendChild(badge);
    link.appendChild(copy);
    link.appendChild(arrow);
    list.appendChild(link);
  });
}());
