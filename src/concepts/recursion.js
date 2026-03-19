/**
 * Recursion in Functional Programming
 *
 * FP replaces loops (mutable state) with recursion (base case + recursive case).
 * Tail-call optimization (TCO) prevents stack overflow by passing an accumulator.
 */

// ─── Basics ──────────────────────────────────────────────────────────────────
export const factorial = n => n <= 1 ? 1 : n * factorial(n - 1);

/** TCO version — acc avoids growing the call stack */
export const factTCO = (n, acc = 1) => n <= 1 ? acc : factTCO(n - 1, n * acc);

export const sum = ([head, ...tail]) =>
  head === undefined ? 0 : head + sum(tail);

export const flatten = arr =>
  arr.reduce((acc, item) =>
    acc.concat(Array.isArray(item) ? flatten(item) : item), []);

// ─── Binary tree ─────────────────────────────────────────────────────────────
export const node = (value, left = null, right = null) => ({ value, left, right });

export const inOrder   = n => n === null ? [] : [...inOrder(n.left),   n.value, ...inOrder(n.right)];
export const preOrder  = n => n === null ? [] : [n.value, ...preOrder(n.left),  ...preOrder(n.right)];
export const postOrder = n => n === null ? [] : [...postOrder(n.left), ...postOrder(n.right), n.value];

export const depth = n =>
  n === null ? 0 : 1 + Math.max(depth(n.left), depth(n.right));

export const countNodes = n =>
  n === null ? 0 : 1 + countNodes(n.left) + countNodes(n.right);

/** Default tree used in the visualizer */
export const defaultTree = node(1,
  node(2, node(4), node(5)),
  node(3, node(6), node(7)),
);
