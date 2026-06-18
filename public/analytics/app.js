(function () {
  'use strict';

  var COLORS = {
    blue: '#2279ff', blue2: '#43a2ff', purple: '#9a55ff', purple2: '#c278ff',
    orange: '#ff8a1d', red: '#ff4d45', green: '#34d87b', teal: '#26c6da',
    yellow: '#f9c846', pink: '#f052a7',
    grid: 'rgba(176,197,226,0.12)', muted: '#a9b5c8', muted2: '#78869b', text: '#f5f8ff'
  };
  var SOURCE_COLORS = [COLORS.blue, COLORS.orange, COLORS.teal, COLORS.purple, COLORS.pink, COLORS.yellow, COLORS.red, COLORS.green];

  var state = {
    data: null,
    days: 30,
    token: localStorage.getItem('mrcap_dashboard_token') || 'change-me',
    query: '',
    view: 'overview',
    annotations: JSON.parse(localStorage.getItem('mrcap_annotations') || '[]')
  };

  var VIEWS = {
    overview:    { title: 'Overview',     eyebrow: 'Website traffic command center' },
    realtime:    { title: 'Real-Time',    eyebrow: 'Live activity in the last 30 minutes' },
    audience:    { title: 'Audience',     eyebrow: 'Who is visiting your site' },
    acquisition: { title: 'Acquisition',  eyebrow: 'How visitors find you' },
    behavior:    { title: 'Behavior',     eyebrow: 'What visitors do on your site' },
    conversions: { title: 'Conversions',  eyebrow: 'Goal completions and revenue' },
    music:       { title: 'Music',        eyebrow: 'CAP STREAM listening analytics' },
    campaigns:   { title: 'Campaigns',    eyebrow: 'UTM-tagged marketing performance' },
    events:      { title: 'Events',       eyebrow: 'Raw event stream and breakdown' },
    reports:     { title: 'Reports',      eyebrow: 'Saved snapshots and exports' },
    explore:     { title: 'Explore',      eyebrow: 'Cross-table search and ad-hoc queries' },
    alerts:      { title: 'Alerts',       eyebrow: 'Tracking health and anomalies' },
    annotations: { title: 'Annotations',  eyebrow: 'Notes pinned to dates' },
    dataquality: { title: 'Data Quality', eyebrow: 'Pipeline health and coverage' }
  };

  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return [].slice.call(document.querySelectorAll(s)); };

  // ---------- formatters ----------
  function number(v) { return Number(v || 0); }
  function fmtInt(v) { return Math.round(number(v)).toLocaleString(); }
  function fmtMoney(v) { return '$' + Math.round(number(v)).toLocaleString(); }
  function fmtPct(v, d) { return (number(v) * 100).toFixed(d == null ? 1 : d) + '%'; }
  function fmtDuration(ms) {
    var t = Math.max(0, Math.round(number(ms) / 1000));
    var h = Math.floor(t / 3600), m = Math.floor((t % 3600) / 60), s = t % 60;
    return [h, m, s].map(function (x) { return String(x).padStart(2, '0'); }).join(':');
  }
  function fmtSeconds(s) {
    s = Math.max(0, Math.round(s));
    var m = Math.floor(s / 60), r = s % 60;
    return m + ':' + String(r).padStart(2, '0');
  }
  function escapeHtml(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[c];
    });
  }
  function timeAgo(iso) {
    var t = new Date(iso).getTime();
    if (!t) return '—';
    var s = Math.max(0, Math.round((Date.now() - t) / 1000));
    if (s < 60) return s + 's ago';
    if (s < 3600) return Math.floor(s / 60) + 'm ago';
    if (s < 86400) return Math.floor(s / 3600) + 'h ago';
    return Math.floor(s / 86400) + 'd ago';
  }
  function shortDate(iso) {
    try { return new Date(iso + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' }); }
    catch (_) { return iso; }
  }
  function formatCompact(v) {
    v = number(v);
    if (v >= 1000000) return (v / 1000000).toFixed(1) + 'M';
    if (v >= 1000) return Math.round(v / 100) / 10 + 'K';
    return String(Math.round(v));
  }
  function setStatus(type, title, copy) {
    var strip = $('#status-strip');
    strip.classList.remove('warning', 'error', 'success');
    if (type) strip.classList.add(type);
    $('#status-title').textContent = title;
    $('#status-copy').textContent = copy;
  }

  // ---------- canvas helpers ----------
  function canvasSetup(canvas) {
    var ctx = canvas.getContext('2d');
    var rect = canvas.getBoundingClientRect();
    var dpr = Math.max(1, window.devicePixelRatio || 1);
    var w = Math.max(1, rect.width || canvas.width || 300);
    var h = Math.max(1, rect.height || canvas.height || 180);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    return { ctx: ctx, width: w, height: h };
  }
  function roundedRect(ctx, x, y, w, h, r) {
    var rad = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rad, y);
    ctx.arcTo(x + w, y, x + w, y + h, rad);
    ctx.arcTo(x + w, y + h, x, y + h, rad);
    ctx.arcTo(x, y + h, x, y, rad);
    ctx.arcTo(x, y, x + w, y, rad);
    ctx.closePath();
  }
  function drawSparkline(canvas, values, color) {
    if (!canvas) return;
    var s = canvasSetup(canvas); var ctx = s.ctx; var w = s.width; var h = s.height;
    var vals = values && values.length ? values.map(number) : [0, 0];
    var min = Math.min.apply(null, vals);
    var max = Math.max.apply(null, vals);
    var range = max - min || 1;
    var pad = 5;
    ctx.lineWidth = 2; ctx.strokeStyle = color; ctx.shadowColor = color; ctx.shadowBlur = 10;
    ctx.beginPath();
    vals.forEach(function (v, i) {
      var x = pad + (i / Math.max(1, vals.length - 1)) * (w - pad * 2);
      var y = h - pad - ((v - min) / range) * (h - pad * 2);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();
    var grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, color + '55'); grad.addColorStop(1, color + '00');
    ctx.lineTo(w - pad, h - pad); ctx.lineTo(pad, h - pad); ctx.closePath();
    ctx.shadowBlur = 0; ctx.fillStyle = grad; ctx.fill();
  }
  function drawLineChart(canvas, rows, keys) {
    var s = canvasSetup(canvas); var ctx = s.ctx; var w = s.width; var h = s.height;
    var pad = { top: 16, right: 20, bottom: 34, left: 46 };
    rows = rows || [];
    var allVals = rows.flatMap(function (r) { return keys.map(function (k) { return number(r[k.key]); }); });
    var max = Math.max(10, allVals.length ? Math.max.apply(null, allVals) : 10);
    var plotW = w - pad.left - pad.right;
    var plotH = h - pad.top - pad.bottom;

    ctx.font = '12px Inter, system-ui, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 1;
    for (var i = 0; i <= 4; i++) {
      var y = pad.top + (i / 4) * plotH;
      var val = max - (i / 4) * max;
      ctx.strokeStyle = COLORS.grid;
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(w - pad.right, y); ctx.stroke();
      ctx.fillStyle = COLORS.muted2;
      ctx.fillText(formatCompact(val), 8, y);
    }
    var labels = pickLabels(rows, 5);
    labels.forEach(function (item) {
      var x = pad.left + (item.index / Math.max(1, rows.length - 1)) * plotW;
      ctx.fillStyle = COLORS.muted2; ctx.textAlign = 'center';
      ctx.fillText(item.label, x, h - 12);
    });
    ctx.textAlign = 'left';
    keys.forEach(function (series) {
      ctx.strokeStyle = series.color; ctx.lineWidth = 2.5;
      ctx.shadowColor = series.color; ctx.shadowBlur = 12;
      ctx.beginPath();
      rows.forEach(function (r, i) {
        var x = pad.left + (i / Math.max(1, rows.length - 1)) * plotW;
        var y = pad.top + plotH - (number(r[series.key]) / max) * plotH;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fillStyle = series.color;
      rows.forEach(function (r, i) {
        if (rows.length > 40 && i % 2) return;
        var x = pad.left + (i / Math.max(1, rows.length - 1)) * plotW;
        var y = pad.top + plotH - (number(r[series.key]) / max) * plotH;
        ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill();
      });
    });
  }
  function pickLabels(rows, count) {
    if (!rows.length) return [];
    var out = [];
    var step = Math.max(1, Math.floor((rows.length - 1) / Math.max(1, count - 1)));
    for (var i = 0; i < rows.length; i += step) {
      out.push({ index: i, label: rows[i].label || shortDate(rows[i].date || rows[i].minute || '') });
    }
    if (out[out.length - 1].index !== rows.length - 1) {
      out.push({ index: rows.length - 1, label: rows[rows.length - 1].label || shortDate(rows[rows.length - 1].date || rows[rows.length - 1].minute || '') });
    }
    return out.slice(0, count + 1);
  }
  function drawDonut(canvas, rows, valueKey, centerValue, centerLabel, colors) {
    var s = canvasSetup(canvas); var ctx = s.ctx; var w = s.width; var h = s.height;
    var cx = w / 2, cy = h / 2;
    var radius = Math.min(w, h) / 2 - 8;
    var thickness = Math.max(20, radius * 0.32);
    var total = rows.reduce(function (sum, r) { return sum + number(r[valueKey]); }, 0);
    var start = -Math.PI / 2;
    ctx.lineWidth = thickness; ctx.lineCap = 'butt';
    if (!total) {
      ctx.strokeStyle = 'rgba(176,197,226,0.12)';
      ctx.beginPath(); ctx.arc(cx, cy, radius - thickness / 2, 0, Math.PI * 2); ctx.stroke();
    } else {
      rows.forEach(function (row, i) {
        var angle = (number(row[valueKey]) / total) * Math.PI * 2;
        ctx.strokeStyle = colors[i % colors.length];
        ctx.beginPath(); ctx.arc(cx, cy, radius - thickness / 2, start, start + angle - 0.012); ctx.stroke();
        start += angle;
      });
    }
    ctx.textAlign = 'center'; ctx.fillStyle = COLORS.text;
    ctx.font = '800 26px Inter, system-ui, sans-serif';
    ctx.fillText(centerValue || '0', cx, cy - 5);
    ctx.fillStyle = COLORS.muted2; ctx.font = '12px Inter, system-ui, sans-serif';
    ctx.fillText(centerLabel || '', cx, cy + 18);
  }
  function drawBarChart(canvas, rows, valueKey, labelKey) {
    var s = canvasSetup(canvas); var ctx = s.ctx; var w = s.width; var h = s.height;
    var pad = { top: 18, right: 12, bottom: 36, left: 40 };
    var plotW = w - pad.left - pad.right;
    var plotH = h - pad.top - pad.bottom;
    var max = Math.max(1, rows.length ? Math.max.apply(null, rows.map(function (r) { return number(r[valueKey]); })) : 1);
    ctx.font = '12px Inter, system-ui, sans-serif'; ctx.textBaseline = 'middle';
    for (var i = 0; i <= 4; i++) {
      var y = pad.top + (i / 4) * plotH;
      ctx.strokeStyle = COLORS.grid;
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(w - pad.right, y); ctx.stroke();
      ctx.fillStyle = COLORS.muted2; ctx.textAlign = 'right';
      ctx.fillText(formatCompact(max - (i / 4) * max), pad.left - 8, y);
    }
    var gap = 14;
    var barW = Math.min(54, (plotW - gap * Math.max(0, rows.length - 1)) / Math.max(1, rows.length));
    rows.forEach(function (row, i) {
      var x = pad.left + i * (barW + gap) + (plotW - (rows.length * barW + Math.max(0, rows.length - 1) * gap)) / 2;
      var bh = (number(row[valueKey]) / max) * plotH;
      var y = pad.top + plotH - bh;
      var color = SOURCE_COLORS[i % SOURCE_COLORS.length];
      var grad = ctx.createLinearGradient(0, y, 0, y + bh);
      grad.addColorStop(0, color); grad.addColorStop(1, color + '88');
      ctx.fillStyle = grad; ctx.shadowColor = color; ctx.shadowBlur = 14;
      roundedRect(ctx, x, y, barW, bh, 8); ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = COLORS.muted; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(String(row[labelKey] || '').slice(0, 10), x + barW / 2, h - 24);
    });
  }

  // ---------- card / KPI primitives ----------
  function kpiCard(label, value, change, color, series) {
    var hasChange = change !== null && change !== undefined && Number.isFinite(change);
    var negative = hasChange && change < 0;
    var id = 'spark-' + Math.random().toString(36).slice(2, 8);
    setTimeout(function () {
      var c = document.getElementById(id);
      if (c) drawSparkline(c, series || [], color);
    }, 0);
    return '<article class="kpi-card" style="--accent:' + color + '">' +
      '<div class="kpi-label">' + escapeHtml(label) + '</div>' +
      '<div class="kpi-value">' + escapeHtml(value) + '</div>' +
      '<div class="kpi-change ' + (negative ? 'negative' : '') + '">' +
        (hasChange ? (negative ? '↓ ' : '↑ ') + Math.abs(change).toFixed(1) + '%' : 'Live tracking') +
      '</div>' +
      '<canvas class="sparkline" id="' + id + '"></canvas>' +
    '</article>';
  }
  function tableRow(cols) {
    return '<tr>' + cols.map(function (c) { return '<td>' + (c == null ? '' : c) + '</td>'; }).join('') + '</tr>';
  }
  function emptyState(msg) { return '<div class="empty-state">' + escapeHtml(msg) + '</div>'; }
  function tableCard(title, subtitle, headers, rows, mapper, empty) {
    if (!rows || !rows.length) {
      return '<article class="card"><div class="card-header compact"><div><h2>' + escapeHtml(title) + '</h2><p>' + escapeHtml(subtitle) + '</p></div></div>' + emptyState(empty) + '</article>';
    }
    return '<article class="card"><div class="card-header compact"><div><h2>' + escapeHtml(title) + '</h2><p>' + escapeHtml(subtitle) + '</p></div></div>' +
      '<div class="table-wrap"><table><thead><tr>' +
      headers.map(function (h) { return '<th>' + escapeHtml(h) + '</th>'; }).join('') +
      '</tr></thead><tbody>' + rows.map(mapper).join('') + '</tbody></table></div></article>';
  }

  // ---------- VIEWS ----------
  function renderOverview(d) {
    var t = d.totals || {}, c = d.changes || {}, trend = d.trend || [];
    var kpis =
      kpiCard('Total Users', fmtInt(t.users), c.users, COLORS.blue, trend.map(function (x) { return x.users; })) +
      kpiCard('Sessions', fmtInt(t.sessions), c.sessions, COLORS.blue, trend.map(function (x) { return x.sessions; })) +
      kpiCard('Pageviews', fmtInt(t.pageviews), c.pageviews, COLORS.blue, trend.map(function (x) { return x.pageviews; })) +
      kpiCard('Engagement Rate', fmtPct(t.engagement_rate), null, COLORS.purple, trend.map(function (x) { return x.sessions ? x.pageviews / x.sessions : 0; })) +
      kpiCard('Bounce Rate', fmtPct(t.bounce_rate), null, COLORS.red, trend.map(function (x) { return x.pageviews; })) +
      kpiCard('Conversions', fmtInt(t.conversions), c.conversions, COLORS.green, trend.map(function (x) { return x.conversions; })) +
      kpiCard('Conv. Rate', fmtPct(t.conversion_rate, 2), null, COLORS.purple, trend.map(function (x) { return x.sessions ? x.conversions / x.sessions : 0; })) +
      kpiCard('Revenue', fmtMoney(t.revenue), c.revenue, COLORS.orange, trend.map(function (x) { return x.revenue; }));

    return '<section class="kpi-grid">' + kpis + '</section>' +
      '<section class="dashboard-grid">' +
        chartCard('traffic', 'card-xl', 'Traffic Over Time', 'Users, sessions, and pageviews by day',
          '<div class="legend inline"><span><i class="dot blue"></i>Users</span><span><i class="dot purple"></i>Sessions</span><span><i class="dot orange"></i>Pageviews</span></div>') +
        donutCard('sources', 'Traffic Sources', 'Channel mix') +
        tableCard('Top Landing Pages', 'First page in each session',
          ['Landing Page', 'Sessions', 'Bounce', 'Conv.', 'Revenue'],
          (d.landing_pages || []).slice(0, 8),
          function (r) { return tableRow([escapeHtml(r.landing_page || r.name), fmtInt(r.sessions), fmtPct(r.bounce_rate), fmtPct(r.conversion_rate, 2), fmtMoney(r.revenue)]); },
          'Landing pages will appear after pageviews are collected.') +
        tableCard('Source / Medium', 'Where high-quality visits come from',
          ['Source / Medium', 'Sessions', 'Users', 'Bounce', 'Conv.'],
          (d.source_medium || []).slice(0, 8),
          function (r) { return tableRow([escapeHtml(r.name), fmtInt(r.sessions), fmtInt(r.users), fmtPct(r.bounce_rate), fmtPct(r.conversion_rate, 2)]); },
          'Source / medium rows appear after sessions are collected.') +
        chartCard('device', '', 'Device Breakdown', 'Desktop, mobile, and tablet mix', '') +
        tableCard('Geo Performance', 'Country-level traffic',
          ['Country', 'Users', 'Sessions'],
          (d.geo || []).slice(0, 8),
          function (r) { return tableRow([escapeHtml(r.country || r.name), fmtInt(r.users), fmtInt(r.sessions)]); },
          'Geo reporting needs traffic and a host/CDN passing country headers.') +
        tableCard('Campaign Performance', 'UTM campaign tracking',
          ['Campaign', 'Sessions', 'Conversions', 'CPA', 'ROAS'],
          (d.campaigns || []).slice(0, 8),
          function (r) { return tableRow([escapeHtml(r.campaign || r.name), fmtInt(r.sessions), fmtInt(r.conversions), '<span class="muted">—</span>', r.revenue ? (number(r.roas).toFixed(2) + 'x') : '<span class="muted">—</span>']); },
          'Campaigns appear when visitors arrive with UTM parameters.') +
        funnelCard(d) +
        donutCard('audience', 'New vs Returning', 'Audience loyalty', 'small-donut') +
        tableCard('Top Pages', 'Most viewed content',
          ['Page', 'Pageviews'], (d.pages || []).slice(0, 8),
          function (r) { return tableRow([escapeHtml(r.path), fmtInt(r.pageviews)]); },
          'Top pages appear after pageviews arrive.') +
        durationCard(d) +
        alertsCard(d) +
      '</section>';
  }

  function chartCard(id, extraClass, title, sub, header) {
    var canvasH = id === 'traffic' ? 310 : 260;
    return '<article class="card ' + extraClass + '">' +
      '<div class="card-header"><div><h2>' + title + '</h2><p>' + sub + '</p></div>' + (header || '') + '</div>' +
      '<canvas id="' + id + '-chart" height="' + canvasH + '"></canvas></article>';
  }
  function donutCard(id, title, sub, modifier) {
    return '<article class="card">' +
      '<div class="card-header compact"><div><h2>' + title + '</h2><p>' + sub + '</p></div></div>' +
      '<div class="donut-layout ' + (modifier || '') + '">' +
        '<canvas id="' + id + '-chart" width="240" height="240"></canvas>' +
        '<div class="source-list" id="' + id + '-list"></div>' +
      '</div></article>';
  }
  function funnelCard(d) {
    var rows = d.funnel || [];
    var palette = [COLORS.blue, COLORS.purple, COLORS.pink, COLORS.orange, COLORS.teal];
    var body = rows.length ? rows.map(function (row, i) {
      var width = Math.max(4, number(row.rate_from_start) * 100);
      return '<div class="funnel-row">' +
        '<div class="funnel-label">' + escapeHtml(row.label) + '</div>' +
        '<div class="funnel-bar-wrap"><div class="funnel-bar" style="width:' + width.toFixed(1) + '%;background:linear-gradient(90deg,' + palette[i % 5] + ',' + palette[(i + 1) % 5] + ')"></div></div>' +
        '<div class="funnel-value"><strong>' + fmtInt(row.sessions) + '</strong><span>' + fmtPct(row.rate_from_start) + '</span></div>' +
      '</div>';
    }).join('') : emptyState('Funnel stages populate as visitors view pages and submit forms.');
    return '<article class="card funnel-card"><div class="card-header compact"><div><h2>Conversion Funnel</h2><p>From arrival to booking/lead</p></div></div><div class="funnel">' + body + '</div></article>';
  }
  function durationCard(d) {
    return '<article class="card"><div class="card-header compact"><div><h2>Avg. Session Duration</h2><p>Engagement depth</p></div></div>' +
      '<div class="big-time">' + fmtDuration((d.totals || {}).avg_session_duration_ms) + '</div>' +
      '<canvas id="duration-chart" height="170"></canvas></article>';
  }
  function alertsCard(d) {
    var t = d.technical || {};
    var rows = [
      { label: 'Tag Status', value: t.tag_status || 'Unknown', level: /healthy/i.test(t.tag_status || '') ? 'good' : 'warn' },
      { label: 'Conversion Tracking', value: t.conversion_tracking || 'Unknown', level: /healthy/i.test(t.conversion_tracking || '') ? 'good' : 'warn' },
      { label: '404 Errors', value: fmtInt(t.errors_404) + ' errors', level: number(t.errors_404) ? 'warn' : 'good' },
      { label: 'Site Speed', value: t.site_speed_status || 'Unknown', level: /good/i.test(t.site_speed_status || '') ? 'good' : (/slow/i.test(t.site_speed_status || '') ? 'bad' : 'warn') },
      { label: 'Traffic Anomalies', value: fmtInt(t.traffic_anomalies) + ' anomalies', level: number(t.traffic_anomalies) ? 'bad' : 'good' }
    ];
    var body = rows.map(function (row) {
      var icon = row.level === 'good' ? '✓' : (row.level === 'bad' ? '!' : '△');
      return '<div class="alert-row"><span class="alert-icon ' + row.level + '">' + icon + '</span><strong>' + escapeHtml(row.label) + '</strong><span class="' + (row.level === 'good' ? 'positive' : row.level === 'bad' ? 'negative' : '') + '">' + escapeHtml(row.value) + '</span></div>';
    }).join('');
    return '<article class="card"><div class="card-header compact"><div><h2>Tracking Health</h2><p>Data quality checks</p></div></div><div class="alerts-list">' + body + '</div></article>';
  }

  // ---- view-specific drawers (called after html injected) ----
  function paintOverview(d) {
    drawLineChart($('#traffic-chart'), d.trend || [], [
      { key: 'users', color: COLORS.blue }, { key: 'sessions', color: COLORS.purple }, { key: 'pageviews', color: COLORS.orange }
    ]);
    drawDonut($('#sources-chart'), d.traffic_sources || [], 'sessions', fmtInt((d.totals || {}).sessions), 'Sessions', SOURCE_COLORS);
    fillLegend('#sources-list', d.traffic_sources || [], 'sessions', SOURCE_COLORS);
    drawBarChart($('#device-chart'), (d.devices || []).length ? d.devices : [{ name: 'Desktop', sessions: 0 }, { name: 'Mobile', sessions: 0 }, { name: 'Tablet', sessions: 0 }], 'sessions', 'name');
    var audRows = [{ name: 'New', sessions: (d.audience || {}).new_users || 0 }, { name: 'Returning', sessions: (d.audience || {}).returning_users || 0 }];
    drawDonut($('#audience-chart'), audRows, 'sessions', fmtInt((d.audience || {}).total_users || 0), 'Users', [COLORS.blue, COLORS.purple]);
    fillLegend('#audience-list', audRows, 'sessions', [COLORS.blue, COLORS.purple]);
    var trend = d.trend || [];
    drawSparkline($('#duration-chart'), trend.map(function (x) { return x.sessions ? Math.round((x.pageviews / x.sessions) * 60) : 0; }), COLORS.blue);
  }
  function fillLegend(sel, rows, valueKey, colors) {
    var el = $(sel); if (!el) return;
    var total = rows.reduce(function (s, r) { return s + number(r[valueKey]); }, 0);
    el.innerHTML = rows.length ? rows.map(function (r, i) {
      return '<div class="source-row"><i class="dot" style="background:' + colors[i % colors.length] + '"></i>' +
        '<span>' + escapeHtml(r.name) + '<small>' + fmtPct(total ? r[valueKey] / total : 0) + '</small></span>' +
        '<strong>' + fmtInt(r[valueKey]) + '</strong></div>';
    }).join('') : emptyState('No data yet.');
  }

  // ---- Real-Time ----
  function renderRealtime(d) {
    var rt = d.realtime || {};
    var byMin = (rt.by_minute || []).map(function (m) {
      var date = new Date(m.minute);
      return { label: String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0'), pageviews: m.pageviews, events: m.events };
    });
    return '<section class="kpi-grid">' +
      kpiCard('Active Now', fmtInt(rt.active_visitors), null, COLORS.green, byMin.map(function (m) { return m.pageviews; })) +
      kpiCard('Pageviews (30m)', fmtInt(rt.pageviews_30m), null, COLORS.blue, byMin.map(function (m) { return m.pageviews; })) +
      kpiCard('Events (30m)', fmtInt(rt.events_30m), null, COLORS.purple, byMin.map(function (m) { return m.events; })) +
      kpiCard('Tag Status', escapeHtml((d.technical || {}).tag_status || '—'), null, COLORS.teal, []) +
      '</section>' +
      '<section class="dashboard-grid">' +
        '<article class="card card-xl"><div class="card-header"><div><h2>Pageviews — Last 30 Minutes</h2><p>Per minute, updated every 30 seconds</p></div>' +
          '<div class="legend inline"><span><i class="dot blue"></i>Pageviews</span><span><i class="dot purple"></i>Events</span></div></div>' +
          '<canvas id="rt-chart" height="280"></canvas></article>' +
        tableCard('Top Live Pages', 'Pages with active visitors right now',
          ['Page', 'Live Views'], rt.top_pages || [],
          function (r) { return tableRow([escapeHtml(r.path), fmtInt(r.views)]); },
          'No live traffic in the last 30 minutes.') +
        tableCard('Live Event Feed', 'Last 20 events',
          ['Time', 'Event', 'Page', 'Country', 'Source'], rt.feed || [],
          function (r) { return tableRow([timeAgo(r.ts), '<span class="pill">' + escapeHtml(r.event_type) + '</span>', escapeHtml(r.path), escapeHtml(r.country || '—'), escapeHtml(r.source || 'direct')]); },
          'No live events yet.') +
      '</section>';
  }
  function paintRealtime(d) {
    var rt = d.realtime || {};
    var byMin = (rt.by_minute || []).map(function (m) {
      var date = new Date(m.minute);
      return { label: String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0'), pageviews: m.pageviews, events: m.events };
    });
    drawLineChart($('#rt-chart'), byMin, [
      { key: 'pageviews', color: COLORS.blue }, { key: 'events', color: COLORS.purple }
    ]);
  }

  // ---- Audience ----
  function renderAudience(d) {
    var a = d.audience || {}, t = d.totals || {};
    var audRows = [{ name: 'New Users', sessions: a.new_users || 0 }, { name: 'Returning Users', sessions: a.returning_users || 0 }];
    return '<section class="kpi-grid">' +
      kpiCard('Total Users', fmtInt(t.users), (d.changes || {}).users, COLORS.blue, (d.trend || []).map(function (x) { return x.users; })) +
      kpiCard('New Users', fmtInt(a.new_users), null, COLORS.green, []) +
      kpiCard('Returning Users', fmtInt(a.returning_users), null, COLORS.purple, []) +
      kpiCard('Avg. Session Duration', fmtDuration(t.avg_session_duration_ms), null, COLORS.orange, []) +
      '</section>' +
      '<section class="dashboard-grid">' +
        donutCard('audience', 'New vs Returning', 'Audience loyalty', 'small-donut') +
        chartCard('device', '', 'Device Breakdown', 'Desktop, mobile, tablet', '') +
        tableCard('Browsers', 'Session count by browser',
          ['Browser', 'Sessions'], a.browsers || [],
          function (r) { return tableRow([escapeHtml(r.name), fmtInt(r.sessions)]); }, 'No browser data yet.') +
        tableCard('Operating Systems', 'Session count by OS',
          ['OS', 'Sessions'], a.operating_systems || [],
          function (r) { return tableRow([escapeHtml(r.name), fmtInt(r.sessions)]); }, 'No OS data yet.') +
        tableCard('Languages', 'Top session languages',
          ['Language', 'Sessions'], a.languages || [],
          function (r) { return tableRow([escapeHtml(r.name), fmtInt(r.sessions)]); }, 'No language data yet.') +
        tableCard('Top Countries', 'Geo distribution',
          ['Country', 'Users', 'Sessions'], (d.geo || []).slice(0, 12),
          function (r) { return tableRow([escapeHtml(r.country || r.name), fmtInt(r.users), fmtInt(r.sessions)]); }, 'No country data yet.') +
      '</section>';
    function _unused(){}
  }
  function paintAudience(d) {
    var a = d.audience || {};
    var audRows = [{ name: 'New Users', sessions: a.new_users || 0 }, { name: 'Returning Users', sessions: a.returning_users || 0 }];
    drawDonut($('#audience-chart'), audRows, 'sessions', fmtInt(a.total_users || 0), 'Users', [COLORS.blue, COLORS.purple]);
    fillLegend('#audience-list', audRows, 'sessions', [COLORS.blue, COLORS.purple]);
    drawBarChart($('#device-chart'), (d.devices || []).length ? d.devices : [{ name: 'Desktop', sessions: 0 }], 'sessions', 'name');
  }

  // ---- Acquisition ----
  function renderAcquisition(d) {
    var t = d.totals || {};
    return '<section class="kpi-grid">' +
      kpiCard('Sessions', fmtInt(t.sessions), (d.changes || {}).sessions, COLORS.blue, (d.trend || []).map(function (x) { return x.sessions; })) +
      kpiCard('Channels', fmtInt((d.traffic_sources || []).length), null, COLORS.purple, []) +
      kpiCard('Source/Mediums', fmtInt((d.source_medium || []).length), null, COLORS.orange, []) +
      kpiCard('Campaigns', fmtInt((d.campaigns || []).length), null, COLORS.green, []) +
      '</section>' +
      '<section class="dashboard-grid">' +
        donutCard('sources', 'Traffic Sources', 'Channel mix') +
        tableCard('Source / Medium Performance', 'Quality of each source',
          ['Source / Medium', 'Sessions', 'Users', 'Bounce', 'Conv. Rate', 'Revenue'],
          d.source_medium || [],
          function (r) { return tableRow([escapeHtml(r.name), fmtInt(r.sessions), fmtInt(r.users), fmtPct(r.bounce_rate), fmtPct(r.conversion_rate, 2), fmtMoney(r.revenue)]); },
          'No source data yet.') +
        tableCard('Landing Pages', 'Where each session started',
          ['Landing Page', 'Sessions', 'Bounce', 'Conv.', 'Revenue'],
          d.landing_pages || [],
          function (r) { return tableRow([escapeHtml(r.landing_page || r.name), fmtInt(r.sessions), fmtPct(r.bounce_rate), fmtPct(r.conversion_rate, 2), fmtMoney(r.revenue)]); },
          'No landing page data yet.') +
        tableCard('Channels', 'Sessions by classified channel',
          ['Channel', 'Sessions', 'Users', 'Conv.', 'Revenue'],
          d.traffic_sources || [],
          function (r) { return tableRow([escapeHtml(r.name), fmtInt(r.sessions), fmtInt(r.users), fmtPct(r.conversion_rate, 2), fmtMoney(r.revenue)]); },
          'No channel data yet.') +
      '</section>';
  }
  function paintAcquisition(d) {
    drawDonut($('#sources-chart'), d.traffic_sources || [], 'sessions', fmtInt((d.totals || {}).sessions), 'Sessions', SOURCE_COLORS);
    fillLegend('#sources-list', d.traffic_sources || [], 'sessions', SOURCE_COLORS);
  }

  // ---- Behavior ----
  function renderBehavior(d) {
    var t = d.totals || {};
    return '<section class="kpi-grid">' +
      kpiCard('Pageviews', fmtInt(t.pageviews), (d.changes || {}).pageviews, COLORS.blue, (d.trend || []).map(function (x) { return x.pageviews; })) +
      kpiCard('Pages / Session', number(t.pages_per_session).toFixed(2), null, COLORS.purple, []) +
      kpiCard('Avg. Session', fmtDuration(t.avg_session_duration_ms), null, COLORS.orange, []) +
      kpiCard('Bounce Rate', fmtPct(t.bounce_rate), null, COLORS.red, []) +
      '</section>' +
      '<section class="dashboard-grid">' +
        chartCard('behavior-trend', 'card-xl', 'Pageviews Over Time', 'Daily volume', '<div class="legend inline"><span><i class="dot orange"></i>Pageviews</span></div>') +
        tableCard('Top Pages', 'Most viewed content',
          ['Page', 'Pageviews', 'Users'], d.pages || [],
          function (r) { return tableRow([escapeHtml(r.path), fmtInt(r.pageviews), fmtInt(r.users)]); }, 'No pageviews yet.') +
        tableCard('Events by Type', 'What visitors do',
          ['Event', 'Count'], (d.events_data || {}).by_type || [],
          function (r) { return tableRow(['<span class="pill">' + escapeHtml(r.name) + '</span>', fmtInt(r.count)]); }, 'No events tracked.') +
        funnelCard(d) +
      '</section>';
  }
  function paintBehavior(d) {
    drawLineChart($('#behavior-trend-chart'), d.trend || [], [{ key: 'pageviews', color: COLORS.orange }]);
  }

  // ---- Conversions ----
  function renderConversions(d) {
    var t = d.totals || {};
    return '<section class="kpi-grid">' +
      kpiCard('Conversions', fmtInt(t.conversions), (d.changes || {}).conversions, COLORS.green, (d.trend || []).map(function (x) { return x.conversions; })) +
      kpiCard('Conv. Rate', fmtPct(t.conversion_rate, 2), null, COLORS.purple, (d.trend || []).map(function (x) { return x.sessions ? x.conversions / x.sessions : 0; })) +
      kpiCard('Revenue', fmtMoney(t.revenue), (d.changes || {}).revenue, COLORS.orange, (d.trend || []).map(function (x) { return x.revenue; })) +
      kpiCard('Avg. Order Value', t.conversions ? fmtMoney(t.revenue / t.conversions) : '$0', null, COLORS.blue, []) +
      '</section>' +
      '<section class="dashboard-grid">' +
        chartCard('conv-trend', 'card-xl', 'Conversions Over Time', 'Daily completions and revenue', '<div class="legend inline"><span><i class="dot blue"></i>Conversions</span><span><i class="dot orange"></i>Revenue</span></div>') +
        funnelCard(d) +
        tableCard('Top Converting Channels', 'By conversion count',
          ['Channel', 'Sessions', 'Conv.', 'Rate', 'Revenue'],
          (d.traffic_sources || []).filter(function (r) { return r.conversions > 0; }).sort(function (a, b) { return b.conversions - a.conversions; }),
          function (r) { return tableRow([escapeHtml(r.name), fmtInt(r.sessions), fmtInt(r.conversions), fmtPct(r.conversion_rate, 2), fmtMoney(r.revenue)]); },
          'No converting channels yet.') +
        tableCard('Top Converting Landing Pages', 'Where conversions begin',
          ['Page', 'Sessions', 'Conv.', 'Rate', 'Revenue'],
          (d.landing_pages || []).filter(function (r) { return r.conversions > 0; }).sort(function (a, b) { return b.conversions - a.conversions; }),
          function (r) { return tableRow([escapeHtml(r.landing_page || r.name), fmtInt(r.sessions), fmtInt(r.conversions), fmtPct(r.conversion_rate, 2), fmtMoney(r.revenue)]); },
          'No converting landing pages yet.') +
      '</section>';
  }
  function paintConversions(d) {
    drawLineChart($('#conv-trend-chart'), d.trend || [], [
      { key: 'conversions', color: COLORS.blue }, { key: 'revenue', color: COLORS.orange }
    ]);
  }

  // ---- Music ----
  function renderMusic(d) {
    var m = d.music || {};
    var trend = (m.trend || []).map(function (x) { return { label: shortDate(x.date), streams: x.streams }; });
    return '<section class="kpi-grid">' +
      kpiCard('Total Streams', fmtInt(m.total_streams), null, COLORS.purple, (m.trend || []).map(function (x) { return x.streams; })) +
      kpiCard('Unique Listeners', fmtInt(m.unique_listeners), null, COLORS.blue, []) +
      kpiCard('Listening Time', fmtSeconds(m.total_seconds || 0), null, COLORS.orange, []) +
      kpiCard('Catalog Tracks', fmtInt(m.catalog_size), null, COLORS.teal, []) +
      '</section>' +
      '<section class="dashboard-grid">' +
        '<article class="card card-xl"><div class="card-header"><div><h2>Streams Over Time</h2><p>Qualified streams (≥30s) per day</p></div></div>' +
          '<canvas id="music-chart" height="280"></canvas></article>' +
        tableCard('Top Tracks', 'By qualified streams in this range',
          ['#', 'Track', 'Streams', 'Listeners', 'Avg. Listen'],
          (m.top_tracks || []).slice(0, 20),
          function (r, i) {
            var cover = r.cover_art_url ? '<img class="track-cover" src="' + escapeHtml(r.cover_art_url) + '" alt="">' : '<span class="track-cover placeholder">♬</span>';
            return tableRow([
              (i != null ? i + 1 : ''),
              '<div class="track-cell">' + cover + '<div><strong>' + escapeHtml(r.title) + '</strong><small>' + escapeHtml(r.artist) + '</small></div></div>',
              fmtInt(r.streams), fmtInt(r.listeners), fmtSeconds(r.avg_seconds)
            ]);
          },
          'No qualified streams in this date range.') +
      '</section>';
  }
  function paintMusic(d) {
    var m = d.music || {};
    var trend = (m.trend || []).map(function (x) { return { label: shortDate(x.date), streams: x.streams, date: x.date }; });
    drawLineChart($('#music-chart'), trend, [{ key: 'streams', color: COLORS.purple }]);
  }

  // ---- Campaigns ----
  function renderCampaigns(d) {
    return '<section class="kpi-grid">' +
      kpiCard('Campaigns Active', fmtInt((d.campaigns || []).length), null, COLORS.blue, []) +
      kpiCard('Campaign Sessions', fmtInt((d.campaigns || []).reduce(function (a, r) { return a + number(r.sessions); }, 0)), null, COLORS.purple, []) +
      kpiCard('Campaign Conv.', fmtInt((d.campaigns || []).reduce(function (a, r) { return a + number(r.conversions); }, 0)), null, COLORS.green, []) +
      kpiCard('Campaign Revenue', fmtMoney((d.campaigns || []).reduce(function (a, r) { return a + number(r.revenue); }, 0)), null, COLORS.orange, []) +
      '</section>' +
      '<section class="dashboard-grid">' +
        tableCard('All Campaigns', 'Full UTM campaign breakdown',
          ['Campaign', 'Sessions', 'Users', 'Conv.', 'Conv. Rate', 'Revenue', 'ROAS'],
          d.campaigns || [],
          function (r) { return tableRow([
            escapeHtml(r.campaign || r.name), fmtInt(r.sessions), fmtInt(r.users), fmtInt(r.conversions),
            fmtPct(r.conversion_rate, 2), fmtMoney(r.revenue),
            r.revenue ? (number(r.roas).toFixed(2) + 'x') : '<span class="muted">—</span>'
          ]); },
          'Campaigns appear when visitors arrive with UTM parameters (utm_campaign).') +
      '</section>';
  }

  // ---- Events ----
  function renderEvents(d) {
    var e = d.events_data || {};
    return '<section class="kpi-grid">' +
      kpiCard('Total Events', fmtInt(e.total), null, COLORS.blue, []) +
      kpiCard('Event Types', fmtInt((e.by_type || []).length), null, COLORS.purple, []) +
      kpiCard('Pageviews', fmtInt((d.totals || {}).pageviews), null, COLORS.orange, []) +
      kpiCard('Conversions', fmtInt((d.totals || {}).conversions), null, COLORS.green, []) +
      '</section>' +
      '<section class="dashboard-grid">' +
        '<article class="card card-xl"><div class="card-header"><div><h2>Events by Type</h2><p>What fired in this period</p></div></div>' +
          '<canvas id="events-bar" height="280"></canvas></article>' +
        tableCard('Recent Events', 'Last 50 events received',
          ['Time', 'Type', 'Page', 'Visitor', 'Country'],
          e.recent || [],
          function (r) { return tableRow([timeAgo(r.ts), '<span class="pill">' + escapeHtml(r.event_type) + '</span>', escapeHtml(r.path), escapeHtml(r.visitor_id || '—'), escapeHtml(r.country || '—')]); },
          'No events recorded yet.') +
      '</section>';
  }
  function paintEvents(d) {
    var e = d.events_data || {};
    drawBarChart($('#events-bar'), (e.by_type || []).slice(0, 10), 'count', 'name');
  }

  // ---- Reports ----
  function renderReports(d) {
    var t = d.totals || {};
    var summaryRows = [
      ['Date Range', (d.date_range || {}).start + ' → ' + (d.date_range || {}).end],
      ['Users', fmtInt(t.users)], ['Sessions', fmtInt(t.sessions)], ['Pageviews', fmtInt(t.pageviews)],
      ['Engagement Rate', fmtPct(t.engagement_rate)], ['Bounce Rate', fmtPct(t.bounce_rate)],
      ['Avg. Session', fmtDuration(t.avg_session_duration_ms)], ['Conversions', fmtInt(t.conversions)],
      ['Conversion Rate', fmtPct(t.conversion_rate, 2)], ['Revenue', fmtMoney(t.revenue)],
      ['Pages / Session', number(t.pages_per_session).toFixed(2)],
      ['Streams', fmtInt((d.music || {}).total_streams)], ['Listeners', fmtInt((d.music || {}).unique_listeners)]
    ];
    return '<section class="dashboard-grid">' +
      '<article class="card card-xl"><div class="card-header"><div><h2>Period Snapshot</h2><p>Headline metrics for ' + escapeHtml((d.date_range || {}).start + ' – ' + (d.date_range || {}).end) + '</p></div>' +
        '<button class="ghost-btn" onclick="window.__mrcapExport()">Export JSON</button></div>' +
        '<div class="table-wrap"><table><tbody>' +
        summaryRows.map(function (r) { return '<tr><td><strong>' + escapeHtml(r[0]) + '</strong></td><td>' + r[1] + '</td></tr>'; }).join('') +
        '</tbody></table></div></article>' +
      tableCard('Full Trend', 'Daily series for the selected window',
        ['Date', 'Users', 'Sessions', 'Pageviews', 'Conv.', 'Revenue'],
        d.trend || [],
        function (r) { return tableRow([escapeHtml(r.date), fmtInt(r.users), fmtInt(r.sessions), fmtInt(r.pageviews), fmtInt(r.conversions), fmtMoney(r.revenue)]); },
        'No trend rows yet.') +
      '</section>';
  }

  // ---- Explore ----
  function renderExplore(d) {
    var q = state.query.toLowerCase();
    function filt(rows, keys) {
      if (!q) return rows;
      return (rows || []).filter(function (r) { return keys.some(function (k) { return String(r[k] || '').toLowerCase().indexOf(q) >= 0; }); });
    }
    return '<section class="status-strip"><div><strong>Cross-table search</strong><span>Type in the topbar search to filter rows across all reports.</span></div><code>query: ' + escapeHtml(state.query || '(empty)') + '</code></section>' +
      '<section class="dashboard-grid">' +
        tableCard('Pages', '', ['Page', 'Pageviews', 'Users'], filt(d.pages, ['path', 'title']), function (r) { return tableRow([escapeHtml(r.path), fmtInt(r.pageviews), fmtInt(r.users)]); }, 'No matches.') +
        tableCard('Source / Medium', '', ['Name', 'Sessions', 'Users'], filt(d.source_medium, ['name']), function (r) { return tableRow([escapeHtml(r.name), fmtInt(r.sessions), fmtInt(r.users)]); }, 'No matches.') +
        tableCard('Landing Pages', '', ['Landing', 'Sessions', 'Conv.'], filt(d.landing_pages, ['landing_page', 'name']), function (r) { return tableRow([escapeHtml(r.landing_page || r.name), fmtInt(r.sessions), fmtInt(r.conversions)]); }, 'No matches.') +
        tableCard('Geo', '', ['Country', 'Users', 'Sessions'], filt(d.geo, ['country', 'name']), function (r) { return tableRow([escapeHtml(r.country || r.name), fmtInt(r.users), fmtInt(r.sessions)]); }, 'No matches.') +
        tableCard('Campaigns', '', ['Campaign', 'Sessions', 'Conv.', 'Revenue'], filt(d.campaigns, ['campaign', 'name']), function (r) { return tableRow([escapeHtml(r.campaign || r.name), fmtInt(r.sessions), fmtInt(r.conversions), fmtMoney(r.revenue)]); }, 'No matches.') +
        tableCard('Tracks', '', ['Title', 'Streams', 'Listeners'], filt((d.music || {}).top_tracks, ['title', 'artist', 'slug']), function (r) { return tableRow([escapeHtml(r.title), fmtInt(r.streams), fmtInt(r.listeners)]); }, 'No matches.') +
      '</section>';
  }

  // ---- Alerts ----
  function renderAlerts(d) {
    var t = d.technical || {};
    var feed = [
      { lvl: number(t.errors_404) ? 'bad' : 'good', title: '404 Errors', body: fmtInt(t.errors_404) + ' pageviews hit a 404 in this range.' },
      { lvl: number(t.traffic_anomalies) ? 'bad' : 'good', title: 'Traffic Anomaly Detector', body: number(t.traffic_anomalies) ? 'Last 7 days dropped >50% vs the prior 7.' : 'No anomalies in the past week.' },
      { lvl: /good/i.test(t.site_speed_status || '') ? 'good' : (/slow/i.test(t.site_speed_status || '') ? 'bad' : 'warn'), title: 'Site Speed', body: 'p75 load: ' + (t.site_speed_p75_ms == null ? 'no data' : (t.site_speed_p75_ms + 'ms')) + ' — ' + (t.site_speed_status || 'unknown') },
      { lvl: /healthy/i.test(t.tag_status || '') ? 'good' : 'warn', title: 'Tag Status', body: t.tag_status || 'Unknown' },
      { lvl: /healthy/i.test(t.conversion_tracking || '') ? 'good' : 'warn', title: 'Conversion Tracking', body: t.conversion_tracking || 'Unknown' }
    ];
    return '<section class="dashboard-grid">' +
      '<article class="card card-xl"><div class="card-header"><div><h2>Active Alerts</h2><p>Auto-generated from the latest summary</p></div></div>' +
        '<div class="alerts-list">' +
        feed.map(function (a) {
          var icon = a.lvl === 'good' ? '✓' : (a.lvl === 'bad' ? '!' : '△');
          return '<div class="alert-row"><span class="alert-icon ' + a.lvl + '">' + icon + '</span><strong>' + escapeHtml(a.title) + '</strong><span>' + escapeHtml(a.body) + '</span></div>';
        }).join('') +
        '</div></article>' +
      '</section>';
  }

  // ---- Annotations ----
  function renderAnnotations() {
    var rows = state.annotations.slice().sort(function (a, b) { return b.date.localeCompare(a.date); });
    return '<section class="dashboard-grid">' +
      '<article class="card card-xl"><div class="card-header"><div><h2>Add Annotation</h2><p>Pin a note to a date for context on trend changes</p></div></div>' +
        '<form id="ann-form" class="ann-form">' +
          '<input type="date" id="ann-date" required value="' + new Date().toISOString().slice(0, 10) + '">' +
          '<input type="text" id="ann-note" placeholder="e.g. Launched POMP campaign" required maxlength="200">' +
          '<button type="submit" class="ghost-btn">Save</button>' +
        '</form></article>' +
      tableCard('Saved Annotations', 'Stored locally in your browser',
        ['Date', 'Note', ''], rows,
        function (r) { return tableRow([escapeHtml(r.date), escapeHtml(r.note), '<button class="ghost-btn" data-del="' + escapeHtml(r.id) + '">Delete</button>']); },
        'No annotations yet — add one above.') +
      '</section>';
  }
  function wireAnnotations() {
    var form = $('#ann-form');
    if (form) form.addEventListener('submit', function (e) {
      e.preventDefault();
      var date = $('#ann-date').value;
      var note = $('#ann-note').value.trim();
      if (!date || !note) return;
      state.annotations.push({ id: Date.now().toString(36), date: date, note: note });
      localStorage.setItem('mrcap_annotations', JSON.stringify(state.annotations));
      $('#ann-note').value = '';
      mount();
    });
    $$('[data-del]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-del');
        state.annotations = state.annotations.filter(function (a) { return a.id !== id; });
        localStorage.setItem('mrcap_annotations', JSON.stringify(state.annotations));
        mount();
      });
    });
  }

  // ---- Data Quality ----
  function renderDataQuality(d) {
    var t = d.technical || {};
    var checks = [
      { label: 'Events in last 24h', value: fmtInt(t.events_24h), level: number(t.events_24h) > 0 ? 'good' : 'bad' },
      { label: 'Events in selected range', value: fmtInt(t.total_events_period), level: number(t.total_events_period) > 0 ? 'good' : 'warn' },
      { label: 'Last event received', value: t.last_event_at ? new Date(t.last_event_at).toLocaleString() : 'Never', level: t.last_event_at ? 'good' : 'bad' },
      { label: 'Tag status', value: t.tag_status, level: /healthy/i.test(t.tag_status || '') ? 'good' : 'warn' },
      { label: 'Conversion tracking', value: t.conversion_tracking, level: /healthy/i.test(t.conversion_tracking || '') ? 'good' : 'warn' },
      { label: '404 errors', value: fmtInt(t.errors_404), level: number(t.errors_404) ? 'warn' : 'good' },
      { label: 'Site speed p75', value: t.site_speed_p75_ms == null ? 'No data' : (t.site_speed_p75_ms + 'ms'), level: /good/i.test(t.site_speed_status || '') ? 'good' : (/slow/i.test(t.site_speed_status || '') ? 'bad' : 'warn') },
      { label: 'Traffic anomalies', value: fmtInt(t.traffic_anomalies), level: number(t.traffic_anomalies) ? 'bad' : 'good' }
    ];
    return '<section class="dashboard-grid">' +
      '<article class="card card-xl"><div class="card-header"><div><h2>Pipeline Health</h2><p>Tracker → analytics-collect → analytics_events → analytics-summary</p></div></div>' +
        '<div class="alerts-list">' +
        checks.map(function (c) {
          var icon = c.level === 'good' ? '✓' : (c.level === 'bad' ? '!' : '△');
          return '<div class="alert-row"><span class="alert-icon ' + c.level + '">' + icon + '</span><strong>' + escapeHtml(c.label) + '</strong><span class="' + (c.level === 'good' ? 'positive' : c.level === 'bad' ? 'negative' : '') + '">' + escapeHtml(String(c.value)) + '</span></div>';
        }).join('') +
        '</div></article>' +
      '</section>';
  }

  // ---------- mount/render ----------
  var RENDERERS = {
    overview:    { html: renderOverview,    paint: paintOverview },
    realtime:    { html: renderRealtime,    paint: paintRealtime },
    audience:    { html: renderAudience,    paint: paintAudience },
    acquisition: { html: renderAcquisition, paint: paintAcquisition },
    behavior:    { html: renderBehavior,    paint: paintBehavior },
    conversions: { html: renderConversions, paint: paintConversions },
    music:       { html: renderMusic,       paint: paintMusic },
    campaigns:   { html: renderCampaigns,   paint: function () {} },
    events:      { html: renderEvents,      paint: paintEvents },
    reports:     { html: renderReports,     paint: function () {} },
    explore:     { html: renderExplore,     paint: function () {} },
    alerts:      { html: renderAlerts,      paint: function () {} },
    annotations: { html: function () { return renderAnnotations(); }, paint: wireAnnotations },
    dataquality: { html: renderDataQuality, paint: function () {} }
  };

  function mount() {
    var meta = VIEWS[state.view] || VIEWS.overview;
    $('#view-title').textContent = meta.title;
    $('#view-eyebrow').textContent = meta.eyebrow;
    $$('#primary-nav .nav-item, #secondary-nav .nav-item').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-view') === state.view);
    });
    var renderer = RENDERERS[state.view] || RENDERERS.overview;
    var d = state.data || emptyData();
    $('#view-root').innerHTML = renderer.html(d);
    requestAnimationFrame(function () { renderer.paint(d); });
  }
  function emptyData() {
    return { totals: {}, changes: {}, trend: [], traffic_sources: [], source_medium: [], landing_pages: [], devices: [], geo: [], campaigns: [], pages: [], audience: {}, funnel: [], realtime: {}, events_data: {}, technical: {}, music: {}, date_range: {} };
  }

  // ---------- network ----------
  async function load() {
    try {
      setStatus('', 'Loading analytics…', 'Connecting to the summary API.');
      var url = 'https://qisamkiggoibjkkdtkxq.supabase.co/functions/v1/analytics-summary?days=' + encodeURIComponent(state.days);
      var res = await fetch(url, { headers: { 'x-dashboard-token': state.token } });
      if (res.status === 401) {
        setStatus('error', 'Dashboard token required.', 'Click "Set Token" in the sidebar and enter DASHBOARD_TOKEN.');
        return;
      }
      if (!res.ok) throw new Error('Summary API returned ' + res.status);
      var json = await res.json();
      state.data = json;
      mount();
      var pv = number((json.totals || {}).pageviews);
      if (!pv) {
        setStatus('warning', 'No traffic collected yet.', 'Verify the tracker snippet is deployed on your site.');
      } else {
        var last = json.technical && json.technical.last_event_at ? new Date(json.technical.last_event_at).toLocaleString() : 'just now';
        setStatus('success', 'Live analytics connected.', fmtInt(pv) + ' pageviews · ' + json.date_range.start + ' → ' + json.date_range.end + ' · last event ' + last);
      }
    } catch (err) {
      setStatus('error', 'Could not load analytics.', err.message || 'Network error.');
    }
  }

  // ---------- ui binding ----------
  function bind() {
    $$('#primary-nav .nav-item, #secondary-nav .nav-item').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.view = btn.getAttribute('data-view');
        mount();
      });
    });
    $('#days-select').addEventListener('change', function (e) {
      state.days = Number(e.target.value || 30); load();
    });
    $('#refresh-btn').addEventListener('click', load);
    $('#token-btn').addEventListener('click', function () {
      var v = prompt('Enter DASHBOARD_TOKEN', state.token || '');
      if (v) { state.token = v; localStorage.setItem('mrcap_dashboard_token', v); load(); }
    });
    $('#export-btn').addEventListener('click', exportJson);
    window.__mrcapExport = exportJson;
    $('#search-input').addEventListener('input', function (e) {
      state.query = e.target.value.trim();
      if (state.view === 'explore') mount();
    });
    window.addEventListener('resize', debounce(function () { mount(); }, 180));
  }
  function exportJson() {
    if (!state.data) return;
    var blob = new Blob([JSON.stringify(state.data, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = 'mrcap-analytics-' + new Date().toISOString().slice(0, 10) + '.json';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  function debounce(fn, wait) {
    var t; return function () { clearTimeout(t); var a = arguments; t = setTimeout(function () { fn.apply(null, a); }, wait); };
  }

  document.addEventListener('DOMContentLoaded', function () {
    bind();
    mount();
    load();
    setInterval(function () {
      // refresh more frequently when on Real-Time
      if (state.view === 'realtime' || state.view === 'overview') load();
    }, state.view === 'realtime' ? 30000 : 60000);
  });
})();
