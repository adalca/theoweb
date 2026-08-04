(function () {
  var list = document.getElementById("tournament-list");

  window.TOURNAMENTS.forEach(function (tournament) {
    var link = document.createElement("a");
    link.className = "tournament-row";
    link.href = "tournament.html?id=" + encodeURIComponent(tournament.slug);

    var icon = document.createElement("span");
    icon.className = "tournament-icon " + tournament.competition;
    icon.textContent = tournament.short;

    var text = document.createElement("span");
    var name = document.createElement("span");
    name.className = "tournament-name";
    name.textContent = tournament.title;
    var count = document.createElement("span");
    count.className = "tournament-count";
    count.textContent = tournament.matches.length + " matches";
    text.appendChild(name);
    text.appendChild(count);

    var year = document.createElement("span");
    year.className = "year";
    year.textContent = tournament.year;

    link.appendChild(icon);
    link.appendChild(text);
    link.appendChild(year);
    list.appendChild(link);
  });
}());
