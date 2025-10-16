// ========================================
// GRIDIRON INTEL - STANDALONE AUTH SYSTEM
// No Backend Required - Works Offline
// ========================================

// DEV MASTER ACCOUNT
const DEV_ACCOUNTS = {
    master: {
        email: 'admin@gridironintel.com',
        password: 'GridironDev2024!',
        name: 'Dev Admin',
        role: 'master_admin',
        team_name: 'Gridiron Development',
        school_name: 'Dev Testing School'
    },
    coach: {
        email: 'coach@demo.com',
        password: 'Coach123!',
        name: 'Coach Demo',
        role: 'head_coach',
        team_name: 'Demo Eagles',
        school_name: 'Demo High School'
    }
};

// Simulated Database (localStorage)
const DATABASE = {
    users: [],
    
    init() {
        // Load existing users from localStorage
        const stored = localStorage.getItem('gridiron_users');
        if (stored) {
            this.users = JSON.parse(stored);
        } else {
            // Initialize with dev accounts
            this.users = [
                {
                    id: 1,
                    email: DEV_ACCOUNTS.master.email,
                    password: this.hashPassword(DEV_ACCOUNTS.master.password),
                    name: DEV_ACCOUNTS.master.name,
                    role: DEV_ACCOUNTS.master.role,
                    team_name: DEV_ACCOUNTS.master.team_name,
                    school_name: DEV_ACCOUNTS.master.school_name,
                    created_at: new Date().toISOString()
                },
                {
                    id: 2,
                    email: DEV_ACCOUNTS.coach.email,
                    password: this.hashPassword(DEV_ACCOUNTS.coach.password),
                    name: DEV_ACCOUNTS.coach.name,
                    role: DEV_ACCOUNTS.coach.role,
                    team_name: DEV_ACCOUNTS.coach.team_name,
                    school_name: DEV_ACCOUNTS.coach.school_name,
                    created_at: new Date().toISOString()
                }
            ];
            this.save();
        }
    },
    
    save() {
        localStorage.setItem('gridiron_users', JSON.stringify(this.users));
    },
    
    hashPassword(password) {
        // Simple hash for demo (in production, use bcrypt on backend)
        return btoa(password);
    },
    
    verifyPassword(password, hash) {
        return this.hashPassword(password) === hash;
    },
    
    findUserByEmail(email) {
        return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    },
    
    createUser(userData) {
        const newUser = {
            id: this.users.length + 1,
            ...userData,
            password: this.hashPassword(userData.password),
            created_at: new Date().toISOString()
        };
        this.users.push(newUser);
        this.save();
        return newUser;
    }
};

// Initialize database
DATABASE.init();

// ========================================
// SESSION MANAGEMENT
// ========================================

const SESSION = {
    currentUser: null,
    
    init() {
        const token = localStorage.getItem('gridiron_token');
        const userStr = localStorage.getItem('gridiron_user');
        
        if (token && userStr) {
            this.currentUser = JSON.parse(userStr);
            this.updateUI();
        }
    },
    
    login(user) {
        // Create session
        const token = 'token_' + Date.now() + '_' + Math.random();
        const userInfo = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            team_name: user.team_name,
            school_name: user.school_name
        };
        
        localStorage.setItem('gridiron_token', token);
        localStorage.setItem('gridiron_user', JSON.stringify(userInfo));
        
        this.currentUser = userInfo;
        this.updateUI();
        
        return { token, userInfo };
    },
    
    logout() {
        localStorage.removeItem('gridiron_token');
        localStorage.removeItem('gridiron_user');
        this.currentUser = null;
        window.location.reload();
    },
    
    updateUI() {
        if (this.currentUser) {
            const navLinks = document.querySelector('.nav-links');
            const loginBtn = navLinks.querySelector('.btn-nav');
            
            if (loginBtn) {
                // Change login button to user info
                loginBtn.innerHTML = `
                    <i class="fas fa-user-circle"></i> 
                    ${this.currentUser.name}
                `;
                loginBtn.onclick = () => this.showUserMenu();
                
                // Add logout button if not exists
                if (!document.getElementById('logoutBtn')) {
                    const logoutBtn = document.createElement('button');
                    logoutBtn.id = 'logoutBtn';
                    logoutBtn.className = 'btn-nav-secondary';
                    logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i>';
                    logoutBtn.onclick = () => {
                        if (confirm('Are you sure you want to logout?')) {
                            this.logout();
                        }
                    };
                    navLinks.appendChild(logoutBtn);
                }
            }
        }
    },
    
    showUserMenu() {
        alert(`
            👤 Logged in as: ${this.currentUser.name}
            📧 Email: ${this.currentUser.email}
            🎓 School: ${this.currentUser.school_name}
            🏈 Team: ${this.currentUser.team_name}
            👔 Role: ${this.currentUser.role}
            
            In production, this would open your dashboard.
        `);
    }
};

// ========================================
// MODAL FUNCTIONS
// ========================================

function openLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Show dev account info
    showDevAccountInfo();
}

function openSignupModal() {
    document.getElementById('loginModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    const signupTab = document.querySelectorAll('.auth-tab')[1];
    switchTab('signup', signupTab);
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    clearForms();
}

function switchTab(tab, element) {
    // Update tab buttons
    document.querySelectorAll('.auth-tab').forEach(t => {
        t.classList.remove('active');
    });
    element.classList.add('active');
    
    // Update forms
    document.querySelectorAll('.auth-form').forEach(f => {
        f.classList.remove('active');
    });
    
    if (tab === 'login') {
        document.getElementById('loginForm').classList.add('active');
        showDevAccountInfo();
    } else {
        document.getElementById('signupForm').classList.add('active');
        hideDevAccountInfo();
    }
    
    // Clear messages
    clearMessages();
}

function showDevAccountInfo() {
    // Remove existing dev info if any
    hideDevAccountInfo();
    
    // Add dev account info box
    const loginForm = document.getElementById('loginForm');
    const devInfo = document.createElement('div');
    devInfo.id = 'devAccountInfo';
    devInfo.className = 'dev-info-box';
    devInfo.innerHTML = `
        <div style="background: rgba(22, 163, 74, 0.1); border: 1px solid #16a34a; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h4 style="color: #16a34a; margin: 0 0 10px 0;">🔑 Dev Master Account</h4>
            <p style="margin: 5px 0; color: #cbd5e1; font-size: 14px;">
                <strong>Email:</strong> admin@gridironintel.com<br>
                <strong>Password:</strong> GridironDev2024!
            </p>
            <button onclick="fillDevCredentials()" style="
                background: #16a34a;
                color: white;
                border: none;
                padding: 8px 15px;
                border-radius: 5px;
                cursor: pointer;
                margin-top: 10px;
                font-size: 14px;
            ">Auto-Fill Dev Credentials</button>
        </div>
    `;
    loginForm.insertBefore(devInfo, loginForm.firstChild);
}

function hideDevAccountInfo() {
    const devInfo = document.getElementById('devAccountInfo');
    if (devInfo) {
        devInfo.remove();
    }
}

function fillDevCredentials() {
    document.getElementById('loginEmail').value = DEV_ACCOUNTS.master.email;
    document.getElementById('loginPassword').value = DEV_ACCOUNTS.master.password;
}

// ========================================
// AUTHENTICATION HANDLERS
// ========================================

async function handleLogin(event) {
    event.preventDefault();
    clearMessages();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Show loading
    const loginBtn = document.getElementById('loginBtn');
    const btnText = loginBtn.querySelector('.btn-text');
    const btnLoader = loginBtn.querySelector('.btn-loader');
    
    loginBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline';
    
    // Simulate network delay for realism
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
        // Find user
        const user = DATABASE.findUserByEmail(email);
        
        if (!user) {
            throw new Error('No account found with this email');
        }
        
        // Verify password
        if (!DATABASE.verifyPassword(password, user.password)) {
            throw new Error('Invalid password');
        }
        
        // Login successful
        const session = SESSION.login(user);
        
        // Show success
        showSuccess('loginSuccess', `Welcome back, ${user.name}! Redirecting...`);
        
        // Close modal after delay
        setTimeout(() => {
            closeLoginModal();
            
            // Show dashboard preview
            if (user.role === 'master_admin') {
                alert(`
                    🎉 MASTER ADMIN LOGIN SUCCESSFUL!
                    
                    You now have access to:
                    ✅ All coach accounts
                    ✅ System administration
                    ✅ Database management
                    ✅ Full API access
                    
                    This is a demo. In production, you'd be redirected to the admin dashboard.
                `);
            } else {
                alert(`
                    ✅ Login Successful!
                    
                    Welcome back, ${user.name}!
                    Team: ${user.team_name}
                    
                    In production, you'd be redirected to your coach dashboard.
                `);
            }
        }, 2000);
        
    } catch (error) {
        showError('loginError', error.message);
    } finally {
        // Reset button
        loginBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
    }
}

async function handleSignup(event) {
    event.preventDefault();
    clearMessages();
    
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const schoolName = document.getElementById('schoolName').value.trim();
    const teamName = document.getElementById('teamName').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validation
    if (password !== confirmPassword) {
        showError('signupError', 'Passwords do not match!');
        return;
    }
    
    if (password.length < 8) {
        showError('signupError', 'Password must be at least 8 characters!');
        return;
    }
    
    // Check if email exists
    if (DATABASE.findUserByEmail(email)) {
        showError('signupError', 'An account with this email already exists!');
        return;
    }
    
    // Show loading
    const signupBtn = document.getElementById('signupBtn');
    const btnText = signupBtn.querySelector('.btn-text');
    const btnLoader = signupBtn.querySelector('.btn-loader');
    
    signupBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline';
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
        // Create account
        const newUser = DATABASE.createUser({
            email: email,
            password: password,
            name: `${firstName} ${lastName}`,
            role: 'head_coach',
            team_name: teamName,
            school_name: schoolName
        });
        
        // Auto-login
        SESSION.login(newUser);
        
        // Show success
        showSuccess('signupSuccess', `
            Account created successfully!<br>
            Welcome to Gridiron Intel, Coach ${lastName}!
        `);
        
        // Clear form
        clearForms();
        
        // Close modal after delay
// In your handleLogin function, change the redirect:
setTimeout(() => {
    closeLoginModal();
    // Redirect to dashboard
    window.location.href = 'dashboard.html';
}, 2000);
        
                🎉 Account Created Successfully!
                
                Coach: ${firstName} ${lastName}
                Email: ${email}
                School: ${schoolName}
                Team: ${teamName}
                
                You are now logged in. In production, you'd be redirected to setup your team.
            `);
        }, 2500);
        
    } catch (error) {
        showError('signupError', 'Failed to create account. Please try again.');
    } finally {
        signupBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
    }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function showError(elementId, message) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
    }
}

function showSuccess(elementId, message) {
    const successEl = document.getElementById(elementId);
    if (successEl) {
        successEl.innerHTML = message;
        successEl.style.display = 'block';
    }
}

function clearMessages() {
    document.querySelectorAll('.error-message, .success-message').forEach(msg => {
        msg.style.display = 'none';
    });
}

function clearForms() {
    document.querySelectorAll('input').forEach(input => {
        if (input.type !== 'checkbox') {
            input.value = '';
        } else {
            input.checked = false;
        }
    });
    clearMessages();
}

function showForgotPassword() {
    const email = prompt('Enter your email address for password reset:');
    
    if (email) {
        const user = DATABASE.findUserByEmail(email);
        if (user) {
            alert(`
                Password Reset Email Sent!
                
                A reset link has been sent to: ${email}
                
                (This is a demo. In production, an actual email would be sent)
                
                For testing, your current password is stored locally.
            `);
        } else {
            alert('If an account exists with this email, you will receive reset instructions.');
        }
    }
}

function toggleMobileMenu() {
    console.log('Mobile menu toggled');
}

// Close modal on outside click
window.onclick = function(event) {
    const modal = document.getElementById('loginModal');
    if (event.target === modal) {
        closeLoginModal();
    }
}

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log(`
%c🏈 GRIDIRON INTEL - AUTH SYSTEM READY 🏈

%c✅ STANDALONE MODE - No Backend Required
✅ Dev Master Account Available
✅ All data stored locally

📧 Master Account:
   Email: admin@gridironintel.com
   Password: GridironDev2024!

📧 Demo Coach Account:
   Email: coach@demo.com
   Password: Coach123!

💡 You can also create new accounts with the signup form!

`, 
    'color: #16a34a; font-size: 20px; font-weight: bold; background: #0f172a; padding: 10px;',
    'color: #94a3b8; font-size: 14px;'
    );
    
    // Initialize session
    SESSION.init();
    
    // Show current users in console (dev mode)
    console.log('Current registered users:', DATABASE.users.map(u => ({
        email: u.email,
        name: u.name,
        role: u.role
    })));
});

// ========================================
// ADMIN FUNCTIONS (for dev account)
// ========================================

// Add these to window for console access
window.GRIDIRON_ADMIN = {
    // View all users
    listUsers() {
        console.table(DATABASE.users.map(u => ({
            id: u.id,
            email: u.email,
            name: u.name,
            role: u.role,
            team: u.team_name
        })));
    },
    
    // Clear all data
    resetDatabase() {
        if (confirm('This will delete all users except dev accounts. Continue?')) {
            localStorage.removeItem('gridiron_users');
            DATABASE.init();
            console.log('Database reset complete');
            window.location.reload();
        }
    },
    
    // Add test users
    addTestUsers(count = 5) {
        for (let i = 1; i <= count; i++) {
            DATABASE.createUser({
                email: `coach${i}@test.com`,
                password: 'Test123!',
                name: `Test Coach ${i}`,
                role: 'head_coach',
                team_name: `Test Team ${i}`,
                school_name: `Test School ${i}`
            });
        }
        console.log(`Added ${count} test users`);
        this.listUsers();
    }
};

console.log(`
%c💡 Admin Tools Available in Console:

GRIDIRON_ADMIN.listUsers()     - View all users
GRIDIRON_ADMIN.addTestUsers(5) - Add test users  
GRIDIRON_ADMIN.resetDatabase() - Reset to default

`, 'color: #60a5fa; font-weight: bold;');
