import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readOutput = (path) =>
  readFile(new URL(`../dist/${path}`, import.meta.url), "utf8");

test("homepage contains the required public sections", async () => {
  const html = await readOutput("index.html");

  assert.match(html, /<main id="main-content"/);
  assert.match(html, /Nikolaos Banis/);
  assert.match(html, /Experience/);
  assert.match(html, /Selected work/);
  assert.doesNotMatch(html, /playground-sidebar/);
});

test("playground is internal and documents shared foundations", async () => {
  const html = await readOutput("playground/index.html");

  assert.match(html, /noindex, nofollow/);
  assert.match(html, /Design library/);
  assert.match(html, /Typography/);
  assert.match(html, /Iconography/);
});

test("playground is excluded from the sitemap", async () => {
  const sitemap = await readOutput("sitemap-0.xml");

  assert.match(sitemap, /https:\/\/www\.nikosbanis\.com\//);
  assert.doesNotMatch(sitemap, /playground/);
});
