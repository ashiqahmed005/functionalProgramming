/**
 * Transducers — composable, single-pass transformations.
 *
 * Problem: chaining .map().filter() creates intermediate arrays.
 * Solution: compose transformations at the reducer level so data flows
 *           through in one pass with zero allocations.
 *
 * A transducer :: Reducer -> Reducer
 */

export const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);

/** Standard reducer — appends to an array */
export const append = (acc, item) => [...acc, item];

/** map transducer */
export const mapping = fn => reducer => (acc, item) =>
  reducer(acc, fn(item));

/** filter transducer */
export const filtering = pred => reducer => (acc, item) =>
  pred(item) ? reducer(acc, item) : acc;

/** Run a transducer over a collection with a given reducer and initial value */
export const transduce = (xform, reducer, init, collection) =>
  collection.reduce(xform(reducer), init);
