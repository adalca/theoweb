(function () {
  "use strict";
  const cars = window.CARS.slice(0, 48);
  const names = cars.map((item) => `${item.name} (${item.make.replace(/(^|-)([a-z])/g, (all, dash, letter) => `${dash}${letter.toUpperCase()}`)})`);
  const makers = window.CAR_MANUFACTURERS.map((item) => item.name);
  const raw = [];
  cars.forEach((item, index) => {
    const answer = names[index];
    const otherCars = names.filter((name) => name !== answer);
    const maker = makers.find((name) => name.toLowerCase() === item.make) || item.make;
    raw.push(
      { question: `Which car matches this clue? ${item.coolFact}`, answer, distractors: otherCars, explanation: `${item.name} is a ${item.type.toLowerCase()} made by ${maker}.`, sourceLabel: "Manufacturer specifications", sourceUrl: item.sources[0].url },
      { question: `Which vehicle is a ${item.type.toLowerCase()} that seats ${item.seats} and has this clue: ${item.coolFact}`, answer, distractors: otherCars, explanation: `${item.name} uses ${item.power.toLowerCase()}.`, sourceLabel: "Manufacturer specifications", sourceUrl: item.sources[0].url },
      { question: `Which ${item.type.toLowerCase()} gets its power from ${item.power.toLowerCase()} and matches this fact: ${item.coolFact}`, answer, distractors: otherCars, explanation: item.coolFact, sourceLabel: "Manufacturer specifications", sourceUrl: item.sources[0].url }
    );
  });
  window.TRIVIA_BUILDER.addTopic("cars", 143, raw);
}());
