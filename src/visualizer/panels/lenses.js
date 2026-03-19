export default {
  id: 'lenses',
  label: 'lenses',

  html: () => `
    <h2>Lenses</h2>
    <p class="subtitle">Composable, immutable getters and setters for nested data</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
      <div>
        <h3 class="section-title" style="margin-top:0">Current Object</h3>
        <div id="lens-obj-viz" style="background:#0d1117;border:1px solid #3d4166;border-radius:8px;padding:1rem;font-family:monospace;font-size:0.82rem;"></div>
      </div>
      <div>
        <h3 class="section-title" style="margin-top:0">Controls</h3>
        <div class="controls" style="flex-direction:column;gap:0.5rem;">
          <div>
            <label>Field</label><br>
            <select id="lens-field" style="width:180px;">
              <option value="name">name</option>
              <option value="city">address.city</option>
              <option value="zip">address.zip</option>
              <option value="age">age</option>
            </select>
          </div>
          <div><label>New value</label><br><input id="lens-val" value="New York" style="width:180px;"></div>
          <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
            <button class="btn" id="lens-view">view</button>
            <button class="btn" id="lens-set">set</button>
            <button class="btn" id="lens-over">over (+ suffix)</button>
          </div>
        </div>
      </div>
    </div>

    <div id="lens-result-viz" style="margin-top:1rem;"></div>

    <details class="source-block">
      <summary><span class="ti">▶</span> Source Code <span class="sf">lenses</span></summary>
      <pre><span class="c">// Lens — pair of getter and setter</span>
const lens = (getter, setter) => ({ getter, setter });

<span class="c">// lensProp — lens for a flat property</span>
const lensProp = key => lens(
  obj => obj[key],
  (obj, val) => ({ ...obj, [key]: val })
);

<span class="c">// composeLens — drill into nested objects</span>
const composeLens = (outerL, innerL) => lens(
  obj => innerL.getter(outerL.getter(obj)),
  (obj, val) => outerL.setter(obj, innerL.setter(outerL.getter(obj), val))
);

<span class="c">// view / set / over</span>
const view = (l, obj)       => l.getter(obj);
const set  = (l, val, obj)  => l.setter(obj, val);
const over = (l, fn, obj)   => l.setter(obj, fn(l.getter(obj)));

const cityLens = composeLens(lensProp('address'), lensProp('city'));
view(cityLens, person);            <span class="c">// "Austin"</span>
set(cityLens, 'NYC', person);      <span class="c">// new object, city changed</span>
over(cityLens, s => s + '!', p);  <span class="c">// appends !</span></pre>
    </details>`,

  mount(el) {
    const lens = (getter, setter) => ({ getter, setter });
    const lensProp = key => lens(obj => obj[key], (obj, val) => ({ ...obj, [key]: val }));
    const composeLens = (outerL, innerL) => lens(
      obj => innerL.getter(outerL.getter(obj)),
      (obj, val) => outerL.setter(obj, innerL.setter(outerL.getter(obj), val))
    );
    const view = (l, obj)      => l.getter(obj);
    const set  = (l, val, obj) => l.setter(obj, val);
    const over = (l, fn, obj)  => l.setter(obj, fn(l.getter(obj)));

    const lenses = {
      name: lensProp('name'),
      city: composeLens(lensProp('address'), lensProp('city')),
      zip:  composeLens(lensProp('address'), lensProp('zip')),
      age:  lensProp('age'),
    };

    let state = { name: 'Alice', address: { city: 'Austin', zip: '78701' }, age: 30 };

    const renderObj = (obj, highlight = null) => {
      const lines = [
        { key: 'name',          val: obj.name,            path: 'name' },
        { key: 'address.city',  val: obj.address.city,    path: 'city' },
        { key: 'address.zip',   val: obj.address.zip,     path: 'zip' },
        { key: 'age',           val: obj.age,             path: 'age' },
      ];
      return lines.map(l => {
        const hl = l.path === highlight;
        return `<div style="padding:0.2rem 0;${hl ? 'color:#fbbf24;background:#2d2000;border-radius:4px;padding:0.2rem 0.4rem;' : ''}">
          <span style="color:#64748b;">${l.key}:</span>
          <span style="color:${hl ? '#fbbf24' : '#c4b5fd'};margin-left:0.5rem;">${JSON.stringify(l.val)}</span>
        </div>`;
      }).join('');
    };

    const renderViz = (highlight = null) => {
      el.querySelector('#lens-obj-viz').innerHTML = renderObj(state, highlight);
    };
    renderViz();

    const showResult = (operation, field, before, after, value) => {
      const viz = el.querySelector('#lens-result-viz');
      viz.innerHTML = '';
      const row = document.createElement('div');
      row.style.cssText = 'display:flex;gap:1rem;flex-wrap:wrap;align-items:flex-start;';

      if (operation === 'view') {
        row.innerHTML = `
          <div style="background:#1a1d2e;border:1px solid #a78bfa55;border-radius:8px;padding:0.75rem 1rem;font-size:0.85rem;">
            <div style="color:#64748b;font-size:0.7rem;margin-bottom:0.3rem;">view(${field}Lens, obj)</div>
            <div style="color:#a78bfa;font-size:1.2rem;font-weight:700;">${JSON.stringify(value)}</div>
          </div>`;
      } else {
        [
          { label: 'Before', obj: before, hl: null },
          { label: 'After',  obj: after,  hl: field },
        ].forEach(s => {
          const box = document.createElement('div');
          box.style.cssText = 'background:#1a1d2e;border:1px solid #3d4166;border-radius:8px;padding:0.75rem 1rem;font-size:0.82rem;flex:1;min-width:200px;';
          box.innerHTML = `<div style="color:#64748b;font-size:0.7rem;margin-bottom:0.5rem;">${s.label}</div>${renderObj(s.obj, s.hl)}`;
          row.appendChild(box);
        });
      }
      viz.appendChild(row);
    };

    el.querySelector('#lens-view').addEventListener('click', () => {
      const field = el.querySelector('#lens-field').value;
      const l     = lenses[field];
      const val   = view(l, state);
      renderViz(field);
      showResult('view', field, state, null, val);
    });

    el.querySelector('#lens-set').addEventListener('click', () => {
      const field  = el.querySelector('#lens-field').value;
      const newVal = el.querySelector('#lens-val').value;
      const l      = lenses[field];
      const before = state;
      const coerced = field === 'age' ? Number(newVal) : newVal;
      state = set(l, coerced, state);
      renderViz(field);
      showResult('set', field, before, state, coerced);
    });

    el.querySelector('#lens-over').addEventListener('click', () => {
      const field  = el.querySelector('#lens-field').value;
      const l      = lenses[field];
      const before = state;
      state = over(l, v => `${String(v)  }!`, state);
      renderViz(field);
      showResult('over', field, before, state, null);
    });

    el.querySelector('#lens-view').click();
  },
};
