import { sleep, logLine } from '../utils/ui.js';

export default {
  id: 'trampoline',
  label: 'trampolining',

  html: () => `
    <h2>Trampolining</h2>
    <p class="subtitle">Convert deep recursion into a loop — constant stack depth regardless of N</p>

    <h3 class="section-title">1. Factorial — naive vs trampolined</h3>
    <div class="controls">
      <div><label>N</label><br><input id="tr-n" value="8" style="width:70px" type="number" min="1" max="15"></div>
      <button class="btn" id="tr-fact-run">Animate</button>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin:0.75rem 0;">
      <div>
        <div style="font-size:0.78rem;color:#64748b;margin-bottom:0.3rem;">Naive — stack grows to N</div>
        <div id="tr-naive-bar" style="display:flex;flex-direction:column-reverse;gap:2px;height:160px;justify-content:flex-start;overflow:hidden;border:1px solid #3d4166;border-radius:6px;padding:4px;background:#0d1117;"></div>
        <div id="tr-naive-depth" style="font-size:0.75rem;color:#f87171;margin-top:0.3rem;">depth: 0</div>
      </div>
      <div>
        <div style="font-size:0.78rem;color:#64748b;margin-bottom:0.3rem;">Trampolined — always 1 frame</div>
        <div id="tr-tramp-bar" style="display:flex;flex-direction:column-reverse;gap:2px;height:160px;justify-content:flex-start;overflow:hidden;border:1px solid #3d4166;border-radius:6px;padding:4px;background:#0d1117;"></div>
        <div id="tr-tramp-depth" style="font-size:0.75rem;color:#4ade80;margin-top:0.3rem;">depth: 1</div>
      </div>
    </div>
    <div class="log" id="tr-fact-log"></div>

    <hr class="section-divider">

    <h3 class="section-title">2. Mutual Recursion — isEven / isOdd via trampoline</h3>
    <div class="controls">
      <div><label>N</label><br><input id="tr-mutual-n" value="10" style="width:70px" type="number" min="0" max="20"></div>
      <button class="btn" id="tr-mutual-run">Step Through</button>
    </div>
    <div id="tr-mutual-viz"></div>
    <div class="log" id="tr-mutual-log"></div>

    <details class="source-block">
      <summary><span class="ti">▶</span> Source Code <span class="sf">trampoline</span></summary>
      <pre><span class="c">// Trampoline — keep calling thunks until a non-function is returned</span>
const trampoline = fn => (...args) => {
  let result = fn(...args);
  while (typeof result === 'function') result = result();
  return result;
};

<span class="c">// Trampolined factorial — returns thunks instead of recursing</span>
const factImpl = (n, acc = 1) =>
  n &lt;= 1 ? acc : () => factImpl(n - 1, n * acc);

const factorial = trampoline(factImpl);
factorial(10000); <span class="c">// no stack overflow!</span>

<span class="c">// Mutual recursion — isEven / isOdd</span>
const isEven_impl = n => n === 0 ? true  : () => isOdd_impl(n - 1);
const isOdd_impl  = n => n === 0 ? false : () => isEven_impl(n - 1);

const isEven = trampoline(isEven_impl);
const isOdd  = trampoline(isOdd_impl);</pre>
    </details>`,

  mount(el) {
    const trampoline = fn => (...args) => {
      let result = fn(...args);
      while (typeof result === 'function') result = result();
      return result;
    };

    // ── Factorial animation ──────────────────────────────────────
    el.querySelector('#tr-fact-run').addEventListener('click', async () => {
      const n = Math.min(parseInt(el.querySelector('#tr-n').value) || 8, 15);
      const naiveBar   = el.querySelector('#tr-naive-bar');
      const trampBar   = el.querySelector('#tr-tramp-bar');
      const naiveDepth = el.querySelector('#tr-naive-depth');
      const trampDepth = el.querySelector('#tr-tramp-depth');
      const log        = el.querySelector('#tr-fact-log');
      naiveBar.innerHTML = ''; trampBar.innerHTML = ''; log.innerHTML = '';

      const frameH = 18;
      const makeFrame = (label, color) => {
        const f = document.createElement('div');
        f.style.cssText = `height:${frameH}px;border-radius:3px;background:${color};display:flex;align-items:center;padding:0 6px;font-size:0.65rem;color:#fff;transition:all 0.2s;flex-shrink:0;`;
        f.textContent = label;
        return f;
      };

      logLine(log, `<span class="info">Simulating factorial(${n})</span>`);

      // Naive — simulate stack growing
      for (let i = n; i >= 0; i--) {
        naiveBar.appendChild(makeFrame(`fact(${i})`, i === n ? '#7c3aed' : '#4c1d95'));
        naiveDepth.textContent = `depth: ${n - i + 1}`;
        await sleep(150);
      }
      logLine(log, `<span class="skip">Naive: stack reached depth ${n + 1}</span>`);

      // Trampoline — always 1 frame
      const trampFrame = makeFrame('trampoline loop', '#065f46');
      trampBar.appendChild(trampFrame);
      trampDepth.textContent = 'depth: 1';

      const factImpl = (k, acc = 1) => k <= 1 ? acc : () => factImpl(k - 1, k * acc);
      const factorial = trampoline(factImpl);
      let step = 0;
      for (let i = n; i >= 1; i--) {
        trampFrame.textContent = `loop: n=${i}, acc=${factorial}`;
        step++;
        await sleep(120);
      }
      trampFrame.textContent = `done: ${factorial(n)}`;
      trampFrame.style.background = '#16a34a';
      trampDepth.textContent = 'depth: 1 (constant!)';
      logLine(log, `<span class="ok">Trampolined: constant depth 1 — result ${factorial(n)}</span>`);
    });

    // ── Mutual recursion ─────────────────────────────────────────
    el.querySelector('#tr-mutual-run').addEventListener('click', async () => {
      const n   = parseInt(el.querySelector('#tr-mutual-n').value) || 10;
      const viz = el.querySelector('#tr-mutual-viz');
      const log = el.querySelector('#tr-mutual-log');
      viz.innerHTML = ''; log.innerHTML = '';

      const isEvenImpl = k => k === 0 ? true  : () => isOddImpl(k - 1);
      const isOddImpl  = k => k === 0 ? false : () => isEvenImpl(k - 1);

      const row = document.createElement('div');
      row.style.cssText = 'display:flex;gap:0.3rem;flex-wrap:wrap;align-items:center;';
      viz.appendChild(row);

      let current = n;
      let isEvenTurn = true;
      logLine(log, `<span class="info">Checking isEven(${n}) via trampoline bounce</span>`);

      for (let i = 0; i <= Math.min(n, 12); i++) {
        const box = document.createElement('div');
        const label = isEvenTurn ? `isEven(${current})` : `isOdd(${current})`;
        box.style.cssText = `padding:0.3rem 0.5rem;border-radius:6px;border:1px solid ${isEvenTurn ? '#3b82f6' : '#a78bfa'};background:${isEvenTurn ? '#1e3a5f' : '#2d1b4e'};font-size:0.7rem;color:${isEvenTurn ? '#93c5fd' : '#c4b5fd'};`;
        box.textContent = label;
        row.appendChild(box);

        if (i < Math.min(n, 12)) {
          const arr = document.createElement('span');
          arr.style.cssText = 'color:#4b5563;font-size:0.85rem;';
          arr.textContent = '→';
          row.appendChild(arr);
        }

        logLine(log, `<span class="step">${label} → calls ${isEvenTurn ? `isOdd(${current - 1})` : `isEven(${current - 1})`}</span>`);
        current--;
        isEvenTurn = !isEvenTurn;
        await sleep(200);
      }

      const result = trampoline(isEvenImpl)(n);
      logLine(log, `<span class="ok">✓ isEven(${n}) = ${result} — resolved in constant stack depth</span>`);
    });

    el.querySelector('#tr-fact-run').click();
  },
};
