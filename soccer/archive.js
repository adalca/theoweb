(function () {
  var list = document.getElementById("tournament-list");

  var countryCodes = {
    CAN: "Canada",
    MEX: "Mexico",
    USA: "United States"
  };

  var hostOverrides = {
    "euro-2020": [
      "Azerbaijan",
      "Denmark",
      "England",
      "Germany",
      "Hungary",
      "Italy",
      "Netherlands",
      "Romania",
      "Russia",
      "Scotland",
      "Spain"
    ]
  };

  function getHostCountries(tournament) {
    if (hostOverrides[tournament.slug]) {
      return hostOverrides[tournament.slug];
    }

    var countries = [];

    tournament.matches.forEach(function (match) {
      var locationParts = match.location.split(",");
      var country = locationParts[locationParts.length - 1].trim();
      country = countryCodes[country] || country;

      if (country && countries.indexOf(country) === -1) {
        countries.push(country);
      }
    });

    return countries.sort();
  }

  function formatCountryList(countries) {
    if (countries.length < 2) {
      return countries[0] || "Unknown";
    }

    if (countries.length === 2) {
      return countries.join(" & ");
    }

    return countries.slice(0, -1).join(", ") + " & " + countries[countries.length - 1];
  }

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
    var host = document.createElement("span");
    host.className = "tournament-host";
    host.textContent = "Held in " + formatCountryList(getHostCountries(tournament));
    var count = document.createElement("span");
    count.className = "tournament-count";
    count.textContent = tournament.matches.length + " matches";
    text.appendChild(name);
    text.appendChild(host);
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
