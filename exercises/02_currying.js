/**
 * Currying & Partial Application
 *
 * Currying: transform f(a, b, c) → f(a)(b)(c)
 * Partial Application: pre-fill some arguments, return a function for the rest
 */

// --- CURRYING ---

// Regular function
const add = (a, b) => a + b;

// Curried version
const curriedAdd = (a) => (b) => a + b;

const add5 = curriedAdd(5); // partial application
console.log(add5(3));  // 8
console.log(add5(10)); // 15

// Generic curry helper (works for any arity)
const curry = (fn) => {
  const arity = fn.length;
  return function curried(...args) {
    if (args.length >= arity) {
      return fn(...args);
    }
    return (...moreArgs) => curried(...args, ...moreArgs);
  };
};

// --- EXAMPLES ---

const multiply = curry((a, b, c) => a * b * c);
const double = multiply(2, 1);   // waits for c
const triple = multiply(3, 1);   // waits for c
console.log(double(5));  // 10
console.log(triple(5));  // 15

const curriedFilter = curry((pred, arr) => arr.filter(pred));
const getEvens = curriedFilter((n) => n % 2 === 0);
console.log(getEvens([1, 2, 3, 4, 5, 6])); // [2, 4, 6]

// --- EXERCISES ---

// Exercise 1: Curry this function
const volume = (l, w, h) => l * w * h;
// TODO: write curriedVolume so that curriedVolume(2)(3)(4) === 24
const curriedVolume = /* your code here */ null;

// Exercise 2: Use the curry helper to create a reusable 'power' function
const power = curry((base, exp) => base ** exp);
// TODO: create `square` and `cube` using power
const square = /* your code here */ null;
const cube   = /* your code here */ null;

// Exercise 3: Curry this logger
const log = (level, timestamp, message) => `[${level}] ${timestamp}: ${message}`;
// TODO: create curriedLog, then create an `errorLog` pre-filled with level="ERROR"
const curriedLog = /* your code here */ null;
const errorLog   = /* your code here */ null;

// --- ANSWERS (uncomment to check) ---
// Ex1:
// const curriedVolume = (l) => (w) => (h) => l * w * h;
// console.log(curriedVolume(2)(3)(4)); // 24

// Ex2:
// const square = power(2);  // Hmm — power(base, exp) so this is base=2...
// Actually: const square = (n) => power(n)(2);
// Or redefine: const power = curry((exp, base) => base ** exp);
// const square = power(2);
// const cube   = power(3);
// console.log(square(5)); // 25
// console.log(cube(3));   // 27

// Ex3:
// const curriedLog = curry(log);
// const errorLog   = curriedLog("ERROR");
// console.log(errorLog("2026-03-18")("Something broke")); // [ERROR] 2026-03-18: Something broke
