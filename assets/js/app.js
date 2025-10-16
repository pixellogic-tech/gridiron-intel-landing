// ========================================
// GRIDIRON INTEL - Complete Auth System
// ========================================

// API Configuration - CHANGE THIS TO YOUR ACTUAL API
// For testing without backend, we'll use mock responses
const USE_MOCK_API = true; // Set to false when you have real backend
const API_URL = 'http://localhost:8000'; // Change to your real API URL

// ========================================
// MODAL FUNCTIONS
// ========================================

function openLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
    // Reset to login tab
    switchTab('login', document.querySelector('.auth-tab'));
}

function openSignupModal() {
    document.getElementById('loginModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
    // Switch to signup tab
    const signupTab = document.querySelectorAll('.auth-tab')[1];
    switchTab('signup', signupTab);
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    clearForms();
}

// Tab Switching
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
    } else {
        document.getElementById('signupForm').classList.add('active');
    }
    
    // Clear any error messages
    document.querySelectorAll('.error-message, .success-message').forEach(msg => {
        msg.style.display = 'none';
    });
}

// ========================================
// AUTHENTICATION FUNCTIONS
// ========================================

async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Show loading
    const loginBtn = document.getElementById('loginBtn');
    loginBtn.disabled = true;
    loginBtn.querySelector('.btn-text').style.display = 'none';
    loginBtn.querySelector('.btn-loader').style.display = 'inline';
    
    // Hide previous messages
    document.getElementById('loginError').style.display = 'none';
    document.getElementById('loginSuccess').style.display = 'none';
    
    try {
        let data;
        
        if (USE_MOCK_API) {
            // Mock successful login for testing
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
            
            data = {
                access_token: 'mock_token_' + Date.now(),
                user_info: {
                    name: 'Coach Demo',
                    email: email,
                    role: 'head_coach',
                    team_name: 'Demo Eagles',
                    school_name: 'Demo High School'
                },
                redirect_url: '#coach-dashboard'
            };
        } else {
            // Real API call
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    remember_me: rememberMe
                })
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Login failed');
            }
            
            data = await response.json();
        }
        
        // Store tokens
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('user_info', JSON.stringify(data.user_info));
        
        // Show success message
        const successMsg = document.getElementById('loginSuccess');
        successMsg.textContent = `Welcome back, ${data.user_info.name}! Redirecting...`;
        successMsg.style.display = 'block';
        
        // Update UI
        updateUIForLoggedInUser(data.user_info);
        
        // Close modal after delay
        setTimeout(() => {
            closeLoginModal();
            // In real app, redirect to: window.location.href = data.redirect_url;
            alert('Login successful! In production, you would be redirected to the coach dashboard.');
        }, 2000);
        
    } catch (error) {
        console.error('Login error:', error);
        const errorMsg = document.getElementById('loginError');
        
        if (USE_MOCK_API) {
            errorMsg.textContent = 'Mock API is enabled. In production, this would connect to your real backend.';
        } else {
            errorMsg.textContent = error.message || 'Connection error. Please check your internet and try again.';
        }
        errorMsg.style.display = 'block';
    } finally {
        // Reset button
        loginBtn.disabled = false;
        loginBtn.querySelector('.btn-text').style.display = 'inline';
        loginBtn.querySelector('.btn-loader').style.display = 'none';
    }
}

async function handleSignup(event) {
    event.preventDefault();
    
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('signupEmail').value;
    const schoolName = document.getElementById('schoolName').value;
    const teamName = document.getElementById('teamName').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Hide previous messages
    document.getElementById('signupError').style.display = 'none';
    document.getElementById('signupSuccess').style.display = 'none';
    
    // Validate passwords match
    if (password !== confirmPassword) {
        const errorMsg = document.getElementById('signupError');
        errorMsg.textContent = 'Passwords do not match!';
        errorMsg.style.display = 'block';
        return;
    }
    
    // Validate password length
    if (password.length < 8) {
        const errorMsg = document.getElementById('signupError');
        errorMsg.textContent = 'Password must be at least 8 characters!';
        errorMsg.style.display = 'block';
        return;
    }
    
    // Show loading
    const signupBtn = document.getElementById('signupBtn');
    signupBtn.disabled = true;
    signupBtn.querySelector('.btn-text').style.display = 'none';
    signupBtn.querySelector('.btn-loader').style.display = 'inline';
    
    try {
        let data;
        
        if (USE_MOCK_API) {
            // Mock successful signup for testing
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
            
            data = {
                message: 'Account created successfully',
                access_token: 'mock_token_' + Date.now(),
                user_id: Math.floor(Math.random() * 1000),
                team_id: Math.floor(Math.random() * 100),
                redirect_url: '#coach-onboarding'
            };
        } else {
            // Real API call
            const response = await fetch(`${API_URL}/api/auth/signup/coach`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    school_name: schoolName,
                    team_name: teamName,
                    password: password
                })
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Signup failed');
            }
            
            data = await response.json();
        }
        
        // Store token
        localStorage.setItem('access_token', data.access_token);
        
        // Show success
        const successMsg = document.getElementById('signupSuccess');
        successMsg.innerHTML = `
            <strong>✅ Account created successfully!</strong><br>
            Welcome to Gridiron Intel, Coach ${lastName}!<br>
            <small>Redirecting to setup...</small>
        `;
        successMsg.style.display = 'block';
        
        // Clear form
        clearForms();
        
        // Redirect after delay
        setTimeout(() => {
            closeLoginModal();
            // In real app: window.location.href = data.redirect_url;
            alert(`
                Signup successful! 
                
                Your account details:
                - Name: ${firstName} ${lastName}
                - Email: ${email}
                - School: ${schoolName}
                - Team: ${teamName}
                
                In production, you would be redirected to complete your team setup.
            `);
        }, 3000);
        
    } catch (error) {
        console.error('Signup error:', error);
        const errorMsg = document.getElementById('signupError');
        
        if (USE_MOCK_API) {
            errorMsg.textContent = 'Mock API is enabled. Your account would be created with a real backend.';
        } else {
            errorMsg.textContent = error.message || 'Connection error. Please check your internet and try again.';
        }
        errorMsg.style.display = 'block';
    } finally {
        // Reset button
        signupBtn.disabled = false;
        signupBtn.querySelector('.btn-text').style.display = 'inline';
        signupBtn.querySelector('.btn-loader').style.display = 'none';
    }
}

// ========================================
// UI UPDATE FUNCTIONS
// ========================================

function updateUIForLoggedInUser(userData) {
    const navLinks = document.querySelector('.nav-links');
    const loginBtn = navLinks.querySelector('.btn-nav');
    
    if (loginBtn && userData) {
        loginBtn.innerHTML = `
            <i class="fas fa-user"></i> 
            ${userData.name || userData.email.split('@')[0]}
        `;
        loginBtn.onclick = () => {
            alert('You are logged in! Dashboard access would be here.');
        };
    }
}

function clearForms() {
    document.querySelectorAll('input').forEach(input => {
        if (input.type !== 'checkbox') {
            input.value = '';
        } else {
            input.checked = false;
        }
    });
    
    document.querySelectorAll('.error-message, .success-message').forEach(msg => {
        msg.style.display = 'none';
    });
}

// ========================================
// OTHER FUNCTIONS
// ========================================

function showForgotPassword() {
    const email = prompt('Enter your email address for password reset:');
    
    if (email) {
        if (USE_MOCK_API) {
            alert('Password reset link sent! (This is a demo - no actual email was sent)');
        } else {
            fetch(`${API_URL}/api/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email })
            })
            .then(response => response.json())
            .then(data => {
                alert('If an account exists with this email, you will receive password reset instructions.');
            })
            .catch(error => {
                alert('Error sending reset email. Please try again.');
            });
        }
    }
}

function toggleMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    navToggle.classList.toggle('active');
    // Add mobile menu functionality here if needed
}

// Close modal when clicking outside
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
    console.log('Gridiron Intel Landing Page Loaded');
    console.log('Mock API Mode:', USE_MOCK_API);
    
    if (USE_MOCK_API) {
        console.log('📌 Running in DEMO mode - no backend required');
        console.log('📌 To connect to real backend, set USE_MOCK_API = false in app.js');
    }
    
    // Check if user is logged in
    const token = localStorage.getItem('access_token');
    if (token) {
        const userInfo = localStorage.getItem('user_info');
        if (userInfo) {
            updateUIForLoggedInUser(JSON.parse(userInfo));
        }
    }
});

// ========================================
// DEMO MESSAGE
// ========================================

console.log(`
%c🏈 GRIDIRON INTEL 🏈
%cAuthentication System Ready!

Current Mode: ${USE_MOCK_API ? 'DEMO (No backend needed)' : 'PRODUCTION (Requires backend)'}

To test:
1. Click "Coach Login" or "Sign Up as Coach"
2. Enter any email/password (in demo mode)
3. See the mock responses

To connect to real backend:
1. Set USE_MOCK_API = false in app.js
2. Update API_URL to your backend address
3. Make sure your backend is running

`, 'color: #16a34a; font-size: 20px; font-weight: bold;', 'color: #94a3b8; font-size: 14px;');
