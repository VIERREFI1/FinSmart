// ==================== NAVIGASI HALAMAN AUTH ====================

function switchAuthPage(page) {
    document.querySelectorAll('.auth-page').forEach(p => p.classList.remove('active'));

    const target = page === 'login'
        ? document.getElementById('loginPage')
        : document.getElementById('signupPage');

    if (target) {
        target.classList.add('active');
        // Fokus ke field pertama untuk aksesibilitas
        setTimeout(() => {
            const firstInput = target.querySelector('input');
            if (firstInput) firstInput.focus();
        }, 100);
    }
}

// ==================== HANDLER MASUK ====================

function handleLogin(event) {
    event.preventDefault();

    const email    = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    if (!email || !password) {
        showToast('Mohon isi semua kolom yang diperlukan', 'error');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showToast('Format alamat email tidak valid', 'error');
        return;
    }

    // Set loading state
    const btn = document.getElementById('loginSubmitBtn');
    if (btn) {
        btn.textContent = '... MEMPROSES';
        btn.disabled = true;
    }

    // Simulasi autentikasi
    localStorage.setItem('vaultedLoggedIn', 'true');
    localStorage.setItem('vaultedUserEmail', email);
    localStorage.setItem('vaultedUserName', email.split('@')[0]);

    if (rememberMe) {
        localStorage.setItem('vaultedRememberMe', 'true');
        localStorage.setItem('vaultedRememberedEmail', email);
    } else {
        localStorage.removeItem('vaultedRememberMe');
        localStorage.removeItem('vaultedRememberedEmail');
    }

    showToast('✓ Masuk berhasil! Mengalihkan...', 'success');

    setTimeout(() => {
        const baseUrl = getBaseUrl();
        window.location.href = baseUrl + 'index.html';
    }, 1500);
}

// ==================== HANDLER DAFTAR ====================

function handleSignup(event) {
    event.preventDefault();

    const name        = document.getElementById('signupName').value.trim();
    const email       = document.getElementById('signupEmail').value.trim();
    const password    = document.getElementById('signupPassword').value;
    const confirm     = document.getElementById('signupConfirm').value;
    const accountType = document.getElementById('accountType').value;
    const agreeTerms  = document.getElementById('agreeTerms').checked;

    if (!name || !email || !password || !confirm || !accountType) {
        showToast('Mohon isi semua kolom yang diperlukan', 'error');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showToast('Format alamat email tidak valid', 'error');
        return;
    }

    if (password.length < 6) {
        showToast('Kata sandi minimal 6 karakter', 'error');
        return;
    }

    if (password !== confirm) {
        showToast('Kata sandi tidak cocok, coba lagi', 'error');
        return;
    }

    if (!agreeTerms) {
        showToast('Kamu harus menyetujui Syarat & Ketentuan', 'error');
        return;
    }

    // Set loading state
    const btn = document.getElementById('signupSubmitBtn');
    if (btn) {
        btn.textContent = '... MEMBUAT AKUN';
        btn.disabled = true;
    }

    // Simpan data pengguna baru
    localStorage.setItem('vaultedLoggedIn', 'true');
    localStorage.setItem('vaultedUserEmail', email);
    localStorage.setItem('vaultedUserName', name);
    localStorage.setItem('vaultedAccountType', accountType);

    // Inisialisasi dompet untuk pengguna baru
    const initialWallet = {
        readyToSpend: 500000,
        savings: 300000,
        emergency: 200000,
        currency: 'IDR'
    };
    localStorage.setItem('vaultedWallet', JSON.stringify(initialWallet));

    showToast('✓ Akun berhasil dibuat! Selamat datang di Vault-Ed!', 'success');

    setTimeout(() => {
        const baseUrl = getBaseUrl();
        window.location.href = baseUrl + 'index.html';
    }, 1500);
}

// ==================== TOAST NOTIFIKASI ====================

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.className = `toast show ${type}`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3500);
}

// ==================== UTILITAS URL ====================

function getBaseUrl() {
    const path = window.location.pathname;
    if (path.includes('/FinSmart/')) return '/FinSmart/';
    return '/';
}

// ==================== INISIALISASI HALAMAN ====================

document.addEventListener('DOMContentLoaded', () => {
    // Jika sudah masuk, langsung ke dashboard
    if (localStorage.getItem('vaultedLoggedIn') === 'true') {
        window.location.href = getBaseUrl() + 'index.html';
        return;
    }

    // Isi email tersimpan jika ada
    if (localStorage.getItem('vaultedRememberMe') === 'true') {
        const savedEmail = localStorage.getItem('vaultedRememberedEmail');
        if (savedEmail) {
            const emailInput = document.getElementById('loginEmail');
            const remember   = document.getElementById('rememberMe');
            if (emailInput) emailInput.value = savedEmail;
            if (remember)   remember.checked = true;
        }
    }

    // Pasang event listener form
    const loginForm  = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (loginForm)  loginForm.addEventListener('submit', handleLogin);
    if (signupForm) signupForm.addEventListener('submit', handleSignup);

    // Fokus ke field pertama saat halaman dimuat
    const firstInput = document.querySelector('.auth-page.active input');
    if (firstInput) firstInput.focus();
});

// Cegah kembali ke halaman auth setelah masuk
window.addEventListener('pageshow', (event) => {
    if (event.persisted && localStorage.getItem('vaultedLoggedIn') === 'true') {
        window.location.href = getBaseUrl() + 'index.html';
    }
});
