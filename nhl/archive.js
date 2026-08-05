(function () {
  var list = document.getElementById("season-list");
  var summary = document.getElementById("archive-summary");
  var totalGames = window.NHL_SEASONS.reduce(function (total, season) {
    return total + season.gameCount;
  }, 0);

  summary.textContent = window.NHL_SEASONS.length + " played seasons and " + totalGames.toLocaleString() + " final scores. Newest seasons are first.";

  window.NHL_SEASONS.forEach(function (season) {
    var link = document.createElement("a");
    link.className = "season-row";
    link.href = "season.html?id=" + season.id;

    var badge = document.createElement("span");
    badge.className = "season-badge";
    badge.textContent = "NHL";

    var copy = document.createElement("span");
    var name = document.createElement("span");
    name.className = "season-name";
    name.textContent = season.label + " season";
    var details = document.createElement("span");
    details.className = "season-details";
    details.textContent = season.regularSeasonCount + " regular season · " + season.playoffCount + " playoff";
    copy.appendChild(name);
    copy.appendChild(details);

    var count = document.createElement("span");
    count.className = "season-count";
    count.innerHTML = "<strong>" + season.gameCount.toLocaleString() + "</strong><small>games</small>";

    link.appendChild(badge);
    link.appendChild(copy);
    link.appendChild(count);
    list.appendChild(link);
  });
}());
