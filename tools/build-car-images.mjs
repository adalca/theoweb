import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(import.meta.dirname, "..");
const context = { window: {} };
for (const file of ["data.js", "modern-data.js"]) vm.runInNewContext(await fs.readFile(path.join(root, "cars", file), "utf8"), context);
const cars = context.window.CARS;
const outputDir = path.join(root, "assets", "images", "cars", "models");
await fs.mkdir(outputDir, { recursive: true });
const headers = { "User-Agent": "TheosWebhouse/1.0 (educational website; github.com/adalca/theoweb)" };
const clean = (value) => String(value || "").replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&#039;/g, "'").trim();
const manualAuthors = { "toyota-2000gt":"Gnsin", "porsche-356":"Lothar Spurzem" };
const api = async (host, params) => {
  const url = new URL(`https://${host}/w/api.php`);
  Object.entries({ ...params, format:"json", formatversion:"2", origin:"*" }).forEach(([key, value]) => url.searchParams.set(key, value));
  let response;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    response = await fetch(url, { headers });
    if (response.status !== 429) break;
    await new Promise((resolve) => setTimeout(resolve, 1500 * (attempt + 1)));
  }
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.json();
};
const extension = (url) => {
  const match = new URL(url).pathname.match(/\.(jpe?g|png|webp)(?:\/|$)/i);
  return match ? `.${match[1].toLowerCase().replace("jpeg", "jpg")}` : ".jpg";
};

const entries = {};
const chunk = (items, size) => items.reduce((groups, item, index) => { if (index % size === 0) groups.push([]); groups.at(-1).push(item); return groups; }, []);
const wikiPages = new Map();
for (const group of chunk(cars, 40)) {
  const result = await api("en.wikipedia.org", { action:"query", titles:group.map((car) => car.wikiTitle).join("|"), redirects:"1", prop:"pageimages", piprop:"thumbnail|name", pithumbsize:"640" });
  const aliases = new Map();
  [...(result.query.normalized || []), ...(result.query.redirects || [])].forEach((item) => aliases.set(item.from, item.to));
  const resolve = (title) => { let value = title.replaceAll("_", " "); while (aliases.has(value)) value = aliases.get(value); return value; };
  result.query.pages.forEach((page) => wikiPages.set(page.title, page));
  group.forEach((car) => { car._wikiPage = wikiPages.get(resolve(car.wikiTitle)); });
}
const commonsPages = new Map();
const fileTitles = cars.map((car) => `File:${car._wikiPage?.pageimage}`).filter((title) => !title.endsWith("undefined"));
for (const group of chunk(fileTitles, 40)) {
  const result = await api("commons.wikimedia.org", { action:"query", titles:group.join("|"), prop:"imageinfo", iiprop:"url|extmetadata", iiurlwidth:"640" });
  result.query.pages.forEach((page) => commonsPages.set(page.title.replaceAll(" ", "_"), page));
}
for (const [index, car] of cars.entries()) {
  const page = car._wikiPage;
  if (!page?.pageimage || !page?.thumbnail?.source) throw new Error(`No lead image for ${car.slug} (${car.wikiTitle})`);
  const filePage = commonsPages.get(`File:${page.pageimage}`);
  const info = filePage?.imageinfo?.[0];
  const imageUrl = info?.thumburl || page.thumbnail.source;
  const ext = extension(imageUrl);
  const filename = `${car.slug}${ext}`;
  const meta = info?.extmetadata || {};
  let response;
  try {
    await fs.access(path.join(outputDir, filename));
  } catch {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      response = await fetch(imageUrl, { headers });
      if (response.status !== 429) break;
      await new Promise((resolve) => setTimeout(resolve, 5000 * (attempt + 1)));
    }
  }
  if (!response) {
    entries[car.slug] = {
      src:`../assets/images/cars/models/${filename}`,
      alt:`A ${car.name} photographed from outside`,
      author:clean(meta.Artist?.value) || manualAuthors[car.slug] || "Wikimedia Commons contributor",
      license:clean(meta.LicenseShortName?.value) || "See image page",
      licenseUrl:meta.LicenseUrl?.value || info?.descriptionurl || `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(page.pageimage)}`,
      page:info?.descriptionurl || `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(page.pageimage)}`
    };
    process.stdout.write(`[${index + 1}/${cars.length}] ${car.slug} (cached)\n`);
    continue;
  }
  if (!response.ok) throw new Error(`Could not download ${car.slug}: ${response.status}`);
  await fs.writeFile(path.join(outputDir, filename), Buffer.from(await response.arrayBuffer()));
  entries[car.slug] = {
    src:`../assets/images/cars/models/${filename}`,
    alt:`A ${car.name} photographed from outside`,
    author:clean(meta.Artist?.value) || manualAuthors[car.slug] || "Wikimedia Commons contributor",
    license:clean(meta.LicenseShortName?.value) || "See image page",
    licenseUrl:meta.LicenseUrl?.value || info?.descriptionurl || `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(page.pageimage)}`,
    page:info?.descriptionurl || `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(page.pageimage)}`
  };
  process.stdout.write(`[${index + 1}/${cars.length}] ${car.slug}\n`);
  await new Promise((resolve) => setTimeout(resolve, 600));
}

await fs.writeFile(path.join(root, "cars", "image-data.js"), `(function () {\n  window.CAR_IMAGES = ${JSON.stringify(entries, null, 2)};\n}());\n`);
