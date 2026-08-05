(function () {
  const list = document.getElementById("truck-list");
  const select = document.getElementById("sort-trucks");
  const count = document.getElementById("truck-count");
  const trucks = window.TRUCKS;
  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#39;", '"':"&quot;" })[character]);
  const shuffle = (items) => {
    const copy = [...items];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
    }
    return copy;
  };
  const averageLength = (item) => (item.measurements.length[0] + item.measurements.length[1]) / 2;
  const tile = (item) => `<a class="truck-tile" href="card.html?truck=${encodeURIComponent(item.slug)}">
    <img class="truck-thumb" src="${escapeHtml(item.image.src)}" alt="${escapeHtml(item.image.alt)}">
    <span class="truck-tile-copy"><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.category)}</small></span>
  </a>`;

  function render() {
    const mode = select.value;
    count.textContent = `${trucks.length} mighty machines`;
    if (mode === "random") {
      list.innerHTML = `<div class="truck-grid">${shuffle(trucks).map(tile).join("")}</div>`;
      return;
    }
    if (mode === "name" || mode === "size") {
      const sorted = [...trucks].sort(mode === "name" ? (a, b) => a.name.localeCompare(b.name) : (a, b) => averageLength(a) - averageLength(b));
      list.innerHTML = `<div class="truck-grid">${sorted.map(tile).join("")}</div>`;
      return;
    }
    const groups = new Map();
    trucks.forEach((item) => {
      if (!groups.has(item.category)) groups.set(item.category, []);
      groups.get(item.category).push(item);
    });
    list.innerHTML = [...groups.entries()].map(([label, items]) => `<section class="truck-group"><h2>${escapeHtml(label)}</h2><div class="truck-grid">${items.map(tile).join("")}</div></section>`).join("");
  }

  select.addEventListener("change", render);
  render();
})();
