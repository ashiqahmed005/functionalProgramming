export default {
  id: 'generators',
  label: 'generators',

  html: () => `
    <h2>Generators &amp; Lazy Sequences</h2>
    <p class="subtitle">Pull values one at a time — infinite sequences without infinite memory</p>

    <h3 class="section-title">1. Lazy range — pull values on demand</h3>
    <div class="controls">
      <div><label>Start</label><br><input id="gen-start" value="1" style="width:60px"></div>
      <div><label>End</label><br><input id="gen-end" value="10" style="width:60px"></div>
      <div><label>Step</label><br><input id="gen-step" value="2" style="width:60px"></div>
      <button class="btn" id="gen-pull">Pull next</button>
      <button class="btn secondary" id="gen-reset">Reset</button>
    </div>
    <div id="gen-viz" style="margin:0.75rem 0;display:flex;gap:0.4rem;flex-wrap:wrap;min-height:40px"></div>
    <div class="log" id="gen-log"></div>

    <hr class="section-divider">

    <h3 class="section-title">2. Infinite Fibonacci — pull forever</h3>
    <div class="controls">
      <button class="btn" id="fib-next">Pull next fib</button>
      <button class="btn secondary" id="fib-reset">Reset</button>
      <div><label>Auto-pull N</label><br><input id="fib-n" value="8" style="width:60px"></div>
      <button class="btn" id="fib-auto">Auto pull N</button>
    </div>
    <div id="fib-viz" style="margin:0.75rem 0;display:flex;gap:0.4rem;flex-wrap:wrap;min-height:40px"></div>

    <hr class="section-divider">

    <h3 class="section-title">3. zip — pair two sequences</h3>
    <div class="controls">
      <div><label>Seq A (comma list)</label><br><input id="zip-a" value="1,2,3,4,5" style="width:140px"></div>
      <div><label>Seq B (comma list)</label><br><input id="zip-b" value="a,b,c,d" style="width:140px"></div>
      <button class="btn" id="zip-run">Zip</button>
    </div>
    <div id="zip-viz" style="margin:0.75rem 0"></div>

    <details class="source-block">
      <summary><span class="ti">▶</span> Source Code</summary>
      <pre><span class="c">// Lazy range generator</span>
function* range(start, end, step = 1) {
  for (let i = start; i &lt;= end; i += step) yield i;
}

<span class="c">// Infinite Fibonacci generator</span>
function* fibGen() {
  let [a, b] = [0, 1];
  while (true) { yield a; [a, b] = [b, a + b]; }
}

<span class="c">// zip — pairs two iterables</span>
function* zip(iterA, iterB) {
  const a = iterA[Symbol.iterator]();
  const b = iterB[Symbol.iterator]();
  while (true) {
    const ra = a.next(), rb = b.next();
    if (ra.done || rb.done) return;
    yield [ra.value, rb.value];
  }
}

<span class="c">// Usage — lazy, no array built until needed</span>
const nums = range(1, 1_000_000); <span class="c">// no memory used</span>
const first5 = [...take(5, nums)]; <span class="c">// [1,2,3,4,5]</span></pre>
    </details>`,

  mount(el) {
    // ── range generator ───────────────────────────────────────────────────────
    let rangeGen = null;
    const genViz = el.querySelector('#gen-viz');
    const genLog = el.querySelector('#gen-log');

    const makeRange = function*(start, end, step) {
      for (let i = start; i <= end; i += step) yield i;
    };

    const initRange = () => {
      const s = parseFloat(el.querySelector('#gen-start').value) || 1;
      const e = parseFloat(el.querySelector('#gen-end').value)   || 10;
      const st= parseFloat(el.querySelector('#gen-step').value)  || 1;
      rangeGen = makeRange(s, e, st);
      genViz.innerHTML = '';
      genLog.innerHTML = `<span class="info">Generator created: range(${s}, ${e}, ${st}) — pull values one at a time</span>`;
    };

    el.querySelector('#gen-reset').addEventListener('click', initRange);

    el.querySelector('#gen-pull').addEventListener('click', () => {
      if (!rangeGen) initRange();
      const { value, done } = rangeGen.next();
      if (done) {
        genLog.innerHTML += '<br><span class="skip">⏹ Generator exhausted — { done: true }</span>';
        return;
      }
      const cell = document.createElement('div');
      cell.style.cssText = 'background:#1a1d2e;border:1px solid #7c3aed;border-radius:6px;padding:0.4rem 0.6rem;font-size:0.85rem;color:#a78bfa;font-weight:700;animation:fadeIn 0.3s';
      cell.textContent = value;
      genViz.appendChild(cell);
      genLog.innerHTML += `<br><span class="step">yield ${value}</span>`;
    });

    initRange();

    // ── infinite fib ─────────────────────────────────────────────────────────
    const fibViz = el.querySelector('#fib-viz');
    let fibGen = null;

    const makeFib = function*() { let [a,b]=[0,1]; while(true){ yield a; [a,b]=[b,a+b]; } };

    const initFib = () => { fibGen = makeFib(); fibViz.innerHTML = ''; };

    el.querySelector('#fib-reset').addEventListener('click', initFib);

    const pullFib = () => {
      if (!fibGen) initFib();
      const { value } = fibGen.next();
      const cell = document.createElement('div');
      cell.style.cssText = 'background:#1a1d2e;border:1px solid #fbbf24;border-radius:6px;padding:0.4rem 0.6rem;font-size:0.8rem;color:#fbbf24;font-weight:700;';
      cell.textContent = value;
      fibViz.appendChild(cell);
    };

    el.querySelector('#fib-next').addEventListener('click', pullFib);

    el.querySelector('#fib-auto').addEventListener('click', async () => {
      initFib();
      const n = parseInt(el.querySelector('#fib-n').value) || 8;
      for (let i = 0; i < n; i++) {
        pullFib();
        await new Promise(r => setTimeout(r, 200));
      }
    });

    initFib();

    // ── zip ───────────────────────────────────────────────────────────────────
    el.querySelector('#zip-run').addEventListener('click', () => {
      const a = el.querySelector('#zip-a').value.split(',').map(s => s.trim());
      const b = el.querySelector('#zip-b').value.split(',').map(s => s.trim());
      const min = Math.min(a.length, b.length);
      const viz = el.querySelector('#zip-viz');
      viz.innerHTML = '';

      const rows = document.createElement('div');
      rows.style.cssText = 'display:flex;flex-direction:column;gap:0.5rem;';

      // row A
      const rowA = document.createElement('div');
      rowA.style.cssText = 'display:flex;gap:0.4rem;align-items:center;';
      rowA.innerHTML = '<span style="font-size:0.7rem;color:#64748b;width:50px">Seq A:</span>';
      a.forEach((v, i) => {
        const c = document.createElement('div');
        c.style.cssText = `background:${i<min?'#1a1d2e':'#0d1117'};border:1px solid ${i<min?'#a78bfa':'#2d3148'};border-radius:5px;padding:0.3rem 0.5rem;font-size:0.8rem;color:${i<min?'#a78bfa':'#4b5563'};`;
        c.textContent = v; rowA.appendChild(c);
      });
      rows.appendChild(rowA);

      // row B
      const rowB = document.createElement('div');
      rowB.style.cssText = 'display:flex;gap:0.4rem;align-items:center;';
      rowB.innerHTML = '<span style="font-size:0.7rem;color:#64748b;width:50px">Seq B:</span>';
      b.forEach((v, i) => {
        const c = document.createElement('div');
        c.style.cssText = `background:${i<min?'#1a1d2e':'#0d1117'};border:1px solid ${i<min?'#fbbf24':'#2d3148'};border-radius:5px;padding:0.3rem 0.5rem;font-size:0.8rem;color:${i<min?'#fbbf24':'#4b5563'};`;
        c.textContent = v; rowB.appendChild(c);
      });
      rows.appendChild(rowB);

      // zipped
      const rowZ = document.createElement('div');
      rowZ.style.cssText = 'display:flex;gap:0.4rem;align-items:center;';
      rowZ.innerHTML = '<span style="font-size:0.7rem;color:#64748b;width:50px">zip:</span>';
      for (let i = 0; i < min; i++) {
        const c = document.createElement('div');
        c.style.cssText = 'background:#052e16;border:1px solid #16a34a;border-radius:5px;padding:0.3rem 0.5rem;font-size:0.75rem;color:#4ade80;';
        c.textContent = `[${a[i]},${b[i]}]`; rowZ.appendChild(c);
      }
      rows.appendChild(rowZ);

      viz.appendChild(rows);
      viz.innerHTML += `<div style="font-size:0.75rem;color:#64748b;margin-top:0.5rem">Stops at shortest: ${min} pairs (${a.length - min} from A dropped)</div>`;
    });

    el.querySelector('#zip-run').click();
    el.querySelector('#fib-auto').click();
  },
};
