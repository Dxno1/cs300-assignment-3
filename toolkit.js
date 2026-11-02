// Assignment 3: JavaScript Data Toolkit (Book Collection)
//
// Decisions made before writing the code:
//   - Validation errors: { valid: boolean, errors: string[] }, one plain sentence per problem.
//   - Required text properties: id, title, creator, category (non-empty strings).
//   - minutes must be a finite whole number that is 0 or more.
//   - Tie rule for sorting: equal values are ordered alphabetically by title.
//   - Empty-collection average: null (never NaN).
//   - Records with invalid minutes are skipped in totals and counted in "skippedRecords".

const TEXT_PROPERTIES = ["id", "title", "creator", "category"];

// Takes: one record (object). Returns: { valid, errors } where errors lists every problem found.
// Does not change its input.
export function validateRecord(record) {
  const errors = [];

  if (record === null || typeof record !== "object" || Array.isArray(record)) {
    return { valid: false, errors: ["record must be an object"] };
  }

  for (const property of TEXT_PROPERTIES) {
    if (!(property in record) || record[property] === undefined || record[property] === null) {
      errors.push(`${property} is missing`);
    } else if (typeof record[property] !== "string") {
      errors.push(`${property} must be text`);
    } else if (record[property].trim() === "") {
      errors.push(`${property} must not be empty`);
    }
  }

  if (!("minutes" in record) || record.minutes === undefined || record.minutes === null) {
    errors.push("minutes is missing");
  } else if (typeof record.minutes !== "number" || !Number.isFinite(record.minutes)) {
    errors.push("minutes must be a number");
  } else if (!Number.isInteger(record.minutes) || record.minutes < 0) {
    errors.push("minutes must be a whole number of 0 or more");
  }

  return { valid: errors.length === 0, errors };
}

// Takes: one record. Returns: a NEW record with text trimmed and category in one style
// (first letter capital, rest lowercase, like "Science fiction"). Other properties are copied.
// Does not change the original record.
export function normalizeRecord(record) {
  const copy = { ...record };
  for (const property of ["id", "title", "creator", "description"]) {
    if (typeof copy[property] === "string") copy[property] = copy[property].trim();
  }
  if (typeof copy.category === "string") {
    const category = copy.category.trim().toLowerCase();
    copy.category = category.charAt(0).toUpperCase() + category.slice(1);
  }
  return copy;
}

// Takes: an array of records and a function (record) => true/false. Returns: a new array of the
// records for which the function returned true, in their original order.
// Uses filter because the job is "keep some, drop the rest". Does not change the input array.
export function filterRecords(records, condition) {
  return records.filter(condition);
}

// Takes: an array of records and a search string. Returns: a new array of records whose title,
// creator, or category contains the string, ignoring capitalization and outer spaces.
// An empty search returns every record. Missing or non-text properties simply do not match.
// Does not change the input array.
export function searchRecords(records, query) {
  const needle = String(query ?? "").trim().toLowerCase();
  if (needle === "") return [...records];
  const properties = ["title", "creator", "category"];
  // some stops as soon as one property matches
  return records.filter((record) =>
    properties.some(
      (property) =>
        typeof record[property] === "string" && record[property].toLowerCase().includes(needle)
    )
  );
}

// Takes: an array of records and a property name such as "minutes" or "title".
// Returns: a NEW array sorted smallest to largest (numbers by value, text A to Z, ignoring case).
// Ties are broken alphabetically by title. Does not change the input array.
export function sortRecords(records, property) {
  const compareValues = (a, b) => {
    if (typeof a === "number" && typeof b === "number") return a - b;
    return String(a ?? "").localeCompare(String(b ?? ""), "en", { sensitivity: "base" });
  };
  return [...records].sort((a, b) => {
    const primary = compareValues(a[property], b[property]);
    return primary !== 0 ? primary : compareValues(a.title, b.title);
  });
}

// Takes: an array of records. Returns: { count, skippedRecords, totalMinutes, averageMinutes,
// minMinutes, maxMinutes, countByCategory }. Only records with a valid minutes number add to the
// totals; others are counted in skippedRecords. An empty array gives count 0 and null for the
// average, min, and max. Does not change the input array.
export function summarizeRecords(records) {
  const valid = records.filter(
    (record) => typeof record.minutes === "number" && Number.isFinite(record.minutes)
  );
  // reduce turns many numbers into one total
  const totalMinutes = valid.reduce((sum, record) => sum + record.minutes, 0);
  const countByCategory = records.reduce((counts, record) => {
    const category = typeof record.category === "string" ? record.category : "Unknown";
    counts[category] = (counts[category] ?? 0) + 1;
    return counts;
  }, {});
  const minutesList = valid.map((record) => record.minutes);

  return {
    count: records.length,
    skippedRecords: records.length - valid.length,
    totalMinutes,
    averageMinutes: valid.length === 0 ? null : totalMinutes / valid.length,
    minMinutes: valid.length === 0 ? null : Math.min(...minutesList),
    maxMinutes: valid.length === 0 ? null : Math.max(...minutesList),
    countByCategory,
  };
}

// Takes: an array of records and a search string. Returns: { query, matches, titles, summary }
// where matches is the number of records found, titles lists them sorted by minutes, and summary
// is summarizeRecords of the matches. Combines searchRecords, sortRecords, and summarizeRecords.
// Does not change the input array.
export function buildReport(records, query) {
  const found = searchRecords(records, query);
  const ordered = sortRecords(found, "minutes");
  return {
    query,
    matches: found.length,
    titles: ordered.map((record) => record.title),
    summary: summarizeRecords(found),
  };
}