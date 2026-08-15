(function () {
  "use strict";

  const topicNames = {
    all: "Surprise Mix",
    world: "Countries & regions",
    space: "Space & rockets",
    cars: "Cars",
    dinosaurs: "Dinosaurs",
    stories: "Hotel Flamingo",
    soccer: "World Cup soccer",
    bluey: "Bluey",
    trucks: "Trucks & machines"
  };
  const difficultyNames = { easy: "Warm-up", standard: "Think it through", challenge: "Big challenge" };
  const topicScreen = document.getElementById("topic-screen");
  const quizScreen = document.getElementById("quiz-screen");
  const errorScreen = document.getElementById("trivia-error");
  const questionText = document.getElementById("question-text");
  const answerList = document.getElementById("answer-list");
  const feedback = document.getElementById("feedback");
  const feedbackTitle = document.getElementById("feedback-title");
  const feedbackFact = document.getElementById("feedback-fact");
  const nextButton = document.getElementById("next-question");
  let selectedTopic = "all";
  let deck = [];
  let position = 0;
  let currentQuestion = null;

  function fail() {
    topicScreen.hidden = true;
    quizScreen.hidden = true;
    errorScreen.hidden = false;
  }

  function refillDeck() {
    const pool = selectedTopic === "all"
      ? window.TRIVIA_QUESTIONS
      : window.TRIVIA_QUESTIONS.filter((item) => item.topic === selectedTopic);
    deck = window.TRIVIA_DECK.buildDeck(pool);
    position = 0;
  }

  function showQuestion() {
    if (position >= deck.length) refillDeck();
    currentQuestion = deck[position];
    position += 1;
    questionText.textContent = currentQuestion.question;
    document.getElementById("difficulty-label").textContent = difficultyNames[currentQuestion.difficulty];
    answerList.replaceChildren();
    feedback.hidden = true;
    window.TRIVIA_DECK.shuffledChoices(currentQuestion).forEach((choice, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "answer-button";
      button.dataset.correct = String(choice.correct);
      button.innerHTML = `<span>${String.fromCharCode(65 + index)}</span><strong></strong>`;
      button.querySelector("strong").textContent = choice.label;
      button.addEventListener("click", chooseAnswer);
      answerList.appendChild(button);
    });
    questionText.focus({ preventScroll: true });
  }

  function chooseAnswer(event) {
    const chosen = event.currentTarget;
    const isCorrect = chosen.dataset.correct === "true";
    answerList.querySelectorAll("button").forEach((button) => {
      button.disabled = true;
      if (button.dataset.correct === "true") button.classList.add("is-correct");
    });
    if (!isCorrect) chosen.classList.add("is-wrong");
    feedbackTitle.textContent = isCorrect ? "You got it!" : "Good try!";
    feedbackTitle.className = `feedback-title ${isCorrect ? "correct" : "try-again"}`;
    feedbackFact.textContent = currentQuestion.explanation;
    feedback.hidden = false;
    nextButton.focus({ preventScroll: true });
  }

  function start(topic) {
    selectedTopic = topic;
    document.getElementById("current-topic").textContent = topicNames[topic];
    topicScreen.hidden = true;
    quizScreen.hidden = false;
    refillDeck();
    showQuestion();
  }

  function showTopics() {
    quizScreen.hidden = true;
    topicScreen.hidden = false;
    document.querySelector("[data-topic='all']").focus({ preventScroll: true });
  }

  if (!window.TRIVIA_QUESTIONS || window.TRIVIA_QUESTIONS.length !== 1301 || !window.TRIVIA_DECK) {
    fail();
    return;
  }

  document.querySelectorAll("[data-topic]").forEach((button) => {
    button.addEventListener("click", () => start(button.dataset.topic));
    button.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        start(button.dataset.topic);
      }
    });
  });
  document.getElementById("change-topic").addEventListener("click", showTopics);
  nextButton.addEventListener("click", showQuestion);
}());
