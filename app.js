/* ═══════════════════════════════════════════
   FINSMART — APPLICATION LOGIC
   ═══════════════════════════════════════════ */

'use strict';

// ═══════════ STATE ═══════════
let state = {
  transactions: [
    { id: 1, date: '2026-04-15', desc: 'Kopi Kenangan',          cat: '☕ Kopi & Jajan',   type: 'expense', amount: 25000 },
    { id: 2, date: '2026-04-15', desc: 'Transportasi angkot',    cat: '🚌 Transportasi',    type: 'expense', amount: 10000 },
    { id: 3, date: '2026-04-14', desc: 'Gaji Part-time Cafe',    cat: '💼 Gaji Part-time',  type: 'income',  amount: 300000 },
    { id: 4, date: '2026-04-14', desc: 'Makan Siang Warteg',     cat: '🍜 Makan & Minum',   type: 'expense', amount: 22000 },
    { id: 5, date: '2026-04-14', desc: 'Buku Pelajaran',         cat: '📚 Pendidikan',      type: 'expense', amount: 85000 },
    { id: 6, date: '2026-04-13', desc: 'Uang Jajan',             cat: '💰 Uang Jajan',      type: 'income',  amount: 500000 },
    { id: 7, date: '2026-04-12', desc: 'Game Mobile',            cat: '🎮 Hiburan',         type: 'expense', amount: 50000 },
    { id: 8, date: '2026-04-10', desc: 'Gaji Part-time Cafe',    cat: '💼 Gaji Part-time',  type: 'income',  amount: 450000 },
  ],
  simType: 'compound',
  activeQuickType: 'expense',
};

// ═══════════ NAVIGATION ═══════════
function goTo(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  document.querySelector(`[data-page="${page}"]`).classList.add('active');
  if (window.innerWidth <= 900) closeSidebar();
}

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => goTo(item.dataset.page));
});

// Hamburger
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
hamburger.addEventListener('click', () => sidebar.classList.toggle('open'));
function closeSidebar() { sidebar.classList.remove('open'); }

// Filter tabs (ledger & edu)
document.querySelectorAll('.filter-tab').forEach(tab => {
  tab.addEventListener('click', function() {
    this.closest('.filter-tabs').querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    this.classList.add('active');
  });
});

document.querySelectorAll('.edu-cat').forEach(cat => {
  cat.addEventListener('click', function() {
    document.querySelectorAll('.edu-cat').forEach(c => c.classList.remove('active'));
    this.classList.add('active');
  });
});

// Quick tab toggle
document.querySelectorAll('.quick-tab').forEach(tab => {
  tab.addEventListener('click', function() {
    document.querySelectorAll('.quick-tab').forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    state.activeQuickType = this.dataset.type;
  });
});

// ═══════════ QUICK ADD ═══════════
function quickAdd() {
  const amountEl = document.getElementById('quickAmount');
  const catEl    = document.getElementById('quickCategory');
  const noteEl   = document.getElementById('quickNote');

  const amount = parseInt(amountEl.value);
  const cat    = catEl.value;

  if (!amount || amount <= 0) { showToast('⚠️ Masukkan jumlah yang valid', 'warning'); return; }
  if (!cat) { showToast('⚠️ Pilih kategori terlebih dahulu', 'warning'); return; }

  const tx = {
    id: Date.now(),
    date: new Date().toISOString().slice(0,10),
    desc: noteEl.value || cat.replace(/^.*? /, ''),
    cat,
    type: state.activeQuickType,
    amount,
  };

  state.transactions.unshift(tx);
  renderTxList();
  amountEl.value = '';
  catEl.value = '';
  noteEl.value = '';
  showToast(`✅ Transaksi ${state.activeQuickType === 'income' ? 'pemasukan' : 'pengeluaran'} ditambahkan!`, 'success');
}

function renderTxList() {
  const list = document.getElementById('txList');
  if (!list) return;
  list.innerHTML = state.transactions.slice(0,5).map(tx => {
    const isIn = tx.type === 'income';
    const emoji = getEmoji(tx.cat);
    return `
      <div class="tx-item">
        <div class="tx-icon ${isIn ? 'tx-in' : 'tx-out'}">${emoji}</div>
        <div class="tx-info">
          <div class="tx-name">${tx.desc}</div>
          <div class="tx-date">${formatDate(tx.date)}</div>
        </div>
        <div class="tx-amount ${isIn ? 'positive' : 'negative'}">
          ${isIn ? '+' : '-'}Rp ${tx.amount.toLocaleString('id-ID')}
        </div>
      </div>`;
  }).join('');
}

function getEmoji(cat) {
  if (cat.includes('Kopi') || cat.includes('kopi')) return '☕';
  if (cat.includes('Transport')) return '🚌';
  if (cat.includes('Gaji')) return '💼';
  if (cat.includes('Makan')) return '🍜';
  if (cat.includes('Pendidikan')) return '📚';
  if (cat.includes('Uang')) return '💰';
  if (cat.includes('Hiburan')) return '🎮';
  if (cat.includes('Belanja')) return '🛍️';
  return '💳';
}

function formatDate(d) {
  const date = new Date(d);
  const now = new Date();
  const diff = Math.round((now - date) / 86400000);
  if (diff === 0) return 'Hari ini';
  if (diff === 1) return 'Kemarin';
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

// ═══════════ AUTO-POCKET SLIDER ═══════════
function updateAPPercent() {
  const val = parseInt(document.getElementById('apPercent').value);
  document.getElementById('apPercentVal').textContent = val + '%';
  const base = 500000;
  const amount = Math.round(base * val / 100);
  document.getElementById('apAmount').textContent = 'Rp ' + amount.toLocaleString('id-ID');
}

// ═══════════ GROWTH SIMULATOR ═══════════
let simChart = null;

function runSimulator() {
  const initial  = parseFloat(document.getElementById('simInitial').value) || 0;
  const monthly  = parseFloat(document.getElementById('simMonthly').value) || 0;
  const rateAnn  = parseFloat(document.getElementById('simRate').value) || 0;
  const years    = parseInt(document.getElementById('simYears').value) || 1;
  const months   = years * 12;
  const rateM    = rateAnn / 100 / 12;

  const labels = [];
  const valuesCompound = [];
  const valuesPrincipal = [];

  let balance = initial;

  for (let m = 0; m <= months; m++) {
    if (m % Math.max(1, Math.floor(months / 20)) === 0 || m === months) {
      labels.push(m === 0 ? 'Mulai' : `${Math.round(m/12*10)/10}th`);
      valuesCompound.push(Math.round(balance));
      const principal = initial + monthly * m;
      valuesPrincipal.push(Math.round(principal));
    }
    if (state.simType === 'compound') {
      balance = balance * (1 + rateM) + monthly;
    } else {
      // simple: add monthly and add flat interest on initial
      balance += monthly + (initial * rateAnn / 100 / 12);
    }
  }

  const finalVal = Math.round(balance);
  const principal = Math.round(initial + monthly * months);
  const interest = finalVal - principal;

  document.getElementById('simResultValue').textContent = 'Rp ' + finalVal.toLocaleString('id-ID');
  document.getElementById('simPrincipal').textContent = 'Rp ' + principal.toLocaleString('id-ID');
  document.getElementById('simInterest').textContent = 'Rp ' + Math.max(0, interest).toLocaleString('id-ID');
  document.getElementById('insightNoSave').textContent = 'Rp ' + initial.toLocaleString('id-ID');
  const mult = principal > 0 ? (finalVal / principal).toFixed(1) : '∞';
  document.getElementById('insightMultiplier').textContent = mult + 'x';

  drawSimChart(labels, valuesCompound, valuesPrincipal);
}

function drawSimChart(labels, values, principal) {
  const canvas = document.getElementById('simChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.parentElement.clientWidth || 500;
  const H = 200;
  canvas.width = W;
  canvas.height = H;

  ctx.clearRect(0, 0, W, H);

  const pad = { top: 10, right: 20, bottom: 30, left: 60 };
  const chartW = W - pad.left - pad.right;
  const chartH = H - pad.top - pad.bottom;

  const maxVal = Math.max(...values, 1);

  // Grid lines
  ctx.strokeStyle = 'rgba(42,47,69,0.8)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + chartH - (i / 4) * chartH;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(pad.left + chartW, y);
    ctx.stroke();
    // Y label
    ctx.fillStyle = '#5a6380';
    ctx.font = '10px DM Sans, sans-serif';
    ctx.textAlign = 'right';
    const val = (maxVal * i / 4);
    ctx.fillText(formatMillions(val), pad.left - 6, y + 4);
  }

  // X labels
  ctx.fillStyle = '#5a6380';
  ctx.font = '10px DM Sans, sans-serif';
  ctx.textAlign = 'center';
  const step = Math.max(1, Math.floor(labels.length / 6));
  labels.forEach((l, i) => {
    if (i % step === 0 || i === labels.length - 1) {
      const x = pad.left + (i / (labels.length - 1)) * chartW;
      ctx.fillText(l, x, H - 5);
    }
  });

  // Principal area (fill)
  ctx.beginPath();
  ctx.moveTo(pad.left, pad.top + chartH);
  principal.forEach((v, i) => {
    const x = pad.left + (i / (values.length - 1)) * chartW;
    const y = pad.top + chartH - (v / maxVal) * chartH;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.lineTo(pad.left + chartW, pad.top + chartH);
  ctx.closePath();
  ctx.fillStyle = 'rgba(61,157,243,0.15)';
  ctx.fill();

  // Compound gradient fill
  const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + chartH);
  grad.addColorStop(0, 'rgba(0,214,143,0.3)');
  grad.addColorStop(1, 'rgba(0,214,143,0.02)');
  ctx.beginPath();
  values.forEach((v, i) => {
    const x = pad.left + (i / (values.length - 1)) * chartW;
    const y = pad.top + chartH - (v / maxVal) * chartH;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.lineTo(pad.left + chartW, pad.top + chartH);
  ctx.lineTo(pad.left, pad.top + chartH);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Lines
  const drawLine = (data, color, width = 2) => {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineJoin = 'round';
    data.forEach((v, i) => {
      const x = pad.left + (i / (data.length - 1)) * chartW;
      const y = pad.top + chartH - (v / maxVal) * chartH;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();
  };

  drawLine(principal, '#3d9df3', 1.5);
  drawLine(values, '#00d68f', 2.5);
}

function formatMillions(v) {
  if (v >= 1e9) return (v/1e9).toFixed(1) + 'M';
  if (v >= 1e6) return (v/1e6).toFixed(1) + 'jt';
  if (v >= 1e3) return (v/1e3).toFixed(0) + 'rb';
  return v.toFixed(0);
}

function updateSimMonthly() {
  const v = parseFloat(document.getElementById('simMonthly').value);
  document.getElementById('simMonthlyLabel').textContent = 'Rp ' + v.toLocaleString('id-ID');
  runSimulator();
}
function updateSimRate() {
  const v = parseFloat(document.getElementById('simRate').value);
  document.getElementById('simRateLabel').textContent = v + '%';
  runSimulator();
}
function updateSimYears() {
  const v = parseInt(document.getElementById('simYears').value);
  document.getElementById('simYearsLabel').textContent = v + ' Tahun';
  runSimulator();
}
function setSimType(type, btn) {
  state.simType = type;
  document.querySelectorAll('.sim-type-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  runSimulator();
}

// ═══════════ PIE CHART ═══════════
function drawPieChart() {
  const svg = document.getElementById('pieChart');
  if (!svg) return;

  const categories = [
    { name: 'Kopi & Jajan', pct: 30, color: '#ff9f43' },
    { name: 'Makan & Minum', pct: 28, color: '#00d68f' },
    { name: 'Transportasi', pct: 15, color: '#3d9df3' },
    { name: 'Hiburan',      pct: 13, color: '#6c63ff' },
    { name: 'Pendidikan',   pct: 11, color: '#ff5e7d' },
    { name: 'Lainnya',      pct:  3, color: '#8892b0' },
  ];

  const cx = 100, cy = 100, r = 80;
  let startAngle = -Math.PI / 2;
  let paths = '';

  categories.forEach(cat => {
    const angle = (cat.pct / 100) * 2 * Math.PI;
    const endAngle = startAngle + angle;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const large = angle > Math.PI ? 1 : 0;
    paths += `<path d="M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z" fill="${cat.color}" opacity="0.85" stroke="var(--bg)" stroke-width="2"/>`;
    startAngle = endAngle;
  });

  // Donut hole
  paths += `<circle cx="${cx}" cy="${cy}" r="45" fill="var(--card)"/>`;
  // Center text
  paths += `<text x="${cx}" y="${cy-6}" text-anchor="middle" fill="var(--text)" font-family="Syne,sans-serif" font-size="14" font-weight="800">Rp 780</text>`;
  paths += `<text x="${cx}" y="${cy+10}" text-anchor="middle" fill="var(--text2)" font-family="DM Sans,sans-serif" font-size="9">ribu / bulan</text>`;

  svg.innerHTML = paths;

  // Legend
  const legend = document.getElementById('pieLegend');
  if (legend) {
    legend.innerHTML = categories.map(cat => `
      <div class="pie-legend-item">
        <div class="pie-legend-dot" style="background:${cat.color}"></div>
        <span class="pie-legend-label">${cat.name}</span>
        <span class="pie-legend-pct" style="color:${cat.color}">${cat.pct}%</span>
      </div>
    `).join('');
  }
}

// ═══════════ BAR CHART ═══════════
function drawBarChart() {
  const container = document.getElementById('barChart');
  if (!container) return;
  const days = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15'];
  const amounts = [45000, 0, 82000, 35000, 120000, 55000, 0, 78000, 95000, 42000, 0, 65000, 107000, 59000, 35000];
  const maxAmt = Math.max(...amounts);
  container.innerHTML = days.map((d, i) => {
    const pct = amounts[i] ? (amounts[i] / maxAmt * 100) : 2;
    return `
      <div class="bar-col">
        <div class="bar-fill" style="height:${pct}%"></div>
        <div class="bar-label">${d}</div>
      </div>`;
  }).join('');
}

// ═══════════ MODAL ═══════════
function openModal(type) {
  const overlay = document.getElementById('modalOverlay');
  const content = document.getElementById('modalContent');

  if (type === 'addTx') {
    content.innerHTML = `
      <h2 class="modal-title">+ Tambah Transaksi</h2>
      <div class="modal-form">
        <div class="quick-tabs" style="margin-bottom:0">
          <button class="quick-tab active" onclick="selectModalType('expense',this)">Pengeluaran</button>
          <button class="quick-tab" onclick="selectModalType('income',this)">Pemasukan</button>
        </div>
        <div>
          <label class="form-label">Jumlah</label>
          <input type="number" id="m_amount" placeholder="Rp 0">
        </div>
        <div>
          <label class="form-label">Kategori</label>
          <select id="m_cat">
            <option value="">Pilih kategori...</option>
            <option>🍜 Makan & Minum</option>
            <option>🚌 Transportasi</option>
            <option>🎮 Hiburan</option>
            <option>📚 Pendidikan</option>
            <option>🛍️ Belanja</option>
            <option>☕ Kopi & Jajan</option>
            <option>💼 Gaji Part-time</option>
            <option>💰 Uang Jajan</option>
          </select>
        </div>
        <div>
          <label class="form-label">Keterangan</label>
          <input type="text" id="m_desc" placeholder="Contoh: Nasi padang siang">
        </div>
        <div>
          <label class="form-label">Tanggal</label>
          <input type="date" id="m_date" value="${new Date().toISOString().slice(0,10)}">
        </div>
        <div class="modal-actions">
          <button class="btn btn-outline" onclick="closeModal()">Batal</button>
          <button class="btn btn-primary" onclick="submitTx()">Simpan</button>
        </div>
      </div>`;
  } else if (type === 'addGoal') {
    content.innerHTML = `
      <h2 class="modal-title">🎯 Buat Target Baru</h2>
      <div class="modal-form">
        <div>
          <label class="form-label">Nama Target</label>
          <input type="text" id="g_name" placeholder="Contoh: iPhone 15">
        </div>
        <div>
          <label class="form-label">Emoji / Ikon</label>
          <input type="text" id="g_emoji" placeholder="📱" style="font-size:24px">
        </div>
        <div class="modal-row">
          <div>
            <label class="form-label">Target Jumlah (Rp)</label>
            <input type="number" id="g_target" placeholder="5000000">
          </div>
          <div>
            <label class="form-label">Tabungan Awal (Rp)</label>
            <input type="number" id="g_current" placeholder="0">
          </div>
        </div>
        <div>
          <label class="form-label">Deadline</label>
          <input type="date" id="g_deadline">
        </div>
        <div class="modal-actions">
          <button class="btn btn-outline" onclick="closeModal()">Batal</button>
          <button class="btn btn-primary" onclick="submitGoal()">Buat Target</button>
        </div>
      </div>`;
  }

  overlay.classList.add('open');
}

let modalType = 'expense';
function selectModalType(type, btn) {
  modalType = type;
  btn.closest('.quick-tabs').querySelectorAll('.quick-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
}

function submitTx() {
  const amount = parseInt(document.getElementById('m_amount').value);
  const cat    = document.getElementById('m_cat').value;
  const desc   = document.getElementById('m_desc').value;
  const date   = document.getElementById('m_date').value;
  if (!amount || !cat) { showToast('⚠️ Lengkapi data transaksi', 'warning'); return; }
  state.transactions.unshift({ id: Date.now(), date, desc: desc || cat.replace(/^.*? /,''), cat, type: modalType, amount });
  renderTxList();
  closeModal();
  showToast('✅ Transaksi berhasil ditambahkan!', 'success');
}

function submitGoal() {
  const name    = document.getElementById('g_name').value;
  const emoji   = document.getElementById('g_emoji').value || '🎯';
  const target  = parseInt(document.getElementById('g_target').value);
  const current = parseInt(document.getElementById('g_current').value) || 0;
  if (!name || !target) { showToast('⚠️ Lengkapi data target', 'warning'); return; }
  const pct = Math.min(100, Math.round(current / target * 100));
  const strokeOffset = 326.7 - (326.7 * pct / 100);
  const colors = ['var(--accent)', 'var(--accent-orange)', 'var(--accent-red)', 'var(--accent-yellow)'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const card = `
    <div class="goal-card">
      <div class="goal-visual">
        <div class="goal-emoji-big">${emoji}</div>
        <svg class="goal-ring" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="52" fill="none" stroke="var(--border)" stroke-width="8"/>
          <circle cx="60" cy="60" r="52" fill="none" stroke="${color}" stroke-width="8"
            stroke-dasharray="326.7" stroke-dashoffset="${strokeOffset}" stroke-linecap="round" transform="rotate(-90 60 60)"/>
        </svg>
        <div class="goal-ring-pct">${pct}%</div>
      </div>
      <div class="goal-card-body">
        <h4 class="goal-card-name">${name}</h4>
        <div class="goal-card-amounts">
          <span class="gc-current">Rp ${current.toLocaleString('id-ID')}</span>
          <span class="gc-sep">/</span>
          <span class="gc-target">Rp ${target.toLocaleString('id-ID')}</span>
        </div>
        <div class="goal-card-eta">🕐 Baru dibuat</div>
        <div class="goal-card-bar"><div class="goal-card-fill" style="width:${pct}%;background:${color}"></div></div>
        <button class="btn btn-primary btn-sm btn-block" onclick="addToGoal(this)">+ Tambah Tabungan</button>
      </div>
    </div>`;
  const addBtn = document.querySelector('.goal-card-new');
  addBtn.insertAdjacentHTML('beforebegin', card);
  closeModal();
  showToast(`🎯 Target "${name}" berhasil dibuat!`, 'success');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
}

function addToGoal(btn) {
  const amount = prompt('Berapa rupiah yang ingin ditambahkan ke target ini?');
  if (amount && parseInt(amount) > 0) {
    showToast(`✅ Rp ${parseInt(amount).toLocaleString('id-ID')} ditambahkan ke tabungan!`, 'success');
  }
}

// ═══════════ TOAST ═══════════
function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = `toast toast-${type} show`;
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// ═══════════ INIT ═══════════
window.addEventListener('load', () => {
  renderTxList();
  runSimulator();
  drawPieChart();
  drawBarChart();
});

window.addEventListener('resize', () => {
  if (document.getElementById('page-simulator').classList.contains('active')) {
    runSimulator();
  }
});

// Observe simulator visibility
const simObserver = new MutationObserver(() => {
  if (document.getElementById('page-simulator').classList.contains('active')) {
    setTimeout(runSimulator, 50);
  }
});
simObserver.observe(document.getElementById('page-simulator'), { attributes: true, attributeFilter: ['class'] });

const analysisObserver = new MutationObserver(() => {
  if (document.getElementById('page-analysis').classList.contains('active')) {
    setTimeout(() => { drawPieChart(); drawBarChart(); }, 50);
  }
});
analysisObserver.observe(document.getElementById('page-analysis'), { attributes: true, attributeFilter: ['class'] });
