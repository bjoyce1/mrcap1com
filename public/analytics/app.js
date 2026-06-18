(function () {
  'use strict';

  var COLORS = {
    blue: '#2279ff',
    blue2: '#43a2ff',
    purple: '#9a55ff',
    purple2: '#c278ff',
    orange: '#ff8a1d',
    red: '#ff4d45',
    green: '#34d87b',
    teal: '#26c6da',
    yellow: '#f9c846',
    pink: '#f052a7',
    grid: 'rgba(176,197,226,0.12)',
    muted: '#a9b5c8',
    muted2: '#78869b',
    text: '#f5f8ff'
  };
  var SOURCE_COLORS = [COLORS.blue, COLORS.orange, COLORS.teal, COLORS.purple, COLORS.pink, COLORS.yellow, COLORS.red, COLORS.green];
  var state = {
    data: null,
    days: 30,
    token: localStorage.getItem('mrcap_dashboard_token') || 'change-me',
    query: ''
  };

  var $ = function (sel) { return document.querySelector(sel); };
  var $$ = function (sel) { return [].slice.call(document.querySelectorAll(sel)); };

  function number(value) { return Number(value || 0); }
  function fmtInt(value) { return Math.round(number(value)).toLocaleString(); }
  function fmtMoney(value) { return '$' + Math.round(number(value)).toLocaleString(); }
  function fmtPct(value, digits) { return (number(value) * 100).toFixed(digits == null ? 1 : digits) + '%'; }
  function fmtPctChange(value) {
    var v = number(value);
    var sign = v >= 0 ? '+' : '';
    return sign + v.toFixed(Math.abs(v) >= 10 ? 1 : 1) + '%';
  }
  function fmtDuration(ms) {
    var total = Math.max(0, Math.round(number(ms) / 1000));
    var h = Math.floor(total / 3600);
    var m = Math.floor((total % 3600) / 60);
    var s = total % 60;
    return [h, m, s].map(function (x) { return String(x).padStart(2, '0'); }).join(':');
  }
  function safeText(value) { return String(value == null ? '' : value); }
  function escapeHtml(value) {
    return safeText(value).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[c];
    });
  }

  function setStatus(type, title, copy) {
    var strip = $('#status-strip');
    strip.classList.remove('warning', 'error', 'success');
    if (type) strip.classList.add(type);
    $('#status-title').textContent = title;
    $('#status-copy').textContent = copy;
  }

  function canvasSetup(canvas) {
    var ctx = canvas.getContext('2d');
    var rect = canvas.getBoundingClientRect();
    var dpr = Math.max(1, window.devicePixelRatio || 1);
    var width = Math.max(1, rect.width || canvas.width || 300);
    var height = Math.max(1, rect.height || canvas.height || 180);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    return { ctx: ctx, width: width, height: height };
  }

  function roundedRect(ctx, x, y, w, h, r) {
    var radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  }

  function drawSparkline(canvas, values, color) {
    if (!canvas) return;
    var setup = canvasSetup(canvas);
    var ctx = setup.ctx;
    var w = setup.width;
    var h = setup.height;
    var vals = values && values.length ? values.map(number) : [0, 0];
    var min = Math.min.apply(null, vals);
    var max = Math.max.apply(null, vals);
    var range = max - min || 1;
    var pad = 5;

    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    vals.forEach(function (v, i) {
      var x = pad + (i / Math.max(1, vals.length - 1)) * (w - pad * 2);
      var y = h - pad - ((v - min) / range) * (h - pad * 2);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();

    var gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, color + '55');
    gradient.addColorStop(1, color + '00');
    ctx.lineTo(w - pad, h - pad);
    ctx.lineTo(pad, h - pad);
    ctx.closePath();
    ctx.shadowBlur = 0;
    ctx.fillStyle = gradient;
    ctx.fill();
  }

  function drawLineChart(canvas, data) {
    var setup = canvasSetup(canvas);
    var ctx = setup.ctx;
    var w = setup.width;
    var h = setup.height;
    var pad = { top: 16, right: 20, bottom: 34, left: 46 };
    var rows = data && data.length ? data : [];
    var keys = [
      { key: 'users', label: 'Users', color: COLORS.blue },
      { key: 'sessions', label: 'Sessions', color: COLORS.purple },
      { key: 'pageviews', label: 'Pageviews', color: COLORS.orange }
    ];
    var max = Math.max(10, Math.max.apply(null, rows.flatMap(function (r) { return keys.map(function (k) { return number(r[k.key]); }); })));
    var plotW = w - pad.left - pad.right;
    var plotH = h - pad.top - pad.bottom;

    ctx.font = '12px Inter, system-ui, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.strokeStyle = COLORS.grid;
    ctx.fillStyle = COLORS.muted2;
    ctx.lineWidth = 1;

    for (var i = 0; i <= 4; i++) {
      var y = pad.top + (i / 4) * plotH;
      var val = max - (i / 4) * max;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(w - pad.right, y);
      ctx.stroke();
      ctx.fillText(formatCompact(val), 8, y);
    }

    var labels = pickDateLabels(rows, 5);
    labels.forEach(function (item) {
      var x = pad.left + (item.index / Math.max(1, rows.length - 1)) * plotW;
      ctx.fillStyle = COLORS.muted2;
      ctx.textAlign = 'center';
      ctx.fillText(shortDate(item.date), x, h - 12);
      ctx.strokeStyle = 'rgba(176,197,226,0.06)';
      ctx.beginPath();
      ctx.moveTo(x, pad.top);
      ctx.lineTo(x, h - pad.bottom);
      ctx.stroke();
    });
    ctx.textAlign = 'left';

    keys.forEach(function (series) {
      ctx.strokeStyle = series.color;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = series.color;
      ctx.shadowBlur = 12;
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
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      });
    });
  }

  function pickDateLabels(rows, count) {
    if (!rows.length) return [];
    var out = [];
    var step = Math.max(1, Math.floor((rows.length - 1) / Math.max(1, count - 1)));
    for (var i = 0; i < rows.length; i += step) out.push({ index: i, date: rows[i].date });
    if (out[out.length - 1].index !== rows.length - 1) out.push({ index: rows.length - 1, date: rows[rows.length - 1].date });
    return out.slice(0, count + 1);
  }

  function shortDate(iso) {
    try {
      var d = new Date(iso + 'T00:00:00');
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch (_) { return iso; }
  }

  function formatCompact(value) {
    var v = number(value);
    if (v >= 1000000) return (v / 1000000).toFixed(1) + 'M';
    if (v >= 1000) return Math.round(v / 100) / 10 + 'K';
    return String(Math.round(v));
  }

  function drawDonut(canvas, rows, valueKey, labelKey, centerValue, centerLabel, colors) {
    var setup = canvasSetup(canvas);
    var ctx = setup.ctx;
    var w = setup.width;
    var h = setup.height;
    var cx = w / 2;
    var cy = h / 2;
    var radius = Math.min(w, h) / 2 - 8;
    var thickness = Math.max(20, radius * 0.32);
    var total = rows.reduce(function (sum, r) { return sum + number(r[valueKey]); }, 0);
    var start = -Math.PI / 2;

    ctx.lineWidth = thickness;
    ctx.lineCap = 'butt';
    if (!total) {
      ctx.strokeStyle = 'rgba(176,197,226,0.12)';
      ctx.beginPath();
      ctx.arc(cx, cy, radius - thickness / 2, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      rows.forEach(function (row, i) {
        var angle = (number(row[valueKey]) / total) * Math.PI * 2;
        ctx.strokeStyle = colors[i % colors.length];
        ctx.beginPath();
        ctx.arc(cx, cy, radius - thickness / 2, start, start + angle - 0.012);
        ctx.stroke();
        start += angle;
      });
    }

    ctx.textAlign = 'center';
    ctx.fillStyle = COLORS.text;
    ctx.font = '800 26px Inter, system-ui, sans-serif';
    ctx.fillText(centerValue || '0', cx, cy - 5);
    ctx.fillStyle = COLORS.muted2;
    ctx.font = '12px Inter, system-ui, sans-serif';
    ctx.fillText(centerLabel || '', cx, cy + 18);
  }

  function drawBarChart(canvas, rows) {
    var setup = canvasSetup(canvas);
    var ctx = setup.ctx;
    var w = setup.width;
    var h = setup.height;
    var pad = { top: 18, right: 12, bottom: 36, left: 34 };
    var plotW = w - pad.left - pad.right;
    var plotH = h - pad.top - pad.bottom;
    var max = Math.max(1, Math.max.apply(null, rows.map(function (r) { return number(r.sessions); })));

    ctx.font = '12px Inter, system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (var i = 0; i <= 4; i++) {
      var y = pad.top + (i / 4) * plotH;
      ctx.strokeStyle = COLORS.grid;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(w - pad.right, y);
      ctx.stroke();
      ctx.fillStyle = COLORS.muted2;
      ctx.fillText(formatCompact(max - (i / 4) * max), pad.left - 8, y);
    }

    var gap = 18;
    var barW = Math.min(54, (plotW - gap * Math.max(0, rows.length - 1)) / Math.max(1, rows.length));
    rows.forEach(function (row, i) {
      var x = pad.left + i * (barW + gap) + (plotW - (rows.length * barW + Math.max(0, rows.length - 1) * gap)) / 2;
      var bh = (number(row.sessions) / max) * plotH;
      var y = pad.top + plotH - bh;
      var color = SOURCE_COLORS[i % SOURCE_COLORS.length];
      var grad = ctx.createLinearGradient(0, y, 0, y + bh);
      grad.addColorStop(0, color);
      grad.addColorStop(1, color + '88');
      ctx.fillStyle = grad;
      ctx.shadowColor = color;
      ctx.shadowBlur = 14;
      roundedRect(ctx, x, y, barW, bh, 8);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = COLORS.muted;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(row.name.slice(0, 9), x + barW / 2, h - 24);
    });
  }

  function renderKpis(data) {
    var totals = data.totals || {};
    var changes = data.changes || {};
    var trend = data.trend || [];
    var kpis = [
      { label: 'Total Users', value: fmtInt(totals.users), change: changes.users, goodDown: false, color: COLORS.blue, series: trend.map(function (x) { return x.users; }) },
      { label: 'Sessions', value: fmtInt(totals.sessions), change: changes.sessions, goodDown: false, color: COLORS.blue, series: trend.map(function (x) { return x.sessions; }) },
      { label: 'Pageviews', value: fmtInt(totals.pageviews), change: changes.pageviews, goodDown: false, color: COLORS.blue, series: trend.map(function (x) { return x.pageviews; }) },
      { label: 'Engagement Rate', value: fmtPct(totals.engagement_rate), change: null, color: COLORS.purple, series: trend.map(function (x) { return x.sessions ? x.pageviews / x.sessions : 0; }) },
      { label: 'Bounce Rate', value: fmtPct(totals.bounce_rate), change: null, color: COLORS.red, series: trend.map(function (x) { return x.sessions ? Math.max(1, x.pageviews / x.sessions) : 0; }) },
      { label: 'Conversions', value: fmtInt(totals.conversions), change: changes.conversions, color: COLORS.blue, series: trend.map(function (x) { return x.conversions; }) },
      { label: 'Conversion Rate', value: fmtPct(totals.conversion_rate, 2), change: null, color: COLORS.purple, series: trend.map(function (x) { return x.sessions ? x.conversions / x.sessions : 0; }) },
      { label: 'Revenue', value: fmtMoney(totals.revenue), change: changes.revenue, color: COLORS.orange, series: trend.map(function (x) { return x.revenue; }) }
    ];

    $('#kpi-grid').innerHTML = kpis.map(function (kpi, idx) {
      var hasChange = kpi.change !== null && kpi.change !== undefined && Number.isFinite(kpi.change);
      var negative = hasChange && kpi.change < 0;
      return '<article class="kpi-card" style="--accent:' + kpi.color + '">' +
        '<div class="kpi-label">' + escapeHtml(kpi.label) + '</div>' +
        '<div class="kpi-value">' + escapeHtml(kpi.value) + '</div>' +
        '<div class="kpi-change ' + (negative ? 'negative' : '') + '">' + (hasChange ? (negative ? '↓ ' + Math.abs(kpi.change).toFixed(1) + '%' : '↑ ' + Math.abs(kpi.change).toFixed(1) + '%') : 'Live tracking') + '</div>' +
        '<canvas class="sparkline" data-kpi-index="' + idx + '"></canvas>' +
      '</article>';
    }).join('');

    $$('.sparkline').forEach(function (canvas) {
      var kpi = kpis[number(canvas.dataset.kpiIndex)];
      drawSparkline(canvas, kpi.series, kpi.color);
    });
  }

  function filteredRows(rows, keyNames) {
    if (!state.query) return rows;
    var q = state.query.toLowerCase();
    return rows.filter(function (row) {
      return keyNames.some(function (key) { return safeText(row[key] || row.name || '').toLowerCase().indexOf(q) >= 0; });
    });
  }

  function renderTable(selector, rows, emptyLabel, rowMapper) {
    var tbody = document.querySelector(selector + ' tbody');
    if (!tbody) return;
    if (!rows.length) {
      tbody.innerHTML = '<tr><td colspan="8"><div class="empty-state">' + escapeHtml(emptyLabel) + '</div></td></tr>';
      return;
    }
    tbody.innerHTML = rows.map(rowMapper).join('');
  }

  function renderSources(data) {
    var rows = data.traffic_sources || [];
    drawDonut($('#sources-chart'), rows, 'sessions', 'name', fmtInt(data.totals.sessions), 'Sessions', SOURCE_COLORS);
    var total = rows.reduce(function (sum, r) { return sum + number(r.sessions); }, 0);
    $('#source-list').innerHTML = rows.length ? rows.map(function (row, i) {
      return '<div class="source-row"><i class="dot" style="background:' + SOURCE_COLORS[i % SOURCE_COLORS.length] + ';color:' + SOURCE_COLORS[i % SOURCE_COLORS.length] + '"></i>' +
        '<span>' + escapeHtml(row.name) + '<small>' + fmtPct(total ? row.sessions / total : 0) + '</small></span>' +
        '<strong>' + fmtInt(row.sessions) + '</strong></div>';
    }).join('') : '<div class="empty-state">Traffic sources will appear after the tracker records sessions.</div>';
  }

  function renderDevices(data) {
    var rows = data.devices || [];
    drawBarChart($('#device-chart'), rows.length ? rows : [{ name: 'Desktop', sessions: 0 }, { name: 'Mobile', sessions: 0 }, { name: 'Tablet', sessions: 0 }]);
    var total = rows.reduce(function (sum, r) { return sum + number(r.sessions); }, 0);
    $('#device-list').innerHTML = rows.length ? rows.map(function (row, i) {
      return '<div class="metric-row"><i class="dot" style="background:' + SOURCE_COLORS[i % SOURCE_COLORS.length] + ';color:' + SOURCE_COLORS[i % SOURCE_COLORS.length] + '"></i>' +
        '<span>' + escapeHtml(row.name) + '<small>' + fmtPct(total ? row.sessions / total : 0) + '</small></span>' +
        '<strong>' + fmtInt(row.sessions) + '</strong></div>';
    }).join('') : '<div class="empty-state">Device mix appears after traffic arrives.</div>';
  }

  function renderFunnel(data) {
    var rows = data.funnel || [];
    var colors = [COLORS.blue, COLORS.purple, COLORS.pink, COLORS.orange, COLORS.teal];
    if (!rows.length) {
      $('#funnel').innerHTML = '<div class="empty-state">Funnel stages will populate as visitors view pages and submit forms.</div>';
      return;
    }
    $('#funnel').innerHTML = rows.map(function (row, i) {
      var width = Math.max(4, number(row.rate_from_start) * 100);
      return '<div class="funnel-row">' +
        '<div class="funnel-label">' + escapeHtml(row.label) + '</div>' +
        '<div class="funnel-bar-wrap"><div class="funnel-bar" style="width:' + width.toFixed(1) + '%;background:linear-gradient(90deg,' + colors[i % colors.length] + ',' + colors[(i + 1) % colors.length] + ')"></div></div>' +
        '<div class="funnel-value"><strong>' + fmtInt(row.sessions) + '</strong><span>' + fmtPct(row.rate_from_start) + '</span></div>' +
      '</div>';
    }).join('');
  }

  function renderAudience(data) {
    var audience = data.audience || {};
    var rows = [
      { name: 'New Users', sessions: audience.new_users || 0 },
      { name: 'Returning Users', sessions: audience.returning_users || 0 }
    ];
    drawDonut($('#audience-chart'), rows, 'sessions', 'name', fmtInt(audience.total_users || 0), 'Total Users', [COLORS.blue, COLORS.purple]);
    var total = number(audience.total_users);
    $('#audience-list').innerHTML = rows.map(function (row, i) {
      return '<div class="metric-row"><i class="dot" style="background:' + [COLORS.blue, COLORS.purple][i] + ';color:' + [COLORS.blue, COLORS.purple][i] + '"></i>' +
        '<span>' + escapeHtml(row.name) + '<small>' + fmtPct(total ? row.sessions / total : 0) + '</small></span>' +
        '<strong>' + fmtInt(row.sessions) + '</strong></div>';
    }).join('');
  }

  function renderAlerts(data) {
    var t = data.technical || {};
    var rows = [
      { label: 'Tag Status', value: t.tag_status || 'Unknown', level: (t.tag_status || '').toLowerCase() === 'healthy' ? 'good' : 'warn' },
      { label: 'Conversion Tracking', value: t.conversion_tracking || 'Unknown', level: (t.conversion_tracking || '').toLowerCase() === 'healthy' ? 'good' : 'warn' },
      { label: '404 Errors', value: fmtInt(t.errors_404 || 0) + ' errors', level: number(t.errors_404) ? 'warn' : 'good' },
      { label: 'Site Speed', value: t.site_speed_status || 'Unknown', level: /good/i.test(t.site_speed_status || '') ? 'good' : (/slow/i.test(t.site_speed_status || '') ? 'bad' : 'warn') },
      { label: 'Traffic Anomalies', value: fmtInt(t.traffic_anomalies || 0) + ' anomalies', level: number(t.traffic_anomalies) ? 'bad' : 'good' }
    ];
    $('#alerts-list').innerHTML = rows.map(function (row) {
      var icon = row.level === 'good' ? '✓' : (row.level === 'bad' ? '!' : '△');
      return '<div class="alert-row"><span class="alert-icon ' + row.level + '">' + icon + '</span><strong>' + escapeHtml(row.label) + '</strong><span class="' + (row.level === 'good' ? 'positive' : row.level === 'bad' ? 'negative' : '') + '">' + escapeHtml(row.value) + '</span></div>';
    }).join('');
  }

  function renderTables(data) {
    renderTable('#landing-table', filteredRows(data.landing_pages || [], ['landing_page', 'name']).slice(0, 8), 'Landing pages will appear after pageviews are collected.', function (row) {
      return '<tr><td>' + escapeHtml(row.landing_page || row.name) + '</td><td>' + fmtInt(row.sessions) + '</td><td>' + fmtPct(row.bounce_rate) + '</td><td>' + fmtPct(row.conversion_rate, 2) + '</td><td>' + fmtMoney(row.revenue) + '</td></tr>';
    });

    renderTable('#source-medium-table', filteredRows(data.source_medium || [], ['name']).slice(0, 8), 'Source / medium rows will appear after sessions are collected.', function (row) {
      return '<tr><td>' + escapeHtml(row.name) + '</td><td>' + fmtInt(row.sessions) + '</td><td>' + fmtInt(row.users) + '</td><td>' + fmtPct(row.bounce_rate) + '</td><td>' + fmtPct(row.conversion_rate, 2) + '</td></tr>';
    });

    renderTable('#geo-table', filteredRows(data.geo || [], ['country', 'name']).slice(0, 8), 'Geo reporting needs traffic and, ideally, a host/CDN that passes country headers.', function (row) {
      return '<tr><td>' + escapeHtml(row.country || row.name) + '</td><td>' + fmtInt(row.users) + '</td><td>' + fmtInt(row.sessions) + '</td></tr>';
    });

    renderTable('#campaign-table', filteredRows(data.campaigns || [], ['campaign', 'name']).slice(0, 8), 'Campaigns appear when visitors arrive with UTM campaign parameters.', function (row) {
      return '<tr><td>' + escapeHtml(row.campaign || row.name) + '</td><td>' + fmtInt(row.sessions) + '</td><td>' + fmtInt(row.conversions) + '</td><td class="muted">—</td><td>' + (row.revenue ? (number(row.roas).toFixed(2) + 'x') : '<span class="muted">—</span>') + '</td></tr>';
    });

    renderTable('#pages-table', filteredRows(data.pages || [], ['path', 'title']).slice(0, 8), 'Top pages appear after pageviews arrive.', function (row) {
      return '<tr><td>' + escapeHtml(row.path) + '</td><td>' + fmtInt(row.pageviews) + '</td></tr>';
    });
  }

  function drawDurationChart(data) {
    var trend = data.trend || [];
    var vals = trend.map(function (x) { return x.sessions ? Math.round((x.pageviews / x.sessions) * 60) : 0; });
    drawSparkline($('#duration-chart'), vals, COLORS.blue);
  }

  function render(data) {
    state.data = data;
    renderKpis(data);
    drawLineChart($('#traffic-chart'), data.trend || []);
    renderSources(data);
    renderTables(data);
    renderDevices(data);
    renderFunnel(data);
    renderAudience(data);
    $('#avg-session-duration').textContent = fmtDuration(data.totals.avg_session_duration_ms);
    drawDurationChart(data);
    renderAlerts(data);

    var pageviews = number(data.totals.pageviews);
    if (!pageviews) {
      setStatus('warning', 'No live traffic collected yet.', 'Deploy the tracker snippet on mrcap1.com or run npm run seed to preview demo traffic.');
    } else {
      var last = data.technical && data.technical.last_event_at ? new Date(data.technical.last_event_at).toLocaleString() : 'just now';
      setStatus('success', 'Live analytics connected.', 'Showing ' + fmtInt(pageviews) + ' pageviews for ' + data.date_range.start + ' through ' + data.date_range.end + '. Last event: ' + last + '.');
    }
  }

  async function load() {
    try {
      setStatus('', 'Loading analytics…', 'Connecting to the summary API.');
      var url = '/api/summary?days=' + encodeURIComponent(state.days);
      var res = await fetch(url, { headers: { 'x-dashboard-token': state.token } });
      if (res.status === 401) {
        setStatus('error', 'Dashboard token required.', 'Click the key icon and enter DASHBOARD_TOKEN from your server environment.');
        return;
      }
      if (!res.ok) throw new Error('Summary API returned ' + res.status);
      var json = await res.json();
      render(json);
    } catch (err) {
      setStatus('error', 'Could not load analytics.', err.message || 'Check that the Node server is running.');
    }
  }

  function bindUi() {
    $('#days-select').addEventListener('change', function (e) {
      state.days = Number(e.target.value || 30);
      load();
    });
    $('#refresh-btn').addEventListener('click', load);
    $('#token-btn').addEventListener('click', function () {
      var value = prompt('Enter dashboard token', state.token || '');
      if (value) {
        state.token = value;
        localStorage.setItem('mrcap_dashboard_token', value);
        load();
      }
    });
    $('#search-input').addEventListener('input', function (e) {
      state.query = e.target.value.trim();
      if (state.data) renderTables(state.data);
    });
    window.addEventListener('resize', debounce(function () {
      if (state.data) render(state.data);
    }, 160));
  }

  function debounce(fn, wait) {
    var timer;
    return function () {
      clearTimeout(timer);
      var args = arguments;
      timer = setTimeout(function () { fn.apply(null, args); }, wait);
    };
  }

  document.addEventListener('DOMContentLoaded', function () {
    bindUi();
    load();
    setInterval(load, 60000);
  });
})();
