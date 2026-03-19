/**
 * Maybe & Either — Functional Error Handling
 *
 * Instead of null checks or try/catch scattered everywhere,
 * we wrap values in containers that handle failure gracefully.
 *
 * Maybe: handles null/undefined (Nothing | Just)
 * Either: handles errors with context (Left=error | Right=success)
 */

// ─── MAYBE ───────────────────────────────────────────────────────────────────

class Maybe {
  constructor(value) {
    this._value = value;
  }

  static of(value) {
    return new Maybe(value);
  }

  isNothing() {
    return this._value === null || this._value === undefined;
  }

  // Transform the value inside; if Nothing, skip
  map(fn) {
    return this.isNothing() ? this : Maybe.of(fn(this._value));
  }

  // Unwrap with a default
  getOrElse(defaultValue) {
    return this.isNothing() ? defaultValue : this._value;
  }

  toString() {
    return this.isNothing() ? "Nothing" : `Just(${JSON.stringify(this._value)})`;
  }
}

// Example: safe property access
const getUser = (id) =>
  id === 1 ? { name: "Alice", address: { city: "NYC" } } : null;

const getCity = (id) =>
  Maybe.of(getUser(id))
    .map((u) => u.address)
    .map((a) => a.city)
    .getOrElse("Unknown");

console.log(getCity(1)); // "NYC"
console.log(getCity(99)); // "Unknown"  — no crash!

// ─── EITHER ──────────────────────────────────────────────────────────────────

class Left {
  constructor(value) { this._value = value; }
  map(_fn)          { return this; }           // skip on error
  chain(_fn)        { return this; }
  getOrElse(def)    { return def; }
  fold(leftFn, _rightFn) { return leftFn(this._value); }
  toString()        { return `Left(${JSON.stringify(this._value)})`; }
}

class Right {
  constructor(value) { this._value = value; }
  map(fn)           { return Either.of(fn(this._value)); }
  chain(fn)         { return fn(this._value); }
  getOrElse(_def)   { return this._value; }
  fold(_leftFn, rightFn) { return rightFn(this._value); }
  toString()        { return `Right(${JSON.stringify(this._value)})`; }
}

const Either = {
  of: (value) => new Right(value),
  left:  (value) => new Left(value),
  right: (value) => new Right(value),
  fromNullable: (value) =>
    value !== null && value !== undefined ? new Right(value) : new Left(null),
  tryCatch: (fn) => {
    try {
      return new Right(fn());
    } catch (e) {
      return new Left(e.message);
    }
  },
};

// Example: parsing JSON safely
const parseJSON = (str) =>
  Either.tryCatch(() => JSON.parse(str));

console.log(parseJSON('{"name":"Bob"}').map((o) => o.name).getOrElse("parse error")); // "Bob"
console.log(parseJSON("not json").map((o) => o.name).getOrElse("parse error"));       // "parse error"

// Example: validation pipeline
const validateAge = (age) =>
  age >= 0 && age <= 120
    ? Either.right(age)
    : Either.left(`Invalid age: ${age}`);

const validateName = (name) =>
  name && name.length >= 2
    ? Either.right(name)
    : Either.left(`Invalid name: "${name}"`);

const createUser = (name, age) =>
  validateName(name)
    .chain(() => validateAge(age))
    .fold(
      (err) => `Error: ${err}`,
      ()    => `User ${name} (${age}) created!`
    );

console.log(createUser("Alice", 30));   // "User Alice (30) created!"
console.log(createUser("A", 30));       // "Error: Invalid name: "A""
console.log(createUser("Alice", -1));   // "Error: Invalid age: -1"

// ─── EXERCISES ───────────────────────────────────────────────────────────────

// Exercise 1: Safe array head using Maybe
//   safeHead([1,2,3])  → Just(1)
//   safeHead([])       → Nothing
const safeHead = (arr) => {
  // TODO
};

// Exercise 2: Safe division using Either
//   safeDivide(10, 2)  → Right(5)
//   safeDivide(10, 0)  → Left("Cannot divide by zero")
const safeDivide = (a, b) => {
  // TODO
};

// Exercise 3: Chain multiple safe operations
//   Given a config object (may be null), safely read config.db.host
//   Return the host or "localhost" as default
const getDbHost = (config) =>
  Maybe.of(config)
    // TODO: chain .map calls
    .getOrElse("localhost");

// console.log(getDbHost({ db: { host: "prod.db.example.com" } })); // "prod.db.example.com"
// console.log(getDbHost(null));                                      // "localhost"
// console.log(getDbHost({ db: null }));                              // "localhost"

// ─── ANSWERS (uncomment to check) ────────────────────────────────────────────
// Ex1:
// const safeHead = (arr) => arr.length ? Maybe.of(arr[0]) : Maybe.of(null);

// Ex2:
// const safeDivide = (a, b) =>
//   b === 0 ? Either.left("Cannot divide by zero") : Either.right(a / b);

// Ex3:
// const getDbHost = (config) =>
//   Maybe.of(config)
//     .map((c) => c.db)
//     .map((db) => db.host)
//     .getOrElse("localhost");
