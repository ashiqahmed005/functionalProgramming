import { ActionTypes } from './actions.js';

/**
 * initialState — the single source of truth for all app state.
 *
 * Shape:
 *   activePanel     string | null   — which panel is visible
 *   openCategories  string[]        — which sidebar categories are expanded
 *   sidebarOpen     boolean         — sidebar visible or hidden
 *   searchQuery     string          — sidebar filter text
 *   mountedPanels   Set<string>     — panels whose mount() has run (immutable once added)
 */
export const initialState = {
  activePanel:    null,
  openCategories: ['fundamentals'],   // first category open on load
  sidebarOpen:    true,
  searchQuery:    '',
  mountedPanels:  new Set(),
};

/**
 * reducer — pure function: (state, action) => newState
 *
 * Rules:
 *   - Never mutate state — always return a new object
 *   - No side effects (no DOM, no fetch, no console.log)
 *   - Unknown actions return state unchanged (Redux convention)
 */
export function reducer(state = initialState, action) {
  switch (action.type) {

    case ActionTypes.NAVIGATE: {
      const panelId = action.payload;
      if (panelId === state.activePanel) return state;
      return { ...state, activePanel: panelId };
    }

    case ActionTypes.OPEN_CATEGORY: {
      const catId = action.payload;
      if (state.openCategories.includes(catId)) return state;
      return { ...state, openCategories: [...state.openCategories, catId] };
    }

    case ActionTypes.TOGGLE_CATEGORY: {
      const catId = action.payload;
      const isOpen = state.openCategories.includes(catId);
      return {
        ...state,
        openCategories: isOpen
          ? state.openCategories.filter(id => id !== catId)
          : [...state.openCategories, catId],
      };
    }

    case ActionTypes.TOGGLE_SIDEBAR:
      return { ...state, sidebarOpen: !state.sidebarOpen };

    case ActionTypes.SET_SEARCH:
      return { ...state, searchQuery: action.payload };

    case ActionTypes.MOUNT_PANEL: {
      const panelId = action.payload;
      if (state.mountedPanels.has(panelId)) return state;
      const next = new Set(state.mountedPanels);
      next.add(panelId);
      return { ...state, mountedPanels: next };
    }

    default:
      return state;
  }
}
