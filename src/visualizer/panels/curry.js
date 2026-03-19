import { curry } from '../../concepts/currying.js';

export default {
  id: 'curry',
  label: 'currying',

  html: () => `
    <h2>Currying</h2>
    <p class="subtitle">Transform f(a,b,c) → f(a)(b)(c) — enable partial application</p>
    <div class="controls">
      <div><label>a</label><br><input id="curry-a" value="3" style="width:60px"></div>
      <div><label>b</label><br><input id="curry-b" value="4" style="width:60px"></div>
      <div><label>c</label><br><input id="curry-c" value="5" style="width:60px"></div>
      <div>
        <label>f(a,b,c)</label><br>
        <select id="curry-fn">
          <option value="a*b*c">a * b * c</option>
          <option value="a+b+c">a + b + c</option>
          <option value="a*(b+c)">a * (b + c)</option>
        </select>
      </div>
      <button class="btn" id="curry-run">Run</button>
    </div>
    <div id="curry-viz"></div>
    <details class="source-block">
      <summary><span class="ti">▶</span> Source Code <span class="sf">concepts/currying.js</span></summary>
      <pre><span class="c">// Generic curry helper — works for any arity</span>
export const curry = fn => {
  const arity = fn.length;
  return function curried(...args) {
    if (args.length >= arity) return fn(...args);
    return (...more) => curried(...args, ...more);
  };
};

const curriedAdd = a => b => a + b;
const add5 = curriedAdd(5);
add5(3);  <span class="c">// 8</span>
add5(10); <span class="c">// 15</span>

const multiply = curry((a, b, c) => a * b * c);
const double   = multiply(2, 1); <span class="c">// waits for c</span>
double(5);  <span class="c">// 10</span></pre>
    </details>`,

  mount(el) {
    const FUNCTIONS = {
      'a*b*c':   (a, b, c) => a * b * c,
      'a+b+c':   (a, b, c) => a + b + c,
      'a*(b+c)': (a, b, c) => a * (b + c),
    };

    el.querySelector('#curry-run').addEventListener('click', () => {
      const a     = parseFloat(el.querySelector('#curry-a').value);
      const b     = parseFloat(el.querySelector('#curry-b').value);
      const c     = parseFloat(el.querySelector('#curry-c').value);
      const fnStr = el.querySelector('#curry-fn').value;
      const fn    = curry(FUNCTIONS[fnStr]);
      const viz   = el.querySelector('#curry-viz');
      viz.innerHTML = '';

      const steps = [
        { label: 'Regular call', code: `f(${a}, ${b}, ${c})`,      result: fn(a, b, c), desc: 'All args at once' },
        { label: 'Curried',      code: `f(${a})(${b})(${c})`,      result: fn(a)(b)(c), desc: 'One arg at a time' },
        { label: 'Partial app',  code: `const g = f(${a})\ng(${b})(${c})`, result: fn(a)(b)(c), desc: `g pre-fills a=${a}` },
      ];

      steps.forEach(s => {
        const box = document.createElement('div');
        box.className = 'viz-box';
        box.innerHTML = `
          <div style="font-size:0.7rem;color:#64748b;margin-bottom:0.3rem">${s.label} — ${s.desc}</div>
          <pre style="font-size:0.82rem;color:#c4b5fd;margin-bottom:0.5rem">${s.code}</pre>
          <div style="font-size:0.85rem">= <span style="color:#fbbf24;font-weight:700">${s.result}</span></div>`;
        viz.appendChild(box);
      });

      // Call chain diagram
      const chainDiv = document.createElement('div');
      chainDiv.style.marginTop = '1rem';
      chainDiv.innerHTML = `<div style="font-size:0.75rem;color:#64748b;margin-bottom:0.5rem">Call chain for f(${fnStr}):</div>`;
      const pipeline = document.createElement('div');
      pipeline.className = 'pipeline';
      [
        { label: `f(${a})`,  result: 'g(b)(c)' },
        { label: `g(${b})`,  result: 'h(c)' },
        { label: `h(${c})`,  result: fn(a, b, c) },
      ].forEach((s, i) => {
        if (i > 0) pipeline.innerHTML += '<span class="pipe-arrow">→</span>';
        pipeline.innerHTML += `<div class="fn-box"><span class="fn-name">${s.label}</span> ⟹ ${s.result}</div>`;
      });
      chainDiv.appendChild(pipeline);
      viz.appendChild(chainDiv);
    });

    el.querySelector('#curry-run').click();
  },
};
