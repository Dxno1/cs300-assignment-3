// Assignment 3: verification harness. Run it with: node harness.js
// Expected values were worked out by hand from data/books.json (total 1410, 8 books).
import {
  validateRecord,
  normalizeRecord,
  filterRecords,
  searchRecords,
  sortRecords,
  summarizeRecords,
  buildReport,
} from "./toolkit.js";
import { readFileSync } from "node:fs";

const load = (file) => JSON.parse(readFileSync(`data/${file}`, "utf8"));
const books = load("books.json");
const boundary = load("boundary-records.json");
const empty = load("empty.json");
const incomplete = load("incomplete.json");

let passed = 0;
let failed = 0;

function check(name, expected, actual) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (ok) passed++;
  else failed++;
  console.log(
    `${ok ? "PASS" : "FAIL"}  ${name}  expected: ${JSON.stringify(expected)}  actual: ${JSON.stringify(actual)}`
  );
}

const titles = (list) => list.map((record) => record.title);

// ---- Normal inputs ----
check("search 'robot' finds Robot Garden", ["Robot Garden"], titles(searchRecords(books, "robot")));
check("search 'mina' finds Robot Garden via creator", ["Robot Garden"], titles(searchRecords(books, "mina")));
check(
  "filter category Art returns 2 books",
  ["River Sketches", "Paper Worlds"],
  titles(filterRecords(books, (book) => book.category === "Art"))
);
check(
  "sort by minutes, smallest first",
  [
    "Cloud Atlas Practice", "Trail Notes", "Small City Stories", "Paper Worlds",
    "River Sketches", "Night Orchard", "Quiet Satellites", "Robot Garden",
  ],
  titles(sortRecords(books, "minutes"))
);
check("summary total and count", { count: 8, totalMinutes: 1410 }, (({ count, totalMinutes }) => ({ count, totalMinutes }))(summarizeRecords(books)));
check("summary average, min, max", [176.25, 90, 240], (({ averageMinutes: a, minMinutes: lo, maxMinutes: hi }) => [a, lo, hi])(summarizeRecords(books)));
check(
  "summary counts by category",
  { "Science fiction": 2, Art: 2, Fiction: 2, Nature: 2 },
  summarizeRecords(books).countByCategory
);
check(
  "report for 'art' combines search, sort, summarize",
  { matches: 2, titles: ["Paper Worlds", "River Sketches"], total: 360 },
  (({ matches, titles: t, summary }) => ({ matches, titles: t, total: summary.totalMinutes }))(buildReport(books, "art"))
);

// ---- Edge case 1: empty array ----
check(
  "empty array summary: count 0, total 0, average null (not NaN)",
  { count: 0, totalMinutes: 0, averageMinutes: null },
  (({ count, totalMinutes, averageMinutes }) => ({ count, totalMinutes, averageMinutes }))(summarizeRecords(empty))
);
check("empty array search returns []", [], searchRecords(empty, "robot"));

// ---- Edge case 2: missing property ----
check(
  "missing title is reported, not a crash",
  { valid: false, errors: ["title is missing"] },
  validateRecord(boundary[0])
);
check(
  "incomplete record lists every missing property",
  { valid: false, errors: ["creator is missing", "category is missing", "minutes is missing"] },
  validateRecord(incomplete[0])
);

// ---- Edge case 3: invalid number / wrong type ----
check(
  "minutes 'thirty' is reported",
  { valid: false, errors: ["minutes must be a number"] },
  validateRecord(boundary[1])
);
check(
  "'thirty' is never added to a total (30 + 240 valid, 1 skipped)",
  { totalMinutes: 270, skippedRecords: 1, averageMinutes: 135 },
  (({ totalMinutes, skippedRecords, averageMinutes }) => ({ totalMinutes, skippedRecords, averageMinutes }))(summarizeRecords(boundary))
);

// ---- Edge case 4: capitalization ----
check("'ROBOT' finds the same as 'robot'", titles(searchRecords(books, "robot")), titles(searchRecords(books, "ROBOT")));
check("'Robot' finds the same as 'robot'", titles(searchRecords(books, "robot")), titles(searchRecords(books, "Robot")));

// ---- Edge case 5: equal values when sorting ----
check(
  "240-minute tie: alphabetical by title (Quiet Satellites, Robot Garden)",
  ["Quiet Satellites", "Robot Garden"],
  titles(sortRecords(books, "minutes").slice(-2))
);
check(
  "180-minute tie: alphabetical by title (Paper Worlds, River Sketches)",
  ["Paper Worlds", "River Sketches"],
  titles(sortRecords(books, "minutes").slice(3, 5))
);

// ---- Normalizing ----
check(
  "normalize trims text and fixes category style",
  { id: "trim-case", title: "ROBOT GARDEN", creator: "Mina Reed", category: "Science fiction", minutes: 240 },
  normalizeRecord(boundary[2])
);

// ---- Nonmutation ----
{
  const before = JSON.stringify(books);
  sortRecords(books, "minutes");
  searchRecords(books, "robot");
  summarizeRecords(books);
  check("sorting/searching/summarizing leave the books array unchanged", true, JSON.stringify(books) === before);
}
{
  const before = JSON.stringify(boundary[2]);
  normalizeRecord(boundary[2]);
  check("normalizing leaves the original record unchanged", true, JSON.stringify(boundary[2]) === before);
}

console.log(`\n${passed} passed, ${failed} failed, ${passed + failed} total`);
if (failed > 0) process.exitCode = 1;