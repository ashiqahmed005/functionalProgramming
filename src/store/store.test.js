import { describe, it, expect, beforeEach } from 'vitest';
import { createStore }           from './createStore.js';
import { reducer, initialState } from './reducer.js';
import { Actions, ActionTypes }  from './actions.js';
import { Selectors }             from './selectors.js';

// ── createStore ───────────────────────────────────────────────────────────────
describe('createStore', () => {
  it('returns getState, dispatch, subscribe', () => {
    const store = createStore(reducer, initialState);
    expect(typeof store.getState).toBe('function');
    expect(typeof store.dispatch).toBe('function');
    expect(typeof store.subscribe).toBe('function');
  });

  it('initialises state via @@INIT', () => {
    const store = createStore(reducer, initialState);
    expect(store.getState().sidebarOpen).toBe(true);
  });

  it('notifies subscriber on state change', () => {
    const store = createStore(reducer, initialState);
    let called = 0;
    store.subscribe(() => called++);
    store.dispatch(Actions.navigate('map'));
    expect(called).toBe(1);
  });

  it('does NOT notify subscriber when state is unchanged', () => {
    const store = createStore(reducer, { ...initialState, activePanel: 'map' });
    let called = 0;
    store.subscribe(() => called++);
    store.dispatch(Actions.navigate('map')); // same panel — identity return
    expect(called).toBe(0);
  });

  it('unsubscribe stops notifications', () => {
    const store = createStore(reducer, initialState);
    let called = 0;
    const unsub = store.subscribe(() => called++);
    unsub();
    store.dispatch(Actions.navigate('map'));
    expect(called).toBe(0);
  });

  it('throws on invalid action', () => {
    const store = createStore(reducer, initialState);
    expect(() => store.dispatch(null)).toThrow();
    expect(() => store.dispatch({ noType: true })).toThrow();
  });
});

// ── reducer ───────────────────────────────────────────────────────────────────
describe('reducer', () => {
  it('returns initial state for unknown action', () => {
    const state = reducer(undefined, { type: '@@UNKNOWN' });
    expect(state).toEqual(initialState);
  });

  it('NAVIGATE sets activePanel', () => {
    const state = reducer(initialState, Actions.navigate('map'));
    expect(state.activePanel).toBe('map');
  });

  it('NAVIGATE is a no-op when already on that panel', () => {
    const base  = { ...initialState, activePanel: 'map' };
    const state = reducer(base, Actions.navigate('map'));
    expect(state).toBe(base); // reference equality — no new object
  });

  it('TOGGLE_SIDEBAR flips sidebarOpen', () => {
    const s1 = reducer(initialState, Actions.toggleSidebar());
    expect(s1.sidebarOpen).toBe(false);
    const s2 = reducer(s1, Actions.toggleSidebar());
    expect(s2.sidebarOpen).toBe(true);
  });

  it('TOGGLE_CATEGORY adds a closed category', () => {
    const state = reducer(initialState, Actions.toggleCategory('advanced'));
    expect(state.openCategories).toContain('advanced');
  });

  it('TOGGLE_CATEGORY removes an open category', () => {
    const state = reducer(initialState, Actions.toggleCategory('fundamentals'));
    expect(state.openCategories).not.toContain('fundamentals');
  });

  it('OPEN_CATEGORY does not duplicate', () => {
    const state = reducer(initialState, Actions.openCategory('fundamentals'));
    expect(state).toBe(initialState); // unchanged reference
  });

  it('OPEN_CATEGORY adds a new category', () => {
    const state = reducer(initialState, Actions.openCategory('advanced'));
    expect(state.openCategories).toContain('advanced');
  });

  it('SET_SEARCH updates searchQuery', () => {
    const state = reducer(initialState, Actions.setSearch('curry'));
    expect(state.searchQuery).toBe('curry');
  });

  it('MOUNT_PANEL adds panelId to mountedPanels Set', () => {
    const state = reducer(initialState, Actions.mountPanel('map'));
    expect(state.mountedPanels.has('map')).toBe(true);
  });

  it('MOUNT_PANEL is idempotent', () => {
    const s1 = reducer(initialState, Actions.mountPanel('map'));
    const s2 = reducer(s1, Actions.mountPanel('map'));
    expect(s2).toBe(s1); // same reference — Set already had the id
  });
});

// ── Actions ───────────────────────────────────────────────────────────────────
describe('Actions', () => {
  it('navigate produces correct shape', () => {
    expect(Actions.navigate('filter')).toEqual({ type: ActionTypes.NAVIGATE, payload: 'filter' });
  });

  it('toggleSidebar has no payload', () => {
    const a = Actions.toggleSidebar();
    expect(a.type).toBe(ActionTypes.TOGGLE_SIDEBAR);
    expect('payload' in a).toBe(false);
  });

  it('setSearch carries the query', () => {
    expect(Actions.setSearch('map').payload).toBe('map');
  });
});

// ── Selectors ─────────────────────────────────────────────────────────────────
describe('Selectors', () => {
  let state;
  beforeEach(() => {
    state = reducer(initialState, Actions.navigate('curry'));
    state = reducer(state, Actions.mountPanel('curry'));
  });

  it('activePanel returns current panel', () => {
    expect(Selectors.activePanel(state)).toBe('curry');
  });

  it('isMounted returns true for mounted panel', () => {
    expect(Selectors.isMounted(state, 'curry')).toBe(true);
  });

  it('isMounted returns false for unmounted panel', () => {
    expect(Selectors.isMounted(state, 'map')).toBe(false);
  });

  it('isCategoryOpen returns true for open category', () => {
    expect(Selectors.isCategoryOpen(state, 'fundamentals')).toBe(true);
  });

  it('visitedCount reflects Set size', () => {
    expect(Selectors.visitedCount(state)).toBe(1);
  });
});
