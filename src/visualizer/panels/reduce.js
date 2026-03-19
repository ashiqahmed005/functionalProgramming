import { sleep, parseArr, logLine, makeCell, makeRow, readDelay } from '../utils/ui.js';
import { sum, product, largest, smallest } from '../../concepts/arrays.js';

const OPS = {
  sum:     { fn: sum,     label: 'acc + x',           init: 0,         display: '0' },
  product: { fn: product, label: 'acc * x',           init: 1,         display: '1' },
  max:     { fn: largest, label: 'Math.max(acc, x)',  init: -Infinity, display: '-∞' },
  min:     { fn: smallest,label: 'Math.min(acc, x)',  init: Infinity,  display: '∞' },
};

export default {
  id: 'reduce',
  label: 'reduce',

  html: () => `
    <h2>reduce</h2>
    <p class="subtitle">Fold array into a single accumulated value</p>
    <div class="controls">
      <div><label>Array</label><br><input id="reduce-input" value="1,2,3,4,5"></div>
      <div>
        <label>Operation</label><br>
        <select id="reduce-fn">
          <option value="sum">Sum (acc + x)</option>
          <option value="product">Product (acc * x)</option>
          <option value="max">Max</option>
          <option value="min">Min</option>
        </select>
      </div>
      <div class="speed-control">
        <label>Speed</label>
        <input type="range" id="reduce-speed" min="100" max="1000" value="500" step="100">
      </div>
      <button class="btn" id="reduce-run">Run</button>
    </div>
    <div id="reduce-viz"></div>
    <div class="log" id="reduce-log"></div>
    <details class="source-block">
      <summary><span class="ti">▶</span> Source Code <span class="sf">concepts/arrays.js</span></summary>
      <pre><span class="c">// Reducers are just binary functions</span>
export const sum      = (acc, x) => acc + x;
export const product  = (acc, x) => acc * x;
export const largest  = (acc, x) => Math.max(acc, x);

<span class="c">// Curried reduce wraps them for reuse</span>
export const reduce = (fn, init) => arr => arr.reduce(fn, init);

const totalPrice = reduce(sum, 0);
totalPrice([10, 20, 30]); <span class="c">// 60</span></pre>
    </details>`,

  mount(el) {
    let running = false;

    el.querySelector('#reduce-run').addEventListener('click', async () => {
      if (running) return;
      running = true;

      const arr   = parseArr(el.querySelector('#reduce-input').value);
      const op    = OPS[el.querySelector('#reduce-fn').value];
      const delay = readDelay('reduce-speed');
      const viz   = el.querySelector('#reduce-viz');
      const log   = el.querySelector('#reduce-log');

      log.innerHTML = '';
      viz.innerHTML = '';

      const srcRow = makeRow('input');
      const srcCells = arr.map(v => { const c = makeCell(v, 'source'); srcRow.appendChild(c); return c; });

      const accRow  = makeRow('acc');
      const accCell = makeCell(op.display, 'reduced');
      accRow.appendChild(accCell);

      viz.append(srcRow, accRow);
      logLine(log, `<span class="info">arr.reduce((acc, x) => ${op.label}, ${op.display})</span>`);

      let acc = op.init;
      for (let i = 0; i < arr.length; i++) {
        srcCells[i].classList.add('highlight');
        await sleep(delay);
        const prev = acc;
        acc = op.fn(acc, arr[i]);
        const display = isFinite(acc) ? acc : (acc === -Infinity ? '-∞' : '∞');
        accCell.textContent = display;
        accCell.style.boxShadow = '0 0 0 2px #f59e0b';
        srcCells[i].className = 'cell mapped';
        logLine(log, `<span class="step">  [${i}]</span> ${isFinite(prev) ? prev : '?'} ⊕ ${arr[i]} = <span class="ok">${display}</span>`);
        await sleep(delay * 0.5);
        accCell.style.boxShadow = '';
      }

      logLine(log, `<span class="ok">✓ Result: ${isFinite(acc) ? acc : acc}</span>`);
      running = false;
    });
  },
};
