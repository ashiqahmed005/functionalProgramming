import { sleep, parseArr, logLine, makeCell, makeRow, readDelay } from '../utils/ui.js';

export default {
  id: 'map',
  label: 'map',

  html: () => `
    <h2>map</h2>
    <p class="subtitle">Apply a function to every element → new array of same length</p>
    <div class="controls">
      <div><label>Array</label><br><input id="map-input" value="1,2,3,4,5"></div>
      <div>
        <label>Transform</label><br>
        <select id="map-fn">
          <option value="x*2">x * 2</option>
          <option value="x*x">x * x</option>
          <option value="x+10">x + 10</option>
          <option value="-x">-x</option>
        </select>
      </div>
      <div class="speed-control">
        <label>Speed</label>
        <input type="range" id="map-speed" min="100" max="1000" value="400" step="100">
      </div>
      <button class="btn" id="map-run">Run</button>
    </div>
    <div id="map-viz"></div>
    <div class="log" id="map-log"></div>
    <details class="source-block">
      <summary><span class="ti">▶</span> Source Code <span class="sf">concepts/arrays.js</span></summary>
      <pre><span class="c">// map as a curried, reusable pure function</span>
export const map = fn => arr => arr.map(fn);

export const double = x => x * 2;
export const square = x => x * x;

[1, 2, 3, 4, 5].map(double); <span class="c">// [2, 4, 6, 8, 10]</span>
[1, 2, 3, 4, 5].map(square); <span class="c">// [1, 4, 9, 16, 25]</span></pre>
    </details>`,

  mount(el) {
    const TRANSFORMS = {
      'x*2':  x => x * 2,
      'x*x':  x => x * x,
      'x+10': x => x + 10,
      '-x':   x => -x,
    };

    let running = false;

    el.querySelector('#map-run').addEventListener('click', async () => {
      if (running) return;
      running = true;

      const arr   = parseArr(el.querySelector('#map-input').value);
      const fnStr = el.querySelector('#map-fn').value;
      const delay = readDelay('map-speed');
      const fn    = TRANSFORMS[fnStr];
      const viz   = el.querySelector('#map-viz');
      const log   = el.querySelector('#map-log');

      log.innerHTML = '';
      viz.innerHTML = '';

      const srcRow = makeRow('input');
      const outRow = makeRow('output');
      const srcCells = arr.map(v => { const c = makeCell(v, 'source'); srcRow.appendChild(c); return c; });
      const outCells = arr.map(() => { const c = makeCell('?'); outRow.appendChild(c); return c; });

      viz.append(srcRow, outRow);
      logLine(log, `<span class="info">arr.map(x => ${fnStr})</span>`);

      for (let i = 0; i < arr.length; i++) {
        srcCells[i].classList.add('highlight');
        await sleep(delay);
        const result = fn(arr[i]);
        outCells[i].textContent = result;
        outCells[i].className = 'cell mapped';
        srcCells[i].classList.remove('highlight');
        logLine(log, `<span class="step">  [${i}]</span> ${arr[i]} → ${result}`);
        await sleep(delay * 0.5);
      }

      logLine(log, `<span class="ok">✓ [${arr.map(fn).join(', ')}]</span>`);
      running = false;
    });

    // Auto-run on load
    el.querySelector('#map-run').click();
  },
};
