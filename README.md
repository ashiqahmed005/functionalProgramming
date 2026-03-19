# FP Visualizer

An interactive, browser-based visualizer for learning Functional Programming in JavaScript — from first principles to advanced patterns.

![CI](https://github.com/ashiq/fp-visualizer/actions/workflows/node.js.yml/badge.svg) ![Tech](https://img.shields.io/badge/Vite-5-646CFF?logo=vite) ![Tests](https://img.shields.io/badge/Vitest-4-6E9F18?logo=vitest) ![ESLint](https://img.shields.io/badge/ESLint-10-4B32C3?logo=eslint) ![License](https://img.shields.io/badge/license-MIT-green)

---

## What's inside

31 interactive panels organized into 6 categories:

| Category | Panels |
|----------|--------|
| **Fundamentals** | map, filter, reduce, tree traversal |
| **Core FP** | currying, compose/pipe, closures, point-free |
| **Containers & Monads** | Maybe, Either, Functors, Applicative, IO, State, Reader |
| **Advanced FP** | Monoids, Memoize, Trampoline, Lenses, CPS, Generators, ADT, Y-Combinator, Recursion, Transducers, Monad Laws |
| **Algorithms** | Greedy |
| **Real-life FP** | Shopping cart, Form validation, Bank account, Real-world pipelines |

Each panel includes:
- **Live controls** — tweak inputs and watch the output change
- **Step-by-step animation** with adjustable speed
- **Collapsible source code** with syntax highlighting

---

## Getting started

```bash
npm install
npm run dev        # start dev server at http://localhost:5173
```

Open `http://localhost:5173` in your browser. Use the sidebar to navigate topics.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server (hot reload) |
| `npm run build` | Production build → single self-contained `dist/index.html` |
| `npm run preview` | Preview the production build locally |
| `npm test` | Run unit tests (Vitest, Node mode) |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Lint `src/` with ESLint |
| `npm run lint:fix` | Auto-fix lint warnings |

---

## Architecture

```
src/
├── main.js                     Entry point
├── styles/main.css             Design tokens + global styles
├── store/
│   ├── createStore.js          Redux-pattern store factory
│   ├── actions.js              Action types + action creators
│   ├── reducer.js              Pure reducer (state machine)
│   ├── selectors.js            Pure state selectors
│   └── store.test.js           Unit tests (25 tests)
├── concepts/                   Pure FP implementations (no side effects)
│   ├── arrays.js
│   ├── composition.js
│   ├── currying.js
│   ├── maybe.js
│   ├── either.js
│   └── ...
└── visualizer/
    ├── app.js                  App shell — wires store → DOM
    ├── highlight.js            Syntax highlighting (highlight.js)
    ├── utils/ui.js             Shared DOM helpers
    ├── app.browser.test.js     Browser tests — sidebar, nav, search
    └── panels/
        ├── map.js              One file per topic
        ├── filter.js
        ├── curry.js
        └── ...
```

### State management

The app uses a hand-rolled Redux-pattern store with zero external dependencies:

```
User event → dispatch(action) → reducer(state, action) → newState → render diff
```

- **`createStore`** — getState / dispatch / subscribe, with dispatch guard and reference-equality notification
- **`reducer`** — pure function, no mutations, early-return identity optimization
- **`Actions`** — frozen object of action creators, single source of truth for action type strings
- **`Selectors`** — pure functions that components use instead of reaching into state directly
- **Lazy mounting** — `panel.mount()` is called once on first visit, tracked in a `Set` in state

### Panel interface

Every panel exports a plain object:

```js
export default {
  id:    'unique-id',      // used for routing and DOM ids
  label: 'Display name',  // shown in sidebar and breadcrumb
  html:  () => `...`,     // returns static HTML string (called once)
  mount: (el) => { ... }, // wires events, starts animation (called once)
};
```

---

## Build output

`npm run build` produces a **single self-contained `dist/index.html`** (~235 KB gzipped: 63 KB) using `vite-plugin-singlefile`. No external asset requests — the file opens directly from the filesystem (`file://`) without a web server.

---

## Testing

```bash
npm test          # unit tests only (Node, ~85ms)
npm run test:watch
```

**Unit tests** (`src/store/store.test.js`) — 25 tests covering:
- `createStore` — init, dispatch, subscribe, unsubscribe, guard against invalid actions
- `reducer` — all action types, identity returns, idempotence
- `Actions` — shape and payload of every action creator
- `Selectors` — all selectors against known state

**Browser tests** (`*.browser.test.js`) — run in real Chromium via Playwright/Vitest browser mode, covering sidebar toggle, panel navigation, search filtering, and panel mount/animation. Configure in `vite.config.js` under `test.projects`.

---

## Tech stack

| Tool | Purpose |
|------|---------|
| [Vite 5](https://vitejs.dev) | Dev server + bundler |
| [vite-plugin-singlefile](https://github.com/richardtallent/vite-plugin-singlefile) | Inline all assets into one HTML file |
| [highlight.js](https://highlightjs.org) | Syntax highlighting in source panels |
| [Vitest 4](https://vitest.dev) | Unit + browser testing |
| [Playwright](https://playwright.dev) | Browser test runner |
| [ESLint 10](https://eslint.org) | Code quality (flat config) |

---

## Design decisions

- **No framework** — vanilla JS + CSS custom properties. The DOM API is the framework.
- **No external state library** — the Redux pattern is implemented from scratch as a learning exercise.
- **No `eval()`** — dynamic expressions use safe lookup tables keyed by the select option value.
- **`insertAdjacentHTML`** over `innerHTML +=` — avoids re-parsing the entire log container on every append.
- **`Set` for `mountedPanels`** — O(1) `.has()` lookup vs O(n) `.includes()` as panel count grows.
- **Event delegation** — one click listener on the nav container instead of one per panel button.
- **Debounced search** — 150ms debounce prevents dispatching on every keystroke.
- **Panel error boundary** — `try/catch` around `panel.mount()` so one broken panel can't crash the app.

---

## License

[MIT](LICENSE) © 2026 Ashiq
