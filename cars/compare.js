(function () {
  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#39;", '"':"&quot;" })[character]);
  const selectOne = document.getElementById("compare-car-one");
  const selectTwo = document.getElementById("compare-car-two");
  const status = document.getElementById("compare-status");
  const comparison = document.getElementById("comparison");
  const carBySlug = new Map(window.CARS.map((car) => [car.slug, car]));
  const makerBySlug = new Map(window.CAR_MANUFACTURERS.map((maker) => [maker.slug, maker]));
  const params = new URLSearchParams(window.location.search);

  const optionGroups = window.CAR_MANUFACTURERS.map((maker) => {
    const cars = window.CARS.filter((car) => car.make === maker.slug).sort((a, b) => {
      if (a.era !== b.era) return a.era === "current" ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    return `<optgroup label="${escapeHtml(maker.name)}">${cars.map((car) => `<option value="${escapeHtml(car.slug)}">${escapeHtml(car.year)} ${escapeHtml(car.name)}${car.era === "historic" ? " — from history" : ""}</option>`).join("")}</optgroup>`;
  }).join("");
  const options = `<option value="">Choose a car…</option>${optionGroups}`;
  selectOne.innerHTML = options;
  selectTwo.innerHTML = options;

  const firstSlug = params.get("car1");
  const secondSlug = params.get("car2");
  if (carBySlug.has(firstSlug)) selectOne.value = firstSlug;
  if (carBySlug.has(secondSlug)) selectTwo.value = secondSlug;

  const rows = (first, second) => [
    ["Representative car", `${first.year} ${first.trim}`, `${second.year} ${second.trim}`],
    ["Place in the garage", first.era === "current" ? "Current model" : "From history", second.era === "current" ? "Current model" : "From history"],
    ["Vehicle type", first.type, second.type], ["Seats", first.seats, second.seats],
    ["Inside space", first.interior, second.interior], ["Outside size", first.size, second.size],
    ["Powertrain", first.power, second.power], ["Horsepower", first.horsepower, second.horsepower],
    ["Driven wheels", first.drivetrain, second.drivetrain], ["Top speed", first.topSpeed, second.topSpeed],
    ["0–60 mph", first.acceleration, second.acceleration], ["Fuel or energy", first.fuel, second.fuel],
    ["Safety record", first.safety, second.safety], ["Cool car fact", first.coolFact, second.coolFact]
  ];

  function syncUrl() {
    const next = new URLSearchParams();
    if (carBySlug.has(selectOne.value)) next.set("car1", selectOne.value);
    if (carBySlug.has(selectTwo.value)) next.set("car2", selectTwo.value);
    const query = next.toString();
    window.history.replaceState(null, "", `compare.html${query ? `?${query}` : ""}`);
  }

  function carHeader(car) {
    const maker = makerBySlug.get(car.make);
    const image = window.CAR_IMAGES[car.slug];
    return `<article class="compare-car" style="--maker-color:${maker.color}">
      <img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}">
      <div class="compare-car-copy"><p>${escapeHtml(maker.name)}</p><h2><a href="card.html?car=${encodeURIComponent(car.slug)}">${escapeHtml(car.name)}</a></h2><p>${escapeHtml(car.year)} ${escapeHtml(car.trim)}</p></div>
      <p class="compare-photo-credit">Photo: <a href="${escapeHtml(image.page)}">${escapeHtml(image.author)}</a> &middot; <a href="${escapeHtml(image.licenseUrl)}">${escapeHtml(image.license)}</a></p>
    </article>`;
  }

  function render() {
    syncUrl();
    const first = carBySlug.get(selectOne.value);
    const second = carBySlug.get(selectTwo.value);
    comparison.innerHTML = "";
    if (!first && !second) {
      status.textContent = "Choose two cars to start comparing.";
      return;
    }
    if (!first || !second) {
      status.textContent = "Great first pick! Now choose the other car.";
      return;
    }
    if (first === second) {
      status.textContent = "Pick two different cars so there is something to compare.";
      return;
    }
    status.textContent = `${first.name} and ${second.name} are ready to compare.`;
    comparison.innerHTML = `<section class="compare-results" aria-label="${escapeHtml(first.name)} compared with ${escapeHtml(second.name)}">
      <div class="compare-car-grid">${carHeader(first)}${carHeader(second)}</div>
      <div class="compare-facts">${rows(first, second).map(([label, one, two]) => `<section class="compare-row"><h3>${escapeHtml(label)}</h3><p>${escapeHtml(one)}</p><p>${escapeHtml(two)}</p></section>`).join("")}</div>
    </section>`;
  }

  selectOne.addEventListener("change", render);
  selectTwo.addEventListener("change", render);
  render();
}());
