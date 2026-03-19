import { sleep, parseArr, logLine, readDelay } from '../utils/ui.js';
import { compose, mapping, filtering, transduce, append } from '../../concepts/transducers.js';

const FILTERS = {
  even: { label: 'even',      fn: n => n % 2 === 0 },
  gt5:  { label: 'n > 5',     fn: n => n > 5 },
  lt8:  { label: 'n < 8',     fn: n => n < 8 },
};
const MAPS = {
  square: { label: 'x * x',   fn: n => n * n },
  double: { label: 'x * 2',   fn: n => n * 2 },
  addOne: { label: 'x + 1',   fn: n => n + 1 },
};

export default {
  id: 'transducers',
  label: 'transducers',

  html: () => `
    <h2>Transducers</h2>
    <p class="subtitle">Single-pass filter+map — compare against traditional multi-pass chaining</p>
    <div class="controls">
      <div><label>Array</label><br><input id="xform-input" value="1,2,3,4,5,6,7,8,9,10"></div>
      <div>
        <label>Filter</label><br>
        <select id="xform-filter">
          <option value="even">even numbers</option>
          <option value="gt5">greater than 5</option>
          <option value="lt8">less than 8</option>
        </select>
      </div>
      <div>
        <label>Map</label><br>
        <select id="xform-map">
          <option value="square">x * x</option>
          <option value="double">x * 2</option>
          <option value="addOne">x + 1</option>
        </select>
      </div>
      <div class="speed-control">
        <label>Speed</label>
        <input type="range" id="xform-speed" min="100" max="1000" value="400" step="100">
      </div>
      <button class="btn" id="xform-run">Run</button>
    </div>
    <div id="xform-viz"></div>
    <div class="log" id="xform-log"></div>
    <details class="source-block">
      <summary><span class="ti">▶</span> Source Code <span class="sf">concepts/transducers.js</span></summary>
      <pre>export const mapping   = fn   => reducer => (acc, item) => reducer(acc, fn(item));
export const filtering = pred => reducer => (acc, item) =>
  pred(item) ? reducer(acc, item) : acc;

export const transduce = (xform, reducer, init, coll) =>
  coll.reduce(xform(reducer), init);

<span class="c">// Traditional: 3 passes, 3 intermediate arrays</span>
data.filter(n => n % 2 === 0).map(n => n * n).filter(n => n &lt; 50);

<span class="c">// Transducer: single pass, zero intermediates</span>
const xform = compose(
  filtering(n => n % 2 === 0),
  mapping(n => n * n),
  filtering(n => n &lt; 50)
);
transduce(xform, append, [], data); <span class="c">// [4, 16, 36]</span></pre>
    </details>`,

  mount(el) {
    let running = false;

    el.querySelector('#xform-run').addEventListener('click', async () => {
      if (running) return;
      running = true;

      const arr   = parseArr(el.querySelector('#xform-input').value);
      const flt   = FILTERS[el.querySelector('#xform-filter').value];
      const mp    = MAPS[el.querySelector('#xform-map').value];
      const delay = readDelay('xform-speed');
      const viz   = el.querySelector('#xform-viz');
      const log   = el.querySelector('#xform-log');

      log.innerHTML = '';
      viz.innerHTML = '';

      // Grid header
      const grid = document.createElement('div');
      grid.style.cssText = `display:grid;grid-template-columns:130px repeat(${arr.length},44px);gap:4px;align-items:center;`;

      const makeLabel = t => {
        const d = document.createElement('div');
        d.className = 'xform-label';
        d.textContent = t;
        return d;
      };

      // Source row
      grid.appendChild(makeLabel('input'));
      const srcCells = arr.map(v => {
        const c = document.createElement('div'); c.className = 'xform-cell'; c.textContent = v;
        grid.appendChild(c); return c;
      });

      // Filter row
      grid.appendChild(makeLabel(`filter(${flt.label})`));
      const filterCells = arr.map(v => {
        const c = document.createElement('div'); c.className = 'xform-cell'; c.textContent = v;
        grid.appendChild(c); return c;
      });

      // Map row
      grid.appendChild(makeLabel(`map(${mp.label})`));
      const mapCells = arr.map(() => {
        const c = document.createElement('div'); c.className = 'xform-cell'; c.textContent = '-';
        grid.appendChild(c); return c;
      });

      // Output row
      grid.appendChild(makeLabel('output'));
      const outCells = arr.map(() => {
        const c = document.createElement('div'); c.className = 'xform-cell'; c.textContent = '-';
        grid.appendChild(c); return c;
      });

      viz.appendChild(grid);

      const resultDisplay = document.createElement('div');
      resultDisplay.className = 'result-display';
      resultDisplay.textContent = 'Result: []';
      viz.appendChild(resultDisplay);

      logLine(log, `<span class="info">Single-pass transducer: filter(${flt.label}) → map(${mp.label})</span>`);

      // Build xform from real concept implementations
      const xform = compose(filtering(flt.fn), mapping(mp.fn));
      const output = [];

      for (let i = 0; i < arr.length; i++) {
        srcCells[i].className = 'xform-cell transform';
        await sleep(delay);

        const passes = flt.fn(arr[i]);
        filterCells[i].className = `xform-cell ${passes ? 'pass' : 'fail'}`;
        await sleep(delay * 0.5);

        if (passes) {
          const mapped = mp.fn(arr[i]);
          mapCells[i].className = 'xform-cell transform';
          mapCells[i].textContent = mapped;
          await sleep(delay * 0.5);
          outCells[i].className = 'xform-cell pass';
          outCells[i].textContent = mapped;
          output.push(mapped);
          logLine(log, `<span class="step">  ${arr[i]}</span> → passes filter → mapped to ${mapped}`);
        } else {
          mapCells[i].className = 'xform-cell fail';
          logLine(log, `<span class="skip">  ${arr[i]} filtered out</span>`);
        }

        srcCells[i].className = 'xform-cell pass';
        resultDisplay.textContent = `Result: [${output.join(', ')}]`;
        await sleep(delay * 0.3);
      }

      // Verify with real transduce
      const verified = transduce(xform, append, [], arr);
      logLine(log, `<span class="ok">✓ [${verified.join(', ')}]  (1 pass, 0 intermediate arrays)</span>`);
      running = false;
    });
  },
};
