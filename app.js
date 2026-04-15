/* =============================================
   VAULT-ED: Your Digital Financial Twin
   Main Application Logic
   ============================================= */

'use strict';

// ============================================================
// STATE — single source of truth
// ============================================================
const State = {
  user: {
    name: 'Rizky Pratama',
    initials: 'RP',
    grade: 'Kelas 11 IPA',
    level: 'Level 7 — Saver Pro',
    avatar_color: 'var(--purple)',
    joined: '2024-01-15'
  },

  wallet: {
    ready_to_spend: 145000,
    savings:        320000,
    emergency:       80000,
    currency: 'Rp',
    interest_rate: 0.5,      // % per bulan (virtual)
    last_interest_date: null
  },

  transactions: [
    { id: 1,  date: '2025-06-28', name: 'Makan Siang Kantin',      category: 'food',  amount: -15000,  icon: '🍛' },
    { id: 2,  date: '2025-06-28', name: 'Uang Jajan dari Mama',    category: 'save',  amount: +100000, icon: '💰' },
    { id: 3,  date: '2025-06-27', name: 'Top-up Mobile Legends',   category: 'game',  amount: -25000,  icon: '🎮' },
    { id: 4,  date: '2025-06-27', name: 'Ojek Online ke Sekolah',  category: 'trans', amount: -12000,  icon: '🛵' },
    { id: 5,  date: '2025-06-26', name: 'Beli Buku Pelajaran',     category: 'shop',  amount: -55000,  icon: '📚' },
    { id: 6,  date: '2025-06-26', name: 'Transfer ke Tabungan',    category: 'save',  amount: -50000,  icon: '🏦' },
    { id: 7,  date: '2025-06-25', name: 'Jajan Es Teh + Gorengan', category: 'food',  amount: -8000,   icon: '🧋' },
    { id: 8,  date: '2025-06-25', name: 'Tugas Les Berhasil',      category: 'save',  amount: +20000,  icon: '⭐' },
    { id: 9,  date: '2025-06-24', name: 'Beli Minuman Kopi Susu',  category: 'food',  amount: -18000,  icon: '☕' },
    { id: 10, date: '2025-06-24', name: 'Top-up Gopay',            category: 'trans', amount: -50000,  icon: '📱' },
    { id: 11, date: '2025-06-23', name: 'Makan Bakso Bareng Teman',category: 'food',  amount: -20000,  icon: '🍜' },
    { id: 12, date: '2025-06-22', name: 'Uang Jajan dari Papa',    category: 'save',  amount: +75000,  icon: '💰' },
  ],

  milestones: [
    { id: 1, title: 'Nabung Pertama!',     desc: 'Simpan uang pertama kali ke rekening tabungan',    target: 50000,   icon: '🌱', done: true  },
    { id: 2, title: 'Si Hemat Sejati',     desc: 'Hemat 3 hari berturut-turut tanpa jajan berlebih', target: 100000,  icon: '🥗', done: true  },
    { id: 3, title: '30% ke HP Impian',    desc: 'Kumpulkan 30% harga dari target HP Samsung A55',   target: 450000,  icon: '📱', done: true  },
    { id: 4, title: '60% Target Tercapai', desc: 'Kamu sudah di titik 60%! Tinggal 5 langkah lagi!', target: 900000,  icon: '🏆', done: false, current: true },
    { id: 5, title: 'HP Impian Terbeli!',  desc: 'Kumpulkan penuh Rp 1.500.000 untuk Samsung A55',   target: 1500000, icon: '🎉', done: false  },
  ],

  goals: [
    { id: 1, name: 'Samsung Galaxy A55',   target: 1500000, current: 900000,  icon: '📱', deadline: '2025-08-31', color: 'var(--blue)' },
    { id: 2, name: 'Sepatu Nike Air',      target: 800000,  current: 240000,  icon: '👟', deadline: '2025-09-15', color: 'var(--purple)' },
    { id: 3, name: 'Dana Darurat Pribadi', target: 500000,  current: 80000,   icon: '🛡️', deadline: '2025-12-31', color: 'var(--yellow)' },
  ],

  tasks: [
    { id: 1, title: 'Hemat Rp 50.000 minggu ini',   desc: 'Tantangan dari Mama: kurangi jajan minggu ini', reward: 'Nonton bioskop weekend', by: 'Mama', done: true,  icon: '💪' },
    { id: 2, title: 'Catat semua pengeluaran 7 hari',desc: 'Rekam setiap pengeluaran tanpa terkecuali',    reward: 'Boleh main game 1 jam extra', by: 'Papa', done: false, icon: '📝' },
    { id: 3, title: 'Raih tabungan Rp 200.000',      desc: 'Kumpulkan tabungan hingga Rp 200.000 bulan ini',reward: 'Beli buku komik pilihan',    by: 'Mama', done: false, icon: '🎯' },
  ],

  leaderboard: [
    { rank: 1, name: 'Aulia Sari',    savings: 450000, you: false },
    { rank: 2, name: 'Budi Santoso',  savings: 380000, you: false },
    { rank: 3, name: 'Rizky Pratama', savings: 320000, you: true  },
    { rank: 4, name: 'Citra Dewi',    savings: 290000, you: false },
    { rank: 5, name: 'Dani Hendra',   savings: 210000, you: false },
    { rank: 6, name: 'Eka Saputri',   savings: 175000, you: false },
  ],

  categories: {
    food:  { label: 'Makanan & Minuman', icon: '🍛', color: 'var(--orange)' },
    trans: { label: 'Transportasi',      icon: '🚌', color: 'var(--blue)'   },
    game:  { label: 'Game & Hiburan',    icon: '🎮', color: 'var(--purple)' },
    shop:  { label: 'Belanja',           icon: '🛍️', color: 'var(--yellow)' },
    save:  { label: 'Tabungan / Masuk',  icon: '💰', color: 'var(--green)'  },
    other: { label: 'Lainnya',           icon: '📦', color: '#888'          },
  }
};

// ============================================================
// UTILITIES
// ============================================================
const formatRupiah = (n) => {
  const abs = Math.abs(n);
  if (abs >= 1000000) return `Rp ${(abs / 1000000).toFixed(1)}jt`;
  if (abs >= 1000)    return `Rp ${(abs / 1000).toFixed(0)}rb`;
  return `Rp ${abs.toLocaleString('id-ID')}`;
};

const formatRupiahFull = (n) => {
  return `Rp ${Math.abs(n).toLocaleString('id-ID')}`;
};

const totalWallet = () =>
  State.wallet.ready_to_spend + State.wallet.savings + State.wallet.emergency;

// ============================================================
// NAVIGATION
// ============================================================
const navigate = (pageId) => {
  // Hide all pages
  document.querySelectorAll('.main-content').forEach(p => p.classList.remove('active-page'));
  // Deactivate all nav items
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  // Show target page
  const page = document.getElementById('page-' + pageId);
  if (page) page.classList.add('active-page');

  // Activate nav item
  const navItem = document.querySelector(`[data-page="${pageId}"]`);
  if (navItem) navItem.classList.add('active');

  // Page-specific initialization
  const inits = {
    dashboard:   initDashboard,
    wallet:      initWallet,
    transactions:initTransactions,
    goals:       initGoals,
    timemachine: initTimeMachine,
    wrapped:     initWrapped,
    challenge:   initChallenge,
    tasks:       initTasks,
    categorizer: initCategorizer,
  };
  if (inits[pageId]) inits[pageId]();

  // Close mobile sidebar
  document.querySelector('.sidebar').classList.remove('open');

  // Update URL hash (simple routing)
  history.replaceState(null, '', '#' + pageId);
};

// ============================================================
// TOAST NOTIFICATIONS
// ============================================================
const toast = (msg, type = 'info', duration = 3500) => {
  const icons = { success: '✅', warning: '⚠️', error: '❌', info: 'ℹ️' };
  const container = document.querySelector('.toast-container');

  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span>${icons[type]}</span><span>${msg}</span>`;
  container.appendChild(el);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => el.classList.add('show'));
  });

  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 400);
  }, duration);
};

// ============================================================
// MODAL
// ============================================================
const openModal = (id) => {
  document.getElementById(id).classList.add('open');
};

const closeModal = (id) => {
  document.getElementById(id).classList.remove('open');
};

// ============================================================
// CHARTS (pure canvas, no library)
// ============================================================
const drawLineChart = (canvasId, data, labels, color = '#00e5a0') => {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width = canvas.offsetWidth;
  const H = canvas.height = canvas.offsetHeight;

  ctx.clearRect(0, 0, W, H);

  const pad = { top: 20, right: 20, bottom: 30, left: 55 };
  const chartW = W - pad.left - pad.right;
  const chartH = H - pad.top - pad.bottom;

  const max = Math.max(...data) * 1.1;
  const min = 0;

  // Grid lines
  const steps = 4;
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= steps; i++) {
    const y = pad.top + chartH - (i / steps) * chartH;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(pad.left + chartW, y);
    ctx.stroke();

    // Y labels
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.font = '10px Space Mono, monospace';
    ctx.textAlign = 'right';
    const val = (min + (max - min) * (i / steps));
    ctx.fillText(formatRupiah(val), pad.left - 6, y + 4);
  }

  // X labels
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.font = '10px Space Mono, monospace';
  ctx.textAlign = 'center';
  labels.forEach((label, i) => {
    const x = pad.left + (i / (data.length - 1)) * chartW;
    ctx.fillText(label, x, H - 6);
  });

  // Gradient fill
  const gradient = ctx.createLinearGradient(0, pad.top, 0, pad.top + chartH);
  gradient.addColorStop(0, color + '33');
  gradient.addColorStop(1, color + '00');

  ctx.beginPath();
  data.forEach((val, i) => {
    const x = pad.left + (i / (data.length - 1)) * chartW;
    const y = pad.top + chartH - ((val - min) / (max - min)) * chartH;
    if (i === 0) ctx.moveTo(x, y);
    else {
      // Smooth bezier
      const prevX = pad.left + ((i - 1) / (data.length - 1)) * chartW;
      const prevY = pad.top + chartH - ((data[i-1] - min) / (max - min)) * chartH;
      const cpX = (prevX + x) / 2;
      ctx.bezierCurveTo(cpX, prevY, cpX, y, x, y);
    }
  });
  const lastX = pad.left + chartW;
  const lastY = pad.top + chartH - ((data[data.length-1] - min) / (max - min)) * chartH;
  ctx.lineTo(lastX, pad.top + chartH);
  ctx.lineTo(pad.left, pad.top + chartH);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  // Line
  ctx.beginPath();
  data.forEach((val, i) => {
    const x = pad.left + (i / (data.length - 1)) * chartW;
    const y = pad.top + chartH - ((val - min) / (max - min)) * chartH;
    if (i === 0) ctx.moveTo(x, y);
    else {
      const prevX = pad.left + ((i - 1) / (data.length - 1)) * chartW;
      const prevY = pad.top + chartH - ((data[i-1] - min) / (max - min)) * chartH;
      const cpX = (prevX + x) / 2;
      ctx.bezierCurveTo(cpX, prevY, cpX, y, x, y);
    }
  });
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Dots
  data.forEach((val, i) => {
    const x = pad.left + (i / (data.length - 1)) * chartW;
    const y = pad.top + chartH - ((val - min) / (max - min)) * chartH;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fillStyle = '#0a0c10';
    ctx.fill();
  });
};

const drawDonutChart = (canvasId, data, colors) => {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const size = Math.min(canvas.offsetWidth, canvas.offsetHeight);
  canvas.width = size;
  canvas.height = size;
  const cx = size / 2, cy = size / 2;
  const R = size * 0.38, r = size * 0.22;

  const total = data.reduce((s, d) => s + d.value, 0);
  let startAngle = -Math.PI / 2;

  data.forEach((seg, i) => {
    const sweep = (seg.value / total) * Math.PI * 2;
    const endAngle = startAngle + sweep;

    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(startAngle) * r, cy + Math.sin(startAngle) * r);
    ctx.arc(cx, cy, R, startAngle, endAngle);
    ctx.arc(cx, cy, r, endAngle, startAngle, true);
    ctx.closePath();
    ctx.fillStyle = colors[i];
    ctx.fill();

    startAngle = endAngle;
  });

  // Center text
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.font = `bold 14px Syne, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(formatRupiah(total), cx, cy - 8);
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.font = '10px Space Mono, monospace';
  ctx.fillText('TOTAL', cx, cy + 10);
};

// ============================================================
// PAGE INITIALIZERS
// ============================================================

// ---- DASHBOARD ----
const initDashboard = () => {
  const el = document.getElementById('page-dashboard');
  if (!el) return;

  // Virtual interest check
  const savings = State.wallet.savings;
  const interest = Math.floor(savings * (State.wallet.interest_rate / 100));

  // Spending breakdown for donut
  const spendByCategory = {};
  State.transactions.forEach(tx => {
    if (tx.amount < 0) {
      const cat = tx.category;
      spendByCategory[cat] = (spendByCategory[cat] || 0) + Math.abs(tx.amount);
    }
  });

  // Recent 5 transactions
  const recentHTML = State.transactions.slice(0, 5).map(tx => {
    const catClass = tx.category === 'save' ? 'cat-save' :
                     tx.category === 'food' ? 'cat-food' :
                     tx.category === 'trans' ? 'cat-trans' :
                     tx.category === 'game' ? 'cat-game' :
                     tx.category === 'shop' ? 'cat-shop' : 'cat-other';
    return `
      <div class="tx-item">
        <div class="tx-icon" style="background:rgba(255,255,255,0.05)">${tx.icon}</div>
        <div class="tx-info">
          <div class="tx-name">${tx.name}</div>
          <div class="tx-cat">
            <span class="cat-chip ${catClass}">${State.categories[tx.category].label}</span>
          </div>
        </div>
        <div>
          <div class="tx-amount ${tx.amount > 0 ? 'income' : 'expense'}">
            ${tx.amount > 0 ? '+' : '-'}${formatRupiah(tx.amount)}
          </div>
          <div class="tx-date" style="text-align:right">${tx.date.slice(5)}</div>
        </div>
      </div>`;
  }).join('');

  el.querySelector('#dash-recent-tx').innerHTML = recentHTML;

  // Draw spending donut
  setTimeout(() => {
    const donutData = Object.entries(spendByCategory).map(([cat, val]) => ({
      label: State.categories[cat].label, value: val
    }));
    const donutColors = Object.keys(spendByCategory).map(cat => State.categories[cat].color);
    drawDonutChart('dash-donut', donutData, donutColors);

    // Spending history line chart
    const monthlyData = [145000, 198000, 167000, 221000, 185000, 203000];
    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'];
    drawLineChart('dash-line-chart', monthlyData, monthLabels, '#00e5a0');
  }, 100);

  // Interest notification
  const interestBannerHTML = `
    <div class="interest-banner fade-in">
      <div class="ib-icon">🏦</div>
      <div class="ib-body">
        <div class="ib-title">Bunga Virtual Masuk! 🎉</div>
        <div class="ib-sub">Tabunganmu tidak diambil selama sebulan. Kamu mendapat bonus +${formatRupiahFull(interest)} sebagai simulasi bunga bank ${State.wallet.interest_rate}%/bulan.</div>
      </div>
      <div class="ib-amount">+${formatRupiahFull(interest)}</div>
    </div>`;
  el.querySelector('#interest-banner').innerHTML = interestBannerHTML;

  // Prediction warning
  const dailyAvgSpend = 25000;
  const daysLeft = Math.floor(State.wallet.ready_to_spend / dailyAvgSpend);
  const predictedDate = new Date();
  predictedDate.setDate(predictedDate.getDate() + daysLeft);
  const dateStr = predictedDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long' });

  el.querySelector('#prediction-bar').innerHTML = `
    <div class="prediction-bar fade-in">
      <div class="prediction-icon">🤖</div>
      <div class="prediction-text">
        <div class="prediction-title">Prediksi AI: Uangmu hampir habis!</div>
        <div class="prediction-detail">Berdasarkan pola belanja rata-rata Rp ${dailyAvgSpend.toLocaleString('id-ID')}/hari, <strong style="color:var(--red)">uang jajanmu akan habis sekitar ${dateStr}</strong>. Kurangi pengeluaran sekarang!</div>
      </div>
      <button class="btn btn-ghost btn-sm" onclick="navigate('timemachine')">Simulasi →</button>
    </div>`;

  // Stats
  const totalSpend = State.transactions.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const totalIncome = State.transactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  el.querySelector('#dash-total-wallet').textContent = formatRupiahFull(totalWallet());
  el.querySelector('#dash-total-spend').textContent  = formatRupiahFull(totalSpend);
  el.querySelector('#dash-total-income').textContent = formatRupiahFull(totalIncome);
  el.querySelector('#dash-savings').textContent      = formatRupiahFull(State.wallet.savings);
};

// ---- WALLET ----
const initWallet = () => {
  const el = document.getElementById('page-wallet');
  if (!el) return;

  const total = totalWallet();
  el.querySelector('#w-total').textContent      = formatRupiahFull(total);
  el.querySelector('#w-ready').textContent      = formatRupiahFull(State.wallet.ready_to_spend);
  el.querySelector('#w-savings').textContent    = formatRupiahFull(State.wallet.savings);
  el.querySelector('#w-emergency').textContent  = formatRupiahFull(State.wallet.emergency);

  // Progress bars
  const setBar = (id, val, max) => {
    const el2 = document.getElementById(id);
    if (el2) el2.style.width = Math.min((val / max) * 100, 100) + '%';
  };
  setBar('bar-ready',    State.wallet.ready_to_spend, total);
  setBar('bar-savings',  State.wallet.savings,        total);
  setBar('bar-emergency',State.wallet.emergency,      total);

  // Savings history chart
  setTimeout(() => {
    const savData = [150000, 180000, 220000, 260000, 290000, 320000];
    const savLabels = ['Jan','Feb','Mar','Apr','Mei','Jun'];
    drawLineChart('wallet-savings-chart', savData, savLabels, '#3d9bff');
  }, 100);
};

// ---- TRANSACTIONS ----
const initTransactions = () => {
  const el = document.getElementById('page-transactions');
  if (!el) return;

  renderTransactions(State.transactions);
};

const renderTransactions = (txs, filter = 'all') => {
  const filtered = filter === 'all' ? txs :
                   filter === 'income'  ? txs.filter(t => t.amount > 0) :
                   filter === 'expense' ? txs.filter(t => t.amount < 0) :
                   txs.filter(t => t.category === filter);

  const container = document.getElementById('tx-list');
  if (!container) return;

  if (filtered.length === 0) {
    container.innerHTML = `<div style="text-align:center;padding:40px;color:rgba(255,255,255,0.25)">
      <div style="font-size:32px;margin-bottom:8px">📭</div>
      <div>Tidak ada transaksi ditemukan</div>
    </div>`;
    return;
  }

  // Group by date
  const grouped = {};
  filtered.forEach(tx => {
    const d = tx.date;
    if (!grouped[d]) grouped[d] = [];
    grouped[d].push(tx);
  });

  const html = Object.entries(grouped).sort(([a],[b]) => b.localeCompare(a)).map(([date, txList]) => {
    const dateFormatted = new Date(date).toLocaleDateString('id-ID', {
      weekday: 'long', day: 'numeric', month: 'long'
    });
    const txHTML = txList.map(tx => {
      const catClass = `cat-${tx.category}`;
      return `
        <div class="tx-item" style="cursor:pointer" title="Klik untuk detail">
          <div class="tx-icon" style="background:rgba(255,255,255,0.05)">${tx.icon}</div>
          <div class="tx-info">
            <div class="tx-name">${tx.name}</div>
            <div class="tx-cat">
              <span class="cat-chip ${catClass}">${State.categories[tx.category]?.label || 'Lainnya'}</span>
            </div>
          </div>
          <div>
            <div class="tx-amount ${tx.amount > 0 ? 'income' : 'expense'}">
              ${tx.amount > 0 ? '+' : '−'}${formatRupiahFull(tx.amount)}
            </div>
          </div>
        </div>`;
    }).join('');

    return `
      <div style="margin-bottom:var(--s-lg)">
        <div style="font-family:var(--font-mono);font-size:11px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;padding:0 4px;">${dateFormatted}</div>
        <div class="card" style="padding:var(--s-sm) var(--s-md)">${txHTML}</div>
      </div>`;
  }).join('');

  container.innerHTML = html;
};

// ---- GOALS / MILESTONE MAP ----
const initGoals = () => {
  const el = document.getElementById('page-goals');
  if (!el) return;

  // Goals progress cards
  const goalsHTML = State.goals.map(g => {
    const pct = Math.round((g.current / g.target) * 100);
    const remaining = g.target - g.current;
    const daysLeft = Math.ceil((new Date(g.deadline) - new Date()) / (1000 * 86400));
    return `
      <div class="card fade-in" style="position:relative;overflow:hidden">
        <div style="position:absolute;top:-10px;right:-10px;font-size:60px;opacity:0.08;transform:rotate(-15deg)">${g.icon}</div>
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
          <div style="width:42px;height:42px;border-radius:var(--r-sm);display:flex;align-items:center;justify-content:center;font-size:20px;background:rgba(255,255,255,0.05)">${g.icon}</div>
          <div>
            <div style="font-weight:600;font-size:15px">${g.name}</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.35);font-family:var(--font-mono)">${daysLeft} hari lagi • ${g.deadline}</div>
          </div>
          <div style="margin-left:auto">
            <span class="badge ${pct >= 75 ? 'badge-green' : pct >= 40 ? 'badge-yellow' : 'badge-red'}">${pct}%</span>
          </div>
        </div>
        <div class="progress-track" style="height:10px;margin-bottom:10px">
          <div class="progress-fill" style="width:${pct}%;background:${g.color}" id="goal-bar-${g.id}"></div>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:12px">
          <span style="color:rgba(255,255,255,0.4)">Terkumpul: <strong style="color:white">${formatRupiahFull(g.current)}</strong></span>
          <span style="color:rgba(255,255,255,0.4)">Sisa: <strong style="color:var(--yellow)">${formatRupiahFull(remaining)}</strong></span>
        </div>
      </div>`;
  }).join('');
  el.querySelector('#goals-cards').innerHTML = goalsHTML;

  // Milestone path
  const milestoneProgress = (State.milestones.filter(m => m.done).length / State.milestones.length) * 100;
  const pathHTML = `
    <div class="milestone-path">
      <div class="milestone-line">
        <div class="milestone-line-fill" id="milestone-fill" style="height:0%"></div>
      </div>
      ${State.milestones.map((m, i) => `
        <div class="milestone-step fade-in fade-in-${i+1}">
          <div class="milestone-node ${m.done ? 'done' : m.current ? 'current' : ''}">
            ${m.done ? '✅' : m.current ? '⭐' : m.icon}
          </div>
          <div class="milestone-info">
            <div class="milestone-title" style="color:${m.done ? 'var(--green)' : m.current ? 'var(--yellow)' : 'rgba(255,255,255,0.6)'}">
              ${m.title}
              ${m.done ? '<span class="badge badge-green" style="font-size:9px;margin-left:6px">SELESAI</span>' : ''}
              ${m.current ? '<span class="badge badge-yellow" style="font-size:9px;margin-left:6px">DALAM PROSES</span>' : ''}
            </div>
            <div class="milestone-desc">${m.desc}</div>
            <div style="font-family:var(--font-mono);font-size:11px;color:rgba(255,255,255,0.3)">Target: ${formatRupiahFull(m.target)}</div>
            ${m.current ? `
              <div style="margin-top:8px">
                <div class="progress-track" style="height:6px;max-width:200px">
                  <div class="progress-fill yellow" style="width:60%"></div>
                </div>
                <div style="font-size:11px;color:var(--yellow);margin-top:4px">60% — Tinggal 5 langkah lagi! 🔥</div>
              </div>` : ''}
          </div>
        </div>`).join('')}
    </div>`;
  el.querySelector('#milestone-path').innerHTML = pathHTML;

  setTimeout(() => {
    const fill = document.getElementById('milestone-fill');
    if (fill) fill.style.height = milestoneProgress + '%';
  }, 300);
};

// ---- TIME MACHINE ----
const initTimeMachine = () => {
  // Compound interest calculator
  const calcBtn = document.getElementById('tm-calc-btn');
  if (calcBtn && !calcBtn._initialized) {
    calcBtn._initialized = true;
    calcBtn.addEventListener('click', () => {
      const principal = parseFloat(document.getElementById('tm-principal').value) || 0;
      const rate      = parseFloat(document.getElementById('tm-rate').value) || 0;
      const years     = parseFloat(document.getElementById('tm-years').value) || 0;
      const monthly   = parseFloat(document.getElementById('tm-monthly').value) || 0;

      // A = P(1+r/n)^(nt) + PMT × [(1+r/n)^(nt) - 1] / (r/n)
      const r = rate / 100 / 12;
      const n = years * 12;

      let future;
      if (r === 0) {
        future = principal + monthly * n;
      } else {
        future = principal * Math.pow(1 + r, n) +
                 monthly * (Math.pow(1 + r, n) - 1) / r;
      }

      const totalDeposited = principal + monthly * n;
      const gain = future - totalDeposited;

      const resultEl = document.getElementById('tm-result');
      resultEl.innerHTML = `
        <div class="tm-result-box fade-in">
          <div class="tm-result-label">Nilai Uangmu Setelah ${years} Tahun</div>
          <div class="tm-result-value">${formatRupiahFull(Math.round(future))}</div>
          <div class="tm-result-gain">
            Dari <strong>${formatRupiahFull(Math.round(totalDeposited))}</strong> yang kamu simpan,
            bunga menghasilkan <strong>+${formatRupiahFull(Math.round(gain))}</strong> untukmu! 🚀
          </div>
          <div style="margin-top:16px;display:grid;grid-template-columns:repeat(3,1fr);gap:12px;text-align:center">
            <div style="background:rgba(255,255,255,0.04);border-radius:var(--r-sm);padding:12px">
              <div style="font-size:10px;color:rgba(255,255,255,0.3);font-family:var(--font-mono);text-transform:uppercase;letter-spacing:1px">Modal Awal</div>
              <div style="font-weight:700;font-size:14px;margin-top:4px">${formatRupiah(principal)}</div>
            </div>
            <div style="background:rgba(255,255,255,0.04);border-radius:var(--r-sm);padding:12px">
              <div style="font-size:10px;color:rgba(255,255,255,0.3);font-family:var(--font-mono);text-transform:uppercase;letter-spacing:1px">Total Setor</div>
              <div style="font-weight:700;font-size:14px;margin-top:4px">${formatRupiah(totalDeposited)}</div>
            </div>
            <div style="background:rgba(0,229,160,0.08);border:1px solid rgba(0,229,160,0.2);border-radius:var(--r-sm);padding:12px">
              <div style="font-size:10px;color:rgba(0,229,160,0.7);font-family:var(--font-mono);text-transform:uppercase;letter-spacing:1px">Keuntungan</div>
              <div style="font-weight:800;font-size:14px;margin-top:4px;color:var(--green)">+${formatRupiah(gain)}</div>
            </div>
          </div>
        </div>`;

      // Draw projection chart
      setTimeout(() => {
        const chartData = [], chartLabels = [];
        for (let yr = 0; yr <= years; yr++) {
          const t = yr * 12;
          const val = r === 0
            ? principal + monthly * t
            : principal * Math.pow(1 + r, t) + monthly * (Math.pow(1 + r, t) - 1) / r;
          chartData.push(Math.round(val));
          chartLabels.push(yr === 0 ? 'Sekarang' : `+${yr}thn`);
        }
        drawLineChart('tm-chart', chartData, chartLabels, '#b57bff');
      }, 100);

      toast('Simulasi berhasil dihitung! 📊', 'success');
    });
  }

  // Coffee / daily habit calculator
  const habitBtn = document.getElementById('habit-calc-btn');
  if (habitBtn && !habitBtn._initialized) {
    habitBtn._initialized = true;
    habitBtn.addEventListener('click', () => {
      const price = parseFloat(document.getElementById('habit-price').value) || 0;
      const freq  = parseFloat(document.getElementById('habit-freq').value) || 0;
      const item  = document.getElementById('habit-item').value || 'kebiasaan ini';

      const daily   = price * freq;
      const monthly = daily * 30;
      const yearly  = daily * 365;
      const fiveYear = yearly * 5;

      const altInvest = yearly * 0.065 * 5; // simple 6.5% estimate

      document.getElementById('habit-result').innerHTML = `
        <div class="card fade-in" style="margin-top:16px">
          <div style="font-family:var(--font-display);font-size:16px;font-weight:700;margin-bottom:16px">
            💸 "Kalau kamu beli ${item} ${freq}x sehari..."
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div style="background:rgba(255,92,114,0.06);border:1px solid rgba(255,92,114,0.15);border-radius:var(--r-sm);padding:14px;text-align:center">
              <div style="font-size:10px;color:var(--red);font-family:var(--font-mono);text-transform:uppercase;letter-spacing:1px">Per Bulan</div>
              <div style="font-size:20px;font-weight:800;font-family:var(--font-display);color:var(--red);margin-top:4px">${formatRupiah(monthly)}</div>
            </div>
            <div style="background:rgba(255,92,114,0.06);border:1px solid rgba(255,92,114,0.15);border-radius:var(--r-sm);padding:14px;text-align:center">
              <div style="font-size:10px;color:var(--red);font-family:var(--font-mono);text-transform:uppercase;letter-spacing:1px">Per Tahun</div>
              <div style="font-size:20px;font-weight:800;font-family:var(--font-display);color:var(--red);margin-top:4px">${formatRupiah(yearly)}</div>
            </div>
            <div style="background:rgba(245,197,66,0.06);border:1px solid rgba(245,197,66,0.15);border-radius:var(--r-sm);padding:14px;text-align:center">
              <div style="font-size:10px;color:var(--yellow);font-family:var(--font-mono);text-transform:uppercase;letter-spacing:1px">Dalam 5 Tahun</div>
              <div style="font-size:20px;font-weight:800;font-family:var(--font-display);color:var(--yellow);margin-top:4px">${formatRupiah(fiveYear)}</div>
            </div>
            <div style="background:rgba(0,229,160,0.06);border:1px solid rgba(0,229,160,0.15);border-radius:var(--r-sm);padding:14px;text-align:center">
              <div style="font-size:10px;color:var(--green);font-family:var(--font-mono);text-transform:uppercase;letter-spacing:1px">Kalau Ditabung 5thn</div>
              <div style="font-size:20px;font-weight:800;font-family:var(--font-display);color:var(--green);margin-top:4px">~${formatRupiah(fiveYear + altInvest)}</div>
            </div>
          </div>
          <div style="margin-top:12px;padding:10px;background:rgba(255,255,255,0.03);border-radius:var(--r-sm);font-size:12px;color:rgba(255,255,255,0.4);text-align:center">
            💡 Kalau kamu invest ${formatRupiah(yearly)}/tahun dengan bunga 6.5%, dalam 5 tahun uangmu bisa jadi <strong style="color:var(--green)">${formatRupiah(fiveYear + altInvest)}</strong>!
          </div>
        </div>`;
    });
  }
};

// ---- MONTHLY WRAPPED ----
const initWrapped = () => {
  const el = document.getElementById('page-wrapped');
  if (!el) return;

  // Already initialized by HTML
  const totalSpend = State.transactions.filter(t => t.amount < 0)
    .reduce((s, t) => s + Math.abs(t.amount), 0);
  const totalSaved = State.transactions.filter(t => t.amount > 0)
    .reduce((s, t) => s + t.amount, 0);

  // Find biggest spending category
  const catSpend = {};
  State.transactions.filter(t => t.amount < 0).forEach(t => {
    catSpend[t.category] = (catSpend[t.category] || 0) + Math.abs(t.amount);
  });
  const biggestCat = Object.entries(catSpend).sort(([,a],[,b]) => b - a)[0];
  const biggestCatName = biggestCat ? State.categories[biggestCat[0]].label : 'N/A';
  const biggestCatPct  = biggestCat ? Math.round((biggestCat[1] / totalSpend) * 100) : 0;

  // Build category breakdown bars
  const catHTML = Object.entries(catSpend).sort(([,a],[,b]) => b - a).map(([cat, val]) => {
    const pct = Math.round((val / totalSpend) * 100);
    const catObj = State.categories[cat];
    return `
      <div style="margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <span style="font-size:13px">${catObj.icon} ${catObj.label}</span>
          <span style="font-family:var(--font-mono);font-size:12px;color:rgba(255,255,255,0.5)">${formatRupiah(val)} <span style="color:rgba(255,255,255,0.25)">(${pct}%)</span></span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width:${pct}%;background:${catObj.color}"></div>
        </div>
      </div>`;
  }).join('');

  el.querySelector('#wrapped-cat-breakdown').innerHTML = catHTML;
  el.querySelector('#wrapped-total-spend').textContent  = formatRupiah(totalSpend);
  el.querySelector('#wrapped-total-saved').textContent  = formatRupiah(totalSaved);
  el.querySelector('#wrapped-biggest-cat').textContent  = `${biggestCatName} (${biggestCatPct}%)`;
  el.querySelector('#wrapped-tx-count').textContent     = State.transactions.length + ' transaksi';

  // Health Score (fake but fun)
  const savingsRatio = totalSaved / (totalSpend + totalSaved);
  const healthScore  = Math.min(100, Math.round(savingsRatio * 100 + 30));
  const healthEl = el.querySelector('#wrapped-health-score');
  if (healthEl) {
    healthEl.textContent = healthScore;
    healthEl.style.color = healthScore >= 70 ? 'var(--green)' : healthScore >= 40 ? 'var(--yellow)' : 'var(--red)';
  }
};

// ---- BUDGETING CHALLENGE ----
const initChallenge = () => {
  const el = document.getElementById('page-challenge');
  if (!el) return;

  const lbHTML = State.leaderboard.map(p => {
    const rankClass = p.rank === 1 ? 'gold' : p.rank === 2 ? 'silver' : p.rank === 3 ? 'bronze' : 'you-r';
    const rankIcon  = p.rank === 1 ? '🥇' : p.rank === 2 ? '🥈' : p.rank === 3 ? '🥉' : p.rank;
    return `
      <div class="lb-item ${p.you ? 'you' : ''} fade-in fade-in-${p.rank}">
        <div class="lb-rank ${p.you ? 'you-r' : rankClass}">${rankIcon}</div>
        <div class="lb-info">
          <div class="lb-name">${p.name} ${p.you ? '<span class="badge badge-green" style="font-size:9px">KAMU</span>' : ''}</div>
          <div class="lb-score">Tabungan bulan ini</div>
        </div>
        <div class="lb-savings">${formatRupiahFull(p.savings)}</div>
      </div>`;
  }).join('');
  el.querySelector('#leaderboard-list').innerHTML = lbHTML;
};

// ---- TASKS (Teacher-Parent) ----
const initTasks = () => {
  const el = document.getElementById('page-tasks');
  if (!el) return;
  renderTasks();
};

const renderTasks = () => {
  const container = document.getElementById('tasks-list');
  if (!container) return;

  const html = State.tasks.map(t => `
    <div class="task-card ${t.done ? 'completed' : ''} fade-in">
      <div class="task-header">
        <div style="font-size:22px">${t.icon}</div>
        <div class="task-title">${t.title}</div>
        <div>
          ${t.done
            ? '<span class="badge badge-green">✓ Selesai</span>'
            : `<button class="btn btn-primary btn-sm" onclick="completeTask(${t.id})">Tandai Selesai</button>`}
        </div>
      </div>
      <div class="task-desc">${t.desc}</div>
      <div style="display:flex;align-items:center;justify-content:space-between">
        <div class="task-reward">
          🎁 Reward: ${t.reward}
        </div>
        <div style="font-size:11px;color:rgba(255,255,255,0.3);font-family:var(--font-mono)">Dari: ${t.by}</div>
      </div>
    </div>`).join('');
  container.innerHTML = html;
};

window.completeTask = (id) => {
  const task = State.tasks.find(t => t.id === id);
  if (task) {
    task.done = true;
    renderTasks();
    toast(`🎉 Tugasmu selesai! Reward menanti: "${task.reward}"`, 'success', 5000);
  }
};

// ---- AI CATEGORIZER ----
const initCategorizer = () => {
  const el = document.getElementById('page-categorizer');
  if (!el) return;
  // Already set up in HTML
};

// ============================================================
// ADD TRANSACTION (Modal)
// ============================================================
const addTransaction = () => {
  const name   = document.getElementById('new-tx-name').value.trim();
  const amount = parseFloat(document.getElementById('new-tx-amount').value);
  const type   = document.getElementById('new-tx-type').value;
  const cat    = document.getElementById('new-tx-cat').value;

  if (!name) { toast('Masukkan nama transaksi', 'warning'); return; }
  if (!amount || isNaN(amount)) { toast('Masukkan jumlah yang valid', 'warning'); return; }

  const finalAmount = type === 'income' ? Math.abs(amount) : -Math.abs(amount);
  const icons = { food: '🍛', trans: '🚌', game: '🎮', shop: '🛍️', save: '💰', other: '📦' };

  const tx = {
    id:       State.transactions.length + 1,
    date:     new Date().toISOString().slice(0, 10),
    name,
    category: cat,
    amount:   finalAmount,
    icon:     icons[cat] || '📦'
  };

  State.transactions.unshift(tx);

  // Update wallet
  if (finalAmount > 0) {
    State.wallet.ready_to_spend += finalAmount;
  } else {
    const abs = Math.abs(finalAmount);
    if (State.wallet.ready_to_spend >= abs) {
      State.wallet.ready_to_spend -= abs;
    } else {
      toast('⚠️ Saldo Ready to Spend tidak cukup!', 'warning');
      State.transactions.shift();
      return;
    }
  }

  closeModal('modal-add-tx');
  document.getElementById('new-tx-name').value = '';
  document.getElementById('new-tx-amount').value = '';
  toast(`Transaksi "${name}" berhasil ditambahkan! 💸`, 'success');

  // Refresh current page
  if (document.getElementById('page-transactions').classList.contains('active-page')) initTransactions();
  if (document.getElementById('page-dashboard').classList.contains('active-page')) initDashboard();
  if (document.getElementById('page-wallet').classList.contains('active-page')) initWallet();
};

// ============================================================
// AI SMART CATEGORIZER (Simulated)
// ============================================================
const runAICategorizer = () => {
  const input = document.getElementById('ai-input').value.trim();
  if (!input) { toast('Masukkan deskripsi pengeluaran', 'warning'); return; }

  const resultEl = document.getElementById('ai-result');
  resultEl.innerHTML = `<div style="text-align:center;padding:24px;color:rgba(255,255,255,0.4)">
    <div style="font-size:28px;margin-bottom:8px;animation:spin 1s linear infinite;display:inline-block">⚙️</div>
    <div style="font-size:13px">AI sedang menganalisis...</div>
  </div>`;

  // Simulate AI delay
  setTimeout(() => {
    const lower = input.toLowerCase();
    let cat = 'other', confidence = 72, suggestions = [], tip = '';

    if (/kantin|makan|minum|kopi|es|bakso|nasi|gorengan|boba|teh/i.test(lower)) {
      cat = 'food'; confidence = 95;
      suggestions = ['Makanan Berat', 'Minuman', 'Jajan Ringan'];
      tip = '🍛 Makanan adalah pengeluaran terbesar kedua kamu. Coba batasi jajan di bawah Rp 30.000/hari!';
    } else if (/gojek|grab|ojek|bis|angkot|kereta|mrt|transjakarta|bensin/i.test(lower)) {
      cat = 'trans'; confidence = 93;
      suggestions = ['Ojek Online', 'Transportasi Umum', 'BBM'];
      tip = '🚌 Coba bandingkan tarif Gojek vs naik transportasi umum untuk rute yang sama!';
    } else if (/game|ml|ff|valorant|steam|top.?up|diamond|voucher|skin/i.test(lower)) {
      cat = 'game'; confidence = 97;
      suggestions = ['Top-up Game', 'Langganan', 'Aksesori Gaming'];
      tip = '🎮 Pengeluaran game kamu bulan ini sudah Rp 25.000. Tetapkan budget bulanan ya!';
    } else if (/baju|sepatu|tas|buku|alat tulis|mall|toko/i.test(lower)) {
      cat = 'shop'; confidence = 89;
      suggestions = ['Pakaian', 'Perlengkapan Sekolah', 'Aksesori'];
      tip = '🛍️ Sebelum membeli, tanya diri: "Butuh atau ingin?" Tunggu 24 jam sebelum memutuskan!';
    } else if (/nabung|tabung|simpan|transfer|deposito/i.test(lower)) {
      cat = 'save'; confidence = 96;
      suggestions = ['Tabungan Rutin', 'Dana Darurat', 'Target Khusus'];
      tip = '💰 Mantap! Kebiasaan menabung lebih penting dari jumlahnya. Konsisten itu kunci!';
    } else {
      confidence = 68;
      suggestions = ['Tagihan', 'Kesehatan', 'Pendidikan'];
      tip = '📦 Tidak yakin? Kamu bisa pilih kategori manual dari pilihan di bawah.';
    }

    const catObj = State.categories[cat];
    resultEl.innerHTML = `
      <div class="card fade-in" style="border-color:rgba(0,229,160,0.2)">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
          <div style="width:48px;height:48px;border-radius:var(--r-md);display:flex;align-items:center;justify-content:center;font-size:24px;background:rgba(255,255,255,0.05)">${catObj.icon}</div>
          <div>
            <div style="font-size:12px;color:rgba(255,255,255,0.4);font-family:var(--font-mono);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">Kategori Terdeteksi</div>
            <div style="font-family:var(--font-display);font-size:18px;font-weight:700;color:${catObj.color}">${catObj.label}</div>
          </div>
          <div style="margin-left:auto;text-align:right">
            <div style="font-size:10px;color:rgba(255,255,255,0.35);margin-bottom:2px">AKURASI AI</div>
            <div style="font-family:var(--font-display);font-size:24px;font-weight:800;color:var(--green)">${confidence}%</div>
          </div>
        </div>
        <div style="margin-bottom:14px">
          <div style="font-size:11px;color:rgba(255,255,255,0.35);margin-bottom:8px;font-family:var(--font-mono)">SUB-KATEGORI YANG MUNGKIN</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap">
            ${suggestions.map((s, i) => `<span class="badge ${i === 0 ? 'badge-green' : 'badge-blue'}" style="cursor:pointer">${i === 0 ? '✓ ' : ''}${s}</span>`).join('')}
          </div>
        </div>
        <div style="background:rgba(255,255,255,0.03);border-radius:var(--r-sm);padding:12px;font-size:13px;color:rgba(255,255,255,0.55);border-left:3px solid var(--yellow)">
          ${tip}
        </div>
        <div style="margin-top:14px;display:flex;gap:8px">
          <button class="btn btn-primary" style="flex:1" onclick="toast('✅ Kategori ${catObj.label} disimpan!', 'success')">Konfirmasi Kategori</button>
          <button class="btn btn-ghost" onclick="toast('Kamu bisa pilih manual dari dropdown', 'info')">Ganti Kategori</button>
        </div>
      </div>`;
  }, 1800);
};

// ============================================================
// INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  // Bind nav items
  document.querySelectorAll('.nav-item[data-page]').forEach(item => {
    item.addEventListener('click', () => navigate(item.dataset.page));
  });

  // Mobile menu toggle
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  if (mobileBtn) {
    mobileBtn.addEventListener('click', () => {
      document.querySelector('.sidebar').classList.toggle('open');
    });
  }

  // Modal close buttons
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.dataset.closeModal));
  });

  // Click outside modal to close
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('open');
    });
  });

  // Filter tabs for transactions
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderTransactions(State.transactions, tab.dataset.filter);
    });
  });

  // Route on load
  const hash = location.hash.replace('#', '') || 'dashboard';
  navigate(hash);

  // Handle window resize for charts
  window.addEventListener('resize', () => {
    const active = document.querySelector('.main-content.active-page');
    if (active) {
      const id = active.id.replace('page-', '');
      const inits = { dashboard: initDashboard, wallet: initWallet };
      if (inits[id]) setTimeout(inits[id], 100);
    }
  });

  // Welcome toast
  setTimeout(() => toast(`Selamat datang kembali, ${State.user.name.split(' ')[0]}! 👋`, 'success'), 800);
});
