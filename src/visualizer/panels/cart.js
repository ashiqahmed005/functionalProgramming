export default {
  id: 'cart',
  label: 'shopping cart',

  html: () => `
    <h2>Shopping Cart — Pure Functions</h2>
    <p class="subtitle">Every cart operation is a pure function: (cart, item) → newCart — no mutation, fully testable</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:0.75rem">
      <!-- product list -->
      <div>
        <h3 class="section-title">Products</h3>
        <div id="cart-products" style="display:flex;flex-direction:column;gap:0.4rem"></div>
      </div>
      <!-- cart -->
      <div>
        <h3 class="section-title">Cart</h3>
        <div id="cart-items" style="display:flex;flex-direction:column;gap:0.3rem;min-height:60px"></div>
        <div id="cart-totals" style="margin-top:0.75rem"></div>
      </div>
    </div>

    <hr class="section-divider">

    <div class="controls" style="flex-wrap:wrap">
      <div>
        <label>Coupon</label><br>
        <select id="cart-coupon">
          <option value="">None</option>
          <option value="SAVE10">SAVE10 (10%)</option>
          <option value="SAVE20">SAVE20 (20%)</option>
          <option value="HALFOFF">HALFOFF (50%)</option>
        </select>
      </div>
      <div>
        <label>Tax rate</label><br>
        <input type="range" id="cart-tax" min="0" max="20" value="8" step="1" style="width:100px">
        <span id="cart-tax-label" style="color:#fbbf24;font-size:0.8rem">8%</span>
      </div>
      <button class="btn secondary" id="cart-clear">Clear Cart</button>
    </div>

    <details class="source-block">
      <summary><span class="ti">▶</span> Source Code — pure cart functions</summary>
      <pre><span class="c">// All functions are pure — no mutation</span>
const addItem    = (cart, item) =&gt;
  cart.find(i =&gt; i.id === item.id)
    ? cart.map(i =&gt; i.id === item.id ? {...i, qty: i.qty+1} : i)
    : [...cart, {...item, qty: 1}];

const removeItem = (cart, id) =&gt; cart.filter(i =&gt; i.id !== id);
const decItem    = (cart, id) =&gt; cart
  .map(i =&gt; i.id === id ? {...i, qty: i.qty-1} : i)
  .filter(i =&gt; i.qty &gt; 0);

const subtotal   = cart =&gt; cart.reduce((s,i) =&gt; s + i.price * i.qty, 0);
const discount   = (sub, coupon) =&gt; ({ SAVE10:0.1, SAVE20:0.2, HALFOFF:0.5 }[coupon] || 0) * sub;
const tax        = (sub, disc, rate) =&gt; (sub - disc) * (rate / 100);
const shipping   = sub =&gt; sub &gt;= 500 ? 0 : 9.99;
const total      = (sub, disc, tx, ship) =&gt; sub - disc + tx + ship;</pre>
    </details>`,

  mount(el) {
    const PRODUCTS = [
      { id:1, name:'Laptop',       price:999,  emoji:'💻' },
      { id:2, name:'Headphones',   price:149,  emoji:'🎧' },
      { id:3, name:'Keyboard',     price:89,   emoji:'⌨️'  },
      { id:4, name:'Webcam',       price:79,   emoji:'📷' },
      { id:5, name:'Mouse Pad',    price:19,   emoji:'🖱️'  },
      { id:6, name:'USB Hub',      price:39,   emoji:'🔌' },
    ];

    let cart = [];

    // pure fns
    const addItem    = (c, item) => c.find(i => i.id === item.id) ? c.map(i => i.id === item.id ? {...i, qty: i.qty+1} : i) : [...c, {...item, qty: 1}];
    const removeItem = (c, id)   => c.filter(i => i.id !== id);
    const decItem    = (c, id)   => c.map(i => i.id === id ? {...i, qty: i.qty-1} : i).filter(i => i.qty > 0);
    const subtotal   = c         => c.reduce((s,i) => s + i.price * i.qty, 0);
    const discountPct= coupon    => ({ SAVE10:0.1, SAVE20:0.2, HALFOFF:0.5 }[coupon] || 0);

    const render = () => {
      const coupon  = el.querySelector('#cart-coupon').value;
      const taxRate = parseInt(el.querySelector('#cart-tax').value);
      el.querySelector('#cart-tax-label').textContent = `${taxRate  }%`;

      // products
      const prodEl = el.querySelector('#cart-products');
      prodEl.innerHTML = '';
      PRODUCTS.forEach(p => {
        const cartItem = cart.find(i => i.id === p.id);
        const row = document.createElement('div');
        row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;background:#1a1d2e;border:1px solid #2d3148;border-radius:8px;padding:0.5rem 0.75rem;';
        row.innerHTML = `
          <span style="font-size:0.85rem">${p.emoji} ${p.name}</span>
          <span style="color:#fbbf24;font-size:0.8rem">$${p.price}</span>
          <button style="background:#7c3aed;color:#fff;border:none;border-radius:6px;padding:0.2rem 0.6rem;cursor:pointer;font-size:0.75rem" data-id="${p.id}">
            ${cartItem ? `Add (${cartItem.qty} in cart)` : 'Add'}
          </button>`;
        row.querySelector('button').addEventListener('click', () => { cart = addItem(cart, p); render(); });
        prodEl.appendChild(row);
      });

      // cart items
      const cartEl = el.querySelector('#cart-items');
      cartEl.innerHTML = cart.length === 0 ? '<div style="color:#4b5563;font-size:0.8rem;padding:0.5rem">Empty — add products</div>' : '';
      cart.forEach(item => {
        const row = document.createElement('div');
        row.style.cssText = 'display:flex;align-items:center;gap:0.4rem;background:#0d1117;border:1px solid #1e2235;border-radius:6px;padding:0.4rem 0.6rem;font-size:0.78rem;';
        row.innerHTML = `
          <span style="flex:1;color:#94a3b8">${item.emoji} ${item.name}</span>
          <button style="background:#1e2235;color:#94a3b8;border:1px solid #3d4166;border-radius:4px;width:20px;height:20px;cursor:pointer;font-size:0.8rem" data-dec="${item.id}">−</button>
          <span style="color:#fbbf24;min-width:16px;text-align:center">${item.qty}</span>
          <button style="background:#1e2235;color:#94a3b8;border:1px solid #3d4166;border-radius:4px;width:20px;height:20px;cursor:pointer;font-size:0.8rem" data-inc="${item.id}">+</button>
          <span style="color:#fbbf24;min-width:50px;text-align:right">$${(item.price*item.qty).toFixed(2)}</span>
          <button style="background:transparent;color:#f87171;border:none;cursor:pointer;font-size:0.9rem" data-del="${item.id}">✕</button>`;
        row.querySelector('[data-dec]').addEventListener('click', () => { cart = decItem(cart, item.id); render(); });
        row.querySelector('[data-inc]').addEventListener('click', () => { cart = addItem(cart, item); render(); });
        row.querySelector('[data-del]').addEventListener('click', () => { cart = removeItem(cart, item.id); render(); });
        cartEl.appendChild(row);
      });

      // totals
      const sub  = subtotal(cart);
      const disc = discountPct(coupon) * sub;
      const tx   = (sub - disc) * (taxRate / 100);
      const ship = sub >= 500 ? 0 : cart.length > 0 ? 9.99 : 0;
      const tot  = sub - disc + tx + ship;

      const totEl = el.querySelector('#cart-totals');
      totEl.innerHTML = `
        <div style="background:#1a1d2e;border:1px solid #2d3148;border-radius:10px;padding:0.75rem;font-size:0.8rem;">
          <div style="display:flex;justify-content:space-between;color:#94a3b8;margin-bottom:0.3rem"><span>subtotal(cart)</span><span>$${sub.toFixed(2)}</span></div>
          ${disc > 0 ? `<div style="display:flex;justify-content:space-between;color:#f87171;margin-bottom:0.3rem"><span>discount(${coupon})</span><span>−$${disc.toFixed(2)}</span></div>` : ''}
          <div style="display:flex;justify-content:space-between;color:#94a3b8;margin-bottom:0.3rem"><span>tax(${taxRate}%)</span><span>$${tx.toFixed(2)}</span></div>
          <div style="display:flex;justify-content:space-between;color:${ship===0&&cart.length>0?'#4ade80':'#94a3b8'};margin-bottom:0.5rem"><span>shipping${sub>=500&&cart.length>0?' (FREE!)':''}</span><span>${cart.length===0?'$0.00':ship===0?'FREE':`$${ship.toFixed(2)}`}</span></div>
          <div style="display:flex;justify-content:space-between;font-weight:700;font-size:0.95rem;padding-top:0.4rem;border-top:1px solid #2d3148"><span style="color:#fff">total()</span><span style="color:#fbbf24">$${tot.toFixed(2)}</span></div>
        </div>`;
    };

    el.querySelector('#cart-coupon').addEventListener('change', render);
    el.querySelector('#cart-tax').addEventListener('input', render);
    el.querySelector('#cart-clear').addEventListener('click', () => { cart = []; render(); });

    render();
  },
};
