/**
 * Currying & Partial Application
 *
 * Currying transforms f(a, b, c) → f(a)(b)(c), enabling partial application:
 * locking in some arguments and returning a function waiting for the rest.
 */

/** Generic curry — works for any function arity */
export const curry = fn => {
  const arity = fn.length;
  return function curried(...args) {
    if (args.length >= arity) return fn(...args);
    return (...more) => curried(...args, ...more);
  };
};

// ─── Examples ────────────────────────────────────────────────────────────────
export const curriedAdd  = a => b => a + b;

export const multiply    = curry((a, b, c) => a * b * c);
export const add         = curry((a, b) => a + b);

export const curriedFilter = curry((pred, arr) => arr.filter(pred));
export const getEvens      = curriedFilter(x => x % 2 === 0);
