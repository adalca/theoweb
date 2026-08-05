(function () {
  const container = document.getElementById("truck-card");
  const pagination = document.getElementById("truck-pagination");
  const trucks = [...window.TRUCKS].sort((a, b) => a.name.localeCompare(b.name));
  const slug = new URLSearchParams(window.location.search).get("truck");
  const index = trucks.findIndex((item) => item.slug === slug);
  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#39;", '"':"&quot;" })[character]);
  const number = (value) => Number(value).toLocaleString("en-US", { maximumFractionDigits: 1 });
  const range = (values, unit, conversion, convertedUnit) => {
    const metric = values[0] === values[1] ? `${number(values[0])} ${unit}` : `${number(values[0])}–${number(values[1])} ${unit}`;
    const converted = values.map((value) => Math.round(value * conversion));
    const imperial = converted[0] === converted[1] ? `${number(converted[0])} ${convertedUnit}` : `${number(converted[0])}–${number(converted[1])} ${convertedUnit}`;
    return `${metric} (${imperial})`;
  };
  const factRow = (label, value) => `<div class="truck-fact-row"><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`;

  if (index < 0) {
    document.title = "Truck not found | Theo's Webhouse";
    container.innerHTML = `<section class="truck-not-found"><p class="eyebrow">Uh-oh!</p><h1>That truck drove away.</h1><p>Choose one from the complete machine yard.</p><a class="truck-button" href="index.html">See all trucks</a></section>`;
    return;
  }

  const item = trucks[index];
  document.title = `${item.name} | Theo's Webhouse`;
  const alternate = item.alternateName ? `<p class="truck-alternate">Also called: <strong>${escapeHtml(item.alternateName)}</strong></p>` : "";
  const imageLicense = item.image.licenseUrl ? `<a href="${escapeHtml(item.image.licenseUrl)}">${escapeHtml(item.image.license)}</a>` : escapeHtml(item.image.license);
  container.innerHTML = `<article class="truck-card">
    <header class="truck-card-title"><span class="truck-category-pill">${escapeHtml(item.category)}</span><h1>${escapeHtml(item.name)}</h1>${alternate}<p>${escapeHtml(item.job)}</p></header>
    <figure class="truck-figure"><img src="${escapeHtml(item.image.src)}" alt="${escapeHtml(item.image.alt)}"><figcaption>Photo by <a href="${escapeHtml(item.image.page)}">${escapeHtml(item.image.artist)}</a>, ${imageLicense}.</figcaption></figure>
    <section class="truck-stories">
      <div><span aria-hidden="true">⚙️</span><h2>How does it work?</h2><p>${escapeHtml(item.how)}</p></div>
      <div class="truck-size-story"><span aria-hidden="true">📏</span><h2>How big is it?</h2><p>${escapeHtml(item.size)}</p></div>
      <div class="truck-cool-story"><span aria-hidden="true">🤯</span><h2>Cool fact!</h2><p>${escapeHtml(item.coolFact)}</p></div>
    </section>
    <dl class="truck-fact-grid">
      ${factRow("Job crew", item.category)}
      ${factRow("Works at", item.settings.join(", "))}
      ${factRow("Typical length", range(item.measurements.length, "m", 3.28084, "ft"))}
      ${factRow("Typical height", range(item.measurements.height, "m", 3.28084, "ft"))}
      ${factRow("Typical weight", range(item.measurements.weightKg, "kg", 2.20462, "lb"))}
      ${factRow("Power & movement", item.power)}
      ${factRow("Super tools", item.equipment)}
    </dl>
    <aside class="truck-varies"><strong>Machines come in many sizes.</strong> ${escapeHtml(item.variation)}</aside>
    <footer class="truck-source"><strong>Grown-up fact-check:</strong> <a href="${escapeHtml(item.source)}">Learn more about this machine</a></footer>
  </article>`;

  const previous = trucks[(index - 1 + trucks.length) % trucks.length];
  const next = trucks[(index + 1) % trucks.length];
  pagination.innerHTML = `<a href="card.html?truck=${encodeURIComponent(previous.slug)}"><small>&larr; Previous machine</small><strong>${escapeHtml(previous.name)}</strong></a><a class="next-card" href="card.html?truck=${encodeURIComponent(next.slug)}"><small>Next machine &rarr;</small><strong>${escapeHtml(next.name)}</strong></a>`;
})();
