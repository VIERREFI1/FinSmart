// ===== DATA STORE =====
const store = {
  pemasukan: JSON.parse(localStorage.getItem('fk_pemasukan') || '[]'),
  pengeluaran: JSON.parse(localStorage.getItem('fk_pengeluaran') || '[]'),
  tabungan: JSON.parse(localStorage.getItem('fk_tabungan') || '[]'),
  budget: JSON.parse(localStorage.getItem('fk_budget') || '{}'),
};

function save() {
  localStorage.setItem('fk_pemasukan', JSON.stringify(store.pemasukan));
  localStorage.setItem('fk_pengeluaran', JSON.stringify(store.pengeluaran));
  localStorage.setItem('fk_tabungan', JSON.stringify(store.tabungan));
  localStorage.setItem('fk_budget', JSON.stringify(store.budget));
}

function formatRp(n) {
  if (n >= 1000000000) return 'Rp ' + (n/1000000000).toFixed(1) + 'M';
  if (n >= 1000000) return 'Rp ' + (n/1000000).toFixed(1) + ' jt';
  return 'Rp ' + Number(n).toLocaleString('id-ID');
}
function formatRpFull(n) {
  return 'Rp ' + Number(n).toLocaleString('id-ID');
}

// ===== TOAST =====
function toast(message, type = 'success', icon = null) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: '✅', error: '❌', info: '💡', warning: '⚠️' };
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span class="toast-icon">${icon || icons[type]}</span><span>${message}</span>`;
  container.appendChild(t);
  setTimeout(() => {
    t.classList.add('hide');
    setTimeout(() => t.remove(), 300);
  }, 3000);
}

// ===== CHART BARS =====
function buildChart() {
  const el = document.getElementById('chartBars');
  if (!el) return;

  const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
  const now = new Date();
  const chartData = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const m = d.getMonth();
    const y = d.getFullYear();
    const inc = store.pemasukan.filter(e => {
      const ed = new Date(e.tanggal);
      return ed.getMonth() === m && ed.getFullYear() === y;
    }).reduce((s, e) => s + Number(e.jumlah), 0);
    const exp = store.pengeluaran.filter(e => {
      const ed = new Date(e.tanggal);
      return ed.getMonth() === m && ed.getFullYear() === y;
    }).reduce((s, e) => s + Number(e.jumlah), 0);
    chartData.push({ inc, exp, label: months[m] });
  }

  // Use mock data if no real data
  const hasData = chartData.some(d => d.inc > 0 || d.exp > 0);
  if (!hasData) {
    chartData[0] = { inc: 7000000, exp: 3200000, label: chartData[0].label };
    chartData[1] = { inc: 6500000, exp: 2800000, label: chartData[1].label };
    chartData[2] = { inc: 8200000, exp: 3600000, label: chartData[2].label };
    chartData[3] = { inc: 7800000, exp: 3100000, label: chartData[3].label };
    chartData[4] = { inc: 9200000, exp: 3900000, label: chartData[4].label };
    chartData[5] = { inc: 8500000, exp: 3240000, label: chartData[5].label };
  }

  const max = Math.max(...chartData.map(d => Math.max(d.inc, d.exp)));
  el.innerHTML = chartData.map((d, i) => `
    <div class="chart-group" style="animation-delay:${i*0.1}s">
      <div class="bar income" style="height:${max ? (d.inc/max)*100 : 0}%" title="Pemasukan: ${formatRpFull(d.inc)}"></div>
      <div class="bar expense" style="height:${max ? (d.exp/max)*100 : 0}%" title="Pengeluaran: ${formatRpFull(d.exp)}"></div>
    </div>
  `).join('');

  const monthsEl = document.getElementById('chartMonths');
  if (monthsEl) {
    monthsEl.innerHTML = chartData.map(d => `<span>${d.label}</span>`).join('');
  }
}

// ===== UPDATE DASHBOARD STATS =====
function updateDashboardStats() {
  const totalP = store.pemasukan.reduce((s,d)=>s+Number(d.jumlah),0);
  const totalE = store.pengeluaran.reduce((s,d)=>s+Number(d.jumlah),0);
  const saldo = totalP - totalE;
  const totalT = store.tabungan.reduce((s,d)=>s+Number(d.terkumpul),0);

  const set = (id, val) => { const el = document.getElementById(id); if(el) el.textContent = val; };
  set('dashTotalP', formatRp(totalP));
  set('dashTotalE', formatRp(totalE));
  set('dashSaldo', formatRp(saldo));
  set('dashTabungan', formatRp(totalT));

  const saldoEl = document.getElementById('dashSaldo');
  if (saldoEl) saldoEl.style.color = saldo >= 0 ? 'var(--mint)' : 'var(--coral)';

  // Hero card
  const heroInc = document.getElementById('heroIncome');
  const heroExp = document.getElementById('heroExpense');
  const heroSave = document.getElementById('heroSave');
  if (heroInc && totalP > 0) heroInc.textContent = formatRp(totalP);
  if (heroExp && totalE > 0) heroExp.textContent = formatRp(totalE);
  if (heroSave && totalT > 0) heroSave.textContent = formatRp(totalT);

  // Last transactions
  renderLastTransactions();
}

function renderLastTransactions() {
  const el = document.getElementById('txList');
  if (!el) return;

  const all = [
    ...store.pemasukan.map(d => ({...d, tipe:'pemasukan'})),
    ...store.pengeluaran.map(d => ({...d, tipe:'pengeluaran'})),
  ].sort((a,b) => new Date(b.tanggal) - new Date(a.tanggal)).slice(0, 5);

  if (!all.length) {
    el.innerHTML = `<div class="empty-state"><div class="empty-icon">💸</div><p>Belum ada transaksi.<br>Mulai catat pemasukan atau pengeluaranmu!</p></div>`;
    return;
  }

  const iconMap = {
    pemasukan: { 'Gaji': '💵', 'Freelance': '💼', 'Bonus': '🎁', 'Investasi': '📈', 'Lainnya': '💰' },
    pengeluaran: { 'Makanan & Minuman': '🍜', 'Transport': '🚗', 'Belanja': '🛒', 'Tagihan': '📋', 'Hiburan': '🎮', 'Kesehatan': '🏥', 'Pendidikan': '📚', 'Lainnya': '💳' },
  };

  el.innerHTML = all.map(d => {
    const icon = iconMap[d.tipe][d.kategori] || (d.tipe === 'pemasukan' ? '💰' : '💸');
    const bgClass = d.tipe === 'pemasukan' ? 'green-bg' : 'red-bg';
    const amtClass = d.tipe === 'pemasukan' ? 'green' : 'red';
    const sign = d.tipe === 'pemasukan' ? '+' : '-';
    return `
      <div class="tx-item fade-in-1">
        <div class="tx-icon ${bgClass}">${icon}</div>
        <div class="tx-info">
          <p class="tx-name">${d.nama}</p>
          <p class="tx-date">${d.tanggal}</p>
        </div>
        <span class="badge badge-${d.tipe==='pemasukan'?'green':'red'}" style="margin-right:8px">${d.kategori}</span>
        <span class="tx-amount ${amtClass}">${sign} ${formatRpFull(d.jumlah)}</span>
      </div>`;
  }).join('');
}

// ===== HAMBURGER =====
function initHamburger() {
  const btn = document.getElementById('hamburger');
  const links = document.querySelector('.nav-links');
  if (!btn || !links) return;
  btn.addEventListener('click', () => {
    const isOpen = links.classList.contains('mobile-open');
    if (isOpen) {
      links.classList.remove('mobile-open');
      links.style.cssText = '';
    } else {
      links.classList.add('mobile-open');
      Object.assign(links.style, {
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        top: '68px', left: '0', right: '0',
        background: 'var(--surface)',
        padding: '20px',
        borderBottom: '1px solid var(--border)',
        gap: '4px',
        zIndex: '100',
      });
    }
  });
}

// ===== MODAL HELPER =====
function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('open');
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('open');
}

// ===== ANIMATE ON SCROLL =====
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        e.target.style.animation = `fadeInUp 0.6s ease ${i * 0.05}s forwards`;
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.feat-card, .stat-card, .insight-card, .qa-card').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  buildChart();
  initHamburger();
  updateDashboardStats();
  initScrollAnimations();

  // Close modals on overlay click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) overlay.classList.remove('open');
    });
  });

  // Quick add modal trigger
  const navCta = document.querySelector('.nav-cta');
  if (navCta) {
    navCta.addEventListener('click', () => {
      const modal = document.getElementById('quickAddModal');
      if (modal) modal.classList.add('open');
      else window.location.href = 'pages/pemasukan.html';
    });
  }
});
