export default {
  id: 'cps',
  label: 'CPS',

  html: () => `
    <h2>Continuation-Passing Style (CPS)</h2>
    <p class="subtitle">Instead of returning a value, pass it to a callback — chain async-like logic synchronously</p>

    <h3 class="section-title">Pipeline: parse → validate → transform</h3>
    <div class="controls">
      <div><label>Input</label><br><input id="cps-input" value="42" style="width:120px" placeholder="try 'abc' or negative"></div>
      <div>
        <label>Transform</label><br>
        <select id="cps-op">
          <option value="double">× 2</option>
          <option value="square">² (square)</option>
          <option value="toStr">toString</option>
        </select>
      </div>
      <button class="btn" id="cps-run">Run Pipeline</button>
    </div>
    <div id="cps-viz"></div>
    <div class="log" id="cps-log"></div>

    <hr class="section-divider">

    <h3 class="section-title">CPS vs direct style</h3>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:0.75rem">
      <div style="background:#1a1d2e;border:1px solid #2d3148;border-radius:10px;padding:1rem">
        <div style="color:#a78bfa;font-size:0.8rem;font-weight:700;margin-bottom:0.5rem">Direct style</div>
        <pre style="font-size:0.75rem;color:#cbd5e1">const add = (a, b) =&gt; a + b;
const result = add(2, 3);
console.log(result); <span style="color:#64748b">// 5</span></pre>
      </div>
      <div style="background:#1a1d2e;border:1px solid #2d3148;border-radius:10px;padding:1rem">
        <div style="color:#4ade80;font-size:0.8rem;font-weight:700;margin-bottom:0.5rem">CPS style</div>
        <pre style="font-size:0.75rem;color:#cbd5e1">const addCPS = (a, b, k) =&gt; k(a + b);
addCPS(2, 3, result =&gt; {
  console.log(result); <span style="color:#64748b">// 5</span>
});</pre>
      </div>
    </div>

    <details class="source-block">
      <summary><span class="ti">▶</span> Source Code</summary>
      <pre><span class="c">// CPS — each function takes a success and fail continuation</span>
const parseCPS = (str, ok, fail) =&gt; {
  const n = Number(str);
  return isNaN(n) ? fail(\`Cannot parse "\${str}"\`) : ok(n);
};

const validateCPS = (n, ok, fail) =&gt;
  n &lt; 0 ? fail(\`\${n} is negative\`) : ok(n);

const transformCPS = (n, op, ok) =&gt; {
  const ops = { double: n*2, square: n*n, toStr: String(n) };
  return ok(ops[op]);
};

<span class="c">// Chain them</span>
parseCPS(input,
  n =&gt; validateCPS(n,
    n =&gt; transformCPS(n, 'double', result =&gt; console.log(result)),
    err =&gt; console.error(err)),
  err =&gt; console.error(err));</pre>
    </details>`,

  mount(el) {
    el.querySelector('#cps-run').addEventListener('click', async () => {
      const input = el.querySelector('#cps-input').value;
      const op    = el.querySelector('#cps-op').value;
      const viz   = el.querySelector('#cps-viz');
      const log   = el.querySelector('#cps-log');
      viz.innerHTML = ''; log.innerHTML = '';

      const steps = [
        { name: 'parse',    desc: `parseCPS("${input}")` },
        { name: 'validate', desc: '' },
        { name: 'transform',desc: '' },
      ];

      const renderStep = (idx, state, detail) => {
        viz.innerHTML = '';
        const row = document.createElement('div');
        row.style.cssText = 'display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;margin-top:0.75rem;';

        steps.forEach((s, i) => {
          if (i > 0) {
            const arr = document.createElement('div');
            arr.style.cssText = 'color:#4b5563;font-size:1.2rem;';
            arr.textContent = i <= idx && state !== 'fail' ? '→' : '⇢';
            row.appendChild(arr);
          }
          const box = document.createElement('div');
          let bg = '#1a1d2e', border = '#2d3148', color = '#64748b';
          if (i < idx) { bg='#052e16'; border='#16a34a'; color='#4ade80'; }
          else if (i === idx) {
            bg = state === 'fail' ? '#2d0a0a' : '#1a1d2e';
            border = state === 'fail' ? '#dc2626' : '#f59e0b';
            color  = state === 'fail' ? '#f87171' : '#fbbf24';
          }
          box.style.cssText = `border-radius:10px;padding:0.6rem 0.9rem;border:2px solid ${border};background:${bg};text-align:center;min-width:90px;transition:all 0.3s;`;
          box.innerHTML = `<div style="font-size:0.75rem;font-weight:700;color:${color}">${s.name}</div>
            <div style="font-size:0.65rem;color:#4b5563;margin-top:0.2rem">${i === idx ? detail : i < idx ? '✓ ok' : 'waiting'}</div>`;
          row.appendChild(box);
        });
        viz.appendChild(row);
      };

      // Step 1: parse
      renderStep(0, 'active', `parsing "${input}"...`);
      await new Promise(r => setTimeout(r, 500));
      const n = Number(input);
      if (isNaN(n)) {
        renderStep(0, 'fail', `Cannot parse "${input}"`);
        log.innerHTML = `<span class="skip">✗ Parse failed: "${input}" is not a number — fail continuation called</span>`;
        return;
      }
      renderStep(0, 'ok', `parsed → ${n}`);
      log.innerHTML += `<span class="ok">✓ parse: "${input}" → ${n}</span><br>`;

      // Step 2: validate
      await new Promise(r => setTimeout(r, 500));
      renderStep(1, 'active', `validating ${n}...`);
      await new Promise(r => setTimeout(r, 500));
      if (n < 0) {
        renderStep(1, 'fail', `${n} is negative`);
        log.innerHTML += `<span class="skip">✗ validate: ${n} is negative — fail continuation called</span>`;
        return;
      }
      renderStep(1, 'ok', `${n} ≥ 0 ✓`);
      log.innerHTML += `<span class="ok">✓ validate: ${n} ≥ 0</span><br>`;

      // Step 3: transform
      await new Promise(r => setTimeout(r, 500));
      const ops = { double: n*2, square: n*n, toStr: String(n) };
      const result = ops[op];
      steps[2].desc = `${op}(${n})`;
      renderStep(2, 'active', `${op}(${n})...`);
      await new Promise(r => setTimeout(r, 500));
      renderStep(2, 'ok', `= ${result}`);
      log.innerHTML += `<span class="ok">✓ transform (${op}): ${n} → <strong>${result}</strong></span>`;
    });

    el.querySelector('#cps-run').click();
  },
};
