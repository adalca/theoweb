import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the child-friendly home menu", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<title>Theo&#x27;s Clubhouse<\/title>/i);
  assert.match(html, /Soccer scores/);
  assert.match(html, /href="\/soccer"/);
  assert.match(html, /⚽/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("server-renders the complete tournament archive", async () => {
  const response = await render("/soccer");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /FIFA World Cup 2026/);
  assert.match(html, /UEFA EURO 2024/);
  assert.match(html, /Copa América 1916/);
  assert.match(html, /world-cup-2026/);
});

test("data includes all editions and match results", async () => {
  const tournaments = JSON.parse(await readFile(new URL("../app/soccer/tournaments.json", import.meta.url), "utf8"));
  assert.equal(tournaments.length, 88);
  assert.equal(tournaments.filter((item) => item.competition === "world-cup").length, 23);
  assert.equal(tournaments.filter((item) => item.competition === "euro").length, 17);
  assert.equal(tournaments.filter((item) => item.competition === "copa-america").length, 48);
  assert.equal(tournaments.find((item) => item.slug === "world-cup-2026").matches.length, 104);
  assert.ok(tournaments.some((item) => item.matches.some((match) => match.redCard)));
});
