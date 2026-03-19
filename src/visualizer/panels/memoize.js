import { sleep, logLine } from '../utils/ui.js';

export default {
  id: 'memoize',
  label: 'memoization',

  html: () => `
    <h2>Memoization</h2>
    <p class="subtitle">Cache function results — avoid recomputing the same expensive call</p>

    <div class="controls">
      <div><label>fib(n)</label><br><input id="memo-n" value="10" style="width:70px" type="number" min="1" max="20"></div>
      <button class="btn" id="memo-run">Run Both</button>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:1rem;">
      <div>
        <h3 class="section-title" style="margin-top:0">Without Memoization</h3>
        <div style="font-size:0.78rem;color:#64748b;margin-bottom:0.4rem;">Call count:</div>
        <div id="memo-naive-count" style="font-size:2.5rem;font-weight:700;color:#f87171;margin-bottom:0.5rem;">0</div>
        <div class="log" id="memo-naive-log" style="max-height:180px;"></div>
      </div>
      <div>
        <h3 class="section-title" style="margin-top:0">With Memoization</h3>
        <div style="font-size:0.78rem;color:#64748b;margin-bottom:0.4rem;">Call count:</div>
        <div id="memo-fast-count" style="font-size:2.5rem;font-weight:700;color:#4ade80;margin-bottom:0.5rem;">0</div>
        <div class="log" id="memo-fast-log" style="max-height:180px;"></div>
      </div>
    </div>

    <h3 class="section-title">Cache Table (memoized)</h3>
    <div id="memo-cache-viz" style="display:flex;gap:0.4rem;flex-wrap:wrap;margin-bottom:1rem;"></div>

    <details class="source-block">
      <summary><span class="ti">▶</span> Source Code <span class="sf">memoize</span></summary>
      <pre><span class="c">// Generic memoize — caches by stringified args</span>
const memoize = fn => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

<span class="c">// Naive fib — exponential calls (2^n)</span>
const fib = n => n &lt;= 1 ? n : fib(n - 1) + fib(n - 2);

<span class="c">// Memoized fib — linear calls</span>
const memoFib = memoize(n => n &lt;= 1 ? n : memoFib(n - 1) + memoFib(n - 2));</pre>
    </details>`,

  mount(el) {
    el.querySelector('#memo-run').addEventListener('click', async () => {
      const n = Math.min(parseInt(el.querySelector('#memo-n').value) || 10, 20);
      const naiveCountEl = el.querySelector('#memo-naive-count');
      const fastCountEl  = el.querySelector('#memo-fast-count');
      const naiveLog     = el.querySelector('#memo-naive-log');
      const fastLog      = el.querySelector('#memo-fast-log');
      const cacheViz     = el.querySelector('#memo-cache-viz');

      naiveCountEl.textContent = '0';
      fastCountEl.textContent  = '0';
      naiveLog.innerHTML = '';
      fastLog.innerHTML  = '';
      cacheViz.innerHTML = '';

      // Naive fib with counter
      let naiveCalls = 0;
      const naiveFib = (k) => {
        naiveCalls++;
        if (k <= 1) return k;
        return naiveFib(k - 1) + naiveFib(k - 2);
      };

      // Memoized fib with counter
      let fastCalls = 0;
      const cache   = new Map();
      const memoFib = (k) => {
        fastCalls++;
        if (cache.has(k)) return cache.get(k);
        const result = k <= 1 ? k : memoFib(k - 1) + memoFib(k - 2);
        cache.set(k, result);
        return result;
      };

      // Run naive
      logLine(naiveLog, `<span class="info">Computing fib(${n})...</span>`);
      const naiveResult = naiveFib(n);
      naiveCountEl.textContent = naiveCalls;
      logLine(naiveLog, `<span class="ok">fib(${n}) = ${naiveResult}</span>`);
      logLine(naiveLog, `<span class="skip">${naiveCalls} total calls — exponential!</span>`);

      // Animate memoized
      logLine(fastLog, `<span class="info">Computing fib(${n}) with cache...</span>`);
      const fastResult = memoFib(n);
      fastCountEl.textContent = fastCalls;
      logLine(fastLog, `<span class="ok">fib(${n}) = ${fastResult}</span>`);
      logLine(fastLog, `<span class="ok">${fastCalls} total calls — linear!</span>`);

      // Animate cache table building
      const sorted = [...cache.entries()].sort((a, b) => a[0] - b[0]);
      for (const [k, v] of sorted) {
        const cell = document.createElement('div');
        cell.style.cssText = 'padding:0.4rem 0.6rem;border-radius:6px;border:1px solid #16a34a55;background:#052e16;font-family:monospace;font-size:0.78rem;text-align:center;';
        cell.innerHTML = `<div style="color:#64748b;font-size:0.65rem;">fib(${k})</div><div style="color:#4ade80;font-weight:600;">${v}</div>`;
        cacheViz.appendChild(cell);
        await sleep(60);
      }

      const ratio = document.createElement('div');
      ratio.style.cssText = 'width:100%;margin-top:0.5rem;font-size:0.78rem;color:#64748b;';
      ratio.textContent = `Speed-up: ${naiveCalls}x fewer calls (${naiveCalls} vs ${fastCalls})`;
      cacheViz.appendChild(ratio);
    });

    el.querySelector('#memo-run').click();
  },
};
