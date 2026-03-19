export default {
  id: 'reader-monad',
  label: 'reader monad',

  html: () => `
    <h2>Reader Monad</h2>
    <p class="subtitle">Inject configuration / dependencies implicitly — functions that read from a shared environment</p>

    <h3 class="section-title">Build an API request from environment config</h3>
    <div class="controls">
      <div>
        <label>Environment</label><br>
        <select id="rdr-env">
          <option value="dev">Development</option>
          <option value="staging">Staging</option>
          <option value="prod">Production</option>
        </select>
      </div>
      <div>
        <label>Endpoint</label><br>
        <select id="rdr-endpoint">
          <option value="users">/users</option>
          <option value="products">/products</option>
          <option value="orders">/orders</option>
        </select>
      </div>
      <button class="btn" id="rdr-run">Build Request</button>
    </div>
    <div id="rdr-env-display" style="margin:0.75rem 0"></div>
    <div id="rdr-viz"></div>

    <hr class="section-divider">

    <h3 class="section-title">Why Reader? — vs manual passing</h3>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:0.75rem">
      <div style="background:#2d0a0a;border:1px solid #7f1d1d;border-radius:10px;padding:1rem">
        <div style="color:#f87171;font-size:0.8rem;font-weight:700;margin-bottom:0.5rem">❌ Manual config threading</div>
        <pre style="font-size:0.72rem;color:#fca5a5">const buildUrl = (cfg, ep) =&gt; cfg.baseUrl + ep;
const addAuth  = (cfg, req) =&gt; ({...req, key: cfg.apiKey});
<span style="color:#64748b">// cfg passed to EVERY function</span></pre>
      </div>
      <div style="background:#052e16;border:1px solid #166534;border-radius:10px;padding:1rem">
        <div style="color:#4ade80;font-size:0.8rem;font-weight:700;margin-bottom:0.5rem">✓ Reader monad</div>
        <pre style="font-size:0.72rem;color:#86efac">const buildUrl = ep =&gt; Reader(cfg =&gt; cfg.baseUrl + ep);
const addAuth  = Reader(cfg =&gt; r =&gt; ({...r, key: cfg.apiKey}));
<span style="color:#64748b">// cfg injected once at .run(env)</span></pre>
      </div>
    </div>

    <details class="source-block">
      <summary><span class="ti">▶</span> Source Code</summary>
      <pre><span class="c">// Reader monad</span>
const Reader = run =&gt; ({
  run,
  map:   fn =&gt; Reader(env =&gt; fn(run(env))),
  chain: fn =&gt; Reader(env =&gt; fn(run(env)).run(env)),
});
Reader.of   = val =&gt; Reader(() =&gt; val);
Reader.ask  = Reader(env =&gt; env);
Reader.asks = fn =&gt; Reader(env =&gt; fn(env));

const configs = {
  dev:     { baseUrl: 'http://localhost:3000', apiKey: 'dev-key-123',  retries: 1, timeout: 5000  },
  staging: { baseUrl: 'https://staging.api.com', apiKey: 'stg-key-456', retries: 2, timeout: 10000 },
  prod:    { baseUrl: 'https://api.prod.com',  apiKey: 'prd-key-789',  retries: 3, timeout: 30000 },
};

const getBaseUrl  = Reader.asks(env =&gt; env.baseUrl);
const getApiKey   = Reader.asks(env =&gt; env.apiKey);
const getRetries  = Reader.asks(env =&gt; env.retries);
const buildRequest = endpoint =&gt;
  getBaseUrl.chain(url =&gt;
    getApiKey.chain(key =&gt;
      getRetries.map(retries =&gt; ({ url: url + endpoint, key, retries }))));

buildRequest('/users').run(configs.prod);
<span class="c">// { url: 'https://api.prod.com/users', key: 'prd-key-789', retries: 3 }</span></pre>
    </details>`,

  mount(el) {
    const configs = {
      dev:     { baseUrl: 'http://localhost:3000', apiKey: 'dev-key-123',  retries: 1, timeout: 5000  },
      staging: { baseUrl: 'https://staging.api.com', apiKey: 'stg-key-456', retries: 2, timeout: 10000 },
      prod:    { baseUrl: 'https://api.prod.com',  apiKey: 'prd-key-789',  retries: 3, timeout: 30000 },
    };

    const renderEnv = (env) => {
      const cfg = configs[env];
      el.querySelector('#rdr-env-display').innerHTML = `
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
          ${Object.entries(cfg).map(([k,v]) => `
            <div style="background:#1a1d2e;border:1px solid #3d4166;border-radius:6px;padding:0.3rem 0.6rem;font-size:0.72rem;">
              <span style="color:#64748b">${k}: </span>
              <span style="color:#a78bfa">${typeof v==='string'&&v.length>25?`${v.slice(0,25)}…`:v}</span>
            </div>`).join('')}
        </div>`;
    };

    el.querySelector('#rdr-env').addEventListener('change', () => renderEnv(el.querySelector('#rdr-env').value));
    renderEnv('dev');

    el.querySelector('#rdr-run').addEventListener('click', async () => {
      const envKey   = el.querySelector('#rdr-env').value;
      const endpoint = `/${  el.querySelector('#rdr-endpoint').value}`;
      const cfg      = configs[envKey];
      const viz      = el.querySelector('#rdr-viz');
      viz.innerHTML  = '';

      const steps = [
        { label: 'Reader(env)', note: 'computation described', value: 'pending…' },
        { label: 'asks(env.baseUrl)', note: '', value: cfg.baseUrl },
        { label: 'asks(env.apiKey)',  note: '', value: cfg.apiKey },
        { label: 'asks(env.retries)',  note: '', value: cfg.retries },
        { label: `.run(${envKey})`,  note: 'inject env once', value: 'execute!' },
      ];

      const result = { url: cfg.baseUrl + endpoint, key: cfg.apiKey, retries: cfg.retries, timeout: cfg.timeout };

      for (let i = 0; i <= steps.length; i++) {
        viz.innerHTML = '';
        const col = document.createElement('div');
        col.style.cssText = 'display:flex;flex-direction:column;gap:0.4rem;margin-top:0.5rem;';

        steps.forEach((s, si) => {
          const done = si < i;
          const active = si === i - 1;
          const box = document.createElement('div');
          box.style.cssText = `background:${done?'#052e16':active?'#1a1d2e':'#0d1117'};border:1px solid ${done?'#16a34a':active?'#f59e0b':'#1e2235'};border-radius:8px;padding:0.5rem 0.75rem;font-size:0.78rem;display:flex;justify-content:space-between;transition:all 0.3s;`;
          box.innerHTML = `
            <span style="color:${done?'#4ade80':active?'#fbbf24':'#4b5563'}">${s.label}</span>
            <span style="color:${done?'#86efac':'#64748b'}">${done?s.value:s.note||'…'}</span>`;
          col.appendChild(box);
        });

        if (i === steps.length) {
          const resultBox = document.createElement('div');
          resultBox.style.cssText = 'background:#1a1d2e;border:2px solid #7c3aed;border-radius:10px;padding:0.75rem;margin-top:0.25rem;';
          resultBox.innerHTML = `
            <div style="font-size:0.7rem;color:#a78bfa;margin-bottom:0.4rem">Result request object:</div>
            ${Object.entries(result).map(([k,v])=>`
              <div style="font-size:0.75rem;display:flex;gap:0.5rem;margin:0.2rem 0;">
                <span style="color:#64748b">${k}:</span>
                <span style="color:#fbbf24">"${v}"</span>
              </div>`).join('')}`;
          col.appendChild(resultBox);
        }

        viz.appendChild(col);
        await new Promise(r => setTimeout(r, 350));
      }
    });

    el.querySelector('#rdr-run').click();
  },
};
