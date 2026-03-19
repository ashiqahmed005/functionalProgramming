import { sleep, logLine, readDelay } from '../utils/ui.js';
import { trim, toLower, replaceSpaces, removeSpecial } from '../../concepts/composition.js';

const FNS = [
  { name: 'trim',          fn: trim },
  { name: 'toLower',       fn: toLower },
  { name: 'replaceSpaces', fn: replaceSpaces },
  { name: 'removeSpecial', fn: removeSpecial },
];

export default {
  id: 'compose',
  label: 'compose / pipe',

  html: () => `
    <h2>compose / pipe</h2>
    <p class="subtitle">Chain functions — pipe is left-to-right, compose is right-to-left</p>
    <div class="controls">
      <div><label>Input string</label><br><input id="compose-input" value="  Hello World!  " style="width:200px"></div>
      <div>
        <label>Mode</label><br>
        <select id="compose-mode">
          <option value="pipe">pipe (left → right)</option>
          <option value="compose">compose (right → left)</option>
        </select>
      </div>
      <div class="speed-control">
        <label>Speed</label>
        <input type="range" id="compose-speed" min="200" max="1500" value="600" step="100">
      </div>
      <button class="btn" id="compose-run">Run</button>
    </div>
    <div id="compose-viz"></div>
    <div class="log" id="compose-log"></div>
    <details class="source-block">
      <summary><span class="ti">▶</span> Source Code <span class="sf">concepts/composition.js</span></summary>
      <pre>export const compose = (...fns) => x => fns.reduceRight((acc, fn) => fn(acc), x);
export const pipe    = (...fns) => x => fns.reduce((acc, fn) => fn(acc), x);

export const trim          = s => s.trim();
export const toLower       = s => s.toLowerCase();
export const replaceSpaces = replace('\\s+', '-');
export const removeSpecial = replace('[^a-z0-9-]', '');

<span class="c">// pipe: data flows left → right</span>
export const slugify = pipe(trim, toLower, replaceSpaces, removeSpecial);
slugify('  Hello World! '); <span class="c">// "hello-world"</span></pre>
    </details>`,

  mount(el) {
    let running = false;

    el.querySelector('#compose-run').addEventListener('click', async () => {
      if (running) return;
      running = true;

      const input = el.querySelector('#compose-input').value;
      const mode  = el.querySelector('#compose-mode').value;
      const delay = readDelay('compose-speed');
      const viz   = el.querySelector('#compose-viz');
      const log   = el.querySelector('#compose-log');

      log.innerHTML = '';
      viz.innerHTML = '';

      const fns = mode === 'pipe' ? [...FNS] : [...FNS].reverse();

      const pipelineDiv = document.createElement('div');
      pipelineDiv.className = 'pipeline';
      pipelineDiv.style.flexWrap = 'wrap';

      const inputBubble = document.createElement('div');
      inputBubble.className = 'value-bubble active';
      inputBubble.textContent = `"${input}"`;
      pipelineDiv.appendChild(inputBubble);

      const fnBoxes = fns.map((f, _i) => {
        pipelineDiv.innerHTML += '<span class="pipe-arrow">→</span>';
        const box = document.createElement('div');
        box.className = 'fn-box';
        box.innerHTML = `<span class="fn-name">${f.name}</span>`;
        pipelineDiv.appendChild(box);
        return box;
      });

      pipelineDiv.innerHTML += '<span class="pipe-arrow">→</span>';
      const resultBubble = document.createElement('div');
      resultBubble.className = 'value-bubble';
      resultBubble.textContent = '?';
      pipelineDiv.appendChild(resultBubble);

      viz.appendChild(pipelineDiv);
      logLine(log, `<span class="info">${mode}(${fns.map(f => f.name).join(', ')})</span>`);
      logLine(log, `<span class="info">Input: "${input}"</span>`);

      let val = input;
      for (let i = 0; i < fns.length; i++) {
        fnBoxes[i].style.cssText = 'background:#7c3aed;box-shadow:0 0 10px #7c3aed88;';
        await sleep(delay);
        val = fns[i].fn(val);
        fnBoxes[i].style.cssText = 'background:#14532d;border-color:#16a34a;';
        inputBubble.textContent = `"${val}"`;
        logLine(log, `<span class="step">  ${fns[i].name}</span> → <span class="ok">"${val}"</span>`);
        await sleep(delay * 0.3);
      }

      resultBubble.textContent = `"${val}"`;
      resultBubble.classList.add('active');
      inputBubble.classList.remove('active');
      logLine(log, `<span class="ok">✓ "${val}"</span>`);
      running = false;
    });
  },
};
