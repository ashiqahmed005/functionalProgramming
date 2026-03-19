/**
 * Transducers
 *
 * The problem: chaining map/filter creates N intermediate arrays.
 *   [1..1M].map(f).filter(g).map(h)  — 3 passes, 3 arrays
 *
 * Transducers compose transformations at the reducer level so
 * the data flows through in a single pass with no intermediates.
 *
 * A transducer is a function that takes a reducer and returns a reducer:
 *   type Reducer<A,B> = (acc: B, item: A) => B
 *   type Transducer    = (Reducer) => Reducer
 */

// ─── BUILDING BLOCKS ─────────────────────────────────────────────────────────

// Standard reducer that appends to an array
const append = (acc, item) => [...acc, item];

// map transducer
const mapping = (fn) => (reducer) => (acc, item) => reducer(acc, fn(item));

// filter transducer
const filtering = (pred) => (reducer) => (acc, item) =>
  pred(item) ? reducer(acc, item) : acc;

// Compose transducers (right to left — same as function compose)
const compose = (...fns) => (x) => fns.reduceRight((v, f) => f(v), x);

// transduce: run a transducer over a collection
const transduce = (transducer, reducer, init, collection) =>
  collection.reduce(transducer(reducer), init);

// ─── EXAMPLES ────────────────────────────────────────────────────────────────

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Traditional (3 array passes):
const resultTraditional = data
  .filter((n) => n % 2 === 0)   // [2,4,6,8,10]
  .map((n) => n * n)             // [4,16,36,64,100]
  .filter((n) => n < 50);       // [4,16,36]

// Transducer (single pass, no intermediates):
const xform = compose(
  filtering((n) => n % 2 === 0),
  mapping((n) => n * n),
  filtering((n) => n < 50)
);

const resultTransducer = transduce(xform, append, [], data);

console.log(resultTraditional); // [4, 16, 36]
console.log(resultTransducer);  // [4, 16, 36]

// Transduce into a SUM instead of an array (same xform, different reducer)
const add = (acc, n) => acc + n;
const sumResult = transduce(xform, add, 0, data);
console.log(sumResult); // 56

// ─── EXERCISES ───────────────────────────────────────────────────────────────

// Exercise 1: Using compose + mapping + filtering, build a transducer that:
//   - keeps strings longer than 3 characters
//   - uppercases them
const words = ["hi", "hello", "yo", "world", "ok", "functional"];

const wordXform = compose(
  // TODO
);

// const result = transduce(wordXform, append, [], words);
// console.log(result); // ["HELLO", "WORLD", "FUNCTIONAL"]

// Exercise 2: Build a `taking` transducer that stops after N items
//   Hint: you'll need a stateful counter (acceptable here since it's internal)
const taking = (n) => (reducer) => {
  let count = 0;
  return (acc, item) => {
    // TODO
  };
};

// const first3evens = transduce(
//   compose(filtering(n => n % 2 === 0), taking(3)),
//   append,
//   [],
//   [1,2,3,4,5,6,7,8,9,10]
// );
// console.log(first3evens); // [2, 4, 6]

// Exercise 3: Implement a `flatMapping` transducer
//   flatMapping(fn)(reducer)(acc, item) — like flatMap but as a transducer
const flatMapping = (fn) => (reducer) => (acc, item) => {
  // TODO: fn(item) returns an array; reduce it into acc using reducer
};

// const result3 = transduce(
//   flatMapping(n => [n, -n]),
//   append,
//   [],
//   [1, 2, 3]
// );
// console.log(result3); // [1, -1, 2, -2, 3, -3]

// ─── ANSWERS (uncomment to check) ────────────────────────────────────────────
// Ex1:
// const wordXform = compose(
//   filtering(s => s.length > 3),
//   mapping(s => s.toUpperCase())
// );

// Ex2:
// const taking = (n) => (reducer) => {
//   let count = 0;
//   return (acc, item) => {
//     if (count >= n) return acc;
//     count++;
//     return reducer(acc, item);
//   };
// };

// Ex3:
// const flatMapping = (fn) => (reducer) => (acc, item) =>
//   fn(item).reduce(reducer, acc);
