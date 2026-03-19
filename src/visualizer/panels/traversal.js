import { sleep, logLine, readDelay } from '../utils/ui.js';

const MOVIES = [
  { id: 70111470,  title: 'Die Hard',     rating: 4.0 },
  { id: 654356453, title: 'Bad Boys',     rating: 5.0 },
  { id: 65432445,  title: 'The Chamber',  rating: 4.0 },
  { id: 675465,    title: 'Fracture',     rating: 5.0 },
];

const BOXARTS = [
  { width: 200, height: 200, url: 'Fracture200.jpg' },
  { width: 150, height: 200, url: 'Fracture150.jpg' },
  { width: 300, height: 200, url: 'Fracture300.jpg' },
  { width: 425, height: 150, url: 'Fracture425.jpg' },
];

export default {
  id: 'traversal',
  label: 'traversing arrays',

  html: () => `
    <h2>Traversing Arrays</h2>
    <p class="subtitle">Project, filter, and reduce over collections of objects</p>

    <h3 class="section-title">1. Project — map to {id, title} pairs</h3>
    <div class="controls">
      <div class="speed-control"><label>Speed</label>
        <input type="range" id="proj-speed" min="100" max="1000" value="400" step="100">
      </div>
      <button class="btn" id="proj-run">Run</button>
    </div>
    <div id="proj-viz"></div>
    <div class="log" id="proj-log"></div>

    <hr class="section-divider">

    <h3 class="section-title">2. Filter + Map chain — titles with rating &lt; 5</h3>
    <div class="controls">
      <div class="speed-control"><label>Speed</label>
        <input type="range" id="chain-speed" min="100" max="1000" value="500" step="100">
      </div>
      <button class="btn" id="chain-run">Run</button>
    </div>
    <div id="chain-viz"></div>
    <div class="log" id="chain-log"></div>

    <hr class="section-divider">

    <h3 class="section-title">3. Reduce — find largest boxart by area</h3>
    <div class="controls">
      <div class="speed-control"><label>Speed</label>
        <input type="range" id="box-speed" min="100" max="1000" value="500" step="100">
      </div>
      <button class="btn" id="box-run">Run</button>
    </div>
    <div id="box-viz"></div>
    <div class="log" id="box-log"></div>

    <details class="source-block">
      <summary><span class="ti">▶</span> Source Code <span class="sf">exercises/traversingArray.js</span></summary>
      <pre><span class="c">// 1. Project — map to {id, title}</span>
const pairs = newReleases.map(r => ({ id: r.id, title: r.title }));

<span class="c">// 2. Filter + Map chain — titles rated below 5</span>
const underFive = newReleases
  .filter(r => r.rating &lt; 5)
  .map(r => r.title);

<span class="c">// 3. Reduce — largest boxart by area</span>
const largest = boxarts.reduce((acc, curr) =>
  acc.width * acc.height > curr.width * curr.height ? acc : curr
);

<span class="c">// 4. concatMap — flatten one level of nesting</span>
movieLists
  .map(list => list.videos.map(v => ({ id: v.id, title: v.title })))
  .flat();</pre>
    </details>`,

  mount(el) {
    // ── Projection ────────────────────────────────────────────────────────────
    let projRunning = false;
    el.querySelector('#proj-run').addEventListener('click', async () => {
      if (projRunning) return; projRunning = true;
      const delay = readDelay('proj-speed');
      const viz   = el.querySelector('#proj-viz');
      const log   = el.querySelector('#proj-log');
      viz.innerHTML = ''; log.innerHTML = '';

      logLine(log, '<span class="info">newReleases.map(r => ({ id: r.id, title: r.title }))</span>');

      const grid = document.createElement('div');
      grid.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;max-width:700px;';
      const hdr = (t, bg) => {
        const d = document.createElement('div');
        d.style.cssText = `font-size:0.7rem;color:#64748b;padding:0.25rem 0.5rem;background:${bg};border-radius:5px 5px 0 0;`;
        d.textContent = t; return d;
      };
      grid.append(hdr('INPUT  (full object)', '#1a1d2e'), hdr('OUTPUT  {id, title}', '#1e1a40'));
      viz.appendChild(grid);

      for (const r of MOVIES) {
        const inp = document.createElement('div');
        inp.style.cssText = 'font-family:monospace;font-size:0.72rem;padding:0.4rem 0.6rem;background:#1a1d2e;border:1px solid #2d3148;border-radius:5px;color:#94a3b8;transition:border-color 0.3s;';
        inp.textContent = `${JSON.stringify(r).slice(0, 55)  }…`;

        const out = document.createElement('div');
        out.style.cssText = 'font-family:monospace;font-size:0.78rem;padding:0.4rem 0.6rem;background:#1e1a40;border:1px solid #7c3aed;border-radius:5px;color:#c4b5fd;opacity:0;transition:opacity 0.3s;';
        out.textContent = JSON.stringify({ id: r.id, title: r.title });

        grid.append(inp, out);
        inp.style.borderColor = '#f59e0b';
        await sleep(delay);
        out.style.opacity = '1';
        inp.style.borderColor = '#2d3148';
        logLine(log, `<span class="step">  {id:${r.id}, title:"${r.title}"}</span>`);
        await sleep(delay * 0.5);
      }

      logLine(log, '<span class="ok">✓ Projected 4 full objects → 4 {id, title} pairs</span>');
      projRunning = false;
    });

    // ── Filter + Map Chain ────────────────────────────────────────────────────
    let chainRunning = false;
    el.querySelector('#chain-run').addEventListener('click', async () => {
      if (chainRunning) return; chainRunning = true;
      const delay = readDelay('chain-speed');
      const viz   = el.querySelector('#chain-viz');
      const log   = el.querySelector('#chain-log');
      viz.innerHTML = ''; log.innerHTML = '';

      logLine(log, '<span class="info">.filter(r => r.rating &lt; 5).map(r => r.title)</span>');

      for (const r of MOVIES) {
        const row = document.createElement('div');
        row.style.cssText = 'display:flex;align-items:center;gap:0.5rem;margin-bottom:0.35rem;font-family:monospace;font-size:0.78rem;';

        const src = document.createElement('div');
        src.style.cssText = 'padding:0.3rem 0.6rem;border-radius:5px;background:#1a1d2e;border:1px solid #2d3148;color:#94a3b8;min-width:180px;transition:all 0.3s;';
        src.textContent = `"${r.title}" (★${r.rating})`;

        const arrow = document.createElement('span');
        arrow.className = 'arrow'; arrow.textContent = '→';

        const out = document.createElement('div');
        out.style.cssText = 'padding:0.3rem 0.6rem;border-radius:5px;opacity:0;transition:all 0.3s;';

        row.append(src, arrow, out);
        viz.appendChild(row);

        src.style.boxShadow = '0 0 0 2px #f59e0b';
        await sleep(delay);

        if (r.rating < 5) {
          out.textContent = `"${r.title}"`;
          Object.assign(out.style, { background: '#1e1a40', border: '1px solid #7c3aed', color: '#c4b5fd', opacity: '1' });
          Object.assign(src.style, { background: '#14532d', borderColor: '#16a34a', color: '#86efac' });
          logLine(log, `<span class="ok">  ✓ keep "${r.title}" (★${r.rating})</span>`);
        } else {
          out.textContent = '(filtered out)';
          Object.assign(out.style, { background: '#1a0a0a', border: '1px solid #3b0a0a', color: '#4b1f1f', opacity: '1' });
          Object.assign(src.style, { background: '#1a0a0a', borderColor: '#3b0a0a', color: '#4b1f1f', textDecoration: 'line-through' });
          logLine(log, `<span class="skip">  ✗ drop "${r.title}" (★${r.rating})</span>`);
        }
        src.style.boxShadow = '';
        await sleep(delay * 0.5);
      }

      const result = MOVIES.filter(r => r.rating < 5).map(r => r.title);
      logLine(log, `<span class="ok">✓ ["${result.join('", "')}"]</span>`);
      chainRunning = false;
    });

    // ── Reduce → Largest Boxart ───────────────────────────────────────────────
    let boxRunning = false;
    el.querySelector('#box-run').addEventListener('click', async () => {
      if (boxRunning) return; boxRunning = true;
      const delay = readDelay('box-speed');
      const viz   = el.querySelector('#box-viz');
      const log   = el.querySelector('#box-log');
      viz.innerHTML = ''; log.innerHTML = '';

      logLine(log, '<span class="info">boxarts.reduce((acc, curr) => area(acc) > area(curr) ? acc : curr)</span>');

      const row = document.createElement('div');
      row.style.cssText = 'display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:0.75rem;';
      const cards = BOXARTS.map(b => {
        const d = document.createElement('div');
        d.style.cssText = 'padding:0.45rem 0.7rem;border-radius:8px;border:1px solid #3d4166;background:#1e2235;font-size:0.75rem;font-family:monospace;transition:all 0.3s;text-align:center;';
        d.innerHTML = `<div style="color:#94a3b8">${b.width}×${b.height}</div><div style="color:#64748b;font-size:0.65rem;">${b.width * b.height}px²</div>`;
        row.appendChild(d); return d;
      });
      viz.appendChild(row);

      const accLabel = document.createElement('div');
      accLabel.style.cssText = 'font-family:monospace;font-size:0.8rem;color:#fbbf24;';
      viz.appendChild(accLabel);

      let acc = BOXARTS[0];
      Object.assign(cards[0].style, { background: '#1e1a40', borderColor: '#7c3aed', color: '#c4b5fd' });
      accLabel.textContent = `acc = ${acc.width}×${acc.height} (${acc.width * acc.height}px²)`;
      await sleep(delay);

      for (let i = 1; i < BOXARTS.length; i++) {
        const curr = BOXARTS[i];
        cards[i].style.boxShadow = '0 0 0 2px #f59e0b';
        await sleep(delay);

        if (acc.width * acc.height >= curr.width * curr.height) {
          Object.assign(cards[i].style, { background: '#1a0a0a', borderColor: '#7f1d1d' });
          logLine(log, `<span class="skip">  keep acc (${acc.width * acc.height}) > curr (${curr.width * curr.height})</span>`);
        } else {
          cards.forEach((c, j) => {
            if (j !== i) Object.assign(c.style, { background: '#1a0a0a', borderColor: '#7f1d1d' });
          });
          acc = curr;
          Object.assign(cards[i].style, { background: '#1e1a40', borderColor: '#7c3aed', color: '#c4b5fd' });
          logLine(log, `<span class="ok">  new acc = ${acc.width}×${acc.height} (${acc.width * acc.height}px²)</span>`);
        }

        cards[i].style.boxShadow = '';
        accLabel.textContent = `acc = ${acc.width}×${acc.height} (${acc.width * acc.height}px²)`;
        await sleep(delay * 0.5);
      }

      logLine(log, `<span class="ok">✓ Largest: ${acc.width}×${acc.height} — ${acc.url}</span>`);
      boxRunning = false;
    });
  },
};
