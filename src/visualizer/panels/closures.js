import { logLine } from '../utils/ui.js';

export default {
  id: 'closures',
  label: 'closures & HOFs',

  html: () => `
    <h2>Closures &amp; Higher-Order Functions</h2>
    <p class="subtitle">Functions that capture their surrounding scope — and functions that take/return functions</p>

    <h3 class="section-title">1. makeCounter — closure over private state</h3>
    <div class="controls">
      <div><label>Start</label><br><input id="cl-start" value="0" style="width:60px"></div>
      <div><label>Step</label><br><input id="cl-step" value="1" style="width:60px"></div>
      <button class="btn" id="cl-plus">+ Increment</button>
      <button class="btn secondary" id="cl-minus">− Decrement</button>
      <button class="btn secondary" id="cl-reset">Reset</button>
    </div>
    <div id="cl-counter-viz" style="display:flex;align-items:center;gap:1rem;margin-bottom:1rem;">
      <div style="font-size:3rem;font-weight:700;color:#a78bfa;min-width:80px;text-align:center;" id="cl-value">0</div>
      <div style="font-size:0.78rem;color:#64748b;">← private state inside closure<br>no class, no this</div>
    </div>

    <hr class="section-divider">

    <h3 class="section-title">2. once — run a function exactly one time</h3>
    <div class="controls">
      <button class="btn" id="cl-init">Initialize DB</button>
    </div>
    <div id="cl-once-log" class="log"></div>

    <hr class="section-divider">

    <h3 class="section-title">3. after(n, fn) — fire callback after N calls</h3>
    <div class="controls">
      <div><label>N (fire after)</label><br><input id="cl-n" value="3" style="width:60px"></div>
      <button class="btn" id="cl-ping">Ping</button>
      <button class="btn secondary" id="cl-after-reset">Reset</button>
    </div>
    <div id="cl-after-viz" style="display:flex;gap:0.4rem;flex-wrap:wrap;margin-bottom:0.5rem;"></div>
    <div id="cl-after-log" class="log"></div>

    <details class="source-block">
      <summary><span class="ti">▶</span> Source Code <span class="sf">closures</span></summary>
      <pre><span class="c">// makeCounter — private state via closure, no class needed</span>
const makeCounter = (start = 0, step = 1) => {
  let count = start;
  return {
    increment: () => (count += step),
    decrement: () => (count -= step),
    reset:     () => (count = start),
    value:     () => count,
  };
};

<span class="c">// once — higher-order function that wraps fn so it runs only once</span>
const once = fn => {
  let called = false, result;
  return (...args) => {
    if (!called) { called = true; result = fn(...args); }
    return result;
  };
};

<span class="c">// after(n, fn) — returns a fn that invokes fn after n calls</span>
const after = (n, fn) => {
  let count = 0;
  return (...args) => {
    count++;
    if (count >= n) return fn(...args);
  };
};</pre>
    </details>`,

  mount(el) {
    // ── makeCounter ─────────────────────────────────────────────
    let counter = null;
    const makeCounter = (start, step) => {
      let count = start;
      return {
        increment: () => { count += step; return count; },
        decrement: () => { count -= step; return count; },
        reset:     () => { count = start; return count; },
        value:     () => count,
      };
    };
    const valEl = el.querySelector('#cl-value');
    const initCounter = () => {
      const start = parseFloat(el.querySelector('#cl-start').value) || 0;
      const step  = parseFloat(el.querySelector('#cl-step').value)  || 1;
      counter = makeCounter(start, step);
      valEl.textContent = counter.value();
    };
    initCounter();

    el.querySelector('#cl-plus').addEventListener('click', () => {
      initCounter();
      // re-init only if no counter yet; actually just run increment
      counter.increment();
      valEl.textContent = counter.value();
      valEl.style.color = '#4ade80';
      setTimeout(() => valEl.style.color = '#a78bfa', 300);
    });
    el.querySelector('#cl-minus').addEventListener('click', () => {
      if (!counter) initCounter();
      counter.decrement();
      valEl.textContent = counter.value();
      valEl.style.color = '#f87171';
      setTimeout(() => valEl.style.color = '#a78bfa', 300);
    });
    el.querySelector('#cl-reset').addEventListener('click', () => {
      if (!counter) initCounter();
      counter.reset();
      valEl.textContent = counter.value();
      valEl.style.color = '#fbbf24';
      setTimeout(() => valEl.style.color = '#a78bfa', 300);
    });

    // re-init counter when start/step change
    el.querySelector('#cl-start').addEventListener('change', initCounter);
    el.querySelector('#cl-step').addEventListener('change', initCounter);

    // ── once ────────────────────────────────────────────────────
    const onceLog = el.querySelector('#cl-once-log');
    const once = fn => {
      let called = false, result;
      return (...args) => {
        if (!called) { called = true; result = fn(...args); return result; }
        return result;
      };
    };
    const initDB = once(() => { logLine(onceLog, '<span class="ok">✓ DB connected! (first call)</span>'); return 'connected'; });
    el.querySelector('#cl-init').addEventListener('click', () => {
      initDB();
      // check if already called by peeking at log
      const lines = onceLog.querySelectorAll('br').length;
      if (lines >= 1) logLine(onceLog, '<span class="skip">Already initialized — once() blocks re-run</span>');
    });

    // ── after(n, fn) ────────────────────────────────────────────
    let afterFn = null;
    let pingCount = 0;
    const afterLog  = el.querySelector('#cl-after-log');
    const afterViz  = el.querySelector('#cl-after-viz');

    const resetAfter = () => {
      const n = parseInt(el.querySelector('#cl-n').value) || 3;
      pingCount = 0;
      afterViz.innerHTML = '';
      afterLog.innerHTML = '';
      for (let i = 0; i < n; i++) {
        const dot = document.createElement('div');
        dot.style.cssText = 'width:36px;height:36px;border-radius:50%;border:2px solid #3d4166;background:#1e2235;display:flex;align-items:center;justify-content:center;font-size:0.75rem;color:#64748b;transition:all 0.3s;';
        dot.textContent = i + 1;
        afterViz.appendChild(dot);
      }
      const after = (n, fn) => { let c = 0; return (...args) => { c++; if (c >= n) return fn(...args); }; };
      afterFn = after(n, () => {
        logLine(afterLog, `<span class="ok">🎉 Callback fired on ping #${n}!</span>`);
      });
    };
    resetAfter();

    el.querySelector('#cl-ping').addEventListener('click', () => {
      const n = parseInt(el.querySelector('#cl-n').value) || 3;
      const dots = afterViz.querySelectorAll('div');
      if (pingCount < n) {
        const dot = dots[pingCount];
        if (dot) Object.assign(dot.style, { background: pingCount === n - 1 ? '#052e16' : '#1e3a5f', borderColor: pingCount === n - 1 ? '#16a34a' : '#3b82f6', color: pingCount === n - 1 ? '#4ade80' : '#93c5fd' });
        pingCount++;
        logLine(afterLog, `<span class="step">Ping #${pingCount} ${pingCount < n ? '— waiting...' : ''}</span>`);
        afterFn();
      } else {
        logLine(afterLog, '<span class="skip">Already fired — reset to try again</span>');
      }
    });

    el.querySelector('#cl-after-reset').addEventListener('click', resetAfter);
    el.querySelector('#cl-n').addEventListener('change', resetAfter);

    // auto-run
    el.querySelector('#cl-plus').click();
  },
};
