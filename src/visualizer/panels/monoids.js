import { sleep, logLine, readDelay } from '../utils/ui.js';

export default {
  id: 'monoids',
  label: 'monoids',

  html: () => `
    <h2>Monoids</h2>
    <p class="subtitle">A set + associative binary operation + identity element — safe folding</p>

    <div class="controls">
      <div><label>Numbers (comma-sep)</label><br><input id="mn-nums" value="1,2,3,4,5" style="width:180px"></div>
      <div><label>Booleans (comma-sep)</label><br><input id="mn-bools" value="true,true,false,true" style="width:180px"></div>
      <div class="speed-control"><label>Speed</label>
        <input type="range" id="mn-speed" min="100" max="1000" value="500" step="100">
      </div>
      <button class="btn" id="mn-run">Animate All</button>
    </div>

    <h3 class="section-title">Sum — identity: 0, operation: +</h3>
    <div id="mn-sum-viz"></div>
    <div class="log" id="mn-sum-log"></div>

    <hr class="section-divider">

    <h3 class="section-title">Product — identity: 1, operation: ×</h3>
    <div id="mn-prod-viz"></div>
    <div class="log" id="mn-prod-log"></div>

    <hr class="section-divider">

    <h3 class="section-title">All — identity: true, operation: &amp;&amp;</h3>
    <div id="mn-all-viz"></div>
    <div class="log" id="mn-all-log"></div>

    <hr class="section-divider">

    <h3 class="section-title">Any — identity: false, operation: ||</h3>
    <div id="mn-any-viz"></div>
    <div class="log" id="mn-any-log"></div>

    <details class="source-block">
      <summary><span class="ti">▶</span> Source Code <span class="sf">monoids</span></summary>
      <pre><span class="c">// Monoid factory pattern</span>
const Sum     = x => ({ value: x, concat: other => Sum(x + other.value),     empty: () => Sum(0)     });
const Product = x => ({ value: x, concat: other => Product(x * other.value), empty: () => Product(1) });
const All     = x => ({ value: x, concat: other => All(x &amp;&amp; other.value),    empty: () => All(true)  });
const Any     = x => ({ value: x, concat: other => Any(x || other.value),    empty: () => Any(false) });

Sum(0).empty = () => Sum(0);

<span class="c">// mconcat — fold a list using a monoid</span>
const mconcat = (M, list) =>
  list.map(M).reduce((acc, m) => acc.concat(m), M.empty ? M.empty() : M(M === All ? true : M === Any ? false : 0).empty());

mconcat(Sum, [1, 2, 3, 4, 5]);  <span class="c">// Sum(15)</span>
mconcat(All, [true, true, false]); <span class="c">// All(false)</span></pre>
    </details>`,

  mount(el) {
    const Sum     = x => ({ value: x, concat: o => Sum(x + o.value),     empty: () => Sum(0)     });
    const Product = x => ({ value: x, concat: o => Product(x * o.value), empty: () => Product(1) });
    const All     = x => ({ value: x, concat: o => All(x && o.value),    empty: () => All(true)  });
    const Any     = x => ({ value: x, concat: o => Any(x || o.value),    empty: () => Any(false) });

    const animateFold = async (M, list, vizId, logId, label, identity, delay) => {
      const viz = el.querySelector(vizId);
      const log = el.querySelector(logId);
      viz.innerHTML = ''; log.innerHTML = '';

      const row = document.createElement('div');
      row.style.cssText = 'display:flex;gap:0.4rem;flex-wrap:wrap;align-items:center;margin-bottom:0.6rem;';

      const accEl = document.createElement('div');
      accEl.style.cssText = 'padding:0.4rem 0.75rem;border-radius:8px;border:2px solid #a78bfa;background:#1a1d2e;font-family:monospace;font-size:0.85rem;color:#a78bfa;min-width:80px;text-align:center;transition:all 0.3s;';
      accEl.textContent = `${label}(${identity})`;
      row.appendChild(accEl);
      viz.appendChild(row);

      let acc = M(typeof identity === 'boolean' ? identity : identity);
      logLine(log, `<span class="info">Start: ${label}(${identity})</span>`);

      for (const v of list) {
        const arr = document.createElement('span');
        arr.style.cssText = 'color:#4b5563;font-size:1.1rem;';
        arr.textContent = '→';
        row.appendChild(arr);

        const cell = document.createElement('div');
        cell.style.cssText = 'padding:0.4rem 0.6rem;border-radius:6px;border:1px solid #3d4166;background:#1a1d2e;font-family:monospace;font-size:0.82rem;color:#c4b5fd;';
        cell.textContent = `${label}(${v})`;
        row.appendChild(cell);

        await sleep(delay * 0.5);
        cell.style.borderColor = '#f59e0b';
        cell.style.color = '#fbbf24';

        acc = acc.concat(M(v));
        await sleep(delay);

        accEl.textContent = `${label}(${acc.value})`;
        accEl.style.borderColor = '#4ade80';
        accEl.style.color = '#4ade80';
        logLine(log, `<span class="step">concat ${label}(${v})</span> → <strong>${label}(${acc.value})</strong>`);

        await sleep(delay * 0.3);
        accEl.style.borderColor = '#a78bfa';
        accEl.style.color = '#a78bfa';
        cell.style.borderColor = '#3d4166';
        cell.style.color = '#c4b5fd';
      }

      logLine(log, `<span class="ok">✓ Result: ${label}(${acc.value})</span>`);
    };

    let running = false;
    el.querySelector('#mn-run').addEventListener('click', async () => {
      if (running) return; running = true;
      const nums  = el.querySelector('#mn-nums').value.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
      const bools = el.querySelector('#mn-bools').value.split(',').map(s => s.trim().toLowerCase() === 'true');
      const delay = readDelay('mn-speed');

      await animateFold(Sum,     nums,  '#mn-sum-viz',  '#mn-sum-log',  'Sum',     0,     delay);
      await animateFold(Product, nums,  '#mn-prod-viz', '#mn-prod-log', 'Product', 1,     delay);
      await animateFold(All,     bools, '#mn-all-viz',  '#mn-all-log',  'All',     true,  delay);
      await animateFold(Any,     bools, '#mn-any-viz',  '#mn-any-log',  'Any',     false, delay);
      running = false;
    });

    el.querySelector('#mn-run').click();
  },
};
