/**
 * Function Composition & Pipelines
 *
 * compose(f, g)(x) === f(g(x))   — right to left
 * pipe(f, g)(x)    === g(f(x))   — left to right (more readable)
 */

// --- HELPERS ---

const compose = (...fns) => (x) => fns.reduceRight((acc, fn) => fn(acc), x);
const pipe    = (...fns) => (x) => fns.reduce((acc, fn) => fn(acc), x);

// --- EXAMPLES ---

const trim      = (s) => s.trim();
const toLower   = (s) => s.toLowerCase();
const split     = (sep) => (s) => s.split(sep);
const join      = (sep) => (arr) => arr.join(sep);
const replace   = (from, to) => (s) => s.replace(new RegExp(from, "g"), to);

// Build a slug generator with pipe
const slugify = pipe(
  trim,
  toLower,
  replace(" ", "-"),
  replace("[^a-z0-9-]", "")
);

console.log(slugify("  Hello World! "));  // "hello-world"

// Same thing with compose (reverse order)
const slugifyC = compose(
  replace("[^a-z0-9-]", ""),
  replace(" ", "-"),
  toLower,
  trim
);
console.log(slugifyC("  Hello World! "));  // "hello-world"

// --- REAL-WORLD PATTERN: data pipeline ---

const users = [
  { name: "alice", age: 25, active: true },
  { name: "bob",   age: 17, active: false },
  { name: "carol", age: 32, active: true },
  { name: "dave",  age: 15, active: true },
];

const isActive  = (u) => u.active;
const isAdult   = (u) => u.age >= 18;
const getName   = (u) => u.name;
const capitalize = (s) => s[0].toUpperCase() + s.slice(1);

const getActiveAdultNames = pipe(
  (users) => users.filter(isActive),
  (users) => users.filter(isAdult),
  (users) => users.map(getName),
  (names) => names.map(capitalize)
);

console.log(getActiveAdultNames(users)); // ["Alice", "Carol"]

// --- EXERCISES ---

// Exercise 1: Using pipe, build a function that:
//   - trims a string
//   - splits by comma
//   - maps each item to trimmed+lowercase
//   - filters out empty strings
const parseCSVLine = pipe(
  // TODO: fill in the steps
);

// console.log(parseCSVLine("  Alice , BOB ,  , Carol  "));
// Expected: ["alice", "bob", "carol"]

// Exercise 2: Using compose or pipe, build a number pipeline:
//   double → subtract 1 → square
const double   = (n) => n * 2;
const subOne   = (n) => n - 1;
const sq       = (n) => n * n;

const transform = /* pipe or compose */ null;
// console.log(transform(3)); // double(3)=6, subOne=5, sq=25  → 25

// Exercise 3: compose these string transforms into a single `normalize` function
const removeAccents = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const collapseSpaces = (s) => s.replace(/\s+/g, " ");

const normalize = /* your code here */ null;
// console.log(normalize("  Héllo   Wörld  ")); // "Hello World"

// --- ANSWERS (uncomment to check) ---
// Ex1:
// const parseCSVLine = pipe(
//   (s) => s.trim(),
//   (s) => s.split(","),
//   (arr) => arr.map((s) => s.trim().toLowerCase()),
//   (arr) => arr.filter(Boolean)
// );

// Ex2:
// const transform = pipe(double, subOne, sq);
// console.log(transform(3)); // 25

// Ex3:
// const normalize = pipe(trim, collapseSpaces, removeAccents);
// console.log(normalize("  Héllo   Wörld  ")); // "Hello World"
