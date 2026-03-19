/**
 * Either Monad — error handling with context, no try/catch at the call site.
 *
 * Right(value) — success path; .map() transforms the value
 * Left(error)  — error path;   .map() is skipped, error propagates
 */
class Left {
  #value;
  constructor(value) { this.#value = value; }

  map(_fn)               { return this; }
  chain(_fn)             { return this; }
  getOrElse(defaultValue){ return defaultValue; }
  fold(leftFn, _rightFn) { return leftFn(this.#value); }
  get isRight()          { return false; }
  get value()            { return this.#value; }
  toString()             { return `Left(${JSON.stringify(this.#value)})`; }
}

class Right {
  #value;
  constructor(value) { this.#value = value; }

  map(fn)               { return Either.of(fn(this.#value)); }
  chain(fn)             { return fn(this.#value); }
  getOrElse(_def)       { return this.#value; }
  fold(_leftFn, rightFn){ return rightFn(this.#value); }
  get isRight()         { return true; }
  get value()           { return this.#value; }
  toString()            { return `Right(${JSON.stringify(this.#value)})`; }
}

export const Either = {
  of:   value => new Right(value),
  left: value => new Left(value),
  right: value => new Right(value),

  fromNullable: value =>
    value !== null && value !== undefined ? new Right(value) : new Left(null),

  tryCatch: fn => {
    try   { return new Right(fn()); }
    catch (e) { return new Left(e.message); }
  },
};
