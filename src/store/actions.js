/**
 * Action Types — string constants (single source of truth)
 * Prevents typos; import these instead of raw strings everywhere.
 */
export const ActionTypes = Object.freeze({
  NAVIGATE:         'NAVIGATE',         // activate a panel by id
  OPEN_CATEGORY:    'OPEN_CATEGORY',    // expand a sidebar category
  TOGGLE_CATEGORY:  'TOGGLE_CATEGORY',  // expand / collapse a category
  TOGGLE_SIDEBAR:   'TOGGLE_SIDEBAR',   // show / hide the sidebar
  SET_SEARCH:       'SET_SEARCH',       // update sidebar search query
  MOUNT_PANEL:      'MOUNT_PANEL',      // record that a panel's mount() was called
});

/**
 * Action Creators — pure functions returning action objects.
 * Components call these; they never construct {type, payload} inline.
 */
export const Actions = Object.freeze({
  navigate:        panelId => ({ type: ActionTypes.NAVIGATE,        payload: panelId }),
  openCategory:    catId   => ({ type: ActionTypes.OPEN_CATEGORY,   payload: catId   }),
  toggleCategory:  catId   => ({ type: ActionTypes.TOGGLE_CATEGORY, payload: catId   }),
  toggleSidebar:   ()      => ({ type: ActionTypes.TOGGLE_SIDEBAR                    }),
  setSearch:       query   => ({ type: ActionTypes.SET_SEARCH,       payload: query   }),
  mountPanel:      panelId => ({ type: ActionTypes.MOUNT_PANEL,      payload: panelId }),
});
