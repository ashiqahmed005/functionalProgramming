import { Maybe } from '../../concepts/maybe.js';

const OPS = {
  double: { name: 'double', fn: x => x * 2 },
  addTen: { name: '+ 10',   fn: x => x + 10 },
  square: { name: 'square', fn: x => x * x },
  negate: { name: 'negate', fn: x => -x },
};

export default {
  id: 'maybe',
  label: 'Maybe',

  html: () => `
    <h2>Maybe</h2>
    <p class="subtitle">Safely handle null/undefined — skip transformations instead of throwing</p>
    <div class="controls">
      <div><label>Value (blank = null)</label><br><input id="maybe-input" value="42"></div>
      <div>
        <label>Operations chain</label><br>
        <select id="maybe-ops">
          <option value="double,addTen">double → add 10</option>
          <option value="double,double,addTen">double → double → add 10</option>
          <option value="square,negate">square → negate</option>
        </select>
      </div>
      <button class="btn" id="maybe-run">Run</button>
    </div>
    <div id="maybe-viz"></div>
    <details class="source-block">
      <summary><span class="ti">▶</span> Source Code <span class="sf">concepts/maybe.js</span></summary>
      <pre>export class Maybe {
  static of(value) { return new Maybe(value); }

  isNothing() { return this.#value === null || this.#value === undefined; }

  <span class="c">// Transform if Just, skip if Nothing</span>
  map(fn) {
    return this.isNothing() ? this : Maybe.of(fn(this.#value));
  }

  getOrElse(def) { return this.isNothing() ? def : this.#value; }
}

<span class="c">// Safe chaining — no null-check cascade, no crash</span>
Maybe.of(user)
  .map(u => u.address)
  .map(a => a.city)
  .getOrElse('Unknown');</pre>
    </details>`,

  mount(el) {
    el.querySelector('#maybe-run').addEventListener('click', () => {
      const raw   = el.querySelector('#maybe-input').value.trim();
      const ops   = el.querySelector('#maybe-ops').value.split(',').map(k => OPS[k]);
      const value = raw === '' ? null : parseFloat(raw);
      const viz   = el.querySelector('#maybe-viz');
      viz.innerHTML = '';

      // Build the chain — using the real Maybe implementation
      let current = Maybe.of(value);
      const states = [{ label: `Maybe.of(${raw || 'null'})`, result: current }];

      ops.forEach(op => {
        current = current.map(op.fn);
        states.push({ label: `.map(${op.name})`, result: current });
      });

      states.push({
        label: `.getOrElse('N/A')`,
        result: { toString: () => String(current.getOrElse('N/A')), isFinal: true },
      });

      const row = document.createElement('div');
      row.style.cssText = 'display:flex;flex-wrap:wrap;align-items:center;gap:0.25rem;margin-bottom:1rem;';

      states.forEach((s, i) => {
        if (i > 0) {
          const arr = document.createElement('span');
          arr.style.cssText = 'color:#4b5563;font-size:1.1rem;margin:0 0.25rem;';
          arr.textContent = '→';
          row.appendChild(arr);
        }

        const box = document.createElement('div');
        const isNothing = !s.result.isFinal && s.result.isNothing();
        const cls = isNothing ? 'nothing' : (s.result.isFinal ? 'right' : 'just');
        box.className = `container-box ${cls}`;
        box.innerHTML = `
          <span class="box-label">${isNothing ? 'NOTHING' : s.result.isFinal ? 'VALUE' : 'JUST'}</span>
          <span class="box-value" style="font-size:0.7rem;color:#64748b">${s.label}</span>
          <span class="box-value">${isNothing ? '∅' : s.result.toString()}</span>`;
        row.appendChild(box);
      });

      viz.appendChild(row);
    });

    el.querySelector('#maybe-run').click();
  },
};
