export default {
  id: 'io',
  label: 'IO monad',

  html: () => `
    <h2>IO Monad</h2>
    <p class="subtitle">Wrap side effects in a lazy box — describe what to do, run it explicitly</p>

    <h3 class="section-title">Build an IO pipeline — click Run to execute</h3>
    <div class="controls">
      <div><label>Your name</label><br><input id="io-name" value="Alice" style="width:120px"></div>
      <button class="btn" id="io-run">Run IO</button>
      <button class="btn secondary" id="io-reset">Reset</button>
    </div>
    <div id="io-chain" style="margin:0.75rem 0"></div>
    <div class="log" id="io-log"></div>

    <hr class="section-divider">

    <h3 class="section-title">Why IO? — eager vs lazy</h3>
    <div id="io-why" style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:0.75rem">
      <div style="background:#2d0a0a;border:1px solid #7f1d1d;border-radius:10px;padding:1rem">
        <div style="color:#f87171;font-size:0.8rem;font-weight:700;margin-bottom:0.5rem">❌ Eager (fires on import)</div>
        <pre style="font-size:0.75rem;color:#fca5a5">const now = Date.now();
<span style="color:#64748b">// executes NOW, untestable</span></pre>
      </div>
      <div style="background:#052e16;border:1px solid #166534;border-radius:10px;padding:1rem">
        <div style="color:#4ade80;font-size:0.8rem;font-weight:700;margin-bottom:0.5rem">✓ Lazy IO (fires on .run())</div>
        <pre style="font-size:0.75rem;color:#86efac">const now = IO(() =&gt; Date.now());
<span style="color:#64748b">// described, not executed</span>
now.run(); <span style="color:#64748b">// YOU control when</span></pre>
      </div>
    </div>

    <details class="source-block">
      <summary><span class="ti">▶</span> Source Code</summary>
      <pre><span class="c">// IO monad — wraps side effects, defers execution</span>
class IO {
  #effect;
  constructor(effect) { this.#effect = effect; }

  static of(val) { return new IO(() =&gt; val); }

  map(fn)   { return new IO(() =&gt; fn(this.#effect())); }
  chain(fn) { return new IO(() =&gt; fn(this.#effect()).run()); }
  run()     { return this.#effect(); }
}

<span class="c">// Build a pipeline — nothing fires until .run()</span>
const program = IO.of('alice')
  .map(name =&gt; name.toUpperCase())
  .map(name =&gt; \`Hello, \${name}!\`)
  .chain(msg =&gt; new IO(() =&gt; { console.log(msg); return msg; }));

program.run(); <span class="c">// "Hello, ALICE!" — only now</span></pre>
    </details>`,

  mount(el) {
    const renderChain = (steps, doneTo = -1) => {
      const chain = el.querySelector('#io-chain');
      chain.innerHTML = '';
      const row = document.createElement('div');
      row.style.cssText = 'display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;';

      steps.forEach((s, i) => {
        if (i > 0) {
          const arr = document.createElement('div');
          arr.style.cssText = 'color:#4b5563;font-size:1.2rem;';
          arr.textContent = '→';
          row.appendChild(arr);
        }
        const box = document.createElement('div');
        const done = i <= doneTo;
        box.style.cssText = `border-radius:10px;padding:0.6rem 0.9rem;border:2px solid;transition:all 0.4s;min-width:100px;text-align:center;`;
        Object.assign(box.style, done
          ? { background:'#052e16', borderColor:'#16a34a' }
          : { background:'#1a1d2e', borderColor:'#2d3148' });
        box.innerHTML = `
          <div style="font-size:0.65rem;color:${done?'#86efac':'#64748b'};margin-bottom:0.25rem">${s.op}</div>
          <div style="font-size:0.75rem;color:${done?'#4ade80':'#94a3b8'}">${s.label}</div>
          ${done ? '<div style="font-size:0.65rem;color:#4ade80;margin-top:0.2rem">✓ executed</div>' : '<div style="font-size:0.65rem;color:#4b5563;margin-top:0.2rem">pending…</div>'}`;
        row.appendChild(box);
      });
      chain.appendChild(row);
    };

    el.querySelector('#io-reset').addEventListener('click', () => {
      const name = el.querySelector('#io-name').value || 'Alice';
      const steps = buildSteps(name);
      renderChain(steps, -1);
      el.querySelector('#io-log').innerHTML = '<span style="color:#4b5563;font-size:0.8rem">IO pipeline built — not yet executed. Click Run.</span>';
    });

    const buildSteps = (name) => [
      { op: 'IO.of()', label: `"${name}"` },
      { op: '.map()', label: name.toUpperCase() },
      { op: '.map()', label: `"Hello, ${name.toUpperCase()}!"` },
      { op: '.chain()', label: 'IO(log effect)' },
      { op: '.run()', label: '⚡ execute' },
    ];

    el.querySelector('#io-run').addEventListener('click', async () => {
      const name = el.querySelector('#io-name').value || 'Alice';
      const steps = buildSteps(name);
      const log = el.querySelector('#io-log');
      log.innerHTML = '';

      for (let i = 0; i < steps.length; i++) {
        renderChain(steps, i);
        await new Promise(r => setTimeout(r, 500));
        if (i === 4) {
          log.innerHTML = `<span class="ok">✓ IO.run() called → "Hello, ${name.toUpperCase()}!" — side effect fired</span>`;
        }
      }
    });

    // Init
    const name = el.querySelector('#io-name').value || 'Alice';
    renderChain(buildSteps(name), -1);
    el.querySelector('#io-log').innerHTML = '<span style="color:#4b5563;font-size:0.8rem">IO pipeline built — not yet executed. Click Run.</span>';
  },
};
