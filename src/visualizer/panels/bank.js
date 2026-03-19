export default {
  id: 'bank',
  label: 'bank transactions',

  html: () => `
    <h2>Bank Transactions — FP Data Pipelines</h2>
    <p class="subtitle">filter → map → reduce on real transaction data — no mutation, pure transformations</p>

    <div class="controls">
      <div>
        <label>Type</label><br>
        <select id="bank-type">
          <option value="all">All</option>
          <option value="credit">Credit only</option>
          <option value="debit">Debit only</option>
        </select>
      </div>
      <div>
        <label>Category</label><br>
        <select id="bank-cat">
          <option value="all">All categories</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Shopping">Shopping</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Salary">Salary</option>
          <option value="Utilities">Utilities</option>
        </select>
      </div>
      <div>
        <label>Sort by</label><br>
        <select id="bank-sort">
          <option value="date">Date (newest)</option>
          <option value="amount-desc">Amount (high→low)</option>
          <option value="amount-asc">Amount (low→high)</option>
        </select>
      </div>
    </div>

    <div id="bank-stats" style="margin:0.75rem 0"></div>
    <div id="bank-table"></div>
    <div id="bank-chart" style="margin-top:0.75rem"></div>

    <details class="source-block">
      <summary><span class="ti">▶</span> Source Code — FP pipeline</summary>
      <pre><span class="c">// Pure pipeline — filter → sort → aggregate</span>
const filterByType = type =&gt; txs =&gt;
  type === 'all' ? txs : txs.filter(t =&gt; t.type === type);

const filterByCat  = cat =&gt; txs =&gt;
  cat  === 'all' ? txs : txs.filter(t =&gt; t.category === cat);

const sortTxs = key =&gt; txs =&gt; [...txs].sort(sorters[key]);

const balance     = txs =&gt; txs.reduce((s,t) =&gt; t.type==='credit' ? s+t.amount : s-t.amount, 0);
const totalIn     = txs =&gt; txs.filter(t =&gt; t.type==='credit').reduce((s,t) =&gt; s+t.amount, 0);
const totalOut    = txs =&gt; txs.filter(t =&gt; t.type==='debit' ).reduce((s,t) =&gt; s+t.amount, 0);
const byCategory  = txs =&gt; txs.reduce((acc,t) =&gt; ({...acc, [t.category]: (acc[t.category]||0)+t.amount}), {});

<span class="c">// Compose the pipeline</span>
const pipe = (...fns) =&gt; x =&gt; fns.reduce((v,f) =&gt; f(v), x);
const process = (type, cat, sort) =&gt; pipe(filterByType(type), filterByCat(cat), sortTxs(sort));</pre>
    </details>`,

  mount(el) {
    const TRANSACTIONS = [
      { id:1,  date:'2024-03-01', desc:'Monthly Salary',        type:'credit', amount:4500, category:'Salary'        },
      { id:2,  date:'2024-03-02', desc:'Grocery Store',         type:'debit',  amount:87,   category:'Food'          },
      { id:3,  date:'2024-03-03', desc:'Netflix',               type:'debit',  amount:15,   category:'Entertainment' },
      { id:4,  date:'2024-03-04', desc:'Uber',                  type:'debit',  amount:23,   category:'Transport'     },
      { id:5,  date:'2024-03-05', desc:'Amazon',                type:'debit',  amount:145,  category:'Shopping'      },
      { id:6,  date:'2024-03-07', desc:'Restaurant',            type:'debit',  amount:62,   category:'Food'          },
      { id:8,  date:'2024-03-09', desc:'Electricity Bill',      type:'debit',  amount:95,   category:'Utilities'     },
      { id:9,  date:'2024-03-10', desc:'Online Course',         type:'debit',  amount:49,   category:'Entertainment' },
      { id:10, date:'2024-03-12', desc:'Freelance Payment',     type:'credit', amount:800,  category:'Salary'        },
      { id:11, date:'2024-03-13', desc:'Coffee Shop',           type:'debit',  amount:18,   category:'Food'          },
      { id:12, date:'2024-03-15', desc:'Gas Station',           type:'debit',  amount:55,   category:'Transport'     },
      { id:13, date:'2024-03-16', desc:'Clothing Store',        type:'debit',  amount:210,  category:'Shopping'      },
      { id:14, date:'2024-03-18', desc:'Internet Bill',         type:'debit',  amount:60,   category:'Utilities'     },
      { id:15, date:'2024-03-20', desc:'Grocery Store',         type:'debit',  amount:110,  category:'Food'          },
      { id:16, date:'2024-03-22', desc:'Spotify',               type:'debit',  amount:10,   category:'Entertainment' },
    ];

    const sorters = {
      'date':         (a, b) => b.date.localeCompare(a.date),
      'amount-desc':  (a, b) => b.amount - a.amount,
      'amount-asc':   (a, b) => a.amount - b.amount,
    };

    const pipe = (...fns) => x => fns.reduce((v,f) => f(v), x);
    const filterByType = type => txs => type === 'all' ? txs : txs.filter(t => t.type === type);
    const filterByCat  = cat  => txs => cat  === 'all' ? txs : txs.filter(t => t.category === cat);
    const sortTxs      = key  => txs => [...txs].sort(sorters[key]);

    const render = () => {
      const type = el.querySelector('#bank-type').value;
      const cat  = el.querySelector('#bank-cat').value;
      const sort = el.querySelector('#bank-sort').value;

      const filtered = pipe(filterByType(type), filterByCat(cat), sortTxs(sort))(TRANSACTIONS);

      const totalIn  = filtered.filter(t => t.type === 'credit').reduce((s,t) => s+t.amount, 0);
      const totalOut = filtered.filter(t => t.type === 'debit' ).reduce((s,t) => s+t.amount, 0);
      const bal      = totalIn - totalOut;
      const largest  = filtered.filter(t=>t.type==='debit').reduce((max,t) => t.amount>max.amount?t:max, {amount:0,desc:'—'});

      // stats
      el.querySelector('#bank-stats').innerHTML = `
        <div style="display:flex;gap:0.75rem;flex-wrap:wrap">
          ${[
            { label:'Balance', val:`$${bal.toFixed(2)}`,  color: bal>=0?'#4ade80':'#f87171' },
            { label:'Total In', val:`+$${totalIn.toFixed(2)}`, color:'#4ade80' },
            { label:'Total Out', val:`-$${totalOut.toFixed(2)}`, color:'#f87171' },
            { label:'Largest Expense', val:`$${largest.amount} (${largest.desc})`, color:'#fbbf24' },
            { label:'Transactions', val:filtered.length, color:'#a78bfa' },
          ].map(s=>`
            <div style="background:#1a1d2e;border:1px solid #2d3148;border-radius:10px;padding:0.6rem 1rem;text-align:center;flex:1;min-width:100px">
              <div style="font-size:0.65rem;color:#64748b;margin-bottom:0.2rem">${s.label}</div>
              <div style="font-size:0.9rem;font-weight:700;color:${s.color}">${s.val}</div>
            </div>`).join('')}
        </div>`;

      // table
      const tableEl = el.querySelector('#bank-table');
      tableEl.innerHTML = `
        <div style="display:grid;grid-template-columns:90px 1fr 80px 70px 80px;gap:0.3rem;margin-top:0.75rem">
          <div style="font-size:0.65rem;color:#4b5563;padding:0.3rem">Date</div>
          <div style="font-size:0.65rem;color:#4b5563;padding:0.3rem">Description</div>
          <div style="font-size:0.65rem;color:#4b5563;padding:0.3rem">Category</div>
          <div style="font-size:0.65rem;color:#4b5563;padding:0.3rem;text-align:center">Type</div>
          <div style="font-size:0.65rem;color:#4b5563;padding:0.3rem;text-align:right">Amount</div>
          ${filtered.map(t => `
            <div style="font-size:0.72rem;color:#64748b;background:#1a1d2e;border-radius:4px;padding:0.35rem">${t.date.slice(5)}</div>
            <div style="font-size:0.72rem;color:#94a3b8;background:#1a1d2e;border-radius:4px;padding:0.35rem">${t.desc}</div>
            <div style="font-size:0.68rem;color:#64748b;background:#1a1d2e;border-radius:4px;padding:0.35rem">${t.category}</div>
            <div style="font-size:0.7rem;text-align:center;background:#1a1d2e;border-radius:4px;padding:0.35rem;color:${t.type==='credit'?'#4ade80':'#f87171'}">${t.type}</div>
            <div style="font-size:0.75rem;font-weight:700;text-align:right;background:#1a1d2e;border-radius:4px;padding:0.35rem;color:${t.type==='credit'?'#4ade80':'#f87171'}">${t.type==='credit'?'+':'-'}$${t.amount}</div>
          `).join('')}
        </div>`;

      // category chart
      const allDebit = TRANSACTIONS.filter(t => t.type === 'debit');
      const byCat    = allDebit.reduce((acc,t) => ({ ...acc, [t.category]: (acc[t.category]||0)+t.amount }), {});
      const maxAmt   = Math.max(...Object.values(byCat));
      const chartEl  = el.querySelector('#bank-chart');
      chartEl.innerHTML = '<div style="font-size:0.7rem;color:#64748b;margin-bottom:0.4rem">Spending by category (all debit):</div>';
      const cats = { Food:'#f97316', Transport:'#3b82f6', Shopping:'#a855f7', Entertainment:'#ec4899', Utilities:'#14b8a6' };
      Object.entries(byCat).sort((a,b)=>b[1]-a[1]).forEach(([cat, amt]) => {
        const pct = (amt / maxAmt * 100).toFixed(0);
        const bar = document.createElement('div');
        bar.style.cssText = 'display:flex;align-items:center;gap:0.5rem;margin-bottom:0.3rem;';
        bar.innerHTML = `
          <div style="width:90px;font-size:0.7rem;color:#64748b;text-align:right">${cat}</div>
          <div style="flex:1;background:#0d1117;border-radius:4px;height:18px;overflow:hidden">
            <div style="width:${pct}%;height:100%;background:${cats[cat]||'#4b5563'};border-radius:4px;transition:width 0.4s"></div>
          </div>
          <div style="font-size:0.7rem;color:#94a3b8;min-width:50px">$${amt}</div>`;
        chartEl.appendChild(bar);
      });
    };

    el.querySelector('#bank-type').addEventListener('change', render);
    el.querySelector('#bank-cat').addEventListener('change', render);
    el.querySelector('#bank-sort').addEventListener('change', render);
    render();
  },
};
