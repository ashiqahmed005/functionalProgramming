export default {
  id: 'functors',
  label: 'functors',

  html: () => `
    <h2>Functors</h2>
    <p class="subtitle">A container you can map over — preserving structure while transforming values</p>

    <h3 class="section-title">1. Box — the simplest functor</h3>
    <div class="controls">
      <div><label>Input string</label><br><input id="ft-input" value="  hello world  " style="width:180px"></div>
      <button class="btn" id="ft-run">Run Pipeline</button>
    </div>
    <div id="ft-viz"></div>

    <hr class="section-divider">

    <h3 class="section-title">2. Functor Laws</h3>
    <div class="controls">
      <div><label>Number</label><br><input id="ft-law-n" value="7" style="width:80px"></div>
      <button class="btn" id="ft-law-run">Check Laws</button>
    </div>
    <div id="ft-law-viz"></div>

    <details class="source-block">
      <summary><span class="ti">▶</span> Source Code <span class="sf">Box functor</span></summary>
      <pre><span class="c">// Box — wraps a value and makes it mappable</span>
class Box {
  constructor(value) { this._value = value; }
  static of(value)  { return new Box(value); }

  map(fn) { return Box.of(fn(this._value)); }
  fold(fn) { return fn(this._value); }           <span class="c">// unwrap</span>

  toString() { return \`Box(\${this._value})\`; }
}

<span class="c">// Pipeline via chained .map()</span>
const result = Box.of('  hello world  ')
  .map(s => s.trim())
  .map(s => s.toUpperCase())
  .map(s => s.replace(/ /g, '_'))
  .fold(x => x);  <span class="c">// 'HELLO_WORLD'</span>

<span class="c">// Functor law 1 — Identity</span>
<span class="c">// box.map(x => x)  ===  box</span>

<span class="c">// Functor law 2 — Composition</span>
<span class="c">// box.map(f).map(g) === box.map(x => g(f(x)))</span></pre>
    </details>`,

  mount(el) {
    class Box {
      constructor(value) { this._value = value; }
      static of(value)  { return new Box(value); }
      map(fn)  { return Box.of(fn(this._value)); }
      fold(fn) { return fn(this._value); }
      toString() { return `Box(${JSON.stringify(this._value)})`; }
    }

    const pipeline = [
      { label: 'trim()',                    fn: s => s.trim() },
      { label: 'toUpperCase()',             fn: s => s.toUpperCase() },
      { label: "replace(/ /g, '_')",        fn: s => s.replace(/ /g, '_') },
    ];

    // ── Pipeline visualization ───────────────────────────────────
    el.querySelector('#ft-run').addEventListener('click', () => {
      const input = el.querySelector('#ft-input').value;
      const viz = el.querySelector('#ft-viz');
      viz.innerHTML = '';

      const wrap = document.createElement('div');
      wrap.style.cssText = 'display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;margin-bottom:1rem;';

      const steps = [{ label: `Box.of(input)`, value: input }];
      let box = Box.of(input);
      pipeline.forEach(p => {
        box = box.map(p.fn);
        steps.push({ label: `.map(${p.label})`, value: box._value });
      });
      steps.push({ label: '.fold(x => x)', value: box.fold(x => x) });

      steps.forEach((s, i) => {
        if (i > 0) {
          const arr = document.createElement('span');
          arr.style.cssText = 'color:#4b5563;font-size:1.2rem;';
          arr.textContent = '→';
          wrap.appendChild(arr);
        }
        const outer = document.createElement('div');
        outer.style.cssText = 'border:2px solid #a78bfa55;border-radius:10px;padding:0.5rem;background:#1a1d2e;min-width:120px;text-align:center;';
        const inner = document.createElement('div');
        inner.style.cssText = `border:1px solid ${i === steps.length - 1 ? '#4ade8055' : '#3b82f655'};border-radius:6px;padding:0.4rem 0.6rem;background:#0d1117;margin-bottom:0.3rem;`;
        inner.innerHTML = `<span style="color:${i === steps.length - 1 ? '#4ade80' : '#93c5fd'};font-family:monospace;font-size:0.75rem;word-break:break-all;">${JSON.stringify(s.value)}</span>`;
        const lbl = document.createElement('div');
        lbl.style.cssText = 'font-size:0.65rem;color:#64748b;';
        lbl.textContent = s.label;
        outer.appendChild(inner);
        outer.appendChild(lbl);
        wrap.appendChild(outer);
      });

      viz.appendChild(wrap);
    });

    // ── Functor Laws ─────────────────────────────────────────────
    el.querySelector('#ft-law-run').addEventListener('click', () => {
      const n = parseFloat(el.querySelector('#ft-law-n').value) || 7;
      const viz = el.querySelector('#ft-law-viz');
      viz.innerHTML = '';

      const id = x => x;
      const f  = x => x * 2;
      const g  = x => x + 10;

      const box = Box.of(n);
      const law1lhs = box.map(id).fold(x => x);
      const law1rhs = box.fold(x => x);
      const law1ok  = law1lhs === law1rhs;

      const law2lhs = box.map(f).map(g).fold(x => x);
      const law2rhs = box.map(x => g(f(x))).fold(x => x);
      const law2ok  = law2lhs === law2rhs;

      const laws = [
        { name: 'Identity',    lhsLabel: `Box(${n}).map(x => x)`, rhsLabel: `Box(${n})`,             lhs: law1lhs, rhs: law1rhs, ok: law1ok },
        { name: 'Composition', lhsLabel: `Box(${n}).map(f).map(g)`, rhsLabel: `Box(${n}).map(g∘f)`, lhs: law2lhs, rhs: law2rhs, ok: law2ok },
      ];

      laws.forEach(law => {
        const row = document.createElement('div');
        row.style.cssText = 'display:flex;align-items:center;gap:0.75rem;margin-bottom:0.6rem;flex-wrap:wrap;';
        row.innerHTML = `
          <div style="min-width:100px;font-size:0.75rem;color:#a78bfa;font-weight:600;">${law.name}</div>
          <div style="background:#1a1d2e;border:1px solid #3d4166;border-radius:6px;padding:0.4rem 0.75rem;font-family:monospace;font-size:0.78rem;color:#c4b5fd;">${law.lhsLabel} = <strong>${law.lhs}</strong></div>
          <div style="color:#64748b;">≡</div>
          <div style="background:#1a1d2e;border:1px solid #3d4166;border-radius:6px;padding:0.4rem 0.75rem;font-family:monospace;font-size:0.78rem;color:#c4b5fd;">${law.rhsLabel} = <strong>${law.rhs}</strong></div>
          <div style="font-size:1.2rem;">${law.ok ? '<span style="color:#4ade80">✓ passes</span>' : '<span style="color:#f87171">✗ fails</span>'}</div>`;
        viz.appendChild(row);
      });
    });

    el.querySelector('#ft-run').click();
    el.querySelector('#ft-law-run').click();
  },
};
