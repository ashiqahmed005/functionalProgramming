export default {
  id: 'pointfree',
  label: 'point-free style',

  html: () => `
    <h2>Point-Free Style</h2>
    <p class="subtitle">Define functions without mentioning their arguments — compose behaviours, not data</p>

    <h3 class="section-title">1. not / both / either — predicate combinators</h3>
    <div class="controls">
      <div><label>Test number</label><br><input id="pf-num" value="42" style="width:80px"></div>
      <div>
        <label>Combinator</label><br>
        <select id="pf-combo">
          <option value="both">both(isPositive, isLt100)</option>
          <option value="either">either(isPositive, isLt100)</option>
          <option value="not-positive">not(isPositive)</option>
          <option value="not-lt100">not(isLt100)</option>
        </select>
      </div>
      <button class="btn" id="pf-pred-run">Run</button>
    </div>
    <div id="pf-pred-viz"></div>

    <hr class="section-divider">

    <h3 class="section-title">2. flip — reverse argument order</h3>
    <div class="controls">
      <div><label>a</label><br><input id="pf-a" value="10" style="width:60px"></div>
      <div><label>b</label><br><input id="pf-b" value="3" style="width:60px"></div>
      <button class="btn" id="pf-flip-run">Run</button>
    </div>
    <div id="pf-flip-viz"></div>

    <hr class="section-divider">

    <h3 class="section-title">3. always / identity — constant and passthrough</h3>
    <div class="controls">
      <div><label>List (comma-sep)</label><br><input id="pf-list" value="1,2,3,4,5" style="width:160px"></div>
      <button class="btn" id="pf-const-run">Run</button>
    </div>
    <div id="pf-const-viz"></div>

    <details class="source-block">
      <summary><span class="ti">▶</span> Source Code <span class="sf">point-free combinators</span></summary>
      <pre><span class="c">// Predicate combinators</span>
const not    = fn  => (...args) => !fn(...args);
const both   = (f, g) => (...args) => f(...args) &amp;&amp; g(...args);
const either = (f, g) => (...args) => f(...args) || g(...args);

const isPositive = n => n &gt; 0;
const isLt100    = n => n &lt; 100;

const inRange = both(isPositive, isLt100);  <span class="c">// 0 &lt; n &lt; 100</span>
inRange(42);  <span class="c">// true</span>
inRange(-1);  <span class="c">// false</span>

<span class="c">// flip — swap first two arguments</span>
const flip = fn => (a, b, ...rest) => fn(b, a, ...rest);

const subtract    = (a, b) => a - b;
const flippedSub  = flip(subtract);
subtract(10, 3);    <span class="c">// 7</span>
flippedSub(10, 3);  <span class="c">// -7  (b - a)</span>

<span class="c">// always — constant function, identity — returns its argument</span>
const always   = x => () => x;
const identity = x => x;

[1,2,3].map(always(0));    <span class="c">// [0, 0, 0]</span>
[1,2,3].map(identity);     <span class="c">// [1, 2, 3]</span></pre>
    </details>`,

  mount(el) {
    const not    = fn => (...args) => !fn(...args);
    const both   = (f, g) => (...args) => f(...args) && g(...args);
    const either = (f, g) => (...args) => f(...args) || g(...args);
    const isPositive = n => n > 0;
    const isLt100    = n => n < 100;
    const flip = fn => (a, b, ...rest) => fn(b, a, ...rest);
    const always   = x => () => x;
    const identity = x => x;

    // ── Predicates ──────────────────────────────────────────────
    el.querySelector('#pf-pred-run').addEventListener('click', () => {
      const n = parseFloat(el.querySelector('#pf-num').value);
      const combo = el.querySelector('#pf-combo').value;
      const viz = el.querySelector('#pf-pred-viz');
      viz.innerHTML = '';

      const predicates = [
        { name: 'isPositive(n)', fn: isPositive, result: isPositive(n) },
        { name: 'isLt100(n)',    fn: isLt100,    result: isLt100(n) },
      ];

      let combined, comboLabel;
      switch (combo) {
        case 'both':       combined = both(isPositive, isLt100);   comboLabel = 'both(isPositive, isLt100)';  break;
        case 'either':     combined = either(isPositive, isLt100); comboLabel = 'either(isPositive, isLt100)'; break;
        case 'not-positive': combined = not(isPositive);           comboLabel = 'not(isPositive)';             break;
        case 'not-lt100':    combined = not(isLt100);              comboLabel = 'not(isLt100)';                break;
      }
      const comboResult = combined(n);

      const row = document.createElement('div');
      row.style.cssText = 'display:flex;gap:0.75rem;flex-wrap:wrap;margin-bottom:0.75rem;align-items:center;';

      predicates.forEach(p => {
        const box = document.createElement('div');
        box.style.cssText = `padding:0.6rem 1rem;border-radius:8px;border:1px solid ${p.result ? '#16a34a' : '#7f1d1d'};background:${p.result ? '#052e16' : '#2d0a0a'};font-size:0.8rem;`;
        box.innerHTML = `<div style="color:#94a3b8;font-size:0.7rem;">${p.name}</div><div style="color:${p.result ? '#4ade80' : '#f87171'};font-weight:700;font-size:1.1rem;">${p.result}</div>`;
        row.appendChild(box);
      });

      const arrow = document.createElement('span');
      arrow.style.cssText = 'color:#4b5563;font-size:1.2rem;';
      arrow.textContent = '⟹';
      row.appendChild(arrow);

      const comboBox = document.createElement('div');
      comboBox.style.cssText = `padding:0.6rem 1rem;border-radius:8px;border:2px solid ${comboResult ? '#a78bfa' : '#f59e0b'};background:#1a1d2e;font-size:0.8rem;`;
      comboBox.innerHTML = `<div style="color:#94a3b8;font-size:0.7rem;">${comboLabel}</div><div style="color:${comboResult ? '#a78bfa' : '#fbbf24'};font-weight:700;font-size:1.2rem;">${comboResult}</div>`;
      row.appendChild(comboBox);

      viz.appendChild(row);
    });

    // ── flip ────────────────────────────────────────────────────
    el.querySelector('#pf-flip-run').addEventListener('click', () => {
      const a = parseFloat(el.querySelector('#pf-a').value);
      const b = parseFloat(el.querySelector('#pf-b').value);
      const subtract = (a, b) => a - b;
      const flippedSub = flip(subtract);
      const viz = el.querySelector('#pf-flip-viz');

      const rows = [
        { label: 'subtract(a, b)', code: `subtract(${a}, ${b})`, result: subtract(a, b) },
        { label: 'flip(subtract)(a, b)', code: `flippedSub(${a}, ${b})`, result: flippedSub(a, b) },
      ];

      viz.innerHTML = '';
      const row = document.createElement('div');
      row.style.cssText = 'display:flex;gap:0.75rem;flex-wrap:wrap;margin-bottom:0.75rem;';
      rows.forEach(r => {
        const box = document.createElement('div');
        box.style.cssText = 'padding:0.75rem 1rem;border-radius:8px;border:1px solid #3d4166;background:#1a1d2e;font-size:0.82rem;min-width:200px;';
        box.innerHTML = `<div style="color:#64748b;font-size:0.7rem;margin-bottom:0.3rem;">${r.label}</div>
          <div style="color:#c4b5fd;font-family:monospace;">${r.code}</div>
          <div style="margin-top:0.4rem;">= <span style="color:#fbbf24;font-weight:700;font-size:1.1rem;">${r.result}</span></div>`;
        row.appendChild(box);
      });
      viz.appendChild(row);
      const note = document.createElement('div');
      note.style.cssText = 'font-size:0.75rem;color:#64748b;';
      note.textContent = 'flip swaps the first two arguments — useful for point-free pipelines';
      viz.appendChild(note);
    });

    // ── always / identity ───────────────────────────────────────
    el.querySelector('#pf-const-run').addEventListener('click', () => {
      const list = el.querySelector('#pf-list').value.split(',').map(s => s.trim()).filter(Boolean);
      const viz = el.querySelector('#pf-const-viz');
      viz.innerHTML = '';

      const alwaysResult   = list.map(always(0));
      const identityResult = list.map(identity);

      [
        { label: `[${list.join(', ')}].map(always(0))`, result: alwaysResult, color: '#a78bfa' },
        { label: `[${list.join(', ')}].map(identity)`,  result: identityResult, color: '#4ade80' },
      ].forEach(row => {
        const wrap = document.createElement('div');
        wrap.style.cssText = 'margin-bottom:0.6rem;';
        wrap.innerHTML = `<div style="font-size:0.75rem;color:#64748b;margin-bottom:0.3rem;font-family:monospace;">${row.label}</div>`;
        const cells = document.createElement('div');
        cells.style.cssText = 'display:flex;gap:0.3rem;flex-wrap:wrap;';
        row.result.forEach(v => {
          const c = document.createElement('div');
          c.style.cssText = `padding:0.3rem 0.6rem;border-radius:6px;background:#1a1d2e;border:1px solid ${row.color}55;color:${row.color};font-family:monospace;font-size:0.85rem;`;
          c.textContent = v;
          cells.appendChild(c);
        });
        wrap.appendChild(cells);
        viz.appendChild(wrap);
      });
    });

    el.querySelector('#pf-pred-run').click();
    el.querySelector('#pf-flip-run').click();
    el.querySelector('#pf-const-run').click();
  },
};
