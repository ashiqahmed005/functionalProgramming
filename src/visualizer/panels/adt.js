export default {
  id: 'adt',
  label: 'ADTs',

  html: () => `
    <h2>Algebraic Data Types &amp; Pattern Matching</h2>
    <p class="subtitle">Model your domain with types — match exhaustively, never null-check again</p>

    <h3 class="section-title">1. Shape — area &amp; perimeter by type</h3>
    <div class="controls">
      <div>
        <label>Shape</label><br>
        <select id="adt-shape">
          <option value="circle">Circle</option>
          <option value="rect">Rectangle</option>
          <option value="triangle">Triangle</option>
        </select>
      </div>
      <div id="adt-inputs" style="display:flex;gap:0.5rem;align-items:flex-end"></div>
      <button class="btn" id="adt-run">Compute</button>
    </div>
    <div id="adt-viz"></div>

    <hr class="section-divider">

    <h3 class="section-title">2. Result type — safe division</h3>
    <div class="controls">
      <div><label>Dividend</label><br><input id="div-a" value="10" style="width:70px"></div>
      <div><label>Divisor</label><br><input id="div-b" value="0" style="width:70px"></div>
      <button class="btn" id="div-run">safeDivide</button>
    </div>
    <div id="div-viz"></div>

    <hr class="section-divider">

    <h3 class="section-title">3. List ADT — head / tail / length</h3>
    <div class="controls">
      <div><label>Items (comma)</label><br><input id="list-items" value="1,2,3,4,5" style="width:140px"></div>
      <button class="btn" id="list-run">Build List</button>
    </div>
    <div id="list-viz"></div>

    <details class="source-block">
      <summary><span class="ti">▶</span> Source Code</summary>
      <pre><span class="c">// Shape ADT — tagged unions</span>
const Circle   = r        =&gt; ({ type:'Circle', r });
const Rect     = (w, h)  =&gt; ({ type:'Rect', w, h });
const Triangle = (a,b,c) =&gt; ({ type:'Triangle', a, b, c });

<span class="c">// match — exhaustive pattern matching</span>
const match = handlers =&gt; shape =&gt; handlers[shape.type](shape);

const area = match({
  Circle:   ({r})       =&gt; Math.PI * r * r,
  Rect:     ({w,h})     =&gt; w * h,
  Triangle: ({a,b,c})   =&gt; {
    const s = (a+b+c)/2;
    return Math.sqrt(s*(s-a)*(s-b)*(s-c));
  },
});

<span class="c">// Result ADT — success or failure</span>
const Ok  = val =&gt; ({ type:'Ok',  val });
const Err = msg =&gt; ({ type:'Err', msg });

const safeDivide = (a, b) =&gt;
  b === 0 ? Err('Division by zero') : Ok(a / b);</pre>
    </details>`,

  mount(el) {
    // ── shape inputs ──────────────────────────────────────────────────────────
    const shapeInputs = {
      circle:   [{ id:'r',   label:'radius', def:5 }],
      rect:     [{ id:'w',   label:'width',  def:4 }, { id:'h', label:'height', def:6 }],
      triangle: [{ id:'a',   label:'side a', def:3 }, { id:'b', label:'side b', def:4 }, { id:'c', label:'side c', def:5 }],
    };

    const renderInputs = () => {
      const shape = el.querySelector('#adt-shape').value;
      const inp = el.querySelector('#adt-inputs');
      inp.innerHTML = '';
      shapeInputs[shape].forEach(({ id, label, def }) => {
        inp.innerHTML += `<div><label>${label}</label><br><input id="adt-${id}" value="${def}" style="width:60px"></div>`;
      });
    };
    el.querySelector('#adt-shape').addEventListener('change', renderInputs);
    renderInputs();

    el.querySelector('#adt-run').addEventListener('click', () => {
      const shape = el.querySelector('#adt-shape').value;
      const viz   = el.querySelector('#adt-viz');
      viz.innerHTML = '';

      let area, perimeter, matched;
      if (shape === 'circle') {
        const r = parseFloat(el.querySelector('#adt-r')?.value) || 5;
        area = Math.PI * r * r; perimeter = 2 * Math.PI * r;
        matched = `Circle { r: ${r} }`;
      } else if (shape === 'rect') {
        const w = parseFloat(el.querySelector('#adt-w')?.value) || 4;
        const h = parseFloat(el.querySelector('#adt-h')?.value) || 6;
        area = w * h; perimeter = 2 * (w + h);
        matched = `Rect { w: ${w}, h: ${h} }`;
      } else {
        const a = parseFloat(el.querySelector('#adt-a')?.value) || 3;
        const b = parseFloat(el.querySelector('#adt-b')?.value) || 4;
        const c = parseFloat(el.querySelector('#adt-c')?.value) || 5;
        const s = (a+b+c)/2;
        area = Math.sqrt(s*(s-a)*(s-b)*(s-c)); perimeter = a+b+c;
        matched = `Triangle { a: ${a}, b: ${b}, c: ${c} }`;
      }

      viz.innerHTML = `
        <div style="display:flex;gap:1rem;flex-wrap:wrap;margin-top:0.75rem">
          <div style="background:#1a1d2e;border:2px solid #7c3aed;border-radius:12px;padding:1rem;min-width:180px">
            <div style="font-size:0.65rem;color:#64748b">matched branch</div>
            <div style="color:#a78bfa;font-weight:700;margin:0.25rem 0">${matched}</div>
          </div>
          <div style="background:#052e16;border:2px solid #16a34a;border-radius:12px;padding:1rem;display:flex;gap:1.5rem">
            <div style="text-align:center">
              <div style="font-size:0.65rem;color:#64748b">area</div>
              <div style="color:#4ade80;font-size:1.4rem;font-weight:700">${area.toFixed(2)}</div>
            </div>
            <div style="text-align:center">
              <div style="font-size:0.65rem;color:#64748b">perimeter</div>
              <div style="color:#4ade80;font-size:1.4rem;font-weight:700">${perimeter.toFixed(2)}</div>
            </div>
          </div>
        </div>`;
    });
    el.querySelector('#adt-run').click();

    // ── safe divide ───────────────────────────────────────────────────────────
    el.querySelector('#div-run').addEventListener('click', () => {
      const a = parseFloat(el.querySelector('#div-a').value);
      const b = parseFloat(el.querySelector('#div-b').value);
      const viz = el.querySelector('#div-viz');
      const ok = b !== 0;
      viz.innerHTML = `
        <div style="display:flex;gap:0.75rem;flex-wrap:wrap;margin-top:0.75rem;align-items:center">
          <div style="background:#1a1d2e;border:1px solid #3d4166;border-radius:8px;padding:0.6rem 1rem;font-size:0.8rem;color:#94a3b8">
            safeDivide(${a}, ${b})
          </div>
          <div style="color:#4b5563;font-size:1.2rem">→</div>
          <div style="background:${ok?'#052e16':'#2d0a0a'};border:2px solid ${ok?'#16a34a':'#dc2626'};border-radius:10px;padding:0.75rem 1.25rem;font-weight:700;color:${ok?'#4ade80':'#f87171'}">
            ${ok ? `Ok(${a/b})` : 'Err("Division by zero")'}
          </div>
          <div style="font-size:0.75rem;color:#64748b">${ok ? '✓ Success branch — safe to use .val' : '✗ Error branch — handle with .msg'}</div>
        </div>`;
    });
    el.querySelector('#div-run').click();

    // ── List ADT ─────────────────────────────────────────────────────────────
    el.querySelector('#list-run').addEventListener('click', () => {
      const items = el.querySelector('#list-items').value.split(',').map(s => s.trim()).filter(Boolean);
      const viz   = el.querySelector('#list-viz');
      viz.innerHTML = '';

      const Cons = (h, t) => ({ type:'Cons', head:h, tail:t });
      const Nil  = { type:'Nil' };

      const fromArray = arr => arr.reduceRight((acc, v) => Cons(v, acc), Nil);
      const length = lst => lst.type === 'Nil' ? 0 : 1 + length(lst.tail);

      const list = fromArray(items);

      const row = document.createElement('div');
      row.style.cssText = 'display:flex;align-items:center;gap:0.3rem;flex-wrap:wrap;margin-top:0.75rem;';

      items.forEach((item, i) => {
        const node = document.createElement('div');
        node.style.cssText = 'background:#1a1d2e;border:1px solid #7c3aed;border-radius:6px;padding:0.4rem;font-size:0.75rem;text-align:center;';
        node.innerHTML = `<div style="color:#a78bfa;font-weight:700">${item}</div><div style="color:#4b5563;font-size:0.6rem">Cons</div>`;
        row.appendChild(node);
        if (i < items.length - 1) {
          const arr = document.createElement('div');
          arr.style.cssText = 'color:#4b5563;font-size:1rem;';
          arr.textContent = '→'; row.appendChild(arr);
        }
      });
      const nil = document.createElement('div');
      nil.style.cssText = 'background:#0d1117;border:1px solid #1e2235;border-radius:6px;padding:0.4rem 0.5rem;font-size:0.7rem;color:#4b5563;';
      nil.textContent = 'Nil'; row.appendChild(document.createTextNode(' → ')); row.appendChild(nil);
      viz.appendChild(row);

      viz.innerHTML += `<div style="margin-top:0.6rem;font-size:0.8rem;color:#94a3b8">
        head = <span style="color:#a78bfa">${items[0]||'empty'}</span> &nbsp;|&nbsp;
        tail.head = <span style="color:#a78bfa">${items[1]||'Nil'}</span> &nbsp;|&nbsp;
        length = <span style="color:#fbbf24">${length(list)}</span>
      </div>`;
    });
    el.querySelector('#list-run').click();
  },
};
