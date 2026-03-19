export default {
  id: 'ycombinator',
  label: 'Y combinator',

  html: () => `
    <h2>Y Combinator</h2>
    <p class="subtitle">Derive recursion without self-reference — give anonymous functions the ability to call themselves</p>

    <h3 class="section-title">Build recursion from scratch</h3>
    <div style="margin:0.75rem 0;display:flex;flex-direction:column;gap:0.6rem" id="y-steps-explain">
      <div style="background:#1a1d2e;border:1px solid #2d3148;border-radius:8px;padding:0.75rem">
        <div style="font-size:0.7rem;color:#64748b;margin-bottom:0.3rem">Step 1 — factorial factory (no self-reference)</div>
        <pre style="font-size:0.78rem;color:#a78bfa">const factFactory = self =&gt; n =&gt; n &lt;= 1 ? 1 : n * self(self)(n - 1);</pre>
      </div>
      <div style="background:#1a1d2e;border:1px solid #2d3148;border-radius:8px;padding:0.75rem">
        <div style="font-size:0.7rem;color:#64748b;margin-bottom:0.3rem">Step 2 — call it with itself</div>
        <pre style="font-size:0.78rem;color:#fbbf24">const fact = factFactory(factFactory);
fact(5); <span style="color:#64748b">// 120</span></pre>
      </div>
      <div style="background:#1a1d2e;border:1px solid #7c3aed;border-radius:8px;padding:0.75rem">
        <div style="font-size:0.7rem;color:#a78bfa;margin-bottom:0.3rem">Step 3 — Y abstracts this pattern</div>
        <pre style="font-size:0.78rem;color:#4ade80">const Y = f =&gt; (x =&gt; f(v =&gt; x(x)(v)))(x =&gt; f(v =&gt; x(x)(v)));
const factorial = Y(self =&gt; n =&gt; n &lt;= 1 ? 1 : n * self(n - 1));
factorial(5); <span style="color:#64748b">// 120</span></pre>
      </div>
    </div>

    <h3 class="section-title">Compute Y(fn)(n)</h3>
    <div class="controls">
      <div>
        <label>Function</label><br>
        <select id="y-fn">
          <option value="factorial">factorial</option>
          <option value="fib">fibonacci</option>
          <option value="sum">sum 1..n</option>
        </select>
      </div>
      <div><label>n</label><br><input id="y-n" value="6" style="width:60px"></div>
      <button class="btn" id="y-run">Run Y</button>
    </div>
    <div id="y-viz"></div>
    <div class="log" id="y-log"></div>

    <details class="source-block">
      <summary><span class="ti">▶</span> Source Code</summary>
      <pre><span class="c">// Y combinator (applicative order)</span>
const Y = f =&gt; (x =&gt; f(v =&gt; x(x)(v)))(x =&gt; f(v =&gt; x(x)(v)));

<span class="c">// Define without naming the function</span>
const factorial = Y(self =&gt; n =&gt; n &lt;= 1 ? 1 : n * self(n - 1));
const fib       = Y(self =&gt; n =&gt; n &lt;= 1 ? n : self(n-1) + self(n-2));
const sum       = Y(self =&gt; n =&gt; n &lt;= 0 ? 0 : n + self(n - 1));

factorial(6); <span class="c">// 720</span>
fib(8);       <span class="c">// 21</span>
sum(10);      <span class="c">// 55</span></pre>
    </details>`,

  mount(el) {
    const Y = f => (x => f(v => x(x)(v)))(x => f(v => x(x)(v)));

    const fns = {
      factorial: { factory: self => n => n <= 1 ? 1 : n * self(n-1), steps: n => { const s=[]; for(let i=n;i>=1;i--) s.push(`${i}`); return s.join(' × '); } },
      fib:       { factory: self => n => n <= 1 ? n : self(n-1) + self(n-2), steps: n => `fib(${n-1}) + fib(${n-2})` },
      sum:       { factory: self => n => n <= 0 ? 0 : n + self(n-1), steps: n => { const s=[]; for(let i=n;i>=1;i--) s.push(i); return s.join(' + '); } },
    };

    el.querySelector('#y-run').addEventListener('click', () => {
      const fnKey = el.querySelector('#y-fn').value;
      const n     = parseInt(el.querySelector('#y-n').value) || 6;
      const viz   = el.querySelector('#y-viz');
      const log   = el.querySelector('#y-log');
      viz.innerHTML = ''; log.innerHTML = '';

      const fn     = Y(fns[fnKey].factory);
      const result = fn(n);

      viz.innerHTML = `
        <div style="display:flex;gap:0.75rem;flex-wrap:wrap;margin-top:0.75rem;align-items:center">
          <div style="background:#1a1d2e;border:1px solid #3d4166;border-radius:8px;padding:0.6rem 1rem;font-size:0.8rem;color:#94a3b8">
            Y(${fnKey})(${n})
          </div>
          <div style="color:#4b5563;font-size:1.2rem">→</div>
          <div style="background:#1a1d2e;border:1px solid #4b5563;border-radius:8px;padding:0.6rem 1rem;font-size:0.8rem;color:#94a3b8">
            ${fns[fnKey].steps(n)}
          </div>
          <div style="color:#4b5563;font-size:1.2rem">→</div>
          <div style="background:#052e16;border:2px solid #16a34a;border-radius:10px;padding:0.75rem 1.5rem;font-size:1.8rem;font-weight:700;color:#4ade80">
            ${result}
          </div>
        </div>`;

      log.innerHTML = `<span class="ok">Y(${fnKey})(${n}) = ${result}</span><br>
        <span style="color:#4b5563;font-size:0.75rem">No named recursion — self-application via Y gives the function a reference to itself</span>`;
    });

    el.querySelector('#y-run').click();
  },
};
