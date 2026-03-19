/**
 * Recursion in Functional Programming
 *
 * FP prefers recursion over loops (loops rely on mutable state).
 * Key patterns: base case + recursive case, tail-call optimization, trampolining
 */

// ─── BASICS ──────────────────────────────────────────────────────────────────

// Factorial
const factorial = (n) => (n <= 1 ? 1 : n * factorial(n - 1));
console.log(factorial(5)); // 120

// Sum of array (no loops)
const sum = ([head, ...tail]) => (head === undefined ? 0 : head + sum(tail));
console.log(sum([1, 2, 3, 4, 5])); // 15

// Flatten nested array
const flatten = (arr) =>
  arr.reduce(
    (acc, item) => acc.concat(Array.isArray(item) ? flatten(item) : item),
    []
  );
console.log(flatten([1, [2, [3, [4]], 5]])); // [1, 2, 3, 4, 5]

// ─── TREE TRAVERSAL ──────────────────────────────────────────────────────────

// Binary tree node helper
const node = (value, left = null, right = null) => ({ value, left, right });

const tree = node(1,
  node(2,
    node(4),
    node(5)
  ),
  node(3,
    node(6),
    node(7)
  )
);

// In-order traversal: left → root → right
const inOrder = (n) =>
  n === null ? [] : [...inOrder(n.left), n.value, ...inOrder(n.right)];

console.log(inOrder(tree)); // [4, 2, 5, 1, 6, 3, 7]

// Tree depth
const depth = (n) =>
  n === null ? 0 : 1 + Math.max(depth(n.left), depth(n.right));

console.log(depth(tree)); // 3

// ─── TAIL-CALL OPTIMIZED ─────────────────────────────────────────────────────

// TCO factorial (accumulator pattern)
const factTCO = (n, acc = 1) => (n <= 1 ? acc : factTCO(n - 1, n * acc));
console.log(factTCO(5)); // 120

// TCO sum
const sumTCO = ([head, ...tail], acc = 0) =>
  head === undefined ? acc : sumTCO(tail, acc + head);
console.log(sumTCO([1, 2, 3, 4, 5])); // 15

// ─── EXERCISES ───────────────────────────────────────────────────────────────

// Exercise 1: Fibonacci (recursive, no loops)
//   fib(0)=0, fib(1)=1, fib(n)=fib(n-1)+fib(n-2)
const fib = (n) => {
  // TODO
};
// console.log([0,1,2,3,4,5,6,7].map(fib)); // [0,1,1,2,3,5,8,13]

// Exercise 2: Deep map — apply fn to every leaf value in a nested array
//   deepMap(x => x * 2, [1, [2, [3]]]) → [2, [4, [6]]]
const deepMap = (fn, arr) => {
  // TODO
};

// Exercise 3: Count nodes in a binary tree
const countNodes = (n) => {
  // TODO
};
// console.log(countNodes(tree)); // 7

// Exercise 4: Find all paths from root to leaf (return array of arrays)
const rootToLeafPaths = (n, path = []) => {
  // TODO
  // Hint: a leaf is a node with no children
};
// console.log(rootToLeafPaths(node(1, node(2), node(3))));
// Expected: [[1,2],[1,3]]

// ─── ANSWERS (uncomment to check) ────────────────────────────────────────────
// Ex1:
// const fib = (n) => n <= 1 ? n : fib(n-1) + fib(n-2);

// Ex2:
// const deepMap = (fn, arr) =>
//   arr.map(item => Array.isArray(item) ? deepMap(fn, item) : fn(item));

// Ex3:
// const countNodes = (n) => n === null ? 0 : 1 + countNodes(n.left) + countNodes(n.right);

// Ex4:
// const rootToLeafPaths = (n, path = []) => {
//   if (n === null) return [];
//   const current = [...path, n.value];
//   if (n.left === null && n.right === null) return [current];
//   return [...rootToLeafPaths(n.left, current), ...rootToLeafPaths(n.right, current)];
// };
