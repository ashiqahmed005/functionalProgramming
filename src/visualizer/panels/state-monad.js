export default {
  id: 'state-monad',
  label: 'state monad',

  html: () => `
    <h2>State Monad</h2>
    <p class="subtitle">Thread state through a computation purely — no mutable variables</p>

    <h3 class="section-title">Shopping cart via State monad</h3>
    <div class="controls">
      <button class="btn" id="st-laptop">Add Laptop $1200</button>
      <button class="btn" id="st-mouse">Add Mouse $35</button>
      <button class="btn" id="st-monitor">Add Monitor $600</button>
      <button class="btn secondary" id="st-remove">Remove cheapest</button>
      <button class="btn secondary" id="st-reset">Reset</button>
    </div>
    <div id="st-chain" style="margin:0.75rem 0"></div>
    <div id="st-cart"></div>

    <hr class="section-divider">

    <h3 class="section-title">How State threads through</h3>
    <div style="background:#1a1d2e;border:1px solid #2d3148;border-radius:10px;padding:1rem;margin-top:0.5rem">
      <pre style="font-size:0.78rem;color:#cbd5e1"><span class="c">// State = s -&gt; [result, newState]</span>
const State = run =&gt; ({
  run,
  map:   fn   =&gt; State(s =&gt; { const [a, s2] = run(s); return [fn(a), s2]; }),
  chain: fn   =&gt; State(s =&gt; { const [a, s2] = run(s); return fn(a).run(s2); }),
});

State.of  = val =&gt; State(s =&gt; [val, s]);
State.get = State(s =&gt; [s, s]);
State.put = s =&gt; State(_ =&gt; [undefined, s]);
State.modify = fn =&gt; State(s =&gt; [undefined, fn(s)]);

<span class="c">// addItem is a State computation, not a mutation</span>
const addItem = item =&gt; State.modify(cart =&gt; [...cart, item]);
const program = addItem('Laptop').chain(() =&gt; addItem('Mouse'));
const [_, finalCart] = program.run([]);
<span class="c">// ['Laptop', 'Mouse'] — state threaded purely</span></pre>
    </div>`,

  mount(el) {
    let operations = [];
    const items = { Laptop: 1200, Mouse: 35, Monitor: 600 };

    const renderChain = () => {
      const chain = el.querySelector('#st-chain');
      chain.innerHTML = '';
      if (operations.length === 0) {
        chain.innerHTML = '<span style="color:#4b5563;font-size:0.8rem">No operations yet — add items to build the State chain</span>';
        return;
      }
      const row = document.createElement('div');
      row.style.cssText = 'display:flex;align-items:center;gap:0.4rem;flex-wrap:wrap;';
      row.innerHTML = '<span style="font-size:0.7rem;color:#64748b;margin-right:0.25rem">State.of([])</span>';
      operations.forEach((op) => {
        const arr = document.createElement('span');
        arr.style.cssText = 'color:#a78bfa;'; arr.textContent = '→';
        const box = document.createElement('div');
        box.style.cssText = 'background:#1a1d2e;border:1px solid #7c3aed;border-radius:6px;padding:0.3rem 0.5rem;font-size:0.7rem;color:#a78bfa;';
        box.textContent = op;
        row.appendChild(arr); row.appendChild(box);
      });
      chain.appendChild(row);
    };

    const renderCart = () => {
      const cartEl = el.querySelector('#st-cart');
      // Run the state
      const cart = [];
      operations.forEach(op => {
        if (op.startsWith('add(')) {
          const name = op.slice(4, -1);
          cart.push({ name, price: items[name] });
        } else if (op === 'removeCheapest()') {
          if (cart.length > 0) {
            const minPrice = Math.min(...cart.map(i => i.price));
            const idx = cart.findIndex(i => i.price === minPrice);
            cart.splice(idx, 1);
          }
        }
      });

      const total = cart.reduce((s, i) => s + i.price, 0);

      if (cart.length === 0) {
        cartEl.innerHTML = '<div style="color:#4b5563;font-size:0.8rem;margin-top:0.5rem">Cart is empty</div>';
        return;
      }

      cartEl.innerHTML = `
        <div style="margin-top:0.75rem">
          <div style="font-size:0.75rem;color:#64748b;margin-bottom:0.4rem">Current cart (s = final state):</div>
          <div style="display:flex;flex-direction:column;gap:0.3rem">
            ${cart.map(i => `
              <div style="display:flex;justify-content:space-between;background:#1a1d2e;border:1px solid #2d3148;border-radius:6px;padding:0.4rem 0.75rem;font-size:0.8rem;">
                <span style="color:#94a3b8">${i.name}</span>
                <span style="color:#fbbf24">$${i.price}</span>
              </div>`).join('')}
            <div style="display:flex;justify-content:space-between;background:#052e16;border:1px solid #16a34a;border-radius:6px;padding:0.4rem 0.75rem;font-size:0.85rem;font-weight:700;margin-top:0.2rem">
              <span style="color:#4ade80">Total</span>
              <span style="color:#4ade80">$${total}</span>
            </div>
          </div>
        </div>`;
    };

    const addOp = op => { operations.push(op); renderChain(); renderCart(); };

    el.querySelector('#st-laptop').addEventListener('click', () => addOp('add(Laptop)'));
    el.querySelector('#st-mouse').addEventListener('click',  () => addOp('add(Mouse)'));
    el.querySelector('#st-monitor').addEventListener('click',() => addOp('add(Monitor)'));
    el.querySelector('#st-remove').addEventListener('click', () => addOp('removeCheapest()'));
    el.querySelector('#st-reset').addEventListener('click',  () => { operations = []; renderChain(); renderCart(); });

    renderChain();
  },
};
