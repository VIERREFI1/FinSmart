// ===== DATA STORE =====
const store = {
  pemasukan: JSON.parse(localStorage.getItem('pemasukan') || '[]'),
  pengeluaran: JSON.parse(localStorage.getItem('pengeluaran') || '[]'),
  tabungan: JSON.parse(localStorage.getItem('tabungan') || '[]'),
};

function save() {
  localStorage.setItem('pemasukan', JSON.stringify(store.pemasukan));
  localStorage.setItem('pengeluaran', JSON.stringify(store.pengeluaran));
  localStorage.setItem('tabungan', JSON.stringify(store.tabungan));
}

function formatRp(n) {
  return 'Rp ' + Number(n).toLocaleString('id-ID');
}

// ===== CHART BARS =====
function buildChart() {
  const el = document.getElementById('chartBars');
  if (!el) return;
  const data = [
    { inc: 7000000, exp: 3200000 },
    { inc: 6500000, exp: 2800000 },
    { inc: 8000000, exp: 3500000 },
    { inc: 7500000, exp: 2900000 },
    { inc: 9000000, exp: 3800000 },
    { inc: 8500000, exp: 3240000 },
  ];
  const max = Math.max(...data.map(d => d.inc));
  el.innerHTML = data.map(d => `
    <div class="chart-group">
      <div class="bar income" style="height:${(d.inc/max)*100}%"></div>
      <div class="bar expense" style="height:${(d.exp/max)*100}%"></div>
    </div>
  `).join('');
}

// ===== ANIMATE FEAT CARDS =====
function animateCards() {
  document.querySelectorAll('.feat-card').forEach((c, i) => {
    c.style.animationDelay = (i * 0.1) + 's';
  });
}

// ===== HAMBURGER =====
function initHamburger() {
  const btn = document.getElementById('hamburger');
  const links = document.querySelector('.nav-links');
  if (!btn || !links) return;
  btn.addEventListener('click', () => {
    links.style.display = links.style.display === 'flex' ? 'none' : 'flex';
    links.style.flexDirection = 'column';
    links.style.position = 'absolute';
    links.style.top = '70px';
    links.style.left = '0';
    links.style.right = '0';
    links.style.background = 'var(--bg2)';
    links.style.padding = '20px';
    links.style.borderBottom = '1px solid var(--border)';
  });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  buildChart();
  animateCards();
  initHamburger();
});
