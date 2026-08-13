(function () {
  "use strict";

  const allQuestions = [];
  const allowedDifficulties = ["easy", "standard", "challenge"];

  function unique(values) {
    return values.filter((value, index, list) => value && list.indexOf(value) === index);
  }

  function difficultyFor(index) {
    const place = index % 10;
    if (place < 2) return "easy";
    if (place === 9) return "challenge";
    return "standard";
  }

  function desiredChoiceCount(index) {
    if (index % 29 === 0) return 2;
    if (index % 23 === 0) return 5;
    return 4;
  }

  function addTopic(topic, count, rawQuestions) {
    if (!rawQuestions || rawQuestions.length < count) {
      throw new Error(`${topic} needs at least ${count} raw questions.`);
    }

    const answerPool = unique(rawQuestions.map((item) => item.answer).concat(rawQuestions.flatMap((item) => item.distractors || [])));
    rawQuestions.slice(0, count).forEach((raw, index) => {
      const choiceCount = desiredChoiceCount(index);
      const distractors = unique((raw.distractors || []).concat(answerPool)).filter((choice) => choice !== raw.answer).slice(0, choiceCount - 1);
      if (distractors.length < choiceCount - 1) throw new Error(`Not enough choices for ${topic}-${index + 1}.`);
      const choices = [raw.answer].concat(distractors);
      allQuestions.push({
        id: `${topic}-${String(index + 1).padStart(3, "0")}`,
        topic,
        difficulty: raw.difficulty || difficultyFor(index),
        question: raw.question,
        choices,
        correctIndex: 0,
        explanation: raw.explanation,
        sourceLabel: raw.sourceLabel,
        sourceUrl: raw.sourceUrl
      });
    });
  }

  function expandClues(topic, count, facts) {
    const raw = [];
    const openings = [
      (fact) => `Which answer fits this clue? ${fact.clue}`,
      (fact) => `${fact.clue} What is the answer?`,
      (fact) => `Complete this ${fact.kind || "trivia"} fact: ${fact.clue} The answer is...`,
      (fact) => `Think carefully about ${fact.subject || topic}: ${fact.clue} Which choice is right?`
    ];
    facts.forEach((fact) => {
      openings.forEach((opening) => raw.push({
        question: opening(fact),
        answer: fact.answer,
        distractors: fact.distractors,
        explanation: fact.explanation,
        sourceLabel: fact.sourceLabel,
        sourceUrl: fact.sourceUrl
      }));
    });
    addTopic(topic, count, raw);
  }

  window.TRIVIA_QUESTIONS = allQuestions;
  window.TRIVIA_BUILDER = { addTopic, expandClues, allowedDifficulties };
}());
