/*
* 👋 Welcome to the online JavaScript playground 🚀
*
* To get started, try writing some code
*
* For each expression you write, you'll see the result in the output panel
*/

const products = [
    { id: 1, name: "Laptop", category: "Electronics", price: 1000, stock: 5 },
    { id: 2, name: "Headphones", category: "Electronics", price: 200, stock: 0 },
    { id: 3, name: "Coffee Maker", category: "Appliances", price: 150, stock: 10 },
    { id: 4, name: "Desk Chair", category: "Furniture", price: 300, stock: 2 }
];


// ─── GREEDY ALGORITHMS ────────────────────────────────────────────────────────
// Greedy: at each step, pick the locally optimal choice
// hoping it leads to the globally optimal solution.

// 1. KNAPSACK (0/1 greedy) — max value within budget $600
//    Greedy: pick highest value/price ratio first

const budget = 600;
const knapsack = function(items, maxBudget){
  const byRatio = [...items]
  .filter(item => item.stock>0)
  .sort((a,b) => (b.price/b.stock)-(a.price/a.stock));
  
 let remaining = maxBudget;
  const picked = [];
  for( const item of byRatio){
    if(item.price <= remaining){
      picked.push(item.name);
      remaining -= item.price;
    }
  }
  
  return { picked, spent: maxBudget - remaining };
}
console.log(knapsack(products, budget))


// maximun coins to chaange the amount

/// same thing except the raio don't need 




const coinChange = (amount, coins) => {
    const sorted = [...coins].sort((a, b) => b - a); // largest first
    const used = [];
    let remaining = amount;
    for (const coin of sorted) {
        while (remaining >= coin) {
            used.push(coin);
            remaining -= coin;
        }
    }
    return remaining === 0 ? used : null; // null if exact change not possible
};
console.log("\n2. Coin Change ($650):", coinChange(650, [500, 200, 100, 50, 20, 10]));
// [500, 100, 50]


// 3. ACTIVITY SELECTION — pick max non-overlapping flash sales
//    Greedy: always pick the sale that ends earliest
const flashSales = [
    { product: "Laptop",       start: 9,  end: 11 },
    { product: "Headphones",   start: 10, end: 12 },
    { product: "Coffee Maker", start: 11, end: 13 },
    { product: "Desk Chair",   start: 12, end: 14 },
    { product: "Keyboard",     start: 9,  end: 10 },
];

const activitySelection = function(items){
    const sorted = [...items].sort((a,b) => a.end-b.end);
    
    const result =[]
    let lastEndTime =0;

    for(const item of sorted){
        if(item.start>= lastEndTime){
            result.push(item.product)
            lastEndTime = item.end;
        }
    }
    return result;
}

console.log("Max activity:", activitySelection(flashSales));

const chunkTranscript = (wordsArray, size) => {
    const chunks = [];
    for (let i = 0; i < wordsArray.length; i += size) {
        // slice(start, end) takes a piece of the array
        chunks.push(wordsArray.slice(i, i + size));
    }
    return chunks;
};

const words = ["This", "is", "a", "very", "long", "video", "transcript"];
console.log(chunkTranscript(words, 3));



const getfrequencyMap = function(text){
    const words = text.toLowerCase().split(/\s+/);
    const map = {}
    for(let word of words){
        map[word] =(map[word] ||0) +1;
    }
    return map;
}
const transcriptSnippet = "AI is cool and AI is fast";
console.log(getfrequencyMap(transcriptSnippet));
