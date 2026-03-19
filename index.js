
var names = ["Ben", "Jafar", "Matt", "Priya", "Brian"],
    counter;

for (counter = 0; counter < names.length; counter++) {
   // console.log(names[counter]);
}

names.forEach(function (name) {
   // console.log(name);
})
/* 
Projecting Arrays
Applying a function to a value and creating a new 
value is called a projection. To project one array
into another, we apply a projection function to each 
item in the array and collect the results in a new 
array.

Exercise 3: Project an array of videos into an array 
of {id,title} pairs using forEach()

For each video, add a projected {id, title} pair to 
the videoAndTitlePairs array.
*/
function projectionDemo() {
    const newReleases = [
        {
            "id": 70111470,
            "title": "Die Hard",
            "boxart": "http://cdn-0.nflximg.com/images/2891/DieHard.jpg",
            "uri": "http://api.netflix.com/catalog/titles/movies/70111470",
            "rating": [4.0],
            "bookmark": []
        },
        {
            "id": 654356453,
            "title": "Bad Boys",
            "boxart": "http://cdn-0.nflximg.com/images/2891/BadBoys.jpg",
            "uri": "http://api.netflix.com/catalog/titles/movies/70111470",
            "rating": [5.0],
            "bookmark": [{ id: 432534, time: 65876586 }]
        },
        {
            "id": 65432445,
            "title": "The Chamber",
            "boxart": "http://cdn-0.nflximg.com/images/2891/TheChamber.jpg",
            "uri": "http://api.netflix.com/catalog/titles/movies/70111470",
            "rating": [4.0],
            "bookmark": []
        },
        {
            "id": 675465,
            "title": "Fracture",
            "boxart": "http://cdn-0.nflximg.com/images/2891/Fracture.jpg",
            "uri": "http://api.netflix.com/catalog/titles/movies/70111470",
            "rating": [5.0],
            "bookmark": [{ id: 432534, time: 65876586 }]
        }
    ];
    // using forEach    
    // let videoAndTitlePairs = [];

    // newReleases.forEach(function(release) {
    //    // console.log(release.id)
    //     videoAndTitlePairs.push({id:release.id,title: release.title})
    // })
    //   return videoAndTitlePairs;

    //using Map

    // return newReleases.map(function(release) {
    //     return {id: release.id, title: release.title}
    // })

    // use filter for rating 
    // let videos =[];
    // newReleases.forEach(function(release) {
    //     if(release.rating < 5){
    //         videos.push({id: release.id, title: release.title})
    //     }

    // })
    // return videos;

    // chaining with filter and mapping
    return newReleases.filter(function (release) {
        return release.rating < 5;
    }).map(function (release) {
        return release.title;
    })
}
//
//console.log(mapping());

//Flatten the nested array 
Array.prototype.concatAll = function(){
    let result = [];
    this.forEach(subArray => {
        subArray.forEach((item)=> {
            result.push(item);
        })
    })
    return result;
}

function tetlify() {
    var movieLists = [
        {
            name: "New Releases",
            videos: [
                {
                    "id": 70111470,
                    "title": "Die Hard",
                    "boxart": "http://cdn-0.nflximg.com/images/2891/DieHard.jpg",
                    "uri": "http://api.netflix.com/catalog/titles/movies/70111470",
                    "rating": 4.0,
                    "bookmark": []
                },
                {
                    "id": 654356453,
                    "title": "Bad Boys",
                    "boxart": "http://cdn-0.nflximg.com/images/2891/BadBoys.jpg",
                    "uri": "http://api.netflix.com/catalog/titles/movies/70111470",
                    "rating": 5.0,
                    "bookmark": [{ id: 432534, time: 65876586 }]
                }
            ]
        },
        {
            name: "Dramas",
            videos: [
                {
                    "id": 65432445,
                    "title": "The Chamber",
                    "boxart": "http://cdn-0.nflximg.com/images/2891/TheChamber.jpg",
                    "uri": "http://api.netflix.com/catalog/titles/movies/70111470",
                    "rating": 4.0,
                    "bookmark": []
                },
                {
                    "id": 675465,
                    "title": "Fracture",
                    "boxart": "http://cdn-0.nflximg.com/images/2891/Fracture.jpg",
                    "uri": "http://api.netflix.com/catalog/titles/movies/70111470",
                    "rating": 5.0,
                    "bookmark": [{ id: 432534, time: 65876586 }]
                }
            ]
        }
    ];

return movieLists.
  map(function(movieList) {
    return movieList.videos.map(function(video) {
        return {id: video.id, title: video.title};
      });
  }).concatAll();
  //flat();
    //  allVideoIdsInMovieLists = [];

    //  movieLists.forEach((telt)=>{
    //     telt.videos.forEach((video)=>{
    //         allVideoIdsInMovieLists.push({id: video.id, title: video.title})
    //     })
    // })

    // return allVideoIdsInMovieLists;
    
	  

     
}

console.log([tetlify()]);

Array.prototype.concatMap = function(projectionFunctionThatReturnsArray) {
	return this.
		map(function(item) {
			return projectionFunctionThatReturnsArray(item);
		}).
		// apply the concatAll function to flatten the two-dimensional array
		concatAll();
};
// var spanishFrenchEnglishWords = [ ["cero","rien","zero"], ["uno","un","one"], ["dos","deux","two"] ];
// 	// collect all the words for each number, in every language, in a single, flat list
// 	var allWords = [0,1,2].
// 		concatMap(function(index) {
// 			return spanishFrenchEnglishWords[index];
// 		});

// 	return JSON.stringify(allWords) === '["cero","rien","zero","uno","un","one","dos","deux","two"]';

function largestBox(boxarts){
  
    let currentSize
   let  maxSize = -1
    let largestBoxart;

boxarts.forEach(function(boxart) {
    currentSize = boxart.width * boxart.height;
    if (currentSize > maxSize) {
        largestBoxart = boxart;
        maxSize = currentSize;
    }
});

    return largestBoxart

}

const boxarts = [
    { width: 200, height: 200, url: "http://cdn-0.nflximg.com/images/2891/Fracture200.jpg" },
    { width: 150, height: 200, url: "http://cdn-0.nflximg.com/images/2891/Fracture150.jpg" },
    { width: 300, height: 200, url: "http://cdn-0.nflximg.com/images/2891/Fracture300.jpg" },
    { width: 425, height: 150, url: "http://cdn-0.nflximg.com/images/2891/Fracture425.jpg" }
]
console.log(largestBox(boxarts));

function largeRating() {
	var ratings = [2,3,1,4,5];

	return ratings.
	  reduce(function(acc, curr) {
		if(acc > curr) {
		  return acc;
		}
		else {
		  return curr;
		}
	  });
}
console.log(largeRating());

function largestBoxArt() {
	var boxarts = [
        { width: 200, height: 200, url: "http://cdn-0.nflximg.com/images/2891/Fracture200.jpg" },
        { width: 150, height: 200, url: "http://cdn-0.nflximg.com/images/2891/Fracture150.jpg" },
        { width: 300, height: 200, url: "http://cdn-0.nflximg.com/images/2891/Fracture300.jpg" },
        { width: 425, height: 150, url: "http://cdn-0.nflximg.com/images/2891/Fracture425.jpg" }
    ];

return boxarts.
  reduce(function(acc,curr) {
    if (acc.width * acc.height > curr.width * curr.height) {
      return acc;
    }
    else {
      return curr;
    }
  })
}
console.log(largestBoxArt());


Array.prototype.concatMap = function(projectionFunctionThatReturnsArray) {
	return this.
		map(function(item) {
			return projectionFunctionThatReturnsArray(item);
		}).
		// apply the concatAll function to flatten the two-dimensional array
		concatAll();
};

function smallestBox() {
	var movieLists = [
		{
			name: "New Releases",
			videos: [
				{
					"id": 70111470,
					"title": "Die Hard",
					"boxarts": [
						{ width: 150, height:200, url:"http://cdn-0.nflximg.com/images/2891/DieHard150.jpg" },
						{ width: 200, height:200, url:"http://cdn-0.nflximg.com/images/2891/DieHard200.jpg" }
					],
					"url": "http://api.netflix.com/catalog/titles/movies/70111470",
					"rating": 4.0,
					"bookmark": []
				},
				{
					"id": 654356453,
					"title": "Bad Boys",
					"boxarts": [
						{ width: 200, height:200, url:"http://cdn-0.nflximg.com/images/2891/BadBoys200.jpg" },
						{ width: 140, height:200, url:"http://cdn-0.nflximg.com/images/2891/BadBoys140.jpg" }

					],
					"url": "http://api.netflix.com/catalog/titles/movies/70111470",
					"rating": 5.0,
					"bookmark": [{ id:432534, time:65876586 }]
				}
			]
		},
		{
			name: "Thrillers",
			videos: [
				{
					"id": 65432445,
					"title": "The Chamber",
					"boxarts": [
						{ width: 130, height:200, url:"http://cdn-0.nflximg.com/images/2891/TheChamber130.jpg" },
						{ width: 200, height:200, url:"http://cdn-0.nflximg.com/images/2891/TheChamber200.jpg" }
					],
					"url": "http://api.netflix.com/catalog/titles/movies/70111470",
					"rating": 4.0,
					"bookmark": []
				},
				{
					"id": 675465,
					"title": "Fracture",
					"boxarts": [
						{ width: 200, height:200, url:"http://cdn-0.nflximg.com/images/2891/Fracture200.jpg" },
						{ width: 120, height:200, url:"http://cdn-0.nflximg.com/images/2891/Fracture120.jpg" },
						{ width: 300, height:200, url:"http://cdn-0.nflximg.com/images/2891/Fracture300.jpg" }
					],
					"url": "http://api.netflix.com/catalog/titles/movies/70111470",
					"rating": 5.0,
					"bookmark": [{ id:432534, time:65876586 }]
				}
			]
		}
	];


	// Use one or more concatMap, map, and reduce calls to create an array with the following items (order matters)
	// [
	//     {"id": 675465,"title": "Fracture","boxart":"http://cdn-0.nflximg.com/images/2891/Fracture120.jpg" },
	//     {"id": 65432445,"title": "The Chamber","boxart":"http://cdn-0.nflximg.com/images/2891/TheChamber130.jpg" },
	//     {"id": 654356453,"title": "Bad Boys","boxart":"http://cdn-0.nflximg.com/images/2891/BadBoys140.jpg" },
	//     {"id": 70111470,"title": "Die Hard","boxart":"http://cdn-0.nflximg.com/images/2891/DieHard150.jpg" }
	// ];

	return movieLists.concatMap(function(movieList) {
	  return movieList.videos.concatMap(function(video) {
	    return [video.boxarts.
		  reduce(function(acc,curr) {
			if (acc.width * acc.height < curr.width * curr.height) {
			  return acc;
			}
			else {
			  return curr;
			}
		  })];
	  });
	});

}
		
console.log(smallestBox());

// =============================================================================
// PURE FUNCTIONS & IMMUTABILITY
// =============================================================================

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
const usersData = [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }];
const updateUserImpure = (id, name) => {
  const user = usersData.find((u) => u.id === id);
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
// const applyDiscount = (price, discountRate) => price - price * discountRate;
// console.log(applyDiscount(100, 0.2));   // 80
// const updateUser = (users, id, name) =>
//   users.map(u => u.id === id ? { ...u, name } : u);
// console.log(updateUser(usersData, 1, "Carol"));

// =============================================================================
// CURRYING & PARTIAL APPLICATION
// =============================================================================

// Regular function
const add = (a, b) => a + b;

// Curried version
const curriedAdd = (a) => (b) => a + b;

const add5 = curriedAdd(5); // partial application
console.log(add5(3));  // 8
console.log(add5(10)); // 15

// Generic curry helper (works for any arity)
const curry = (fn) => {
  const arity = fn.length;
  return function curried(...args) {
    if (args.length >= arity) {
      return fn(...args);
    }
    return (...moreArgs) => curried(...args, ...moreArgs);
  };
};

const multiply = curry((a, b, c) => a * b * c);
const double = multiply(2, 1);   // waits for c
const triple = multiply(3, 1);   // waits for c
console.log(double(5));  // 10
console.log(triple(5));  // 15

const curriedFilter = curry((pred, arr) => arr.filter(pred));
const getEvens = curriedFilter((n) => n % 2 === 0);
console.log(getEvens([1, 2, 3, 4, 5, 6])); // [2, 4, 6]

// --- EXERCISES ---

// Exercise 1: Curry this function
const volume = (l, w, h) => l * w * h;
// TODO: write curriedVolume so that curriedVolume(2)(3)(4) === 24
const curriedVolume = /* your code here */ null;

// Exercise 2: Use the curry helper to create a reusable 'power' function
const power = curry((base, exp) => base ** exp);
// TODO: create `square` and `cube` using power
const square = /* your code here */ null;
const cube   = /* your code here */ null;

// Exercise 3: Curry this logger
const log = (level, timestamp, message) => `[${level}] ${timestamp}: ${message}`;
// TODO: create curriedLog, then create an `errorLog` pre-filled with level="ERROR"
const curriedLog = /* your code here */ null;
const errorLog   = /* your code here */ null;

// --- ANSWERS (uncomment to check) ---
// const curriedVolume = (l) => (w) => (h) => l * w * h;
// console.log(curriedVolume(2)(3)(4)); // 24
// const square = power(2); const cube = power(3);
// console.log(square(5)); // 25  console.log(cube(3)); // 27
// const curriedLog = curry(log); const errorLog = curriedLog("ERROR");
// console.log(errorLog("2026-03-18")("Something broke"));

// =============================================================================
// FUNCTION COMPOSITION & PIPELINES
// =============================================================================

const compose = (...fns) => (x) => fns.reduceRight((acc, fn) => fn(acc), x);
const pipe    = (...fns) => (x) => fns.reduce((acc, fn) => fn(acc), x);

const trim      = (s) => s.trim();
const toLower   = (s) => s.toLowerCase();
const split     = (sep) => (s) => s.split(sep);
const join      = (sep) => (arr) => arr.join(sep);
const replace   = (from, to) => (s) => s.replace(new RegExp(from, "g"), to);

const slugify = pipe(
  trim,
  toLower,
  replace(" ", "-"),
  replace("[^a-z0-9-]", "")
);
console.log(slugify("  Hello World! "));  // "hello-world"

const slugifyC = compose(
  replace("[^a-z0-9-]", ""),
  replace(" ", "-"),
  toLower,
  trim
);
console.log(slugifyC("  Hello World! "));  // "hello-world"

const pipeUsers = [
  { name: "alice", age: 25, active: true },
  { name: "bob",   age: 17, active: false },
  { name: "carol", age: 32, active: true },
  { name: "dave",  age: 15, active: true },
];

const isActive   = (u) => u.active;
const isAdult    = (u) => u.age >= 18;
const getName    = (u) => u.name;
const capitalize = (s) => s[0].toUpperCase() + s.slice(1);

const getActiveAdultNames = pipe(
  (users) => users.filter(isActive),
  (users) => users.filter(isAdult),
  (users) => users.map(getName),
  (names) => names.map(capitalize)
);
console.log(getActiveAdultNames(pipeUsers)); // ["Alice", "Carol"]

// --- EXERCISES ---

// Exercise 1: Using pipe, build a parseCSVLine function
const parseCSVLine = pipe(
  // TODO: fill in the steps
);
// console.log(parseCSVLine("  Alice , BOB ,  , Carol  ")); // ["alice", "bob", "carol"]

// Exercise 2: double → subtract 1 → square
const dbl    = (n) => n * 2;
const subOne = (n) => n - 1;
const sq     = (n) => n * n;
const transform = /* pipe or compose */ null;
// console.log(transform(3)); // 25

// Exercise 3: normalize string
const removeAccents  = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const collapseSpaces = (s) => s.replace(/\s+/g, " ");
const normalize = /* your code here */ null;
// console.log(normalize("  Héllo   Wörld  ")); // "Hello World"

// --- ANSWERS (uncomment to check) ---
// const parseCSVLine = pipe(s => s.trim(), s => s.split(","), arr => arr.map(s => s.trim().toLowerCase()), arr => arr.filter(Boolean));
// const transform = pipe(dbl, subOne, sq); console.log(transform(3)); // 25
// const normalize = pipe(trim, collapseSpaces, removeAccents);

// =============================================================================
// MAYBE & EITHER — FUNCTIONAL ERROR HANDLING
// =============================================================================

class Maybe {
  constructor(value) { this._value = value; }
  static of(value)   { return new Maybe(value); }
  isNothing()        { return this._value === null || this._value === undefined; }
  map(fn)            { return this.isNothing() ? this : Maybe.of(fn(this._value)); }
  chain(fn)          { return this.isNothing() ? this : fn(this._value); }
  getOrElse(def)     { return this.isNothing() ? def : this._value; }
  toString()         { return this.isNothing() ? "Nothing" : `Just(${JSON.stringify(this._value)})`; }
}

const getUser = (id) =>
  id === 1 ? { name: "Alice", address: { city: "NYC" } } : null;

const getCity = (id) =>
  Maybe.of(getUser(id))
    .map((u) => u.address)
    .map((a) => a.city)
    .getOrElse("Unknown");

console.log(getCity(1));  // "NYC"
console.log(getCity(99)); // "Unknown"

class Left {
  constructor(value) { this._value = value; }
  map(_fn)           { return this; }
  chain(_fn)         { return this; }
  getOrElse(def)     { return def; }
  fold(leftFn, _rightFn) { return leftFn(this._value); }
  toString()         { return `Left(${JSON.stringify(this._value)})`; }
}

class Right {
  constructor(value) { this._value = value; }
  map(fn)            { return Either.of(fn(this._value)); }
  chain(fn)          { return fn(this._value); }
  getOrElse(_def)    { return this._value; }
  fold(_leftFn, rightFn) { return rightFn(this._value); }
  toString()         { return `Right(${JSON.stringify(this._value)})`; }
}

const Either = {
  of: (value) => new Right(value),
  left:  (value) => new Left(value),
  right: (value) => new Right(value),
  fromNullable: (value) =>
    value !== null && value !== undefined ? new Right(value) : new Left(null),
  tryCatch: (fn) => {
    try { return new Right(fn()); } catch (e) { return new Left(e.message); }
  },
};

const parseJSON = (str) => Either.tryCatch(() => JSON.parse(str));
console.log(parseJSON('{"name":"Bob"}').map((o) => o.name).getOrElse("parse error")); // "Bob"
console.log(parseJSON("not json").map((o) => o.name).getOrElse("parse error"));       // "parse error"

const validateAge = (age) =>
  age >= 0 && age <= 120 ? Either.right(age) : Either.left(`Invalid age: ${age}`);
const validateName = (name) =>
  name && name.length >= 2 ? Either.right(name) : Either.left(`Invalid name: "${name}"`);
const createUser = (name, age) =>
  validateName(name)
    .chain(() => validateAge(age))
    .fold((err) => `Error: ${err}`, () => `User ${name} (${age}) created!`);

console.log(createUser("Alice", 30));  // "User Alice (30) created!"
console.log(createUser("A", 30));      // "Error: Invalid name: "A""
console.log(createUser("Alice", -1));  // "Error: Invalid age: -1"

// --- EXERCISES ---

// Exercise 1: Safe array head using Maybe
const safeHead = (arr) => { /* TODO */ };

// Exercise 2: Safe division using Either
const safeDivide = (a, b) => { /* TODO */ };

// Exercise 3: Safely read config.db.host
const getDbHost = (config) =>
  Maybe.of(config)
    // TODO: chain .map calls
    .getOrElse("localhost");

// --- ANSWERS (uncomment to check) ---
// const safeHead = (arr) => arr.length ? Maybe.of(arr[0]) : Maybe.of(null);
// const safeDivide = (a, b) => b === 0 ? Either.left("Cannot divide by zero") : Either.right(a / b);
// const getDbHost = (config) => Maybe.of(config).map(c => c.db).map(db => db.host).getOrElse("localhost");

// =============================================================================
// RECURSION
// =============================================================================

const factorial = (n) => (n <= 1 ? 1 : n * factorial(n - 1));
console.log(factorial(5)); // 120

const sumArr = ([head, ...tail]) => (head === undefined ? 0 : head + sumArr(tail));
console.log(sumArr([1, 2, 3, 4, 5])); // 15

const flatten = (arr) =>
  arr.reduce((acc, item) => acc.concat(Array.isArray(item) ? flatten(item) : item), []);
console.log(flatten([1, [2, [3, [4]], 5]])); // [1, 2, 3, 4, 5]

const node = (value, left = null, right = null) => ({ value, left, right });
const tree = node(1, node(2, node(4), node(5)), node(3, node(6), node(7)));

const inOrder = (n) =>
  n === null ? [] : [...inOrder(n.left), n.value, ...inOrder(n.right)];
console.log(inOrder(tree)); // [4, 2, 5, 1, 6, 3, 7]

const depth = (n) =>
  n === null ? 0 : 1 + Math.max(depth(n.left), depth(n.right));
console.log(depth(tree)); // 3

const factTCO = (n, acc = 1) => (n <= 1 ? acc : factTCO(n - 1, n * acc));
console.log(factTCO(5)); // 120

const sumTCO = ([head, ...tail], acc = 0) =>
  head === undefined ? acc : sumTCO(tail, acc + head);
console.log(sumTCO([1, 2, 3, 4, 5])); // 15

// --- EXERCISES ---

// Exercise 1: Fibonacci
const fib = (n) => { /* TODO */ };
// console.log([0,1,2,3,4,5,6,7].map(fib)); // [0,1,1,2,3,5,8,13]

// Exercise 2: Deep map
const deepMap = (fn, arr) => { /* TODO */ };

// Exercise 3: Count nodes in binary tree
const countNodes = (n) => { /* TODO */ };
// console.log(countNodes(tree)); // 7

// Exercise 4: Root to leaf paths
const rootToLeafPaths = (n, path = []) => { /* TODO */ };
// console.log(rootToLeafPaths(node(1, node(2), node(3)))); // [[1,2],[1,3]]

// --- ANSWERS (uncomment to check) ---
// const fib = (n) => n <= 1 ? n : fib(n-1) + fib(n-2);
// const deepMap = (fn, arr) => arr.map(item => Array.isArray(item) ? deepMap(fn, item) : fn(item));
// const countNodes = (n) => n === null ? 0 : 1 + countNodes(n.left) + countNodes(n.right);
// const rootToLeafPaths = (n, path = []) => {
//   if (n === null) return [];
//   const current = [...path, n.value];
//   if (n.left === null && n.right === null) return [current];
//   return [...rootToLeafPaths(n.left, current), ...rootToLeafPaths(n.right, current)];
// };

// =============================================================================
// TRANSDUCERS
// =============================================================================

const append = (acc, item) => [...acc, item];
const mapping   = (fn)   => (reducer) => (acc, item) => reducer(acc, fn(item));
const filtering = (pred) => (reducer) => (acc, item) =>
  pred(item) ? reducer(acc, item) : acc;
const composeT  = (...fns) => (x) => fns.reduceRight((v, f) => f(v), x);
const transduce = (transducer, reducer, init, collection) =>
  collection.reduce(transducer(reducer), init);

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const resultTraditional = data
  .filter((n) => n % 2 === 0)
  .map((n) => n * n)
  .filter((n) => n < 50);

const xform = composeT(
  filtering((n) => n % 2 === 0),
  mapping((n) => n * n),
  filtering((n) => n < 50)
);

const resultTransducer = transduce(xform, append, [], data);
console.log(resultTraditional); // [4, 16, 36]
console.log(resultTransducer);  // [4, 16, 36]

const addNums = (acc, n) => acc + n;
const sumResult = transduce(xform, addNums, 0, data);
console.log(sumResult); // 56

// --- EXERCISES ---

// Exercise 1: transducer that keeps strings > 3 chars and uppercases them
const wordXform = composeT( /* TODO */ );
// const result = transduce(wordXform, append, [], ["hi","hello","yo","world","ok","functional"]);
// console.log(result); // ["HELLO", "WORLD", "FUNCTIONAL"]

// Exercise 2: taking transducer — stops after N items
const taking = (n) => (reducer) => {
  let count = 0;
  return (acc, item) => { /* TODO */ };
};

// Exercise 3: flatMapping transducer
const flatMapping = (fn) => (reducer) => (acc, item) => { /* TODO */ };

// --- ANSWERS (uncomment to check) ---
// const wordXform = composeT(filtering(s => s.length > 3), mapping(s => s.toUpperCase()));
// const taking = (n) => (reducer) => { let count = 0; return (acc, item) => { if (count >= n) return acc; count++; return reducer(acc, item); }; };
// const flatMapping = (fn) => (reducer) => (acc, item) => fn(item).reduce(reducer, acc);

// =============================================================================
// GREEDY ALGORITHMS
// =============================================================================

const products = [
    { id: 1, name: "Laptop",       category: "Electronics", price: 1000, stock: 5 },
    { id: 2, name: "Headphones",   category: "Electronics", price: 200,  stock: 0 },
    { id: 3, name: "Coffee Maker", category: "Appliances",  price: 150,  stock: 10 },
    { id: 4, name: "Desk Chair",   category: "Furniture",   price: 300,  stock: 2 }
];

const budget = 600;
const knapsack = function(items, maxBudget){
  const byRatio = [...items]
    .filter(item => item.stock > 0)
    .sort((a, b) => (b.price / b.stock) - (a.price / a.stock));
  let remaining = maxBudget;
  const picked = [];
  for (const item of byRatio) {
    if (item.price <= remaining) { picked.push(item.name); remaining -= item.price; }
  }
  return { picked, spent: maxBudget - remaining };
};
console.log(knapsack(products, budget));

const coinChange = (amount, coins) => {
    const sorted = [...coins].sort((a, b) => b - a);
    const used = [];
    let remaining = amount;
    for (const coin of sorted) {
        while (remaining >= coin) { used.push(coin); remaining -= coin; }
    }
    return remaining === 0 ? used : null;
};
console.log("\n2. Coin Change ($650):", coinChange(650, [500, 200, 100, 50, 20, 10]));

const flashSales = [
    { product: "Laptop",       start: 9,  end: 11 },
    { product: "Headphones",   start: 10, end: 12 },
    { product: "Coffee Maker", start: 11, end: 13 },
    { product: "Desk Chair",   start: 12, end: 14 },
    { product: "Keyboard",     start: 9,  end: 10 },
];

const activitySelection = function(items){
    const sorted = [...items].sort((a, b) => a.end - b.end);
    const result = [];
    let lastEndTime = 0;
    for (const item of sorted) {
        if (item.start >= lastEndTime) { result.push(item.product); lastEndTime = item.end; }
    }
    return result;
};
console.log("Max activity:", activitySelection(flashSales));

const chunkTranscript = (wordsArray, size) => {
    const chunks = [];
    for (let i = 0; i < wordsArray.length; i += size) {
        chunks.push(wordsArray.slice(i, i + size));
    }
    return chunks;
};
const transcriptWords = ["This", "is", "a", "very", "long", "video", "transcript"];
console.log(chunkTranscript(transcriptWords, 3));

const getfrequencyMap = function(text){
    const ws = text.toLowerCase().split(/\s+/);
    const map = {};
    for (let word of ws) { map[word] = (map[word] || 0) + 1; }
    return map;
};
const transcriptSnippet = "AI is cool and AI is fast";
console.log(getfrequencyMap(transcriptSnippet));

// =============================================================================
// ADVANCED MOVIE / STREAMING DATA — map · filter · reduce · flatMap · groupBy
// =============================================================================

const movies = [
    { id: 1, title: "Inception",       genre: "Sci-Fi",  rating: 4.8, views: 980000, releaseYear: 2010, duration: 148, cast: ["DiCaprio","Gordon-Levitt","Page"] },
    { id: 2, title: "The Dark Knight", genre: "Action",  rating: 4.9, views: 1200000, releaseYear: 2008, duration: 152, cast: ["Bale","Ledger","Oldman"] },
    { id: 3, title: "Interstellar",    genre: "Sci-Fi",  rating: 4.7, views: 870000,  releaseYear: 2014, duration: 169, cast: ["McConaughey","Hathaway","Chastain"] },
    { id: 4, title: "The Godfather",   genre: "Drama",   rating: 4.9, views: 750000,  releaseYear: 1972, duration: 175, cast: ["Brando","Pacino","Keaton"] },
    { id: 5, title: "Mad Max",         genre: "Action",  rating: 4.2, views: 620000,  releaseYear: 2015, duration: 120, cast: ["Hardy","Theron"] },
    { id: 6, title: "Parasite",        genre: "Drama",   rating: 4.6, views: 540000,  releaseYear: 2019, duration: 132, cast: ["Song","Lee","Choi"] },
    { id: 7, title: "Dune",            genre: "Sci-Fi",  rating: 4.5, views: 730000,  releaseYear: 2021, duration: 155, cast: ["Chalamet","Zendaya","Ferguson"] },
];

// 1. Project: extract title + rating for movies rated above 4.5
const topRated = movies
    .filter(m => m.rating > 4.5)
    .map(m => ({ title: m.title, rating: m.rating }));
console.log("\n[Movies] Top rated (>4.5):", topRated);

// 2. Sort by views descending using reduce to build ranked list
const rankedByViews = [...movies]
    .sort((a, b) => b.views - a.views)
    .map((m, i) => `#${i + 1} ${m.title} (${(m.views / 1e6).toFixed(2)}M views)`);
console.log("[Movies] Ranked by views:", rankedByViews);

// 3. groupBy genre using reduce
const byGenre = movies.reduce((acc, m) => {
    acc[m.genre] = acc[m.genre] ? [...acc[m.genre], m.title] : [m.title];
    return acc;
}, {});
console.log("[Movies] Grouped by genre:", byGenre);

// 4. Top-rated movie per genre (reduce inside a groupBy pipeline)
const topPerGenre = movies.reduce((acc, m) => {
    if (!acc[m.genre] || m.rating > acc[m.genre].rating) {
        acc[m.genre] = { title: m.title, rating: m.rating };
    }
    return acc;
}, {});
console.log("[Movies] Top per genre:", topPerGenre);

// 5. Collect ALL cast members across every movie (flatMap equivalent)
const allCast = movies
    .map(m => m.cast)
    .reduce((acc, castList) => [...acc, ...castList], []);
console.log("[Movies] All cast members:", allCast);

// 6. Total watch time of Sci-Fi movies (minutes → hours)
const sciFiWatchMinutes = movies
    .filter(m => m.genre === "Sci-Fi")
    .reduce((acc, m) => acc + m.duration, 0);
console.log(`[Movies] Total Sci-Fi watch time: ${sciFiWatchMinutes} min (${(sciFiWatchMinutes / 60).toFixed(1)} hrs)`);

// 7. Average rating across all movies
const avgRating = movies.reduce((acc, m, _, arr) => acc + m.rating / arr.length, 0);
console.log("[Movies] Average rating:", avgRating.toFixed(2));

// 8. Movies released after 2010, sorted alphabetically, title only
const post2010 = movies
    .filter(m => m.releaseYear > 2010)
    .sort((a, b) => a.title.localeCompare(b.title))
    .map(m => m.title);
console.log("[Movies] Post-2010 titles (A–Z):", post2010);

// =============================================================================
// ADVANCED PRODUCT DATA — discount · inventory value · category grouping
// =============================================================================

const inventory = [
    { id: 1,  name: "Laptop",       category: "Electronics", price: 1200, stock: 8,  discount: 0.10, tags: ["work","computing"], reviews: 4.5 },
    { id: 2,  name: "Headphones",   category: "Electronics", price: 250,  stock: 15, discount: 0.20, tags: ["audio","work"],     reviews: 4.2 },
    { id: 3,  name: "Coffee Maker", category: "Appliances",  price: 180,  stock: 0,  discount: 0.05, tags: ["kitchen"],          reviews: 4.0 },
    { id: 4,  name: "Desk Chair",   category: "Furniture",   price: 350,  stock: 4,  discount: 0.15, tags: ["ergonomic","work"], reviews: 4.7 },
    { id: 5,  name: "Monitor",      category: "Electronics", price: 600,  stock: 6,  discount: 0.12, tags: ["computing","work"], reviews: 4.6 },
    { id: 6,  name: "Standing Desk",category: "Furniture",   price: 700,  stock: 3,  discount: 0.08, tags: ["ergonomic"],        reviews: 4.8 },
    { id: 7,  name: "Microwave",    category: "Appliances",  price: 120,  stock: 10, discount: 0.00, tags: ["kitchen"],          reviews: 3.9 },
];

// 1. Apply discount pipeline: finalPrice = price * (1 - discount)
const withFinalPrice = inventory.map(p => ({
    ...p,
    finalPrice: +(p.price * (1 - p.discount)).toFixed(2)
}));
console.log("\n[Products] Final prices:", withFinalPrice.map(p => `${p.name}: $${p.finalPrice}`));

// 2. Total inventory value (price × stock) for in-stock items
const inventoryValue = inventory
    .filter(p => p.stock > 0)
    .reduce((acc, p) => acc + p.price * p.stock, 0);
console.log("[Products] Total inventory value: $" + inventoryValue.toLocaleString());

// 3. Group by category, summing stock per category
const stockByCategory = inventory.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + p.stock;
    return acc;
}, {});
console.log("[Products] Stock by category:", stockByCategory);

// 4. Best-reviewed in-stock product per category
const bestReviewedPerCategory = inventory
    .filter(p => p.stock > 0)
    .reduce((acc, p) => {
        if (!acc[p.category] || p.reviews > acc[p.category].reviews) {
            acc[p.category] = { name: p.name, reviews: p.reviews };
        }
        return acc;
    }, {});
console.log("[Products] Best reviewed per category:", bestReviewedPerCategory);

// 5. Tag-based filtering: all products tagged "work"
const workProducts = inventory
    .filter(p => p.tags.includes("work"))
    .map(p => p.name);
console.log("[Products] Work-related products:", workProducts);

// 6. Out-of-stock product names (flat list)
const outOfStock = inventory.filter(p => p.stock === 0).map(p => p.name);
console.log("[Products] Out of stock:", outOfStock);

// =============================================================================
// ORDERS DATA — revenue · groupBy user · average order value · most ordered
// =============================================================================

const orders = [
    { id: 101, userId: 1, items: ["Laptop","Monitor"],      total: 1800, date: "2024-01-05", status: "delivered" },
    { id: 102, userId: 2, items: ["Headphones"],            total: 250,  date: "2024-01-07", status: "delivered" },
    { id: 103, userId: 1, items: ["Desk Chair"],            total: 350,  date: "2024-01-10", status: "pending" },
    { id: 104, userId: 3, items: ["Coffee Maker","Microwave"], total: 300, date: "2024-01-12", status: "delivered" },
    { id: 105, userId: 2, items: ["Monitor","Headphones"],  total: 850,  date: "2024-01-15", status: "shipped" },
    { id: 106, userId: 3, items: ["Standing Desk"],         total: 700,  date: "2024-01-18", status: "delivered" },
    { id: 107, userId: 1, items: ["Laptop"],                total: 1200, date: "2024-01-20", status: "pending" },
];

// 1. Total revenue from delivered orders only
const deliveredRevenue = orders
    .filter(o => o.status === "delivered")
    .reduce((acc, o) => acc + o.total, 0);
console.log("\n[Orders] Delivered revenue: $" + deliveredRevenue.toLocaleString());

// 2. Orders grouped by userId
const ordersByUser = orders.reduce((acc, o) => {
    acc[o.userId] = acc[o.userId] ? [...acc[o.userId], o.id] : [o.id];
    return acc;
}, {});
console.log("[Orders] Orders by user:", ordersByUser);

// 3. Average order value
const avgOrderValue = orders.reduce((acc, o, _, arr) => acc + o.total / arr.length, 0);
console.log("[Orders] Average order value: $" + avgOrderValue.toFixed(2));

// 4. Most frequently ordered item (flatMap → frequency map → max)
const itemFrequency = orders
    .reduce((acc, o) => [...acc, ...o.items], [])   // flatten all items
    .reduce((acc, item) => {
        acc[item] = (acc[item] || 0) + 1;
        return acc;
    }, {});
const mostOrdered = Object.entries(itemFrequency)
    .reduce((max, [item, count]) => count > max.count ? { item, count } : max, { item: null, count: 0 });
console.log("[Orders] Most ordered item:", mostOrdered);

// 5. Pending order totals per user
const pendingByUser = orders
    .filter(o => o.status === "pending")
    .reduce((acc, o) => {
        acc[o.userId] = (acc[o.userId] || 0) + o.total;
        return acc;
    }, {});
console.log("[Orders] Pending totals by user:", pendingByUser);

// =============================================================================
// EMPLOYEES DATA — salary stats · top earner · experience bands
// =============================================================================

const employees = [
    { id: 1,  name: "Alice",   department: "Engineering", salary: 120000, yearsExp: 8  },
    { id: 2,  name: "Bob",     department: "Marketing",   salary: 85000,  yearsExp: 5  },
    { id: 3,  name: "Carol",   department: "Engineering", salary: 145000, yearsExp: 12 },
    { id: 4,  name: "Dave",    department: "HR",          salary: 72000,  yearsExp: 3  },
    { id: 5,  name: "Eve",     department: "Engineering", salary: 135000, yearsExp: 10 },
    { id: 6,  name: "Frank",   department: "Marketing",   salary: 91000,  yearsExp: 7  },
    { id: 7,  name: "Grace",   department: "HR",          salary: 78000,  yearsExp: 6  },
    { id: 8,  name: "Hank",    department: "Engineering", salary: 110000, yearsExp: 4  },
];

// 1. Average salary by department
const avgSalaryByDept = employees.reduce((acc, e) => {
    if (!acc[e.department]) acc[e.department] = { total: 0, count: 0 };
    acc[e.department].total += e.salary;
    acc[e.department].count += 1;
    return acc;
}, {});
const avgSalaryResult = Object.fromEntries(
    Object.entries(avgSalaryByDept).map(([dept, { total, count }]) => [dept, Math.round(total / count)])
);
console.log("\n[Employees] Avg salary by dept:", avgSalaryResult);

// 2. Top earner per department
const topEarnerByDept = employees.reduce((acc, e) => {
    if (!acc[e.department] || e.salary > acc[e.department].salary) {
        acc[e.department] = { name: e.name, salary: e.salary };
    }
    return acc;
}, {});
console.log("[Employees] Top earner per dept:", topEarnerByDept);

// 3. Sort by experience descending, return name + years
const byExperience = [...employees]
    .sort((a, b) => b.yearsExp - a.yearsExp)
    .map(e => `${e.name} (${e.yearsExp}y)`);
console.log("[Employees] By experience:", byExperience);

// 4. Band employees: junior (<5y), mid (5–9y), senior (10+y)
const bands = employees.reduce((acc, e) => {
    const band = e.yearsExp < 5 ? "junior" : e.yearsExp < 10 ? "mid" : "senior";
    acc[band] = acc[band] ? [...acc[band], e.name] : [e.name];
    return acc;
}, {});
console.log("[Employees] Experience bands:", bands);

// 5. Total payroll (salary sum)
const totalPayroll = employees.reduce((acc, e) => acc + e.salary, 0);
console.log("[Employees] Total payroll: $" + totalPayroll.toLocaleString());

// 6. Engineers earning above dept average
const engAvg = avgSalaryResult["Engineering"];
const seniorEngineers = employees
    .filter(e => e.department === "Engineering" && e.salary > engAvg)
    .map(e => e.name);
console.log(`[Employees] Engineers above dept avg ($${engAvg.toLocaleString()}):`, seniorEngineers);

// =============================================================================
// FUNCTIONAL SEARCH ALGORITHMS
// =============================================================================

// 1. Binary search (pure, recursive) on a sorted array
const binarySearch = (arr, target, lo = 0, hi = arr.length - 1) => {
    if (lo > hi) return -1;
    const mid = Math.floor((lo + hi) / 2);
    if (arr[mid] === target) return mid;
    return arr[mid] < target
        ? binarySearch(arr, target, mid + 1, hi)
        : binarySearch(arr, target, lo, mid - 1);
};
const sortedRatings = [2, 3, 4, 5, 7, 9, 11, 15, 20];
console.log("\n[Search] Binary search for 7:", binarySearch(sortedRatings, 7));   // 4
console.log("[Search] Binary search for 6:", binarySearch(sortedRatings, 6));    // -1

// 2. Linear search with a predicate (functional style)
const findFirst = (arr, pred) => arr.reduce(
    (found, item) => found !== undefined ? found : pred(item) ? item : undefined,
    undefined
);
const highValueOrder = findFirst(orders, o => o.total > 1000);
console.log("[Search] First order > $1000:", highValueOrder?.id, "total:", highValueOrder?.total);

// 3. Binary search on objects: find movie by id in sorted list
const sortedMovies = [...movies].sort((a, b) => a.id - b.id);
const findMovieById = (id) => {
    const idx = binarySearch(sortedMovies.map(m => m.id), id);
    return idx !== -1 ? sortedMovies[idx] : null;
};
console.log("[Search] Movie id=5:", findMovieById(5)?.title);  // "Mad Max"

// 4. Merge Sort (pure, recursive — divide-and-conquer)
const merge = (left, right, key = null) => {
    const result = [];
    let l = 0, r = 0;
    const val = (x) => key ? x[key] : x;
    while (l < left.length && r < right.length) {
        if (val(left[l]) <= val(right[r])) result.push(left[l++]);
        else result.push(right[r++]);
    }
    return [...result, ...left.slice(l), ...right.slice(r)];
};
const mergeSort = (arr, key = null) => {
    if (arr.length <= 1) return arr;
    const mid = Math.floor(arr.length / 2);
    return merge(mergeSort(arr.slice(0, mid), key), mergeSort(arr.slice(mid), key), key);
};
const sortedByRating = mergeSort(movies, "rating").map(m => `${m.title}(${m.rating})`);
console.log("[Sort] Movies by rating (merge sort):", sortedByRating);

const sortedByPrice = mergeSort(inventory, "price").map(p => `${p.name}($${p.price})`);
console.log("[Sort] Products by price (merge sort):", sortedByPrice);

// =============================================================================
// SHOPPING CART
// — add / remove items, apply coupon, tax, free-shipping threshold
// =============================================================================

const cartItems = [
    { id: 1, name: "Laptop",     price: 1200, qty: 1, category: "Electronics" },
    { id: 2, name: "Mouse",      price: 35,   qty: 2, category: "Electronics" },
    { id: 3, name: "Desk Lamp",  price: 45,   qty: 1, category: "Furniture" },
    { id: 4, name: "USB Hub",    price: 25,   qty: 3, category: "Electronics" },
    { id: 5, name: "Notebook",   price: 8,    qty: 5, category: "Stationery" },
];

const coupons = { SAVE10: 0.10, SAVE20: 0.20, HALFOFF: 0.50 };

const lineTotal   = (item) => item.price * item.qty;
const cartTotal   = (items) => items.reduce((sum, item) => sum + lineTotal(item), 0);
const applyTax    = (rate) => (total) => +(total * (1 + rate)).toFixed(2);
const applyCoupon = (code) => (total) => {
    const rate = coupons[code.toUpperCase()];
    return rate ? +(total * (1 - rate)).toFixed(2) : total;
};
const freeShipping = (threshold) => (total) => total >= threshold ? 0 : 9.99;

const subtotal    = cartTotal(cartItems);
const discounted  = applyCoupon("SAVE10")(subtotal);
const taxed       = applyTax(0.08)(discounted);
const shipping    = freeShipping(500)(subtotal);

console.log("\n[Cart] Subtotal: $" + subtotal.toFixed(2));
console.log("[Cart] After coupon SAVE10: $" + discounted.toFixed(2));
console.log("[Cart] After 8% tax: $" + taxed);
console.log("[Cart] Shipping: $" + shipping);
console.log("[Cart] Grand total: $" + (taxed + shipping).toFixed(2));

// Remove an item by id (pure — returns new array)
const removeFromCart = (items, id) => items.filter(item => item.id !== id);
const cartAfterRemove = removeFromCart(cartItems, 3);
console.log("[Cart] After removing Desk Lamp:", cartAfterRemove.map(i => i.name));

// Update quantity (pure)
const updateQty = (items, id, qty) =>
    items.map(item => item.id === id ? { ...item, qty } : item);
console.log("[Cart] Laptop qty → 2:", updateQty(cartItems, 1, 2).find(i => i.id === 1));

// Group cart items by category
const cartByCategory = cartItems.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || []).concat(item.name);
    return acc;
}, {});
console.log("[Cart] By category:", cartByCategory);

// =============================================================================
// FORM VALIDATION
// — compose validators, return first error or null (Railway-oriented)
// =============================================================================

const isRequired  = (val) => val && val.trim().length > 0 ? null : "Field is required";
const minLength   = (n)   => (val) => val.length >= n ? null : `Min ${n} characters`;
const maxLength   = (n)   => (val) => val.length <= n ? null : `Max ${n} characters`;
const isEmail     = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? null : "Invalid email";
const isPhone     = (val) => /^\+?[\d\s\-()]{7,15}$/.test(val) ? null : "Invalid phone number";
const hasUpper    = (val) => /[A-Z]/.test(val) ? null : "Must contain uppercase letter";
const hasDigit    = (val) => /\d/.test(val) ? null : "Must contain a digit";
const hasSpecial  = (val) => /[!@#$%^&*]/.test(val) ? null : "Must contain special character (!@#$%^&*)";

// Run all validators and collect errors
const validate = (validators) => (val) =>
    validators.map(fn => fn(val)).filter(Boolean);

// Return only the first error (fail-fast)
const validateFirst = (validators) => (val) =>
    validators.reduce((err, fn) => err || fn(val), null);

const emailValidators    = [isRequired, isEmail];
const passwordValidators = [isRequired, minLength(8), hasUpper, hasDigit, hasSpecial];
const nameValidators     = [isRequired, minLength(2), maxLength(50)];

console.log("\n[Validate] Email 'bad-email':", validate(emailValidators)("bad-email"));
console.log("[Validate] Email 'user@example.com':", validate(emailValidators)("user@example.com"));
console.log("[Validate] Password 'weak':", validate(passwordValidators)("weak"));
console.log("[Validate] Password 'Strong1!':", validate(passwordValidators)("Strong1!"));
console.log("[Validate] Name '':", validateFirst(nameValidators)(""));
console.log("[Validate] Phone '+1 800 555-1234':", isPhone("+1 800 555-1234"));

// =============================================================================
// BANK TRANSACTIONS
// — running balance, spending by category, top expense, monthly summary
// =============================================================================

const transactions = [
    { id: 1,  date: "2024-03-01", desc: "Salary",          amount:  5000, type: "credit", category: "Income"       },
    { id: 2,  date: "2024-03-02", desc: "Rent",            amount: -1500, type: "debit",  category: "Housing"      },
    { id: 3,  date: "2024-03-05", desc: "Grocery Store",   amount:  -120, type: "debit",  category: "Food"         },
    { id: 4,  date: "2024-03-07", desc: "Netflix",         amount:   -15, type: "debit",  category: "Entertainment" },
    { id: 5,  date: "2024-03-10", desc: "Freelance gig",   amount:   800, type: "credit", category: "Income"       },
    { id: 6,  date: "2024-03-12", desc: "Restaurant",      amount:   -60, type: "debit",  category: "Food"         },
    { id: 7,  date: "2024-03-15", desc: "Electricity bill",amount:   -90, type: "debit",  category: "Utilities"    },
    { id: 8,  date: "2024-03-18", desc: "Amazon",          amount:  -200, type: "debit",  category: "Shopping"     },
    { id: 9,  date: "2024-03-20", desc: "Gym membership",  amount:   -40, type: "debit",  category: "Health"       },
    { id: 10, date: "2024-03-25", desc: "Coffee Shop",     amount:   -18, type: "debit",  category: "Food"         },
];

// Current balance
const balance = transactions.reduce((acc, t) => acc + t.amount, 0);
console.log("\n[Bank] Current balance: $" + balance.toFixed(2));

// Total spent per category (debits only)
const spendingByCategory = transactions
    .filter(t => t.type === "debit")
    .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
        return acc;
    }, {});
console.log("[Bank] Spending by category:", spendingByCategory);

// Largest single expense
const largestExpense = transactions
    .filter(t => t.type === "debit")
    .reduce((max, t) => Math.abs(t.amount) > Math.abs(max.amount) ? t : max);
console.log("[Bank] Largest expense:", largestExpense.desc, "$" + Math.abs(largestExpense.amount));

// Total income vs total expenses
const { income, expenses } = transactions.reduce((acc, t) => {
    t.type === "credit"
        ? (acc.income   += t.amount)
        : (acc.expenses += Math.abs(t.amount));
    return acc;
}, { income: 0, expenses: 0 });
console.log(`[Bank] Income: $${income}  |  Expenses: $${expenses}  |  Saved: $${income - expenses}`);

// Running balance (like a bank statement)
const runningBalance = transactions.reduce((acc, t) => {
    const prev = acc.length ? acc[acc.length - 1].balance : 0;
    acc.push({ date: t.date, desc: t.desc, balance: +(prev + t.amount).toFixed(2) });
    return acc;
}, []);
console.log("[Bank] Running balance (last 3):", runningBalance.slice(-3));

// =============================================================================
// NOTIFICATIONS
// — mark read, filter by type, badge count, group by type
// =============================================================================

const notifications = [
    { id: 1, type: "message",  text: "Alice sent you a message",      read: false, time: "09:00" },
    { id: 2, type: "alert",    text: "Server CPU at 95%",              read: false, time: "09:05" },
    { id: 3, type: "message",  text: "Bob replied to your comment",    read: true,  time: "09:10" },
    { id: 4, type: "reminder", text: "Team standup in 10 minutes",     read: false, time: "09:15" },
    { id: 5, type: "alert",    text: "Deployment failed on staging",   read: false, time: "09:20" },
    { id: 6, type: "message",  text: "Carol mentioned you in a doc",   read: false, time: "09:25" },
    { id: 7, type: "reminder", text: "Submit weekly report by 5pm",    read: true,  time: "09:30" },
];

const unreadCount  = notifications.filter(n => !n.read).length;
const markAllRead  = (notifs) => notifs.map(n => ({ ...n, read: true }));
const markOneRead  = (notifs, id) => notifs.map(n => n.id === id ? { ...n, read: true } : n);
const byType       = (type)  => notifications.filter(n => n.type === type);
const groupByType  = (notifs) => notifs.reduce((acc, n) => {
    acc[n.type] = (acc[n.type] || 0) + 1;
    return acc;
}, {});

console.log("\n[Notifs] Unread count:", unreadCount);
console.log("[Notifs] Alerts:", byType("alert").map(n => n.text));
console.log("[Notifs] Count by type:", groupByType(notifications));
console.log("[Notifs] After marking id=1 read:", markOneRead(notifications, 1).find(n => n.id === 1));

// =============================================================================
// BLOG POSTS
// — search, filter by tag, group by author, most recent, word count
// =============================================================================

const posts = [
    { id: 1, title: "Getting started with React",      author: "Alice", tags: ["react","javascript"], date: "2024-02-10", body: "React is a UI library built by Meta for building user interfaces." },
    { id: 2, title: "Node.js best practices",          author: "Bob",   tags: ["node","javascript"],  date: "2024-02-15", body: "Always use async await and handle errors properly in Node.js applications." },
    { id: 3, title: "Functional programming in JS",   author: "Alice", tags: ["fp","javascript"],    date: "2024-03-01", body: "Pure functions, immutability, and composition are the pillars of FP." },
    { id: 4, title: "Docker for beginners",            author: "Carol", tags: ["devops","docker"],    date: "2024-03-05", body: "Docker containers package your app and its dependencies together." },
    { id: 5, title: "TypeScript tips and tricks",      author: "Bob",   tags: ["typescript","javascript"], date: "2024-03-10", body: "Use utility types like Partial, Required, and Pick to write safer code." },
    { id: 6, title: "CSS Grid layout guide",           author: "Carol", tags: ["css","frontend"],     date: "2024-03-12", body: "CSS Grid makes two-dimensional layouts easy and intuitive." },
];

const wordCount    = (post)   => post.body.split(/\s+/).length;
const searchPosts  = (query)  => posts.filter(p =>
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.body.toLowerCase().includes(query.toLowerCase())
);
const byTag        = (tag)    => posts.filter(p => p.tags.includes(tag));
const postsByAuthor = posts.reduce((acc, p) => {
    acc[p.author] = (acc[p.author] || 0) + 1;
    return acc;
}, {});
const mostRecent   = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
const withWordCount = posts.map(p => ({ title: p.title, words: wordCount(p) }));

console.log("\n[Blog] Search 'javascript':", searchPosts("javascript").map(p => p.title));
console.log("[Blog] Posts tagged 'javascript':", byTag("javascript").map(p => p.title));
console.log("[Blog] Posts by author:", postsByAuthor);
console.log("[Blog] Most recent:", mostRecent.title, "(" + mostRecent.date + ")");
console.log("[Blog] Word counts:", withWordCount);

// =============================================================================
// STUDENT GRADES
// — pass/fail, letter grade, GPA, class rank, subject averages
// =============================================================================

const students = [
    { id: 1, name: "Alice", grades: { Math: 95, Science: 88, English: 91, History: 84 } },
    { id: 2, name: "Bob",   grades: { Math: 72, Science: 65, English: 70, History: 68 } },
    { id: 3, name: "Carol", grades: { Math: 88, Science: 92, English: 85, History: 90 } },
    { id: 4, name: "Dave",  grades: { Math: 55, Science: 60, English: 58, History: 52 } },
    { id: 5, name: "Eve",   grades: { Math: 100, Science: 98, English: 97, History: 99 } },
];

const average   = (nums) => nums.reduce((a, b) => a + b, 0) / nums.length;
const gpa       = (avg)  => avg >= 90 ? 4.0 : avg >= 80 ? 3.0 : avg >= 70 ? 2.0 : avg >= 60 ? 1.0 : 0.0;
const letterGrade = (avg) => avg >= 90 ? "A" : avg >= 80 ? "B" : avg >= 70 ? "C" : avg >= 60 ? "D" : "F";
const isPassing = (avg)  => avg >= 60;

const withStats = students.map(s => {
    const scores = Object.values(s.grades);
    const avg    = +average(scores).toFixed(1);
    return {
        name:    s.name,
        average: avg,
        grade:   letterGrade(avg),
        gpa:     gpa(avg),
        passing: isPassing(avg),
    };
});

const classRank = [...withStats].sort((a, b) => b.average - a.average)
    .map((s, i) => `#${i + 1} ${s.name} (${s.average})`);

const subjectAverages = Object.keys(students[0].grades).reduce((acc, subject) => {
    const scores = students.map(s => s.grades[subject]);
    acc[subject] = +average(scores).toFixed(1);
    return acc;
}, {});

console.log("\n[Grades] Student stats:", withStats);
console.log("[Grades] Class rank:", classRank);
console.log("[Grades] Subject averages:", subjectAverages);
console.log("[Grades] Failing students:", withStats.filter(s => !s.passing).map(s => s.name));

// =============================================================================
// WEATHER DATA
// — avg temp, hottest/coldest day, group by condition, rain days
// =============================================================================

const weatherData = [
    { date: "2024-03-01", temp: 12, condition: "Sunny",  humidity: 45, windKph: 15, rainMm: 0   },
    { date: "2024-03-02", temp: 9,  condition: "Cloudy", humidity: 60, windKph: 20, rainMm: 0   },
    { date: "2024-03-03", temp: 7,  condition: "Rainy",  humidity: 85, windKph: 25, rainMm: 12  },
    { date: "2024-03-04", temp: 6,  condition: "Rainy",  humidity: 90, windKph: 30, rainMm: 18  },
    { date: "2024-03-05", temp: 11, condition: "Cloudy", humidity: 65, windKph: 18, rainMm: 0   },
    { date: "2024-03-06", temp: 15, condition: "Sunny",  humidity: 40, windKph: 10, rainMm: 0   },
    { date: "2024-03-07", temp: 17, condition: "Sunny",  humidity: 38, windKph: 8,  rainMm: 0   },
    { date: "2024-03-08", temp: 8,  condition: "Stormy", humidity: 92, windKph: 55, rainMm: 30  },
    { date: "2024-03-09", temp: 5,  condition: "Rainy",  humidity: 88, windKph: 22, rainMm: 8   },
    { date: "2024-03-10", temp: 13, condition: "Sunny",  humidity: 42, windKph: 12, rainMm: 0   },
];

const avgTemp      = +average(weatherData.map(d => d.temp)).toFixed(1);
const hottestDay   = weatherData.reduce((max, d) => d.temp > max.temp ? d : max);
const coldestDay   = weatherData.reduce((min, d) => d.temp < min.temp ? d : min);
const totalRainMm  = weatherData.reduce((sum, d) => sum + d.rainMm, 0);
const rainyDays    = weatherData.filter(d => d.rainMm > 0).length;
const byCondition  = weatherData.reduce((acc, d) => {
    acc[d.condition] = (acc[d.condition] || 0) + 1;
    return acc;
}, {});
const comfortIndex = weatherData.map(d => ({
    date: d.date,
    // feels colder with wind: simple wind-chill-like index
    feelsLike: +(d.temp - d.windKph * 0.05).toFixed(1),
}));

console.log("\n[Weather] Avg temp:", avgTemp + "°C");
console.log("[Weather] Hottest:", hottestDay.date, hottestDay.temp + "°C", hottestDay.condition);
console.log("[Weather] Coldest:", coldestDay.date, coldestDay.temp + "°C", coldestDay.condition);
console.log("[Weather] Total rain:", totalRainMm + "mm over", rainyDays, "rainy days");
console.log("[Weather] Days by condition:", byCondition);
console.log("[Weather] Feels-like index:", comfortIndex);

// =============================================================================
// PAGINATION UTILITY
// — paginate any array, get page info, navigate pages
// =============================================================================

const paginate = (items, page, pageSize) => {
    const total      = items.length;
    const totalPages = Math.ceil(total / pageSize);
    const safePage   = Math.max(1, Math.min(page, totalPages));
    const start      = (safePage - 1) * pageSize;
    return {
        data:        items.slice(start, start + pageSize),
        page:        safePage,
        pageSize,
        total,
        totalPages,
        hasNext:     safePage < totalPages,
        hasPrev:     safePage > 1,
    };
};

const allPosts = Array.from({ length: 23 }, (_, i) => ({ id: i + 1, title: `Post ${i + 1}` }));
const page1 = paginate(allPosts, 1, 5);
const page3 = paginate(allPosts, 3, 5);
const pageLast = paginate(allPosts, 99, 5); // clamped to last page

console.log("\n[Paginate] Page 1:", page1);
console.log("[Paginate] Page 3 data:", page3.data);
console.log("[Paginate] Clamped to last page:", pageLast.page, "/", pageLast.totalPages);

// =============================================================================
// STRING UTILITIES — everyday text processing
// =============================================================================

// Mask sensitive data  (credit card, email)
const maskCard  = (cc) => cc.replace(/\d(?=\d{4})/g, "*");
const maskEmail = (email) => {
    const [user, domain] = email.split("@");
    return user.slice(0, 2) + "***@" + domain;
};

// Truncate with ellipsis
const truncate = (str, max) => str.length <= max ? str : str.slice(0, max - 3) + "...";

// Parse query string into object
const parseQS = (qs) =>
    qs.replace(/^\?/, "")
      .split("&")
      .filter(Boolean)
      .reduce((acc, pair) => {
          const [k, v] = pair.split("=");
          acc[decodeURIComponent(k)] = decodeURIComponent(v ?? "");
          return acc;
      }, {});

// Build query string from object
const toQS = (obj) =>
    "?" + Object.entries(obj)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join("&");

// Capitalize each word (title case)
const titleCase = (str) =>
    str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

// Count character frequency in a string
const charFreq = (str) =>
    [...str].reduce((acc, ch) => ({ ...acc, [ch]: (acc[ch] || 0) + 1 }), {});

console.log("\n[String] Masked card:", maskCard("4111111111111234"));
console.log("[String] Masked email:", maskEmail("johndoe@example.com"));
console.log("[String] Truncate:", truncate("Functional programming is powerful", 20));
console.log("[String] Parse QS:", parseQS("?page=2&sort=desc&q=hello%20world"));
console.log("[String] To QS:", toQS({ page: 2, sort: "desc", q: "hello world" }));
console.log("[String] Title case:", titleCase("the quick brown FOX"));
console.log("[String] Char freq:", charFreq("hello"));

// =============================================================================
// CLOSURES & HIGHER-ORDER FUNCTIONS  (the true zero-level foundation)
// A closure is a function that remembers the variables from the scope where
// it was defined, even after that scope has closed.
// =============================================================================

// 1. Counter — closure keeps private state without a class
const makeCounter = (start = 0, step = 1) => {
    let count = start;
    return {
        increment: () => { count += step; return count; },
        decrement: () => { count -= step; return count; },
        reset:     () => { count = start; return count; },
        value:     () => count,
    };
};
const c = makeCounter(0, 2);
console.log("\n[Closure] counter:", c.increment(), c.increment(), c.decrement()); // 2 4 2

// 2. Memoize using closure to cache expensive results
const memoize = (fn) => {
    const cache = new Map();
    return (...args) => {
        const key = JSON.stringify(args);
        if (cache.has(key)) return cache.get(key);
        const result = fn(...args);
        cache.set(key, result);
        return result;
    };
};
const expensiveSqrt = memoize((n) => { /* imagine heavy computation */ return Math.sqrt(n); });
console.log("[Closure] memoized sqrt(144):", expensiveSqrt(144)); // 12  (computed)
console.log("[Closure] memoized sqrt(144):", expensiveSqrt(144)); // 12  (from cache)

// 3. Higher-order functions: functions that take or return functions
const multiplyBy = (factor) => (n) => n * factor;
const half    = multiplyBy(0.5);
const double2 = multiplyBy(2);
const tenX    = multiplyBy(10);
console.log("[HOF] half/double/tenX of 8:", half(8), double2(8), tenX(8)); // 4 16 80

// 4. once — runs fn only the first time, ignores subsequent calls
const once = (fn) => {
    let called = false, result;
    return (...args) => {
        if (!called) { called = true; result = fn(...args); }
        return result;
    };
};
const initDB = once(() => "DB connected!");
console.log("[HOF] once:", initDB(), initDB(), initDB()); // all return "DB connected!"

// 5. after — calls fn only after it has been called N times
const after = (n, fn) => {
    let count = 0;
    return (...args) => { count++; return count >= n ? fn(...args) : undefined; };
};
const notifyAfter3 = after(3, (msg) => `Done: ${msg}`);
console.log("[HOF] after:", notifyAfter3("a"), notifyAfter3("b"), notifyAfter3("c"));
// undefined, undefined, "Done: c"

// 6. debounce — delay fn until N ms after last call (closure tracks timer)
const debounce = (fn, ms) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), ms);
    };
};

// 7. throttle — allow fn at most once per N ms
const throttle = (fn, ms) => {
    let lastCall = 0;
    return (...args) => {
        const now = Date.now();
        if (now - lastCall >= ms) { lastCall = now; return fn(...args); }
    };
};
console.log("[HOF] debounce & throttle defined (browser-use factories)");

// =============================================================================
// POINT-FREE / TACIT STYLE
// Write functions without mentioning the data they operate on.
// Compose named transformations instead of writing `x => fn(x)`.
// =============================================================================

const not      = (fn) => (...args) => !fn(...args);
const flip     = (fn) => (a, b) => fn(b, a);
const always   = (x)  => () => x;
const identity = (x)  => x;

const isOddPF  = not((n) => n % 2 === 0);
const numbers  = [1, 2, 3, 4, 5, 6];

// Point-free: no explicit `n =>` in the filter call
console.log("\n[Point-Free] odd numbers:", numbers.filter(isOddPF));  // [1,3,5]

// flip: reverse argument order — useful when argument order doesn't match a pipeline
const subtract   = (a, b) => a - b;            // subtract(10, 3) = 7
const flippedSub = flip(subtract);              // flippedSub(3, 10) = subtract(10, 3) = 7
console.log("[Point-Free] flip subtract:", flippedSub(3, 10));  // 7

// always / constant: useful as default callbacks
const fillWithZero = [1, 2, 3].map(always(0));
console.log("[Point-Free] always(0):", fillWithZero);  // [0, 0, 0]

// Composing predicates point-free
const both  = (f, g) => (x) => f(x) && g(x);
const either2 = (f, g) => (x) => f(x) || g(x);
const isPositive = (n) => n > 0;
const isLt100   = (n) => n < 100;
const isInRange  = both(isPositive, isLt100);
console.log("[Point-Free] isInRange:", [-5, 0, 42, 101].filter(isInRange));  // [42]

// =============================================================================
// FUNCTORS
// A Functor is any type that implements `map` and obeys two laws:
//   1. Identity:     F.map(x => x)  ===  F
//   2. Composition:  F.map(f).map(g) === F.map(x => g(f(x)))
// Arrays, Maybe, Either are all Functors.
// =============================================================================

// Minimal Box functor
class Box {
    constructor(value) { this._value = value; }
    static of(value)  { return new Box(value); }
    map(fn)           { return Box.of(fn(this._value)); }
    fold(fn)          { return fn(this._value); }   // unwrap
    toString()        { return `Box(${JSON.stringify(this._value)})`; }
}

// Box lets you chain transforms without unwrapping
const result1 = Box.of("  hello world  ")
    .map(s => s.trim())
    .map(s => s.toUpperCase())
    .map(s => s.replace(" ", "_"))
    .fold(s => s);
console.log("\n[Functor] Box pipeline:", result1);  // "HELLO_WORLD"

// Verify Functor laws on Box
const boxVal = Box.of(5);
const fLaw1  = boxVal.map(x => x).fold(identity);         // identity law
const fLaw2a = boxVal.map(x => x + 1).map(x => x * 2).fold(identity);
const fLaw2b = boxVal.map(x => (x + 1) * 2).fold(identity);  // composition law
console.log("[Functor] Identity law holds:", fLaw1 === 5);         // true
console.log("[Functor] Composition law holds:", fLaw2a === fLaw2b); // true

// Task: apply a discount pipeline using Box (real-life functor usage)
const applyPriceBox = (price) =>
    Box.of(price)
        .map(p => p * 0.9)   // 10% member discount
        .map(p => p * 1.08)  // 8% tax
        .map(p => +p.toFixed(2))
        .fold(identity);
console.log("[Functor] Price $100 → member+tax:", applyPriceBox(100)); // 97.20

// =============================================================================
// MONOIDS & SEMIGROUPS
// Semigroup: a type with a binary associative operation  `concat`
// Monoid:    a Semigroup that also has an identity (empty) element
//   Laws — associativity: (a.concat(b)).concat(c) === a.concat(b.concat(c))
//          identity:       a.concat(empty) === a
// =============================================================================

// Sum monoid
const Sum = (value) => ({
    value,
    concat: (other) => Sum(value + other.value),
    toString: () => `Sum(${value})`,
});
Sum.empty = () => Sum(0);

// Product monoid
const Product = (value) => ({
    value,
    concat: (other) => Product(value * other.value),
    toString: () => `Product(${value})`,
});
Product.empty = () => Product(1);

// All / Any (boolean monoids)
const All = (value) => ({
    value,
    concat: (other) => All(value && other.value),
});
All.empty = () => All(true);

const Any = (value) => ({
    value,
    concat: (other) => Any(value || other.value),
});
Any.empty = () => Any(false);

// String monoid (built-in: "" is identity, + is concat)
const First = (value) => ({    // first-wins: ignores subsequent
    value,
    concat: (other) => First(value !== null && value !== undefined ? value : other.value),
});

// Fold a list using a monoid (replaces reduce+identity boilerplate)
const mconcat = (Monoid, list) =>
    list.map(Monoid).reduce((acc, m) => acc.concat(m), Monoid.empty());

const prices  = [10, 25, 5, 40];
console.log("\n[Monoid] Sum:", mconcat(Sum, prices).value);       // 80
console.log("[Monoid] Product:", mconcat(Product, prices).value); // 50000
console.log("[Monoid] All > 0:", mconcat(All, prices.map(p => p > 0)).value); // true
console.log("[Monoid] Any > 30:", mconcat(Any, prices.map(p => p > 30)).value); // true
console.log("[Monoid] String concat:", ["Hello", " ", "World"].reduce((a, b) => a + b, "")); // "Hello World"

// Real-life: aggregate order stats in one reduce using monoids
const orderStats = orders.map(o => ({
    total:  Sum(o.total),
    count:  Sum(1),
    isLarge: Any(o.total > 1000),
})).reduce((acc, cur) => ({
    total:   acc.total.concat(cur.total),
    count:   acc.count.concat(cur.count),
    isLarge: acc.isLarge.concat(cur.isLarge),
}));
console.log("[Monoid] Order stats:", {
    totalRevenue: orderStats.total.value,
    orderCount:   orderStats.count.value,
    hasLargeOrder: orderStats.isLarge.value,
});

// =============================================================================
// MEMOIZATION & LAZY EVALUATION
// =============================================================================

// 1. Memoized fibonacci (exponential → O(n))
const memoFib = memoize(function fib(n) {
    return n <= 1 ? n : memoFib(n - 1) + memoFib(n - 2);
});
console.log("\n[Memo] fib(10):", memoFib(10));  // 55
console.log("[Memo] fib(40):", memoFib(40));    // 102334155 (instant, cached)

// 2. Lazy — wrap a computation, only run it when .get() is called
const Lazy = (fn) => ({
    get:  () => fn(),
    map:  (f) => Lazy(() => f(fn())),
    chain:(f) => Lazy(() => f(fn()).get()),
});

const lazyDouble = Lazy(() => { console.log("[Lazy] computing..."); return 21 * 2; });
// Nothing runs yet
const lazyResult = lazyDouble.map(n => n + 1); // still lazy
console.log("[Lazy] forced:", lazyResult.get()); // logs "computing..." then 43

// 3. Lazy list — generate infinite range, take only what you need
const lazyRange = (start = 0) => ({
    [Symbol.iterator]: function* () {
        let i = start;
        while (true) yield i++;
    }
});
const take = (n, iter) => { const out = []; for (const x of iter) { out.push(x); if (out.length >= n) break; } return out; };
console.log("[Lazy] first 5 from infinite range:", take(5, lazyRange(10))); // [10,11,12,13,14]

// =============================================================================
// TRAMPOLINING
// Solve deep recursion stack-overflow with a trampoline:
// Instead of calling itself, a function returns a thunk (a function).
// The trampoline runner keeps calling the thunk until a plain value is returned.
// =============================================================================

const trampoline = (fn) => (...args) => {
    let result = fn(...args);
    while (typeof result === "function") result = result();
    return result;
};

// Naive factorial blows the stack at ~10 000; trampolined version handles millions
const factTramp = trampoline(function fact(n, acc = 1) {
    return n <= 1 ? acc : () => fact(n - 1, n * acc);
});
console.log("\n[Trampoline] fact(10):", factTramp(10));      // 3628800
console.log("[Trampoline] fact(20000) last digits:", String(factTramp(20000)).slice(-6)); // some digits

// Mutual recursion via trampoline (isEven / isOdd for large N)
// Key: inner impls reference each other directly (not the trampolined wrappers)
// so the single trampoline loop bounces between them without nested calls.
function isEven_impl(n) { return n === 0 ? true  : () => isOdd_impl(n - 1); }
function isOdd_impl(n)  { return n === 0 ? false : () => isEven_impl(n - 1); }
const isEvenT = trampoline(isEven_impl);
const isOddT  = trampoline(isOdd_impl);
console.log("[Trampoline] isEven(10000):", isEvenT(10000)); // true
console.log("[Trampoline] isOdd(10001):",  isOddT(10001));  // true

// =============================================================================
// LENSES
// A Lens is a composable, pure getter+setter pair for immutable nested updates.
// lens(getter, setter) → { view, set, over }
// =============================================================================

const lens = (getter, setter) => ({
    view:  (obj)       => getter(obj),
    set:   (val, obj)  => setter(val, obj),
    over:  (fn, obj)   => setter(fn(getter(obj)), obj),
});

const composeLens = (lensA, lensB) => ({
    view:  (obj)       => lensB.view(lensA.view(obj)),
    set:   (val, obj)  => lensA.over(inner => lensB.set(val, inner), obj),
    over:  (fn, obj)   => lensA.over(inner => lensB.over(fn, inner), obj),
});

// Property lens helper
const lensProp = (key) => lens(
    (obj) => obj[key],
    (val, obj) => ({ ...obj, [key]: val })
);

const user1 = { name: "Alice", address: { city: "NYC", zip: "10001" }, age: 30 };

const nameLens    = lensProp("name");
const addressLens = lensProp("address");
const cityLens    = lensProp("city");
const cityInUser  = composeLens(addressLens, cityLens);

console.log("\n[Lens] view name:", nameLens.view(user1));             // "Alice"
console.log("[Lens] set name:", nameLens.set("Bob", user1).name);    // "Bob"
console.log("[Lens] view city:", cityInUser.view(user1));             // "NYC"
const moved = cityInUser.set("LA", user1);
console.log("[Lens] after move city:", moved.address.city);           // "LA"
console.log("[Lens] original unchanged:", user1.address.city);        // "NYC"
const upperCity = cityInUser.over(s => s.toUpperCase(), user1);
console.log("[Lens] over toUpperCase city:", upperCity.address.city); // "NYC" → "NYC"

// Real-life: update deeply nested config immutably
const appConfig = {
    server: { host: "localhost", port: 3000 },
    db:     { host: "localhost", port: 5432, name: "mydb" },
    debug:  false,
};
const dbPortLens = composeLens(lensProp("db"), lensProp("port"));
const prodConfig = dbPortLens.set(5433, appConfig);
console.log("[Lens] prod db port:", prodConfig.db.port);  // 5433 (original: 5432)

// =============================================================================
// APPLICATIVE FUNCTORS
// Extends Functor: apply a wrapped function to a wrapped value.
//   F.of(fn).ap(F.of(value))  — sequence effects, lift multi-arg functions
// =============================================================================

class Maybe2 {
    constructor(value) { this._value = value; }
    static of(value)   { return new Maybe2(value); }
    isNothing()        { return this._value == null; }
    map(fn)            { return this.isNothing() ? this : Maybe2.of(fn(this._value)); }
    chain(fn)          { return this.isNothing() ? this : fn(this._value); }
    // ap: apply a Maybe-wrapped function to this Maybe-wrapped value
    ap(mFn)            { return mFn.isNothing() ? mFn : this.map(mFn._value); }
    getOrElse(def)     { return this.isNothing() ? def : this._value; }
    toString()         { return this.isNothing() ? "Nothing" : `Just(${this._value})`; }
}

// Lift a binary function into the Maybe context
const liftA2 = (fn, fa, fb) => fb.ap(fa.map(a => b => fn(a, b)));

const safeAdd = (a, b) => a + b;
console.log("\n[Applicative] Just(3) + Just(4):",
    liftA2(safeAdd, Maybe2.of(3), Maybe2.of(4)).getOrElse("fail")); // 7
console.log("[Applicative] Just(3) + Nothing:",
    liftA2(safeAdd, Maybe2.of(3), Maybe2.of(null)).getOrElse("fail")); // "fail"

// Real-life: validate two independent fields, combine results
const safeParseInt = (s) => isNaN(parseInt(s)) ? Maybe2.of(null) : Maybe2.of(parseInt(s));
const quantity  = safeParseInt("3");
const unitPrice = safeParseInt("25");
const lineTotal2 = liftA2((q, p) => q * p, quantity, unitPrice);
console.log("[Applicative] line total:", lineTotal2.getOrElse("invalid input")); // 75

// =============================================================================
// IO MONAD
// Wraps a side-effecting computation so it stays pure until you call .run()
// Lets you compose, map, and chain side effects without executing them.
// =============================================================================

class IO {
    constructor(fn) { this._fn = fn; }
    static of(value) { return new IO(() => value); }
    run()            { return this._fn(); }
    map(fn)          { return new IO(() => fn(this._fn())); }
    chain(fn)        { return new IO(() => fn(this._fn()).run()); }
}

// Pure descriptions of side effects
const readEnv  = (key) => new IO(() => process.env[key] ?? `(no ${key})`);
const logIO    = (msg)  => new IO(() => { console.log("[IO] effect:", msg); return msg; });
const getDate  = new IO(() => new Date().toISOString().slice(0, 10));

// Nothing runs yet — just building a description
const program = getDate
    .map(date => `Report for ${date}`)
    .chain(title => logIO(title).map(() => title + " — DONE"));

// Side effect only fires here:
const finalMsg = program.run();
console.log("\n[IO] result:", finalMsg);

// =============================================================================
// CONTINUATION PASSING STYLE (CPS)
// Instead of returning a value, pass it to a next function (callback).
// Enables: async control flow, early exit, error propagation without throw.
// =============================================================================

// Direct style
const addDirect = (a, b) => a + b;

// CPS style — result goes to the continuation k
const addCPS = (a, b, k) => k(a + b);
const mulCPS = (a, b, k) => k(a * b);

// Chain: (2 + 3) * 4
addCPS(2, 3, sum => mulCPS(sum, 4, result => console.log("\n[CPS] (2+3)*4 =", result))); // 20

// CPS error handling — two continuations: success and failure
const safeDivCPS = (a, b, onSuccess, onError) =>
    b === 0 ? onError("Division by zero") : onSuccess(a / b);

safeDivCPS(10, 2, r => console.log("[CPS] 10/2 =", r), console.error);  // 5
safeDivCPS(10, 0, r => console.log("[CPS] result:", r), e => console.log("[CPS] error:", e)); // error

// CPS pipeline: parse → validate → transform
const parseCPS  = (str, ok, fail) => {
    const n = Number(str);
    isNaN(n) ? fail(`Not a number: ${str}`) : ok(n);
};
const validateCPS = (n, ok, fail) =>
    n > 0 ? ok(n) : fail(`Must be positive: ${n}`);
const transformCPS = (n, ok) => ok(n * n);

parseCPS("5",
    n => validateCPS(n,
        n => transformCPS(n, r => console.log("[CPS] pipeline '5':", r)),   // 25
        console.error),
    console.error
);
parseCPS("abc",
    n => validateCPS(n, n => transformCPS(n, console.log), console.error),
    e => console.log("[CPS] pipeline 'abc':", e)  // Not a number
);

// =============================================================================
// GENERATORS AS LAZY SEQUENCES
// Generators produce values one at a time — infinite sequences without memory.
// =============================================================================

function* range(start, end, step = 1) {
    for (let i = start; i < end; i += step) yield i;
}

function* map2(fn, iter) {
    for (const x of iter) yield fn(x);
}

function* filter2(pred, iter) {
    for (const x of iter) { if (pred(x)) yield x; }
}

function* take2(n, iter) {
    let count = 0;
    for (const x of iter) { if (count++ >= n) break; yield x; }
}

function* zip(iter1, iter2) {
    const it1 = iter1[Symbol.iterator]();
    const it2 = iter2[Symbol.iterator]();
    while (true) {
        const a = it1.next(), b = it2.next();
        if (a.done || b.done) return;
        yield [a.value, b.value];
    }
}

// Infinite Fibonacci generator
function* fibGen() {
    let [a, b] = [0, 1];
    while (true) { yield a; [a, b] = [b, a + b]; }
}

// Lazy pipeline: first 6 even fibonacci numbers squared
// (take FIRST, then filter/map so we don't loop forever on an infinite stream)
const fibSquares = [...map2(
    n => n * n,
    filter2(n => n % 2 === 0, take2(20, fibGen()))   // take 20 fibs, keep evens, square
)];
console.log("\n[Generator] Even fib² (first from 20 fibs):", fibSquares); // [0,4,64,1156,...]

// Lazy range
const squares10 = [...map2(n => n * n, range(1, 11))];
console.log("[Generator] Squares 1–10:", squares10);

// Zip two sequences
const zipped = [...zip(range(1, 4), ["a", "b", "c"])];
console.log("[Generator] Zip:", zipped); // [[1,"a"],[2,"b"],[3,"c"]]

// =============================================================================
// ALGEBRAIC DATA TYPES (ADTs) & PATTERN MATCHING SIMULATION
// ADTs encode domain logic at the type level — impossible states are
// impossible to represent.
// =============================================================================

// --- Sum type: a shape is either a Circle, Rectangle, or Triangle ---
const Circle    = (r)        => ({ type: "Circle",    r });
const Rectangle = (w, h)     => ({ type: "Rectangle", w, h });
const Triangle  = (a, b, c)  => ({ type: "Triangle",  a, b, c });

// Pattern match on the ADT
const area = (shape) => match(shape, {
    Circle:    ({ r })       => Math.PI * r * r,
    Rectangle: ({ w, h })   => w * h,
    Triangle:  ({ a, b, c }) => {  // Heron's formula
        const s = (a + b + c) / 2;
        return Math.sqrt(s * (s - a) * (s - b) * (s - c));
    },
});

const perimeter = (shape) => match(shape, {
    Circle:    ({ r })       => 2 * Math.PI * r,
    Rectangle: ({ w, h })   => 2 * (w + h),
    Triangle:  ({ a, b, c }) => a + b + c,
});

// Generic exhaustive match helper
function match(value, patterns) {
    const handler = patterns[value.type];
    if (!handler) throw new Error(`Unhandled type: ${value.type}`);
    return handler(value);
}

const shapes = [Circle(5), Rectangle(4, 6), Triangle(3, 4, 5)];
shapes.forEach(s => {
    console.log(`\n[ADT] ${s.type} — area: ${area(s).toFixed(2)}, perimeter: ${perimeter(s).toFixed(2)}`);
});

// --- Result type (similar to Either but explicitly Success / Failure) ---
const Success = (value) => ({ type: "Success", value });
const Failure = (error) => ({ type: "Failure", error });

const matchResult = (res, { onSuccess, onFailure }) =>
    res.type === "Success" ? onSuccess(res.value) : onFailure(res.error);

const divideResult = (a, b) =>
    b === 0 ? Failure("Cannot divide by zero") : Success(a / b);

const r1 = matchResult(divideResult(10, 2), {
    onSuccess: v  => `Result: ${v}`,
    onFailure: e  => `Error: ${e}`,
});
const r2 = matchResult(divideResult(10, 0), {
    onSuccess: v  => `Result: ${v}`,
    onFailure: e  => `Error: ${e}`,
});
console.log("\n[ADT] Result:", r1, "|", r2);

// =============================================================================
// Y-COMBINATOR
// Derive recursion without ever naming a function — pure lambda calculus.
// Y = λf.(λx.f(x x))(λx.f(x x))
// =============================================================================

// Applicative-order Y (works in strict languages like JS)
const Y = (f) => ((x) => f((v) => x(x)(v)))((x) => f((v) => x(x)(v)));

const factY  = Y((self) => (n) => n <= 1 ? 1 : n * self(n - 1));
const fibY   = Y((self) => (n) => n <= 1 ? n : self(n - 1) + self(n - 2));
const sumY   = Y((self) => (n) => n <= 0 ? 0 : n + self(n - 1));

console.log("\n[Y] factorial(7):", factY(7));   // 5040
console.log("[Y] fib(8):", fibY(8));            // 21  (kept small — Y has no memoization)
console.log("[Y] sum(100):", sumY(100));         // 5050

// =============================================================================
// STATE MONAD
// Thread mutable state through pure functions without mutation.
// State s a = State { runState :: s -> (a, s) }
// =============================================================================

class State {
    constructor(run) { this._run = run; }
    static of(value) { return new State(s => [value, s]); }

    runState(initialState)  { return this._run(initialState); }
    evalState(initialState) { return this._run(initialState)[0]; }  // result only
    execState(initialState) { return this._run(initialState)[1]; }  // state only

    map(fn) {
        return new State(s => {
            const [a, s2] = this._run(s);
            return [fn(a), s2];
        });
    }
    chain(fn) {
        return new State(s => {
            const [a, s2] = this._run(s);
            return fn(a)._run(s2);
        });
    }
}

// Primitives
const getState = new State(s => [s, s]);
const putState = (newS)  => new State(() => [null, newS]);
const modifyState = (fn) => new State(s => [null, fn(s)]);

// Example: shopping cart as State monad
const addToCart   = (item) => modifyState(cart => [...cart, item]);
const removeCart  = (name) => modifyState(cart => cart.filter(i => i.name !== name));
const getCartTotal = getState.map(cart => cart.reduce((s, i) => s + i.price, 0));

const cartProgram = addToCart({ name: "Laptop",  price: 1200 })
    .chain(() => addToCart({ name: "Mouse",   price: 35   }))
    .chain(() => addToCart({ name: "Monitor", price: 600  }))
    .chain(() => removeCart("Mouse"))
    .chain(() => getCartTotal);

const [total, finalCart] = cartProgram.runState([]);
console.log("\n[State] Cart total:", total);                       // 1800
console.log("[State] Final cart:", finalCart.map(i => i.name));   // [Laptop, Monitor]

// Example: stateful counter with log
const incrementS = modifyState(({ count, log }) => ({
    count: count + 1,
    log:   [...log, `incremented to ${count + 1}`],
}));

const counterProgram = incrementS
    .chain(() => incrementS)
    .chain(() => incrementS)
    .chain(() => getState);

const [_, counterState] = counterProgram.runState({ count: 0, log: [] });
console.log("[State] Counter:", counterState.count, "| Log:", counterState.log);

// =============================================================================
// READER MONAD  (Dependency Injection, FP-style)
// Reader e a = Reader { runReader :: e -> a }
// Carry a shared environment (config, db, logger) through a call chain
// without passing it explicitly at every step.
// =============================================================================

class Reader {
    constructor(run)   { this._run = run; }
    static of(value)   { return new Reader(() => value); }
    static ask()       { return new Reader(env => env); }
    runReader(env)     { return this._run(env); }

    map(fn) {
        return new Reader(env => fn(this._run(env)));
    }
    chain(fn) {
        return new Reader(env => fn(this._run(env)).runReader(env));
    }
}

// Primitives
const ask    = Reader.ask();   // gives you the env
const asks   = (fn) => ask.map(fn);  // project a field from env

// Application: email service that reads config from environment
const getApiUrl      = asks(env => env.apiUrl);
const getApiKey      = asks(env => env.apiKey);
const getMaxRetries  = asks(env => env.maxRetries);

const buildRequest = getApiUrl.chain(url =>
    getApiKey.chain(key =>
        getMaxRetries.map(retries => ({
            url,
            headers:  { Authorization: `Bearer ${key}` },
            retries,
        }))
    )
);

const devEnv  = { apiUrl: "http://localhost:3000", apiKey: "dev-key-123",  maxRetries: 1 };
const prodEnv = { apiUrl: "https://api.example.com", apiKey: "prod-key-xyz", maxRetries: 3 };

console.log("\n[Reader] Dev request:",  buildRequest.runReader(devEnv));
console.log("[Reader] Prod request:", buildRequest.runReader(prodEnv));

// Real-life: DB query builder that reads a db connection from env
const queryUsers = asks(env => env.db).map(db => db.query("SELECT * FROM users"));
const fakeDb     = { query: (sql) => `[${sql}] → [Alice, Bob, Carol]` };
console.log("[Reader] DB result:", queryUsers.runReader({ db: fakeDb }));

// =============================================================================
// MONAD LAWS  (verify your Monads are correct)
// 1. Left identity:   M.of(a).chain(f)  ≡  f(a)
// 2. Right identity:  m.chain(M.of)     ≡  m
// 3. Associativity:   m.chain(f).chain(g) ≡ m.chain(x => f(x).chain(g))
// =============================================================================

// Re-using Maybe from earlier (defined at the top as `class Maybe`)
const checkLaws = (MonadClass, label) => {
    const a  = 42;
    const m  = MonadClass.of(a);
    const f  = (x) => MonadClass.of(x + 1);
    const g  = (x) => MonadClass.of(x * 2);
    const getV = (mx) => mx.getOrElse !== undefined ? mx.getOrElse(null) : mx.evalState(null);

    const leftId  = getV(MonadClass.of(a).chain(f)) === getV(f(a));
    const rightId = getV(m.chain(MonadClass.of)) === getV(m);
    const assocL  = getV(m.chain(f).chain(g));
    const assocR  = getV(m.chain(x => f(x).chain(g)));

    console.log(`\n[Laws] ${label}:`);
    console.log(`  Left identity:   ${leftId}`);
    console.log(`  Right identity:  ${rightId}`);
    console.log(`  Associativity:   ${assocL === assocR}`);
};

checkLaws(Maybe, "Maybe");    // all true
checkLaws(Maybe2, "Maybe2");  // all true