/**
 * Core array utilities as pure, curried functions.
 * These are the building blocks used across the visualizer.
 */

// ─── Transforms ──────────────────────────────────────────────────────────────
export const double  = x => x * 2;
export const square  = x => x * x;
export const negate  = x => -x;
export const addTen  = x => x + 10;

// ─── Predicates ──────────────────────────────────────────────────────────────
export const isEven      = x => x % 2 === 0;
export const isOdd       = x => x % 2 !== 0;
export const gt          = n => x => x > n;
export const lt          = n => x => x < n;
export const divisibleBy = n => x => x % n === 0;

// ─── Reducers ────────────────────────────────────────────────────────────────
export const sum     = (acc, x) => acc + x;
export const product = (acc, x) => acc * x;
export const largest = (acc, x) => Math.max(acc, x);
export const smallest = (acc, x) => Math.min(acc, x);

// ─── Curried higher-order array functions ─────────────────────────────────────
export const map    = fn   => arr => arr.map(fn);
export const filter = pred => arr => arr.filter(pred);
export const reduce = (fn, init) => arr => arr.reduce(fn, init);
