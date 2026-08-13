(function () {
  "use strict";
  const trucks = window.TRUCKS.slice(0, 36);
  const names = trucks.map((item) => item.name);
  const raw = [];
  trucks.forEach((item) => {
    const distractors = names.filter((name) => name !== item.name);
    raw.push(
      { question: `Which machine does this job? ${item.job}`, answer: item.name, distractors, explanation: item.coolFact, sourceLabel: "Machine reference", sourceUrl: item.source },
      { question: `Which machine uses this equipment: ${item.equipment}?`, answer: item.name, distractors, explanation: item.how, sourceLabel: "Machine reference", sourceUrl: item.source },
      { question: `Which machine works like this? ${item.how}`, answer: item.name, distractors, explanation: item.coolFact, sourceLabel: "Machine reference", sourceUrl: item.source },
      { question: `Which ${item.category.toLowerCase()} machine fits this size clue? ${item.size}`, answer: item.name, distractors, explanation: `${item.name}: ${item.job}`, sourceLabel: "Machine reference", sourceUrl: item.source }
    );
  });
  window.TRIVIA_BUILDER.addTopic("trucks", 143, raw);
}());
