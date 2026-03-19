export default {
  id: 'applicative',
  label: 'applicative functors',

  html: () => `
    <h2>Applicative Functors</h2>
    <p class="subtitle">Apply a function inside a container to a value inside a container — <code>F(a→b).ap(F(a)) = F(b)</code></p>

    <h3 class="section-title">1. liftA2 with Maybe — both values must exist</h3>
    <div class="controls">
      <div><label>x (empty = Nothing)</label><br><input id="ap-x" value="5" style="width:80px" placeholder="empty=Nothing"></div>
      <div><label>y (empty = Nothing)</label><br><input id="ap-y" value="3" style="width:80px" placeholder="empty=Nothing"></div>
      <div>
        <label>operation</label><br>
        <select id="ap-op">
          <option value="add">x + y</option>
          <option value="mul">x * y</option>
          <option value="sub">x - y</option>
          <option value="max">max(x, y)</option>
        </select>
      </div>
      <button class="btn" id="ap-run">Run liftA2</button>
    </div>
    <div id="ap-viz"></div>

    <hr class="section-divider">

    <h3 class="section-title">2. ap — function in a box applied to value in a box</h3>
    <div class="controls">
      <div><label>Multiplier</label><br><input id="ap2-k" value="2" style="width:60px"></div>
      <div><label>Value</label><br><input id="ap2-v" value="7" style="width:60px"></div>
      <button class="btn" id="ap2-run">Run ap</button>
    </div>
    <div id="ap2-viz"></div>

    <details class="source-block">
      <summary><span class="ti">▶</span> Source Code</summary>
      <pre><span class="c">// Minimal Maybe for ap demo</span>
const Maybe = {
  Just:    v  => ({ type: 'Just',    value: v }),
  Nothing: () => ({ type: 'Nothing', value: null }),
  of:      v  => v == null ? Maybe.Nothing() : Maybe.Just(v),
};

<span class="c">// ap — apply function wrapped in Maybe to value wrapped in Maybe</span>
const ap = (mFn, mVal) => {
  if (mFn.type === 'Nothing' || mVal.type === 'Nothing') return Maybe.Nothing();
  return Maybe.Just(mFn.value(mVal.value));
};

<span class="c">// liftA2 — lift a binary function into the Maybe context</span>
const liftA2 = (fn, ma, mb) =>
  ap(ma.type === 'Just' ? Maybe.Just(x =&gt; fn(x, mb.value)) : Maybe.Nothing(), mb.type === 'Just' ? mb : Maybe.Nothing());

<span class="c">// Usage</span>
liftA2((a, b) =&gt; a + b, Maybe.of(5), Maybe.of(3));  <span class="c">// Just(8)</span>
liftA2((a, b) =&gt; a + b, Maybe.of(null), Maybe.of(3)); <span class="c">// Nothing</span></pre>
    </details>`,

  mount(el) {
    const box = (label, content, color = '#7c3aed', subtext = '') => `
      <div style="background:#1a1d2e;border:2px solid ${color};border-radius:12px;padding:0.75rem 1rem;text-align:center;min-width:90px">
        <div style="font-size:0.65rem;color:#64748b;margin-bottom:0.2rem">${label}</div>
        <div style="font-size:1.1rem;font-weight:700;color:${color}">${content}</div>
        ${subtext ? `<div style="font-size:0.6rem;color:#4b5563;margin-top:0.2rem">${subtext}</div>` : ''}
      </div>`;

    const arrow = (lbl = '') => `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.2rem">
        <div style="color:#4b5563;font-size:0.65rem">${lbl}</div>
        <div style="color:#a78bfa;font-size:1.2rem">→</div>
      </div>`;

    // ── liftA2 ───────────────────────────────────────────────────────────────
    el.querySelector('#ap-run').addEventListener('click', () => {
      const xRaw = el.querySelector('#ap-x').value.trim();
      const yRaw = el.querySelector('#ap-y').value.trim();
      const op   = el.querySelector('#ap-op').value;
      const ops  = { add: (a,b)=>a+b, mul: (a,b)=>a*b, sub: (a,b)=>a-b, max: (a,b)=>Math.max(a,b) };
      const opStr = { add:'+', mul:'×', sub:'-', max:'max' };

      const xVal = xRaw === '' ? null : parseFloat(xRaw);
      const yVal = yRaw === '' ? null : parseFloat(yRaw);

      const mx = xVal == null ? { type:'Nothing' } : { type:'Just', value: xVal };
      const my = yVal == null ? { type:'Nothing' } : { type:'Just', value: yVal };

      let result, resultColor;
      if (mx.type === 'Just' && my.type === 'Just') {
        result = { type: 'Just', value: ops[op](xVal, yVal) };
        resultColor = '#4ade80';
      } else {
        result = { type: 'Nothing' };
        resultColor = '#f87171';
      }

      const viz = el.querySelector('#ap-viz');
      viz.innerHTML = `
        <div style="display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;margin-top:0.75rem">
          ${box('Maybe x', mx.type === 'Just' ? `Just(${xVal})` : 'Nothing', mx.type === 'Just' ? '#a78bfa' : '#f87171')}
          ${arrow(opStr[op])}
          ${box('Maybe y', my.type === 'Just' ? `Just(${yVal})` : 'Nothing', my.type === 'Just' ? '#a78bfa' : '#f87171')}
          ${arrow('liftA2')}
          ${box('Result', result.type === 'Just' ? `Just(${result.value})` : 'Nothing', resultColor, result.type === 'Nothing' ? 'short-circuits on Nothing' : '')}
        </div>
        <div style="margin-top:0.6rem;font-size:0.75rem;color:#64748b">
          ${result.type === 'Nothing' ? '✗ Either operand is Nothing — result is Nothing (safe by design)' : `✓ liftA2((a,b) => a ${opStr[op]} b, Just(${xVal}), Just(${yVal})) = Just(${result.value})`}
        </div>`;
    });

    // ── ap ───────────────────────────────────────────────────────────────────
    el.querySelector('#ap2-run').addEventListener('click', () => {
      const k = parseFloat(el.querySelector('#ap2-k').value) || 2;
      const v = parseFloat(el.querySelector('#ap2-v').value) || 7;
      const viz = el.querySelector('#ap2-viz');

      const steps = [
        { label: 'Step 1', content: `Maybe.of(x => x * ${k})`, note: 'wrap the function in Maybe' },
        { label: 'Step 2', content: `Maybe.of(${v})`, note: 'wrap the value in Maybe' },
        { label: 'Step 3', content: `.ap(Maybe.of(${v}))`, note: 'apply fn-in-box to val-in-box' },
        { label: 'Result', content: `Just(${k * v})`, note: `${k} × ${v}`, color: '#4ade80' },
      ];

      viz.innerHTML = `<div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;margin-top:0.75rem">
        ${steps.map((s, i) => `
          ${i > 0 ? arrow() : ''}
          ${box(s.label, s.content, s.color || '#a78bfa', s.note)}
        `).join('')}
      </div>`;
    });

    el.querySelector('#ap-run').click();
    el.querySelector('#ap2-run').click();
  },
};
