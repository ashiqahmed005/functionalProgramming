/**
 * Greedy Algorithms
 *
 * At each step, pick the locally optimal choice hoping it leads to
 * the globally optimal solution. Works when greedy choices are "safe"
 * (activity selection, coin change with standard denominations, etc.)
 */

/**
 * 0/1 Knapsack (greedy) — pick items with the best price/stock ratio
 * that fit within the budget.
 */
export const knapsack = (items, maxBudget) => {
  const sorted = [...items]
    .filter(item => item.stock > 0)
    .sort((a, b) => (b.price / b.stock) - (a.price / a.stock));

  let remaining = maxBudget;
  const picked = [];

  for (const item of sorted) {
    if (item.price <= remaining) {
      picked.push(item.name);
      remaining -= item.price;
    }
  }

  return { picked, spent: maxBudget - remaining };
};

/**
 * Coin Change — greedily subtract the largest coin that fits.
 * Returns null if exact change is impossible.
 */
export const coinChange = (amount, coins) => {
  const sorted = [...coins].sort((a, b) => b - a);
  const used = [];
  let remaining = amount;

  for (const coin of sorted) {
    while (remaining >= coin) {
      used.push(coin);
      remaining -= coin;
    }
  }

  return remaining === 0 ? used : null;
};

/**
 * Activity Selection — pick the maximum number of non-overlapping
 * activities by always choosing the one that ends earliest.
 */
export const activitySelection = items => {
  const sorted = [...items].sort((a, b) => a.end - b.end);
  const result = [];
  let lastEnd = 0;

  for (const item of sorted) {
    if (item.start >= lastEnd) {
      result.push(item.product);
      lastEnd = item.end;
    }
  }

  return result;
};
