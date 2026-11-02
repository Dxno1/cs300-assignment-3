# Assignment 3: Provided Toolkit Scenarios

Pick one scenario and use its dataset.

All four are fictional practice collections, not real clients, so there is nothing to research and no one to interview. Every scenario uses the same requirements and rubric.

Every dataset holds eight records with the same six properties:

| Property | What it holds |
| --- | --- |
| `id` | A unique text id, such as `books-01` |
| `title` | The record's name |
| `creator` | The author, organizer, or maker |
| `category` | A group name, such as Art or Study |
| `minutes` | A fictional estimated time, always a whole number of 0 or more |
| `description` | One sentence about the record |

Use the eight supplied records. Each dataset deliberately includes records with equal `minutes`, so you can test how your sort handles ties. Decide your tie rule (for example, alphabetical by title) and the shape of your validation errors before you write the seven functions.

Three more files in `data/` are test inputs for edge cases, not extra collections:

- [boundary-records.json](data/boundary-records.json): a record with no `title`, a record with `minutes: "thirty"`, and a record with extra spaces and a lowercase category, for validation and normalization.
- [empty.json](data/empty.json): an empty array.
- [incomplete.json](data/incomplete.json): a record with only an `id` and a `title`.

## Book Collection (Recommended)

- Who uses it: Mina, a fictional library helper organizing practice books.
- Goal: Find matching books, arrange them by estimated reading time, and summarize the collection.
- Data: [Eight fictional books](data/books.json).
- Suggested operations: filter by category; search title and creator; sort by minutes; summarize total or average minutes; combine search or filter with the summary.
- Checks to start with: "robot", "Robot", and "ROBOT" all find Robot Garden; "mina" finds it through its creator; the total of all minutes is 1410; Robot Garden and Quiet Satellites tie at 240 minutes.

## Activity Collection

- Who uses it: Leo, a volunteer organizing fictional club activities.
- Goal: Find matching activities and compare their durations.
- Data: [Eight fictional activities](data/events.json). The `creator` property holds the organizing club.
- Suggested operations: filter the Study activities; search title and creator; sort by minutes; report counts by category or total minutes.
- Checks to start with: filtering the Study category returns 3 activities; "river" finds the three River Club activities; Sketch Walk and HTML Study Circle tie at 60 minutes.

## Game Collection

- Who uses it: Ren, a hobby-club organizer choosing fictional games.
- Goal: Find games by title or creator and compare estimated playing time.
- Data: [Eight fictional games](data/games.json).
- Suggested operations: filter by category; search title and creator; sort by minutes; summarize average playing time.
- Checks to start with: sorting by minutes puts Cloud Cards (15) first; filtering the Puzzle category returns 3 games; River Routes and City Builder Practice tie at 60 minutes.

## Practice-Resource Collection

- Who uses it: Jordan, a fictional peer helper organizing practice resources.
- Goal: Search resources, compare estimated practice time, and summarize the collection.
- Data: [Eight fictional resources](data/resources.json).
- Suggested operations: filter by category; search title and creator; sort by minutes; summarize count, total, or average practice time.
- Checks to start with: the total of all minutes is 290; filtering the Web category returns 3 resources; "css" finds CSS Grid Notes; HTML Reference Practice and Reading Journal Guide tie at 20 minutes.
