// ---------- Demo data ----------
const faults = [
  { id: 1, sev: 'critical', code: 'HYD-01', title: 'Hydraulic over-pressure (jam)', machine: 'BMM-160 #0142', site: 'Shree Ganesh Bhatta, Jhajjar', state: 'Fault stop', age: 4, status: 'New', operator: 'Ramesh', fw: 'gw 1.4.2',
    engine: 84, module: 38,
    metric: { name: 'Hydraulic pressure', unit: 'bar', base: 210, limit: 300, shape: 'spike', peak: 345 },
    readings: { engine: [['Oil pressure', '3.9 bar', 0], ['Coolant temp', '88 °C', 0], ['RPM', '1,180 rpm', 0], ['Fuel rate', '6.1 L/h', 0]],
                module: [['Hydraulic pressure', '338 bar', 1], ['Hydraulic oil temp', '71 °C', 0], ['Mixer load', '97 %', 1], ['Drum speed', '0 cycles/min', 1], ['Drum vs ground sync', '—', 0]] },
    cause: 'Pressure rose with mixer load just before the drum stopped. This matches a clay jam at the feed chute, not pump failure.',
    similar: ['3 HYD-01 on BMM-160 in 30 days; 2 cleared by operator removing a stone from the chute', 'Clay moisture low this week at this site (water flow 18% under normal)'],
    events: [['13:02', 'Water flow dropped below normal (PRC-01)'], ['13:09', 'Mixer load above 90%'], ['13:11', 'HYD-01 raised, drum stopped by edge rule'], ['13:11', 'WhatsApp alert sent to owner and support']] },
  { id: 2, sev: 'critical', code: 'MTR-01', title: 'Engine oil pressure low', machine: 'BMM-160 #0087', site: 'Maa Durga Bricks, Rohtak', state: 'Fault stop', age: 11, status: 'Acknowledged', operator: 'Suresh', fw: 'gw 1.4.2',
    engine: 31, module: 76,
    metric: { name: 'Engine oil pressure', unit: 'bar', base: 3.8, limit: 1.5, shape: 'drop', peak: 0.9 },
    readings: { engine: [['Oil pressure', '0.9 bar', 1], ['Coolant temp', '97 °C', 1], ['RPM', '0 rpm', 0], ['Fuel rate', '0 L/h', 0]],
                module: [['Hydraulic pressure', '0 bar', 0], ['Hydraulic oil temp', '58 °C', 0], ['Mixer load', '0 %', 0], ['Drum speed', '0 cycles/min', 0], ['Drum vs ground sync', '—', 0]] },
    cause: 'Oil pressure fell over 40 seconds while coolant temperature rose. Likely low oil or an oil leak; do not restart the engine.',
    similar: ['Last oil change 412 engine hours ago (due at 250)', 'Coolant level switch normal'],
    events: [['12:55', 'Oil pressure under 2 bar'], ['12:56', 'MTR-01 raised; edge rule stopped engine'], ['12:58', 'Acknowledged by Priya (support)']] },
  { id: 3, sev: 'warning', code: 'DRM-02', title: 'Drum and ground speed out of sync', machine: 'BMM-310 #0019', site: 'Om Sai Bhatta, Karnal', state: 'Producing', age: 26, status: 'New', operator: 'Mahesh', fw: 'gw 1.4.1',
    engine: 90, module: 64,
    metric: { name: 'Drum vs ground speed match', unit: '%', base: 99, limit: 92, shape: 'drift', peak: 86 },
    readings: { engine: [['Oil pressure', '4.1 bar', 0], ['Coolant temp', '85 °C', 0], ['RPM', '1,620 rpm', 0], ['Fuel rate', '9.4 L/h', 0]],
                module: [['Hydraulic pressure', '232 bar', 0], ['Hydraulic oil temp', '66 °C', 0], ['Mixer load', '71 %', 0], ['Drum speed', '21 cycles/min', 0], ['Drum vs ground sync', '86 %', 1]] },
    cause: 'Travel speed is 12% faster than drum speed, so bricks land with gaps. Operator may be driving too fast, or drum drive is slipping.',
    similar: ['Owner reported 4% more broken bricks yesterday', 'No hydraulic faults on drum motor'],
    events: [['12:40', 'Sync under 95%'], ['12:47', 'DRM-02 raised (warning)']] },
  { id: 4, sev: 'warning', code: 'BRG-01', title: 'Drum bearing vibration above baseline', machine: 'BMM-160 #0142', site: 'Shree Ganesh Bhatta, Jhajjar', state: 'Fault stop', age: 180, status: 'Work order', operator: 'Ramesh', fw: 'gw 1.4.2',
    engine: 84, module: 38,
    metric: { name: 'Drum bearing vibration', unit: 'mm/s', base: 3.1, limit: 7.1, shape: 'drift', peak: 8.4 },
    readings: { engine: [['Oil pressure', '3.9 bar', 0], ['Coolant temp', '88 °C', 0], ['RPM', '1,180 rpm', 0], ['Fuel rate', '6.1 L/h', 0]],
                module: [['Hydraulic pressure', '338 bar', 1], ['Hydraulic oil temp', '71 °C', 0], ['Mixer load', '97 %', 1], ['Drum speed', '0 cycles/min', 1], ['Drum bearing vibration', '8.4 mm/s', 1]] },
    cause: 'Vibration has climbed for 9 days. Bearing wear is likely; greasing was last logged 14 days ago.',
    similar: ['Bearing part 6312-2RS from supplier batch B-2207: 2 early failures this season'],
    events: [['Day −9', 'Vibration trend rising'], ['Day −2', 'BRG-01 raised'], ['Today', 'Work order WO-1182 created, technician assigned']] },
  { id: 5, sev: 'warning', code: 'MIX-02', title: 'Mixer load rising over baseline', machine: 'BMM-160 #0231', site: 'Jai Hanuman Bricks, Panipat', state: 'Producing', age: 64, status: 'New', operator: 'Anil', fw: 'gw 1.4.2',
    engine: 88, module: 71,
    metric: { name: 'Mixer load', unit: '%', base: 68, limit: 85, shape: 'drift', peak: 88 },
    readings: { engine: [['Oil pressure', '4.0 bar', 0], ['Coolant temp', '86 °C', 0], ['RPM', '1,600 rpm', 0], ['Fuel rate', '9.9 L/h', 0]],
                module: [['Hydraulic pressure', '248 bar', 0], ['Hydraulic oil temp', '69 °C', 0], ['Mixer load', '88 %', 1], ['Drum speed', '20 cycles/min', 0], ['Water flow', '−11 %', 1]] },
    cause: 'Load is up 20% at the same output. Either the clay is drier (water flow is down) or paddles are worn (1,640 h since fitted).',
    similar: ['Paddle set replaced at 1,800 h on 3 other machines'],
    events: [['11:30', 'Load trend above baseline'], ['12:15', 'MIX-02 raised']] },
  { id: 6, sev: 'warning', code: 'HYD-02', title: 'Hydraulic oil hot', machine: 'BMM-310 #0044', site: 'Baba Ramdev Bhatta, Sonipat', state: 'Producing', age: 38, status: 'Acknowledged', operator: 'Vikram', fw: 'gw 1.4.0',
    engine: 86, module: 62,
    metric: { name: 'Hydraulic oil temperature', unit: '°C', base: 64, limit: 80, shape: 'drift', peak: 83 },
    readings: { engine: [['Oil pressure', '4.2 bar', 0], ['Coolant temp', '90 °C', 0], ['RPM', '1,640 rpm', 0], ['Fuel rate', '10.2 L/h', 0]],
                module: [['Hydraulic pressure', '240 bar', 0], ['Hydraulic oil temp', '83 °C', 1], ['Mixer load', '74 %', 0], ['Drum speed', '22 cycles/min', 0], ['Return filter', 'Clogged', 1]] },
    cause: 'Oil temperature climbs with a clogged return filter. Filter change is the likely fix; cooler fan should also be checked.',
    similar: ['Filter change due in 30 h'],
    events: [['12:20', 'HYD-04 filter clog switch on'], ['12:44', 'HYD-02 raised']] },
  { id: 7, sev: 'info', code: 'PRC-03', title: 'Release agent low', machine: 'BMM-160 #0102', site: 'Shiv Shakti Bricks, Jind', state: 'Producing', age: 15, status: 'New', operator: 'Deepak', fw: 'gw 1.4.2',
    engine: 92, module: 88,
    metric: { name: 'Release agent level', unit: '%', base: 40, limit: 15, shape: 'drop', peak: 12 },
    readings: { engine: [['Oil pressure', '4.0 bar', 0], ['Coolant temp', '84 °C', 0], ['RPM', '1,610 rpm', 0], ['Fuel rate', '9.1 L/h', 0]],
                module: [['Hydraulic pressure', '226 bar', 0], ['Hydraulic oil temp', '65 °C', 0], ['Mixer load', '70 %', 0], ['Drum speed', '22 cycles/min', 0], ['Release agent', '12 %', 1]] },
    cause: 'Tank will run out in about 40 minutes at this rate. Ask operator to refill to avoid stuck bricks.',
    similar: [],
    events: [['12:57', 'PRC-03 raised; WhatsApp sent to operator']] },
  { id: 8, sev: 'info', code: 'SRV-01', title: 'Service due: engine oil', machine: 'BMM-310 #0019', site: 'Om Sai Bhatta, Karnal', state: 'Producing', age: 300, status: 'Scheduled', operator: 'Mahesh', fw: 'gw 1.4.1',
    engine: 90, module: 64,
    metric: { name: 'Engine hours since oil change', unit: 'h', base: 230, limit: 250, shape: 'drift', peak: 252 },
    readings: { engine: [['Oil pressure', '4.1 bar', 0], ['Coolant temp', '85 °C', 0], ['RPM', '1,620 rpm', 0], ['Engine hours', '3,412 h', 0]],
                module: [['Hydraulic pressure', '232 bar', 0], ['Hydraulic oil temp', '66 °C', 0], ['Mixer load', '71 %', 0], ['Drum speed', '21 cycles/min', 0], ['Mould cycles', '61,200', 0]] },
    cause: 'Routine service by engine hours. Book with the next site visit.',
    similar: [],
    events: [['Today', 'SRV-01 raised']] }
];

const fleetStates = [
  ['Producing', 96, 'var(--good)'], ['Idle', 21, 'var(--series-7)'], ['Travel', 8, 'var(--series-1)'],
  ['Fault stop', 4, 'var(--critical)'], ['Offline', 9, 'var(--text-muted)'], ['Off-season', 12, 'var(--grid)']
];

const cmdLog = [
  { t: '12:31', m: 'BMM-310 #0044', c: 'Request fresh 5-min snapshot', r: 'Check hydraulic temp trend', by: 'Priya', res: 'Acked' },
  { t: '11:05', m: 'BMM-160 #0231', c: 'Reset alarm after inspection', r: 'Operator cleared stone from chute', by: 'Rahul', res: 'Acked' },
  { t: '09:48', m: 'BMM-160 #0102', c: 'OTA firmware gw 1.4.2', r: 'Ring 2 rollout', by: 'System', res: 'Installed' }
];

// ---------- Helpers ----------
const $ = s => document.querySelector(s);
const sevRank = { critical: 0, warning: 1, info: 2 };
const sevLabel = { critical: 'Critical', warning: 'Warning', info: 'Info' };
const sevIcon = { critical: '!', warning: '!', info: 'i' };
const fmtAge = m => m < 60 ? m + ' min' : m < 1440 ? Math.round(m / 60) + ' h' : Math.round(m / 1440) + ' d';
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function sevBadge(sev) { return `<span class="sev ${sev}"><span class="dot">${sevIcon[sev]}</span>${sevLabel[sev]}</span>`; }

let filter = 'all', query = '', selectedId = faults[0].id;

// ---------- Queue ----------
function renderQueue() {
  const rows = faults
    .filter(f => f.status !== 'Closed')
    .filter(f => filter === 'all' || f.sev === filter)
    .filter(f => !query || (f.code + f.title + f.machine + f.site).toLowerCase().includes(query))
    .sort((a, b) => sevRank[a.sev] - sevRank[b.sev] || a.age - b.age);
  $('#queue').innerHTML = rows.map(f => `
    <tr data-id="${f.id}" class="${f.id === selectedId ? 'selected' : ''}" tabindex="0">
      <td>${sevBadge(f.sev)}</td>
      <td><div class="code">${f.code}</div><div class="muted">${esc(f.title)}</div></td>
      <td><div>${esc(f.machine)}</div><div class="muted">${esc(f.site)}</div></td>
      <td class="hide-sm">${esc(f.state)}</td>
      <td style="font-variant-numeric:tabular-nums">${fmtAge(f.age)}</td>
      <td class="hide-sm"><span class="pill ${f.status === 'Acknowledged' ? 'ack' : ''}">${f.status}</span></td>
    </tr>`).join('');
  $('#empty').hidden = rows.length > 0;
  document.querySelectorAll('#queue tr').forEach(tr => {
    const pick = () => { selectedId = +tr.dataset.id; renderQueue(); renderDetail(); };
    tr.addEventListener('click', pick);
    tr.addEventListener('keydown', e => { if (e.key === 'Enter') pick(); });
  });
  const open = faults.filter(f => f.status !== 'Scheduled' && f.status !== 'Closed');
  const crit = open.filter(f => f.sev === 'critical').length;
  $('#kpiOpen').textContent = open.length;
  $('#kpiOpenMeta').textContent = `${crit} critical · ${open.filter(f => f.sev === 'warning').length} warning`;
  $('#navCount').textContent = crit;
}

// ---------- Snapshot series (10 min at 10 s, fault at minute 5) ----------
function series(metric, seed) {
  const n = 61, out = [];
  for (let i = 0; i < n; i++) {
    const noise = Math.sin(i * 1.7 + seed) * 0.02 + Math.sin(i * 0.53 + seed * 2) * 0.015;
    let v = metric.base * (1 + noise);
    const t = (i - 22) / 8;
    if (metric.shape === 'spike' && i > 22) v = metric.base + (metric.peak - metric.base) * Math.min(1, t) * (i > 30 ? 1 - (i - 30) * 0.004 : 1);
    if (metric.shape === 'drop' && i > 22) v = metric.base + (metric.peak - metric.base) * Math.min(1, t);
    if (metric.shape === 'drift') v = metric.base + (metric.peak - metric.base) * (i / (n - 1)) ** 1.6 + metric.base * noise;
    out.push(+v.toFixed(metric.base < 10 ? 2 : 1));
  }
  return out;
}
function rpmSeries(f, seed) {
  const stops = f.state === 'Fault stop';
  return Array.from({ length: 61 }, (_, i) => {
    const base = 1620 + Math.sin(i * 0.9 + seed) * 25;
    if (!stops || i < 30) return Math.round(base);
    return f.code === 'MTR-01' ? 0 : Math.round(1180 + Math.sin(i + seed) * 15);
  });
}

function lineChart({ el, data, unit, limit, title, color, faultAt }) {
  const W = 560, H = 150, m = { l: 40, r: 12, t: 10, b: 22 };
  const vals = limit != null ? data.concat([limit]) : data;
  let lo = Math.min(...vals), hi = Math.max(...vals);
  const pad = (hi - lo) * 0.15 || 1; lo = Math.max(0, lo - pad); hi = hi + pad;
  const x = i => m.l + (i / (data.length - 1)) * (W - m.l - m.r);
  const y = v => m.t + (1 - (v - lo) / (hi - lo)) * (H - m.t - m.b);
  const ticks = [lo, (lo + hi) / 2, hi];
  const d = data.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join('');
  const fmt = v => v >= 100 ? Math.round(v) : v.toFixed(1);
  const timeLabel = i => { const s = (i - 30) * 10; return (s === 0 ? 'fault' : (s > 0 ? '+' : '−') + Math.abs(s / 60).toFixed(s % 60 ? 1 : 0) + ' min'); };
  el.innerHTML = `
    <div class="chart-title"><span>${esc(title)} (${esc(unit)})</span><span>${limit != null ? 'Limit ' + fmt(limit) + ' ' + esc(unit) : ''}</span></div>
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(title)} for 5 minutes before and after the fault">
      <g class="axis">
        ${ticks.map(t => `<line x1="${m.l}" x2="${W - m.r}" y1="${y(t)}" y2="${y(t)}" stroke="var(--grid)"/><text x="${m.l - 6}" y="${y(t) + 3}" text-anchor="end">${fmt(t)}</text>`).join('')}
        ${[0, 15, 30, 45, 60].map(i => `<text x="${x(i)}" y="${H - 6}" text-anchor="${i === 0 ? 'start' : i === 60 ? 'end' : 'middle'}">${timeLabel(i)}</text>`).join('')}
      </g>
      ${limit != null ? `<line x1="${m.l}" x2="${W - m.r}" y1="${y(limit)}" y2="${y(limit)}" stroke="var(--text-muted)" stroke-dasharray="4 4"/>` : ''}
      ${faultAt != null ? `<line x1="${x(faultAt)}" x2="${x(faultAt)}" y1="${m.t}" y2="${H - m.b}" stroke="var(--critical)" stroke-width="1.5"/>` : ''}
      <path d="${d}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
      <line class="xh" y1="${m.t}" y2="${H - m.b}" stroke="var(--text-secondary)" stroke-width="1" opacity="0"/>
      <circle class="xp" r="4.5" fill="${color}" stroke="var(--surface)" stroke-width="2" opacity="0"/>
      <rect class="hit" x="${m.l}" y="0" width="${W - m.l - m.r}" height="${H}" fill="transparent"/>
    </svg>
    <div class="tooltip"></div>`;
  const svg = el.querySelector('svg'), tip = el.querySelector('.tooltip'), xh = el.querySelector('.xh'), xp = el.querySelector('.xp');
  const move = evt => {
    const r = svg.getBoundingClientRect();
    const px = ((evt.touches ? evt.touches[0].clientX : evt.clientX) - r.left) / r.width * W;
    const i = Math.max(0, Math.min(data.length - 1, Math.round((px - m.l) / (W - m.l - m.r) * (data.length - 1))));
    xh.setAttribute('x1', x(i)); xh.setAttribute('x2', x(i)); xh.setAttribute('opacity', 1);
    xp.setAttribute('cx', x(i)); xp.setAttribute('cy', y(data[i])); xp.setAttribute('opacity', 1);
    tip.innerHTML = `<b>${fmt(data[i])} ${esc(unit)}</b> · ${timeLabel(i)}`;
    tip.style.left = (x(i) / W * r.width) + 'px';
    tip.style.top = (y(data[i]) / H * r.height) + 'px';
    tip.style.opacity = 1;
  };
  const leave = () => { tip.style.opacity = 0; xh.setAttribute('opacity', 0); xp.setAttribute('opacity', 0); };
  const hit = el.querySelector('.hit');
  hit.addEventListener('mousemove', move); hit.addEventListener('touchmove', move, { passive: true });
  hit.addEventListener('mouseleave', leave); hit.addEventListener('touchend', leave);
}

// ---------- Detail ----------
function renderDetail() {
  const f = faults.find(x => x.id === selectedId);
  if (!f) { $('#detail').innerHTML = '<div class="empty">Select a fault</div>'; return; }
  const meter = v => `<div class="meter"><span style="width:${v}%"></span></div>`;
  const reading = ([k, v, out]) => `<div class="reading ${out ? 'out' : ''}"><span>${esc(k)}</span><b>${esc(v)}</b></div>`;
  $('#detail').innerHTML = `
    <div class="detail-head">
      <div class="detail-title">${sevBadge(f.sev)}<span class="code">${f.code}</span><h3>${esc(f.title)}</h3></div>
      <div class="detail-meta">
        <div><span>Machine</span><b>${esc(f.machine)}</b></div>
        <div><span>Site</span><b>${esc(f.site)}</b></div>
        <div><span>State</span><b>${esc(f.state)}</b></div>
        <div><span>Opened</span><b>${fmtAge(f.age)} ago</b></div>
        <div><span>Operator</span><b>${esc(f.operator)}</b></div>
        <div><span>Firmware</span><b>${esc(f.fw)}</b></div>
      </div>
    </div>
    <div class="section">
      <h4>Health score</h4>
      <div class="health">
        <div class="health-box"><div class="muted">Engine</div><div class="num">${f.engine}<span class="muted"> / 100</span></div>${meter(f.engine)}</div>
        <div class="health-box"><div class="muted">Brick-making module</div><div class="num">${f.module}<span class="muted"> / 100</span></div>${meter(f.module)}</div>
      </div>
    </div>
    <div class="section">
      <h4>Fault snapshot · 5 min before and after</h4>
      <div class="chart" id="chartA"></div>
      <div class="chart" id="chartB"></div>
      <div class="legend-line"><span><i style="border-color:var(--critical)"></i>Fault time</span><span><i style="border-color:var(--text-muted);border-top-style:dashed"></i>Limit</span></div>
    </div>
    <div class="section">
      <h4>Latest readings</h4>
      <div class="readings">
        <div><h5>Engine</h5>${f.readings.engine.map(reading).join('')}</div>
        <div><h5>Brick-making module</h5>${f.readings.module.map(reading).join('')}</div>
      </div>
    </div>
    <div class="section">
      <h4>Likely cause</h4>
      <div class="cause">${esc(f.cause)}${f.similar.length ? `<ul>${f.similar.map(s => `<li>${esc(s)}</li>`).join('')}</ul>` : ''}</div>
    </div>
    <div class="section">
      <h4>Actions</h4>
      <div class="actions">
        <button class="btn" id="ackBtn" ${f.status !== 'New' ? 'disabled style="opacity:.5;cursor:default"' : ''}>Acknowledge</button>
        <button class="btn primary" id="remoteBtn">Remote command…</button>
        <button class="btn" id="woBtn">Create work order</button>
        <button class="btn" id="callBtn">Call operator</button>
        <button class="btn danger" id="escBtn">Escalate</button>
      </div>
    </div>
    <div class="section">
      <h4>Timeline</h4>
      <ul class="timeline">${f.events.map(([t, e]) => `<li><time>${esc(t)}</time><span>${esc(e)}</span></li>`).join('')}</ul>
    </div>`;
  lineChart({ el: $('#chartA'), data: series(f.metric, f.id), unit: f.metric.unit, limit: f.metric.limit, title: f.metric.name, color: 'var(--series-1)', faultAt: 30 });
  lineChart({ el: $('#chartB'), data: rpmSeries(f, f.id), unit: 'rpm', limit: null, title: 'Engine speed', color: 'var(--series-1)', faultAt: 30 });

  $('#ackBtn').onclick = () => { if (f.status === 'New') { f.status = 'Acknowledged'; f.events.push(['now', 'Acknowledged by you']); renderQueue(); renderDetail(); toast('Fault acknowledged'); } };
  $('#remoteBtn').onclick = () => openModal(f);
  $('#woBtn').onclick = () => { f.status = 'Work order'; workOrders.unshift({ id: 'WO-' + (++woSeq), m: f.machine, code: f.code, task: f.title + ' — likely cause attached', tech: 'Unassigned', due: 'New', stage: 'Open', parts: '—' }); updateCounts(); f.events.push(['now', 'Work order created with likely cause attached']); renderQueue(); renderDetail(); toast('Work order created — see Work orders'); };
  $('#callBtn').onclick = () => toast(`Calling operator ${f.operator}… (demo)`);
  $('#escBtn').onclick = () => { f.events.push(['now', 'Escalated to L3 engineering']); renderDetail(); toast('Escalated to L3 engineering'); };
}

// ---------- Fleet states ----------
function renderStates() {
  const total = fleetStates.reduce((s, x) => s + x[1], 0);
  $('#states').innerHTML = fleetStates.map(([t, n, c]) => `<div class="state"><div class="t"><span style="display:inline-block;width:8px;height:8px;border-radius:2px;background:${c};margin-right:6px"></span>${t}</div><div class="n">${n}</div><div class="muted">${Math.round(n / total * 100)}%</div></div>`).join('');
  $('#stateBar').innerHTML = fleetStates.map(([t, n, c]) => `<span title="${t}: ${n}" style="flex:${n};background:${c}"></span>`).join('');
}

// ---------- Command log ----------
function renderLog() {
  $('#cmdlog').innerHTML = cmdLog.map(c => `<tr style="cursor:default"><td style="font-variant-numeric:tabular-nums">${esc(c.t)}</td><td>${esc(c.m)}</td><td>${esc(c.c)}</td><td class="hide-sm muted">${esc(c.r)}</td><td>${esc(c.by)}</td><td>${c.res === 'Pending approval' || c.res === 'Sending…' ? `<span class="pill">${c.res}</span>` : `<span class="sev good"><span class="dot">✓</span>${esc(c.res)}</span>`}</td></tr>`).join('');
}

// ---------- Modal ----------
let modalFault = null;
function openModal(f) {
  modalFault = f;
  $('#modalMachine').textContent = `${f.machine} · ${f.site} · state: ${f.state}`;
  $('#cmdReason').value = ''; $('#operatorOk').checked = false;
  updateRisk();
  $('#modalBg').classList.add('open');
  $('#cmdReason').focus();
}
function updateRisk() { $('#riskBox').hidden = $('#cmdSelect').selectedOptions[0].dataset.risk !== 'high'; }
$('#cmdSelect').addEventListener('change', updateRisk);
$('#cancelCmd').onclick = () => $('#modalBg').classList.remove('open');
$('#modalBg').addEventListener('click', e => { if (e.target.id === 'modalBg') $('#modalBg').classList.remove('open'); });
$('#sendCmd').onclick = () => {
  const reason = $('#cmdReason').value.trim();
  if (!reason) { toast('Add a reason — it goes in the audit log'); return; }
  if (!$('#operatorOk').checked) { toast('Confirm the operator is informed and clear'); return; }
  const opt = $('#cmdSelect').selectedOptions[0];
  const high = opt.dataset.risk === 'high';
  const now = new Date();
  const entry = { t: now.toTimeString().slice(0, 5), m: modalFault.machine, c: opt.textContent, r: reason, by: 'You', res: high ? 'Pending approval' : 'Sending…' };
  cmdLog.unshift(entry); renderLog();
  modalFault.events.push(['now', `Remote command: ${opt.textContent}${high ? ' (awaiting approval)' : ''}`]); renderDetail();
  $('#modalBg').classList.remove('open');
  toast(high ? 'Sent for second-engineer approval' : 'Command sent to gateway');
  updateCounts();
  if (!high) setTimeout(() => { entry.res = 'Acked'; renderLog(); }, 1500);
};

// ---------- Filters, search, clock ----------
document.querySelectorAll('.chip').forEach(c => c.addEventListener('click', () => {
  document.querySelectorAll('.chip').forEach(x => x.classList.remove('active'));
  c.classList.add('active'); filter = c.dataset.f; renderQueue();
}));
$('#search').addEventListener('input', e => { query = e.target.value.trim().toLowerCase(); renderQueue(); });
let toastTimer;
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2200); }
let apiState = 'checking API…';
async function checkApi() {
  const cfg = window.APP_CONFIG || {};
  try {
    const r = await fetch(cfg.apiBase + '/health', { cache: 'no-store' });
    const j = await r.json();
    apiState = j.ok ? (j.mode === 'demo' ? 'demo data' : 'API connected') : 'API error';
  } catch (e) { apiState = 'offline · demo data'; }
}
checkApi(); setInterval(checkApi, 60000);
setInterval(() => { $('#clock').textContent = 'Live · ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' · ' + apiState; }, 1000);

// ================= Shared fleet data =================
function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const towns = { Jhajjar: [28.61, 76.65], Rohtak: [28.89, 76.61], Karnal: [29.69, 76.99], Sonipat: [28.99, 77.02], Panipat: [29.39, 76.97], Jind: [29.32, 76.31], Hisar: [29.15, 75.72], Bhiwani: [28.79, 76.13], Rewari: [28.18, 76.62], Kurukshetra: [29.97, 76.85], Kaithal: [29.80, 76.40], Yamunanagar: [30.13, 77.29] };
const stateColor = { 'Producing': 'var(--good)', 'Idle': 'var(--series-7)', 'Travel': 'var(--series-1)', 'Fault stop': 'var(--critical)', 'Offline': 'var(--text-muted)', 'Off-season': 'var(--grid)' };
const stateList = Object.keys(stateColor);
const machines = [
  { id: 'BMM-160 #0142', site: 'Shree Ganesh Bhatta', town: 'Jhajjar', state: 'Fault stop', engine: 84, module: 38 },
  { id: 'BMM-160 #0087', site: 'Maa Durga Bricks', town: 'Rohtak', state: 'Fault stop', engine: 31, module: 76 },
  { id: 'BMM-310 #0019', site: 'Om Sai Bhatta', town: 'Karnal', state: 'Producing', engine: 90, module: 64 },
  { id: 'BMM-310 #0044', site: 'Baba Ramdev Bhatta', town: 'Sonipat', state: 'Producing', engine: 86, module: 62 },
  { id: 'BMM-160 #0231', site: 'Jai Hanuman Bricks', town: 'Panipat', state: 'Producing', engine: 88, module: 71 },
  { id: 'BMM-160 #0102', site: 'Shiv Shakti Bricks', town: 'Jind', state: 'Producing', engine: 92, module: 88 }
];
(function genMachines() {
  const r = rng(7), names = ['Laxmi', 'Ganga', 'Bharat', 'Krishna', 'Shakti', 'Guru Nanak', 'Balaji', 'Sun', 'Royal', 'Kisan', 'Ambika', 'Vijay', 'Prem', 'Satyam', 'Durga', 'Shyam', 'Raja', 'Sai'];
  const tlist = Object.keys(towns), states = ['Producing', 'Producing', 'Producing', 'Producing', 'Idle', 'Idle', 'Travel', 'Offline', 'Off-season', 'Offline'];
  for (let i = 0; i < 18; i++) {
    const st = i === 9 ? 'Producing' : states[Math.floor(r() * states.length)];
    machines.push({ id: (r() > .5 ? 'BMM-310 #' : 'BMM-160 #') + String(300 + Math.floor(r() * 600)).padStart(4, '0'), site: names[i] + ' ' + (r() > .5 ? 'Bricks' : 'Bhatta'), town: tlist[Math.floor(r() * tlist.length)], state: st, engine: 55 + Math.floor(r() * 44), module: 45 + Math.floor(r() * 54) });
  }
  const r2 = rng(11);
  machines.forEach((m, i) => {
    const producing = m.state === 'Producing';
    m.rated = m.id.startsWith('BMM-310') ? 12000 : 6000;
    m.bricks = m.state === 'Off-season' || m.state === 'Offline' ? 0 : Math.round((producing ? 0.55 + r2() * 0.35 : 0.1 + r2() * 0.3) * m.rated * 6 / 100) * 100;
    m.fuel = m.bricks ? +(1.4 + r2() * 0.9).toFixed(2) : null;
    m.seen = m.state === 'Offline' ? Math.floor(3 + r2() * 40) * 60 : m.state === 'Off-season' ? 1440 * 3 : Math.floor(r2() * 2);
    m.fw = ['gw 1.4.2', 'gw 1.4.2', 'gw 1.4.2', 'gw 1.4.1', 'gw 1.4.0', 'gw 1.5.0-rc1'][Math.floor(r2() * 6)];
    const p = towns[m.town]; m.lat = p[0] + (r2() - .5) * 0.18; m.lon = p[1] + (r2() - .5) * 0.18;
    m.wear = [
      ['Moulds', Math.floor(20000 + r2() * 62000), 80000, 'cycles'],
      ['Pug mill paddles', Math.floor(300 + r2() * 1600), 1800, 'h'],
      ['Scrapers', Math.floor(10000 + r2() * 52000), 60000, 'cycles'],
      ['Hydraulic filter', Math.floor(50 + r2() * 460), 500, 'h'],
      ['Engine oil', Math.floor(20 + r2() * 260), 250, 'h'],
      ['Bearings since greasing', Math.floor(1 + r2() * 16), 14, 'days']
    ];
  });
  // keep demo faults consistent
  machines.slice(0, 6).forEach(m => { const f = faults.find(x => x.machine === m.id); if (f) m.fw = f.fw; });
  const m0 = machines[0]; m0.wear[5][1] = 14; const m1 = machines[1]; m1.wear[4][1] = 412; machines[2].wear[4][1] = 252; machines[4].wear[1][1] = 1640; machines[3].wear[3][1] = 470;
})();
const fmtSeen = m => m === 0 ? 'now' : fmtAge(m) + ' ago';
const fmtN = n => n == null ? '—' : n.toLocaleString('en-IN');
function healthCell(v) { const st = v < 50 ? 'critical' : v < 70 ? 'warning' : 'good'; return `<div class="mini-meter"><b>${v}</b><div class="meter"><span style="width:${v}%;background:var(--${st === 'good' ? 'series-1' : st})"></span></div></div>`; }
function stateBadge(s) { return `<span class="sev"><span class="dot" style="background:${stateColor[s]};${s === 'Off-season' ? 'border:1px solid var(--text-muted)' : ''}"></span>${s}</span>`; }

// ================= Router =================
const titles = { 'faults': 'Fault queue', 'fleet-map': 'Fleet map', 'machines': 'Machines', 'work-orders': 'Work orders', 'remote-actions': 'Remote actions', 'firmware': 'Firmware (OTA)', 'reports': 'Reports' };
const renderers = {};
function show(view) {
  if (!titles[view]) view = 'faults';
  if (typeof applyRole === 'function') applyRole(fieldViews.includes(view) ? 'field' : 'support');
  if (view !== 'my-jobs' && typeof stopBle === 'function') stopBle();
  document.querySelectorAll('.view').forEach(v => v.hidden = v.dataset.view !== view);
  document.querySelectorAll('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.view === view));
  $('#viewTitle').textContent = titles[view];
  if (renderers[view]) renderers[view]();
  window.scrollTo(0, 0);
}
document.querySelectorAll('.nav-item[data-view]').forEach(b => b.addEventListener('click', () => { if (location.hash !== '#' + b.dataset.view) location.hash = b.dataset.view; else show(b.dataset.view); }));
window.addEventListener('hashchange', () => show(location.hash.slice(1)));

function chipRow(el, items, active, onPick) {
  el.innerHTML = items.map(i => `<button class="chip ${i === active ? 'active' : ''}" data-v="${esc(i)}">${esc(i)}</button>`).join('');
  el.querySelectorAll('.chip').forEach(c => c.onclick = () => onPick(c.dataset.v));
}

// ================= Fleet map =================
let mapFilter = 'All', mapSel = null;
renderers['fleet-map'] = function () {
  chipRow($('#mapChips'), ['All', 'Producing', 'Fault stop', 'Idle', 'Offline'], mapFilter, v => { mapFilter = v; renderers['fleet-map'](); });
  const X = lon => 40 + (lon - 75.45) / (77.55 - 75.45) * 720, Y = lat => 30 + (30.35 - lat) / (30.35 - 27.95) * 460;
  const list = machines.filter(m => mapFilter === 'All' || m.state === mapFilter);
  let g = '';
  for (let i = 0; i <= 8; i++) g += `<line x1="${40 + i * 90}" x2="${40 + i * 90}" y1="30" y2="490" stroke="var(--grid)"/>`;
  for (let i = 0; i <= 5; i++) g += `<line x1="40" x2="760" y1="${30 + i * 92}" y2="${30 + i * 92}" stroke="var(--grid)"/>`;
  const tw = Object.entries(towns).map(([n, [la, lo]]) => `<text class="town" x="${X(lo)}" y="${Y(la) - 14}" text-anchor="middle">${n}</text>`).join('');
  const order = list.slice().sort((a, b) => (a.state === 'Fault stop') - (b.state === 'Fault stop'));
  const dots = order.map(m => {
    const i = machines.indexOf(m), sel = mapSel === i, fault = m.state === 'Fault stop';
    return `<g class="dot-site" data-i="${i}" tabindex="0">
      <circle cx="${X(m.lon)}" cy="${Y(m.lat)}" r="16" fill="transparent"/>
      ${fault ? `<circle cx="${X(m.lon)}" cy="${Y(m.lat)}" r="13" fill="none" stroke="var(--critical)" stroke-width="1.5" opacity=".5"/>` : ''}
      <circle cx="${X(m.lon)}" cy="${Y(m.lat)}" r="${sel ? 9 : 7}" fill="${stateColor[m.state]}" stroke="${sel ? 'var(--text-primary)' : 'var(--surface)'}" stroke-width="2"/>
    </g>`;
  }).join('');
  $('#mapSvg').innerHTML = g + dots + tw;
  const tip = $('#mapTip');
  $('#mapSvg').querySelectorAll('.dot-site').forEach(el => {
    const m = machines[+el.dataset.i];
    el.onclick = () => { mapSel = +el.dataset.i; renderers['fleet-map'](); };
    el.onkeydown = e => { if (e.key === 'Enter') el.onclick(); };
    el.onmouseenter = () => { const r = $('#mapSvg').getBoundingClientRect(); tip.innerHTML = `<b>${esc(m.id)}</b> · ${esc(m.state)}<br>${esc(m.site)}, ${esc(m.town)}`; tip.style.left = (X(m.lon) / 800 * r.width + 16) + 'px'; tip.style.top = (Y(m.lat) / 520 * r.height + 16) + 'px'; tip.style.opacity = 1; };
    el.onmouseleave = () => tip.style.opacity = 0;
  });
  $('#mapLegend').innerHTML = stateList.map(s => `<span><i style="background:${stateColor[s]};${s === 'Off-season' ? 'outline:1px solid var(--text-muted)' : ''}"></i>${s} (${machines.filter(m => m.state === s).length})</span>`).join('');
  const side = $('#mapSide');
  if (mapSel != null) {
    const m = machines[mapSel], f = faults.filter(x => x.machine === m.id && x.status !== 'Scheduled');
    side.innerHTML = `<div class="card-head"><h2>${esc(m.id)}</h2>${stateBadge(m.state)}</div>
      <div class="section"><div class="muted">${esc(m.site)}, ${esc(m.town)} · last seen ${fmtSeen(m.seen)}</div>
        <div class="health" style="margin-top:10px"><div class="health-box"><div class="muted">Engine</div><div class="num">${m.engine}</div></div><div class="health-box"><div class="muted">Module</div><div class="num">${m.module}</div></div></div>
        <div class="reading"><span>Bricks today</span><b>${fmtN(m.bricks)}</b></div>
        <div class="reading"><span>Open faults</span><b>${f.length ? f.map(x => x.code).join(', ') : 'None'}</b></div></div>
      <div class="section actions"><button class="btn primary" id="mapOpen">Machine detail</button>${f.length ? '<button class="btn" id="mapFault">Open fault</button>' : ''}<button class="btn" id="mapBack">All sites</button></div>`;
    $('#mapOpen').onclick = () => openMachine(m);
    if (f.length) $('#mapFault').onclick = () => { selectedId = f[0].id; location.hash = 'faults'; renderQueue(); renderDetail(); };
    $('#mapBack').onclick = () => { mapSel = null; renderers['fleet-map'](); };
  } else {
    const faulty = machines.filter(m => m.state === 'Fault stop' || m.state === 'Offline');
    side.innerHTML = `<div class="card-head"><h2>Needs attention</h2><span class="hint">${faulty.length} machines</span></div>
      <ul class="side-list">${faulty.map(m => `<li data-i="${machines.indexOf(m)}">${stateBadge(m.state)}<div><b>${esc(m.id)}</b></div><div class="muted">${esc(m.site)}, ${esc(m.town)} · ${fmtSeen(m.seen)}</div></li>`).join('')}</ul>`;
    side.querySelectorAll('li').forEach(li => li.onclick = () => { mapSel = +li.dataset.i; renderers['fleet-map'](); });
  }
};

// ================= Machines =================
let mFilter = 'All', mSort = { k: 'module', asc: true };
renderers['machines'] = function () {
  chipRow($('#mChips'), ['All'].concat(stateList), mFilter, v => { mFilter = v; renderers.machines(); });
  const q = query;
  let list = machines.filter(m => (mFilter === 'All' || m.state === mFilter) && (!q || (m.id + m.site + m.town).toLowerCase().includes(q)));
  const k = mSort.k;
  list.sort((a, b) => { const av = k === 'site' ? a.site + a.town : a[k], bv = k === 'site' ? b.site + b.town : b[k]; const c = (av ?? -1) > (bv ?? -1) ? 1 : (av ?? -1) < (bv ?? -1) ? -1 : 0; return mSort.asc ? c : -c; });
  $('#mCountHint').textContent = `${list.length} of ${machines.length} shown`;
  $('#mBody').innerHTML = list.map(m => `<tr data-i="${machines.indexOf(m)}" tabindex="0">
    <td><b>${esc(m.id)}</b></td><td>${esc(m.site)}<div class="muted">${esc(m.town)}</div></td><td>${stateBadge(m.state)}</td>
    <td>${healthCell(m.engine)}</td><td>${healthCell(m.module)}</td>
    <td class="num">${fmtN(m.bricks)}</td><td class="num hide-sm">${m.fuel ? m.fuel.toFixed(2) + ' L' : '—'}</td>
    <td class="hide-sm">${fmtSeen(m.seen)}</td><td class="hide-sm">${esc(m.fw)}</td></tr>`).join('');
  $('#mBody').querySelectorAll('tr').forEach(tr => { tr.onclick = () => openMachine(machines[+tr.dataset.i]); tr.onkeydown = e => { if (e.key === 'Enter') tr.onclick(); }; });
  document.querySelectorAll('.sortable th').forEach(th => { th.classList.toggle('sorted', th.dataset.k === mSort.k); th.classList.toggle('asc', th.dataset.k === mSort.k && mSort.asc);
    th.onclick = () => { mSort = { k: th.dataset.k, asc: mSort.k === th.dataset.k ? !mSort.asc : true }; renderers.machines(); }; });
};
$('#search').addEventListener('input', () => { if (!$('[data-view="machines"].view').hidden) renderers.machines(); });

function openMachine(m) {
  const f = faults.filter(x => x.machine === m.id && x.status !== 'Scheduled');
  const wear = m.wear.map(([n, used, lim, u]) => { const pct = Math.min(100, Math.round(used / lim * 100)); const st = pct >= 100 ? 'critical' : pct >= 80 ? 'warning' : null;
    return `<div class="wear"><div>${esc(n)}<div class="muted">${fmtN(used)} / ${fmtN(lim)} ${u}${st ? ` · <span class="${st === 'critical' ? '' : 'warn-txt'}" style="${st === 'critical' ? 'color:var(--critical)' : ''}">${st === 'critical' ? '▲ Overdue' : '▲ Due soon'}</span>` : ''}</div></div><div class="meter"><span style="width:${pct}%;background:var(--${st || 'series-1'})"></span></div></div>`; }).join('');
  $('#drawer').innerHTML = `<button class="close" aria-label="Close">✕</button>
    <div class="detail-head"><div class="detail-title"><h3>${esc(m.id)}</h3>${stateBadge(m.state)}</div>
      <div class="detail-meta"><div><span>Site</span><b>${esc(m.site)}</b></div><div><span>Town</span><b>${esc(m.town)}</b></div><div><span>Last seen</span><b>${fmtSeen(m.seen)}</b></div>
      <div><span>Rated output</span><b>${fmtN(m.rated)} / h</b></div><div><span>Firmware</span><b>${esc(m.fw)}</b></div><div><span>Fuel / 1k bricks</span><b>${m.fuel ? m.fuel.toFixed(2) + ' L' : '—'}</b></div></div></div>
    <div class="section"><h4>Health score</h4><div class="health"><div class="health-box"><div class="muted">Engine</div><div class="num">${m.engine}<span class="muted"> / 100</span></div><div class="meter"><span style="width:${m.engine}%"></span></div></div><div class="health-box"><div class="muted">Brick-making module</div><div class="num">${m.module}<span class="muted"> / 100</span></div><div class="meter"><span style="width:${m.module}%"></span></div></div></div></div>
    <div class="section"><h4>Open faults</h4>${f.length ? f.map(x => `<div class="reading"><span>${sevBadge(x.sev)} <span class="code">${x.code}</span> ${esc(x.title)}</span></div>`).join('') : '<div class="muted">None</div>'}</div>
    <div class="section"><h4>Wear parts and service</h4>${wear}</div>
    <div class="section actions"><button class="btn primary" id="dWo">Create work order</button><button class="btn" id="dCmd">Remote command…</button></div>`;
  $('#drawerBg').classList.add('open');
  $('#drawer .close').onclick = closeDrawer;
  $('#dWo').onclick = () => { closeDrawer(); openWoModal(m.id); };
  $('#dCmd').onclick = () => { closeDrawer(); openModal({ machine: m.id, site: m.site + ', ' + m.town, state: m.state, events: [] }); };
}
function closeDrawer() { $('#drawerBg').classList.remove('open'); }
$('#drawerBg').addEventListener('click', e => { if (e.target.id === 'drawerBg') closeDrawer(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeDrawer(); $('#modalBg').classList.remove('open'); $('#woModalBg').classList.remove('open'); } });

// ================= Work orders =================
const woStages = ['Open', 'Assigned', 'In progress', 'Waiting for parts', 'Done'];
let woSeq = 1190;
const workOrders = [
  { id: 'WO-1182', m: 'BMM-160 #0142', code: 'BRG-01', task: 'Replace drum bearing (6312-2RS)', tech: 'Ajay (Rohtak)', due: 'Today', stage: 'In progress', parts: 'Bearing ×1' },
  { id: 'WO-1185', m: 'BMM-310 #0044', code: 'HYD-04', task: 'Change hydraulic return filter', tech: 'Naveen (Karnal)', due: 'Tomorrow', stage: 'Assigned', parts: 'Filter element ×1' },
  { id: 'WO-1179', m: 'BMM-160 #0231', code: 'MIX-02', task: 'Inspect pug mill paddles', tech: 'Naveen (Karnal)', due: '18 Nov', stage: 'Waiting for parts', parts: 'Paddle set ×1' },
  { id: 'WO-1187', m: 'BMM-310 #0019', code: 'SRV-01', task: 'Engine oil and filter change', tech: 'Unassigned', due: '19 Nov', stage: 'Open', parts: 'Oil 15 L, filter' },
  { id: 'WO-1188', m: 'BMM-310 #0019', code: 'DRM-02', task: 'Check drum drive slip; brief operator on speed', tech: 'Unassigned', due: '18 Nov', stage: 'Open', parts: '—' },
  { id: 'WO-1171', m: 'BMM-160 #0102', code: 'MTR-02', task: 'Fix loose phase connection', tech: 'Sunil (Hisar)', due: 'Done 14 Nov', stage: 'Done', parts: 'Lug ×2', rca: true },
  { id: 'WO-1168', m: 'BMM-160 #0087', code: 'HYD-01', task: 'Clear chute jam, check relief valve', tech: 'Ajay (Rohtak)', due: 'Done 12 Nov', stage: 'Done', parts: '—', rca: false }
];
renderers['work-orders'] = function () {
  $('#kanban').innerHTML = woStages.map(st => {
    const cards = workOrders.filter(w => w.stage === st);
    return `<div class="col"><h3>${st}<span class="muted">${cards.length}</span></h3>${cards.map(w => `
      <div class="wo"><div class="top"><span class="code">${w.id}</span><span class="pill">${esc(w.code)}</span></div>
      <div><b>${esc(w.task)}</b></div><div class="muted">${esc(w.m)}</div>
      <div class="muted">Parts: ${esc(w.parts)}</div>
      <div class="foot"><span class="muted">${esc(w.tech)} · ${esc(w.due)}</span>
      ${st !== 'Done' ? `<button class="next" data-id="${w.id}" aria-label="Move ${w.id} to next stage">→ ${woStages[woStages.indexOf(st) + 1]}</button>` : (w.rca ? '<span class="sev good"><span class="dot">✓</span>RCA filed</span>' : '<span class="pill">RCA pending</span>')}</div></div>`).join('')}</div>`;
  }).join('');
  $('#kanban').querySelectorAll('.next').forEach(b => b.onclick = () => { const w = workOrders.find(x => x.id === b.dataset.id); w.stage = woStages[woStages.indexOf(w.stage) + 1]; if (w.stage === 'Done') { w.due = 'Done today'; w.rca = false; toast(`${w.id} closed — RCA report opened for the quality team`); } renderers['work-orders'](); updateCounts(); });
};
function openWoModal(machineId, task) {
  $('#woMachine').innerHTML = machines.map(m => `<option ${m.id === machineId ? 'selected' : ''}>${esc(m.id)}</option>`).join('');
  $('#woTask').value = task || ''; $('#woModalBg').classList.add('open'); $('#woTask').focus();
}
$('#newWo').onclick = () => openWoModal();
$('#woCancel').onclick = () => $('#woModalBg').classList.remove('open');
$('#woCreate').onclick = () => {
  const task = $('#woTask').value.trim(); if (!task) { toast('Describe the task'); return; }
  const tech = $('#woTech').value;
  workOrders.unshift({ id: 'WO-' + (++woSeq), m: $('#woMachine').value, code: 'Manual', task, tech, due: 'New', stage: tech === 'Unassigned' ? 'Open' : 'Assigned', parts: '—' });
  $('#woModalBg').classList.remove('open'); toast('Work order created'); updateCounts();
  if (!$('[data-view="work-orders"].view').hidden) renderers['work-orders']();
};

// ================= Remote actions =================
cmdLog.push({ t: '12:52', m: 'BMM-160 #0231', c: 'Reduce clay feed rate by 15%', r: 'Mixer load 88%, clay dry; owner agreed', by: 'Priya', res: 'Pending approval' });
cmdLog.push({ t: '12:49', m: 'BMM-310 #0019', c: 'Lower hydraulic pressure limit', r: 'Test after drum slip', by: 'Amit', res: 'Pending approval' });
const catalogue = [
  ['Reset alarm after inspection', 'Clears a latched alarm so the machine can restart', 'Low', 'Fault stop'],
  ['Request fresh 5-min snapshot', 'Gateway uploads high-rate data now', 'Low', 'Any'],
  ['Change reporting interval', 'Telemetry every 5–60 s', 'Low', 'Any'],
  ['Reduce clay feed rate', 'Lowers feeder speed by a set %', 'High', 'Producing, Idle'],
  ['Lower hydraulic pressure limit', 'Changes PLC pressure setpoint', 'High', 'Idle'],
  ['Stop drum (safe stop)', 'Stops drum and mixer via PLC', 'High', 'Producing'],
  ['Install firmware', 'OTA update with automatic rollback', 'High', 'Idle, Off-season']
];
renderers['remote-actions'] = function () {
  const pend = cmdLog.filter(c => c.res === 'Pending approval');
  $('#approvals').innerHTML = pend.length ? pend.map(c => `<div class="appr"><div><b>${esc(c.c)}</b><div class="muted">${esc(c.m)} · requested by ${esc(c.by)} at ${esc(c.t)}</div><div style="margin-top:4px">Reason: ${esc(c.r)}</div></div>
    <div class="actions" style="align-items:center"><button class="btn primary" data-a="ok" data-i="${cmdLog.indexOf(c)}">Approve and send</button><button class="btn danger" data-a="no" data-i="${cmdLog.indexOf(c)}">Reject</button></div></div>`).join('') : '<div class="muted">Nothing waiting for approval.</div>';
  $('#approvals').querySelectorAll('button').forEach(b => b.onclick = () => {
    const c = cmdLog[+b.dataset.i];
    if (c.by === 'You' && b.dataset.a === 'ok') { toast('You cannot approve your own command'); return; }
    c.res = b.dataset.a === 'ok' ? 'Sending…' : 'Rejected'; c.approver = 'You'; renderers['remote-actions'](); updateCounts();
    if (b.dataset.a === 'ok') setTimeout(() => { c.res = 'Acked'; renderLog(); }, 1500);
    toast(b.dataset.a === 'ok' ? 'Approved — command sent to gateway' : 'Command rejected');
  });
  renderLog();
  $('#catalogue').innerHTML = catalogue.map(([c, d, r, s]) => `<tr style="cursor:default"><td><b>${esc(c)}</b></td><td class="muted">${esc(d)}</td><td>${r === 'High' ? '<span class="sev warning"><span class="dot">!</span>High · 2nd approval</span>' : '<span class="sev good"><span class="dot">✓</span>Low</span>'}</td><td class="hide-sm">${esc(s)}</td></tr>`).join('');
};

// ================= Firmware =================
const rollout = { paused: false, rings: [
  { name: 'Ring 1 · 5%', target: 8, ok: 8, failed: 0, state: 'Done' },
  { name: 'Ring 2 · 25%', target: 38, ok: 22, failed: 1, state: 'In progress' },
  { name: 'Ring 3 · 100%', target: 104, ok: 0, failed: 0, state: 'Waiting' }] };
const releases = [
  ['gw 1.5.0-rc1', '10 Nov 2026', 'Rolling out', 'Drum-ground sync rule, faster snapshot upload', 31],
  ['gw 1.4.2', '02 Nov 2026', 'Current stable', 'Offline queue fix after long outages', 98],
  ['gw 1.4.1', '12 Oct 2026', 'Supported', 'Modbus timeout tuning', 15],
  ['gw 1.4.0', '20 Sep 2026', 'Deprecated', 'J1939 engine data', 6]
];
renderers['firmware'] = function () {
  const r2 = rollout.rings[1];
  $('#rollStatus').textContent = rollout.paused ? 'Paused' : 'Ring 2 in progress · auto-pauses if failures pass 5%';
  $('#pauseRoll').textContent = rollout.paused ? 'Resume' : 'Pause';
  $('#rings').innerHTML = rollout.rings.map(r => { const okp = r.ok / r.target * 100, fp = r.failed / r.target * 100;
    return `<div class="ring"><div><b>${r.name}</b><div class="muted">${r.target} gateways</div></div>
      <div class="progress" role="img" aria-label="${r.ok} updated, ${r.failed} rolled back of ${r.target}"><span style="width:${okp}%;background:var(--series-1)"></span>${r.failed ? `<span style="width:${fp}%;background:var(--critical)"></span>` : ''}</div>
      <div class="muted">${r.ok} updated${r.failed ? ` · <span style="color:var(--critical)">▲ ${r.failed} rolled back</span>` : ''} · ${rollout.paused && r.state === 'In progress' ? 'Paused' : r.state}</div></div>`; }).join('') +
    `<div class="muted" style="margin-top:10px">Rule: install only when the machine is Idle or Off-season. A gateway that fails health checks after reboot returns to gw 1.4.2 automatically.</div>`;
  const dist = releases.map((r, i) => [r[0], r[4], `var(--series-${i + 1})`]);
  const tot = dist.reduce((s, d) => s + d[1], 0);
  $('#fwBar').innerHTML = dist.map(([v, n, c]) => `<span title="${v}: ${n}" style="flex:${n};background:${c}"></span>`).join('');
  $('#fwLegend').innerHTML = dist.map(([v, n, c]) => `<span><i style="background:${c}"></i>${v}: <b>${n}</b> (${Math.round(n / tot * 100)}%)</span>`).join('');
  $('#releases').innerHTML = releases.map(([v, d, s, c, n]) => `<tr style="cursor:default"><td class="code">${v}</td><td>${d}</td><td>${s === 'Deprecated' ? `<span class="sev warning"><span class="dot">!</span>${s}</span>` : `<span class="pill ${s === 'Rolling out' ? 'ack' : ''}">${s}</span>`}</td><td class="hide-sm muted">${c}</td><td class="num">${n}</td></tr>`).join('');
};
$('#pauseRoll').onclick = () => { rollout.paused = !rollout.paused; renderers.firmware(); toast(rollout.paused ? 'Rollout paused' : 'Rollout resumed'); };
$('#rollbackRoll').onclick = () => { if ($('#rollbackRoll').dataset.confirm) { rollout.paused = true; rollout.rings.forEach(r => { r.ok = 0; r.state = 'Rolled back'; }); delete $('#rollbackRoll').dataset.confirm; $('#rollbackRoll').textContent = 'Roll back'; renderers.firmware(); toast('Rollback queued for 31 gateways'); } else { $('#rollbackRoll').dataset.confirm = 1; $('#rollbackRoll').textContent = 'Tap again to confirm'; setTimeout(() => { delete $('#rollbackRoll').dataset.confirm; $('#rollbackRoll').textContent = 'Roll back'; }, 3000); } };

// ================= Reports =================
let range = '30';
const repData = {
  '7': { kpi: [['Faults', '41', '9 critical'], ['Fixed remotely', '38%', '16 of 41'], ['Mean time to repair', '5.2 h', 'site visits'], ['Fleet OEE', '61%', 'producing machines'], ['Fuel / 1k bricks', '1.86 L', 'fleet average']],
         weekly: [['Tue', 5], ['Wed', 7], ['Thu', 4], ['Fri', 8], ['Sat', 6], ['Sun', 3], ['Mon', 8]], codes: [['HYD-01', 8], ['MIX-02', 7], ['PRC-03', 6], ['DRM-02', 5], ['BRG-01', 4], ['HYD-02', 4], ['MTR-01', 3]] },
  '30': { kpi: [['Faults', '172', '31 critical'], ['Fixed remotely', '36%', '62 of 172'], ['Mean time to repair', '6.1 h', 'site visits'], ['Fleet OEE', '58%', 'producing machines'], ['Fuel / 1k bricks', '1.91 L', 'fleet average']],
         weekly: [['W43', 38], ['W44', 44], ['W45', 49], ['W46', 41]], codes: [['HYD-01', 29], ['MIX-02', 26], ['PRC-03', 22], ['BRG-01', 19], ['DRM-02', 17], ['HYD-02', 15], ['MTR-01', 9]] },
  'season': { kpi: [['Faults', '640', '102 critical'], ['Fixed remotely', '31%', '198 of 640'], ['Mean time to repair', '7.4 h', 'site visits'], ['Fleet OEE', '55%', 'producing machines'], ['Fuel / 1k bricks', '1.97 L', 'fleet average']],
         weekly: [['W39', 52], ['W40', 61], ['W41', 58], ['W42', 66], ['W43', 38], ['W44', 44], ['W45', 49], ['W46', 41]], codes: [['HYD-01', 104], ['MIX-02', 92], ['BRG-01', 81], ['PRC-03', 74], ['DRM-02', 63], ['HYD-02', 57], ['MTR-01', 38]] }
};
const mtbf = [['Drum bearing', 610], ['Pug mill paddles', 1450], ['Hydraulic pump', 2900], ['Drive chain', 1180], ['Hydraulic hoses', 820], ['Scrapers', 940]];
const causes = [['Maintenance missed', 34], ['Supplier / material', 27], ['Operator misuse', 19], ['Design', 12], ['Installation', 8]];
const batches = [['Drum bearing 6312-2RS', 'B-2207', 44, 9, 0.52, 'Review'], ['Paddle set PS-160', 'P-0912', 60, 4, 0.11, ''], ['Hydraulic hose 1/2"', 'H-3310', 120, 11, 0.21, 'Watch'], ['Drive chain 16B', 'C-0418', 52, 2, 0.06, '']];

function hbars(el, rows, unit, { sorted = true } = {}) {
  const data = sorted ? rows.slice().sort((a, b) => b[1] - a[1]) : rows;
  const W = 520, rowH = 30, lw = 150, H = data.length * rowH + 8, max = Math.max(...data.map(d => d[1]));
  const x = v => (v / max) * (W - lw - 70);
  el.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(el.previousElementSibling ? el.previousElementSibling.querySelector('h2').textContent : 'Bar chart')}">${data.map(([k, v], i) => `
    <g class="bar-row" data-i="${i}"><rect x="0" y="${i * rowH}" width="${W}" height="${rowH}" fill="transparent"/>
    <text x="${lw - 10}" y="${i * rowH + 19}" text-anchor="end">${esc(k)}</text>
    <path d="M${lw} ${i * rowH + 8}h${Math.max(2, x(v) - 4)}a4 4 0 0 1 4 4v6a4 4 0 0 1 -4 4h-${Math.max(2, x(v) - 4)}z" fill="var(--series-1)"/>
    <text class="val" x="${lw + x(v) + 8}" y="${i * rowH + 19}">${fmtN(v)}${unit ? ' ' + unit : ''}</text></g>`).join('')}</svg>`;
  el.querySelector('svg').style.width = '100%';
}
function vbars(el, rows, unit) {
  const W = 520, H = 200, m = { l: 34, r: 8, t: 18, b: 24 }, max = Math.max(...rows.map(r => r[1])) * 1.15;
  const bw = Math.min(48, (W - m.l - m.r) / rows.length - 12), step = (W - m.l - m.r) / rows.length;
  const y = v => m.t + (1 - v / max) * (H - m.t - m.b), ticks = [0, Math.round(max / 2), Math.round(max)];
  el.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Fault counts" style="width:100%">
    ${ticks.map(t => `<line x1="${m.l}" x2="${W - m.r}" y1="${y(t)}" y2="${y(t)}" stroke="var(--grid)"/><text x="${m.l - 6}" y="${y(t) + 3}" text-anchor="end" fill="var(--text-muted)" font-size="10">${t}</text>`).join('')}
    ${rows.map(([k, v], i) => { const cx = m.l + step * i + step / 2, h = H - m.b - y(v);
      return `<g><path d="M${cx - bw / 2} ${H - m.b}v-${Math.max(0, h - 4)}a4 4 0 0 1 4 -4h${bw - 8}a4 4 0 0 1 4 4v${Math.max(0, h - 4)}z" fill="var(--series-1)"/>
      ${i === rows.length - 1 ? `<text x="${cx}" y="${y(v) - 6}" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text-primary)">${v}</text>` : ''}
      <text x="${cx}" y="${H - 8}" text-anchor="middle" font-size="10" fill="var(--text-muted)">${k}</text>
      <rect x="${m.l + step * i}" y="${m.t}" width="${step}" height="${H - m.t - m.b}" fill="transparent"><title>${k}: ${v} faults</title></rect></g>`; }).join('')}
  </svg>`;
}
renderers['reports'] = function () {
  document.querySelectorAll('#rangeChips .chip').forEach(c => { c.classList.toggle('active', c.dataset.r === range); c.onclick = () => { range = c.dataset.r; renderers.reports(); }; });
  const d = repData[range];
  $('#repKpis').innerHTML = d.kpi.map(([l, v, m]) => `<div class="tile"><div class="label">${l}</div><div class="value">${v}</div><div class="meta">${m}</div></div>`).join('');
  $('#rWeekly').previousElementSibling.querySelector('h2').textContent = range === '7' ? 'Faults per day' : 'Faults per week';
  vbars($('#rWeekly'), d.weekly, 'faults');
  hbars($('#rCodes'), d.codes, '');
  hbars($('#rMtbf'), mtbf, 'h');
  hbars($('#rCause'), causes, '%');
  $('#batches').innerHTML = batches.map(([p, b, f, x, r, flag]) => `<tr style="cursor:default"><td>${esc(p)}</td><td class="code">${b}</td><td class="num">${f}</td><td class="num">${x}</td><td class="num">${r.toFixed(2)}</td><td>${flag === 'Review' ? '<span class="sev critical"><span class="dot">!</span>Review supplier</span>' : flag === 'Watch' ? '<span class="sev warning"><span class="dot">!</span>Watch</span>' : '<span class="muted">—</span>'}</td></tr>`).join('');
};

// ================= Counts =================
function updateCounts() {
  const wo = workOrders.filter(w => w.stage !== 'Done').length, ap = cmdLog.filter(c => c.res === 'Pending approval').length;
  $('#woCount').textContent = wo; $('#apprCount').textContent = ap;
  $('#apprCount').classList.toggle('zero', ap === 0);
  if (typeof myJobs === 'function') $('#myJobCount').textContent = myJobs().filter(j => j.stage !== 'Done').length;
}

renderQueue(); renderDetail(); renderStates(); renderLog();
// ================= FIELD ENGINEER =================
const ME = 'Ajay (Rohtak)';
workOrders.push(
  { id: 'WO-1186', m: 'BMM-160 #0087', code: 'MTR-01', task: 'Engine oil pressure low — find leak, do not restart until fixed', tech: ME, due: 'Today', stage: 'Assigned', parts: 'Oil 15 L, oil filter', order: 1, fault: 2 },
  { id: 'WO-1191', m: 'BMM-160 #0142', code: 'HYD-01', task: 'Clear feed chute jam and check relief valve', tech: ME, due: 'Today', stage: 'Assigned', parts: '—', order: 2, fault: 1 }
);
workOrders.find(w => w.id === 'WO-1182').order = 3;
workOrders.find(w => w.id === 'WO-1182').fault = 4;
const histExtra = [
  { id: 'WO-1168', m: 'BMM-160 #0087', task: 'Clear chute jam, check relief valve', cause: 'Operator misuse', hours: 2.5, rca: 'Pending' },
  { id: 'WO-1150', m: 'BMM-310 #0737', task: 'Replace drive chain', cause: 'Maintenance missed', hours: 4, rca: 'Filed' },
  { id: 'WO-1142', m: 'BMM-160 #0513', task: 'Replace oil pressure sender', cause: 'Supplier / material', hours: 1.5, rca: 'Filed' }
];
const checklists = {
  'HYD-01': [['Confirm drum is stopped and E-stop is pressed', 'Never reach into the chute with the drum able to turn'], ['Open the feed chute and look for stones or hard clay lumps', 'Most HYD-01 faults on BMM-160 are chute jams'], ['Check clay moisture by hand; ask operator to add water if dry', 'Support saw water flow 18% under normal'], ['Check relief valve setting (should be 300 bar)', 'A drifted relief valve lets pressure spike'], ['Release E-stop, start at low feed rate', ''], ['Watch live pressure for 5 minutes: must stay under 300 bar', 'Use the live readings panel below']],
  'MTR-01': [['Do NOT start the engine', 'Running with low oil pressure can seize the engine'], ['Check oil level on the dipstick', 'Last oil change was 412 h ago (due at 250 h)'], ['Look for leaks: sump plug, oil filter, cooler lines', ''], ['Check oil pressure sender wiring and connector', 'A loose wire gives a false low reading'], ['Change oil and filter; fix any leak found', ''], ['Start engine: oil pressure must be above 2.5 bar at idle', 'Check in live readings']],
  'BRG-01': [['Lock out the machine and press E-stop', ''], ['Feel bearing housing temperature; check grease nipple', 'Greasing last logged 14 days ago'], ['Remove drum guard and replace bearing 6312-2RS', 'Tag the old bearing for return (batch B-2207 under review)'], ['Grease new bearing and refit guard', ''], ['Run drum for 10 minutes', ''], ['Vibration must read under 4.5 mm/s', 'Check in live readings']],
  'default': [['Make the machine safe: E-stop and lockout', ''], ['Inspect the part named in the work order', ''], ['Fix or replace', ''], ['Run and check live readings', '']]
};
const liveDefs = {
  'HYD-01': [['Hydraulic pressure', 'bar', 338, 300, 'max'], ['Mixer load', '%', 96, 90, 'max'], ['Drum speed', 'cyc/min', 0, null], ['Oil pressure', 'bar', 3.9, 1.5, 'min'], ['Coolant temp', '°C', 88, 100, 'max'], ['Engine speed', 'rpm', 1180, null]],
  'MTR-01': [['Oil pressure', 'bar', 0, 1.5, 'min'], ['Coolant temp', '°C', 62, 100, 'max'], ['Engine speed', 'rpm', 0, null], ['Battery', 'V', 24.6, 23.5, 'min'], ['Oil temp', '°C', 55, 110, 'max'], ['Hydraulic pressure', 'bar', 0, 300, 'max']],
  'BRG-01': [['Bearing vibration', 'mm/s', 8.4, 7.1, 'max'], ['Bearing temp', '°C', 74, 80, 'max'], ['Drum speed', 'cyc/min', 0, null], ['Hydraulic pressure', 'bar', 0, 300, 'max'], ['Engine speed', 'rpm', 900, null], ['Oil pressure', 'bar', 3.6, 1.5, 'min']]
};
const van = [
  ['Engine oil 15W-40 (L)', 'OIL-1540', 30, 15], ['Engine oil filter', 'EF-160', 2, 2], ['Hydraulic return filter', 'HF-310', 1, 2], ['Bearing 6312-2RS', 'BRG-6312', 2, 1],
  ['Pug mill paddle set', 'PS-160', 0, 1], ['Drive chain 16B (m)', 'CH-16B', 4, 2], ['Oil pressure sender', 'OPS-10', 1, 1], ['Hydraulic hose 1/2" (m)', 'HH-12', 6, 4], ['Grease cartridge', 'GR-EP2', 5, 4]
];
let openJob = null, bleTimer = null;

function myJobs() { return workOrders.filter(w => w.tech === ME && (w.stage !== 'Done' || w.closedToday)).sort((a, b) => (a.order || 9) - (b.order || 9)); }

renderers['my-jobs'] = function () {
  if (openJob) return renderJob();
  $('#myJobsList').hidden = false; $('#jobDetail').hidden = true;
  const jobs = myJobs(), done = jobs.filter(j => j.stage === 'Done').length;
  $('#fieldKpis').innerHTML = [['Jobs today', jobs.length, ''], ['Done', done, ''], ['Critical', jobs.filter(j => j.stage !== 'Done' && faults.find(f => f.id === j.fault && f.sev === 'critical')).length, 'machines stopped'], ['Parts low in van', van.filter(v => v[2] < v[3]).length, 'request restock']]
    .map(([l, v, m]) => `<div class="tile"><div class="label">${l}</div><div class="value">${v}</div><div class="meta">${m}</div></div>`).join('');
  $('#jobCards').innerHTML = jobs.map((w, i) => { const f = faults.find(x => x.id === w.fault), mm = machines.find(m => m.id === w.m);
    return `<div class="job ${w.stage === 'Done' ? 'done' : ''}" data-id="${w.id}" tabindex="0"><div class="seq">${w.stage === 'Done' ? '✓' : i + 1}</div>
      <div><div>${f ? sevBadge(f.sev) : ''} <span class="code">${esc(w.code)}</span> <span class="muted">${w.id}</span></div><b>${esc(w.task)}</b>
      <div class="muted">${esc(w.m)} · ${mm ? esc(mm.site + ', ' + mm.town) : ''}</div><div class="muted">Parts: ${esc(w.parts)}</div></div>
      <span class="pill ${w.stage === 'In progress' ? 'ack' : ''}">${w.stage}</span></div>`; }).join('') || '<div class="empty">No jobs assigned.</div>';
  $('#jobCards').querySelectorAll('.job').forEach(el => { el.onclick = () => { openJob = el.dataset.id; renderJob(); }; el.onkeydown = e => { if (e.key === 'Enter') el.onclick(); }; });
  $('#myJobCount').textContent = jobs.filter(j => j.stage !== 'Done').length;
};

function renderJob() {
  const w = workOrders.find(x => x.id === openJob); if (!w) { openJob = null; return renderers['my-jobs'](); }
  const f = faults.find(x => x.id === w.fault), m = machines.find(x => x.id === w.m) || {};
  w.checks = w.checks || [];
  const steps = checklists[w.code] || checklists.default;
  const started = w.stage === 'In progress';
  $('#myJobsList').hidden = true; $('#jobDetail').hidden = false;
  $('#jobDetail').innerHTML = `<button class="back" id="backJobs">← All jobs</button>
  <section class="card">
    <div class="detail-head"><div class="detail-title">${f ? sevBadge(f.sev) : ''}<span class="code">${esc(w.code)}</span><h3>${esc(w.task)}</h3></div>
      <div class="detail-meta"><div><span>Work order</span><b>${w.id}</b></div><div><span>Machine</span><b>${esc(w.m)}</b></div><div><span>Site</span><b>${esc((m.site || '') + ', ' + (m.town || ''))}</b></div>
      <div><span>Operator</span><b>${f ? esc(f.operator) : '—'}</b></div><div><span>Status</span><b>${w.stage}</b></div><div><span>Parts to bring</span><b>${esc(w.parts)}</b></div></div></div>
    ${f ? `<div class="section"><h4>What support found</h4><div class="cause">${esc(f.cause)}</div></div>` : ''}
    <div class="section"><h4>Checklist <span class="muted" id="chkCount"></span></h4>
      <ol class="steps">${steps.map(([t, why], i) => `<li class="${w.checks[i] ? 'checked' : ''}"><input type="checkbox" data-i="${i}" ${w.checks[i] ? 'checked' : ''} ${started ? '' : 'disabled'} aria-label="Step ${i + 1}"><span>${esc(t)}${why ? `<span class="why">${esc(why)}</span>` : ''}</span></li>`).join('')}</ol>
      ${started ? '' : '<div class="muted" style="margin-top:8px">Tap “Start job” when you reach the site to unlock the checklist.</div>'}</div>
    <div class="section"><h4 style="display:flex;justify-content:space-between;align-items:center">Live readings <span class="ble" id="ble"><span class="led"></span><span id="bleTxt">Not connected</span></span></h4>
      <button class="btn" id="bleBtn">Connect to gateway (Bluetooth)</button>
      <div class="live-grid" id="liveGrid"></div></div>
    ${started ? closeForm(w, f) : ''}
    <div class="sticky-actions">
      ${w.stage === 'Assigned' ? '<button class="btn primary" id="startJob">Start job (I am on site)</button><button class="btn" id="navJob">Directions</button>' : ''}
      ${started ? '<button class="btn primary" id="closeJob">Close job</button><button class="btn" id="needParts">Waiting for parts</button>' : ''}
      ${w.stage === 'Done' ? '<span class="sev good"><span class="dot">✓</span>Job closed</span>' : ''}
      <button class="btn" id="callSupport">Call support</button>
    </div>
  </section>`;
  const updCount = () => { $('#chkCount').textContent = `· ${w.checks.filter(Boolean).length} of ${steps.length} done`; };
  updCount();
  $('#jobDetail').querySelectorAll('.steps input').forEach(cb => cb.onchange = () => { w.checks[+cb.dataset.i] = cb.checked; cb.closest('li').classList.toggle('checked', cb.checked); updCount(); });
  $('#backJobs').onclick = () => { stopBle(); openJob = null; renderers['my-jobs'](); };
  $('#bleBtn').onclick = () => startBle(w);
  $('#callSupport').onclick = () => toast('Calling support desk… (demo)');
  if ($('#startJob')) $('#startJob').onclick = () => { w.stage = 'In progress'; if (f) f.events.push(['now', `Technician ${ME} on site`]); toast('Job started — support can see you are on site'); renderJob(); updateCounts(); };
  if ($('#navJob')) $('#navJob').onclick = () => toast(`Directions to ${m.town} (opens maps in the mobile app)`);
  if ($('#needParts')) $('#needParts').onclick = () => { w.stage = 'Waiting for parts'; stopBle(); openJob = null; toast('Marked waiting for parts; support notified'); renderers['my-jobs'](); };
  if ($('#closeJob')) bindCloseForm(w, f, steps);
}

function closeForm(w, f) {
  return `<div class="section"><h4>Close the job</h4>
    <div class="field"><label class="field-label">Parts used (from van)</label><div id="partsLines"></div><button class="btn" id="addPart" style="margin-top:6px;align-self:flex-start">+ Add part</button></div>
    <div class="form-grid">
      <div class="field"><label class="field-label" for="labour">Labour hours</label><input type="number" id="labour" min="0" step="0.5" value="1.5"></div>
      <div class="field"><label class="field-label" for="causeSel">Root cause category</label><select id="causeSel"><option value="">Choose…</option><option>Design</option><option>Supplier / material</option><option>Operator misuse</option><option>Maintenance missed</option><option>Installation</option><option>Not found yet</option></select></div>
    </div>
    <div class="field"><label class="field-label" for="why">5-Why: why did it fail?</label><textarea id="why" placeholder="1. Pressure spiked because the chute jammed&#10;2. Chute jammed because a stone was in the clay&#10;3. …"></textarea></div>
    <div class="field"><label class="field-label" for="photos">Photos (failed part, repair)</label><input type="file" id="photos" accept="image/*" multiple><div class="thumbs" id="thumbs"></div></div>
    <div class="check"><input type="checkbox" id="tagged"><label for="tagged" style="margin:0">Failed part tagged and packed for return to quality team</label></div>
    <div class="form-grid">
      <div class="field"><label class="field-label" for="signName">Customer / operator name</label><input type="text" id="signName" placeholder="${f ? esc(f.operator) : ''}"></div>
      <div class="field"><label class="field-label">&nbsp;</label><div class="check" style="margin:0"><input type="checkbox" id="signOk"><label for="signOk" style="margin:0">Customer confirms machine is working</label></div></div>
    </div></div>`;
}
function bindCloseForm(w, f, steps) {
  const lines = $('#partsLines');
  const addLine = () => { const d = document.createElement('div'); d.className = 'parts-line'; d.innerHTML = `<select aria-label="Part">${van.map((v, i) => `<option value="${i}">${esc(v[0])} (${v[2]} in van)</option>`).join('')}</select><input type="number" min="1" value="1" aria-label="Quantity"><button class="btn" aria-label="Remove part" style="padding:4px">✕</button>`; d.querySelector('button').onclick = () => d.remove(); d.querySelectorAll('select,input').forEach(el => el.style.cssText = 'font:inherit;padding:7px;border-radius:8px;border:1px solid var(--border);background:var(--surface-2);color:var(--text-primary)'); lines.appendChild(d); };
  $('#addPart').onclick = addLine;
  $('#photos').onchange = e => { $('#thumbs').innerHTML = ''; [...e.target.files].slice(0, 6).forEach(file => { const img = document.createElement('img'); img.alt = file.name; img.src = URL.createObjectURL(file); $('#thumbs').appendChild(img); }); };
  $('#closeJob').onclick = () => {
    const doneSteps = w.checks.filter(Boolean).length;
    if (doneSteps < steps.length) { toast(`Finish the checklist first (${doneSteps}/${steps.length})`); return; }
    if (!$('#causeSel').value) { toast('Choose a root cause category'); return; }
    if (!$('#signOk').checked || !$('#signName').value.trim()) { toast('Add customer name and confirmation'); return; }
    [...lines.children].forEach(d => { const i = +d.querySelector('select').value, q = +d.querySelector('input').value || 0; van[i][2] = Math.max(0, van[i][2] - q); });
    w.stage = 'Done'; w.closedToday = true; w.due = 'Done today'; w.rca = $('#causeSel').value !== 'Not found yet' && $('#why').value.trim().length > 10;
    histExtra.unshift({ id: w.id, m: w.m, task: w.task, cause: $('#causeSel').value, hours: +$('#labour').value || 0, rca: w.rca ? 'Filed' : 'Pending' });
    if (f) { f.status = 'Closed'; f.events.push(['now', `Fixed on site by ${ME}; cause: ${$('#causeSel').value}`]); const mm = machines.find(x => x.id === w.m); if (mm && faults.filter(x => x.machine === mm.id && x.status !== 'Closed' && x.sev === 'critical').length === 0) mm.state = 'Producing'; }
    stopBle(); openJob = null; updateCounts(); renderQueue(); if (faults.find(x => x.id === selectedId && x.status === 'Closed')) { const nx = faults.find(x => x.status !== 'Closed'); selectedId = nx ? nx.id : null; } renderDetail();
    toast('Job closed — RCA sent to quality team'); renderers['my-jobs']();
  };
}

function startBle(w) {
  const defs = (liveDefs[w.code] || liveDefs['HYD-01']).map(d => d.slice());
  const started = w.stage === 'In progress';
  $('#bleTxt').textContent = 'Connecting…'; $('#bleBtn').disabled = true;
  setTimeout(() => {
    if (!$('#ble')) return;
    $('#ble').classList.add('on'); $('#bleTxt').textContent = 'Connected · works offline'; $('#bleBtn').textContent = 'Disconnect'; $('#bleBtn').disabled = false;
    $('#bleBtn').onclick = () => { stopBle(); $('#ble').classList.remove('on'); $('#bleTxt').textContent = 'Not connected'; $('#bleBtn').textContent = 'Connect to gateway (Bluetooth)'; $('#bleBtn').onclick = () => startBle(w); $('#liveGrid').innerHTML = ''; };
    let t = 0;
    const tick = () => {
      t++;
      // once most of the checklist is done, readings move back to normal
      const fixed = started && w.checks.filter(Boolean).length >= Math.max(1, (checklists[w.code] || checklists.default).length - 1);
      defs.forEach(d => { const [k, u, v, lim, kind] = d; let target = v;
        if (fixed) { if (k === 'Hydraulic pressure') target = 225; if (k === 'Mixer load') target = 72; if (k === 'Drum speed') target = 21; if (k === 'Oil pressure') target = 3.9; if (k === 'Engine speed') target = 1620; if (k === 'Bearing vibration') target = 2.6; if (k === 'Bearing temp') target = 48; }
        d[2] = +(d[2] + (target - d[2]) * 0.25 + (Math.random() - .5) * (Math.abs(target) * 0.01 + 0.05)).toFixed(u === 'rpm' || u === 'bar' && target > 50 ? 0 : 1); if (d[2] < 0) d[2] = 0; });
      $('#liveGrid').innerHTML = defs.map(([k, u, v, lim, kind]) => { const out = lim != null && (kind === 'max' ? v > lim : v < lim);
        return `<div class="live ${out ? 'out' : ''}"><div class="k">${esc(k)}</div><div class="v">${out ? '▲ ' : ''}${v.toLocaleString('en-IN')} <span style="font-size:12px;font-weight:500">${u}</span></div><div class="lim">${lim != null ? (kind === 'max' ? 'max ' : 'min ') + lim + ' ' + u : '&nbsp;'}</div></div>`; }).join('');
    };
    tick(); bleTimer = setInterval(tick, 1000);
  }, 900);
}
function stopBle() { clearInterval(bleTimer); bleTimer = null; }

// Scan
renderers['scan'] = function () {
  $('#machineIds').innerHTML = machines.map(m => `<option value="${esc(m.id)}">`).join('');
  const near = machines.filter(m => ['Rohtak', 'Jhajjar', 'Sonipat', 'Bhiwani'].includes(m.town));
  $('#nearby').innerHTML = near.map(m => `<li data-id="${esc(m.id)}">${stateBadge(m.state)}<div><b>${esc(m.id)}</b></div><div class="muted">${esc(m.site)}, ${esc(m.town)}</div></li>`).join('');
  $('#nearby').querySelectorAll('li').forEach(li => li.onclick = () => scanOpen(li.dataset.id));
};
function scanOpen(id) {
  const m = machines.find(x => x.id.toLowerCase().replace(/\s/g, '') === id.toLowerCase().replace(/\s/g, ''));
  const box = $('#scanResult'); box.hidden = false;
  if (!m) { box.innerHTML = `<div class="card-body">No machine found for “${esc(id)}”.</div>`; return; }
  const job = workOrders.find(w => w.m === m.id && w.tech === ME && w.stage !== 'Done');
  const f = faults.filter(x => x.machine === m.id && x.status !== 'Closed' && x.status !== 'Scheduled');
  const due = m.wear.filter(([n, u, l]) => u / l >= .8).map(x => x[0]);
  box.innerHTML = `<div class="card-head"><h2>${esc(m.id)}</h2>${stateBadge(m.state)}</div>
    <div class="section"><div class="muted">${esc(m.site)}, ${esc(m.town)} · firmware ${esc(m.fw)}</div>
      <div class="reading"><span>Open faults</span><b>${f.length ? f.map(x => x.code).join(', ') : 'None'}</b></div>
      <div class="reading"><span>Service due soon</span><b>${due.length ? esc(due.join(', ')) : 'Nothing'}</b></div>
      <div class="reading"><span>Health (engine / module)</span><b>${m.engine} / ${m.module}</b></div></div>
    <div class="section actions">${job ? `<button class="btn primary" id="scanJob">Open my job ${job.id}</button>` : ''}<button class="btn" id="scanGrease">Log greasing</button><button class="btn" id="scanDetail">Full machine detail</button></div>`;
  if (job) $('#scanJob').onclick = () => { openJob = job.id; location.hash = 'my-jobs'; };
  $('#scanGrease').onclick = () => { m.wear[5][1] = 0; toast('Greasing logged — bearing counter reset'); scanOpen(m.id); };
  $('#scanDetail').onclick = () => openMachine(m);
}
$('#scanGo').onclick = () => scanOpen($('#scanInput').value.trim());
$('#scanInput').addEventListener('keydown', e => { if (e.key === 'Enter') scanOpen(e.target.value.trim()); });

// Van
renderers['van'] = function () {
  $('#vanBody').innerHTML = van.map(([n, pn, q, min]) => `<tr style="cursor:default"><td>${esc(n)}</td><td class="hide-sm code">${pn}</td><td class="num">${q}</td><td class="num">${min}</td><td>${q === 0 ? '<span class="sev critical"><span class="dot">!</span>Out of stock</span>' : q < min ? '<span class="sev warning"><span class="dot">!</span>Low</span>' : '<span class="sev good"><span class="dot">✓</span>OK</span>'}</td></tr>`).join('');
  const needed = myJobs().filter(j => j.stage !== 'Done' && j.parts !== '—');
  $('#vanNeeded').innerHTML = needed.length ? needed.map(j => `<div class="reading"><span><span class="muted">${j.id}</span> ${esc(j.m)}</span><b>${esc(j.parts)}</b></div>`).join('') : '<div class="muted">No parts needed.</div>';
};
$('#restock').onclick = () => toast(`Restock request sent for ${van.filter(v => v[2] < v[3]).length} parts`);

// History
renderers['my-history'] = function () {
  $('#histHint').textContent = `${histExtra.length} jobs · ${histExtra.reduce((s, h) => s + h.hours, 0)} hours`;
  $('#histBody').innerHTML = histExtra.map(h => `<tr style="cursor:default"><td class="code">${h.id}</td><td>${esc(h.m)}</td><td>${esc(h.task)}</td><td class="hide-sm">${esc(h.cause)}</td><td class="num">${h.hours}</td><td>${h.rca === 'Filed' ? '<span class="sev good"><span class="dot">✓</span>Filed</span>' : '<span class="pill">Pending</span>'}</td></tr>`).join('');
};

// Role switching
const fieldViews = ['my-jobs', 'scan', 'van', 'my-history'];
Object.assign(titles, { 'my-jobs': 'My jobs', 'scan': 'Scan machine', 'van': 'Parts in van', 'my-history': 'My history' });
function applyRole(role) {
  document.querySelectorAll('.sidebar > .nav-item').forEach(b => b.hidden = role === 'field');
  document.querySelector('.nav-group[data-role="field"]').hidden = role !== 'field';
  $('#roleSel').value = role;
  $('#avatar').textContent = role === 'field' ? 'AJ' : 'RK';
  $('#userName').textContent = role === 'field' ? 'Ajay · Field engineer' : 'Support L2';
  document.querySelector('.sidebar-foot').innerHTML = role === 'field' ? 'Field app · v0.1<br>Works offline on site' : 'Support console · v0.1<br>Tenant: Demo OEM';
}
$('#roleSel').onchange = e => { location.hash = e.target.value === 'field' ? 'my-jobs' : 'faults'; };

updateCounts(); show(location.hash.slice(1));
