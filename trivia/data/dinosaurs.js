(function () {
  "use strict";
  const creatures = window.CREATURES.slice(0, 36);
  const names = creatures.map((item) => item.name);
  const distractorsFor = (item) => names.filter((name) => name !== item.name);
  const raw = [];
  creatures.forEach((item) => {
    const distractors = distractorsFor(item);
    raw.push(
      { question: `Which prehistoric creature fits this clue? ${item.fact}`, answer: item.name, distractors, explanation: item.didYouKnow, sourceLabel: "Museum fact source", sourceUrl: item.source },
      { question: `Which creature's name means “${item.meaning}”?`, answer: item.name, distractors, explanation: `${item.name} is pronounced ${item.pronunciation}.`, sourceLabel: "Museum fact source", sourceUrl: item.source },
      { question: `Which creature was a ${item.diet.toLowerCase()} found in ${item.countries[0]} and fits this clue? ${item.fact}`, answer: item.name, distractors, explanation: `${item.name} lived during the ${item.period}. ${item.fact}`, sourceLabel: "Museum fact source", sourceUrl: item.source },
      { question: `Which ${item.type.toLowerCase()} belonged to ${item.group}, lived in the ${item.period}, and has a name meaning “${item.meaning}”?`, answer: item.name, distractors, explanation: `${item.name} lived about ${item.age[0]} to ${item.age[1]} million years ago.`, sourceLabel: "Museum fact source", sourceUrl: item.source }
    );
  });
  window.TRIVIA_BUILDER.addTopic("dinosaurs", 143, raw);
}());
