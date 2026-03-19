export default {
  id: 'monad-laws',
  label: 'monad laws',

  html: () => `
    <h2>Monad Laws</h2>
    <p class="subtitle">Every monad must satisfy three laws — these guarantee predictable composition</p>

    <div class="controls">
      <div>
        <label>Monad</label><br>
        <select id="ml-monad">
          <option value="maybe">Maybe</option>
          <option value="array">Array</option>
          <option value="identity">Identity</option>
        </select>
      </div>
      <div><label>a (number)</label><br><input id="ml-a" value="5" style="width:60px"></div>
      <button class="btn" id="ml-run">Verify Laws</button>
    </div>
    <div id="ml-viz"></div>

    <details class="source-block">
      <summary><span class="ti">▶</span> Source Code</summary>
      <pre><span class="c">// Law 1: Left identity</span>
<span class="c">// M.of(a).chain(f) === f(a)</span>
Maybe.of(5).chain(safeSqrt) deepEquals safeSqrt(5)  <span class="c">// ✓</span>

<span class="c">// Law 2: Right identity</span>
<span class="c">// m.chain(M.of) === m</span>
Maybe.of(5).chain(Maybe.of) deepEquals Maybe.of(5)  <span class="c">// ✓</span>

<span class="c">// Law 3: Associativity</span>
<span class="c">// m.chain(f).chain(g) === m.chain(x =&gt; f(x).chain(g))</span>
m.chain(f).chain(g) deepEquals m.chain(x =&gt; f(x).chain(g))  <span class="c">// ✓</span></pre>
    </details>`,

  mount(el) {
    const monads = {
      maybe: {
        name: 'Maybe',
        of: v => ({ type: v == null ? 'Nothing' : 'Just', value: v }),
        chain: (m, fn) => m.type === 'Nothing' ? m : fn(m.value),
        eq: (a, b) => JSON.stringify(a) === JSON.stringify(b),
        show: m => m.type === 'Nothing' ? 'Nothing' : `Just(${m.value})`,
        f: v => ({ type: v < 0 ? 'Nothing' : 'Just', value: Math.sqrt(v) }),
        g: v => ({ type: 'Just', value: Math.round(v * 100) / 100 }),
      },
      array: {
        name: 'Array',
        of: v => [v],
        chain: (m, fn) => m.flatMap(fn),
        eq: (a, b) => JSON.stringify(a) === JSON.stringify(b),
        show: m => JSON.stringify(m),
        f: v => [v, v * 2],
        g: v => [v + 1],
      },
      identity: {
        name: 'Identity',
        of: v => ({ value: v }),
        chain: (m, fn) => fn(m.value),
        eq: (a, b) => JSON.stringify(a) === JSON.stringify(b),
        show: m => `Identity(${m.value})`,
        f: v => ({ value: v * 2 }),
        g: v => ({ value: v + 10 }),
      },
    };

    el.querySelector('#ml-run').addEventListener('click', () => {
      const monadKey = el.querySelector('#ml-monad').value;
      const a        = parseFloat(el.querySelector('#ml-a').value) || 5;
      const M        = monads[monadKey];
      const viz      = el.querySelector('#ml-viz');
      viz.innerHTML  = '';

      const laws = [
        {
          name: 'Left Identity',
          formula: 'M.of(a).chain(f) === f(a)',
          lhs: M.chain(M.of(a), M.f),
          rhs: M.f(a),
          desc: 'Wrapping a value then chaining f is the same as just calling f(a)',
        },
        {
          name: 'Right Identity',
          formula: 'm.chain(M.of) === m',
          lhs: M.chain(M.of(a), M.of),
          rhs: M.of(a),
          desc: 'Chaining M.of returns the monad unchanged',
        },
        {
          name: 'Associativity',
          formula: 'm.chain(f).chain(g) === m.chain(x => f(x).chain(g))',
          lhs: M.chain(M.chain(M.of(a), M.f), M.g),
          rhs: M.chain(M.of(a), x => M.chain(M.f(x), M.g)),
          desc: 'Nesting chains and flattening them are equivalent',
        },
      ];

      laws.forEach(law => {
        const pass = M.eq(law.lhs, law.rhs);
        const box = document.createElement('div');
        box.style.cssText = `background:#1a1d2e;border:2px solid ${pass?'#16a34a':'#dc2626'};border-radius:12px;padding:1rem;margin-top:0.75rem;`;
        box.innerHTML = `
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem">
            <span style="font-weight:700;color:${pass?'#4ade80':'#f87171'};font-size:0.9rem">${pass?'✓':'✗'} ${law.name}</span>
            <span style="font-size:0.65rem;color:#4b5563">${M.name}</span>
          </div>
          <div style="font-size:0.7rem;color:#94a3b8;margin-bottom:0.5rem;font-family:monospace">${law.formula}</div>
          <div style="display:flex;gap:0.75rem;flex-wrap:wrap;font-size:0.78rem;">
            <div style="background:#0d1117;border-radius:6px;padding:0.4rem 0.6rem;">
              <span style="color:#64748b">LHS: </span><span style="color:#fbbf24">${M.show(law.lhs)}</span>
            </div>
            <div style="background:#0d1117;border-radius:6px;padding:0.4rem 0.6rem;">
              <span style="color:#64748b">RHS: </span><span style="color:#fbbf24">${M.show(law.rhs)}</span>
            </div>
          </div>
          <div style="font-size:0.7rem;color:#64748b;margin-top:0.4rem">${law.desc}</div>`;
        viz.appendChild(box);
      });

      const allPass = laws.every(l => M.eq(l.lhs, l.rhs));
      const summary = document.createElement('div');
      summary.style.cssText = `margin-top:0.75rem;padding:0.75rem;border-radius:8px;background:${allPass?'#052e16':'#2d0a0a'};border:1px solid ${allPass?'#16a34a':'#dc2626'};font-size:0.85rem;color:${allPass?'#4ade80':'#f87171'};font-weight:700;text-align:center;`;
      summary.textContent = allPass ? `✓ ${M.name} satisfies all 3 monad laws` : `✗ ${M.name} violates at least one law`;
      viz.appendChild(summary);
    });

    el.querySelector('#ml-run').click();
  },
};
