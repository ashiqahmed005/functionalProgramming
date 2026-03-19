/**
 * createStore — minimal Redux-pattern store
 *
 * Usage:
 *   const store = createStore(reducer, initialState);
 *   store.dispatch({ type: 'NAVIGATE', payload: 'map' });
 *   store.subscribe((state, prevState) => render(state, prevState));
 *   store.getState();  // current state snapshot
 */
export function createStore(reducer, initialState) {
  let state     = initialState;
  let listeners = [];
  let isDispatching = false;

  function getState() {
    if (isDispatching) {
      throw new Error('Cannot call getState() while reducer is running.');
    }
    return state;
  }

  function dispatch(action) {
    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.');
    }
    if (!action || typeof action.type !== 'string') {
      throw new Error(`Actions must be plain objects with a string "type". Got: ${JSON.stringify(action)}`);
    }

    isDispatching = true;
    const prevState = state;
    try {
      state = reducer(state, action);
    } finally {
      isDispatching = false;
    }

    // Only notify if state actually changed (reference equality)
    if (state !== prevState) {
      listeners.forEach(listener => listener(state, prevState));
    }

    return action;
  }

  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Listener must be a function.');
    }
    listeners = [...listeners, listener];

    // Return unsubscribe function
    return function unsubscribe() {
      listeners = listeners.filter(l => l !== listener);
    };
  }

  // Kick off the reducer with an init action to populate default state
  dispatch({ type: '@@INIT' });

  return { getState, dispatch, subscribe };
}
