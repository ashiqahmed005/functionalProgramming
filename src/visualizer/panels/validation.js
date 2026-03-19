export default {
  id: 'validation',
  label: 'form validation',

  html: () => `
    <h2>Form Validation — Functional Style</h2>
    <p class="subtitle">Composable validators — each returns Either(errors) or Right(value). Chain them with pipe.</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-top:0.75rem">
      <div>
        <h3 class="section-title">Sign-up Form</h3>
        <div id="form-fields" style="display:flex;flex-direction:column;gap:0.75rem"></div>
        <button class="btn" id="form-submit" style="margin-top:1rem;width:100%">Validate All</button>
      </div>
      <div>
        <h3 class="section-title">Validator pipeline</h3>
        <div id="form-pipeline" style="display:flex;flex-direction:column;gap:0.4rem"></div>
      </div>
    </div>

    <details class="source-block">
      <summary><span class="ti">▶</span> Source Code — composable validators</summary>
      <pre><span class="c">// Validator — returns [] (ok) or [errorMsg]</span>
const validate = (...rules) =&gt; value =&gt;
  rules.flatMap(rule =&gt; rule(value));

const required  = v =&gt; v.trim() ? [] : ['Required'];
const minLen    = n =&gt; v =&gt; v.length &gt;= n ? [] : [\`Min \${n} characters\`];
const maxLen    = n =&gt; v =&gt; v.length &lt;= n ? [] : [\`Max \${n} characters\`];
const isEmail   = v =&gt; /^[^@]+@[^@]+\.[^@]+$/.test(v) ? [] : ['Invalid email'];
const hasUpper  = v =&gt; /[A-Z]/.test(v) ? [] : ['Needs uppercase'];
const hasDigit  = v =&gt; /\d/.test(v)    ? [] : ['Needs a digit'];
const isPhone   = v =&gt; /^\+?\d{7,15}$/.test(v.replace(/\s/g,'')) ? [] : ['Invalid phone'];

const nameValid  = validate(required, minLen(2), maxLen(50));
const emailValid = validate(required, isEmail);
const passValid  = validate(required, minLen(8), hasUpper, hasDigit);
const phoneValid = validate(required, isPhone);</pre>
    </details>`,

  mount(el) {
    const required = v => v.trim() ? [] : ['Required'];
    const minLen   = n => v => v.length >= n ? [] : [`Min ${n} characters`];
    const maxLen   = n => v => v.length <= n ? [] : [`Max ${n} characters`];
    const isEmail  = v => /^[^@]+@[^@]+\.[^@]+$/.test(v) ? [] : ['Invalid email format'];
    const hasUpper = v => /[A-Z]/.test(v) ? [] : ['Must contain uppercase letter'];
    const hasDigit = v => /\d/.test(v)    ? [] : ['Must contain a digit'];
    const hasSpecial = v => /[!@#$%^&*]/.test(v) ? [] : ['Must contain special char (!@#...)'];
    const isPhone  = v => /^\+?\d{7,15}$/.test(v.replace(/[\s-]/g,'')) ? [] : ['Invalid phone number'];
    const validate = (...rules) => value => rules.flatMap(r => r(value));

    const FIELDS = [
      { id:'name',  label:'Full Name', type:'text',     placeholder:'Alice Smith',      validators: [required, minLen(2), maxLen(50)],     rules: ['required','minLen(2)','maxLen(50)'] },
      { id:'email', label:'Email',     type:'email',    placeholder:'alice@example.com', validators: [required, isEmail],                  rules: ['required','isEmail'] },
      { id:'pass',  label:'Password',  type:'password', placeholder:'Min 8 chars',      validators: [required, minLen(8), hasUpper, hasDigit, hasSpecial], rules: ['required','minLen(8)','hasUpper','hasDigit','hasSpecial'] },
      { id:'phone', label:'Phone',     type:'tel',      placeholder:'+1 555 123 4567',  validators: [required, isPhone],                  rules: ['required','isPhone'] },
    ];

    // Build form
    const formEl = el.querySelector('#form-fields');
    FIELDS.forEach(f => {
      const wrap = document.createElement('div');
      wrap.innerHTML = `
        <label style="font-size:0.75rem;color:#94a3b8;display:block;margin-bottom:0.25rem">${f.label}</label>
        <input id="inp-${f.id}" type="${f.type}" placeholder="${f.placeholder}"
          style="width:100%;background:#1a1d2e;border:1px solid #2d3148;border-radius:6px;padding:0.5rem 0.75rem;color:#e2e8f0;font-size:0.85rem;outline:none;box-sizing:border-box">
        <div id="err-${f.id}" style="font-size:0.7rem;margin-top:0.25rem"></div>`;
      formEl.appendChild(wrap);

      // live validation
      wrap.querySelector(`#inp-${f.id}`).addEventListener('input', (e) => {
        const errors = validate(...f.validators)(e.target.value);
        const errEl = wrap.querySelector(`#err-${f.id}`);
        const inpEl = wrap.querySelector(`#inp-${f.id}`);
        if (errors.length) {
          errEl.innerHTML = errors.map(e => `<span style="color:#f87171">✗ ${e}</span>`).join(' ');
          inpEl.style.borderColor = '#dc2626';
        } else {
          errEl.innerHTML = '<span style="color:#4ade80">✓ Looks good</span>';
          inpEl.style.borderColor = '#16a34a';
        }
        renderPipeline();
      });
    });

    const renderPipeline = () => {
      const pipeEl = el.querySelector('#form-pipeline');
      pipeEl.innerHTML = '';
      FIELDS.forEach(f => {
        const value  = el.querySelector(`#inp-${f.id}`)?.value || '';
        const errors = validate(...f.validators)(value);
        const ok     = errors.length === 0;
        const box = document.createElement('div');
        box.style.cssText = `background:${value?ok?'#052e16':'#2d0a0a':'#1a1d2e'};border:1px solid ${value?ok?'#16a34a':'#dc2626':'#2d3148'};border-radius:8px;padding:0.5rem 0.75rem;`;
        box.innerHTML = `
          <div style="display:flex;justify-content:space-between;font-size:0.78rem">
            <span style="color:${value?ok?'#4ade80':'#f87171':'#64748b'}">${value?ok?'✓':'✗':''} ${f.label}</span>
            <span style="font-size:0.65rem;color:#4b5563">${f.rules.join(' › ')}</span>
          </div>
          ${!ok && value ? `<div style="font-size:0.68rem;color:#f87171;margin-top:0.2rem">${errors.join(' · ')}</div>` : ''}`;
        pipeEl.appendChild(box);
      });
    };

    el.querySelector('#form-submit').addEventListener('click', () => {
      let allOk = true;
      FIELDS.forEach(f => {
        const value  = el.querySelector(`#inp-${f.id}`)?.value || '';
        const errors = validate(...f.validators)(value);
        const inpEl  = el.querySelector(`#inp-${f.id}`);
        const errEl  = el.querySelector(`#err-${f.id}`);
        if (errors.length) {
          allOk = false;
          errEl.innerHTML = errors.map(e => `<span style="color:#f87171">✗ ${e}</span>`).join(' ');
          inpEl.style.borderColor = '#dc2626';
        } else {
          errEl.innerHTML = '<span style="color:#4ade80">✓ Looks good</span>';
          inpEl.style.borderColor = '#16a34a';
        }
      });
      renderPipeline();
      const btn = el.querySelector('#form-submit');
      if (allOk) {
        btn.textContent = '✓ All valid — form would submit!';
        btn.style.background = '#16a34a';
      } else {
        btn.textContent = '✗ Fix errors above';
        btn.style.background = '#dc2626';
        setTimeout(() => { btn.textContent = 'Validate All'; btn.style.background = ''; }, 2000);
      }
    });

    renderPipeline();
  },
};
