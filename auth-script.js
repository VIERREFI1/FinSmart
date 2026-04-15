// ==================== AUTHENTICATION FUNCTIONS ====================

function switchAuthPage(page) {
    document.querySelectorAll('.auth-page').forEach(p => p.classList.remove('active'));
    if (page === 'login') {
        document.getElementById('loginPage').classList.add('active');
    } else if (page === 'signup') {
        document.getElementById('signupPage').classList.add('active');
    }
}

function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    if (!email || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    if (password.length < 1) {
        showToast('Please enter a valid password', 'error');
        return;
    }
    
    // Simulate login - save to localStorage
    localStorage.setItem('vaultedLoggedIn', 'true');
    localStorage.setItem('vaultedUserEmail', email);
    localStorage.setItem('vaultedUserName', email.split('@')[0]);
    
    if (rememberMe) {
        localStorage.setItem('vaultedRememberMe', 'true');
        localStorage.setItem('vaultedRememberedEmail', email);
    }
    
    showToast('✓ Login successful! Redirecting...', 'success');
    
    // Redirect to dashboard after 1.5 seconds
    setTimeout(() => {
        const baseUrl = getBaseUrl();
        window.location.href = baseUrl + 'index.html';
    }, 1500);
}

function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirm = document.getElementById('signupConfirm').value;
    const accountType = document.getElementById('accountType').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    if (!name || !email || !password || !confirm || !accountType) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    if (password !== confirm) {
        showToast('Passwords do not match', 'error');
        return;
    }
    
    if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
    }
    
    if (!agreeTerms) {
        showToast('Please agree to the Terms of Service', 'error');
        return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    // Simulate signup - save to localStorage
    localStorage.setItem('vaultedLoggedIn', 'true');
    localStorage.setItem('vaultedUserEmail', email);
    localStorage.setItem('vaultedUserName', name);
    localStorage.setItem('vaultedAccountType', accountType);
    
    // Initialize wallet for new user
    const initialWallet = {
        readyToSpend: 500000,
        savings: 300000,
        emergency: 200000,
        currency: 'IDR'
    };
    localStorage.setItem('vaultedWallet', JSON.stringify(initialWallet));
    
    showToast('✓ Account created! Welcome to Vault-Ed!', 'success');
    
    // Redirect to dashboard after 1.5 seconds
    setTimeout(() => {
        const baseUrl = getBaseUrl();
        window.location.href = baseUrl + 'index.html';
    }, 1500);
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ==================== PAGE INITIALIZATION ====================
function getBaseUrl() {
    // Get the base URL for GitHub Pages or local
    const path = window.location.pathname;
    if (path.includes('/FinSmart/')) {
        return '/FinSmart/';
    }
    return '/';
}

document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem('vaultedLoggedIn') === 'true';
    if (isLoggedIn) {
        // Redirect to dashboard if already logged in
        const baseUrl = getBaseUrl();
        window.location.href = baseUrl + 'index.html';
        return;
    }
    
    // Check if user has "Remember me" enabled
    const rememberMe = localStorage.getItem('vaultedRememberMe') === 'true';
    if (rememberMe) {
        const rememberedEmail = localStorage.getItem('vaultedRememberedEmail');
        if (rememberedEmail) {
            document.getElementById('loginEmail').value = rememberedEmail;
            document.getElementById('rememberMe').checked = true;
        }
    }
    
    // Set up form submission handlers
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            if (document.getElementById('loginPage').classList.contains('active')) {
                handleLogin(e);
            } else if (document.getElementById('signupPage').classList.contains('active')) {
                handleSignup(e);
            }
        });
    });
});

// Prevent going back to auth page after login
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        const isLoggedIn = localStorage.getItem('vaultedLoggedIn') === 'true';
        if (isLoggedIn) {
            const baseUrl = getBaseUrl();
            window.location.href = baseUrl + 'index.html';
        }
    }
});
