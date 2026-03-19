import { sleep, logLine, readDelay } from '../utils/ui.js';
import { knapsack, coinChange, activitySelection } from '../../concepts/greedy.js';

const PRODUCTS = [
  { id: 1, name: 'Laptop',       price: 1000, stock: 5 },
  { id: 2, name: 'Headphones',   price: 200,  stock: 0 },
  { id: 3, name: 'Coffee Maker', price: 150,  stock: 10 },
  { id: 4, name: 'Desk Chair',   price: 300,  stock: 2 },
];

const FLASH_SALES = [
  { product: 'Keyboard',     start: 9,  end: 10 },
  { product: 'Laptop',       start: 9,  end: 11 },
  { product: 'Headphones',   start: 10, end: 12 },
  { product: 'Coffee Maker', start: 11, end: 13 },
  { product: 'Desk Chair',   start: 12, end: 14 },
];

export default {
  id: 'greedy',
  label: 'greedy algorithms',

  html: () => `
    <h2>Greedy Algorithms</h2>
    <p class="subtitle">At each step, pick the locally optimal choice</p>

    <h3 class="section-title">1. Knapsack — highest value/price ratio first</h3>
    <div class="controls">
      <div><label>Budget ($)</label><br><input id="ks-budget" value="600" style="width:80px"></div>
      <div class="speed-control"><label>Speed</label>
        <input type="range" id="ks-speed" min="100" max="1000" value="500" step="100">
      </div>
      <button class="btn" id="ks-run">Run</button>
    </div>
    <div id="ks-viz"></div>
    <div class="log" id="ks-log"></div>

    <hr class="section-divider">

    <h3 class="section-title">2. Coin Change — largest denomination first</h3>
    <div class="controls">
      <div><label>Amount ($)</label><br><input id="cc-amount" value="650" style="width:80px"></div>
      <div><label>Coins</label><br><input id="cc-coins" value="500,200,100,50,20,10" style="width:220px"></div>
      <div class="speed-control"><label>Speed</label>
        <input type="range" id="cc-speed" min="100" max="1000" value="400" step="100">
      </div>
      <button class="btn" id="cc-run">Run</button>
    </div>
    <div id="cc-viz"></div>
    <div class="log" id="cc-log"></div>

    <hr class="section-divider">

    <h3 class="section-title">3. Activity Selection — earliest end time first</h3>
    <div class="controls">
      <button class="btn" id="act-run">Run</button>
      <button class="btn secondary" id="act-reset">Reset</button>
    </div>
    <div id="act-viz"></div>
    <div class="log" id="act-log"></div>

    <details class="source-block">
      <summary><span class="ti">▶</span> Source Code <span class="sf">concepts/greedy.js</span></summary>
      <pre><span class="c">// 1. Knapsack — sort by price/stock ratio, pick within budget</span>
export const knapsack = (items, maxBudget) => {
  const sorted = [...items]
    .filter(i => i.stock > 0)
    .sort((a, b) => (b.price / b.stock) - (a.price / a.stock));
  let remaining = maxBudget;
  const picked = [];
  for (const item of sorted) {
    if (item.price &lt;= remaining) { picked.push(item.name); remaining -= item.price; }
  }
  return { picked, spent: maxBudget - remaining };
};

<span class="c">// 2. Coin Change — subtract largest coin that fits</span>
export const coinChange = (amount, coins) => {
  const sorted = [...coins].sort((a, b) => b - a);
  let remaining = amount;
  const used = [];
  for (const coin of sorted) {
    while (remaining >= coin) { used.push(coin); remaining -= coin; }
  }
  return remaining === 0 ? used : null;
};

<span class="c">// 3. Activity Selection — pick earliest-ending non-overlapping activity</span>
export const activitySelection = items => {
  const sorted = [...items].sort((a, b) => a.end - b.end);
  const result = []; let lastEnd = 0;
  for (const item of sorted) {
    if (item.start >= lastEnd) { result.push(item.product); lastEnd = item.end; }
  }
  return result;
};</pre>
    </details>`,

  mount(el) {
    // ── Knapsack ─────────────────────────────────────────────────────────────
    let ksRunning = false;
    el.querySelector('#ks-run').addEventListener('click', async () => {
      if (ksRunning) return; ksRunning = true;
      const budget = parseFloat(el.querySelector('#ks-budget').value) || 600;
      const delay  = readDelay('ks-speed');
      const viz    = el.querySelector('#ks-viz');
      const log    = el.querySelector('#ks-log');
      viz.innerHTML = ''; log.innerHTML = '';

      const sorted = [...PRODUCTS]
        .filter(p => p.stock > 0)
        .sort((a, b) => (b.price / b.stock) - (a.price / a.stock));

      logLine(log, `<span class="info">Budget: $${budget} — sorted by price/stock ratio</span>`);

      const row = document.createElement('div');
      row.style.cssText = 'display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:0.75rem;';
      const cards = {};
      sorted.forEach(item => {
        const d = document.createElement('div');
        d.style.cssText = 'padding:0.5rem 0.75rem;border-radius:8px;border:1px solid #3d4166;background:#1e2235;font-size:0.78rem;transition:all 0.3s;';
        d.innerHTML = `<div style="color:#a78bfa;font-weight:700">${item.name}</div><div style="color:#94a3b8">$${item.price} | ratio ${(item.price / item.stock).toFixed(0)}</div>`;
        cards[item.name] = d; row.appendChild(d);
      });
      viz.appendChild(row);

      const budgetBar = document.createElement('div');
      budgetBar.style.cssText = 'font-family:monospace;font-size:0.8rem;color:#fbbf24;';
      viz.appendChild(budgetBar);

      let remaining = budget;
      const picked = [];
      for (const item of sorted) {
        cards[item.name].style.boxShadow = '0 0 0 2px #f59e0b';
        await sleep(delay);
        budgetBar.textContent = `Remaining: $${remaining}`;
        if (item.price <= remaining) {
          remaining -= item.price; picked.push(item.name);
          Object.assign(cards[item.name].style, { background: '#052e16', borderColor: '#16a34a' });
          logLine(log, `<span class="ok">  ✓ Pick ${item.name} ($${item.price}) — $${remaining} left</span>`);
        } else {
          Object.assign(cards[item.name].style, { background: '#2d0a0a', borderColor: '#7f1d1d' });
          logLine(log, `<span class="skip">  ✗ Skip ${item.name} ($${item.price}) — over budget</span>`);
        }
        cards[item.name].style.boxShadow = '';
        await sleep(delay * 0.4);
      }
      budgetBar.textContent = `Picked: [${picked.join(', ')}] — spent $${budget - remaining}`;
      logLine(log, `<span class="ok">✓ ${JSON.stringify(knapsack(PRODUCTS, budget))}</span>`);
      ksRunning = false;
    });

    // ── Coin Change ───────────────────────────────────────────────────────────
    let ccRunning = false;
    el.querySelector('#cc-run').addEventListener('click', async () => {
      if (ccRunning) return; ccRunning = true;
      const amount = parseFloat(el.querySelector('#cc-amount').value) || 650;
      const coins  = el.querySelector('#cc-coins').value.split(',').map(s => parseInt(s.trim())).filter(Boolean);
      const delay  = readDelay('cc-speed');
      const viz    = el.querySelector('#cc-viz');
      const log    = el.querySelector('#cc-log');
      viz.innerHTML = ''; log.innerHTML = '';

      const sorted = [...coins].sort((a, b) => b - a);
      logLine(log, `<span class="info">Making $${amount} — largest coin first</span>`);

      const denomRow = document.createElement('div');
      denomRow.style.cssText = 'display:flex;gap:0.4rem;flex-wrap:wrap;margin-bottom:0.75rem;align-items:center;';
      denomRow.innerHTML = '<span style="font-size:0.75rem;color:#64748b;margin-right:0.25rem;">coins:</span>';
      const denomCards = {};
      sorted.forEach(c => {
        const d = document.createElement('div');
        d.className = 'cell source'; d.style.cssText += ';width:auto;padding:0 0.5rem;';
        d.textContent = `$${c}`; denomCards[c] = d; denomRow.appendChild(d);
      });

      const usedRow = document.createElement('div');
      usedRow.style.cssText = 'display:flex;gap:0.4rem;flex-wrap:wrap;margin-bottom:0.5rem;align-items:center;';
      usedRow.innerHTML = '<span style="font-size:0.75rem;color:#64748b;margin-right:0.25rem;">used:</span>';

      const remainLabel = document.createElement('div');
      remainLabel.style.cssText = 'font-family:monospace;font-size:0.8rem;color:#fbbf24;';
      viz.append(denomRow, usedRow, remainLabel);

      let remaining = amount;
      for (const coin of sorted) {
        denomCards[coin].classList.add('highlight');
        await sleep(delay * 0.6);
        while (remaining >= coin) {
          remaining -= coin;
          const c = document.createElement('div');
          c.className = 'cell mapped'; c.style.cssText += ';width:auto;padding:0 0.5rem;';
          c.textContent = `$${coin}`; usedRow.appendChild(c);
          remainLabel.textContent = `Remaining: $${remaining}`;
          logLine(log, `<span class="step">  use $${coin}</span> → remaining $${remaining}`);
          await sleep(delay * 0.6);
        }
        denomCards[coin].classList.remove('highlight');
      }

      const result = coinChange(amount, coins);
      logLine(log, result
        ? `<span class="ok">✓ [${result.join(', ')}]</span>`
        : `<span class="skip">✗ Exact change not possible</span>`);
      ccRunning = false;
    });

    // ── Activity Selection ────────────────────────────────────────────────────
    const MIN_H = 9, MAX_H = 14, TOTAL = MAX_H - MIN_H;

    const buildTimeline = () => {
      const viz = el.querySelector('#act-viz');
      viz.innerHTML = '';
      const sorted = [...FLASH_SALES].sort((a, b) => a.end - b.end);
      const wrap = document.createElement('div');
      wrap.style.cssText = 'position:relative;padding:0.5rem 0;';

      const ruler = document.createElement('div');
      ruler.style.cssText = 'display:flex;margin-left:120px;margin-bottom:0.3rem;';
      for (let h = MIN_H; h <= MAX_H; h++) {
        const lbl = document.createElement('span');
        lbl.style.cssText = `width:${100 / TOTAL}%;font-size:0.65rem;color:#4b5563;`;
        lbl.textContent = `${h}h`; ruler.appendChild(lbl);
      }
      wrap.appendChild(ruler);

      const bars = {};
      sorted.forEach(item => {
        const row = document.createElement('div');
        row.style.cssText = 'display:flex;align-items:center;margin-bottom:0.35rem;';
        const lbl = document.createElement('div');
        lbl.style.cssText = 'width:120px;font-size:0.75rem;color:#94a3b8;text-align:right;padding-right:0.5rem;flex-shrink:0;';
        lbl.textContent = item.product;
        const track = document.createElement('div');
        track.style.cssText = 'flex:1;height:24px;position:relative;background:#0d1117;border-radius:4px;';
        const bar = document.createElement('div');
        const left  = ((item.start - MIN_H) / TOTAL) * 100;
        const width = ((item.end - item.start) / TOTAL) * 100;
        bar.style.cssText = `position:absolute;left:${left}%;width:${width}%;height:100%;border-radius:4px;background:#1e2235;border:1px solid #3d4166;display:flex;align-items:center;justify-content:center;font-size:0.65rem;color:#64748b;transition:all 0.4s;`;
        bar.textContent = `${item.start}–${item.end}`;
        track.appendChild(bar); row.append(lbl, track); wrap.appendChild(row);
        bars[item.product] = bar;
      });
      viz.appendChild(wrap);
      return { sorted, bars };
    };

    let actState = null;
    let actRunning = false;

    el.querySelector('#act-reset').addEventListener('click', () => {
      actState = buildTimeline();
      el.querySelector('#act-log').innerHTML = '';
    });

    el.querySelector('#act-run').addEventListener('click', async () => {
      if (actRunning) return; actRunning = true;
      if (!actState) actState = buildTimeline();
      const { sorted, bars } = actState;
      const log = el.querySelector('#act-log');
      log.innerHTML = '';

      logLine(log, '<span class="info">Sort by end time — pick if start >= last end</span>');
      let lastEnd = 0;
      const picked = [];

      for (const item of sorted) {
        bars[item.product].style.boxShadow = '0 0 0 2px #f59e0b';
        await sleep(500);
        if (item.start >= lastEnd) {
          picked.push(item.product); lastEnd = item.end;
          Object.assign(bars[item.product].style, { background: '#052e16', borderColor: '#16a34a', color: '#4ade80' });
          logLine(log, `<span class="ok">  ✓ ${item.product} (${item.start}–${item.end})</span>`);
        } else {
          Object.assign(bars[item.product].style, { background: '#2d0a0a', borderColor: '#7f1d1d', color: '#f87171' });
          logLine(log, `<span class="skip">  ✗ ${item.product} — overlaps (last end: ${lastEnd})</span>`);
        }
        bars[item.product].style.boxShadow = '';
        await sleep(300);
      }

      logLine(log, `<span class="ok">✓ Max schedule: [${activitySelection(FLASH_SALES).join(', ')}]</span>`);
      actRunning = false;
    });

    actState = buildTimeline();
  },
};
