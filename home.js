(function () {
  var menu = document.querySelector(".main-menu");
  var categories = Array.prototype.slice.call(menu.children);

  for (var index = categories.length - 1; index > 0; index -= 1) {
    var randomIndex = Math.floor(Math.random() * (index + 1));
    var current = categories[index];
    categories[index] = categories[randomIndex];
    categories[randomIndex] = current;
  }

  categories.forEach(function (category) {
    menu.appendChild(category);
  });
}());
