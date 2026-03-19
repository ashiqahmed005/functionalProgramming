/**
 * Maybe Monad — safe null handling without scattered null checks.
 *
 * Just(value) — has a value, transformations run normally
 * Nothing     — no value, all .map() calls are silently skipped
 */
export class Maybe {
  #value;

  constructor(value) {
    this.#value = value;
  }

  static of(value) {
    return new Maybe(value);
  }

  isNothing() {
    return this.#value === null || this.#value === undefined;
  }

  /** Apply fn if Just, skip if Nothing */
  map(fn) {
    return this.isNothing() ? this : Maybe.of(fn(this.#value));
  }

  /** Unwrap with a fallback default */
  getOrElse(defaultValue) {
    return this.isNothing() ? defaultValue : this.#value;
  }

  get value() {
    return this.#value;
  }

  toString() {
    return this.isNothing()
      ? 'Nothing'
      : `Just(${JSON.stringify(this.#value)})`;
  }
}
