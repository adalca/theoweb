(function () {
  const list = document.getElementById("manufacturer-list");
  const counts = window.CARS.reduce((map, car) => {
    map[car.make] = (map[car.make] || 0) + 1;
    return map;
  }, {});
  list.innerHTML = window.CAR_MANUFACTURERS.map((maker, index) => `
    <a class="manufacturer-tile" href="manufacturer.html?make=${encodeURIComponent(maker.slug)}" style="--maker-color:${maker.color};--maker-delay:${index * 35}ms">
      <span class="manufacturer-initials" aria-hidden="true">${maker.initials}</span>
      <span><strong>${maker.name}</strong><small>${counts[maker.slug]} cars to discover</small></span>
      <span class="manufacturer-arrow" aria-hidden="true">&rarr;</span>
    </a>`).join("");
}());
