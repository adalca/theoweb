(function () {
  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#39;", '"':"&quot;" })[character]);
  const slug = new URLSearchParams(window.location.search).get("make");
  const maker = window.CAR_MANUFACTURERS.find((item) => item.slug === slug);
  const view = document.getElementById("manufacturer-view");
  if (!maker) {
    view.innerHTML = `<section class="car-not-found"><span aria-hidden="true">🚗</span><h1>That car maker took a wrong turn!</h1><p>Let's drive back and choose another one.</p><a class="car-button" href="index.html">See all manufacturers</a></section>`;
    return;
  }
  document.title = `${maker.name} cars | Theo's Webhouse`;
  const cars = window.CARS.filter((car) => car.make === maker.slug);
  const tile = (car) => {
    const image = window.CAR_IMAGES[car.slug];
    return `<a class="car-tile" href="card.html?car=${encodeURIComponent(car.slug)}">
      <img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}">
      <span><strong>${escapeHtml(car.name)}</strong><small>${escapeHtml(car.year)} ${escapeHtml(car.type)}</small></span>
    </a>`;
  };
  const group = (era, title, intro) => {
    const items = cars.filter((car) => car.era === era);
    return `<section class="car-model-group"><div class="car-section-heading"><div><p class="eyebrow">${intro}</p><h2>${title}</h2></div><span>${items.length}</span></div><div class="car-grid">${items.map(tile).join("")}</div></section>`;
  };
  view.innerHTML = `<header class="maker-heading" style="--maker-color:${maker.color}">
    <span class="maker-big-initials" aria-hidden="true">${maker.initials}</span>
    <div><p class="eyebrow">Manufacturer garage</p><h1>${escapeHtml(maker.name)}</h1><p>${escapeHtml(maker.blurb)}</p></div>
  </header>${group("current", "Cars you can meet today", "Current models")}${group("historic", "Cars from history", "Classic models")}`;
}());
