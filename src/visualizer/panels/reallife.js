export default {
  id: 'reallife',
  label: 'real-life FP',

  html: () => `
    <h2>Real-Life FP — Everyday Scenarios</h2>
    <p class="subtitle">Tabs: Blog | Students | Weather | Notifications — all driven by pure FP pipelines</p>

    <div style="display:flex;gap:0.4rem;margin-bottom:1rem;flex-wrap:wrap" id="rl-tabs">
      <button class="btn active" data-tab="blog">📝 Blog</button>
      <button class="btn secondary" data-tab="students">🎓 Students</button>
      <button class="btn secondary" data-tab="weather">🌤 Weather</button>
      <button class="btn secondary" data-tab="notif">🔔 Notifications</button>
    </div>

    <div id="rl-panel-blog">
      <div class="controls">
        <div><input id="blog-search" placeholder="Search posts…" style="width:180px"></div>
        <div>
          <select id="blog-tag">
            <option value="all">All tags</option>
            <option value="fp">Functional</option>
            <option value="js">JavaScript</option>
            <option value="react">React</option>
            <option value="perf">Performance</option>
          </select>
        </div>
        <div>
          <select id="blog-sort">
            <option value="newest">Newest first</option>
            <option value="popular">Most popular</option>
          </select>
        </div>
      </div>
      <div id="blog-results" style="margin-top:0.75rem;display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:0.75rem"></div>
      <div id="blog-count" style="font-size:0.75rem;color:#64748b;margin-top:0.5rem"></div>
    </div>

    <div id="rl-panel-students" style="display:none">
      <div class="controls">
        <div><label>Sort by</label><br>
          <select id="stu-sort"><option value="name">Name</option><option value="avg">Avg grade</option><option value="gpa">GPA</option></select>
        </div>
        <div><label>Filter</label><br>
          <select id="stu-filter"><option value="all">All</option><option value="pass">Passing</option><option value="fail">Failing</option></select>
        </div>
      </div>
      <div id="stu-table" style="margin-top:0.75rem"></div>
    </div>

    <div id="rl-panel-weather" style="display:none">
      <div id="weather-table" style="margin-top:0.5rem"></div>
      <div id="weather-stats" style="margin-top:0.75rem"></div>
    </div>

    <div id="rl-panel-notif" style="display:none">
      <div class="controls">
        <div><select id="notif-filter"><option value="all">All</option><option value="info">Info</option><option value="warning">Warning</option><option value="error">Error</option><option value="success">Success</option></select></div>
        <button class="btn" id="notif-mark-all">Mark all read</button>
        <button class="btn secondary" id="notif-reset">Reset</button>
      </div>
      <div id="notif-count" style="font-size:0.75rem;color:#64748b;margin:0.4rem 0"></div>
      <div id="notif-list" style="display:flex;flex-direction:column;gap:0.4rem;margin-top:0.5rem"></div>
    </div>`,

  mount(el) {
    // ── tabs ─────────────────────────────────────────────────────────────────
    const tabs = ['blog','students','weather','notif'];
    el.querySelectorAll('#rl-tabs button').forEach(btn => {
      btn.addEventListener('click', () => {
        el.querySelectorAll('#rl-tabs button').forEach(b => b.classList.replace('btn','btn') || (b.className = 'btn secondary'));
        btn.className = 'btn active';
        tabs.forEach(t => {
          const p = el.querySelector(`#rl-panel-${t}`);
          if(p) p.style.display = btn.dataset.tab === t ? '' : 'none';
        });
      });
    });

    // ── Blog ─────────────────────────────────────────────────────────────────
    const POSTS = [
      { id:1, title:'Mastering Currying in JS',        author:'Alice', date:'2024-03-10', tags:['fp','js'],       views:1240, excerpt:'Partial application and point-free style explained.' },
      { id:2, title:'React Hooks: A Functional View',  author:'Bob',   date:'2024-03-08', tags:['react','fp'],    views:980,  excerpt:'Hooks are functional programming brought to React.' },
      { id:3, title:'Why Immutability Matters',        author:'Alice', date:'2024-03-05', tags:['fp','perf'],     views:2100, excerpt:'Mutation is the root of many bugs. Let\'s eliminate it.' },
      { id:4, title:'JavaScript Performance Tips',     author:'Carol', date:'2024-03-03', tags:['js','perf'],     views:560,  excerpt:'Profiling, memoization, and lazy evaluation tricks.' },
      { id:5, title:'Monads Demystified',              author:'Bob',   date:'2024-02-28', tags:['fp'],            views:1890, excerpt:'Maybe, Either, IO — functors that chain safely.' },
      { id:6, title:'CSS-in-JS vs Tailwind',           author:'Carol', date:'2024-02-25', tags:['react','js'],    views:3200, excerpt:'Comparing styling approaches in modern React apps.' },
    ];

    const renderBlog = () => {
      const query = el.querySelector('#blog-search').value.toLowerCase();
      const tag   = el.querySelector('#blog-tag').value;
      const sort  = el.querySelector('#blog-sort').value;
      const sorters = { newest: (a,b) => b.date.localeCompare(a.date), popular: (a,b) => b.views-a.views };
      const filtered = POSTS
        .filter(p => !query || p.title.toLowerCase().includes(query) || p.excerpt.toLowerCase().includes(query))
        .filter(p => tag === 'all' || p.tags.includes(tag))
        .sort(sorters[sort]);

      const res = el.querySelector('#blog-results');
      res.innerHTML = filtered.map(p => `
        <div style="background:#1a1d2e;border:1px solid #2d3148;border-radius:10px;padding:0.85rem">
          <div style="font-size:0.85rem;font-weight:700;color:#e2e8f0;margin-bottom:0.3rem">${p.title}</div>
          <div style="font-size:0.68rem;color:#64748b;margin-bottom:0.4rem">${p.author} · ${p.date} · 👁 ${p.views}</div>
          <div style="font-size:0.75rem;color:#94a3b8;margin-bottom:0.4rem">${p.excerpt}</div>
          <div style="display:flex;gap:0.3rem;flex-wrap:wrap">${p.tags.map(t=>`<span style="background:#2d3148;color:#a78bfa;font-size:0.65rem;padding:0.15rem 0.4rem;border-radius:4px">#${t}</span>`).join('')}</div>
        </div>`).join('');
      el.querySelector('#blog-count').textContent = `${filtered.length} of ${POSTS.length} posts`;
    };
    el.querySelector('#blog-search').addEventListener('input', renderBlog);
    el.querySelector('#blog-tag').addEventListener('change', renderBlog);
    el.querySelector('#blog-sort').addEventListener('change', renderBlog);
    renderBlog();

    // ── Students ─────────────────────────────────────────────────────────────
    const STUDENTS = [
      { name:'Alice',   grades:[92,88,95,87,91] },
      { name:'Bob',     grades:[55,60,48,70,52] },
      { name:'Carol',   grades:[78,82,80,75,88] },
      { name:'David',   grades:[95,98,92,96,99] },
      { name:'Emma',    grades:[62,58,65,70,60] },
      { name:'Frank',   grades:[88,85,90,82,87] },
      { name:'Grace',   grades:[44,50,38,55,47] },
    ];
    const avg     = grades => grades.reduce((s,g)=>s+g,0)/grades.length;
    const letter  = a => a>=90?'A':a>=80?'B':a>=70?'C':a>=60?'D':'F';
    const gpa     = a => a>=90?4.0:a>=80?3.0:a>=70?2.0:a>=60?1.0:0.0;

    const renderStudents = () => {
      const sort   = el.querySelector('#stu-sort').value;
      const filter = el.querySelector('#stu-filter').value;
      const sorters = { name:(a,b)=>a.name.localeCompare(b.name), avg:(a,b)=>avg(b.grades)-avg(a.grades), gpa:(a,b)=>gpa(avg(b.grades))-gpa(avg(a.grades)) };
      const students = STUDENTS
        .filter(s => filter==='all' || (filter==='pass'&&avg(s.grades)>=60) || (filter==='fail'&&avg(s.grades)<60))
        .sort(sorters[sort]);

      el.querySelector('#stu-table').innerHTML = `
        <div style="display:grid;grid-template-columns:100px 1fr 60px 60px 60px 70px;gap:0.3rem">
          ${['Name','Grades','Avg','Letter','GPA','Status'].map(h=>`<div style="font-size:0.65rem;color:#4b5563;padding:0.3rem">${h}</div>`).join('')}
          ${students.map(s => {
            const a = avg(s.grades); const pass = a >= 60;
            return `
              <div style="background:#1a1d2e;border-radius:4px;padding:0.35rem;font-size:0.78rem;color:#e2e8f0">${s.name}</div>
              <div style="background:#1a1d2e;border-radius:4px;padding:0.35rem;font-size:0.68rem;color:#64748b">${s.grades.join(', ')}</div>
              <div style="background:#1a1d2e;border-radius:4px;padding:0.35rem;font-size:0.78rem;color:#fbbf24;text-align:center">${a.toFixed(1)}</div>
              <div style="background:#1a1d2e;border-radius:4px;padding:0.35rem;font-size:0.78rem;font-weight:700;text-align:center;color:${a>=90?'#4ade80':a>=70?'#fbbf24':'#f87171'}">${letter(a)}</div>
              <div style="background:#1a1d2e;border-radius:4px;padding:0.35rem;font-size:0.78rem;text-align:center;color:#a78bfa">${gpa(a).toFixed(1)}</div>
              <div style="background:${pass?'#052e16':'#2d0a0a'};border-radius:4px;padding:0.35rem;font-size:0.7rem;text-align:center;color:${pass?'#4ade80':'#f87171'}">${pass?'PASS':'FAIL'}</div>`;
          }).join('')}
        </div>`;
    };
    el.querySelector('#stu-sort').addEventListener('change', renderStudents);
    el.querySelector('#stu-filter').addEventListener('change', renderStudents);
    renderStudents();

    // ── Weather ──────────────────────────────────────────────────────────────
    const WEATHER = [
      { day:'Mon', condition:'Sunny',  high:28, low:18, humidity:40, wind:12 },
      { day:'Tue', condition:'Cloudy', high:22, low:15, humidity:65, wind:18 },
      { day:'Wed', condition:'Rainy',  high:18, low:12, humidity:88, wind:25 },
      { day:'Thu', condition:'Stormy', high:15, low:10, humidity:95, wind:45 },
      { day:'Fri', condition:'Cloudy', high:20, low:14, humidity:72, wind:20 },
      { day:'Sat', condition:'Sunny',  high:26, low:17, humidity:45, wind:8  },
      { day:'Sun', condition:'Sunny',  high:29, low:19, humidity:38, wind:10 },
    ];
    const icons = { Sunny:'☀️', Cloudy:'☁️', Rainy:'🌧️', Stormy:'⛈️' };
    const condColor = { Sunny:'#fbbf24', Cloudy:'#94a3b8', Rainy:'#3b82f6', Stormy:'#7c3aed' };

    const weatherTable = el.querySelector('#weather-table');
    weatherTable.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:0.4rem">
        ${WEATHER.map(w => `
          <div style="background:#1a1d2e;border:1px solid #2d3148;border-radius:10px;padding:0.65rem;text-align:center">
            <div style="font-size:0.7rem;color:#64748b">${w.day}</div>
            <div style="font-size:1.4rem">${icons[w.condition]}</div>
            <div style="font-size:0.7rem;color:${condColor[w.condition]}">${w.condition}</div>
            <div style="font-size:0.8rem;color:#fbbf24;font-weight:700">${w.high}°</div>
            <div style="font-size:0.7rem;color:#64748b">${w.low}°</div>
            <div style="font-size:0.65rem;color:#4b5563;margin-top:0.2rem">💧${w.humidity}%</div>
          </div>`).join('')}
      </div>`;

    const avgTemp  = (WEATHER.reduce((s,w)=>s+w.high,0)/WEATHER.length).toFixed(1);
    const hottest  = WEATHER.reduce((m,w)=>w.high>m.high?w:m);
    const coldest  = WEATHER.reduce((m,w)=>w.low<m.low?w:m);
    const rainyDays= WEATHER.filter(w=>['Rainy','Stormy'].includes(w.condition)).length;
    el.querySelector('#weather-stats').innerHTML = `
      <div style="display:flex;gap:0.6rem;flex-wrap:wrap">
        ${[['Avg High',`${avgTemp}°C`,'#fbbf24'],['Hottest',`${hottest.day} ${hottest.high}°`,'#f97316'],['Coldest',`${coldest.day} ${coldest.low}°`,'#3b82f6'],['Rainy Days',rainyDays,'#a78bfa']].map(([l,v,c])=>`
          <div style="background:#1a1d2e;border:1px solid #2d3148;border-radius:8px;padding:0.5rem 0.75rem;text-align:center;flex:1">
            <div style="font-size:0.65rem;color:#64748b">${l}</div>
            <div style="font-size:0.9rem;font-weight:700;color:${c}">${v}</div>
          </div>`).join('')}
      </div>`;

    // ── Notifications ─────────────────────────────────────────────────────────
    let NOTIFS = [
      { id:1, type:'success', msg:'Deployment to production completed successfully', read:false, time:'2m ago'  },
      { id:2, type:'error',   msg:'Database connection failed — retrying in 30s',   read:false, time:'5m ago'  },
      { id:3, type:'info',    msg:'New team member Alice joined the workspace',      read:false, time:'12m ago' },
      { id:4, type:'warning', msg:'API rate limit at 80% — consider throttling',    read:true,  time:'1h ago'  },
      { id:5, type:'success', msg:'PR #142 merged into main',                        read:false, time:'2h ago'  },
      { id:6, type:'info',    msg:'Weekly report is ready for review',               read:true,  time:'3h ago'  },
      { id:7, type:'error',   msg:'Payment gateway timeout — 3 transactions failed', read:false, time:'4h ago'  },
      { id:8, type:'warning', msg:'Disk usage at 90% on server-02',                 read:false, time:'5h ago'  },
    ];
    const typeColor = { success:'#16a34a', error:'#dc2626', info:'#3b82f6', warning:'#f59e0b' };
    const typeIcon  = { success:'✓', error:'✗', info:'ℹ', warning:'⚠' };

    const renderNotifs = () => {
      const filter = el.querySelector('#notif-filter').value;
      const visible = filter === 'all' ? NOTIFS : NOTIFS.filter(n => n.type === filter);
      const unread  = NOTIFS.filter(n => !n.read).length;
      el.querySelector('#notif-count').textContent = `${unread} unread · ${visible.length} shown`;

      const list = el.querySelector('#notif-list');
      list.innerHTML = '';
      visible.forEach(n => {
        const row = document.createElement('div');
        row.style.cssText = `display:flex;align-items:flex-start;gap:0.6rem;background:${n.read?'#0d1117':'#1a1d2e'};border:1px solid ${n.read?'#1e2235':`${typeColor[n.type]}44`};border-left:3px solid ${typeColor[n.type]};border-radius:8px;padding:0.6rem 0.75rem;cursor:pointer;transition:all 0.2s;opacity:${n.read?0.6:1}`;
        row.innerHTML = `
          <div style="background:${typeColor[n.type]}22;color:${typeColor[n.type]};border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-size:0.75rem;flex-shrink:0">${typeIcon[n.type]}</div>
          <div style="flex:1">
            <div style="font-size:0.78rem;color:${n.read?'#64748b':'#e2e8f0'}">${n.msg}</div>
            <div style="font-size:0.65rem;color:#4b5563;margin-top:0.15rem">${n.type} · ${n.time}</div>
          </div>
          ${!n.read ? `<button style="background:transparent;border:1px solid #2d3148;color:#64748b;border-radius:4px;padding:0.15rem 0.4rem;font-size:0.65rem;cursor:pointer" data-mark="${n.id}">mark read</button>` : '<span style="font-size:0.65rem;color:#4b5563">read</span>'}`;
        const markBtn = row.querySelector('[data-mark]');
        if (markBtn) markBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          NOTIFS = NOTIFS.map(nn => nn.id === n.id ? {...nn, read:true} : nn);
          renderNotifs();
        });
        row.addEventListener('click', () => {
          NOTIFS = NOTIFS.map(nn => nn.id === n.id ? {...nn, read:true} : nn);
          renderNotifs();
        });
        list.appendChild(row);
      });
    };

    el.querySelector('#notif-filter').addEventListener('change', renderNotifs);
    el.querySelector('#notif-mark-all').addEventListener('click', () => { NOTIFS = NOTIFS.map(n => ({...n, read:true})); renderNotifs(); });
    el.querySelector('#notif-reset').addEventListener('click', () => { NOTIFS = NOTIFS.map(n => ({...n, read:false})); renderNotifs(); });
    renderNotifs();
  },
};
