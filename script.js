// ==================== DATA MANAGEMENT ====================
class VaultEdApp {
    constructor() {
        this.user = {
            name: 'Student',
            email: 'student@vault-ed.com',
            currency: 'IDR'
        };
        
        this.wallet = {
            readyToSpend: 500000,
            savings: 300000,
            emergency: 200000,
            currency: 'IDR'
        };
        
        this.transactions = [];
        this.goals = [];
        this.challenges = [];
        this.parentTasks = [];
        this.notifications = [];
        
        this.loadFromLocalStorage();
        this.initializeApp();
    }
    
    // ==================== INITIALIZATION ====================
    initializeApp() {
        this.checkAuthStatus();
        this.setupEventListeners();
        this.updateDashboard();
        this.setCurrentDate();
        this.checkPredictiveAI();
    }
    
    checkAuthStatus() {
        const isLoggedIn = localStorage.getItem("vaultedLoggedIn") === "true";
        if (!isLoggedIn) {
            document.getElementById("authContainer").classList.remove("hidden");
            document.getElementById("appContainer").classList.add("hidden");
        } else {
            document.getElementById("authContainer").classList.add("hidden");
            document.getElementById("appContainer").classList.remove("hidden");
        }
    }
    }
    
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.showPage(page);
            });
        });
        
        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                const navMenu = document.querySelector('.nav-menu');
                navMenu.classList.toggle('show');
            });
        }
        
        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => {
            if (confirm('Are you sure you want to logout?')) {
                this.logout();
            }
        });
        
        // Dark mode toggle
        const darkModeCheckbox = document.getElementById('darkMode');
        if (darkModeCheckbox) {
            darkModeCheckbox.addEventListener('change', () => {
                document.body.classList.toggle('dark-mode');
                localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
            });
        }
        
        // Filter transactions
        const filterCategory = document.getElementById('filterCategory');
        const filterMonth = document.getElementById('filterMonth');
        if (filterCategory) {
            filterCategory.addEventListener('change', () => this.displayTransactions());
        }
        if (filterMonth) {
            filterMonth.addEventListener('change', () => this.displayTransactions());
        }
    }
    
    setCurrentDate() {
        const today = new Date().toISOString().split('T')[0];
        const dateInputs = document.querySelectorAll('input[type="date"]');
        dateInputs.forEach(input => {
            if (!input.value) {
                input.value = today;
            }
        });
        
        const monthInput = document.getElementById('filterMonth');
        if (monthInput && !monthInput.value) {
            const year = new Date().getFullYear();
            const month = String(new Date().getMonth() + 1).padStart(2, '0');
            monthInput.value = `${year}-${month}`;
        }
    }
    
    // ==================== PAGE NAVIGATION ====================
    showPage(pageName) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        const page = document.getElementById(`page-${pageName}`);
        if (page) {
            page.classList.add('active');
        }
        
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-page="${pageName}"]`).classList.add('active');
        
        // Update page title
        const titles = {
            dashboard: '📊 Dashboard',
            wallet: '💳 Wallet Management',
            transactions: '📝 Transactions',
            goals: '🎯 Savings Goals',
            reports: '📈 Monthly Report',
            simulator: '⏰ Time Machine',
            challenge: '🏆 Weekly Challenge',
            parent: '👨‍👩‍👧 Parent Link',
            settings: '⚙️ Settings'
        };
        document.getElementById('pageTitle').textContent = titles[pageName] || 'Dashboard';
        
        // Refresh page-specific content
        if (pageName === 'transactions') {
            this.displayTransactions();
        } else if (pageName === 'goals') {
            this.displayGoals();
        } else if (pageName === 'challenge') {
            this.displayLeaderboard();
        } else if (pageName === 'parent') {
            this.displayParentTasks();
        }
    }
    
    // ==================== WALLET MANAGEMENT ====================
    updateDashboard() {
        this.updateWalletDisplay();
        this.updateStats();
        this.displayRecentTransactions();
        this.displayGoalsPreview();
        this.updateAlerts();
        this.updateInterestProgress();
    }
    
    updateWalletDisplay() {
        const total = this.getTotalBalance();
        const readyPercent = (this.wallet.readyToSpend / total) * 100 || 0;
        const savingsPercent = (this.wallet.savings / total) * 100 || 0;
        const emergencyPercent = (this.wallet.emergency / total) * 100 || 0;
        
        document.getElementById('readyToSpendAmount').textContent = this.formatCurrency(this.wallet.readyToSpend);
        document.getElementById('savingsAmount').textContent = this.formatCurrency(this.wallet.savings);
        document.getElementById('emergencyAmount').textContent = this.formatCurrency(this.wallet.emergency);
        document.getElementById('totalBalance').textContent = this.formatCurrency(total);
        
        document.getElementById('readyToSpendBar').style.width = readyPercent + '%';
        document.getElementById('savingsBar').style.width = savingsPercent + '%';
        document.getElementById('emergencyBar').style.width = emergencyPercent + '%';
        
        // Update wallet inputs
        document.getElementById('readyToSpendInput').value = this.wallet.readyToSpend;
        document.getElementById('savingsInput').value = this.wallet.savings;
        document.getElementById('emergencyInput').value = this.wallet.emergency;
    }
    
    getTotalBalance() {
        return this.wallet.readyToSpend + this.wallet.savings + this.wallet.emergency;
    }
    
    formatCurrency(amount) {
        const formatter = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: this.wallet.currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
        return formatter.format(amount);
    }
    
    updateWallet() {
        const ready = parseFloat(document.getElementById('readyToSpendInput').value) || 0;
        const savings = parseFloat(document.getElementById('savingsInput').value) || 0;
        const emergency = parseFloat(document.getElementById('emergencyInput').value) || 0;
        
        this.wallet.readyToSpend = ready;
        this.wallet.savings = savings;
        this.wallet.emergency = emergency;
        
        this.updateDashboard();
        this.saveToLocalStorage();
        this.showToast('Wallet updated successfully!', 'success');
    }
    
    addFunds() {
        const amount = parseFloat(document.getElementById('addFundsAmount').value);
        const walletType = document.getElementById('addFundsWallet').value;
        
        if (!amount || amount <= 0) {
            this.showToast('Please enter a valid amount', 'error');
            return;
        }
        
        this.wallet[walletType] += amount;
        document.getElementById('addFundsAmount').value = '';
        
        this.updateDashboard();
        this.saveToLocalStorage();
        this.showToast(`Added ${this.formatCurrency(amount)} to ${walletType}`, 'success');
    }
    
    transferFunds() {
        const from = document.getElementById('transferFrom').value;
        const to = document.getElementById('transferTo').value;
        const amount = parseFloat(document.getElementById('transferAmount').value);
        
        if (!from || !to || from === to) {
            this.showToast('Please select different wallets', 'error');
            return;
        }
        
        if (!amount || amount <= 0) {
            this.showToast('Please enter a valid amount', 'error');
            return;
        }
        
        if (this.wallet[from] < amount) {
            this.showToast('Insufficient balance', 'error');
            return;
        }
        
        this.wallet[from] -= amount;
        this.wallet[to] += amount;
        document.getElementById('transferAmount').value = '';
        
        this.updateDashboard();
        this.saveToLocalStorage();
        this.showToast(`Transferred ${this.formatCurrency(amount)}`, 'success');
    }
    
    // ==================== TRANSACTIONS ====================
    addTransaction() {
        const description = document.getElementById('transDescription').value;
        const amount = parseFloat(document.getElementById('transAmount').value);
        const category = document.getElementById('transCategory').value;
        const sourceWallet = document.getElementById('transSourceWallet').value;
        const date = document.getElementById('transDate').value;
        
        if (!description || !amount || !category || !date) {
            this.showToast('Please fill in all fields', 'error');
            return;
        }
        
        if (this.wallet[sourceWallet] < amount) {
            this.showToast('Insufficient balance in selected wallet', 'error');
            return;
        }
        
        // Deduct from wallet
        this.wallet[sourceWallet] -= amount;
        
        // Add transaction
        const transaction = {
            id: Date.now(),
            description,
            amount,
            category,
            sourceWallet,
            date,
            createdAt: new Date().toISOString()
        };
        
        this.transactions.unshift(transaction);
        
        // Clear form
        document.getElementById('transDescription').value = '';
        document.getElementById('transAmount').value = '';
        document.getElementById('transCategory').value = '';
        
        this.updateDashboard();
        this.saveToLocalStorage();
        this.showToast('Transaction added successfully!', 'success');
    }
    
    displayTransactions() {
        const filterCategory = document.getElementById('filterCategory').value;
        const filterMonth = document.getElementById('filterMonth').value;
        
        let filtered = this.transactions;
        
        if (filterCategory) {
            filtered = filtered.filter(t => t.category === filterCategory);
        }
        
        if (filterMonth) {
            filtered = filtered.filter(t => t.date.startsWith(filterMonth));
        }
        
        const tbody = document.getElementById('transactionsTableBody');
        tbody.innerHTML = '';
        
        if (filtered.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No transactions found</td></tr>';
            return;
        }
        
        filtered.forEach(trans => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${new Date(trans.date).toLocaleDateString('id-ID')}</td>
                <td>${trans.description}</td>
                <td>${trans.category}</td>
                <td>${this.formatCurrency(trans.amount)}</td>
                <td>${trans.sourceWallet}</td>
                <td>
                    <button class="btn btn-secondary" onclick="app.deleteTransaction(${trans.id})">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
    
    deleteTransaction(id) {
        const trans = this.transactions.find(t => t.id === id);
        if (!trans) return;
        
        if (confirm('Delete this transaction?')) {
            // Refund to wallet
            this.wallet[trans.sourceWallet] += trans.amount;
            
            // Remove transaction
            this.transactions = this.transactions.filter(t => t.id !== id);
            
            this.updateDashboard();
            this.displayTransactions();
            this.saveToLocalStorage();
            this.showToast('Transaction deleted', 'success');
        }
    }
    
    displayRecentTransactions() {
        const list = document.getElementById('recentTransactionsList');
        const recent = this.transactions.slice(0, 5);
        
        if (recent.length === 0) {
            list.innerHTML = '<p class="empty-state">No transactions yet. Add one to get started!</p>';
            return;
        }
        
        list.innerHTML = recent.map(trans => `
            <div class="transaction-item">
                <div class="transaction-info">
                    <div class="transaction-category">${trans.category}</div>
                    <div class="transaction-date">${new Date(trans.date).toLocaleDateString('id-ID')}</div>
                </div>
                <div class="transaction-amount">-${this.formatCurrency(trans.amount)}</div>
            </div>
        `).join('');
    }
    
    // ==================== STATISTICS ====================
    updateStats() {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        const monthTransactions = this.transactions.filter(t => {
            const tDate = new Date(t.date);
            return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
        });
        
        const totalSpent = monthTransactions.reduce((sum, t) => sum + t.amount, 0);
        const totalSaved = this.wallet.savings;
        const savingsRate = this.getTotalBalance() > 0 ? (totalSaved / this.getTotalBalance()) * 100 : 0;
        
        document.getElementById('monthlySpent').textContent = this.formatCurrency(totalSpent);
        document.getElementById('monthlySaved').textContent = this.formatCurrency(totalSaved);
        document.getElementById('savingsRate').textContent = savingsRate.toFixed(1) + '%';
        
        // Top category
        const categoryTotals = {};
        monthTransactions.forEach(t => {
            categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
        });
        
        const topCategory = Object.keys(categoryTotals).length > 0 
            ? Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0][0]
            : '-';
        
        document.getElementById('topCategory').textContent = topCategory;
    }
    
    // ==================== SAVINGS GOALS ====================
    addGoal() {
        const name = document.getElementById('goalName').value;
        const target = parseFloat(document.getElementById('goalTarget').value);
        const deadline = document.getElementById('goalDeadline').value;
        
        if (!name || !target || target <= 0) {
            this.showToast('Please fill in all fields', 'error');
            return;
        }
        
        const goal = {
            id: Date.now(),
            name,
            targetAmount: target,
            currentAmount: 0,
            deadline,
            isCompleted: false,
            createdAt: new Date().toISOString()
        };
        
        this.goals.push(goal);
        
        document.getElementById('goalName').value = '';
        document.getElementById('goalTarget').value = '';
        document.getElementById('goalDeadline').value = '';
        
        this.displayGoals();
        this.saveToLocalStorage();
        this.showToast('Goal created successfully!', 'success');
    }
    
    displayGoals() {
        const grid = document.getElementById('goalsGrid');
        
        if (this.goals.length === 0) {
            grid.innerHTML = '<p class="empty-state">No goals yet. Create one to start your savings journey!</p>';
            return;
        }
        
        grid.innerHTML = this.goals.map(goal => {
            const percentage = (goal.currentAmount / goal.targetAmount) * 100;
            const daysLeft = goal.deadline ? Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24)) : '-';
            
            return `
                <div class="goal-card">
                    <div class="goal-name">${goal.name}</div>
                    <div class="goal-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${Math.min(percentage, 100)}%"></div>
                        </div>
                        <div class="goal-stats">
                            <span>${this.formatCurrency(goal.currentAmount)}</span>
                            <span class="goal-percentage">${percentage.toFixed(1)}%</span>
                            <span>${this.formatCurrency(goal.targetAmount)}</span>
                        </div>
                    </div>
                    ${goal.deadline ? `<p style="font-size: 13px; color: var(--text-secondary); margin-top: var(--spacing-md);">Days left: ${daysLeft}</p>` : ''}
                    <div style="display: flex; gap: var(--spacing-md); margin-top: var(--spacing-md);">
                        <input type="number" placeholder="Add amount" id="addGoalAmount${goal.id}" min="0" style="flex: 1; padding: var(--spacing-sm); border: 1px solid var(--border); border-radius: var(--radius-md);">
                        <button class="btn btn-primary" onclick="app.addToGoal(${goal.id})">Add</button>
                        <button class="btn btn-secondary" onclick="app.deleteGoal(${goal.id})">Delete</button>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    addToGoal(goalId) {
        const amount = parseFloat(document.getElementById(`addGoalAmount${goalId}`).value);
        const goal = this.goals.find(g => g.id === goalId);
        
        if (!amount || amount <= 0) {
            this.showToast('Please enter a valid amount', 'error');
            return;
        }
        
        if (this.wallet.savings < amount) {
            this.showToast('Insufficient savings balance', 'error');
            return;
        }
        
        goal.currentAmount += amount;
        this.wallet.savings -= amount;
        
        if (goal.currentAmount >= goal.targetAmount) {
            goal.isCompleted = true;
            this.showToast(`🎉 Goal "${goal.name}" completed!`, 'success');
        }
        
        this.displayGoals();
        this.updateDashboard();
        this.saveToLocalStorage();
    }
    
    deleteGoal(goalId) {
        if (confirm('Delete this goal?')) {
            this.goals = this.goals.filter(g => g.id !== goalId);
            this.displayGoals();
            this.saveToLocalStorage();
            this.showToast('Goal deleted', 'success');
        }
    }
    
    displayGoalsPreview() {
        const list = document.getElementById('goalsPreviewList');
        const active = this.goals.filter(g => !g.isCompleted).slice(0, 3);
        
        if (active.length === 0) {
            list.innerHTML = '<p class="empty-state">No goals yet. Create one to start saving!</p>';
            return;
        }
        
        list.innerHTML = active.map(goal => {
            const percentage = (goal.currentAmount / goal.targetAmount) * 100;
            return `
                <div class="goal-item">
                    <div>
                        <strong>${goal.name}</strong><br>
                        <small>${this.formatCurrency(goal.currentAmount)} / ${this.formatCurrency(goal.targetAmount)}</small>
                    </div>
                    <div style="text-align: right;">
                        <strong>${percentage.toFixed(0)}%</strong>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    // ==================== MONTHLY REPORT ====================
    generateMonthlyReport() {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        const monthTransactions = this.transactions.filter(t => {
            const tDate = new Date(t.date);
            return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
        });
        
        const totalSpent = monthTransactions.reduce((sum, t) => sum + t.amount, 0);
        const totalSaved = this.wallet.savings;
        const savingsPercentage = this.getTotalBalance() > 0 ? (totalSaved / this.getTotalBalance()) * 100 : 0;
        
        // Category breakdown
        const categoryTotals = {};
        monthTransactions.forEach(t => {
            categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
        });
        
        const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
        const topCategory = sortedCategories.length > 0 ? sortedCategories[0][0] : 'N/A';
        const topCategoryAmount = sortedCategories.length > 0 ? sortedCategories[0][1] : 0;
        
        const monthName = new Date(currentYear, currentMonth).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
        
        const reportHTML = `
            <div class="report-content">
                <div class="report-month">Your ${monthName} Financial Summary</div>
                
                <div class="report-stats">
                    <div class="report-stat">
                        <div class="report-stat-label">Total Spent</div>
                        <div class="report-stat-value">${this.formatCurrency(totalSpent)}</div>
                    </div>
                    <div class="report-stat">
                        <div class="report-stat-label">Total Saved</div>
                        <div class="report-stat-value">${this.formatCurrency(totalSaved)}</div>
                    </div>
                    <div class="report-stat">
                        <div class="report-stat-label">Savings Rate</div>
                        <div class="report-stat-value">${savingsPercentage.toFixed(1)}%</div>
                    </div>
                    <div class="report-stat">
                        <div class="report-stat-label">Top Category</div>
                        <div class="report-stat-value">${topCategory}</div>
                    </div>
                </div>
                
                <div class="report-chart">
                    <div class="chart-title">Spending by Category</div>
                    <div class="chart-bars">
                        ${sortedCategories.slice(0, 5).map(([category, amount]) => {
                            const maxAmount = sortedCategories[0][1];
                            const height = (amount / maxAmount) * 100;
                            return `
                                <div class="chart-bar" style="height: ${height}%;">
                                    <div style="color: white; font-weight: 600; font-size: 12px; margin-bottom: var(--spacing-sm);">${this.formatCurrency(amount)}</div>
                                    <div class="chart-bar-label">${category}</div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
                
                <p style="margin-top: var(--spacing-lg); font-size: 14px; opacity: 0.9;">
                    ${this.getFinancialTip(savingsPercentage)}
                </p>
            </div>
        `;
        
        document.getElementById('reportContainer').innerHTML = reportHTML;
        this.showToast('Monthly report generated!', 'success');
    }
    
    getFinancialTip(savingsPercentage) {
        if (savingsPercentage >= 50) {
            return '🌟 Excellent savings rate! You\'re on track to financial success!';
        } else if (savingsPercentage >= 30) {
            return '👍 Good job! Keep up the disciplined spending.';
        } else if (savingsPercentage >= 10) {
            return '💡 Try to increase your savings rate by reducing discretionary spending.';
        } else {
            return '⚠️ Consider reviewing your spending habits to save more.';
        }
    }
    
    // ==================== TIME MACHINE SIMULATOR ====================
    switchTab(tabName) {
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        
        document.getElementById(`tab-${tabName}`).classList.add('active');
        event.target.classList.add('active');
    }
    
    calculateInterest() {
        const principal = parseFloat(document.getElementById('initialAmount').value);
        const rate = parseFloat(document.getElementById('interestRate').value);
        const years = parseInt(document.getElementById('years').value);
        
        if (!principal || !rate || !years) {
            this.showToast('Please fill in all fields', 'error');
            return;
        }
        
        const results = [];
        let amount = principal;
        
        for (let year = 0; year <= years; year++) {
            results.push({
                year,
                amount: amount
            });
            amount = principal * Math.pow(1 + rate / 100, year + 1);
        }
        
        const finalAmount = principal * Math.pow(1 + rate / 100, years);
        const totalInterest = finalAmount - principal;
        
        const resultHTML = `
            <div class="result-item">
                <span class="result-label">Initial Amount</span>
                <span class="result-value">${this.formatCurrency(principal)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Annual Interest Rate</span>
                <span class="result-value">${rate}%</span>
            </div>
            <div class="result-item">
                <span class="result-label">Time Period</span>
                <span class="result-value">${years} years</span>
            </div>
            <div class="result-item" style="border-top: 2px solid rgba(255,255,255,0.2); padding-top: var(--spacing-md); margin-top: var(--spacing-md);">
                <span class="result-label">Final Amount</span>
                <span class="result-value">${this.formatCurrency(finalAmount)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Total Interest Earned</span>
                <span class="result-value">${this.formatCurrency(totalInterest)}</span>
            </div>
        `;
        
        document.getElementById('interestResult').innerHTML = resultHTML;
    }
    
    calculateHabitCost() {
        const dailyCost = parseFloat(document.getElementById('dailyCost').value);
        const habitName = document.getElementById('habitName').value;
        const timePeriod = document.getElementById('timePeriod').value;
        
        if (!dailyCost || !habitName) {
            this.showToast('Please fill in all fields', 'error');
            return;
        }
        
        let totalCost = 0;
        let period = '';
        
        switch (timePeriod) {
            case 'week':
                totalCost = dailyCost * 7;
                period = '1 Week';
                break;
            case 'month':
                totalCost = dailyCost * 30;
                period = '1 Month';
                break;
            case 'year':
                totalCost = dailyCost * 365;
                period = '1 Year';
                break;
            case '5years':
                totalCost = dailyCost * 365 * 5;
                period = '5 Years';
                break;
            case '10years':
                totalCost = dailyCost * 365 * 10;
                period = '10 Years';
                break;
        }
        
        const resultHTML = `
            <div class="result-item">
                <span class="result-label">Habit</span>
                <span class="result-value">${habitName}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Daily Cost</span>
                <span class="result-value">${this.formatCurrency(dailyCost)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Time Period</span>
                <span class="result-value">${period}</span>
            </div>
            <div class="result-item" style="border-top: 2px solid rgba(255,255,255,0.2); padding-top: var(--spacing-md); margin-top: var(--spacing-md);">
                <span class="result-label">Total Cost</span>
                <span class="result-value">${this.formatCurrency(totalCost)}</span>
            </div>
            <p style="margin-top: var(--spacing-lg); font-size: 13px; opacity: 0.9;">
                💡 If you saved this money instead, you could reach your goals faster!
            </p>
        `;
        
        document.getElementById('habitResult').innerHTML = resultHTML;
    }
    
    // ==================== BUDGETING CHALLENGE ====================
    inviteFriend() {
        const friendName = document.getElementById('friendName').value;
        
        if (!friendName) {
            this.showToast('Please enter a friend\'s name', 'error');
            return;
        }
        
        const challenge = {
            id: Date.now(),
            name: friendName,
            weeklySpending: 0,
            joinedAt: new Date().toISOString()
        };
        
        this.challenges.push(challenge);
        document.getElementById('friendName').value = '';
        
        this.displayLeaderboard();
        this.saveToLocalStorage();
        this.showToast(`${friendName} invited to challenge!`, 'success');
    }
    
    displayLeaderboard() {
        const leaderboard = document.getElementById('leaderboard');
        
        // Calculate weekly spending
        const now = new Date();
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
        
        const weekTransactions = this.transactions.filter(t => {
            const tDate = new Date(t.date);
            return tDate >= weekStart;
        });
        
        const userWeeklySpending = weekTransactions.reduce((sum, t) => sum + t.amount, 0);
        
        // Create leaderboard
        const participants = [
            { rank: 1, name: 'You', spending: userWeeklySpending },
            ...this.challenges.map((c, i) => ({
                rank: i + 2,
                name: c.name,
                spending: Math.floor(Math.random() * 500000) // Simulated spending
            }))
        ];
        
        participants.sort((a, b) => a.spending - b.spending);
        participants.forEach((p, i) => p.rank = i + 1);
        
        leaderboard.innerHTML = participants.map(p => `
            <div class="leaderboard-item">
                <span class="rank">${p.rank}</span>
                <span class="name">${p.name}</span>
                <span class="spending">${this.formatCurrency(p.spending)}</span>
            </div>
        `).join('');
    }
    
    // ==================== PARENT TASKS ====================
    createParentTask() {
        const title = document.getElementById('taskTitle').value;
        const description = document.getElementById('taskDescription').value;
        const target = parseFloat(document.getElementById('taskTarget').value);
        const reward = document.getElementById('taskReward').value;
        const dueDate = document.getElementById('taskDueDate').value;
        
        if (!title || !target || !reward) {
            this.showToast('Please fill in all required fields', 'error');
            return;
        }
        
        const task = {
            id: Date.now(),
            title,
            description,
            targetAmount: target,
            reward,
            dueDate,
            isCompleted: false,
            rewardUnlocked: false,
            createdAt: new Date().toISOString()
        };
        
        this.parentTasks.push(task);
        
        document.getElementById('taskTitle').value = '';
        document.getElementById('taskDescription').value = '';
        document.getElementById('taskTarget').value = '';
        document.getElementById('taskReward').value = '';
        document.getElementById('taskDueDate').value = '';
        
        this.displayParentTasks();
        this.saveToLocalStorage();
        this.showToast('Task created successfully!', 'success');
    }
    
    displayParentTasks() {
        const tasksList = document.getElementById('tasksList');
        const rewardsList = document.getElementById('rewardsList');
        
        const activeTasks = this.parentTasks.filter(t => !t.isCompleted);
        const completedTasks = this.parentTasks.filter(t => t.isCompleted);
        
        if (activeTasks.length === 0) {
            tasksList.innerHTML = '<p class="empty-state">No active tasks.</p>';
        } else {
            tasksList.innerHTML = activeTasks.map(task => `
                <div style="background: var(--bg-secondary); padding: var(--spacing-md); border-radius: var(--radius-lg); margin-bottom: var(--spacing-md);">
                    <h4>${task.title}</h4>
                    <p style="font-size: 13px; color: var(--text-secondary); margin: var(--spacing-sm) 0;">${task.description}</p>
                    <p><strong>Target:</strong> ${this.formatCurrency(task.targetAmount)}</p>
                    <p><strong>Reward:</strong> ${task.reward}</p>
                    ${task.dueDate ? `<p><strong>Due:</strong> ${new Date(task.dueDate).toLocaleDateString('id-ID')}</p>` : ''}
                    <button class="btn btn-primary" onclick="app.completeTask(${task.id})">Mark as Complete</button>
                </div>
            `).join('');
        }
        
        if (completedTasks.length === 0) {
            rewardsList.innerHTML = '<p class="empty-state">No completed tasks yet.</p>';
        } else {
            rewardsList.innerHTML = completedTasks.map(task => `
                <div style="background: var(--bg-secondary); padding: var(--spacing-md); border-radius: var(--radius-lg); margin-bottom: var(--spacing-md); border-left: 4px solid var(--success);">
                    <h4>✓ ${task.title}</h4>
                    <p><strong>Reward Unlocked:</strong> ${task.reward}</p>
                    <p style="font-size: 13px; color: var(--text-secondary);">Completed on ${new Date(task.createdAt).toLocaleDateString('id-ID')}</p>
                </div>
            `).join('');
        }
    }
    
    completeTask(taskId) {
        const task = this.parentTasks.find(t => t.id === taskId);
        if (task) {
            task.isCompleted = true;
            task.rewardUnlocked = true;
            this.displayParentTasks();
            this.saveToLocalStorage();
            this.showToast(`🎉 Task completed! Reward unlocked: ${task.reward}`, 'success');
        }
    }
    
    // ==================== ALERTS & WARNINGS ====================
    updateAlerts() {
        const alertsList = document.getElementById('alertsList');
        const alerts = [];
        
        // Check if ready to spend is low
        if (this.wallet.readyToSpend < 50000) {
            alerts.push({
                type: 'warning',
                message: '⚠️ Your Ready to Spend balance is running low!'
            });
        }
        
        // Check predictive AI runout
        const runoutDate = this.getPredictiveRunoutDate();
        if (runoutDate) {
            alerts.push({
                type: 'warning',
                message: `📅 Estimated runout date: ${runoutDate}`
            });
        }
        
        if (alerts.length === 0) {
            alertsList.innerHTML = '<p class="empty-state">No alerts. Keep up the good work!</p>';
        } else {
            alertsList.innerHTML = alerts.map(alert => `
                <div style="padding: var(--spacing-md); background: var(--bg-secondary); border-radius: var(--radius-lg); margin-bottom: var(--spacing-md); border-left: 4px solid var(--warning);">
                    ${alert.message}
                </div>
            `).join('');
        }
    }
    
    checkPredictiveAI() {
        const now = new Date();
        const firstWeekStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const firstWeekEnd = new Date(now.getFullYear(), now.getMonth(), 7);
        
        const firstWeekTransactions = this.transactions.filter(t => {
            const tDate = new Date(t.date);
            return tDate >= firstWeekStart && tDate <= firstWeekEnd;
        });
        
        if (firstWeekTransactions.length > 0) {
            const firstWeekSpent = firstWeekTransactions.reduce((sum, t) => sum + t.amount, 0);
            const dailyAverage = firstWeekSpent / 7;
            const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
            const estimatedTotal = dailyAverage * daysInMonth;
            const runoutDate = new Date(now.getFullYear(), now.getMonth(), Math.ceil(estimatedTotal / dailyAverage));
            
            if (runoutDate < new Date(now.getFullYear(), now.getMonth() + 1, 1)) {
                this.addNotification('Runout Warning', `Your allowance may run out on ${runoutDate.toLocaleDateString('id-ID')}`, 'runout_warning');
            }
        }
    }
    
    getPredictiveRunoutDate() {
        const now = new Date();
        const firstWeekStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const firstWeekEnd = new Date(now.getFullYear(), now.getMonth(), 7);
        
        const firstWeekTransactions = this.transactions.filter(t => {
            const tDate = new Date(t.date);
            return tDate >= firstWeekStart && tDate <= firstWeekEnd;
        });
        
        if (firstWeekTransactions.length === 0) return null;
        
        const firstWeekSpent = firstWeekTransactions.reduce((sum, t) => sum + t.amount, 0);
        const dailyAverage = firstWeekSpent / 7;
        const daysUntilRunout = Math.ceil(this.wallet.readyToSpend / dailyAverage);
        const runoutDate = new Date(now.getTime() + daysUntilRunout * 24 * 60 * 60 * 1000);
        
        return runoutDate.toLocaleDateString('id-ID');
    }
    
    // ==================== INTEREST ACCRUAL ====================
    updateInterestProgress() {
        const lastTransaction = this.transactions.length > 0 
            ? new Date(this.transactions[0].date)
            : new Date();
        
        const daysSinceLastTransaction = Math.floor((new Date() - lastTransaction) / (1000 * 60 * 60 * 24));
        const daysUntilBonus = Math.max(0, 30 - daysSinceLastTransaction);
        
        const progressPercent = ((30 - daysUntilBonus) / 30) * 100;
        
        document.getElementById('interestProgress').style.width = progressPercent + '%';
        document.getElementById('interestDaysLeft').textContent = `Days until bonus: ${daysUntilBonus}`;
        
        if (daysUntilBonus === 0 && this.transactions.length > 0) {
            this.applyInterestBonus();
        }
    }
    
    applyInterestBonus() {
        const bonus = this.wallet.savings * 0.02 / 12; // 2% annual interest
        if (bonus > 0) {
            this.wallet.savings += bonus;
            this.addNotification('Interest Applied', `You earned ${this.formatCurrency(bonus)} in interest!`, 'interest_applied');
            this.updateDashboard();
            this.saveToLocalStorage();
        }
    }
    
    // ==================== SETTINGS ====================
    saveSettings() {
        this.user.name = document.getElementById('settingsName').value || this.user.name;
        this.user.email = document.getElementById('settingsEmail').value || this.user.email;
        
        document.getElementById('userName').textContent = this.user.name;
        document.getElementById('userEmail').textContent = this.user.email;
        
        this.saveToLocalStorage();
        this.showToast('Settings saved!', 'success');
    }
    
    savePreferences() {
        const currency = document.getElementById('currencySelect').value;
        this.wallet.currency = currency;
        this.user.currency = currency;
        
        this.saveToLocalStorage();
        this.updateDashboard();
        this.showToast('Preferences saved!', 'success');
    }
    
    exportData() {
        const data = {
            user: this.user,
            wallet: this.wallet,
            transactions: this.transactions,
            goals: this.goals,
            challenges: this.challenges,
            parentTasks: this.parentTasks,
            exportedAt: new Date().toISOString()
        };
        
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vault-ed-backup-${Date.now()}.json`;
        a.click();
        
        this.showToast('Data exported successfully!', 'success');
    }
    
    exportCSV() {
        let csv = 'Date,Description,Category,Amount,Source Wallet\n';
        
        this.transactions.forEach(t => {
            csv += `"${t.date}","${t.description}","${t.category}","${t.amount}","${t.sourceWallet}"\n`;
        });
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vault-ed-transactions-${Date.now()}.csv`;
        a.click();
        
        this.showToast('Transactions exported as CSV!', 'success');
    }
    
    resetData() {
        if (confirm('Are you sure? This will delete all your data!')) {
            this.wallet = { readyToSpend: 500000, savings: 300000, emergency: 200000, currency: 'IDR' };
            this.transactions = [];
            this.goals = [];
            this.challenges = [];
            this.parentTasks = [];
            
            this.saveToLocalStorage();
            this.updateDashboard();
            this.showToast('All data reset!', 'success');
        }
    }
    
    logout() {
        this.saveToLocalStorage();
        localStorage.setItem('vaultedLoggedIn', 'false');
        localStorage.removeItem('vaultedUserEmail');
        localStorage.removeItem('vaultedUserName');
        
        document.getElementById('authContainer').classList.remove('hidden');
        document.getElementById('appContainer').classList.add('hidden');
        
        document.querySelectorAll('.auth-page').forEach(p => p.classList.remove('active'));
        document.getElementById('loginPage').classList.add('active');
        
        showAuthToast('You have been logged out', 'success');
    }
    
    // ==================== NOTIFICATIONS ====================
    addNotification(title, message, type = 'info') {
        const notification = {
            id: Date.now(),
            title,
            message,
            type,
            createdAt: new Date().toISOString()
        };
        
        this.notifications.unshift(notification);
        if (this.notifications.length > 50) {
            this.notifications.pop();
        }
    }
    
    // ==================== TOAST NOTIFICATIONS ====================
    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast show ${type}`;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    // ==================== LOCAL STORAGE ====================
    saveToLocalStorage() {
        const data = {
            user: this.user,
            wallet: this.wallet,
            transactions: this.transactions,
            goals: this.goals,
            challenges: this.challenges,
            parentTasks: this.parentTasks,
            notifications: this.notifications
        };
        
        localStorage.setItem('vaultedData', JSON.stringify(data));
    }
    
    loadFromLocalStorage() {
        const data = localStorage.getItem('vaultedData');
        if (data) {
            const parsed = JSON.parse(data);
            this.user = parsed.user || this.user;
            this.wallet = parsed.wallet || this.wallet;
            this.transactions = parsed.transactions || [];
            this.goals = parsed.goals || [];
            this.challenges = parsed.challenges || [];
            this.parentTasks = parsed.parentTasks || [];
            this.notifications = parsed.notifications || [];
        }
        
        // Load preferences
        const darkMode = localStorage.getItem('darkMode') === 'true';
        if (darkMode) {
            document.body.classList.add('dark-mode');
            const darkModeCheckbox = document.getElementById('darkMode');
            if (darkModeCheckbox) {
                darkModeCheckbox.checked = true;
            }
        }
        
        // Update user display
        document.getElementById('userName').textContent = this.user.name;
        document.getElementById('userEmail').textContent = this.user.email;
    }
}

// ==================== GLOBAL FUNCTIONS ====================
let app;

function showPage(pageName) {
    app.showPage(pageName);
}

function updateWallet() {
    app.updateWallet();
}

function addFunds() {
    app.addFunds();
}

function transferFunds() {
    app.transferFunds();
}

function addTransaction() {
    app.addTransaction();
}

function addGoal() {
    app.addGoal();
}

function generateMonthlyReport() {
    app.generateMonthlyReport();
}

function switchTab(tabName) {
    app.switchTab(tabName);
}

function calculateInterest() {
    app.calculateInterest();
}

function calculateHabitCost() {
    app.calculateHabitCost();
}

function inviteFriend() {
    app.inviteFriend();
}

function createParentTask() {
    app.createParentTask();
}

function saveSettings() {
    app.saveSettings();
}

function savePreferences() {
    app.savePreferences();
}

function exportData() {
    app.exportData();
}

function exportCSV() {
    app.exportCSV();
}

function resetData() {
    app.resetData();
}

function closeModal() {
    document.getElementById('reportModal').classList.remove('show');
}

// ==================== INITIALIZE APP ====================
document.addEventListener('DOMContentLoaded', () => {
    app = new VaultEdApp();
});

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
        showAuthToast('Please fill in all fields', 'error');
        return;
    }
    
    // Simulate login
    localStorage.setItem('vaultedLoggedIn', 'true');
    localStorage.setItem('vaultedUserEmail', email);
    localStorage.setItem('vaultedUserName', email.split('@')[0]);
    
    if (rememberMe) {
        localStorage.setItem('vaultedRememberMe', 'true');
    }
    
    showAuthToast('Login successful! Welcome back!', 'success');
    
    setTimeout(() => {
        document.getElementById('authContainer').classList.add('hidden');
        document.getElementById('appContainer').classList.remove('hidden');
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';
        
        if (app) {
            app.user.email = email;
            app.user.name = localStorage.getItem('vaultedUserName');
            app.updateDashboard();
        }
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
    
    if (!name || !email || !password || !confirm) {
        showAuthToast('Please fill in all fields', 'error');
        return;
    }
    
    if (password !== confirm) {
        showAuthToast('Passwords do not match', 'error');
        return;
    }
    
    if (password.length < 6) {
        showAuthToast('Password must be at least 6 characters', 'error');
        return;
    }
    
    if (!agreeTerms) {
        showAuthToast('Please agree to the Terms of Service', 'error');
        return;
    }
    
    // Simulate signup
    localStorage.setItem('vaultedLoggedIn', 'true');
    localStorage.setItem('vaultedUserEmail', email);
    localStorage.setItem('vaultedUserName', name);
    localStorage.setItem('vaultedAccountType', accountType);
    
    showAuthToast('Account created successfully! Welcome to Vault-Ed!', 'success');
    
    setTimeout(() => {
        document.getElementById('authContainer').classList.add('hidden');
        document.getElementById('appContainer').classList.remove('hidden');
        
        document.getElementById('signupName').value = '';
        document.getElementById('signupEmail').value = '';
        document.getElementById('signupPassword').value = '';
        document.getElementById('signupConfirm').value = '';
        document.getElementById('agreeTerms').checked = false;
        
        if (app) {
            app.user.email = email;
            app.user.name = name;
            app.updateDashboard();
        }
    }, 1500);
}

function showAuthToast(message, type = 'info') {
    let toast = document.getElementById('authToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'authToast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
