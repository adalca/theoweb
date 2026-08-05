(function () {
  const list = document.getElementById("creature-list");
  const select = document.getElementById("sort-creatures");
  const count = document.getElementById("result-count");
  const creatures = window.CREATURES;

  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#39;", '"':"&quot;" })[character]);
  const shuffle = (items) => {
    const copy = [...items];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
    }
    return copy;
  };

  function tile(item) {
    const picture = item.image
      ? `<img class="creature-thumb" src="${escapeHtml(item.image.src)}" alt="${escapeHtml(item.image.alt)}">`
      : `<div class="creature-placeholder group-${escapeHtml(item.type.toLowerCase().replace(/[^a-z]+/g, "-"))}" aria-hidden="true"><span>${escapeHtml(item.name.charAt(0))}</span><small>${escapeHtml(item.group)}</small></div>`;
    const friendBadge = item.type === "Dinosaur" ? "" : `<span class="friend-badge">${escapeHtml(item.type)}</span>`;
    return `<a class="creature-tile" href="card.html?creature=${encodeURIComponent(item.slug)}">${picture}<span class="creature-tile-copy"><strong>${escapeHtml(item.name)}</strong><em>${escapeHtml(item.period)}</em><small>${escapeHtml(item.group)}</small>${friendBadge}</span><span class="tile-arrow" aria-hidden="true">&rarr;</span></a>`;
  }

  function render() {
    const mode = select.value;
    count.textContent = `${creatures.length} prehistoric creatures`;
    if (mode === "random") {
      list.innerHTML = `<div class="creature-grid">${shuffle(creatures).map(tile).join("")}</div>`;
      return;
    }
    if (mode === "name") {
      const sorted = [...creatures].sort((a, b) => a.name.localeCompare(b.name));
      list.innerHTML = `<div class="creature-grid">${sorted.map(tile).join("")}</div>`;
      return;
    }
    const field = mode === "region" ? "regions" : "group";
    const groups = new Map();
    creatures.forEach((item) => {
      const label = field === "regions" ? item.regions[0] : item.group;
      if (!groups.has(label)) groups.set(label, []);
      groups.get(label).push(item);
    });
    list.innerHTML = [...groups.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([label, items]) => `<section class="creature-group"><h2>${escapeHtml(label)}</h2><div class="creature-grid">${items.sort((a,b) => a.name.localeCompare(b.name)).map(tile).join("")}</div></section>`).join("");
  }

  select.addEventListener("change", render);
  render();
})();
