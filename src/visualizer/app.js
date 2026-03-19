// ── Store ────────────────────────────────────────────────────────────────────
import { createStore }           from '../store/createStore.js';
import { reducer, initialState } from '../store/reducer.js';
import { Actions }               from '../store/actions.js';
import { Selectors }             from '../store/selectors.js';
import { highlightPanel }        from './highlight.js';

// ── Panel imports ────────────────────────────────────────────────────────────
import mapPanel         from './panels/map.js';
import filterPanel      from './panels/filter.js';
import reducePanel      from './panels/reduce.js';
import traversalPanel   from './panels/traversal.js';
import curryPanel       from './panels/curry.js';
import composePanel     from './panels/compose.js';
import closuresPanel    from './panels/closures.js';
import pointfreePanel   from './panels/pointfree.js';
import maybePanel       from './panels/maybe.js';
import eitherPanel      from './panels/either.js';
import functorsPanel    from './panels/functors.js';
import applicativePanel from './panels/applicative.js';
import ioPanel          from './panels/io.js';
import statePanel       from './panels/state-monad.js';
import readerPanel      from './panels/reader-monad.js';
import monadsPanel      from './panels/monoids.js';
import memoizePanel     from './panels/memoize.js';
import trampolinePanel  from './panels/trampoline.js';
import lensesPanel      from './panels/lenses.js';
import cpsPanel         from './panels/cps.js';
import generatorsPanel  from './panels/generators.js';
import adtPanel         from './panels/adt.js';
import yPanel           from './panels/ycombinator.js';
import recursionPanel   from './panels/recursion.js';
import transducersPanel from './panels/transducers.js';
import monadLawsPanel   from './panels/monad-laws.js';
import greedyPanel      from './panels/greedy.js';
import cartPanel        from './panels/cart.js';
import validationPanel  from './panels/validation.js';
import bankPanel        from './panels/bank.js';
import reallifePanel    from './panels/reallife.js';

// ── Static config (not state — never changes at runtime) ─────────────────────
const CATEGORIES = [
  { id: 'fundamentals', emoji: '📦', label: 'Fundamentals',
    panels: [mapPanel, filterPanel, reducePanel, traversalPanel] },
  { id: 'core-fp',      emoji: '⚙️',  label: 'Core FP',
    panels: [curryPanel, composePanel, closuresPanel, pointfreePanel] },
  { id: 'containers',   emoji: '🧩', label: 'Containers & Monads',
    panels: [maybePanel, eitherPanel, functorsPanel, applicativePanel, ioPanel, statePanel, readerPanel] },
  { id: 'advanced',     emoji: '🚀', label: 'Advanced FP',
    panels: [monadsPanel, memoizePanel, trampolinePanel, lensesPanel, cpsPanel,
             generatorsPanel, adtPanel, yPanel, recursionPanel, transducersPanel, monadLawsPanel] },
  { id: 'algorithms',   emoji: '🧮', label: 'Algorithms',
    panels: [greedyPanel] },
  { id: 'reallife',     emoji: '🌍', label: 'Real-life FP',
    panels: [cartPanel, validationPanel, bankPanel, reallifePanel] },
];

const ALL_PANELS  = CATEGORIES.flatMap(c => c.panels);
const PANEL_COUNT = ALL_PANELS.length;

// ── Bootstrap ────────────────────────────────────────────────────────────────
export function initApp() {
  // 1. Create the store — single source of truth
  const store = createStore(reducer, initialState);

  // 2. Build static DOM (panels + sidebar) — done once, never rebuilt
  buildPanels();
  buildSidebar();

  // 3. Wire events → dispatch (no state read here, just intent)
  wireEvents(store);

  // 4. Subscribe: every state change → targeted DOM patch
  store.subscribe((state, prevState) => render(state, prevState));

  // 5. Navigate to the first panel
  store.dispatch(Actions.navigate(ALL_PANELS[0].id));


  // ── DOM builders (run once on startup) ──────────────────────────────────

  function buildPanels() {
    const main = document.getElementById('main');
    document.querySelector('.header-stat').innerHTML =
      `<span>${PANEL_COUNT}</span> topics`;

    ALL_PANELS.forEach((panel, idx) => {
      const cat = CATEGORIES.find(c => c.panels.includes(panel));

      const panelEl = document.createElement('div');
      panelEl.className = 'panel';
      panelEl.id = `panel-${panel.id}`;

      // Topbar: breadcrumb + prev / next
      const topbar = document.createElement('div');
      topbar.className = 'panel-topbar';
      topbar.innerHTML = `
        <div class="panel-breadcrumb">
          <span>${cat.emoji} ${cat.label}</span>
          <span class="sep">/</span>
          <span class="current">${panel.label}</span>
        </div>
        <div class="panel-nav">
          <button class="panel-nav-btn" data-dir="prev" ${idx === 0 ? 'disabled' : ''}>← prev</button>
          <button class="panel-nav-btn" data-dir="next" ${idx === PANEL_COUNT - 1 ? 'disabled' : ''}>next →</button>
        </div>`;

      // Prev / next dispatch — pure intent, store decides what to do
      topbar.querySelector('[data-dir="prev"]').addEventListener('click', () => {
        if (idx > 0) store.dispatch(Actions.navigate(ALL_PANELS[idx - 1].id));
      });
      topbar.querySelector('[data-dir="next"]').addEventListener('click', () => {
        if (idx < PANEL_COUNT - 1) store.dispatch(Actions.navigate(ALL_PANELS[idx + 1].id));
      });

      const body = document.createElement('div');
      body.className = 'panel-body';
      body.innerHTML = panel.html();

      panelEl.appendChild(topbar);
      panelEl.appendChild(body);
      main.appendChild(panelEl);
    });
  }

  function buildSidebar() {
    const container = document.getElementById('sidebar');

    // Search
    const searchEl = document.createElement('div');
    searchEl.className = 'sidebar-search';
    searchEl.innerHTML = `
      <div class="sidebar-search-wrap">
        <span class="sidebar-search-icon">⌕</span>
        <input id="sidebar-search" type="search" placeholder="Search topics…"
               autocomplete="off" spellcheck="false">
      </div>`;
    container.appendChild(searchEl);

    // Nav
    const nav = document.createElement('div');
    nav.className = 'sidebar-nav';
    container.appendChild(nav);

    CATEGORIES.forEach(cat => {
      const section = document.createElement('div');
      section.className = 'nav-category';
      section.dataset.cat = cat.id;

      const hdr = document.createElement('button');
      hdr.className = 'nav-cat-header';
      hdr.innerHTML = `
        <span class="nav-cat-emoji">${cat.emoji}</span>
        <span class="nav-cat-name">${cat.label}</span>
        <span class="nav-cat-badge">${cat.panels.length}</span>
        <span class="nav-cat-chevron">▾</span>`;
      // Dispatch — no DOM mutation here
      hdr.addEventListener('click', () =>
        store.dispatch(Actions.toggleCategory(cat.id)));

      const list = document.createElement('div');
      list.className = 'nav-panel-list';

      // Single delegated listener — avoids one handler per button
      list.addEventListener('click', e => {
        const btn = e.target.closest('[data-panel]');
        if (btn) store.dispatch(Actions.navigate(btn.dataset.panel));
      });

      cat.panels.forEach(panel => {
        const btn = document.createElement('button');
        btn.className = 'nav-panel-btn';
        btn.textContent = panel.label;
        btn.dataset.panel = panel.id;
        list.appendChild(btn);
      });

      section.appendChild(hdr);
      section.appendChild(list);
      nav.appendChild(section);
    });

    // Footer
    const footer = document.createElement('div');
    footer.className = 'sidebar-footer';
    footer.innerHTML = `<span class="sidebar-footer-dot"></span>${PANEL_COUNT} topics`;
    container.appendChild(footer);
  }

  // ── Event wiring (dispatch only — never touch state here) ──────────────

  function wireEvents(store) {
    // Sidebar toggle
    document.getElementById('sidebar-toggle').addEventListener('click', () =>
      store.dispatch(Actions.toggleSidebar()));

    // Search — debounced so we don't dispatch on every keystroke
    const debounce = (fn, ms) => {
      let timer;
      return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), ms); };
    };
    document.getElementById('sidebar-search').addEventListener('input',
      debounce(e => store.dispatch(Actions.setSearch(e.target.value.toLowerCase().trim())), 150));
  }

  // ── Render — the only function allowed to touch the DOM ─────────────────
  //
  // Called every time state changes.
  // Each section compares prev vs next to avoid unnecessary DOM work.

  function render(state, prevState) {

    // 1. Active panel visibility
    if (state.activePanel !== prevState.activePanel) {
      renderActivePanel(state.activePanel, prevState.activePanel);
    }

    // 2. Sidebar open/collapsed
    if (state.sidebarOpen !== prevState.sidebarOpen) {
      renderSidebar(state.sidebarOpen);
    }

    // 3. Category open/closed state
    if (state.openCategories !== prevState.openCategories) {
      renderCategories(state.openCategories, prevState.openCategories);
    }

    // 4. Search filter
    if (state.searchQuery !== prevState.searchQuery) {
      renderSearch(state.searchQuery);
    }
  }

  function renderActivePanel(activeId, prevId) {
    // Hide previous
    if (prevId) {
      document.getElementById(`panel-${prevId}`)?.classList.remove('active');
      document.querySelector(`.nav-panel-btn[data-panel="${prevId}"]`)
        ?.classList.remove('active');
    }

    // Show next
    const panelEl = document.getElementById(`panel-${activeId}`);
    panelEl?.classList.add('active');
    document.querySelector(`.nav-panel-btn[data-panel="${activeId}"]`)
      ?.classList.add('active');

    // Ensure the panel's category is open
    const cat = CATEGORIES.find(c => c.panels.some(p => p.id === activeId));
    if (cat) store.dispatch(Actions.openCategory(cat.id));

    // Lazy mount — dispatch MOUNT_PANEL so reducer tracks it in state
    const state = store.getState();
    if (panelEl && !Selectors.isMounted(state, activeId)) {
      const panel  = ALL_PANELS.find(p => p.id === activeId);
      const bodyEl = panelEl.querySelector('.panel-body');
      try {
        panel?.mount(bodyEl);
        store.dispatch(Actions.mountPanel(activeId));
        highlightPanel(panelEl);
      } catch (err) {
        bodyEl.innerHTML = `<p class="panel-error">Panel failed to load: ${err.message}</p>`;
        console.error(`[panel:${activeId}]`, err);
      }
    }

    // Scroll
    document.getElementById('main').scrollTop = 0;
    document.querySelector(`.nav-panel-btn[data-panel="${activeId}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }

  function renderSidebar(isOpen) {
    document.getElementById('sidebar')
      .classList.toggle('collapsed', !isOpen);
  }

  function renderCategories(nextOpen, prevOpen) {
    // Add newly opened categories
    nextOpen.forEach(catId => {
      if (!prevOpen.includes(catId)) {
        document.querySelector(`.nav-category[data-cat="${catId}"]`)
          ?.classList.add('open');
      }
    });
    // Remove newly closed categories
    prevOpen.forEach(catId => {
      if (!nextOpen.includes(catId)) {
        document.querySelector(`.nav-category[data-cat="${catId}"]`)
          ?.classList.remove('open');
      }
    });
  }

  function renderSearch(query) {
    const nav = document.querySelector('.sidebar-nav');
    let anyMatch = false;

    document.querySelectorAll('.nav-category').forEach(section => {
      let catMatch = false;
      section.querySelectorAll('.nav-panel-btn').forEach(btn => {
        const visible = !query || btn.textContent.toLowerCase().includes(query);
        btn.style.display = visible ? '' : 'none';
        if (visible) { catMatch = true; anyMatch = true; }
      });
      section.style.display = catMatch ? '' : 'none';
      if (query && catMatch) {
        store.dispatch(Actions.openCategory(section.dataset.cat));
      }
    });

    let empty = nav.querySelector('.sidebar-empty');
    if (!anyMatch && query) {
      if (!empty) {
        empty = document.createElement('div');
        empty.className = 'sidebar-empty';
        nav.appendChild(empty);
      }
      empty.textContent = `No results for "${query}"`;
    } else {
      empty?.remove();
    }
  }
}
