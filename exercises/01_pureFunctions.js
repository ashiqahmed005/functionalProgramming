/**
 * Pure Functions & Immutability
 *
 * A pure function:
 *   1. Always returns the same output for the same input
 *   2. Has no side effects (no mutation, no I/O)
 */

// --- IMPURE vs PURE ---

// IMPURE: depends on external state
let tax = 0.1;
const calcTaxImpure = (price) => price + price * tax;

// PURE: everything it needs is in the arguments
const calcTax = (price, taxRate) => price + price * taxRate;

// IMPURE: mutates the original array
const addItemImpure = (cart, item) => {
  cart.push(item); // side effect!
  return cart;
};

// PURE: returns a new array
const addItem = (cart, item) => [...cart, item];

// --- EXERCISES ---

// Exercise 1: Rewrite as a pure function
// IMPURE version:
let discount = 0.2;
const applyDiscountImpure = (price) => price - price * discount;

// TODO: Write a pure version below
const applyDiscount = (price, discountRate) => {
  // your code here
};

// Exercise 2: Given this impure function, write a pure equivalent
const users = [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }];
const updateUserImpure = (id, name) => {
  const user = users.find((u) => u.id === id);
  user.name = name; // mutates!
};

// TODO: Write a pure version that returns a new users array
const updateUser = (users, id, name) => {
  // your code here
};

// Exercise 3: Is this function pure? If not, why?
const greet = (name) => `Hello, ${name}! It is ${new Date().toLocaleTimeString()}`;
// Answer: No — it depends on the current time (side effect / non-determinism)

// --- ANSWERS (uncomment to check) ---
// console.log(calcTax(100, 0.1));         // 110
// console.log(addItem([1, 2, 3], 4));     // [1, 2, 3, 4]

// Ex1 answer:
// const applyDiscount = (price, discountRate) => price - price * discountRate;
// console.log(applyDiscount(100, 0.2));   // 80

// Ex2 answer:
// const updateUser = (users, id, name) =>
//   users.map(u => u.id === id ? { ...u, name } : u);
// console.log(updateUser(users, 1, "Carol"));
