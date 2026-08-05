(function () {
  const container = document.getElementById("creature-card");
  const pagination = document.getElementById("creature-pagination");
  const creatures = [...window.CREATURES].sort((a, b) => a.name.localeCompare(b.name));
  const slug = new URLSearchParams(window.location.search).get("creature");
  const index = creatures.findIndex((item) => item.slug === slug);
  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#39;", '"':"&quot;" })[character]);

  if (index < 0) {
    document.title = "Creature not found | Theo's Webhouse";
    container.innerHTML = `<section class="not-found"><p class="eyebrow">Uh-oh!</p><h1>That creature wandered away.</h1><p>Try choosing one from the complete dinosaur list.</p><a class="button-link" href="index.html">See all creatures</a></section>`;
    return;
  }

  const item = creatures[index];
  document.title = `${item.name} | Theo's Webhouse`;
  const range = (values, unit, conversion, convertedUnit) => {
    if (!values || values[0] == null) return "Not known";
    const metric = values[0] === values[1] ? `${values[0]} ${unit}` : `${values[0]}–${values[1]} ${unit}`;
    const converted = values.map((value) => Math.round(value * conversion));
    const imperial = converted[0] === converted[1] ? `${converted[0]} ${convertedUnit}` : `${converted[0]}–${converted[1]} ${convertedUnit}`;
    return `${metric} (${imperial})`;
  };
  const factRow = (label, value) => `<div class="fact-row"><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`;
  const picture = item.image
    ? `<figure class="creature-figure"><img src="${escapeHtml(item.image.src)}" alt="${escapeHtml(item.image.alt)}"><figcaption>Illustration by <a href="${escapeHtml(item.image.page)}">${escapeHtml(item.image.artist)}</a>, <a href="${escapeHtml(item.image.licenseUrl)}">${escapeHtml(item.image.license)}</a>. Colors and soft tissues in reconstructions are partly informed guesses.</figcaption></figure>`
    : `<div class="card-placeholder group-${escapeHtml(item.type.toLowerCase().replace(/[^a-z]+/g, "-"))}" role="img" aria-label="No reusable illustration is available for ${escapeHtml(item.name)}"><span>${escapeHtml(item.name.charAt(0))}</span><small>Picture coming someday</small></div>`;
  const friendNote = item.type === "Dinosaur" ? "" : `<aside class="not-a-dinosaur"><strong>Friend, not a dinosaur!</strong> ${escapeHtml(item.name)} was a ${escapeHtml(item.type.toLowerCase())}. It belongs here because it lived before, alongside, or near the age of dinosaurs.</aside>`;
  const wingspan = item.wingspan ? factRow("Wingspan", range(item.wingspan, "m", 3.28084, "ft")) : "";

  container.innerHTML = `<article class="dinosaur-card">
    <header class="card-title"><div><span class="type-pill">${escapeHtml(item.type)}</span><p class="eyebrow">Prehistoric creature card</p><h1>${escapeHtml(item.name)}</h1><p class="scientific-name"><i>${escapeHtml(item.scientificName)}</i></p><p class="name-notes"><strong>Say it:</strong> ${escapeHtml(item.pronunciation)} <span aria-hidden="true">&bull;</span> <strong>Name means:</strong> “${escapeHtml(item.meaning)}”</p></div></header>
    ${picture}
    ${friendNote}
    <dl class="fact-grid">
      ${factRow("Creature type", item.type)}
      ${factRow("Scientific group", item.group)}
      ${factRow("Period", item.period)}
      ${factRow("Age range", `${item.age[0]}–${item.age[1]} million years ago`)}
      ${factRow("Length range", range(item.measurements.length, "m", 3.28084, "ft"))}
      ${factRow("Height range", range(item.measurements.height, "m", 3.28084, "ft"))}
      ${wingspan}
      ${factRow("Weight range", range(item.measurements.weightKg, "kg", 2.20462, "lb"))}
      ${factRow("Dietary type", item.diet)}
      ${factRow("How it moved", item.movement)}
      ${factRow("Found in", `${item.countries.join(", ")} (${item.regions.join(", ")})`)}
    </dl>
    <section class="story-facts"><div><h2>What makes it special?</h2><p>${escapeHtml(item.fact)}</p></div><div class="did-you-know"><h2>Did you know?</h2><p>${escapeHtml(item.didYouKnow)}</p></div></section>
    <aside class="science-note"><h2>Science keeps moving</h2><p>${escapeHtml(item.uncertainty)}</p></aside>
    <footer class="card-sources"><strong>Learn more:</strong> <a href="${escapeHtml(item.source)}">Museum fact source</a></footer>
  </article>`;

  const previous = creatures[(index - 1 + creatures.length) % creatures.length];
  const next = creatures[(index + 1) % creatures.length];
  pagination.innerHTML = `<a href="card.html?creature=${encodeURIComponent(previous.slug)}"><small>&larr; Previous</small><strong>${escapeHtml(previous.name)}</strong></a><a class="next-card" href="card.html?creature=${encodeURIComponent(next.slug)}"><small>Next &rarr;</small><strong>${escapeHtml(next.name)}</strong></a>`;
})();
