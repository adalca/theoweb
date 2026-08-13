(function () {
  "use strict";

  function shuffle(values, random) {
    const result = values.slice();
    const rng = random || Math.random;
    for (let index = result.length - 1; index > 0; index -= 1) {
      const target = Math.floor(rng() * (index + 1));
      [result[index], result[target]] = [result[target], result[index]];
    }
    return result;
  }

  function buildDeck(questions, random) {
    const buckets = {
      easy: shuffle(questions.filter((item) => item.difficulty === "easy"), random),
      standard: shuffle(questions.filter((item) => item.difficulty === "standard"), random),
      challenge: shuffle(questions.filter((item) => item.difficulty === "challenge"), random)
    };
    const pattern = ["easy", "easy", "standard", "standard", "standard", "standard", "standard", "standard", "standard", "challenge"];
    const deck = [];
    let place = 0;
    while (deck.length < questions.length) {
      const preferred = pattern[place % pattern.length];
      const fallback = ["standard", "easy", "challenge"].find((key) => buckets[key].length);
      const bucket = buckets[preferred].length ? preferred : fallback;
      deck.push(buckets[bucket].pop());
      place += 1;
    }
    return deck;
  }

  function shuffledChoices(question, random) {
    return shuffle(question.choices.map((label, originalIndex) => ({ label, correct: originalIndex === question.correctIndex })), random);
  }

  window.TRIVIA_DECK = { shuffle, buildDeck, shuffledChoices };
}());
