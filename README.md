# 💰 FinSmart — Financial Smart Assistant
### "Learn while you Earn & Save"

Aplikasi asisten finansial pribadi untuk pelajar Indonesia, dibangun sebagai web app yang dapat dijalankan langsung di browser.

---

## 🚀 Cara Menjalankan

1. **Extract** file ZIP ini ke folder manapun
2. **Buka** file `index.html` menggunakan browser modern (Chrome, Firefox, Edge, Safari)
3. **Selesai!** Tidak perlu install apapun, tidak perlu koneksi internet

---

## 📱 Fitur Lengkap

### ⚡ Dashboard
- Ringkasan keuangan (Pemasukan, Pengeluaran, Tabungan, Saldo Bersih)
- Grafik sparkline performa keuangan
- Input cepat transaksi langsung dari dashboard
- Preview target tabungan aktif
- Daftar 5 transaksi terakhir
- Notifikasi peringatan & tips finansial (Nudge System)
- Sistem badge & pencapaian (Gamification)

### 📋 Smart Ledger
- Tabel transaksi lengkap dengan filter bulan & kategori
- Filter berdasarkan tipe (Pemasukan/Pengeluaran)
- Tag kategori berwarna (Makan, Transportasi, Hiburan, dll)
- Ringkasan total Pemasukan vs Pengeluaran
- Fitur **Scan Struk** (siap dikembangkan dengan kamera)
- Tambah, edit, hapus transaksi

### 🎯 Target Tabungan
- **Auto-Pocket**: Slider untuk atur % penyisihan otomatis
- Kartu target visual dengan **progress ring animasi**
- Estimasi waktu pencapaian target
- Tambah target baru dengan emoji custom
- Visualisasi progres per target

### 📈 Growth Simulator
- Slider interaktif untuk:
  - Tabungan awal
  - Tabungan per bulan (Rp 50rb – Rp 2jt)
  - Bunga/bagi hasil per tahun (1% – 20%)
  - Jangka waktu (1 – 30 tahun)
- Toggle **Bunga Majemuk vs Bunga Sederhana**
- Grafik pertumbuhan visual (area chart)
- Insight: "Uangmu bisa tumbuh Xx kali lipat!"

### 🔍 Analisis Kebiasaan
- **Pie Chart** distribusi pengeluaran per kategori
- **Bar Chart** pengeluaran harian
- Sistem **Batas Mingguan** per kategori dengan indikator warna
- Daftar Top 5 pengeluaran terbesar
- Peringatan jika melebihi batas

### 📚 Edukasi Hub
- Artikel finansial ringan untuk pelajar
- Kategori: Menabung, Investasi, Waspada Pinjol, Tips Hemat
- Sistem poin untuk setiap artikel dibaca
- Topik: Bunga Majemuk, Aturan 50/30/20, Waspada Pinjol, Efek Latte

---

## 🎮 Gamification
- **Streak sistem**: Konsistensi input harian
- **Badge/pencapaian**: Penabung Pertama, Analis Muda, Goal Setter, dll
- **Poin reward**: Dari membaca artikel & mencapai target
- **Level pengguna**: Dari Pemula hingga Master Finansial

---

## 🛠️ Teknologi

| Komponen | Teknologi |
|----------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Font | Syne (heading) + DM Sans (body) |
| Charts | Native Canvas API |
| Icons | Emoji Unicode |
| Storage | localStorage (siap dikembangkan) |

---

## 📁 Struktur File

```
finsmart/
├── index.html    ← Halaman utama & semua UI
├── style.css     ← Semua styling & tema dark mode
├── app.js        ← Logic aplikasi & interaktivitas
└── README.md     ← Dokumentasi ini
```

---

## 🔮 Rencana Pengembangan (Next Steps)

- [ ] Backend dengan **Supabase** untuk sync data antar perangkat
- [ ] **PWA** (Progressive Web App) agar bisa diinstall di HP
- [ ] **Scan struk** menggunakan OCR (Tesseract.js atau API)
- [ ] **Notifikasi push** untuk peringatan pengeluaran
- [ ] **Dark/Light mode toggle**
- [ ] **Widget home screen** (via PWA shortcuts)
- [ ] **Export laporan** ke PDF/Excel
- [ ] **Multi-currency** support

---

## 👨‍💻 Tech Stack untuk Pengembangan Lanjut

```
Mobile App  →  Flutter / React Native
Web App     →  Next.js / React.js
Database    →  Supabase (PostgreSQL)
Auth        →  Supabase Auth
Design      →  Figma → Tailwind CSS
Hosting     →  Vercel (gratis untuk pelajar!)
```

---

*Dibuat dengan ❤️ untuk presentasi FinSmart — Financial Smart Assistant*
*"Learn while you Earn & Save"*
