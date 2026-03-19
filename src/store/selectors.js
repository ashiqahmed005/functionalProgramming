/**
 * Selectors — pure functions that derive values from state.
 *
 * Benefits:
 *   - Components never reach into state shape directly
 *   - Easy to memoize if needed
 *   - Rename a state key → fix one selector, not every component
 */

export const Selectors = Object.freeze({
  /** The currently visible panel id */
  activePanel:    state => state.activePanel,

  /** Whether a given sidebar category is expanded */
  isCategoryOpen: (state, catId) => state.openCategories.includes(catId),

  /** All expanded category ids */
  openCategories: state => state.openCategories,

  /** Whether the sidebar is visible */
  sidebarOpen:    state => state.sidebarOpen,

  /** Current search filter string */
  searchQuery:    state => state.searchQuery,

  /** Whether a panel's mount() has already been called */
  isMounted:      (state, panelId) => state.mountedPanels.has(panelId),

  /** Number of panels that have been visited */
  visitedCount:   state => state.mountedPanels.size,
});
