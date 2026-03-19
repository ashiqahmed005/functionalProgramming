import { Either } from '../../concepts/either.js';

export default {
  id: 'either',
  label: 'Either',

  html: () => `
    <h2>Either</h2>
    <p class="subtitle">Right = success path, Left = error path — chain without try/catch</p>
    <div class="controls">
      <div>
        <label>JSON string to parse</label><br>
        <input id="either-input" value='{"name":"Alice","age":30}' style="width:260px">
      </div>
      <button class="btn" id="either-run">Run</button>
    </div>
    <div id="either-viz"></div>
    <details class="source-block">
      <summary><span class="ti">▶</span> Source Code <span class="sf">concepts/either.js</span></summary>
      <pre><span class="c">// Right = success path, Left = error path</span>
class Right {
  map(fn)            { return Either.of(fn(this.#value)); }
  fold(left, right)  { return right(this.#value); }
}
class Left {
  map(_fn)           { return this; } <span class="c">// skip on error</span>
  fold(left, right)  { return left(this.#value); }
}

const parseJSON = str => Either.tryCatch(() => JSON.parse(str));

parseJSON('{"name":"Bob"}')
  .map(o => o.name)
  .getOrElse('error'); <span class="c">// "Bob"</span>

parseJSON('bad json')
  .map(o => o.name)
  .getOrElse('error'); <span class="c">// "error"</span></pre>
    </details>`,

  mount(el) {
    el.querySelector('#either-run').addEventListener('click', () => {
      const input = el.querySelector('#either-input').value;
      const viz   = el.querySelector('#either-viz');
      viz.innerHTML = '';

      // Use the real Either implementation
      const parsed  = Either.tryCatch(() => JSON.parse(input));
      const withName = parsed.map(o => o.name);
      const result  = withName.getOrElse('(parse error)');

      const steps = [
        { label: 'Either.tryCatch(() => JSON.parse(...))', result: parsed },
        { label: '.map(o => o.name)', result: withName },
        { label: `.getOrElse('(parse error)')`, result: { toString: () => `"${result}"`, isRight: true, isFinal: true } },
      ];

      const row = document.createElement('div');
      row.style.cssText = 'display:flex;flex-wrap:wrap;align-items:center;gap:0.25rem;margin-bottom:1rem;';

      steps.forEach((s, i) => {
        if (i > 0) {
          const arr = document.createElement('span');
          arr.style.cssText = 'color:#4b5563;font-size:1.1rem;margin:0 0.25rem;';
          arr.textContent = '→';
          row.appendChild(arr);
        }

        const box = document.createElement('div');
        const isRight = s.result.isRight !== false;
        box.className = `container-box ${isRight ? 'right' : 'left'}`;
        box.innerHTML = `
          <span class="box-label">${isRight ? (s.result.isFinal ? 'VALUE' : 'RIGHT') : 'LEFT'}</span>
          <span class="box-value" style="font-size:0.65rem;color:#64748b;text-align:center">${s.label}</span>
          <span class="box-value">${s.result.toString()}</span>`;
        row.appendChild(box);
      });

      viz.appendChild(row);
    });

    el.querySelector('#either-run').click();
  },
};
