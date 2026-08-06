import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(import.meta.dirname, "..");
const context = { window: {} };
for (const file of ["cars/data.js", "cars/modern-data.js", "cars/image-data.js"]) vm.runInNewContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename:file });
const { CARS:cars, CAR_IMAGES:images, CAR_MANUFACTURERS:makers } = context.window;
const required = ["slug","make","name","era","year","trim","type","seats","interior","size","power","horsepower","drivetrain","topSpeed","acceleration","fuel","safety","coolFact"];
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const directoryHtml = fs.readFileSync(path.join(root, "cars/index.html"), "utf8");
const compareHtml = fs.readFileSync(path.join(root, "cars/compare.html"), "utf8");
const compareScript = fs.readFileSync(path.join(root, "cars/compare.js"), "utf8");
assert(makers.length === 12, `Expected 12 manufacturers, found ${makers.length}`);
assert(cars.length === 144, `Expected 144 cars, found ${cars.length}`);
assert(new Set(cars.map((car) => car.slug)).size === 144, "Car slugs must be unique");
assert(Object.keys(images).length === 144, `Expected 144 image records, found ${Object.keys(images).length}`);
assert(/class="car-compare-cta" href="compare\.html"/.test(directoryHtml), "Cars directory is missing the Compare link");
assert(compareHtml.includes('id="compare-car-one"') && compareHtml.includes('id="compare-car-two"'), "Compare page is missing its selectors");
assert(compareHtml.includes('src="compare.js"'), "Compare page is missing its script");
assert(compareScript.includes("window.CARS") && compareScript.includes("window.CAR_MANUFACTURERS") && compareScript.includes("window.CAR_IMAGES"), "Compare page must reuse the shared car datasets");
assert(compareScript.includes('next.set("car1"') && compareScript.includes('next.set("car2"'), "Compare page is missing shareable URL state");
for (const maker of makers) {
  const group = cars.filter((car) => car.make === maker.slug);
  assert(group.length === 12, `${maker.name} has ${group.length} cars`);
  assert(group.filter((car) => car.era === "current").length === 8, `${maker.name} current count is wrong`);
  assert(group.filter((car) => car.era === "historic").length === 4, `${maker.name} history count is wrong`);
}
for (const car of cars) {
  required.forEach((key) => assert(String(car[key] || "").trim(), `${car.slug} is missing ${key}`));
  assert(Array.isArray(car.sources) && car.sources.length, `${car.slug} has no sources`);
  car.sources.forEach((source) => assert(/^https:\/\//.test(source.url), `${car.slug} has an invalid source URL`));
  const image = images[car.slug];
  assert(image, `${car.slug} has no image metadata`);
  ["src","alt","author","license","licenseUrl","page"].forEach((key) => assert(String(image[key] || "").trim(), `${car.slug} image is missing ${key}`));
  assert(!/Wikimedia Commons contributor|See image page/.test(`${image.author} ${image.license}`), `${car.slug} has fallback attribution`);
  const localPath = path.resolve(root, "cars", image.src);
  assert(fs.existsSync(localPath), `${car.slug} image file is missing`);
  assert(fs.statSync(localPath).size > 5000, `${car.slug} image file looks incomplete`);
}
console.log(`Cars validation passed: ${makers.length} manufacturers, ${cars.length} cars, ${Object.keys(images).length} credited images.`);
