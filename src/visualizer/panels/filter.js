import { sleep, parseArr, logLine, makeCell, makeRow, readDelay } from '../utils/ui.js';

export default {
  id: 'filter',
  label: 'filter',

  html: () => `
    <h2>filter</h2>
    <p class="subtitle">Keep elements that satisfy a predicate → new array (same or shorter)</p>
    <div class="controls">
      <div><label>Array</label><br><input id="filter-input" value="1,2,3,4,5,6,7,8"></div>
      <div>
        <label>Predicate</label><br>
        <select id="filter-fn">
          <option value="x%2===0">even</option>
          <option value="x%2!==0">odd</option>
          <option value="x&gt;4">x &gt; 4</option>
          <option value="x&lt;5">x &lt; 5</option>
          <option value="x%3===0">divisible by 3</option>
        </select>
      </div>
      <div class="speed-control">
        <label>Speed</label>
        <input type="range" id="filter-speed" min="100" max="1000" value="400" step="100">
      </div>
      <button class="btn" id="filter-run">Run</button>
    </div>
    <div id="filter-viz"></div>
    <div class="log" id="filter-log"></div>
    <details class="source-block">
      <summary><span class="ti">▶</span> Source Code <span class="sf">concepts/arrays.js</span></summary>
      <pre><span class="c">// filter as a curried, reusable pure function</span>
export const filter = pred => arr => arr.filter(pred);

export const isEven = x => x % 2 === 0;
export const isOdd  = x => x % 2 !== 0;
export const gt     = n => x => x > n;
export const lt     = n => x => x &lt; n;

[1,2,3,4,5,6].filter(isEven); <span class="c">// [2, 4, 6]</span>
filter(gt(4))([1,2,3,4,5,6]); <span class="c">// [5, 6]</span></pre>
    </details>`,

  mount(el) {
    const PREDICATES = {
      'x%2===0':  x => x % 2 === 0,
      'x%2!==0':  x => x % 2 !== 0,
      'x>4':      x => x > 4,
      'x<5':      x => x < 5,
      'x%3===0':  x => x % 3 === 0,
    };

    let running = false;

    el.querySelector('#filter-run').addEventListener('click', async () => {
      if (running) return;
      running = true;

      const arr   = parseArr(el.querySelector('#filter-input').value);
      const fnStr = el.querySelector('#filter-fn').value;
      const delay = readDelay('filter-speed');
      const fn    = PREDICATES[fnStr];
      const viz   = el.querySelector('#filter-viz');
      const log   = el.querySelector('#filter-log');

      log.innerHTML = '';
      viz.innerHTML = '';

      const srcRow = makeRow('input');
      const outRow = makeRow('output');
      const srcCells = arr.map(v => { const c = makeCell(v, 'source'); srcRow.appendChild(c); return c; });
      viz.append(srcRow, outRow);

      logLine(log, `<span class="info">arr.filter(x => ${fnStr})</span>`);

      for (let i = 0; i < arr.length; i++) {
        srcCells[i].classList.add('highlight');
        await sleep(delay);
        const passes = fn(arr[i]);
        srcCells[i].className = `cell ${passes ? 'kept' : 'removed'}`;
        if (passes) {
          outRow.appendChild(makeCell(arr[i], 'kept'));
          logLine(log, `<span class="ok">  ✓ ${arr[i]} passes</span>`);
        } else {
          logLine(log, `<span class="skip">  ✗ ${arr[i]} removed</span>`);
        }
        await sleep(delay * 0.5);
      }

      logLine(log, `<span class="ok">✓ [${arr.filter(fn).join(', ')}]</span>`);
      running = false;
    });
  },
};
