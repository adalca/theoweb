(function () {
  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#39;", '"':"&quot;" })[character]);
  const slug = new URLSearchParams(window.location.search).get("car");
  const car = window.CARS.find((item) => item.slug === slug);
  const card = document.getElementById("car-card");
  const pagination = document.getElementById("car-pagination");
  if (!car) {
    card.innerHTML = `<section class="car-not-found"><span aria-hidden="true">🛞</span><h1>We couldn't find that car!</h1><p>It may have driven out of the garage.</p><a class="car-button" href="index.html">Explore all cars</a></section>`;
    pagination.hidden = true;
    return;
  }
  const maker = window.CAR_MANUFACTURERS.find((item) => item.slug === car.make);
  const image = window.CAR_IMAGES[car.slug];
  const makerCars = window.CARS.filter((item) => item.make === car.make).sort((a, b) => (a.era === b.era ? 0 : a.era === "current" ? -1 : 1));
  const index = makerCars.indexOf(car);
  const rows = [
    ["Representative car", `${car.year} ${car.trim}`], ["Vehicle type", car.type], ["Seats", car.seats],
    ["Inside space", car.interior], ["Outside size", car.size], ["Powertrain", car.power],
    ["Horsepower", car.horsepower], ["Driven wheels", car.drivetrain], ["Top speed", car.topSpeed],
    ["0–60 mph", car.acceleration], ["Fuel or energy", car.fuel], ["Safety record", car.safety]
  ];
  document.title = `${car.name} facts | Theo's Webhouse`;
  document.getElementById("back-to-maker").href = `manufacturer.html?make=${encodeURIComponent(maker.slug)}`;
  document.getElementById("back-to-maker").textContent = `← ${maker.name} cars`;
  card.innerHTML = `<article class="car-fact-card" style="--maker-color:${maker.color}">
    <header class="car-card-title"><span class="car-era-pill">${car.era === "current" ? "Current model" : "From history"}</span><p>${escapeHtml(maker.name)}</p><h1>${escapeHtml(car.name)}</h1><p>${escapeHtml(car.year)} ${escapeHtml(car.trim)}</p></header>
    <figure class="car-figure"><img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}"><figcaption>Photo: <a href="${escapeHtml(image.page)}">${escapeHtml(image.author)}</a> &middot; <a href="${escapeHtml(image.licenseUrl)}">${escapeHtml(image.license)}</a></figcaption></figure>
    <dl class="car-fact-grid">${rows.map(([label, value]) => `<div><dt>${label}</dt><dd>${escapeHtml(value)}</dd></div>`).join("")}</dl>
    <section class="car-cool-fact"><span aria-hidden="true">💡</span><div><h2>Cool car fact</h2><p>${escapeHtml(car.coolFact)}</p></div></section>
    <p class="car-specific-note"><strong>Why name a year?</strong> Cars change between generations, trims, and countries. These facts describe the representative car named above—not every car with the same badge.</p>
    <footer class="car-sources"><strong>Check the sources:</strong> ${car.sources.map((source) => `<a href="${escapeHtml(source.url)}">${escapeHtml(source.label)}</a>`).join(" &middot; ")}</footer>
  </article>`;
  const navLink = (item, label, className) => item ? `<a class="${className}" href="card.html?car=${encodeURIComponent(item.slug)}"><small>${label}</small><strong>${escapeHtml(item.name)}</strong></a>` : `<span></span>`;
  pagination.innerHTML = navLink(makerCars[index - 1], "← Previous", "previous-card") + navLink(makerCars[index + 1], "Next →", "next-card");
}());
