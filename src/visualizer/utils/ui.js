/** Pause execution for `ms` milliseconds */
export const sleep = ms => new Promise(r => setTimeout(r, ms));

/** Parse a comma-separated string into a number array */
export const parseArr = str =>
  str.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));

/** Append an HTML line to a log container and auto-scroll */
export function logLine(container, html) {
  container.insertAdjacentHTML('beforeend', `${html}<br>`);
  container.scrollTop = container.scrollHeight;
}

/** Create a visual array cell element */
export function makeCell(val, cls = 'source') {
  const el = document.createElement('div');
  el.className = `cell ${cls}`;
  el.textContent = val;
  return el;
}

/** Create an array row with an optional label */
export function makeRow(label = '') {
  const row = document.createElement('div');
  row.className = 'array-row';
  if (label) {
    const lbl = document.createElement('span');
    lbl.className = 'array-label';
    lbl.textContent = label;
    row.appendChild(lbl);
  }
  return row;
}

/** Read speed slider value and return a delay in ms */
export const readDelay = id =>
  1100 - parseInt(document.getElementById(id).value, 10);
