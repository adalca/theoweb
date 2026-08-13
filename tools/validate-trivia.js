/* Run with: node tools/validate-trivia.js */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const context = { window: {} };
vm.createContext(context);
[
  "cars/data.js",
  "dinosaurs/data.js",
  "trucks/data.js",
  "trivia/builder.js",
  "trivia/data/world.js",
  "trivia/data/space.js",
  "trivia/data/cars.js",
  "trivia/data/dinosaurs.js",
  "trivia/data/stories.js",
  "trivia/data/soccer.js",
  "trivia/data/trucks.js",
  "trivia/deck.js"
].forEach((file) => vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file }));

const questions = context.window.TRIVIA_QUESTIONS;
const expected = { world: 143, space: 143, cars: 143, dinosaurs: 143, stories: 142, soccer: 143, trucks: 143 };
const errors = [];
const ids = new Set();
const prompts = new Set();
if (questions.length !== 1000) errors.push(`Expected 1000 questions, found ${questions.length}.`);
Object.entries(expected).forEach(([topic, count]) => {
  const found = questions.filter((item) => item.topic === topic).length;
  if (found !== count) errors.push(`${topic}: expected ${count}, found ${found}.`);
});
questions.forEach((item, index) => {
  if (ids.has(item.id)) errors.push(`Duplicate id: ${item.id}`); ids.add(item.id);
  const normalized = item.question.trim().toLowerCase();
  if (prompts.has(normalized)) errors.push(`Duplicate prompt: ${item.question}`); prompts.add(normalized);
  if (!["easy", "standard", "challenge"].includes(item.difficulty)) errors.push(`${item.id}: invalid difficulty.`);
  if (!Array.isArray(item.choices) || item.choices.length < 2 || item.choices.length > 5) errors.push(`${item.id}: choices must contain 2–5 items.`);
  if (new Set(item.choices).size !== item.choices.length) errors.push(`${item.id}: duplicate choices.`);
  if (!Number.isInteger(item.correctIndex) || !item.choices[item.correctIndex]) errors.push(`${item.id}: invalid correctIndex.`);
  ["explanation", "sourceLabel", "sourceUrl"].forEach((key) => { if (!item[key]) errors.push(`${item.id}: missing ${key}.`); });
  if (!item.question || index > 1000) errors.push(`${item.id}: invalid question.`);
});

Object.keys(expected).concat("all").forEach((topic) => {
  const pool = topic === "all" ? questions : questions.filter((item) => item.topic === topic);
  const deck = context.window.TRIVIA_DECK.buildDeck(pool, () => 0.417);
  if (deck.length !== pool.length || new Set(deck.map((item) => item.id)).size !== pool.length) errors.push(`${topic}: deck repeats or loses questions.`);
});

questions.slice(0, 100).forEach((question, index) => {
  const shuffled = context.window.TRIVIA_DECK.shuffledChoices(question, () => ((index * 37 + 19) % 101) / 101);
  if (shuffled.length !== question.choices.length || shuffled.filter((choice) => choice.correct).length !== 1) errors.push(`${question.id}: answer shuffling broke the choices.`);
});

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("Trivia validation passed: 1,000 unique questions across 7 topic banks; schemas and decks are valid.");
